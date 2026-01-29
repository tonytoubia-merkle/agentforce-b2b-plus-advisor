import type { Product } from './product';
import type { SceneSetting } from './scene';

export interface AgentMessage {
  id: string;
  role: 'user' | 'agent';
  content: string;
  timestamp: Date;
  uiDirective?: UIDirective;
}

export interface UIDirective {
  action: UIAction;
  payload: UIDirectivePayload;
}

export type UIAction = 
  | 'SHOW_PRODUCT'
  | 'SHOW_PRODUCTS'
  | 'CHANGE_SCENE'
  | 'INITIATE_CHECKOUT'
  | 'CONFIRM_ORDER'
  | 'RESET_SCENE';

export interface UIDirectivePayload {
  products?: Product[];
  sceneContext?: {
    setting: SceneSetting;
    mood?: string;
    generateBackground?: boolean;
    backgroundPrompt?: string;
  };
  checkoutData?: {
    products: Product[];
    useStoredPayment: boolean;
  };
  orderConfirmation?: {
    orderId: string;
    estimatedDelivery: string;
  };
}

export interface AgentResponse {
  sessionId: string;
  message: string;
  uiDirective?: UIDirective;
  suggestedActions?: string[];
  confidence: number;
}
