import React, { createContext, useContext, useReducer, useCallback } from 'react';
import type { SceneState, SceneLayout, SceneSetting, SceneBackground } from '@/types/scene';
import type { Product } from '@/types/product';
import type { UIDirective } from '@/types/agent';
import { useGenerativeBackground } from '@/hooks/useGenerativeBackground';

interface SceneContextValue {
  scene: SceneState;
  transitionTo: (layout: SceneLayout, products?: Product[]) => void;
  setBackground: (background: SceneBackground) => void;
  setSetting: (setting: SceneSetting) => void;
  processUIDirective: (directive: UIDirective) => Promise<void>;
  openCheckout: () => void;
  closeCheckout: () => void;
  resetScene: () => void;
}

const initialScene: SceneState = {
  layout: 'conversation-centered',
  setting: 'neutral',
  background: {
    type: 'gradient',
    value: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
  },
  chatPosition: 'center',
  products: [],
  checkoutActive: false,
  transitionKey: 'initial',
};

type SceneAction =
  | { type: 'TRANSITION_LAYOUT'; layout: SceneLayout; products?: Product[] }
  | { type: 'SET_BACKGROUND'; background: SceneBackground }
  | { type: 'SET_SETTING'; setting: SceneSetting }
  | { type: 'SET_PRODUCTS'; products: Product[] }
  | { type: 'OPEN_CHECKOUT' }
  | { type: 'CLOSE_CHECKOUT' }
  | { type: 'RESET' };

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
    case 'RESET':
      return initialScene;
    default:
      return state;
  }
}

const SceneContext = createContext<SceneContextValue | null>(null);

export const SceneProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [scene, dispatch] = useReducer(sceneReducer, initialScene);
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
        
        if (payload.sceneContext) {
          dispatch({ type: 'SET_SETTING', setting: payload.sceneContext.setting });
          
          if (payload.sceneContext.generateBackground) {
            dispatch({
              type: 'SET_BACKGROUND',
              background: { type: 'generative', value: '', isLoading: true },
            });
            
            try {
              const imageUrl = await generateBackground(
                payload.sceneContext.setting,
                payload.products || []
              );
              
              dispatch({
                type: 'SET_BACKGROUND',
                background: { type: 'image', value: imageUrl },
              });
            } catch (error) {
              console.error('Background generation failed:', error);
              dispatch({
                type: 'SET_BACKGROUND',
                background: {
                  type: 'gradient',
                  value: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
                },
              });
            }
          }
        }
        break;
      }
      
      case 'INITIATE_CHECKOUT':
        dispatch({ type: 'OPEN_CHECKOUT' });
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

  const resetScene = useCallback(() => {
    dispatch({ type: 'RESET' });
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
        resetScene,
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
