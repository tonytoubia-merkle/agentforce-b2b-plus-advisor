import type { CustomerProfile } from '@/types/customer';

export interface PersonaMeta {
  id: string;
  label: string;
  subtitle: string;
  traits: string[];
  profile: CustomerProfile;
}

// ─── Sarah Chen: Known Customer, Loyalty Gold ───────────────────
// Rich data: 4 orders, 2 chats, 3 meaningful events (all traceable to chats), browse data, loyalty
const sarahChen: CustomerProfile = {
  id: 'persona-sarah',
  name: 'Sarah',
  email: 'sarah.chen@example.com',

  beautyProfile: {
    skinType: 'sensitive',
    concerns: ['hydration', 'redness', 'anti-aging'],
    allergies: ['fragrance'],
    fragrancePreference: 'fragrance-free',
    communicationPrefs: { email: true, sms: true, push: false },
    preferredBrands: ['SERENE', 'LUMIERE'],
    ageRange: '30-40',
  },

  orders: [
    {
      orderId: 'ORD-2025-0847',
      orderDate: '2025-06-12',
      channel: 'online',
      status: 'completed',
      totalAmount: 94.00,
      lineItems: [
        { productId: 'cleanser-gentle', productName: 'Cloud Cream Cleanser', quantity: 1, unitPrice: 36.00 },
        { productId: 'moisturizer-sensitive', productName: 'Hydra-Calm Sensitive Moisturizer', quantity: 1, unitPrice: 58.00 },
      ],
    },
    {
      orderId: 'ORD-2025-1203',
      orderDate: '2025-09-08',
      channel: 'in-store',
      status: 'completed',
      totalAmount: 45.00,
      lineItems: [
        { productId: 'mask-hydrating', productName: 'Deep Dew Hydrating Mask', quantity: 1, unitPrice: 45.00 },
      ],
    },
    {
      orderId: 'ORD-2025-1456',
      orderDate: '2025-11-15',
      channel: 'online',
      status: 'completed',
      totalAmount: 94.00,
      lineItems: [
        { productId: 'cleanser-gentle', productName: 'Cloud Cream Cleanser', quantity: 1, unitPrice: 36.00 },
        { productId: 'moisturizer-sensitive', productName: 'Hydra-Calm Sensitive Moisturizer', quantity: 1, unitPrice: 58.00 },
      ],
    },
    {
      orderId: 'ORD-2025-1789',
      orderDate: '2025-12-20',
      channel: 'mobile-app',
      status: 'completed',
      totalAmount: 70.00,
      lineItems: [
        { productId: 'sunscreen-lightweight', productName: 'Invisible Shield SPF 50', quantity: 1, unitPrice: 42.00 },
        { productId: 'mist-refreshing', productName: 'Cooling Facial Mist', quantity: 1, unitPrice: 28.00 },
      ],
    },
  ],

  chatSummaries: [
    {
      sessionDate: '2025-09-08',
      summary: 'Sarah visited the in-store concierge asking about overnight hydration for sensitive skin. Recommended the Deep Dew Hydrating Mask. She was concerned about fragrance in skincare and confirmed she avoids all fragranced products.',
      sentiment: 'positive',
      topicsDiscussed: ['overnight hydration', 'sensitive skin', 'fragrance allergy'],
    },
    {
      sessionDate: '2025-12-18',
      summary: 'Sarah asked for travel-friendly skincare for an upcoming work trip to Mumbai (hot, humid climate). Recommended SPF 50 and Cooling Facial Mist as carry-on essentials. She also mentioned interest in trying retinol but worried about sensitivity.',
      sentiment: 'positive',
      topicsDiscussed: ['travel skincare', 'hot climate', 'SPF', 'retinol interest', 'sensitivity concern'],
    },
  ],

  // Every event here is traceable to a chat session above
  meaningfulEvents: [
    {
      eventType: 'preference',
      description: 'Strictly fragrance-free — allergic reaction to fragranced products',
      capturedAt: '2025-09-08', // from chat #1
      agentNote: 'Never recommend fragranced products to this customer',
    },
    {
      eventType: 'life-event',
      description: 'Work trip to Mumbai, India (2 weeks, hot/humid climate)',
      capturedAt: '2025-12-18', // from chat #2
      agentNote: 'Purchased travel SPF kit before departure. Trip ended around Jan 15.',
      metadata: { destination: 'Mumbai, India', climate: 'hot', tripEnd: '2026-01-15' },
    },
    {
      eventType: 'concern',
      description: 'Expressed interest in retinol but concerned about irritation on her sensitive skin',
      capturedAt: '2025-12-18', // from chat #2
      agentNote: 'Consider recommending encapsulated retinol (gentler delivery) when she brings this up again',
    },
  ],

  agentCapturedProfile: {
    // Captured from chat #2 (2025-12-18) — she mentioned her work travel schedule
    workEnvironment: {
      value: 'Office, travels frequently for work',
      capturedAt: '2025-12-18',
      capturedFrom: 'chat session 2025-12-18',
      confidence: 'stated',
    },
    // Captured from chat #1 (2025-09-08) — discussed her evening routine
    morningRoutineTime: {
      value: 'Has about 10 minutes in the morning, prefers to do more at night',
      capturedAt: '2025-09-08',
      capturedFrom: 'chat session 2025-09-08',
      confidence: 'stated',
    },
    // Captured from chat #1 — she explicitly said she avoids fragrance
    beautyPriority: {
      value: 'Ingredient-conscious, prioritizes gentle/clean formulations',
      capturedAt: '2025-09-08',
      capturedFrom: 'chat session 2025-09-08',
      confidence: 'inferred',
    },
    // Not yet captured: birthday, anniversary, giftsFor, exerciseRoutine, priceRange
  },

  browseSessions: [
    {
      sessionDate: '2026-01-22',
      categoriesBrowsed: ['serum'],
      productsViewed: ['serum-retinol', 'serum-anti-aging'],
      durationMinutes: 8,
      device: 'mobile',
    },
    {
      sessionDate: '2026-01-28',
      categoriesBrowsed: ['eye-cream', 'serum'],
      productsViewed: ['eye-cream', 'serum-vitamin-c'],
      durationMinutes: 5,
      device: 'desktop',
    },
  ],

  loyalty: {
    tier: 'gold',
    pointsBalance: 2450,
    lifetimePoints: 4800,
    memberSince: '2024-11-01',
    rewardsAvailable: [
      { name: '$10 off next purchase', pointsCost: 1000 },
      { name: 'Free deluxe sample set', pointsCost: 1500 },
    ],
    nextTierThreshold: 6000,
    tierExpiryDate: '2026-11-01',
  },

  merkuryIdentity: {
    merkuryId: 'MRK-SC-90210',
    identityTier: 'known',
    confidence: 0.97,
    resolvedAt: new Date().toISOString(),
  },

  // Legacy fields
  purchaseHistory: [
    { productId: 'cleanser-gentle', productName: 'Cloud Cream Cleanser', purchaseDate: '2025-11-15', quantity: 1, rating: 5 },
    { productId: 'moisturizer-sensitive', productName: 'Hydra-Calm Sensitive Moisturizer', purchaseDate: '2025-11-15', quantity: 1, rating: 5 },
    { productId: 'sunscreen-lightweight', productName: 'Invisible Shield SPF 50', purchaseDate: '2025-12-20', quantity: 1, rating: 4 },
    { productId: 'mist-refreshing', productName: 'Cooling Facial Mist', purchaseDate: '2025-12-20', quantity: 1 },
  ],
  savedPaymentMethods: [
    { id: 'pm-1', type: 'card', last4: '4242', brand: 'visa', isDefault: true },
  ],
  shippingAddresses: [
    { id: 'addr-1', name: 'Sarah Chen', line1: '123 Main St', city: 'San Francisco', state: 'CA', postalCode: '94102', country: 'US', isDefault: true },
  ],
  travelPreferences: { upcomingTrips: [], prefersTravelSize: true },
  recentActivity: [
    { type: 'trip', description: 'Completed work trip to Mumbai', date: '2026-01-15', metadata: { destination: 'Mumbai, India', climate: 'hot', purpose: 'work' } },
    { type: 'purchase', description: 'Purchased travel SPF kit for Mumbai trip', date: '2025-12-20', productIds: ['sunscreen-lightweight', 'mist-refreshing'] },
    { type: 'browse', description: 'Browsed retinol serums', date: '2026-01-22', productIds: ['serum-retinol'] },
  ],
  loyaltyTier: 'gold',
  lifetimeValue: 303,
};

