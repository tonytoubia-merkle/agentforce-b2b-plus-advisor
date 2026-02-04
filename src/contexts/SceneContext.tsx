import React, { createContext, useContext, useReducer, useCallback, useRef } from 'react';
import type { SceneState, SceneLayout, SceneSetting, SceneBackground, WelcomeData } from '@/types/scene';
import type { Product } from '@/types/product';
import type { UIDirective } from '@/types/agent';
import { useGenerativeBackground, type BackgroundOptions } from '@/hooks/useGenerativeBackground';

/** Build BackgroundOptions from a UIDirective's sceneContext payload. */
function buildBgOptions(sc?: UIDirective['payload']['sceneContext']): BackgroundOptions {
  if (!sc) return {};
  const raw = sc as Record<string, unknown>;
  return {
    cmsAssetId: sc.cmsAssetId,
    cmsTag: sc.cmsTag,
    editMode: sc.editMode,
    backgroundPrompt: sc.backgroundPrompt,
    editPrompt: sc.editMode ? sc.backgroundPrompt : undefined,
    sceneAssetId: sc.sceneAssetId,
    imageUrl: sc.imageUrl,
    mood: raw.mood as string | undefined,
    customerContext: raw.customerContext as string | undefined,
    sceneType: raw.sceneType as string | undefined,
  };
}

/** Infer a scene setting from product categories for B2B materials. */
function inferSettingFromProducts(products: Product[]): SceneSetting {
  const categories = products.map((p) => (p.category || '').toLowerCase());
  const all = categories.join(' ');

  if (/purge|additive|masterbatch/i.test(all)) return 'production-floor';
  if (/sustainable|recycled|bio/i.test(all)) return 'lab';
  if (/high-performance|peek|engineered/i.test(all)) return 'cleanroom';
  if (/commodity|hdpe|pp\b|polypropylene/i.test(all)) return 'warehouse';
  if (/elastomer|tpu|tpv/i.test(all)) return 'factory';
  return 'neutral'; // default for B2B
}

export type SceneSnapshot = SceneState;

interface SceneContextValue {
  scene: SceneState;
  transitionTo: (layout: SceneLayout, products?: Product[]) => void;
  setBackground: (background: SceneBackground) => void;
  setSetting: (setting: SceneSetting) => void;
  processUIDirective: (directive: UIDirective) => Promise<void>;
  openCheckout: () => void;
  closeCheckout: () => void;
  dismissWelcome: () => void;
  resetScene: () => void;
  getSceneSnapshot: () => SceneSnapshot;
  restoreSceneSnapshot: (snapshot: SceneSnapshot) => void;
}

const initialScene: SceneState = {
  layout: 'conversation-centered',
  setting: 'neutral',
  background: {
    type: 'gradient',
    value: 'linear-gradient(135deg, #1a1625 0%, #2d2240 50%, #1e1a2e 100%)',
  },
  chatPosition: 'center',
  products: [],
  checkoutActive: false,
  welcomeActive: false,
  transitionKey: 'initial',
};

type SceneAction =
  | { type: 'TRANSITION_LAYOUT'; layout: SceneLayout; products?: Product[] }
  | { type: 'SET_BACKGROUND'; background: SceneBackground }
  | { type: 'SET_SETTING'; setting: SceneSetting }
  | { type: 'SET_PRODUCTS'; products: Product[] }
  | { type: 'OPEN_CHECKOUT' }
  | { type: 'CLOSE_CHECKOUT' }
  | { type: 'SHOW_WELCOME'; welcomeData: WelcomeData }
  | { type: 'DISMISS_WELCOME' }
  | { type: 'RESET' }
  | { type: 'RESTORE'; snapshot: SceneState };

function sceneReducer(state: SceneState, action: SceneAction): SceneState {
  switch (action.type) {
    case 'TRANSITION_LAYOUT': {
      const chatPosition = action.layout === 'conversation-centered'
        ? 'center'
        : action.layout === 'checkout'
          ? 'minimized'
          : 'bottom';

      return {
        ...state,
        layout: action.layout,
        chatPosition,
        products: action.products ?? state.products,
        transitionKey: `${action.layout}-${Date.now()}`,
      };
    }
    case 'SET_BACKGROUND':
      return { ...state, background: action.background };
    case 'SET_SETTING':
      return { ...state, setting: action.setting };
    case 'SET_PRODUCTS':
      return { ...state, products: action.products };
    case 'OPEN_CHECKOUT':
      return { ...state, checkoutActive: true, chatPosition: 'minimized' };
    case 'CLOSE_CHECKOUT':
      return { ...state, checkoutActive: false, chatPosition: 'bottom' };
    case 'SHOW_WELCOME':
      return { ...state, welcomeActive: true, welcomeData: action.welcomeData, layout: 'conversation-centered', chatPosition: 'center' };
    case 'DISMISS_WELCOME':
      return { ...state, welcomeActive: false, welcomeData: undefined };
    case 'RESET':
      return initialScene;
    case 'RESTORE':
      return action.snapshot;
    default:
      return state;
  }
}

