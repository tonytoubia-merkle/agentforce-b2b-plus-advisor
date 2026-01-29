export interface FireflyConfig {
  apiKey: string;
  baseUrl: string;
}

export interface GenerationOptions {
  width?: number;
  height?: number;
  style?: 'photorealistic' | 'artistic' | 'minimal';
  negativePrompt?: string;
}
