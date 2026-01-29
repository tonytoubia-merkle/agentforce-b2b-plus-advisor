import { SCENE_PROMPTS } from './prompts';
import type { SceneSetting } from '@/types/scene';
import type { Product } from '@/types/product';
import type { FireflyConfig, GenerationOptions } from './types';

export class FireflyClient {
  private config: FireflyConfig;

  constructor(config: FireflyConfig) {
    this.config = config;
  }

  async generateSceneBackground(
    setting: SceneSetting,
    products: Product[],
    options: GenerationOptions = {}
  ): Promise<string> {
    const {
      width = 1920,
      height = 1080,
      style = 'photorealistic',
    } = options;

    const basePrompt = SCENE_PROMPTS[setting];
    const productContext = this.buildProductContext(products);
    const fullPrompt = `${basePrompt}. ${productContext}. Professional product photography lighting, elegant and luxurious atmosphere, soft shadows, ${style} style.`;

    const response = await fetch(`${this.config.baseUrl}/v2/images/generate`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.config.apiKey}`,
        'Content-Type': 'application/json',
        'x-api-key': this.config.apiKey,
      },
      body: JSON.stringify({
        prompt: fullPrompt,
        negativePrompt: options.negativePrompt || 'text, watermark, logo, blurry, low quality',
        contentClass: 'photo',
        size: { width, height },
        n: 1,
      }),
    });

    if (!response.ok) {
      throw new Error(`Firefly generation failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data.outputs[0].image.url;
  }

  private buildProductContext(products: Product[]): string {
    if (products.length === 0) return '';
    const categories = [...new Set(products.map((p) => p.category))];
    return `Featuring ${categories.join(' and ')} products in an elegant arrangement`;
  }
}

let fireflyClient: FireflyClient | null = null;

export const getFireflyClient = (): FireflyClient => {
  if (!fireflyClient) {
    fireflyClient = new FireflyClient({
      apiKey: import.meta.env.VITE_FIREFLY_API_KEY || '',
      baseUrl: import.meta.env.VITE_FIREFLY_BASE_URL || 'https://firefly-api.adobe.io',
    });
  }
  return fireflyClient;
};
