export type SceneLayout =
  | 'conversation-centered'
  | 'product-hero'
  | 'product-grid'
  | 'checkout';

/** Well-known settings with fallback gradients. B2B — professional/industrial. */
export type KnownSceneSetting =
  | 'neutral'
  | 'warehouse'
  | 'factory'
  | 'lab'
  | 'office'
  | 'loading-dock'
  | 'cleanroom'
  | 'production-floor'
  | 'conference';

export type SceneSetting = KnownSceneSetting | (string & {});

export interface SceneBackground {
  type: 'gradient' | 'image' | 'generative';
  value: string;
  generationPrompt?: string;
  isLoading?: boolean;
}

export interface WelcomeData {
  message: string;
  subtext?: string;
}

export interface SceneState {
  layout: SceneLayout;
  setting: SceneSetting;
  background: SceneBackground;
  chatPosition: 'center' | 'bottom' | 'minimized';
  products: import('./product').Product[];
  checkoutActive: boolean;
  welcomeActive: boolean;
  welcomeData?: WelcomeData;
  transitionKey: string;
}

export interface SceneTransition {
  from: SceneLayout;
  to: SceneLayout;
  animation: 'fade' | 'morph' | 'slide-up' | 'expand';
  duration: number;
}
