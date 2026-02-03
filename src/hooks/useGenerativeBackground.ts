import { useCallback, useRef } from 'react';
import type { SceneSetting, KnownSceneSetting } from '@/types/scene';
import type { Product } from '@/types/product';

/**
 * Parts B2B — professional/industrial gradients.
 * Purple tones derived from Parts brand (#59285D).
 * Backgrounds are deliberately understated for B2B.
 */
const KNOWN_GRADIENTS: Record<KnownSceneSetting, string> = {
  neutral: 'linear-gradient(135deg, #1a1625 0%, #2d2240 50%, #1e1a2e 100%)',
  warehouse: 'linear-gradient(135deg, #2c2c36 0%, #3a3a48 50%, #28283a 100%)',
  factory: 'linear-gradient(135deg, #2a2a38 0%, #383848 50%, #2e2e40 100%)',
  lab: 'linear-gradient(135deg, #1e2a3a 0%, #2a3a4a 50%, #1a2838 100%)',
  office: 'linear-gradient(135deg, #242438 0%, #32324a 50%, #282840 100%)',
  'loading-dock': 'linear-gradient(135deg, #2e2e38 0%, #3c3c48 50%, #303040 100%)',
  cleanroom: 'linear-gradient(135deg, #1e2838 0%, #283848 50%, #1c2634 100%)',
  'production-floor': 'linear-gradient(135deg, #2c2c3a 0%, #3a3a4c 50%, #2a2a3c 100%)',
  conference: 'linear-gradient(135deg, #28243a 0%, #3a3450 50%, #2e2840 100%)',
};

/** Get fallback gradient for a setting. */
export function getFallbackGradient(setting: SceneSetting): string {
  return KNOWN_GRADIENTS[setting as KnownSceneSetting] || KNOWN_GRADIENTS.neutral;
}

/** @deprecated Use getFallbackGradient instead */
export const FALLBACK_GRADIENTS = KNOWN_GRADIENTS as Record<string, string>;

type ImageProvider = 'imagen' | 'firefly' | 'cms-only' | 'none';

function getProvider(): ImageProvider {
  return (import.meta.env.VITE_IMAGE_PROVIDER as ImageProvider) || 'none';
}

// B2B: image generation is almost never triggered — keep simple
const KNOWN_SETTINGS = new Set<string>([
  'neutral', 'warehouse', 'factory', 'lab', 'office',
  'loading-dock', 'cleanroom', 'production-floor', 'conference',
]);

/**
 * For B2B, we almost never generate images. Only truly novel/exotic prompts trigger generation.
 */
function isNovelPrompt(prompt: string, setting: SceneSetting): boolean {
  if (!KNOWN_SETTINGS.has(setting)) return true;
  // B2B rarely has novel prompts — only trigger for explicit exotic locations
  if (/\b(trade.?show|expo|convention.?center)\b/i.test(prompt)) return true;
  return false;
}

export interface BackgroundOptions {
  cmsAssetId?: string;
  cmsTag?: string;
  editMode?: boolean;
  editPrompt?: string;
  backgroundPrompt?: string;
  sceneAssetId?: string;
  imageUrl?: string;
  mood?: string;
  customerContext?: string;
  sceneType?: string;
}

