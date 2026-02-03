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
  | 'WELCOME_SCENE'
  | 'INITIATE_CHECKOUT'
  | 'CONFIRM_ORDER'
  | 'RESET_SCENE'
  | 'SHOW_ORDER_STATUS'
  | 'SHOW_ACCOUNT_SUMMARY';

export interface UIDirectivePayload {
  products?: Product[];
  welcomeMessage?: string;
  welcomeSubtext?: string;
  sceneContext?: {
    setting: SceneSetting;
    mood?: string;
    generateBackground?: boolean;
    backgroundPrompt?: string;
    cmsAssetId?: string;
    cmsTag?: string;
    editMode?: boolean;
    sceneAssetId?: string;
    imageUrl?: string;
  };
  checkoutData?: {
    products: Product[];
    useStoredPayment: boolean;
  };
  orderConfirmation?: {
    orderId: string;
    estimatedDelivery: string;
  };
  orderStatus?: {
    orderId: string;
    status: string;
    trackingNumber?: string;
    estimatedDelivery?: string;
    lineItems?: { productName: string; quantity: number }[];
  };
  accountSummary?: {
    totalOrders: number;
    openOrders: number;
    ytdSpend: number;
    accountTier: string;
  };
  suggestedActions?: string[];
}

export interface AgentResponse {
  sessionId: string;
  message: string;
  uiDirective?: UIDirective;
  suggestedActions?: string[];
  confidence: number;
}
