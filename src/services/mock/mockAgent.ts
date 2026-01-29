import type { AgentResponse, UIAction } from '@/types/agent';
import { MOCK_PRODUCTS } from '@/mocks/products';

const RESPONSE_PATTERNS: {
  pattern: RegExp;
  response: () => Partial<AgentResponse>;
}[] = [
  {
    pattern: /moisturizer|hydrat|dry skin|sensitive/i,
    response: () => ({
      message: "I'd recommend our Hydra-Calm Sensitive Moisturizer. It's specifically formulated for sensitive skin with soothing ingredients like centella and hyaluronic acid. Would you like to learn more or shall I add it to your bag?",
      uiDirective: {
        action: 'SHOW_PRODUCT' as UIAction,
        payload: {
          products: [MOCK_PRODUCTS.find((p) => p.id === 'moisturizer-sensitive')!],
          sceneContext: {
            setting: 'bathroom' as const,
            generateBackground: true,
            backgroundPrompt: 'Serene bathroom counter with soft morning light',
          },
        },
      },
    }),
  },
  {
    pattern: /buy|purchase|add to (bag|cart)|get (it|this)/i,
    response: () => ({
      message: "Perfect choice! I'll set that up for you. Since you have a payment method on file, this will just take a moment.",
      uiDirective: {
        action: 'INITIATE_CHECKOUT' as UIAction,
        payload: {
          checkoutData: {
            products: [],
            useStoredPayment: true,
          },
        },
      },
    }),
  },
  {
    pattern: /travel|trip|going to|vacation|india|hot (weather|climate)/i,
    response: () => ({
      message: "For your trip to a hot climate, I'd suggest our travel essentials kit. It includes a lightweight SPF moisturizer, a refreshing mist, and oil-absorbing sheets - all travel-sized!",
      uiDirective: {
        action: 'SHOW_PRODUCTS' as UIAction,
        payload: {
          products: MOCK_PRODUCTS.filter((p) => p.attributes.isTravel),
          sceneContext: {
            setting: 'travel' as const,
            generateBackground: true,
            backgroundPrompt: 'Travel toiletries bag with passport and luggage',
          },
        },
      },
    }),
  },
];

export const generateMockResponse = async (message: string): Promise<AgentResponse> => {
  await new Promise((resolve) => setTimeout(resolve, 800 + Math.random() * 400));

  for (const { pattern, response } of RESPONSE_PATTERNS) {
    if (message.match(pattern)) {
      const result = response();
      return {
        sessionId: 'mock-session',
        message: result.message!,
        uiDirective: result.uiDirective,
        suggestedActions: [],
        confidence: 0.95,
      };
    }
  }

  return {
    sessionId: 'mock-session',
    message: "I'd be happy to help you find the perfect product. Are you looking for something specific like a moisturizer, cleanser, or perhaps something for travel?",
    suggestedActions: ['Show me moisturizers', 'I need travel products', 'What do you recommend?'],
    confidence: 0.8,
  };
};