// ─── James Rodriguez: Known Customer, NO Loyalty ────────────────
// 1 order, 2 chats (second is recent and captures anniversary intent), events match chats
const jamesRodriguez: CustomerProfile = {
  id: 'persona-james',
  name: 'James',
  email: 'james.rodriguez@example.com',

  beautyProfile: {
    skinType: 'oily',
    concerns: ['acne', 'oil control', 'pores'],
    allergies: [],
    preferredBrands: ['DERMAFIX'],
    ageRange: '25-35',
  },

  orders: [
    {
      orderId: 'ORD-2025-0612',
      orderDate: '2025-07-10',
      channel: 'online',
      status: 'completed',
      totalAmount: 32.00,
      lineItems: [
        { productId: 'cleanser-acne', productName: 'Clear Start Salicylic Cleanser', quantity: 1, unitPrice: 32.00 },
      ],
    },
  ],

  chatSummaries: [
    {
      sessionDate: '2025-07-10',
      summary: 'James asked for help with oily skin and breakouts. Recommended the Clear Start Salicylic Cleanser as a starting point. He mentioned he was new to skincare and wanted to keep things simple.',
      sentiment: 'positive',
      topicsDiscussed: ['oily skin', 'acne', 'beginner routine'],
    },
    {
      sessionDate: '2026-01-25',
      summary: 'James came back looking for a fragrance gift for his partner — anniversary coming up. Browsed Jardin de Nuit and Bois Sauvage together. He seemed drawn to the floral notes in Jardin de Nuit. Also mentioned wanting to build out his skincare routine beyond just the cleanser.',
      sentiment: 'positive',
      topicsDiscussed: ['fragrance', 'gifting', 'anniversary', 'skincare routine expansion'],
    },
  ],

  // Every event traceable to a chat above
  meaningfulEvents: [
    {
      eventType: 'intent',
      description: 'Wants to build a proper skincare routine beyond just a cleanser',
      capturedAt: '2025-07-10', // from chat #1
      agentNote: 'Only purchased cleanser so far. Good candidate for a step-up to serum + moisturizer.',
    },
    {
      eventType: 'intent',
      description: 'Anniversary coming up — looking for a fragrance gift for his partner',
      capturedAt: '2026-01-25', // from chat #2
      agentNote: 'Browsed Jardin de Nuit and Bois Sauvage. Seemed drawn to floral scents for gifting.',
      metadata: { occasion: 'anniversary', giftFor: 'partner' },
    },
  ],

  agentCapturedProfile: {
    // Captured from chat #2 (2026-01-25) — mentioned anniversary and partner
    anniversary: {
      value: 'Coming up in February',
      capturedAt: '2026-01-25',
      capturedFrom: 'chat session 2026-01-25',
      confidence: 'stated',
    },
    giftsFor: {
      value: ['partner'],
      capturedAt: '2026-01-25',
      capturedFrom: 'chat session 2026-01-25',
      confidence: 'stated',
    },
    // Captured from chat #1 (2025-07-10) — said he's new to skincare
    beautyPriority: {
      value: 'Wants to keep it simple, new to skincare',
      capturedAt: '2025-07-10',
      capturedFrom: 'chat session 2025-07-10',
      confidence: 'stated',
    },
    // Not yet captured: birthday, morningRoutineTime, exerciseRoutine, workEnvironment, priceRange
  },

  browseSessions: [
    {
      sessionDate: '2026-01-25',
      categoriesBrowsed: ['fragrance'],
      productsViewed: ['fragrance-floral', 'fragrance-woody'],
      durationMinutes: 12,
      device: 'mobile',
    },
    {
      sessionDate: '2026-01-20',
      categoriesBrowsed: ['serum'],
      productsViewed: ['serum-niacinamide'],
      durationMinutes: 4,
      device: 'desktop',
    },
  ],

  loyalty: null, // Not a loyalty member — opportunity to enroll

  merkuryIdentity: {
    merkuryId: 'MRK-JR-78701',
    identityTier: 'known',
    confidence: 0.92,
    resolvedAt: new Date().toISOString(),
  },

  // Legacy fields
  purchaseHistory: [
    { productId: 'cleanser-acne', productName: 'Clear Start Salicylic Cleanser', purchaseDate: '2025-07-10', quantity: 1, rating: 4 },
  ],
  savedPaymentMethods: [
    { id: 'pm-2', type: 'card', last4: '8888', brand: 'mastercard', isDefault: true },
  ],
  shippingAddresses: [
    { id: 'addr-2', name: 'James Rodriguez', line1: '456 Oak Ave', city: 'Austin', state: 'TX', postalCode: '78701', country: 'US', isDefault: true },
  ],
  recentActivity: [
    { type: 'browse', description: 'Browsed fragrances — anniversary coming up', date: '2026-01-25', productIds: ['fragrance-floral', 'fragrance-woody'] },
    { type: 'browse', description: 'Viewed pore-refining products', date: '2026-01-20', productIds: ['serum-niacinamide'] },
  ],
  loyaltyTier: undefined,
  lifetimeValue: 32,
};

