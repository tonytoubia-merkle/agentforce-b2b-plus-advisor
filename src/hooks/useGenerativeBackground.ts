import { useCallback } from 'react';
import type { SceneSetting } from '@/types/scene';
import type { Product } from '@/types/product';

const FALLBACK_IMAGES: Record<SceneSetting, string> = {
  neutral: '/assets/fallback-backgrounds/neutral.jpg',
  bathroom: '/assets/fallback-backgrounds/bathroom-scene.jpg',
  travel: '/assets/fallback-backgrounds/travel-scene.jpg',
  outdoor: '/assets/fallback-backgrounds/outdoor-scene.jpg',
  lifestyle: '/assets/fallback-backgrounds/lifestyle-scene.jpg',
};

export function useGenerativeBackground() {
  const generateBackground = useCallback(
    async (setting: SceneSetting, _products: Product[]): Promise<string> => {
      const useGeneration = import.meta.env.VITE_ENABLE_GENERATIVE_BACKGROUNDS === 'true';

      if (!useGeneration) {
        return FALLBACK_IMAGES[setting] || FALLBACK_IMAGES.neutral;
      }

      try {
        const { getFireflyClient } = await import('@/services/firefly/client');
        const client = getFireflyClient();
        return await client.generateSceneBackground(setting, _products);
      } catch (error) {
        console.error('Background generation failed, using fallback:', error);
        return FALLBACK_IMAGES[setting] || FALLBACK_IMAGES.neutral;
      }
    },
    []
  );

  return { generateBackground };
}
