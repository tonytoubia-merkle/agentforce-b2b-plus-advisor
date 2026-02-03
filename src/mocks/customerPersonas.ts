import type { CustomerProfile } from '@/types/customer';

// ─── Persona Stubs (sidebar display) ────────────────────────────
export interface PersonaStub {
  id: string;
  defaultLabel: string;
  defaultSubtitle: string;
  identityTier: 'known' | 'appended' | 'anonymous';
  merkuryId?: string;
}

export const PERSONA_STUBS: PersonaStub[] = [
  {
    id: 'rachel-nguyen',
    defaultLabel: 'Rachel Nguyen',
    defaultSubtitle: 'Known · Gold Account',
    identityTier: 'known',
    merkuryId: 'MRK-RN-001',
  },
  {
    id: 'tom-brennan',
    defaultLabel: 'Tom Brennan',
    defaultSubtitle: 'Known · No Tier',
    identityTier: 'known',
    merkuryId: 'MRK-TB-002',
  },
  {
    id: 'lisa-park',
    defaultLabel: 'Lisa Park',
    defaultSubtitle: 'Known · Platinum Account',
    identityTier: 'known',
    merkuryId: 'MRK-LP-003',
  },
  {
    id: 'carlos-mendez',
    defaultLabel: 'Carlos Mendez',
    defaultSubtitle: 'Known · Silver Account',
    identityTier: 'known',
    merkuryId: 'MRK-CM-004',
  },
  {
    id: 'jake-morrison',
    defaultLabel: 'Jake Morrison',
    defaultSubtitle: 'Known · New Account',
    identityTier: 'known',
    merkuryId: 'MRK-JM-005',
  },
  {
    id: 'patel-industries',
    defaultLabel: 'Patel Industries',
    defaultSubtitle: 'Appended Only',
    identityTier: 'appended',
    merkuryId: 'MRK-PI-006',
  },
  {
    id: 'greenfield-mfg',
    defaultLabel: 'Greenfield Manufacturing',
    defaultSubtitle: 'Appended Only',
    identityTier: 'appended',
    merkuryId: 'MRK-GM-007',
  },
  {
    id: 'anonymous',
    defaultLabel: 'Anonymous Visitor',
    defaultSubtitle: 'Merkury: No Match',
    identityTier: 'anonymous',
  },
];

// ─── Full Persona Profiles ──────────────────────────────────────

interface PersonaWithProfile {
  stub: PersonaStub;
  profile: CustomerProfile;
}