// ─── Aisha Patel: Appended Only (Unknown to Brand) ─────────────
// Zero brand data. Only Merkury appended 3P data.
const aishaPatel: CustomerProfile = {
  id: 'persona-aisha',
  name: 'Aisha',
  email: '',

  beautyProfile: {
    skinType: 'combination',
    concerns: [],
    allergies: [],
    preferredBrands: [],
  },

  orders: [],
  chatSummaries: [],
  meaningfulEvents: [],
  browseSessions: [],
  loyalty: null,
  purchaseHistory: [],
  savedPaymentMethods: [],
  shippingAddresses: [],
  recentActivity: [],

  merkuryIdentity: {
    merkuryId: 'MRK-AP-10001',
    identityTier: 'appended',
    confidence: 0.74,
    resolvedAt: new Date().toISOString(),
  },

  appendedProfile: {
    ageRange: '28-35',
    gender: 'female',
    householdIncome: '$100k-$150k',
    hasChildren: false,
    homeOwnership: 'rent',
    educationLevel: "bachelor's",
    interests: ['luxury beauty', 'clean beauty', 'yoga', 'wellness'],
    lifestyleSignals: ['wellness-focused', 'urban professional', 'fitness enthusiast'],
    geoRegion: 'New York Metro',
  },
};

// ─── Anonymous Visitor ──────────────────────────────────────────
// Merkury fired but found no match at all.
const anonymousVisitor: CustomerProfile = {
  id: 'persona-anonymous',
  name: 'Guest',
  email: '',

  beautyProfile: {
    skinType: 'normal',
    concerns: [],
    allergies: [],
    preferredBrands: [],
  },

  orders: [],
  chatSummaries: [],
  meaningfulEvents: [],
  browseSessions: [],
  loyalty: null,
  purchaseHistory: [],
  savedPaymentMethods: [],
  shippingAddresses: [],
  recentActivity: [],

  merkuryIdentity: {
    merkuryId: '',
    identityTier: 'anonymous',
    confidence: 0,
    resolvedAt: new Date().toISOString(),
  },
};

