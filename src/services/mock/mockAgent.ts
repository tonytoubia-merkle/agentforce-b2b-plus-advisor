import type { AgentResponse, UIAction } from '@/types/agent';
import type { CustomerSessionContext, CustomerProfile } from '@/types/customer';
import type { Product } from '@/types/product';
import { MOCK_PRODUCTS } from '@/mocks/products';

// ─── Conversation State ──────────────────────────────────────────

interface ConversationState {
  lastShownProductIds: string[];
  currentProductId: string | null;
  shownCategories: string[];
  hasGreeted: boolean;
}

const state: ConversationState = {
  lastShownProductIds: [],
  currentProductId: null,
  shownCategories: [],
  hasGreeted: false,
};

// Customer context set by ConversationContext when persona changes
let customerCtx: CustomerSessionContext | null = null;

export function setMockCustomerContext(ctx: CustomerSessionContext | null): void {
  customerCtx = ctx;
  state.lastShownProductIds = [];
  state.currentProductId = null;
  state.shownCategories = [];
  state.hasGreeted = false;
}

export interface MockAgentSnapshot {
  state: ConversationState;
  customerCtx: CustomerSessionContext | null;
}

export function getMockAgentSnapshot(): MockAgentSnapshot {
  return { state: { ...state }, customerCtx };
}

export function restoreMockAgentSnapshot(snapshot: MockAgentSnapshot): void {
  Object.assign(state, snapshot.state);
  customerCtx = snapshot.customerCtx;
}

// ─── Helpers ─────────────────────────────────────────────────────

const findProduct = (id: string) => MOCK_PRODUCTS.find((p) => p.id === id);

const B2B_SUGGESTED_ACTIONS = [
  'Track my orders',
  'Reorder last purchase',
  'Browse engineered resins',
  'Request a quote',
  'Check lead times',
];

const DISCOVERY_ACTIONS = [
  'Browse engineered resins',
  'Show me commodity resins',
  'Explore sustainable materials',
  'Request a quote',
];

function formatPrice(price: number): string {
  return `$${price.toFixed(2)}/lb`;
}

function getOpenOrders(customer: CustomerProfile | null): CustomerProfile['orders'] {
  if (!customer) return [];
  return (customer.orders || []).filter(
    (o) => o.status === 'processing' || o.status === 'shipped' || o.status === 'in-transit' || o.status === 'backordered'
  );
}

function getRecentCompletedOrders(customer: CustomerProfile | null, limit = 3): CustomerProfile['orders'] {
  if (!customer) return [];
  return (customer.orders || [])
    .filter((o) => o.status === 'completed')
    .sort((a, b) => b.orderDate.localeCompare(a.orderDate))
    .slice(0, limit);
}

function getAccountTierLabel(customer: CustomerProfile | null): string {
  if (!customer?.loyalty) return 'Standard';
  return customer.loyalty.tier.charAt(0).toUpperCase() + customer.loyalty.tier.slice(1);
}

function matchProducts(query: string, products: Product[] = MOCK_PRODUCTS): Product[] {
  const q = query.toLowerCase();
  return products.filter((p) => {
    const searchable = [
      p.name,
      p.brand,
      p.category,
      p.description,
      p.shortDescription,
      ...(p.attributes.industries || []),
      ...(p.attributes.certifications || []),
      ...(p.attributes.processingMethod || []),
    ]
      .join(' ')
      .toLowerCase();
    return searchable.includes(q);
  });
}

// ─── generateMockWelcome ─────────────────────────────────────────