export function useGenerativeBackground() {
  const cacheRef = useRef<Record<string, string>>({});

  const generateBackground = useCallback(
    async (setting: SceneSetting, products: Product[], options?: BackgroundOptions): Promise<string> => {
      const enabled = import.meta.env.VITE_ENABLE_GENERATIVE_BACKGROUNDS === 'true';

      const prompt = options?.backgroundPrompt || options?.editPrompt;
      const cacheKey = prompt
        ? `${setting}-prompt-${prompt.substring(0, 60)}`
        : options?.cmsAssetId || options?.cmsTag || setting;

      const hasPrompt = !!options?.backgroundPrompt;
      const isNovel = hasPrompt && isNovelPrompt(options!.backgroundPrompt!, setting);

      if (cacheRef.current[cacheKey]) {
        return cacheRef.current[cacheKey];
      }

      // Agent-provided imageUrl
      if (options?.imageUrl) {
        console.log('[bg] Using agent-provided imageUrl for', setting);
        cacheRef.current[cacheKey] = options.imageUrl;
        return options.imageUrl;
      }

      // Scene registry lookup
      if (options?.sceneAssetId) {
        try {
          const { recordSceneUsage } = await import('@/services/sceneRegistry/client');
          const { getAgentforceClient } = await import('@/services/agentforce/client');
          const token = await getAgentforceClient().getAccessToken();
          await recordSceneUsage(options.sceneAssetId, token);
        } catch { /* best-effort */ }
      }

      if (!options?.editMode) {
        try {
          const { findSceneAsset } = await import('@/services/sceneRegistry/client');
          const { getAgentforceClient } = await import('@/services/agentforce/client');
          const token = await getAgentforceClient().getAccessToken();
          const match = await findSceneAsset(
            { setting, mood: options?.mood, customerContext: options?.customerContext, sceneType: options?.sceneType },
            token
          );
          if (match?.imageUrl) {
            const isReal = match.imageUrl.startsWith('http') || match.imageUrl.startsWith('blob:');
            if (isReal) {
              cacheRef.current[cacheKey] = match.imageUrl;
              await import('@/services/sceneRegistry/client').then(m => m.recordSceneUsage(match.id, token)).catch(() => {});
              return match.imageUrl;
            }
          }
        } catch (err) {
          console.warn('[bg] Scene registry lookup failed:', err);
        }
      }

      // Pre-seeded local backgrounds
      if (!options?.editMode && !isNovel) {
        const { findPreseeded, preseededExists } = await import('@/data/preseededBackgrounds');
        const preseeded = findPreseeded(setting);
        if (preseeded) {
          const exists = await preseededExists(preseeded);
          if (exists) {
            console.log('[bg] Using pre-seeded image for', setting);
            cacheRef.current[cacheKey] = preseeded.path;
            return preseeded.path;
          }
        }
      }

      // B2B default: prefer gradients over generation
      if (!enabled && !isNovel) {
        return getFallbackGradient(setting);
      }

      const provider = getProvider();
      let cmsImageUrl: string | null = null;

      // CMS lookup
      if (!isNovel) try {
        const { fetchCmsBackgroundEnhanced } = await import('@/services/cms/backgroundAssets');
        const { getAgentforceClient } = await import('@/services/agentforce/client');
        const token = await getAgentforceClient().getAccessToken();
        cmsImageUrl = await fetchCmsBackgroundEnhanced(
          { assetId: options?.cmsAssetId, tag: options?.cmsTag, setting },
          token
        );
        if (cmsImageUrl && !options?.editMode) {
          cacheRef.current[cacheKey] = cmsImageUrl;
          return cmsImageUrl;
        }
      } catch (err) {
        console.warn('CMS background lookup failed:', err);
      }

      if (provider === 'cms-only' || provider === 'none') {
        return cmsImageUrl || getFallbackGradient(setting);
      }

      // Image generation (rare for B2B)
      try {
        let imageUrl: string;

        let seedImage = cmsImageUrl;
        if (options?.editMode && !seedImage) {
          const { findPreseeded, preseededExists } = await import('@/data/preseededBackgrounds');
          const preseeded = findPreseeded(setting);
          if (preseeded && await preseededExists(preseeded)) {
            seedImage = preseeded.path;
          }
        }

        const NO_PRODUCTS_SUFFIX = ' Do not include any products, packages, or containers in the image. Scene only.';
        const rawPrompt = options?.backgroundPrompt || options?.editPrompt;
        const generationPrompt = rawPrompt ? rawPrompt + NO_PRODUCTS_SUFFIX : undefined;

        if (provider === 'imagen') {
          const { getImagenClient } = await import('@/services/imagen/client');
          const client = getImagenClient();
          if (options?.editMode && seedImage && generationPrompt) {
            imageUrl = await client.editSceneBackground(seedImage, generationPrompt);
          } else if (generationPrompt) {
            imageUrl = await client.generateFromPrompt(generationPrompt);
          } else {
            imageUrl = await client.generateSceneBackground(setting, products);
          }
        } else if (provider === 'firefly') {
          const { getFireflyClient } = await import('@/services/firefly/client');
          if (generationPrompt) {
            imageUrl = await getFireflyClient().generateFromPrompt(generationPrompt);
          } else {
            imageUrl = await getFireflyClient().generateSceneBackground(setting, products);
          }
        } else {
          return getFallbackGradient(setting);
        }

        cacheRef.current[cacheKey] = imageUrl;

        // Persist in background
        (async () => {
          try {
            const { getAgentforceClient } = await import('@/services/agentforce/client');
            const tok = await getAgentforceClient().getAccessToken();
            if (import.meta.env.VITE_CMS_CHANNEL_ID) {
              const { uploadImageToCmsAsync } = await import('@/services/cms/uploadAsset');
              uploadImageToCmsAsync(imageUrl, `Scene ${setting}`, [`scene-${setting}`], tok);
            }
            const { registerGeneratedScene } = await import('@/services/sceneRegistry/client');
            await registerGeneratedScene({
              setting,
              mood: options?.mood,
              customerContext: options?.customerContext,
              sceneType: options?.sceneType || 'product',
              prompt: options?.backgroundPrompt || options?.editPrompt || `Scene for ${setting}`,
              imageUrl,
              isEdited: !!options?.editMode,
            }, tok);
          } catch { /* best-effort */ }
        })();

        return imageUrl;
      } catch (error) {
        console.error(`Background generation failed (${provider}):`, error);
        return cmsImageUrl || getFallbackGradient(setting);
      }
    },
    []
  );

  return { generateBackground };
}