// ─── Maya Thompson: Known, Loyalty Platinum, Makeup Enthusiast ──
// Heavy buyer, 3 chats, loves makeup, recently returned an item
const mayaThompson: CustomerProfile = {
  id: 'persona-maya',
  name: 'Maya',
  email: 'maya.thompson@example.com',

  beautyProfile: {
    skinType: 'normal',
    concerns: ['brightening', 'glow'],
    allergies: [],
    fragrancePreference: 'love',
    communicationPrefs: { email: true, sms: true, push: true },
    preferredBrands: ['LUMIERE', 'MAISON'],
    ageRange: '25-30',
  },

  orders: [
    {
      orderId: 'ORD-2025-0301',
      orderDate: '2025-03-14',
      channel: 'online',
      status: 'completed',
      totalAmount: 118.00,
      lineItems: [
        { productId: 'foundation-dewy', productName: 'Skin Glow Serum Foundation', quantity: 1, unitPrice: 52.00 },
        { productId: 'blush-silk', productName: 'Silk Petal Blush', quantity: 1, unitPrice: 38.00 },
        { productId: 'mascara-volume', productName: 'Lash Drama Volume Mascara', quantity: 1, unitPrice: 28.00 },
      ],
    },
    {
      orderId: 'ORD-2025-0589',
      orderDate: '2025-06-02',
      channel: 'in-store',
      status: 'completed',
      totalAmount: 159.00,
      lineItems: [
        { productId: 'lipstick-velvet', productName: 'Velvet Matte Lip Color', quantity: 1, unitPrice: 34.00 },
        { productId: 'fragrance-floral', productName: 'Jardin de Nuit Eau de Parfum', quantity: 1, unitPrice: 125.00 },
      ],
    },
    {
      orderId: 'ORD-2025-0940',
      orderDate: '2025-09-18',
      channel: 'online',
      status: 'completed',
      totalAmount: 124.00,
      lineItems: [
        { productId: 'serum-vitamin-c', productName: 'Glow Boost Vitamin C Serum', quantity: 1, unitPrice: 72.00 },
        { productId: 'foundation-dewy', productName: 'Skin Glow Serum Foundation', quantity: 1, unitPrice: 52.00 },
      ],
    },
    {
      orderId: 'ORD-2025-1501',
      orderDate: '2025-12-01',
      channel: 'online',
      status: 'returned',
      totalAmount: 95.00,
      lineItems: [
        { productId: 'serum-anti-aging', productName: 'Peptide Lift Pro Serum', quantity: 1, unitPrice: 95.00 },
      ],
    },
    {
      orderId: 'ORD-2026-0088',
      orderDate: '2026-01-10',
      channel: 'mobile-app',
      status: 'completed',
      totalAmount: 66.00,
      lineItems: [
        { productId: 'shampoo-repair', productName: 'Bond Repair Shampoo', quantity: 1, unitPrice: 32.00 },
        { productId: 'conditioner-hydrating', productName: 'Silk Hydration Conditioner', quantity: 1, unitPrice: 34.00 },
      ],
    },
  ],

  chatSummaries: [
    {
      sessionDate: '2025-06-02',
      summary: 'Maya visited in-store looking for a signature fragrance. Tested several options and loved Jardin de Nuit — said the jasmine-sandalwood blend felt "like her." Also picked up a new lip color.',
      sentiment: 'positive',
      topicsDiscussed: ['fragrance', 'in-store experience', 'lipstick'],
    },
    {
      sessionDate: '2025-12-05',
      summary: 'Maya reached out about returning the Peptide Lift Pro Serum — she felt it was too heavy for her skin type and didn\'t see results after 2 weeks. She asked for a lighter anti-aging alternative.',
      sentiment: 'neutral',
      topicsDiscussed: ['product return', 'anti-aging', 'serum texture preference'],
    },
    {
      sessionDate: '2026-01-10',
      summary: 'Maya asked about haircare for color-treated hair. Recommended the Bond Repair duo. She mentioned she recently got highlights and was worried about damage.',
      sentiment: 'positive',
      topicsDiscussed: ['haircare', 'color-treated hair', 'damage repair'],
    },
  ],

  meaningfulEvents: [
    {
      eventType: 'preference',
      description: 'Jardin de Nuit is her signature fragrance — "feels like me"',
      capturedAt: '2025-06-02', // from chat #1
      agentNote: 'Could use this for personalized scent recommendations or layering suggestions',
    },
    {
      eventType: 'concern',
      description: 'Returned Peptide Lift Pro — found it too heavy, wants lighter anti-aging options',
      capturedAt: '2025-12-05', // from chat #2
      agentNote: 'Avoid recommending heavy serums. Try Vitamin C or encapsulated retinol instead.',
    },
    {
      eventType: 'life-event',
      description: 'Recently got hair highlights, concerned about color damage',
      capturedAt: '2026-01-10', // from chat #3
      agentNote: 'Recommend bond-repair products and color-safe formulas',
    },
  ],

  agentCapturedProfile: {
    // From chat #1 — Jardin de Nuit is her signature
    beautyPriority: {
      value: 'Loves makeup and fragrance, views beauty as self-expression',
      capturedAt: '2025-06-02',
      capturedFrom: 'chat session 2025-06-02',
      confidence: 'inferred',
    },
    // From chat #2 — returned a product because texture was wrong
    priceRange: {
      value: 'Willing to spend on premium products but expects them to work',
      capturedAt: '2025-12-05',
      capturedFrom: 'chat session 2025-12-05',
      confidence: 'inferred',
    },
    makeupFrequency: {
      value: 'Daily — foundation, blush, mascara are staples',
      capturedAt: '2025-06-02',
      capturedFrom: 'inferred from purchase pattern',
      confidence: 'inferred',
    },
    // Not yet captured: birthday, anniversary, morningRoutineTime, exerciseRoutine, workEnvironment
  },

  browseSessions: [
    {
      sessionDate: '2026-01-20',
      categoriesBrowsed: ['foundation', 'blush'],
      productsViewed: ['foundation-dewy', 'blush-silk'],
      durationMinutes: 6,
      device: 'mobile',
    },
  ],

  loyalty: {
    tier: 'platinum',
    pointsBalance: 5200,
    lifetimePoints: 12400,
    memberSince: '2024-03-01',
    rewardsAvailable: [
      { name: '$25 off next purchase', pointsCost: 2000 },
      { name: 'Exclusive early access event', pointsCost: 3000 },
    ],
    tierExpiryDate: '2027-03-01',
  },

  merkuryIdentity: {
    merkuryId: 'MRK-MT-30302',
    identityTier: 'known',
    confidence: 0.99,
    resolvedAt: new Date().toISOString(),
  },

  purchaseHistory: [],
  savedPaymentMethods: [
    { id: 'pm-3', type: 'applepay', isDefault: true },
  ],
  shippingAddresses: [
    { id: 'addr-3', name: 'Maya Thompson', line1: '789 Elm St', city: 'Los Angeles', state: 'CA', postalCode: '90028', country: 'US', isDefault: true },
  ],
  recentActivity: [],
  lifetimeValue: 562,
};