export function generateMockWelcome(customer: CustomerProfile): AgentResponse {
  const tier = customer.merkuryIdentity?.identityTier ?? 'anonymous';
  const openOrders = getOpenOrders(customer);
  const recentOrders = getRecentCompletedOrders(customer);
  const accountTier = getAccountTierLabel(customer);

  // Known customer with orders
  if (tier === 'known' && (openOrders.length > 0 || recentOrders.length > 0)) {
    const openCount = openOrders.length;
    const recentCount = recentOrders.length;
    const companyNote = customer.company ? ` at ${customer.company}` : '';

    let subtext = '';
    if (openCount > 0) {
      subtext = `You have ${openCount} open order${openCount > 1 ? 's' : ''} in progress.`;
      if (accountTier !== 'Standard') {
        subtext += ` Your ${accountTier} account includes priority fulfillment.`;
      }
    } else {
      const lastOrder = recentOrders[0];
      const lastItem = lastOrder.lineItems[0]?.productName ?? 'your last order';
      subtext = `Your most recent shipment of ${lastItem} was delivered ${lastOrder.orderDate}. Ready to reorder?`;
    }

    return {
      sessionId: 'mock-session',
      message: `Welcome back, ${customer.name}${companyNote}. Your ${accountTier} account is in good standing. How can I help you today?`,
      uiDirective: {
        action: 'WELCOME_SCENE' as UIAction,
        payload: {
          welcomeMessage: `Welcome back, ${customer.name}.`,
          welcomeSubtext: subtext,
          sceneContext: { setting: 'neutral', generateBackground: false },
          suggestedActions: [
            'Track my orders',
            'Reorder last purchase',
            'Browse engineered resins',
            'Request a quote',
            'Check lead times',
          ],
        },
      },
      suggestedActions: [
        'Track my orders',
        'Reorder last purchase',
        'Browse engineered resins',
        'Request a quote',
        'Check lead times',
      ],
      confidence: 0.97,
    };
  }

  // Known customer without orders
  if (tier === 'known') {
    const companyNote = customer.company ? ` at ${customer.company}` : '';
    return {
      sessionId: 'mock-session',
      message: `Welcome to Formerra Plus, ${customer.name}${companyNote}. I'm your materials concierge — let me help you find the right resins and compounds for your applications.`,
      uiDirective: {
        action: 'WELCOME_SCENE' as UIAction,
        payload: {
          welcomeMessage: `Welcome, ${customer.name}.`,
          welcomeSubtext: 'Your Formerra Plus account is set up and ready. Let me help you place your first order.',
          sceneContext: { setting: 'office', generateBackground: false },
          suggestedActions: [
            'Browse engineered resins',
            'Show me commodity resins',
            'Explore sustainable materials',
            'Request a quote',
          ],
        },
      },
      suggestedActions: [
        'Browse engineered resins',
        'Show me commodity resins',
        'Explore sustainable materials',
        'Request a quote',
      ],
      confidence: 0.95,
    };
  }

  // Appended — resolved identity but no direct relationship
  if (tier === 'appended') {
    const industry = customer.appendedProfile?.industryVertical;
    const industryHint = industry ? ` We work with leading ${industry.toLowerCase()} manufacturers to source the right materials.` : '';

    return {
      sessionId: 'mock-session',
      message: `Welcome to Formerra Plus — your materials distribution partner.${industryHint} How can I assist you today?`,
      uiDirective: {
        action: 'WELCOME_SCENE' as UIAction,
        payload: {
          welcomeMessage: 'Welcome to Formerra Plus.',
          welcomeSubtext: `Your single source for engineered resins, commodity polymers, and specialty compounds.${industryHint}`,
          sceneContext: { setting: 'neutral', generateBackground: false },
          suggestedActions: [
            'Browse engineered resins',
            'Show me commodity resins',
            'Explore sustainable materials',
            'Request a quote',
          ],
        },
      },
      suggestedActions: [
        'Browse engineered resins',
        'Show me commodity resins',
        'Explore sustainable materials',
        'Request a quote',
      ],
      confidence: 0.90,
    };
  }

  // Anonymous
  return {
    sessionId: 'mock-session',
    message: 'Welcome to Formerra Plus. I can help you find resins, elastomers, additives, and more. What are you looking for?',
    uiDirective: {
      action: 'WELCOME_SCENE' as UIAction,
      payload: {
        welcomeMessage: 'Welcome to Formerra Plus.',
        welcomeSubtext: 'Engineered resins, commodity polymers, elastomers, and specialty compounds — all from one distributor.',
        sceneContext: { setting: 'neutral', generateBackground: false },
        suggestedActions: DISCOVERY_ACTIONS,
      },
    },
    suggestedActions: DISCOVERY_ACTIONS,
    confidence: 0.85,
  };
}