const PERSONAS: PersonaWithProfile[] = [
  // ────────────────────────────────────────────────────────────────
  // 1. Rachel Nguyen — Procurement Manager, Automotive Tier 1
  // Known, Gold tier, 6 orders, heavy SABIC/Nylon buyer
  // ────────────────────────────────────────────────────────────────
  {
    stub: PERSONA_STUBS[0],
    profile: {
      id: 'persona-rachel-nguyen',
      name: 'Rachel Nguyen',
      email: 'rachel.nguyen@spectraauto.com',
      company: 'Spectra Automotive Components',
      jobTitle: 'Senior Procurement Manager',

      beautyProfile: {
        industry: 'Automotive',
        primaryApplications: ['under-hood components', 'structural brackets', 'interior trim'],
        certifications: ['IATF 16949', 'ISO 9001'],
        preferredProcessingMethods: ['injection-molding'],
        preferredResins: ['Nylon 6/6', 'Polycarbonate', 'ABS', 'PBT'],
        preferredBrands: ['SABIC', 'BASF', 'LyondellBasell'],
        volumeTier: 'high-volume',
      },

      orders: [
        {
          orderId: 'FPO-2025-4821',
          orderDate: '2025-09-15',
          channel: 'online',
          lineItems: [
            { productId: 'resin-nylon-ultramid', productName: 'Ultramid® Nylon 6/6 A3WG6', quantity: 20000, unitPrice: 4.10, unit: 'lb' },
            { productId: 'resin-pbt-valox', productName: 'VALOX™ PBT Resin 420', quantity: 5000, unitPrice: 3.20, unit: 'lb' },
          ],
          totalAmount: 98000,
          status: 'completed',
          poNumber: 'PO-SAC-2025-0891',
        },
        {
          orderId: 'FPO-2025-5102',
          orderDate: '2025-10-22',
          channel: 'sales-rep',
          lineItems: [
            { productId: 'resin-pc-lexan', productName: 'LEXAN™ Polycarbonate Resin 141R', quantity: 10000, unitPrice: 3.85, unit: 'lb' },
          ],
          totalAmount: 38500,
          status: 'completed',
          poNumber: 'PO-SAC-2025-0923',
        },
        {
          orderId: 'FPO-2025-5587',
          orderDate: '2025-11-18',
          channel: 'online',
          lineItems: [
            { productId: 'resin-nylon-ultramid', productName: 'Ultramid® Nylon 6/6 A3WG6', quantity: 20000, unitPrice: 4.10, unit: 'lb' },
            { productId: 'resin-abs-cycolac', productName: 'Cycolac™ ABS MG47', quantity: 8000, unitPrice: 1.65, unit: 'lb' },
          ],
          totalAmount: 95200,
          status: 'shipped',
          poNumber: 'PO-SAC-2025-0958',
          trackingNumber: 'TRK-789456123',
          estimatedDelivery: '2025-12-02',
        },
        {
          orderId: 'FPO-2025-5890',
          orderDate: '2025-12-01',
          channel: 'online',
          lineItems: [
            { productId: 'resin-pbt-valox', productName: 'VALOX™ PBT Resin 420', quantity: 10000, unitPrice: 3.20, unit: 'lb' },
          ],
          totalAmount: 32000,
          status: 'processing',
          poNumber: 'PO-SAC-2025-0972',
        },
      ],
      purchaseHistory: [],

      chatSummaries: [
        {
          sessionDate: '2025-10-05',
          summary: 'Discussed Q1 2026 volume forecast for nylon and PC. Rachel mentioned Spectra is ramping a new EV battery housing program and may need flame-retardant grades. Asked about lead time guarantees for 20k+ lb orders.',
          sentiment: 'positive',
          topicsDiscussed: ['volume forecast', 'EV battery housing', 'flame-retardant nylon', 'lead times'],
        },
        {
          sessionDate: '2025-11-12',
          summary: 'Followed up on the VALOX PBT order. Rachel flagged that the last shipment had slightly off-spec color consistency. Opened a quality ticket. Also inquired about recycled-content PC options for a new sustainability mandate from their OEM customer.',
          sentiment: 'neutral',
          topicsDiscussed: ['quality issue', 'color consistency', 'recycled content', 'sustainability mandate'],
        },
      ],

      meaningfulEvents: [
        {
          eventType: 'intent',
          description: 'EV battery housing program — needs FR nylon by Q1 2026',
          capturedAt: '2025-10-05',
          agentNote: 'High-priority opportunity. Route to engineering team for FR grade recommendation.',
        },
        {
          eventType: 'concern',
          description: 'Color consistency issue on VALOX PBT shipment (lot FPO-5102)',
          capturedAt: '2025-11-12',
          agentNote: 'Quality ticket QT-2025-0334 opened. Follow up with QA team.',
        },
        {
          eventType: 'preference',
          description: 'Prefers Net 30 terms and consolidated monthly shipments',
          capturedAt: '2025-09-20',
        },
        {
          eventType: 'intent',
          description: 'OEM customer mandating 25% recycled content by 2027',
          capturedAt: '2025-11-12',
          agentNote: 'Present EcoCircle rPET and recycled-content PC options at next check-in.',
        },
      ],

      browseSessions: [
        {
          sessionDate: '2025-11-28',
          categoriesBrowsed: ['engineered-resin', 'sustainable-resin', 'recycled-resin'],
          productsViewed: ['resin-nylon-ultramid', 'resin-rpet-clear', 'resin-pc-lexan'],
          durationMinutes: 18,
          device: 'desktop',
        },
      ],

      loyalty: {
        tier: 'gold',
        pointsBalance: 12400,
        lifetimePoints: 38500,
        memberSince: '2023-03-15',
        rewardsAvailable: [
          { name: '5% off next order', pointsCost: 5000 },
          { name: 'Priority shipping upgrade', pointsCost: 3000 },
        ],
      },

      agentCapturedProfile: {
        annualVolume: { value: '~200,000 lbs/year across resins', capturedAt: '2025-10-05', capturedFrom: 'chat', confidence: 'stated' },
        budgetCycle: { value: 'Q4 planning for next fiscal year', capturedAt: '2025-10-05', capturedFrom: 'chat', confidence: 'stated' },
        primaryApplication: { value: 'Automotive under-hood & structural', capturedAt: '2025-09-15', capturedFrom: 'order-history', confidence: 'inferred' },
        qualityStandards: { value: 'IATF 16949 — zero-defect mentality', capturedAt: '2025-11-12', capturedFrom: 'chat', confidence: 'stated' },
        sustainabilityGoals: { value: 'OEM mandating 25% recycled content by 2027', capturedAt: '2025-11-12', capturedFrom: 'chat', confidence: 'stated' },
        painPoints: { value: 'Color consistency across lots; lead time predictability', capturedAt: '2025-11-12', capturedFrom: 'chat', confidence: 'stated' },
      },

      merkuryIdentity: {
        merkuryId: 'MRK-RN-001',
        identityTier: 'known',
        confidence: 0.97,
        resolvedAt: new Date().toISOString(),
      },

      savedPaymentMethods: [
        { id: 'pm-1', type: 'net-terms', isDefault: true, terms: 'Net 30' },
      ],
      shippingAddresses: [
        {
          id: 'addr-1',
          name: 'Spectra Automotive - Main Plant',
          line1: '4200 Industrial Blvd',
          city: 'Auburn Hills',
          state: 'MI',
          postalCode: '48326',
          country: 'US',
          isDefault: true,
        },
      ],
    },
  },

  // ────────────────────────────────────────────────────────────────
  // 2. Tom Brennan — Plant Engineer, Packaging
  // Known, no tier, 1 order, evaluating new materials
  // ────────────────────────────────────────────────────────────────
  {
    stub: PERSONA_STUBS[1],
    profile: {
      id: 'persona-tom-brennan',
      name: 'Tom Brennan',
      email: 'tbrennan@clearpacksolutions.com',
      company: 'ClearPack Solutions',
      jobTitle: 'Process Engineer',

      beautyProfile: {
        industry: 'Packaging',
        primaryApplications: ['thermoformed trays', 'clamshells', 'food containers'],
        certifications: ['FDA', 'SQF'],
        preferredProcessingMethods: ['thermoforming', 'extrusion'],
        preferredResins: ['PET', 'PP', 'PLA'],
        preferredBrands: [],
        volumeTier: 'standard',
      },

      orders: [
        {
          orderId: 'FPO-2025-5201',
          orderDate: '2025-10-30',
          channel: 'online',
          lineItems: [
            { productId: 'resin-pp-profax', productName: 'Pro-fax™ Polypropylene 6523', quantity: 5000, unitPrice: 0.95, unit: 'lb' },
          ],
          totalAmount: 4750,
          status: 'completed',
          poNumber: 'PO-CPS-2025-0112',
        },
      ],
      purchaseHistory: [],

      chatSummaries: [
        {
          sessionDate: '2025-11-05',
          summary: 'Tom is evaluating bio-based alternatives for their food tray line. Their largest customer (a grocery chain) is asking for compostable packaging options. He needs samples of PLA and wants to understand processing differences from PET.',
          sentiment: 'positive',
          topicsDiscussed: ['PLA evaluation', 'compostable packaging', 'processing differences', 'sample request'],
        },
      ],

      meaningfulEvents: [
        {
          eventType: 'intent',
          description: 'Evaluating PLA for compostable food tray line — needs samples',
          capturedAt: '2025-11-05',
          agentNote: 'Send NatureWorks Ingeo 3251D samples. Connect with applications engineering for thermoforming guidance.',
        },
        {
          eventType: 'preference',
          description: 'Prefers technical data sheets upfront before ordering',
          capturedAt: '2025-11-05',
        },
      ],

      browseSessions: [
        {
          sessionDate: '2025-11-20',
          categoriesBrowsed: ['sustainable-resin', 'recycled-resin', 'commodity-resin'],
          productsViewed: ['resin-bio-pla', 'resin-rpet-clear', 'resin-pp-profax'],
          durationMinutes: 25,
          device: 'desktop',
        },
      ],

      loyalty: null,

      agentCapturedProfile: {
        primaryApplication: { value: 'Thermoformed food packaging', capturedAt: '2025-11-05', capturedFrom: 'chat', confidence: 'stated' },
        sustainabilityGoals: { value: 'Customer mandate for compostable packaging', capturedAt: '2025-11-05', capturedFrom: 'chat', confidence: 'stated' },
        processingCapabilities: { value: ['thermoforming', 'sheet extrusion'], capturedAt: '2025-11-05', capturedFrom: 'chat', confidence: 'stated' },
      },

      merkuryIdentity: {
        merkuryId: 'MRK-TB-002',
        identityTier: 'known',
        confidence: 0.94,
        resolvedAt: new Date().toISOString(),
      },

      savedPaymentMethods: [
        { id: 'pm-2', type: 'card', brand: 'visa', last4: '4242', isDefault: true },
      ],
      shippingAddresses: [
        {
          id: 'addr-2',
          name: 'ClearPack Solutions',
          line1: '890 Commerce Way',
          city: 'Oshkosh',
          state: 'WI',
          postalCode: '54901',
          country: 'US',
          isDefault: true,
        },
      ],
    },
  },

  // ────────────────────────────────────────────────────────────────
  // 3. Lisa Park — VP Supply Chain, Medical Devices
  // Known, Platinum, 8 orders, high-value PEEK/PC buyer
  // ────────────────────────────────────────────────────────────────
  {
    stub: PERSONA_STUBS[2],
    profile: {
      id: 'persona-lisa-park',
      name: 'Lisa Park',
      email: 'lisa.park@meridianmedical.com',
      company: 'Meridian Medical Devices',
      jobTitle: 'VP of Supply Chain',

      beautyProfile: {
        industry: 'Medical Devices',
        primaryApplications: ['surgical instrument housings', 'diagnostic device components', 'implantable-grade parts'],
        certifications: ['ISO 13485', 'FDA 21 CFR', 'ISO 10993'],
        preferredProcessingMethods: ['injection-molding'],
        preferredResins: ['PEEK', 'Polycarbonate', 'Nylon'],
        preferredBrands: ['Victrex', 'SABIC'],
        volumeTier: 'enterprise',
      },

      orders: [
        {
          orderId: 'FPO-2025-3901',
          orderDate: '2025-07-12',
          channel: 'sales-rep',
          lineItems: [
            { productId: 'resin-peek-victrex', productName: 'VICTREX™ PEEK 450G', quantity: 500, unitPrice: 98.00, unit: 'lb' },
          ],
          totalAmount: 49000,
          status: 'completed',
          poNumber: 'PO-MMD-2025-0445',
        },
        {
          orderId: 'FPO-2025-4422',
          orderDate: '2025-08-28',
          channel: 'sales-rep',
          lineItems: [
            { productId: 'resin-pc-lexan', productName: 'LEXAN™ Polycarbonate Resin 141R', quantity: 5000, unitPrice: 3.85, unit: 'lb' },
            { productId: 'resin-peek-victrex', productName: 'VICTREX™ PEEK 450G', quantity: 300, unitPrice: 98.00, unit: 'lb' },
          ],
          totalAmount: 48650,
          status: 'completed',
          poNumber: 'PO-MMD-2025-0478',
        },
        {
          orderId: 'FPO-2025-5655',
          orderDate: '2025-11-20',
          channel: 'online',
          lineItems: [
            { productId: 'resin-peek-victrex', productName: 'VICTREX™ PEEK 450G', quantity: 800, unitPrice: 98.00, unit: 'lb' },
          ],
          totalAmount: 78400,
          status: 'in-transit',
          poNumber: 'PO-MMD-2025-0512',
          trackingNumber: 'TRK-456789012',
          estimatedDelivery: '2025-12-05',
        },
      ],
      purchaseHistory: [],

      chatSummaries: [
        {
          sessionDate: '2025-09-15',
          summary: 'Discussed upcoming FDA 510(k) submission timeline and need for material traceability documentation. Lisa needs full lot traceability and CoA for every PEEK shipment. Also exploring biocompatible PC grades for a new diagnostic housing.',
          sentiment: 'positive',
          topicsDiscussed: ['FDA submission', 'lot traceability', 'CoA', 'biocompatible PC'],
        },
        {
          sessionDate: '2025-11-18',
          summary: 'Lisa flagged urgency on the PEEK order — production timeline moved up. Needs expedited shipping. Also asked about consignment inventory program for PEEK to avoid future supply disruptions.',
          sentiment: 'neutral',
          topicsDiscussed: ['expedited shipping', 'consignment inventory', 'supply security'],
        },
      ],

      meaningfulEvents: [
        {
          eventType: 'milestone',
          description: 'Meridian Medical achieved ISO 13485 re-certification',
          capturedAt: '2025-08-01',
        },
        {
          eventType: 'intent',
          description: 'Exploring consignment inventory program for PEEK',
          capturedAt: '2025-11-18',
          agentNote: 'High-value opportunity. Route to strategic accounts team to discuss consignment terms.',
        },
        {
          eventType: 'concern',
          description: 'PEEK supply continuity critical — cannot tolerate stockouts',
          capturedAt: '2025-11-18',
          agentNote: 'Set up safety stock alert. This account is highly sensitive to supply disruption.',
        },
      ],

      browseSessions: [],

      loyalty: {
        tier: 'platinum',
        pointsBalance: 45200,
        lifetimePoints: 125000,
        memberSince: '2021-06-10',
        rewardsAvailable: [
          { name: 'Dedicated account manager', pointsCost: 0 },
          { name: '10% off next PEEK order', pointsCost: 20000 },
          { name: 'Free expedited shipping (1 year)', pointsCost: 15000 },
        ],
      },

      agentCapturedProfile: {
        annualVolume: { value: '~$500K+ across PEEK and PC', capturedAt: '2025-09-15', capturedFrom: 'chat', confidence: 'stated' },
        qualityStandards: { value: 'FDA 21 CFR, ISO 13485, full lot traceability required', capturedAt: '2025-09-15', capturedFrom: 'chat', confidence: 'stated' },
        inventoryStrategy: { value: 'Exploring consignment for critical PEEK supply', capturedAt: '2025-11-18', capturedFrom: 'chat', confidence: 'stated' },
        painPoints: { value: 'Supply continuity for PEEK; documentation turnaround for FDA submissions', capturedAt: '2025-11-18', capturedFrom: 'chat', confidence: 'stated' },
        accountManager: { value: 'Jennifer Walsh (Strategic Accounts)', capturedAt: '2025-07-12', capturedFrom: 'crm', confidence: 'stated' },
      },

      merkuryIdentity: {
        merkuryId: 'MRK-LP-003',
        identityTier: 'known',
        confidence: 0.99,
        resolvedAt: new Date().toISOString(),
      },

      savedPaymentMethods: [
        { id: 'pm-3', type: 'net-terms', isDefault: true, terms: 'Net 45' },
      ],
      shippingAddresses: [
        {
          id: 'addr-3',
          name: 'Meridian Medical - Cleanroom Facility',
          line1: '1500 MedTech Parkway',
          city: 'Irvine',
          state: 'CA',
          postalCode: '92618',
          country: 'US',
          isDefault: true,
        },
      ],
    },
  },

  // ────────────────────────────────────────────────────────────────
  // 4. Carlos Mendez — Operations Director, Building Products
  // Known, Silver, 3 orders, mid-volume
  // ────────────────────────────────────────────────────────────────
  {
    stub: PERSONA_STUBS[3],
    profile: {
      id: 'persona-carlos-mendez',
      name: 'Carlos Mendez',
      email: 'cmendez@summitbuilding.com',
      company: 'Summit Building Products',
      jobTitle: 'Operations Director',

      beautyProfile: {
        industry: 'Building & Construction',
        primaryApplications: ['pipe extrusion', 'window profiles', 'decking'],
        certifications: ['NSF 61', 'ASTM standards'],
        preferredProcessingMethods: ['extrusion'],
        preferredResins: ['HDPE', 'PP', 'PPO'],
        preferredBrands: ['Chevron Phillips', 'LyondellBasell', 'SABIC'],
        volumeTier: 'high-volume',
      },

      orders: [
        {
          orderId: 'FPO-2025-4100',
          orderDate: '2025-08-05',
          channel: 'online',
          lineItems: [
            { productId: 'resin-hdpe-marlex', productName: 'Marlex® HDPE HHM 5502BN', quantity: 40000, unitPrice: 0.82, unit: 'lb' },
          ],
          totalAmount: 32800,
          status: 'completed',
          poNumber: 'PO-SBP-2025-0201',
        },
        {
          orderId: 'FPO-2025-5010',
          orderDate: '2025-10-15',
          channel: 'phone',
          lineItems: [
            { productId: 'resin-hdpe-marlex', productName: 'Marlex® HDPE HHM 5502BN', quantity: 40000, unitPrice: 0.82, unit: 'lb' },
            { productId: 'resin-ppo-noryl', productName: 'NORYL™ PPO Resin N190', quantity: 5000, unitPrice: 4.50, unit: 'lb' },
          ],
          totalAmount: 55300,
          status: 'completed',
          poNumber: 'PO-SBP-2025-0234',
        },
        {
          orderId: 'FPO-2025-5750',
          orderDate: '2025-11-25',
          channel: 'online',
          lineItems: [
            { productId: 'resin-hdpe-marlex', productName: 'Marlex® HDPE HHM 5502BN', quantity: 40000, unitPrice: 0.82, unit: 'lb' },
            { productId: 'additive-uv-stabilizer', productName: 'FormGuard™ UV Stabilizer 328', quantity: 500, unitPrice: 8.50, unit: 'lb' },
          ],
          totalAmount: 37050,
          status: 'processing',
          poNumber: 'PO-SBP-2025-0256',
        },
      ],
      purchaseHistory: [],

      chatSummaries: [
        {
          sessionDate: '2025-10-20',
          summary: 'Carlos discussed increasing extrusion line capacity. Needs consistent HDPE supply — wants to set up a blanket PO for quarterly auto-replenishment. Also asked about UV stabilizer options for their outdoor decking line.',
          sentiment: 'positive',
          topicsDiscussed: ['blanket PO', 'auto-replenishment', 'UV stabilizer', 'capacity expansion'],
        },
      ],

      meaningfulEvents: [
        {
          eventType: 'intent',
          description: 'Setting up blanket PO for quarterly HDPE auto-replenishment',
          capturedAt: '2025-10-20',
          agentNote: 'Route to inside sales for blanket PO setup. ~40k lbs/quarter HDPE.',
        },
        {
          eventType: 'preference',
          description: 'Railcar delivery preferred for 40k+ lb orders',
          capturedAt: '2025-08-05',
        },
      ],

      browseSessions: [
        {
          sessionDate: '2025-11-22',
          categoriesBrowsed: ['commodity-resin', 'additive'],
          productsViewed: ['resin-hdpe-marlex', 'additive-uv-stabilizer'],
          durationMinutes: 8,
          device: 'desktop',
        },
      ],

      loyalty: {
        tier: 'silver',
        pointsBalance: 4800,
        lifetimePoints: 12500,
        memberSince: '2024-02-01',
        rewardsAvailable: [
          { name: '3% off next order', pointsCost: 3000 },
        ],
      },

      merkuryIdentity: {
        merkuryId: 'MRK-CM-004',
        identityTier: 'known',
        confidence: 0.95,
        resolvedAt: new Date().toISOString(),
      },

      savedPaymentMethods: [
        { id: 'pm-4', type: 'net-terms', isDefault: true, terms: 'Net 30' },
      ],
      shippingAddresses: [
        {
          id: 'addr-4',
          name: 'Summit Building Products - Plant 1',
          line1: '2800 Extrusion Drive',
          city: 'Dallas',
          state: 'TX',
          postalCode: '75201',
          country: 'US',
          isDefault: true,
        },
      ],
    },
  },

  // ────────────────────────────────────────────────────────────────
  // 5. Jake Morrison — Maintenance Tech, Custom Molder (New)
  // Known, brand new, 1 order, learning the platform
  // ────────────────────────────────────────────────────────────────
  {
    stub: PERSONA_STUBS[4],
    profile: {
      id: 'persona-jake-morrison',
      name: 'Jake Morrison',
      email: 'jake.m@precisionmold.com',
      company: 'Precision Mold & Tool',
      jobTitle: 'Maintenance Technician',

      beautyProfile: {
        industry: 'Custom Molding',
        primaryApplications: ['general injection molding', 'contract manufacturing'],
        certifications: [],
        preferredProcessingMethods: ['injection-molding'],
        preferredResins: [],
        preferredBrands: [],
        volumeTier: 'standard',
      },

      orders: [
        {
          orderId: 'FPO-2025-5800',
          orderDate: '2025-11-28',
          channel: 'online',
          lineItems: [
            { productId: 'purge-compound-ultra', productName: 'FormerraPurge™ Ultra', quantity: 40, unitPrice: 6.75, unit: 'lb' },
          ],
          totalAmount: 270,
          status: 'shipped',
          poNumber: 'PO-PMT-2025-001',
          trackingNumber: 'TRK-111222333',
          estimatedDelivery: '2025-12-03',
        },
      ],
      purchaseHistory: [],

      chatSummaries: [],

      meaningfulEvents: [
        {
          eventType: 'preference',
          description: 'First-time Formerra Plus buyer — found via Google search for purge compounds',
          capturedAt: '2025-11-28',
        },
      ],

      browseSessions: [
        {
          sessionDate: '2025-11-27',
          categoriesBrowsed: ['purge-compound', 'color-masterbatch'],
          productsViewed: ['purge-compound-ultra', 'masterbatch-white-1045'],
          durationMinutes: 12,
          device: 'mobile',
        },
      ],

      loyalty: null,

      merkuryIdentity: {
        merkuryId: 'MRK-JM-005',
        identityTier: 'known',
        confidence: 0.88,
        resolvedAt: new Date().toISOString(),
      },

      savedPaymentMethods: [
        { id: 'pm-5', type: 'card', brand: 'mastercard', last4: '8901', isDefault: true },
      ],
      shippingAddresses: [
        {
          id: 'addr-5',
          name: 'Precision Mold & Tool',
          line1: '456 Shop Floor Rd',
          city: 'Grand Rapids',
          state: 'MI',
          postalCode: '49503',
          country: 'US',
          isDefault: true,
        },
      ],
    },
  },

  // ────────────────────────────────────────────────────────────────
  // 6. Patel Industries — Appended Only (3P data)
  // New to Formerra, identified via Merkury B2B append
  // ────────────────────────────────────────────────────────────────
  {
    stub: PERSONA_STUBS[5],
    profile: {
      id: 'persona-patel-industries',
      name: 'Guest',
      email: '',
      company: 'Patel Industries',

      beautyProfile: {} as CustomerProfile['beautyProfile'],

      orders: [],
      purchaseHistory: [],
      chatSummaries: [],
      meaningfulEvents: [],
      browseSessions: [],
      loyalty: null,

      merkuryIdentity: {
        merkuryId: 'MRK-PI-006',
        identityTier: 'appended',
        confidence: 0.72,
        resolvedAt: new Date().toISOString(),
      },

      appendedProfile: {
        companySize: '50-200 employees',
        industryVertical: 'Consumer Products Manufacturing',
        annualRevenue: '$10M-$50M',
        geoRegion: 'Southeast US',
        interests: ['injection molding', 'custom compounding', 'sustainable materials'],
        lifestyleSignals: ['mid-market manufacturer', 'growth-stage company', 'sustainability-conscious'],
      },

      savedPaymentMethods: [],
      shippingAddresses: [],
    },
  },

  // ────────────────────────────────────────────────────────────────
  // 7. Greenfield Manufacturing — Appended Only (3P data)
  // New to Formerra, identified via Merkury B2B append
  // ────────────────────────────────────────────────────────────────
  {
    stub: PERSONA_STUBS[6],
    profile: {
      id: 'persona-greenfield-mfg',
      name: 'Guest',
      email: '',
      company: 'Greenfield Manufacturing',

      beautyProfile: {} as CustomerProfile['beautyProfile'],

      orders: [],
      purchaseHistory: [],
      chatSummaries: [],
      meaningfulEvents: [],
      browseSessions: [],
      loyalty: null,

      merkuryIdentity: {
        merkuryId: 'MRK-GM-007',
        identityTier: 'appended',
        confidence: 0.68,
        resolvedAt: new Date().toISOString(),
      },

      appendedProfile: {
        companySize: '200-500 employees',
        industryVertical: 'Industrial Equipment Manufacturing',
        annualRevenue: '$50M-$100M',
        geoRegion: 'Midwest US',
        interests: ['engineered resins', 'high-performance polymers', 'metal-to-plastic conversion'],
        lifestyleSignals: ['established manufacturer', 'engineering-driven', 'lean manufacturing adopter'],
      },

      savedPaymentMethods: [],
      shippingAddresses: [],
    },
  },
];

// ─── Accessor helpers ───────────────────────────────────────────
export function getPersonaById(id: string): PersonaWithProfile | undefined {
  return PERSONAS.find((p) => p.stub.id === id);
}

export function getAllPersonas(): PersonaWithProfile[] {
  return PERSONAS;
}