// ─── David Kim: Known, Loyalty Silver, Routine Builder ──────────
// 2 orders, 1 chat about building a routine, methodical buyer
const davidKim: CustomerProfile = {
  id: 'persona-david',
  name: 'David',
  email: 'david.kim@example.com',

  beautyProfile: {
    skinType: 'combination',
    concerns: ['pores', 'texture', 'oil control'],
    allergies: [],
    preferredBrands: ['DERMAFIX', 'SERENE'],
    ageRange: '30-40',
  },

  orders: [
    {
      orderId: 'ORD-2025-0720',
      orderDate: '2025-08-15',
      channel: 'online',
      status: 'completed',
      totalAmount: 70.00,
      lineItems: [
        { productId: 'cleanser-acne', productName: 'Clear Start Salicylic Cleanser', quantity: 1, unitPrice: 32.00 },
        { productId: 'serum-niacinamide', productName: 'Pore Refine Niacinamide Serum', quantity: 1, unitPrice: 38.00 },
      ],
    },
    {
      orderId: 'ORD-2025-1320',
      orderDate: '2025-11-22',
      channel: 'online',
      status: 'completed',
      totalAmount: 76.00,
      lineItems: [
        { productId: 'toner-aha', productName: 'Glow Tonic AHA Toner', quantity: 1, unitPrice: 34.00 },
        { productId: 'sunscreen-lightweight', productName: 'Invisible Shield SPF 50', quantity: 1, unitPrice: 42.00 },
      ],
    },
  ],

  chatSummaries: [
    {
      sessionDate: '2025-08-15',
      summary: 'David asked for help building a simple skincare routine for combination skin. He wanted to address enlarged pores and occasional oiliness. Recommended the Salicylic Cleanser and Niacinamide Serum as a two-step starting point. He was very methodical — asked about ingredient interactions and application order.',
      sentiment: 'positive',
      topicsDiscussed: ['combination skin', 'pores', 'routine building', 'ingredient interactions'],
    },
  ],

  meaningfulEvents: [
    {
      eventType: 'preference',
      description: 'Very methodical about skincare — wants to understand ingredient interactions and correct application order',
      capturedAt: '2025-08-15', // from chat #1
      agentNote: 'Provide detailed ingredient explanations when recommending. This customer appreciates the science.',
    },
  ],

  agentCapturedProfile: {
    // From chat #1 — asked detailed ingredient questions
    beautyPriority: {
      value: 'Science-driven, wants to understand how ingredients interact before buying',
      capturedAt: '2025-08-15',
      capturedFrom: 'chat session 2025-08-15',
      confidence: 'stated',
    },
    morningRoutineTime: {
      value: 'Has time for a full routine — not rushed',
      capturedAt: '2025-08-15',
      capturedFrom: 'chat session 2025-08-15',
      confidence: 'inferred',
    },
    // Not yet captured: birthday, anniversary, giftsFor, exerciseRoutine, workEnvironment, priceRange
  },

  browseSessions: [
    {
      sessionDate: '2026-01-15',
      categoriesBrowsed: ['serum', 'moisturizer'],
      productsViewed: ['serum-retinol', 'moisturizer-sensitive'],
      durationMinutes: 11,
      device: 'desktop',
    },
    {
      sessionDate: '2026-01-27',
      categoriesBrowsed: ['eye-cream'],
      productsViewed: ['eye-cream'],
      durationMinutes: 3,
      device: 'mobile',
    },
  ],

  loyalty: {
    tier: 'silver',
    pointsBalance: 980,
    lifetimePoints: 1460,
    memberSince: '2025-08-15',
    rewardsAvailable: [
      { name: '$5 off next purchase', pointsCost: 500 },
    ],
    nextTierThreshold: 3000,
    tierExpiryDate: '2026-08-15',
  },

  merkuryIdentity: {
    merkuryId: 'MRK-DK-60614',
    identityTier: 'known',
    confidence: 0.94,
    resolvedAt: new Date().toISOString(),
  },

  purchaseHistory: [],
  savedPaymentMethods: [
    { id: 'pm-4', type: 'card', last4: '1234', brand: 'amex', isDefault: true },
  ],
  shippingAddresses: [
    { id: 'addr-4', name: 'David Kim', line1: '321 Lake Shore Dr', city: 'Chicago', state: 'IL', postalCode: '60614', country: 'US', isDefault: true },
  ],
  recentActivity: [],
  lifetimeValue: 146,
};

