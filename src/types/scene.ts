export type SceneLayout = 
  | 'conversation-centered'
  | 'product-hero'
  | 'product-grid'
  | 'checkout';

export type SceneSetting = 
  | 'neutral'
  | 'bathroom'
  | 'travel'
  | 'outdoor'
  | 'lifestyle';

export interface SceneBackground {
  type: 'gradient' | 'image' | 'generative';
  value: string;
  generationPrompt?: string;
  isLoading?: boolean;
}

export interface SceneState {
  layout: SceneLayout;
  setting: SceneSetting;
  background: SceneBackground;
  chatPosition: 'center' | 'bottom' | 'minimized';
  products: import('./product').Product[];
  checkoutActive: boolean;
  transitionKey: string;
}

export interface SceneTransition {
  from: SceneLayout;
  to: SceneLayout;
  animation: 'fade' | 'morph' | 'slide-up' | 'expand';
  duration: number;
}
