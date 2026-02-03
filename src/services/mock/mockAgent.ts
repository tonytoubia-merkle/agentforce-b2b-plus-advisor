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
  'Reorder equipment',
  'Browse wind turbine components',
  'Request a quote',
  'Check lead times',
];

const DISCOVERY_ACTIONS = [
  'Browse solar panels',
  'Show wind turbine components',
  'Explore energy storage',
  'Request a quote',
];

function formatPrice(price: number): string {
  if (price >= 1000) {
    return `$${price.toLocaleString('en-US')}`;
  }
  return `$${price.toFixed(2)}`;
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
          suggestedActions: B2B_SUGGESTED_ACTIONS,
        },
      },
      suggestedActions: B2B_SUGGESTED_ACTIONS,
      confidence: 0.97,
    };
  }

  // Known customer without orders
  if (tier === 'known') {
    const companyNote = customer.company ? ` at ${customer.company}` : '';
    return {
      sessionId: 'mock-session',
      message: `Welcome to Formerra Plus, ${customer.name}${companyNote}. I'm your renewable energy advisor — let me help you find the right wind turbine components, solar equipment, and energy storage solutions for your projects.`,
      uiDirective: {
        action: 'WELCOME_SCENE' as UIAction,
        payload: {
          welcomeMessage: `Welcome, ${customer.name}.`,
          welcomeSubtext: 'Your Formerra Plus account is set up and ready. Let me help you place your first order.',
          sceneContext: { setting: 'office', generateBackground: false },
          suggestedActions: DISCOVERY_ACTIONS,
        },
      },
      suggestedActions: DISCOVERY_ACTIONS,
      confidence: 0.95,
    };
  }

  // Appended — resolved identity but no direct relationship
  if (tier === 'appended') {
    const industry = customer.appendedProfile?.industryVertical;
    const industryHint = industry ? ` We work with leading ${industry.toLowerCase()} companies to source the right equipment.` : '';

    return {
      sessionId: 'mock-session',
      message: `Welcome to Formerra Plus — your renewable energy equipment partner.${industryHint} How can I assist you today?`,
      uiDirective: {
        action: 'WELCOME_SCENE' as UIAction,
        payload: {
          welcomeMessage: 'Welcome to Formerra Plus.',
          welcomeSubtext: `Your single source for wind, solar, and storage equipment.${industryHint}`,
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
    message: 'Welcome to Formerra Plus. I can help you find wind turbine components, solar equipment, and energy storage solutions. What are you looking for?',
    uiDirective: {
      action: 'WELCOME_SCENE' as UIAction,
      payload: {
        welcomeMessage: 'Welcome to Formerra Plus.',
        welcomeSubtext: 'Wind turbine components, solar panels, inverters, and energy storage — all from one distributor.',
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
      ? ` We partner with leading ${industry.toLowerCase()} companies to source the right equipment.`
      : '';

    return {
      sessionId: 'mock-session',
      message: `Welcome to Formerra Plus — your renewable energy equipment partner.${industryHint} How can I assist you today?`,
      uiDirective: {
        action: 'WELCOME_SCENE' as UIAction,
        payload: {
          welcomeMessage: 'Welcome to Formerra Plus.',
          welcomeSubtext: `Your single source for wind, solar, and storage equipment.${industryHint}`,
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
    message: 'Welcome to Formerra Plus. I can help you find wind turbine components, solar equipment, and energy storage solutions. What are you looking for?',
    uiDirective: {
      action: 'WELCOME_SCENE' as UIAction,
      payload: {
        welcomeMessage: 'Welcome to Formerra Plus.',
        welcomeSubtext: 'Wind turbine components, solar panels, inverters, and energy storage — all from one distributor.',
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
                  { productName: 'Vestas V162 Turbine Blade', quantity: 3 },
                  { productName: 'SMA Sunny Tripower CORE2', quantity: 10 },
                ],
              },
            },
          },
          suggestedActions: ['Track order FX-7829104562', 'View all open orders', 'Reorder equipment'],
        };
      }
      return {
        message: 'I can look up your order status. Could you provide your PO number or order ID?',
        suggestedActions: ['View all open orders', 'Browse equipment', 'Request a quote'],
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
            message: `Based on your recent orders, here are your most-purchased items. Shall I prepare a reorder at current pricing?\n\n${products.map((p) => `- **${p.name}** — ${formatPrice(p.price)} (${p.attributes.minOrderQty} min)`).join('\n')}`,
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
        message: "I'd be happy to help you reorder. What equipment do you need to restock?",
        suggestedActions: ['Browse solar panels', 'Show wind turbine components', 'Check my order history'],
      };
    },
  },

  // Wind turbine components
  {
    pattern: /turbine|blade|nacelle|tower|wind/i,
    response: () => {
      const products = MOCK_PRODUCTS.filter((p) => p.category === 'wind-turbine');
      state.lastShownProductIds = products.map((p) => p.id);
      return {
        message: `Here are our wind turbine components:\n\n${products.map((p) => `- **${p.name}** (${p.brand}) — ${formatPrice(p.price)}: ${p.shortDescription}`).join('\n')}\n\nAll components are DNV-certified and available for utility-scale projects. Need a specific turbine platform or MW class?`,
        uiDirective: {
          action: 'SHOW_PRODUCTS' as UIAction,
          payload: {
            products,
            sceneContext: { setting: 'warehouse', generateBackground: false },
          },
        },
        suggestedActions: ['Request a quote', 'Check lead times', 'Show me solar panels'],
      };
    },
  },

  // Solar panels
  {
    pattern: /solar|panel|photovoltaic|pv\b|module/i,
    response: () => {
      const products = MOCK_PRODUCTS.filter((p) => p.category === 'solar-panel');
      state.lastShownProductIds = products.map((p) => p.id);
      return {
        message: `Here are our solar panel options:\n\n${products.map((p) => `- **${p.name}** (${p.brand}) — ${formatPrice(p.price)}: ${p.shortDescription}`).join('\n')}\n\nAll panels are IEC 61215 and UL 1703 certified. Available in pallet or container quantities.`,
        uiDirective: {
          action: 'SHOW_PRODUCTS' as UIAction,
          payload: {
            products,
            sceneContext: { setting: 'warehouse', generateBackground: false },
          },
        },
        suggestedActions: ['Request a quote', 'Show me inverters', 'Check lead times'],
      };
    },
  },

  // Inverters
  {
    pattern: /inverter|micro.?inverter|string.?inverter/i,
    response: () => {
      const products = MOCK_PRODUCTS.filter((p) =>
        p.id === 'solar-inverter-sma' || p.id === 'solar-micro-enphase'
      );
      state.lastShownProductIds = products.map((p) => p.id);
      return {
        message: `Here are our inverter solutions:\n\n${products.map((p) => `- **${p.name}** (${p.brand}) — ${formatPrice(p.price)}: ${p.shortDescription}`).join('\n')}\n\nWe carry both string inverters for utility-scale and microinverters for commercial rooftop applications.`,
        uiDirective: {
          action: 'SHOW_PRODUCTS' as UIAction,
          payload: {
            products,
            sceneContext: { setting: 'warehouse', generateBackground: false },
          },
        },
        suggestedActions: ['Request a quote', 'Show me solar panels', 'Compare string vs micro inverters'],
      };
    },
  },

  // Mounting systems
  {
    pattern: /mount|rack|rail|track(er|ing)/i,
    response: () => {
      const products = MOCK_PRODUCTS.filter((p) =>
        p.id === 'mount-rail-unirac' || p.id === 'mount-tracker-nextracker'
      );
      state.lastShownProductIds = products.map((p) => p.id);
      return {
        message: `Here are our mounting and racking solutions:\n\n${products.map((p) => `- **${p.name}** (${p.brand}) — ${formatPrice(p.price)}: ${p.shortDescription}`).join('\n')}\n\nFixed-tilt and single-axis tracker options available for ground-mount and rooftop installations.`,
        uiDirective: {
          action: 'SHOW_PRODUCTS' as UIAction,
          payload: {
            products,
            sceneContext: { setting: 'warehouse', generateBackground: false },
          },
        },
        suggestedActions: ['Request a quote', 'Compare fixed vs tracker', 'Show me solar panels'],
      };
    },
  },

  // Energy storage
  {
    pattern: /batter|storage|ess\b|megapack|bess/i,
    response: () => {
      const products = MOCK_PRODUCTS.filter((p) =>
        p.id === 'bess-tesla-megapack' || p.id === 'bess-byd-cube'
      );
      state.lastShownProductIds = products.map((p) => p.id);
      return {
        message: `Here are our energy storage systems:\n\n${products.map((p) => `- **${p.name}** (${p.brand}) — ${formatPrice(p.price)}: ${p.shortDescription}`).join('\n')}\n\nBoth systems support grid-scale deployments with integrated battery management and thermal controls.`,
        uiDirective: {
          action: 'SHOW_PRODUCTS' as UIAction,
          payload: {
            products,
            sceneContext: { setting: 'warehouse', generateBackground: false },
          },
        },
        suggestedActions: ['Request a quote', 'Compare storage options', 'Check lead times'],
      };
    },
  },

  // Balance-of-system
  {
    pattern: /transformer|combiner|junction|bos\b|balance/i,
    response: () => {
      const products = MOCK_PRODUCTS.filter((p) =>
        p.id === 'bos-transformer-abb' || p.id === 'bos-combiner-shoals' || p.id === 'bos-monitoring-also'
      );
      state.lastShownProductIds = products.map((p) => p.id);
      return {
        message: `Here are our balance-of-system components:\n\n${products.map((p) => `- **${p.name}** (${p.brand}) — ${formatPrice(p.price)}: ${p.shortDescription}`).join('\n')}\n\nThese components complete your installation from combiner boxes to step-up transformers and monitoring.`,
        uiDirective: {
          action: 'SHOW_PRODUCTS' as UIAction,
          payload: {
            products,
            sceneContext: { setting: 'warehouse', generateBackground: false },
          },
        },
        suggestedActions: ['Request a quote', 'Show me inverters', 'Check lead times'],
      };
    },
  },

  // Monitoring / SCADA
  {
    pattern: /monitor|scada|performance|powertrack/i,
    response: () => {
      const product = findProduct('bos-monitoring-also');
      if (product) {
        state.currentProductId = product.id;
        return {
          message: `For site monitoring, we carry **${product.name}** (${product.brand}) at ${formatPrice(product.price)}.\n\n${product.shortDescription}\n\nIntegrates with all major inverter brands and supports SCADA protocols for utility-scale fleet management.`,
          uiDirective: {
            action: 'SHOW_PRODUCT' as UIAction,
            payload: {
              products: [product],
              sceneContext: { setting: 'neutral', generateBackground: false },
            },
          },
          suggestedActions: ['Request a quote', 'Show me inverters', 'Browse all equipment'],
        };
      }
      return {
        message: 'We carry monitoring and SCADA solutions for solar, wind, and storage sites. What size installation are you monitoring?',
        suggestedActions: ['Browse equipment', 'Request a quote'],
      };
    },
  },

  // General product / equipment browsing
  {
    pattern: /product|equipment|component|catalog|browse/i,
    response: () => {
      const popular = [
        findProduct('solar-panel-jinko'),
        findProduct('wt-blade-vestas'),
        findProduct('bess-tesla-megapack'),
        findProduct('solar-inverter-sma'),
        findProduct('mount-tracker-nextracker'),
      ].filter(Boolean) as NonNullable<ReturnType<typeof findProduct>>[];
      state.lastShownProductIds = popular.map((p) => p.id);
      return {
        message: `Here are some of our most popular products across categories:\n\n${popular.map((p) => `- **${p.name}** (${p.brand}) — ${formatPrice(p.price)}: ${p.shortDescription}`).join('\n')}\n\nWe also carry inverters, mounting systems, balance-of-system components, and monitoring solutions.`,
        uiDirective: {
          action: 'SHOW_PRODUCTS' as UIAction,
          payload: {
            products: popular,
            sceneContext: { setting: 'warehouse', generateBackground: false },
          },
        },
        suggestedActions: ['Show wind turbine components', 'Browse solar panels', 'Explore energy storage', 'Request a quote'],
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
        findProduct('solar-panel-jinko'),
        findProduct('wt-blade-vestas'),
        findProduct('bess-tesla-megapack'),
      ].filter(Boolean) as NonNullable<ReturnType<typeof findProduct>>[];
      return {
        message: `Here are current list prices on some of our most popular equipment:\n\n${popular.map((p) => `- **${p.name}** — ${formatPrice(p.price)} (min ${p.attributes.minOrderQty})`).join('\n')}\n\nThese are list prices. Contract and volume pricing is available — I can generate a formal quote.`,
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

  // Sustainability / clean energy
  {
    pattern: /sustainab|carbon|green|clean/i,
    response: () => {
      const popular = [
        findProduct('solar-panel-longi'),
        findProduct('bess-byd-cube'),
        findProduct('wt-blade-vestas'),
      ].filter(Boolean) as NonNullable<ReturnType<typeof findProduct>>[];
      state.lastShownProductIds = popular.map((p) => p.id);
      return {
        message: `Every product we carry contributes to the clean energy transition. Our full catalog spans wind, solar, and energy storage — all designed to reduce carbon emissions and accelerate decarbonization.\n\n${popular.map((p) => `- **${p.name}** (${p.brand}) — ${formatPrice(p.price)}: ${p.shortDescription}`).join('\n')}\n\nNeed help calculating the carbon offset for your project?`,
        uiDirective: {
          action: 'SHOW_PRODUCTS' as UIAction,
          payload: {
            products: popular,
            sceneContext: { setting: 'neutral', generateBackground: false },
          },
        },
        suggestedActions: ['Browse solar panels', 'Show wind turbine components', 'Explore energy storage', 'Request a quote'],
      };
    },
  },

  // Lead times / availability
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
        message: 'Solar panels and inverters typically ship within 2-4 weeks. Wind turbine components are 8-16 weeks depending on configuration. Energy storage systems are 12-20 weeks for utility-scale. Which equipment are you interested in?',
        suggestedActions: ['Check a specific product', 'Browse solar panels', 'Show me what ships fastest'],
      };
    },
  },

  // Certifications / technical standards
  {
    pattern: /certif|iec|ul\b|dnv|ieee|nec/i,
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
        message: 'All our equipment meets industry certification standards including IEC, UL, DNV, IEEE, and NEC requirements. Which product do you need certification details for?',
        suggestedActions: ['Show me solar panel certifications', 'Wind turbine DNV specs', 'Inverter UL listing'],
      };
    },
  },

  // Warranty / maintenance / service
  {
    pattern: /warranty|maintenance|service|support/i,
    response: () => {
      if (state.currentProductId) {
        const product = findProduct(state.currentProductId);
        if (product) {
          return {
            message: `**${product.name}** comes with the manufacturer's standard warranty. Extended warranty and O&M service contracts are available through our service partners.\n\nI can connect you with our technical support team for warranty claims or maintenance scheduling.`,
            suggestedActions: ['Request warranty details', 'Schedule maintenance', 'Connect me with support'],
          };
        }
      }
      return {
        message: 'We offer comprehensive warranty support and can arrange O&M service contracts for all equipment we sell. Solar panels typically carry 25-year performance warranties, inverters 10-15 years, and wind components 5-10 years. What equipment do you need warranty info for?',
        suggestedActions: ['Solar panel warranties', 'Inverter service plans', 'Wind turbine maintenance'],
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
        message: 'Hello! Welcome to Formerra Plus. I can help you source wind turbine components, solar equipment, and energy storage solutions. What are you looking for?',
        suggestedActions: DISCOVERY_ACTIONS,
      };
    },
  },

  // Thanks / goodbye
  {
    pattern: /thank|thanks|bye|goodbye/i,
    response: () => ({
      message: 'You\'re welcome. Don\'t hesitate to reach out when you need renewable energy equipment support. Have a productive day.',
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
      message: 'I can help you with:\n\n- **Equipment sourcing** — wind turbine components, solar panels, inverters, energy storage, balance-of-system\n- **Order management** — track shipments, reorder equipment, check lead times\n- **Pricing & quotes** — current pricing, volume discounts, formal quotes\n- **Technical support** — certifications, data sheets, warranty information\n- **Account management** — tier status, order history, saved preferences\n\nWhat would you like to start with?',
      suggestedActions: ['Browse equipment', 'Track my orders', 'Request a quote', 'Check my account'],
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
    message: "I can help you source the right renewable energy equipment. We carry wind turbine components, solar panels, inverters, energy storage, and balance-of-system equipment. What project are you working on?",
    suggestedActions: DISCOVERY_ACTIONS,
    confidence: 0.80,
  };
};