// ─── Priya Sharma: Appended, Different Interests ────────────────
// Merkury appended only, but different profile from Aisha — older, has children, luxury/anti-aging focus
const priyaSharma: CustomerProfile = {
  id: 'persona-priya',
  name: 'Priya',
  email: '',

  beautyProfile: {
    skinType: 'combination',
    concerns: [],
    allergies: [],
    preferredBrands: [],
  },

  orders: [],
  chatSummaries: [],
  meaningfulEvents: [],
  browseSessions: [],
  loyalty: null,
  purchaseHistory: [],
  savedPaymentMethods: [],
  shippingAddresses: [],
  recentActivity: [],

  merkuryIdentity: {
    merkuryId: 'MRK-PS-75201',
    identityTier: 'appended',
    confidence: 0.68,
    resolvedAt: new Date().toISOString(),
  },

  appendedProfile: {
    ageRange: '40-50',
    gender: 'female',
    householdIncome: '$150k-$250k',
    hasChildren: true,
    homeOwnership: 'own',
    educationLevel: "master's",
    interests: ['luxury beauty', 'anti-aging', 'spa treatments', 'fine dining'],
    lifestyleSignals: ['affluent suburban', 'self-care focused', 'frequent spa-goer'],
    geoRegion: 'Dallas-Fort Worth',
  },
};