// ─── Internal welcome (uses customerCtx set via setMockCustomerContext) ───

function generateWelcomeResponse(): AgentResponse | null {
  if (state.hasGreeted) return null;
  state.hasGreeted = true;

  if (!customerCtx) return null;

  const tier = customerCtx.identityTier;
  const name = customerCtx.name;
  const company = customerCtx.company;

  if (tier === 'known') {
    const companyNote = company ? ` at ${company}` : '';
    const loyaltyInfo = customerCtx.loyaltyTier
      ? `${customerCtx.loyaltyTier.charAt(0).toUpperCase() + customerCtx.loyaltyTier.slice(1)}`
      : 'Standard';
    const hasActivity = (customerCtx.recentActivity?.length ?? 0) > 0;
    const activityNote = hasActivity
      ? ' I can see some recent order activity on your account.'
      : '';

    return {
      sessionId: 'mock-session',
      message: `Welcome back, ${name}${companyNote}. Your ${loyaltyInfo} account is in good standing.${activityNote} How can I help you today?`,
      uiDirective: {
        action: 'WELCOME_SCENE' as UIAction,
        payload: {
          welcomeMessage: `Welcome back, ${name}.`,
          welcomeSubtext: `Your ${loyaltyInfo} account at Formerra Plus.${activityNote}`,
          sceneContext: { setting: 'neutral', generateBackground: false },
          suggestedActions: B2B_SUGGESTED_ACTIONS,
        },
      },
      suggestedActions: B2B_SUGGESTED_ACTIONS,
      confidence: 0.97,
    };
  }

  if (tier === 'appended') {
    const industry = customerCtx.industry;
    const industryHint = industry
      ? ` We partner with leading ${industry.toLowerCase()} manufacturers to source the right materials.`
      : '';

    return {
      sessionId: 'mock-session',
      message: `Welcome to Formerra Plus — your materials distribution partner.${industryHint} How can I assist you today?`,
      uiDirective: {
        action: 'WELCOME_SCENE' as UIAction,
        payload: {
          welcomeMessage: 'Welcome to Formerra Plus.',
          welcomeSubtext: `Your single source for engineered resins, commodity polymers, and specialty compounds.${industryHint}`,
          sceneContext: { setting: 'neutral', generateBackground: false },
          suggestedActions: DISCOVERY_ACTIONS,
        },
      },
      suggestedActions: DISCOVERY_ACTIONS,
      confidence: 0.90,
    };
  }

  // Anonymous
  return {
    sessionId: 'mock-session',
    message: 'Welcome to Formerra Plus. I can help you find resins, elastomers, additives, and more. What are you looking for?',
    uiDirective: {
      action: 'WELCOME_SCENE' as UIAction,
      payload: {
        welcomeMessage: 'Welcome to Formerra Plus.',
        welcomeSubtext: 'Engineered resins, commodity polymers, elastomers, and specialty compounds — all from one distributor.',
        sceneContext: { setting: 'neutral', generateBackground: false },
        suggestedActions: DISCOVERY_ACTIONS,
      },
    },
    suggestedActions: DISCOVERY_ACTIONS,
    confidence: 0.85,
  };
}

// ─── Response patterns ───────────────────────────────────────────