const SceneContext = createContext<SceneContextValue | null>(null);

export const SceneProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [scene, dispatch] = useReducer(sceneReducer, initialScene);
  const sceneRef = useRef(scene);
  sceneRef.current = scene;
  const { generateBackground } = useGenerativeBackground();

  const transitionTo = useCallback((layout: SceneLayout, products?: Product[]) => {
    dispatch({ type: 'TRANSITION_LAYOUT', layout, products });
  }, []);

  const setBackground = useCallback((background: SceneBackground) => {
    dispatch({ type: 'SET_BACKGROUND', background });
  }, []);

  const setSetting = useCallback((setting: SceneSetting) => {
    dispatch({ type: 'SET_SETTING', setting });
  }, []);

  const processUIDirective = useCallback(async (directive: UIDirective) => {
    const { action, payload } = directive;

    switch (action) {
      case 'SHOW_PRODUCT':
      case 'SHOW_PRODUCTS': {
        if (payload.products && payload.products.length > 0) {
          const layout = payload.products.length === 1 ? 'product-hero' : 'product-grid';
          dispatch({ type: 'TRANSITION_LAYOUT', layout, products: payload.products });
        }

        const curBg = sceneRef.current;
        const hasExistingImage = curBg.background.type === 'image' && curBg.background.value;
        const agentExplicitSetting = payload.sceneContext?.setting;
        const setting: SceneSetting = agentExplicitSetting
          || (hasExistingImage ? curBg.setting : inferSettingFromProducts(payload.products || []));
        const shouldGenerate = payload.sceneContext?.generateBackground === true; // B2B: opt-in only

        const sceneCtx: UIDirective['payload']['sceneContext'] = payload.sceneContext || { setting };
        if (!sceneCtx.backgroundPrompt && payload.products?.length) {
          sceneCtx.backgroundPrompt = `A clean, professional ${setting} environment for industrial materials.`;
          sceneCtx.setting = setting;
        }

        const cur = sceneRef.current;
        const hasValidImage = cur.background.type === 'image' && cur.background.value && !cur.background.value.includes('default');
        const isGenerating = cur.background.type === 'generative' && cur.background.isLoading;
        const agentRequestedGeneration = payload.sceneContext?.generateBackground === true;
        // Preserve existing valid image unless agent explicitly requests regeneration
        const alreadyHasImage = (cur.setting === setting && (hasValidImage || isGenerating)) ||
          (hasValidImage && !agentRequestedGeneration);

        dispatch({ type: 'SET_SETTING', setting });

        if (shouldGenerate && !alreadyHasImage) {
          dispatch({
            type: 'SET_BACKGROUND',
            background: { type: 'generative', value: '', isLoading: true },
          });

          try {
            const result = await generateBackground(setting, payload.products || [], buildBgOptions(sceneCtx));
            const isGradient = result.startsWith('linear-gradient');
            dispatch({
              type: 'SET_BACKGROUND',
              background: { type: isGradient ? 'gradient' : 'image', value: result },
            });
          } catch (error) {
            console.error('Background generation failed:', error);
            dispatch({
              type: 'SET_BACKGROUND',
              background: {
                type: 'gradient',
                value: 'linear-gradient(135deg, #1a1625 0%, #2d2240 50%, #1e1a2e 100%)',
              },
            });
          }
        }
        break;
      }

      case 'CHANGE_SCENE': {
        const curForChange = sceneRef.current;
        const hasImageForChange = curForChange.background.type === 'image' && curForChange.background.value;
        const agentChangeSetting = payload.sceneContext?.setting;
        const sceneSetting: SceneSetting = agentChangeSetting
          || (hasImageForChange ? curForChange.setting : inferSettingFromProducts(payload.products || []));
        const shouldGen = payload.sceneContext?.generateBackground === true; // B2B: opt-in only

        const changeCtx: UIDirective['payload']['sceneContext'] = payload.sceneContext || { setting: sceneSetting };
        const agentProvidedPrompt = !!payload.sceneContext?.backgroundPrompt;
        if (!changeCtx.backgroundPrompt) {
          changeCtx.backgroundPrompt = `A professional ${sceneSetting} environment.`;
          changeCtx.setting = sceneSetting;
          changeCtx.generateBackground = false; // B2B: don't auto-generate
        }

        const curScene = sceneRef.current;
        const alreadyHasSceneImage = curScene.setting === sceneSetting && !agentProvidedPrompt && (
          (curScene.background.type === 'image' && curScene.background.value) ||
          (curScene.background.type === 'generative' && curScene.background.isLoading)
        );

        dispatch({ type: 'SET_SETTING', setting: sceneSetting });

        if (shouldGen && !alreadyHasSceneImage) {
          dispatch({
            type: 'SET_BACKGROUND',
            background: { type: 'generative', value: '', isLoading: true },
          });

          try {
            const result = await generateBackground(sceneSetting, payload.products || [], buildBgOptions(changeCtx));
            const isGradient = result.startsWith('linear-gradient');
            dispatch({
              type: 'SET_BACKGROUND',
              background: { type: isGradient ? 'gradient' : 'image', value: result },
            });
          } catch (error) {
            console.error('Background generation failed:', error);
            dispatch({
              type: 'SET_BACKGROUND',
              background: {
                type: 'gradient',
                value: 'linear-gradient(135deg, #1a1625 0%, #2d2240 50%, #1e1a2e 100%)',
              },
            });
          }
        }
        break;
      }

      case 'INITIATE_CHECKOUT':
        dispatch({ type: 'OPEN_CHECKOUT' });
        break;

      case 'CONFIRM_ORDER':
        dispatch({ type: 'CLOSE_CHECKOUT' });
        break;

      case 'WELCOME_SCENE': {
        dispatch({
          type: 'SHOW_WELCOME',
          welcomeData: {
            message: payload.welcomeMessage || 'Welcome to Parts Plus.',
            subtext: payload.welcomeSubtext,
          },
        });

        const welcomeSetting: SceneSetting = payload.sceneContext?.setting || 'neutral';
        // B2B: Only generate if explicitly requested
        const shouldGenWelcome = payload.sceneContext?.generateBackground === true;
        dispatch({ type: 'SET_SETTING', setting: welcomeSetting });

        if (shouldGenWelcome) {
          dispatch({
            type: 'SET_BACKGROUND',
            background: { type: 'generative', value: '', isLoading: true },
          });
          try {
            const result = await generateBackground(welcomeSetting, [], buildBgOptions(payload.sceneContext));
            const isGradient = result.startsWith('linear-gradient');
            dispatch({
              type: 'SET_BACKGROUND',
              background: { type: isGradient ? 'gradient' : 'image', value: result },
            });
          } catch (error) {
            console.error('Welcome background generation failed:', error);
            // Fall back to default background image
            dispatch({
              type: 'SET_BACKGROUND',
              background: { type: 'image', value: '/assets/backgrounds/default.png' },
            });
          }
        } else {
          // Use static default background for anonymous/appended customers
          // who shouldn't trigger image generation
          dispatch({
            type: 'SET_BACKGROUND',
            background: { type: 'image', value: '/assets/backgrounds/default.png' },
          });
        }
        break;
      }

      case 'SHOW_ORDER_STATUS':
      case 'SHOW_ACCOUNT_SUMMARY':
        // These are data-display actions — no scene change needed
        break;

      case 'RESET_SCENE':
        dispatch({ type: 'RESET' });
        break;
    }
  }, [generateBackground]);

  const openCheckout = useCallback(() => {
    dispatch({ type: 'OPEN_CHECKOUT' });
  }, []);

  const closeCheckout = useCallback(() => {
    dispatch({ type: 'CLOSE_CHECKOUT' });
  }, []);

  const dismissWelcome = useCallback(() => {
    dispatch({ type: 'DISMISS_WELCOME' });
  }, []);

  const resetScene = useCallback(() => {
    dispatch({ type: 'RESET' });
  }, []);

  const getSceneSnapshot = useCallback((): SceneSnapshot => {
    return { ...sceneRef.current };
  }, []);

  const restoreSceneSnapshot = useCallback((snapshot: SceneSnapshot) => {
    dispatch({ type: 'RESTORE', snapshot });
  }, []);

  return (
    <SceneContext.Provider
      value={{
        scene,
        transitionTo,
        setBackground,
        setSetting,
        processUIDirective,
        openCheckout,
        closeCheckout,
        dismissWelcome,
        resetScene,
        getSceneSnapshot,
        restoreSceneSnapshot,
      }}
    >
      {children}
    </SceneContext.Provider>
  );
};

export const useScene = (): SceneContextValue => {
  const context = useContext(SceneContext);
  if (!context) {
    throw new Error('useScene must be used within SceneProvider');
  }
  return context;
};