// ─── Marcus Williams: Known, 1 order, 1 chat, brand new ────────
// Just getting started — 1 order last week, 1 chat that prompted it, no loyalty yet
const marcusWilliams: CustomerProfile = {
  id: 'persona-marcus',
  name: 'Marcus',
  email: 'marcus.w@example.com',

  beautyProfile: {
    skinType: 'dry',
    concerns: ['hydration', 'dullness'],
    allergies: [],
    preferredBrands: [],
    ageRange: '20-25',
  },

  orders: [
    {
      orderId: 'ORD-2026-0102',
      orderDate: '2026-01-24',
      channel: 'online',
      status: 'completed',
      totalAmount: 36.00,
      lineItems: [
        { productId: 'cleanser-gentle', productName: 'Cloud Cream Cleanser', quantity: 1, unitPrice: 36.00 },
      ],
    },
  ],

  chatSummaries: [
    {
      sessionDate: '2026-01-24',
      summary: 'Marcus is brand new to skincare. A friend recommended this brand. He has dry, dull skin and wanted to start with the basics. Recommended the Cloud Cream Cleanser as a gentle first step. He asked what to add next.',
      sentiment: 'positive',
      topicsDiscussed: ['beginner skincare', 'dry skin', 'first purchase', 'next steps'],
    },
  ],

  meaningfulEvents: [
    {
      eventType: 'intent',
      description: 'Complete skincare beginner — wants to know what to add next after his cleanser',
      capturedAt: '2026-01-24', // from chat #1
      agentNote: 'Recommend moisturizer as next step, then SPF. Keep it simple — he\'s just starting out.',
    },
  ],

  agentCapturedProfile: {
    // From chat #1 — mentioned a friend recommended the brand
    beautyPriority: {
      value: 'Total beginner, friend recommended the brand, wants to keep it simple',
      capturedAt: '2026-01-24',
      capturedFrom: 'chat session 2026-01-24',
      confidence: 'stated',
    },
    // Not yet captured: everything else — this is a brand new customer
  },

  browseSessions: [],
  loyalty: null,

  merkuryIdentity: {
    merkuryId: 'MRK-MW-11201',
    identityTier: 'known',
    confidence: 0.88,
    resolvedAt: new Date().toISOString(),
  },

  purchaseHistory: [],
  savedPaymentMethods: [
    { id: 'pm-6', type: 'card', last4: '5555', brand: 'visa', isDefault: true },
  ],
  shippingAddresses: [
    { id: 'addr-6', name: 'Marcus Williams', line1: '55 W 46th St', city: 'New York', state: 'NY', postalCode: '10036', country: 'US', isDefault: true },
  ],
  recentActivity: [],
  lifetimeValue: 36,
};