const RESPONSE_PATTERNS: {
  pattern: RegExp;
  response: () => Partial<AgentResponse>;
}[] = [
  // Order status / tracking
  {
    pattern: /order|track|shipment|delivery|shipping|where.?s my/i,
    response: () => {
      if (customerCtx?.recentActivity?.length) {
        const activity = customerCtx.recentActivity.slice(0, 3);
        return {
          message: `Here's your recent order activity:\n\n${activity.map((a) => `- ${a}`).join('\n')}\n\nWould you like tracking details on a specific order?`,
          uiDirective: {
            action: 'SHOW_ORDER_STATUS' as UIAction,
            payload: {
              orderStatus: {
                orderId: 'ORD-2024-4821',
                status: 'In Transit',
                trackingNumber: 'FX-7829104562',
                estimatedDelivery: '2024-02-08',
                lineItems: [
                  { productName: 'LEXAN™ Polycarbonate Resin 141R', quantity: 5000 },
                  { productName: 'Santoprene™ TPV 201-73', quantity: 2000 },
                ],
              },
            },
          },
          suggestedActions: ['Track order FX-7829104562', 'View all open orders', 'Reorder last purchase'],
        };
      }
      return {
        message: 'I can look up your order status. Could you provide your PO number or order ID?',
        suggestedActions: ['View all open orders', 'Browse products', 'Request a quote'],
      };
    },
  },

  // Reorder / restock
  {
    pattern: /reorder|restock|buy again|repeat order|last purchase/i,
    response: () => {
      if (customerCtx?.recentPurchases?.length) {
        const uniqueIds = [...new Set(customerCtx.recentPurchases)];
        const products = uniqueIds
          .map((id) => findProduct(id))
          .filter(Boolean) as NonNullable<ReturnType<typeof findProduct>>[];
        if (products.length) {
          state.lastShownProductIds = products.map((p) => p.id);
          return {
            message: `Based on your recent orders, here are your most-purchased materials. Shall I prepare a reorder at current pricing?\n\n${products.map((p) => `- **${p.name}** — ${formatPrice(p.price)} (${p.attributes.minOrderQty} min)`).join('\n')}`,
            uiDirective: {
              action: 'SHOW_PRODUCTS' as UIAction,
              payload: {
                products,
                sceneContext: { setting: 'warehouse', generateBackground: false },
              },
            },
            suggestedActions: ['Reorder all at current pricing', 'Adjust quantities', 'Request updated quote'],
          };
        }
      }
      return {
        message: "I'd be happy to help you reorder. What materials do you need to restock?",
        suggestedActions: ['Browse engineered resins', 'Show me commodity resins', 'Check my order history'],
      };
    },
  },

  // Product / material queries — specific materials
  {
    pattern: /nylon|polyamide|pa6|pa66|ultramid/i,
    response: () => {
      const products = MOCK_PRODUCTS.filter(
        (p) => p.name.toLowerCase().includes('nylon') || p.name.toLowerCase().includes('ultramid')
      );
      state.lastShownProductIds = products.map((p) => p.id);
      return {
        message: `Here's our nylon offering:\n\n${products.map((p) => `- **${p.name}** (${p.brand}) — ${formatPrice(p.price)}: ${p.shortDescription}`).join('\n')}\n\nAll nylons ship in 55 lb boxes with 2,000 lb minimums. Need a specific grade or glass-fill percentage?`,
        uiDirective: {
          action: 'SHOW_PRODUCTS' as UIAction,
          payload: {
            products,
            sceneContext: { setting: 'warehouse', generateBackground: false },
          },
        },
        suggestedActions: ['Request a quote', 'Show me the TDS', 'What glass-fill options are available?'],
      };
    },
  },
  {
    pattern: /polycarb|lexan|pc\b/i,
    response: () => {
      const product = findProduct('resin-pc-lexan')!;
      state.currentProductId = product.id;
      return {
        message: `Our go-to polycarbonate is **${product.name}** (${product.brand}) at ${formatPrice(product.price)}.\n\n${product.description}\n\nMinimum order: ${product.attributes.minOrderQty}. Lead time: ${product.attributes.leadTimeDays} days. Certifications: ${product.attributes.certifications?.join(', ')}.`,
        uiDirective: {
          action: 'SHOW_PRODUCT' as UIAction,
          payload: {
            products: [product],
            sceneContext: { setting: 'warehouse', generateBackground: false },
          },
        },
        suggestedActions: ['Request a quote', 'Check availability', 'Show me PBT alternatives'],
      };
    },
  },
  {
    pattern: /peek|victrex|high.?perform/i,
    response: () => {
      const product = findProduct('resin-peek-victrex')!;
      state.currentProductId = product.id;
      return {
        message: `For high-performance applications, we carry **${product.name}** at ${formatPrice(product.price)}.\n\n${product.description}\n\nMinimum order: ${product.attributes.minOrderQty}. Lead time: ${product.attributes.leadTimeDays} days.`,
        uiDirective: {
          action: 'SHOW_PRODUCT' as UIAction,
          payload: {
            products: [product],
            sceneContext: { setting: 'neutral', generateBackground: false },
          },
        },
        suggestedActions: ['Request a quote', 'What certifications does it carry?', 'Show me NORYL PPO as an alternative'],
      };
    },
  },
  {
    pattern: /polypropylene|pp\b|profax/i,
    response: () => {
      const product = findProduct('resin-pp-profax')!;
      state.currentProductId = product.id;
      return {
        message: `For polypropylene, we recommend **${product.name}** (${product.brand}) at ${formatPrice(product.price)}.\n\n${product.shortDescription}. Min order: ${product.attributes.minOrderQty}. Lead time: ${product.attributes.leadTimeDays} days. Ships in ${product.attributes.packagingSize}.`,
        uiDirective: {
          action: 'SHOW_PRODUCT' as UIAction,
          payload: {
            products: [product],
            sceneContext: { setting: 'warehouse', generateBackground: false },
          },
        },
        suggestedActions: ['Request a quote', 'Check current availability', 'Show me HDPE options'],
      };
    },
  },
  {
    pattern: /hdpe|polyethylene|marlex/i,
    response: () => {
      const product = findProduct('resin-hdpe-marlex')!;
      state.currentProductId = product.id;
      return {
        message: `Our HDPE offering: **${product.name}** (${product.brand}) at ${formatPrice(product.price)}.\n\n${product.shortDescription}. Min order: ${product.attributes.minOrderQty}. Lead time: ${product.attributes.leadTimeDays} days.`,
        uiDirective: {
          action: 'SHOW_PRODUCT' as UIAction,
          payload: {
            products: [product],
            sceneContext: { setting: 'warehouse', generateBackground: false },
          },
        },
        suggestedActions: ['Request a quote', 'Show me PP alternatives', 'What blow-molding grades do you have?'],
      };
    },
  },
  {
    pattern: /abs|cycolac/i,
    response: () => {
      const product = findProduct('resin-abs-cycolac')!;
      state.currentProductId = product.id;
      return {
        message: `For ABS, we carry **${product.name}** (${product.brand}) at ${formatPrice(product.price)}.\n\n${product.shortDescription}. Min order: ${product.attributes.minOrderQty}. Lead time: ${product.attributes.leadTimeDays} days.`,
        uiDirective: {
          action: 'SHOW_PRODUCT' as UIAction,
          payload: {
            products: [product],
            sceneContext: { setting: 'warehouse', generateBackground: false },
          },
        },
        suggestedActions: ['Request a quote', 'Check availability', 'Show me polycarbonate instead'],
      };
    },
  },

  // General product/resin/material browsing
  {
    pattern: /product|resin|material|polymer|plastic|catalog|browse/i,
    response: () => {
      const engineered = MOCK_PRODUCTS.filter((p) => p.category === 'engineered-resin');
      state.lastShownProductIds = engineered.map((p) => p.id);
      state.shownCategories.push('engineered-resin');
      return {
        message: `Here are our engineered resins — our most popular category:\n\n${engineered.map((p) => `- **${p.name}** (${p.brand}) — ${formatPrice(p.price)}: ${p.shortDescription}`).join('\n')}\n\nWe also carry commodity resins, elastomers, additives, and sustainable materials.`,
        uiDirective: {
          action: 'SHOW_PRODUCTS' as UIAction,
          payload: {
            products: engineered,
            sceneContext: { setting: 'warehouse', generateBackground: false },
          },
        },
        suggestedActions: ['Show me commodity resins', 'Show me elastomers', 'Explore sustainable materials', 'Request a quote'],
      };
    },
  },

  // Elastomers / TPE / TPU / TPV
  {
    pattern: /elastomer|tpe|tpu|tpv|rubber|santoprene|estane|flexible/i,
    response: () => {
      const products = MOCK_PRODUCTS.filter((p) => p.category === 'elastomer');
      state.lastShownProductIds = products.map((p) => p.id);
      return {
        message: `Here are our elastomer offerings:\n\n${products.map((p) => `- **${p.name}** (${p.brand}) — ${formatPrice(p.price)}: ${p.shortDescription}`).join('\n')}\n\nBoth are processable on standard injection molding and extrusion equipment.`,
        uiDirective: {
          action: 'SHOW_PRODUCTS' as UIAction,
          payload: {
            products,
            sceneContext: { setting: 'warehouse', generateBackground: false },
          },
        },
        suggestedActions: ['Request a quote on Santoprene', 'Tell me about Estane TPU', 'Compare the two'],
      };
    },
  },

  // Pricing / quoting
  {
    pattern: /price|quote|cost|pricing|how much|rate/i,
    response: () => {
      if (state.currentProductId) {
        const product = findProduct(state.currentProductId);
        if (product) {
          return {
            message: `**${product.name}** is currently priced at ${formatPrice(product.price)} with a minimum order of ${product.attributes.minOrderQty}.\n\nFor volume pricing or contract rates, I can connect you with your account manager or generate a formal quote.`,
            uiDirective: {
              action: 'SHOW_PRODUCT' as UIAction,
              payload: {
                products: [product],
                sceneContext: { setting: 'office', generateBackground: false },
              },
            },
            suggestedActions: ['Request a formal quote', 'Check volume discounts', 'Show me alternatives'],
          };
        }
      }
      const popular = [
        findProduct('resin-pc-lexan')!,
        findProduct('resin-pp-profax')!,
        findProduct('resin-nylon-ultramid')!,
      ];
      return {
        message: `Here are current list prices on our most popular resins:\n\n${popular.map((p) => `- **${p.name}** — ${formatPrice(p.price)} (min ${p.attributes.minOrderQty})`).join('\n')}\n\nThese are list prices. Contract and volume pricing is available — I can generate a formal quote.`,
        uiDirective: {
          action: 'SHOW_PRODUCTS' as UIAction,
          payload: {
            products: popular,
            sceneContext: { setting: 'office', generateBackground: false },
          },
        },
        suggestedActions: ['Request a formal quote', 'Show all products with pricing', 'Check volume discounts'],
      };
    },
  },

  // Account / tier
  {
    pattern: /account|tier|points|loyalty|membership|standing/i,
    response: () => {
      const tier = customerCtx?.loyaltyTier ?? 'Standard';
      const points = customerCtx?.loyaltyPoints ?? 0;
      const company = customerCtx?.company ?? 'your company';
      return {
        message: `Here's your Formerra Plus account summary:\n\n- **Company:** ${company}\n- **Account Tier:** ${tier.charAt(0).toUpperCase() + tier.slice(1)}\n- **Loyalty Points:** ${points.toLocaleString()}\n\nYour tier determines priority fulfillment speed, volume pricing eligibility, and dedicated support access.`,
        uiDirective: {
          action: 'SHOW_ACCOUNT_SUMMARY' as UIAction,
          payload: {
            accountSummary: {
              totalOrders: 47,
              openOrders: 3,
              ytdSpend: 284500,
              accountTier: tier.charAt(0).toUpperCase() + tier.slice(1),
            },
          },
        },
        suggestedActions: ['How do I upgrade my tier?', 'View my order history', 'Track my orders'],
      };
    },
  },

  // Sustainability / recycled / bio
  {
    pattern: /sustainab|recycled|bio|eco|green|pcr|rpet|pla|compost|circular/i,
    response: () => {
      const products = MOCK_PRODUCTS.filter(
        (p) => p.category === 'recycled-resin' || p.category === 'sustainable-resin'
      );
      state.lastShownProductIds = products.map((p) => p.id);
      return {
        message: `Here are our sustainable material options:\n\n${products.map((p) => `- **${p.name}** (${p.brand}) — ${formatPrice(p.price)}: ${p.shortDescription} [${p.attributes.sustainableContent}]`).join('\n')}\n\nBoth help meet corporate sustainability goals and regulatory requirements.`,
        uiDirective: {
          action: 'SHOW_PRODUCTS' as UIAction,
          payload: {
            products,
            sceneContext: { setting: 'neutral', generateBackground: false },
          },
        },
        suggestedActions: ['Request a sustainability audit', 'Compare with virgin resins', 'Request a quote'],
      };
    },
  },

  // Purge / color change
  {
    pattern: /purge|color change|changeover|scrap reduc/i,
    response: () => {
      const product = findProduct('purge-compound-ultra')!;
      state.currentProductId = product.id;
      return {
        message: `For color and material changes, our **${product.name}** reduces downtime by up to 80%.\n\n${formatPrice(product.price)} — min order ${product.attributes.minOrderQty}. FDA-approved for food-contact equipment. Lead time: ${product.attributes.leadTimeDays} days.\n\nCompatible with injection molding, extrusion, and blow molding equipment.`,
        uiDirective: {
          action: 'SHOW_PRODUCT' as UIAction,
          payload: {
            products: [product],
            sceneContext: { setting: 'warehouse', generateBackground: false },
          },
        },
        suggestedActions: ['Request a sample', 'Request a quote', 'How does it compare to my current purge?'],
      };
    },
  },

  // Additives / UV / stabilizer
  {
    pattern: /additive|uv|stabiliz|antioxidant|flame retard/i,
    response: () => {
      const product = findProduct('additive-uv-stabilizer')!;
      state.currentProductId = product.id;
      return {
        message: `We carry specialty additives. Our **${product.name}** is a benzotriazole UV absorber at ${formatPrice(product.price)}.\n\n${product.shortDescription}. Effective in PE, PP, PVC, PET, and engineering resins. Min order: ${product.attributes.minOrderQty}.`,
        uiDirective: {
          action: 'SHOW_PRODUCT' as UIAction,
          payload: {
            products: [product],
            sceneContext: { setting: 'neutral', generateBackground: false },
          },
        },
        suggestedActions: ['Request a quote', 'What other additives do you carry?', 'Show me resins for outdoor use'],
      };
    },
  },

  // Color / masterbatch
  {
    pattern: /color|masterbatch|pigment|custom color|match/i,
    response: () => {
      const products = MOCK_PRODUCTS.filter((p) => p.category === 'color-masterbatch');
      state.lastShownProductIds = products.map((p) => p.id);
      return {
        message: `Here are our color solutions:\n\n${products.map((p) => `- **${p.name}** — ${formatPrice(p.price)}: ${p.shortDescription}`).join('\n')}\n\nOur Custom Match Program includes lab matching, spectrophotometric approval, and production-scale delivery.`,
        uiDirective: {
          action: 'SHOW_PRODUCTS' as UIAction,
          payload: {
            products,
            sceneContext: { setting: 'neutral', generateBackground: false },
          },
        },
        suggestedActions: ['Start a custom color match', 'Request a quote', 'What carriers are available?'],
      };
    },
  },

  // Lead times
  {
    pattern: /lead time|availability|in stock|when can|how (soon|fast|long)/i,
    response: () => {
      if (state.currentProductId) {
        const product = findProduct(state.currentProductId);
        if (product) {
          return {
            message: `**${product.name}** is ${product.inStock ? 'in stock' : 'currently backordered'}. Standard lead time is ${product.attributes.leadTimeDays} business days from order confirmation.\n\nFor expedited shipping, Gold and Platinum accounts receive priority fulfillment.`,
            suggestedActions: ['Place an order', 'Request expedited shipping', 'Show me alternatives'],
          };
        }
      }
      return {
        message: 'Most commodity resins ship within 3-5 business days. Engineered resins are typically 5-10 days. Specialty materials like PEEK may require 10-14 days. Which material are you interested in?',
        suggestedActions: ['Check a specific product', 'Browse engineered resins', 'Show me what ships fastest'],
      };
    },
  },

  // Technical questions
  {
    pattern: /certif|fda|ul\b|rohs|iso|astm|spec|technical|tds|data sheet/i,
    response: () => {
      if (state.currentProductId) {
        const product = findProduct(state.currentProductId);
        if (product?.attributes.certifications?.length) {
          return {
            message: `**${product.name}** carries the following certifications: ${product.attributes.certifications.join(', ')}.\n\nI can send you the full technical data sheet or connect you with our applications engineering team for detailed specifications.`,
            suggestedActions: ['Send me the TDS', 'Connect me with engineering', 'Request a sample'],
          };
        }
      }
      return {
        message: 'I can pull up technical data sheets and certifications for any product in our catalog. Which material do you need specs for?',
        suggestedActions: ['Show me LEXAN PC specs', 'Nylon certifications', 'FDA-compliant materials'],
      };
    },
  },

  // Processing method questions
  {
    pattern: /injection.?mold|extrusion|blow.?mold|thermoform|rotational|3d print/i,
    response: () => {
      const method = (/injection/i.test('') ? 'injection-molding' :
        /extrusion/i.test('') ? 'extrusion' :
        /blow/i.test('') ? 'blow-molding' :
        /thermoform/i.test('') ? 'thermoforming' :
        /rotational/i.test('') ? 'rotational-molding' : 'injection-molding') as string;
      // Show all products compatible with injection molding as default
      const compatible = MOCK_PRODUCTS.filter(
        (p) => p.attributes.processingMethod?.includes('injection-molding')
      );
      state.lastShownProductIds = compatible.map((p) => p.id);
      return {
        message: `Here are materials compatible with injection molding:\n\n${compatible.slice(0, 5).map((p) => `- **${p.name}** — ${formatPrice(p.price)}`).join('\n')}\n\nI can filter by any processing method. What application are you designing for?`,
        uiDirective: {
          action: 'SHOW_PRODUCTS' as UIAction,
          payload: {
            products: compatible.slice(0, 5),
            sceneContext: { setting: 'warehouse', generateBackground: false },
          },
        },
        suggestedActions: ['Filter by extrusion', 'Filter by blow molding', 'Request a quote'],
      };
    },
  },

  // Greetings
  {
    pattern: /^(hi|hello|hey|good (morning|afternoon|evening))/i,
    response: () => {
      const welcome = generateWelcomeResponse();
      if (welcome) return welcome;
      return {
        message: 'Hello! Welcome to Formerra Plus. I can help you source resins, elastomers, additives, and specialty compounds. What are you looking for?',
        suggestedActions: DISCOVERY_ACTIONS,
      };
    },
  },

  // Thanks / goodbye
  {
    pattern: /thank|thanks|bye|goodbye/i,
    response: () => ({
      message: 'You\'re welcome. Don\'t hesitate to reach out when you need materials support. Have a productive day.',
      uiDirective: {
        action: 'RESET_SCENE' as UIAction,
        payload: {},
      },
      suggestedActions: [],
    }),
  },

  // Help / what can you do
  {
    pattern: /help|what can you|what do you/i,
    response: () => ({
      message: 'I can help you with:\n\n- **Product sourcing** — engineered resins, commodity polymers, elastomers, additives\n- **Order management** — track shipments, reorder materials, check lead times\n- **Pricing & quotes** — current pricing, volume discounts, formal quotes\n- **Technical support** — material data sheets, certifications, processing guidance\n- **Account management** — tier status, order history, saved preferences\n\nWhat would you like to start with?',
      suggestedActions: ['Browse products', 'Track my orders', 'Request a quote', 'Check my account'],
    }),
  },
];

// ─── Main entry point ────────────────────────────────────────────

export const generateMockResponse = async (
  message: string,
  customer?: CustomerProfile | null,
  products?: Product[],
): Promise<AgentResponse> => {
  await new Promise((resolve) => setTimeout(resolve, 600 + Math.random() * 400));

  // Auto-welcome trigger from ConversationContext on persona change
  if (message === '[WELCOME]') {
    const welcome = generateWelcomeResponse();
    if (welcome) return welcome;
  }

  for (const { pattern, response } of RESPONSE_PATTERNS) {
    if (message.match(pattern)) {
      const result = response();
      const actions = [...(result.suggestedActions || [])];
      return {
        sessionId: 'mock-session',
        message: result.message!,
        uiDirective: result.uiDirective,
        suggestedActions: actions,
        confidence: result.confidence || 0.95,
      };
    }
  }

  return {
    sessionId: 'mock-session',
    message: "I can help you source the right materials. I carry engineered resins, commodity polymers, elastomers, additives, and more. What application or material type are you looking for?",
    suggestedActions: DISCOVERY_ACTIONS,
    confidence: 0.80,
  };
};