export const PERSONAS: PersonaMeta[] = [
  {
    id: 'sarah',
    label: 'Sarah Chen',
    subtitle: 'Known · Loyalty Gold',
    traits: ['Sensitive skin', 'Recent Mumbai trip', '4 orders', 'Browsing retinol', '2,450 loyalty pts'],
    profile: sarahChen,
  },
  {
    id: 'james',
    label: 'James Rodriguez',
    subtitle: 'Known · No Loyalty',
    traits: ['Oily skin', 'Anniversary gift search', '1 order', '2 chats', 'Not a loyalty member'],
    profile: jamesRodriguez,
  },
  {
    id: 'maya',
    label: 'Maya Thompson',
    subtitle: 'Known · Loyalty Platinum',
    traits: ['Makeup enthusiast', '5 orders', 'Returned a serum', 'New highlights', '5,200 loyalty pts'],
    profile: mayaThompson,
  },
  {
    id: 'david',
    label: 'David Kim',
    subtitle: 'Known · Loyalty Silver',
    traits: ['Combination skin', 'Routine builder', '2 orders', 'Methodical buyer', 'Browsing retinol'],
    profile: davidKim,
  },
  {
    id: 'marcus',
    label: 'Marcus Williams',
    subtitle: 'Known · Brand New',
    traits: ['Dry skin', 'Skincare beginner', '1 order last week', 'No loyalty yet'],
    profile: marcusWilliams,
  },
  {
    id: 'aisha',
    label: 'Aisha Patel',
    subtitle: 'Merkury Appended Only',
    traits: ['New to brand', 'Clean beauty interest', 'Wellness-focused', 'NYC', 'No purchase history'],
    profile: aishaPatel,
  },
  {
    id: 'priya',
    label: 'Priya Sharma',
    subtitle: 'Merkury Appended Only',
    traits: ['New to brand', 'Anti-aging interest', 'Affluent suburban', 'Dallas', 'Has children'],
    profile: priyaSharma,
  },
  {
    id: 'anonymous',
    label: 'Anonymous Visitor',
    subtitle: 'Merkury: No Match',
    traits: ['No identity resolved', 'No history', 'Discovery mode'],
    profile: anonymousVisitor,
  },
];

export function getPersonaById(id: string): PersonaMeta | undefined {
  return PERSONAS.find((p) => p.id === id);
}

/** Minimal stubs for persona selector — enough to render cards before profile loads. */
export interface PersonaStub {
  id: string;
  merkuryId: string;
  identityTier: 'known' | 'appended' | 'anonymous';
  defaultLabel: string;
  defaultSubtitle: string;
}

export const PERSONA_STUBS: PersonaStub[] = [
  { id: 'sarah', merkuryId: 'MRK-SC-90210', identityTier: 'known', defaultLabel: 'Sarah Chen', defaultSubtitle: 'Merkury: Matched' },
  { id: 'james', merkuryId: 'MRK-JR-78701', identityTier: 'known', defaultLabel: 'James Rodriguez', defaultSubtitle: 'Merkury: Matched' },
  { id: 'maya', merkuryId: 'MRK-MT-30302', identityTier: 'known', defaultLabel: 'Maya Thompson', defaultSubtitle: 'Merkury: Matched' },
  { id: 'david', merkuryId: 'MRK-DK-60614', identityTier: 'known', defaultLabel: 'David Kim', defaultSubtitle: 'Merkury: Matched' },
  { id: 'marcus', merkuryId: 'MRK-MW-11201', identityTier: 'known', defaultLabel: 'Marcus Williams', defaultSubtitle: 'Merkury: Matched' },
  { id: 'aisha', merkuryId: 'MRK-AP-10001', identityTier: 'appended', defaultLabel: 'Aisha Patel', defaultSubtitle: 'Merkury: Matched · Appended Only' },
  { id: 'priya', merkuryId: 'MRK-PS-75201', identityTier: 'appended', defaultLabel: 'Priya Sharma', defaultSubtitle: 'Merkury: Matched · Appended Only' },
  { id: 'anonymous', merkuryId: '', identityTier: 'anonymous', defaultLabel: 'Anonymous Visitor', defaultSubtitle: 'Merkury: No Match' },
];
