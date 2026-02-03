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
    id: 'maria-santos',
    defaultLabel: 'Maria Santos',
    defaultSubtitle: 'Known · Gold Account',
    identityTier: 'known',
    merkuryId: 'MRK-MS-001',
  },
  {
    id: 'david-chen',
    defaultLabel: 'David Chen',
    defaultSubtitle: 'Known · Platinum Account',
    identityTier: 'known',
    merkuryId: 'MRK-DC-002',
  },
  {
    id: 'sarah-johnson',
    defaultLabel: 'Sarah Johnson',
    defaultSubtitle: 'Known · Silver Account',
    identityTier: 'known',
    merkuryId: 'MRK-SJ-003',
  },
  {
    id: 'mike-torres',
    defaultLabel: 'Mike Torres',
    defaultSubtitle: 'Known · No Tier',
    identityTier: 'known',
    merkuryId: 'MRK-MT-004',
  },
  {
    id: 'jenny-park',
    defaultLabel: 'Jenny Park',
    defaultSubtitle: 'Known · No Tier',
    identityTier: 'known',
    merkuryId: 'MRK-JP-005',
  },
  {
    id: 'pacific-energy-group',
    defaultLabel: 'Pacific Energy Group',
    defaultSubtitle: 'Appended Only',
    identityTier: 'appended',
    merkuryId: 'MRK-PEG-006',
  },
  {
    id: 'heartland-power',
    defaultLabel: 'Heartland Power Co-op',
    defaultSubtitle: 'Appended Only',
    identityTier: 'appended',
    merkuryId: 'MRK-HPC-007',
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
  // 1. Maria Santos — VP of Procurement, Horizon Wind Partners
  // Known, Gold tier, wind farm developer
  // ────────────────────────────────────────────────────────────────
  {
    stub: PERSONA_STUBS[0],
    profile: {
      id: 'persona-maria-santos',
      name: 'Maria Santos',
      email: 'maria.santos@horizonwind.com',
      company: 'Horizon Wind Partners',
      jobTitle: 'VP of Procurement',

      beautyProfile: {
        industry: 'Wind Energy',
        primaryApplications: ['turbine blade assemblies', 'tower section fabrication', 'gearbox procurement'],
        certifications: ['ISO 14001', 'IEC 61400'],
        preferredProcessingMethods: ['composite layup', 'steel fabrication'],
        preferredResins: ['Epoxy composite', 'Glass fiber reinforced'],
        preferredBrands: ['Vestas', 'ZF Wind Power', 'Siemens Gamesa'],
        volumeTier: 'high-volume',
      },

      orders: [
        {
          orderId: 'RPO-2025-1001',
          orderDate: '2025-06-10',
          channel: 'sales-rep',
          lineItems: [
            { productId: 'wt-blade-vestas', productName: 'Vestas V162 Turbine Blade Set (3-pack)', quantity: 12, unitPrice: 185000, unit: 'set' },
          ],
          totalAmount: 2220000,
          status: 'completed',
          poNumber: 'PO-HWP-2025-0301',
        },
        {
          orderId: 'RPO-2025-1045',
          orderDate: '2025-08-22',
          channel: 'sales-rep',
          lineItems: [
            { productId: 'wt-tower-section-80m', productName: 'Steel Tower Section 80m (4-segment)', quantity: 8, unitPrice: 92000, unit: 'ea' },
            { productId: 'wt-gearbox-zf', productName: 'ZF Wind Power Gearbox 3.0MW', quantity: 8, unitPrice: 74000, unit: 'ea' },
          ],
          totalAmount: 1328000,
          status: 'completed',
          poNumber: 'PO-HWP-2025-0344',
        },
        {
          orderId: 'RPO-2025-1112',
          orderDate: '2025-11-05',
          channel: 'online',
          lineItems: [
            { productId: 'wt-blade-vestas', productName: 'Vestas V162 Turbine Blade Set (3-pack)', quantity: 6, unitPrice: 185000, unit: 'set' },
          ],
          totalAmount: 1110000,
          status: 'shipped',
          poNumber: 'PO-HWP-2025-0389',
          trackingNumber: 'TRK-WND-554201',
          estimatedDelivery: '2025-12-15',
        },
        {
          orderId: 'RPO-2026-0023',
          orderDate: '2026-01-08',
          channel: 'sales-rep',
          lineItems: [
            { productId: 'wt-gearbox-zf', productName: 'ZF Wind Power Gearbox 3.0MW', quantity: 12, unitPrice: 74000, unit: 'ea' },
          ],
          totalAmount: 888000,
          status: 'processing',
          poNumber: 'PO-HWP-2026-0012',
        },
      ],
      purchaseHistory: [],

      chatSummaries: [
        {
          sessionDate: '2025-09-18',
          summary: 'Maria discussed the Phase 2 expansion of the West Texas wind farm. Needs 24 additional turbine sets delivered Q1 2026. Asked about volume pricing tiers for blade sets and whether ZF gearboxes can be bundled. Mentioned concerns about supply chain delays from European manufacturers.',
          sentiment: 'positive',
          topicsDiscussed: ['Phase 2 expansion', 'volume pricing', 'blade supply chain', 'Q1 2026 delivery'],
        },
        {
          sessionDate: '2025-12-02',
          summary: 'Followed up on gearbox lead times for the January order. Maria flagged that two blades from the August shipment showed minor surface defects on trailing edge. Opened QA ticket. Also inquired about newer 4.5MW gearbox options for an upcoming offshore project bid.',
          sentiment: 'neutral',
          topicsDiscussed: ['gearbox lead times', 'blade surface defects', 'QA ticket', 'offshore project', '4.5MW gearbox'],
        },
      ],

      meaningfulEvents: [
        {
          eventType: 'intent',
          description: 'Phase 2 West Texas wind farm — 24 turbine sets needed Q1 2026',
          capturedAt: '2025-09-18',
          agentNote: 'Major expansion opportunity. Coordinate with Vestas rep on bulk pricing and logistics.',
        },
        {
          eventType: 'concern',
          description: 'Blade surface defects on trailing edge (lot RPO-1045)',
          capturedAt: '2025-12-02',
          agentNote: 'QA ticket QT-2025-WND-0088 opened. Escalate to Vestas quality team.',
        },
        {
          eventType: 'preference',
          description: 'Prefers Net 45 terms and quarterly delivery scheduling',
          capturedAt: '2025-06-15',
        },
        {
          eventType: 'intent',
          description: 'Exploring offshore wind — evaluating 4.5MW+ gearbox solutions',
          capturedAt: '2025-12-02',
          agentNote: 'New market entry for Horizon Wind. Connect with offshore equipment specialist.',
        },
      ],

      browseSessions: [
        {
          sessionDate: '2025-11-28',
          categoriesBrowsed: ['wind-turbine-components', 'gearboxes', 'tower-sections'],
          productsViewed: ['wt-blade-vestas', 'wt-gearbox-zf', 'wt-tower-section-80m'],
          durationMinutes: 22,
          device: 'desktop',
        },
      ],

      loyalty: {
        tier: 'gold',
        pointsBalance: 18500,
        lifetimePoints: 52000,
        memberSince: '2023-01-20',
        rewardsAvailable: [
          { name: '3% off next order', pointsCost: 10000 },
          { name: 'Priority logistics coordination', pointsCost: 8000 },
        ],
      },

      agentCapturedProfile: {
        annualVolume: { value: '~$8M/year in turbine components', capturedAt: '2025-09-18', capturedFrom: 'chat', confidence: 'stated' },
        budgetCycle: { value: 'Annual capex planning in Q3 for next fiscal year', capturedAt: '2025-09-18', capturedFrom: 'chat', confidence: 'stated' },
        primaryApplication: { value: 'Onshore wind farm development, exploring offshore', capturedAt: '2025-12-02', capturedFrom: 'chat', confidence: 'stated' },
        qualityStandards: { value: 'ISO 14001, IEC 61400 compliance required for all components', capturedAt: '2025-06-10', capturedFrom: 'order-history', confidence: 'inferred' },
        painPoints: { value: 'European supply chain delays; blade surface quality consistency', capturedAt: '2025-12-02', capturedFrom: 'chat', confidence: 'stated' },
      },

      merkuryIdentity: {
        merkuryId: 'MRK-MS-001',
        identityTier: 'known',
        confidence: 0.97,
        resolvedAt: new Date().toISOString(),
      },

      savedPaymentMethods: [
        { id: 'pm-1', type: 'net-terms', isDefault: true, terms: 'Net 45' },
      ],
      shippingAddresses: [
        {
          id: 'addr-1',
          name: 'Horizon Wind Partners - West Texas Project Site',
          line1: '14200 Turbine Field Rd',
          city: 'Sweetwater',
          state: 'TX',
          postalCode: '79556',
          country: 'US',
          isDefault: true,
        },
      ],
    },
  },

  // ────────────────────────────────────────────────────────────────
  // 2. David Chen — Project Director, SunPeak EPC Solutions
  // Known, Platinum, large-scale solar EPC
  // ────────────────────────────────────────────────────────────────
  {
    stub: PERSONA_STUBS[1],
    profile: {
      id: 'persona-david-chen',
      name: 'David Chen',
      email: 'david.chen@sunpeakepc.com',
      company: 'SunPeak EPC Solutions',
      jobTitle: 'Project Director',

      beautyProfile: {
        industry: 'Solar EPC',
        primaryApplications: ['utility-scale solar installations', 'central inverter systems', 'single-axis tracker deployment'],
        certifications: ['NABCEP', 'ISO 9001', 'UL 1741'],
        preferredProcessingMethods: ['ground-mount installation', 'string design'],
        preferredResins: ['Monocrystalline silicon', 'Bifacial modules'],
        preferredBrands: ['JinkoSolar', 'SMA', 'Nextracker'],
        volumeTier: 'enterprise',
      },

      orders: [
        {
          orderId: 'RPO-2025-2001',
          orderDate: '2025-05-15',
          channel: 'sales-rep',
          lineItems: [
            { productId: 'solar-panel-jinko', productName: 'JinkoSolar Tiger Neo 620W Bifacial Module', quantity: 5000, unitPrice: 142, unit: 'ea' },
            { productId: 'solar-inverter-sma', productName: 'SMA Sunny Central 4600UP Central Inverter', quantity: 6, unitPrice: 58000, unit: 'ea' },
          ],
          totalAmount: 1058000,
          status: 'completed',
          poNumber: 'PO-SPK-2025-0501',
        },
        {
          orderId: 'RPO-2025-2078',
          orderDate: '2025-08-02',
          channel: 'sales-rep',
          lineItems: [
            { productId: 'solar-panel-jinko', productName: 'JinkoSolar Tiger Neo 620W Bifacial Module', quantity: 8000, unitPrice: 138, unit: 'ea' },
            { productId: 'solar-tracker-nextracker', productName: 'Nextracker NX Horizon Single-Axis Tracker', quantity: 8000, unitPrice: 85, unit: 'ea' },
          ],
          totalAmount: 1784000,
          status: 'completed',
          poNumber: 'PO-SPK-2025-0588',
        },
        {
          orderId: 'RPO-2025-2190',
          orderDate: '2025-10-18',
          channel: 'online',
          lineItems: [
            { productId: 'solar-panel-jinko', productName: 'JinkoSolar Tiger Neo 620W Bifacial Module', quantity: 10000, unitPrice: 135, unit: 'ea' },
            { productId: 'solar-inverter-sma', productName: 'SMA Sunny Central 4600UP Central Inverter', quantity: 10, unitPrice: 58000, unit: 'ea' },
            { productId: 'solar-tracker-nextracker', productName: 'Nextracker NX Horizon Single-Axis Tracker', quantity: 10000, unitPrice: 85, unit: 'ea' },
          ],
          totalAmount: 2780000,
          status: 'in-transit',
          poNumber: 'PO-SPK-2025-0645',
          trackingNumber: 'TRK-SOL-882301',
          estimatedDelivery: '2025-12-20',
        },
        {
          orderId: 'RPO-2026-0055',
          orderDate: '2026-01-15',
          channel: 'sales-rep',
          lineItems: [
            { productId: 'solar-panel-jinko', productName: 'JinkoSolar Tiger Neo 620W Bifacial Module', quantity: 12000, unitPrice: 132, unit: 'ea' },
          ],
          totalAmount: 1584000,
          status: 'processing',
          poNumber: 'PO-SPK-2026-0022',
        },
      ],
      purchaseHistory: [],

      chatSummaries: [
        {
          sessionDate: '2025-07-20',
          summary: 'David discussed the 200MW Arizona project timeline. Needs phased delivery of panels and trackers across three construction stages. Wants to lock in pricing for the full project to avoid module price fluctuations. Asked about bankability letters for JinkoSolar modules to satisfy project finance requirements.',
          sentiment: 'positive',
          topicsDiscussed: ['200MW project', 'phased delivery', 'price lock', 'bankability letters', 'project finance'],
        },
        {
          sessionDate: '2025-11-10',
          summary: 'David raised concerns about tariff impacts on imported modules. Exploring domestic manufacturing alternatives. Also needs to add battery storage (BESS) to two existing projects for IRA tax credit optimization. Wants quotes on utility-scale battery systems.',
          sentiment: 'neutral',
          topicsDiscussed: ['tariff impact', 'domestic modules', 'BESS integration', 'IRA tax credits', 'battery storage'],
        },
      ],

      meaningfulEvents: [
        {
          eventType: 'milestone',
          description: 'SunPeak awarded 200MW Arizona utility-scale project',
          capturedAt: '2025-07-20',
        },
        {
          eventType: 'intent',
          description: 'Adding BESS to two existing projects for IRA optimization',
          capturedAt: '2025-11-10',
          agentNote: 'Major upsell opportunity. Connect with energy storage division for BESS quotes.',
        },
        {
          eventType: 'concern',
          description: 'Tariff exposure on imported solar modules — evaluating domestic supply',
          capturedAt: '2025-11-10',
          agentNote: 'Present First Solar and Qcells domestic options at next meeting.',
        },
        {
          eventType: 'preference',
          description: 'Requires bankability documentation for all modules; Net 30 terms on all POs',
          capturedAt: '2025-07-20',
        },
      ],

      browseSessions: [
        {
          sessionDate: '2025-11-25',
          categoriesBrowsed: ['solar-panels', 'battery-storage', 'inverters'],
          productsViewed: ['solar-panel-jinko', 'bess-tesla-megapack', 'solar-inverter-sma'],
          durationMinutes: 35,
          device: 'desktop',
        },
      ],

      loyalty: {
        tier: 'platinum',
        pointsBalance: 62000,
        lifetimePoints: 180000,
        memberSince: '2021-03-10',
        rewardsAvailable: [
          { name: 'Dedicated project coordinator', pointsCost: 0 },
          { name: '5% off next module order', pointsCost: 25000 },
          { name: 'Free expedited logistics (1 year)', pointsCost: 20000 },
        ],
      },

      agentCapturedProfile: {
        annualVolume: { value: '~$15M+/year in solar components', capturedAt: '2025-07-20', capturedFrom: 'chat', confidence: 'stated' },
        budgetCycle: { value: 'Project-based procurement; Q4 pipeline planning', capturedAt: '2025-07-20', capturedFrom: 'chat', confidence: 'stated' },
        primaryApplication: { value: 'Utility-scale solar EPC, expanding into BESS', capturedAt: '2025-11-10', capturedFrom: 'chat', confidence: 'stated' },
        qualityStandards: { value: 'NABCEP certified installers, UL 1741 inverter compliance, bankability docs required', capturedAt: '2025-07-20', capturedFrom: 'chat', confidence: 'stated' },
        painPoints: { value: 'Module tariff exposure; price volatility; bankability documentation turnaround', capturedAt: '2025-11-10', capturedFrom: 'chat', confidence: 'stated' },
        accountManager: { value: 'Marcus Rivera (Strategic Accounts)', capturedAt: '2025-05-15', capturedFrom: 'crm', confidence: 'stated' },
      },

      merkuryIdentity: {
        merkuryId: 'MRK-DC-002',
        identityTier: 'known',
        confidence: 0.99,
        resolvedAt: new Date().toISOString(),
      },

      savedPaymentMethods: [
        { id: 'pm-2', type: 'net-terms', isDefault: true, terms: 'Net 30' },
      ],
      shippingAddresses: [
        {
          id: 'addr-2',
          name: 'SunPeak EPC - Arizona Project Staging',
          line1: '8900 Solar Ranch Blvd',
          city: 'Casa Grande',
          state: 'AZ',
          postalCode: '85122',
          country: 'US',
          isDefault: true,
        },
        {
          id: 'addr-2b',
          name: 'SunPeak EPC - HQ Warehouse',
          line1: '2200 Commerce Park Dr',
          city: 'San Jose',
          state: 'CA',
          postalCode: '95131',
          country: 'US',
          isDefault: false,
        },
      ],
    },
  },

  // ────────────────────────────────────────────────────────────────
  // 3. Sarah Johnson — Supply Chain Manager, GreenGrid Utility Corp
  // Known, Silver tier, utility-scale project management
  // ────────────────────────────────────────────────────────────────
  {
    stub: PERSONA_STUBS[2],
    profile: {
      id: 'persona-sarah-johnson',
      name: 'Sarah Johnson',
      email: 'sjohnson@greengridutility.com',
      company: 'GreenGrid Utility Corp',
      jobTitle: 'Supply Chain Manager',

      beautyProfile: {
        industry: 'Utility-Scale Renewables',
        primaryApplications: ['combiner box procurement', 'step-up transformers', 'SCADA monitoring systems'],
        certifications: ['IEEE 1547', 'UL 1741', 'NERC CIP'],
        preferredProcessingMethods: ['utility interconnection', 'substation integration'],
        preferredResins: [],
        preferredBrands: ['Shoals Technologies', 'ABB', 'AlsoEnergy'],
        volumeTier: 'high-volume',
      },

      orders: [
        {
          orderId: 'RPO-2025-3001',
          orderDate: '2025-07-18',
          channel: 'online',
          lineItems: [
            { productId: 'solar-combiner-shoals', productName: 'Shoals BLA 32-String Combiner Box', quantity: 120, unitPrice: 1850, unit: 'ea' },
          ],
          totalAmount: 222000,
          status: 'completed',
          poNumber: 'PO-GGU-2025-0180',
        },
        {
          orderId: 'RPO-2025-3088',
          orderDate: '2025-09-25',
          channel: 'sales-rep',
          lineItems: [
            { productId: 'solar-transformer-abb', productName: 'ABB 34.5kV Step-Up Transformer 10MVA', quantity: 4, unitPrice: 125000, unit: 'ea' },
            { productId: 'solar-monitoring-also', productName: 'AlsoEnergy PowerTrack SCADA System', quantity: 2, unitPrice: 45000, unit: 'ea' },
          ],
          totalAmount: 590000,
          status: 'completed',
          poNumber: 'PO-GGU-2025-0212',
        },
        {
          orderId: 'RPO-2026-0030',
          orderDate: '2026-01-10',
          channel: 'online',
          lineItems: [
            { productId: 'solar-combiner-shoals', productName: 'Shoals BLA 32-String Combiner Box', quantity: 200, unitPrice: 1800, unit: 'ea' },
            { productId: 'solar-monitoring-also', productName: 'AlsoEnergy PowerTrack SCADA System', quantity: 3, unitPrice: 45000, unit: 'ea' },
          ],
          totalAmount: 495000,
          status: 'processing',
          poNumber: 'PO-GGU-2026-0008',
        },
      ],
      purchaseHistory: [],

      chatSummaries: [
        {
          sessionDate: '2025-10-08',
          summary: 'Sarah discussed the upcoming 150MW solar + storage project in Nevada. Needs combiner boxes with integrated rapid shutdown per NEC 2023. Asked about lead times on ABB transformers — their subcontractor is 6 weeks behind schedule. Also evaluating new monitoring platforms with AI-driven predictive maintenance.',
          sentiment: 'neutral',
          topicsDiscussed: ['150MW project', 'rapid shutdown compliance', 'transformer lead times', 'AI monitoring', 'predictive maintenance'],
        },
      ],

      meaningfulEvents: [
        {
          eventType: 'intent',
          description: '150MW solar + storage project in Nevada — procurement phase starting Q1 2026',
          capturedAt: '2025-10-08',
          agentNote: 'Large project pipeline. Pre-position combiner boxes and transformer quotes.',
        },
        {
          eventType: 'concern',
          description: 'Transformer lead times impacting project schedule — subcontractor behind',
          capturedAt: '2025-10-08',
          agentNote: 'Explore expedited transformer options or alternative suppliers.',
        },
        {
          eventType: 'preference',
          description: 'Requires NEC 2023 rapid shutdown compliance on all combiner boxes',
          capturedAt: '2025-10-08',
        },
      ],

      browseSessions: [
        {
          sessionDate: '2025-12-15',
          categoriesBrowsed: ['combiner-boxes', 'transformers', 'monitoring-systems'],
          productsViewed: ['solar-combiner-shoals', 'solar-transformer-abb', 'solar-monitoring-also'],
          durationMinutes: 14,
          device: 'desktop',
        },
      ],

      loyalty: {
        tier: 'silver',
        pointsBalance: 6200,
        lifetimePoints: 15800,
        memberSince: '2024-01-15',
        rewardsAvailable: [
          { name: '3% off next order', pointsCost: 4000 },
        ],
      },

      agentCapturedProfile: {
        annualVolume: { value: '~$2M/year in BOS components', capturedAt: '2025-10-08', capturedFrom: 'chat', confidence: 'stated' },
        primaryApplication: { value: 'Utility-scale solar BOS and monitoring', capturedAt: '2025-07-18', capturedFrom: 'order-history', confidence: 'inferred' },
        qualityStandards: { value: 'IEEE 1547, UL 1741, NEC 2023 rapid shutdown', capturedAt: '2025-10-08', capturedFrom: 'chat', confidence: 'stated' },
        painPoints: { value: 'Transformer lead times; subcontractor schedule slippage', capturedAt: '2025-10-08', capturedFrom: 'chat', confidence: 'stated' },
      },

      merkuryIdentity: {
        merkuryId: 'MRK-SJ-003',
        identityTier: 'known',
        confidence: 0.95,
        resolvedAt: new Date().toISOString(),
      },

      savedPaymentMethods: [
        { id: 'pm-3', type: 'net-terms', isDefault: true, terms: 'Net 30' },
      ],
      shippingAddresses: [
        {
          id: 'addr-3',
          name: 'GreenGrid Utility - Nevada Project Site',
          line1: '6700 Desert Energy Way',
          city: 'Pahrump',
          state: 'NV',
          postalCode: '89048',
          country: 'US',
          isDefault: true,
        },
      ],
    },
  },

  // ────────────────────────────────────────────────────────────────
  // 4. Mike Torres — Owner, Sunrise Solar Installations
  // Known, no tier, residential/small commercial installer
  // ────────────────────────────────────────────────────────────────
  {
    stub: PERSONA_STUBS[3],
    profile: {
      id: 'persona-mike-torres',
      name: 'Mike Torres',
      email: 'mike@sunrisesolar.com',
      company: 'Sunrise Solar Installations',
      jobTitle: 'Owner',

      beautyProfile: {
        industry: 'Residential Solar',
        primaryApplications: ['rooftop solar installations', 'small commercial arrays', 'battery backup systems'],
        certifications: ['NABCEP PV Installation Professional', 'C-46 Solar Contractor License'],
        preferredProcessingMethods: ['rooftop mounting', 'flush mount racking'],
        preferredResins: [],
        preferredBrands: ['Enphase', 'Unirac', 'REC Solar'],
        volumeTier: 'standard',
      },

      orders: [
        {
          orderId: 'RPO-2025-4001',
          orderDate: '2025-09-05',
          channel: 'online',
          lineItems: [
            { productId: 'solar-micro-enphase', productName: 'Enphase IQ8M Microinverter', quantity: 200, unitPrice: 142, unit: 'ea' },
            { productId: 'solar-rack-unirac', productName: 'Unirac SolarMount Rail Kit (10ft)', quantity: 50, unitPrice: 68, unit: 'ea' },
          ],
          totalAmount: 31800,
          status: 'completed',
          poNumber: 'PO-SSI-2025-0045',
        },
        {
          orderId: 'RPO-2025-4055',
          orderDate: '2025-11-12',
          channel: 'online',
          lineItems: [
            { productId: 'solar-micro-enphase', productName: 'Enphase IQ8M Microinverter', quantity: 300, unitPrice: 140, unit: 'ea' },
            { productId: 'solar-rack-unirac', productName: 'Unirac SolarMount Rail Kit (10ft)', quantity: 80, unitPrice: 68, unit: 'ea' },
          ],
          totalAmount: 47440,
          status: 'shipped',
          poNumber: 'PO-SSI-2025-0067',
          trackingNumber: 'TRK-SSI-334421',
          estimatedDelivery: '2025-11-22',
        },
        {
          orderId: 'RPO-2026-0040',
          orderDate: '2026-01-20',
          channel: 'online',
          lineItems: [
            { productId: 'solar-micro-enphase', productName: 'Enphase IQ8M Microinverter', quantity: 150, unitPrice: 140, unit: 'ea' },
          ],
          totalAmount: 21000,
          status: 'processing',
          poNumber: 'PO-SSI-2026-0003',
        },
      ],
      purchaseHistory: [],

      chatSummaries: [
        {
          sessionDate: '2025-10-15',
          summary: 'Mike asked about bulk pricing for Enphase microinverters — he installs about 15-20 residential systems per month and wants to reduce per-unit cost. Also asked about Enphase IQ Battery 5P availability for whole-home backup installations. Mentioned he is growing into small commercial (50-100kW) and may need string inverters soon.',
          sentiment: 'positive',
          topicsDiscussed: ['bulk pricing', 'Enphase microinverters', 'battery storage', 'small commercial expansion', 'string inverters'],
        },
      ],

      meaningfulEvents: [
        {
          eventType: 'intent',
          description: 'Expanding into small commercial solar (50-100kW systems)',
          capturedAt: '2025-10-15',
          agentNote: 'Growth opportunity. Present SolarEdge or SMA string inverter options for commercial.',
        },
        {
          eventType: 'preference',
          description: 'Loyal Enphase user — values monitoring platform and installer support',
          capturedAt: '2025-09-05',
        },
        {
          eventType: 'intent',
          description: 'Looking to add battery storage (Enphase IQ Battery 5P) to service offering',
          capturedAt: '2025-10-15',
          agentNote: 'Send pricing and installer certification info for Enphase battery products.',
        },
      ],

      browseSessions: [
        {
          sessionDate: '2025-11-08',
          categoriesBrowsed: ['microinverters', 'racking-mounting', 'battery-storage'],
          productsViewed: ['solar-micro-enphase', 'solar-rack-unirac', 'battery-enphase-5p'],
          durationMinutes: 20,
          device: 'mobile',
        },
      ],

      loyalty: null,

      agentCapturedProfile: {
        annualVolume: { value: '~$400K-$600K/year in residential components', capturedAt: '2025-10-15', capturedFrom: 'chat', confidence: 'stated' },
        primaryApplication: { value: 'Residential rooftop solar, expanding to small commercial', capturedAt: '2025-10-15', capturedFrom: 'chat', confidence: 'stated' },
        painPoints: { value: 'Per-unit cost on microinverters; needs volume discount tier', capturedAt: '2025-10-15', capturedFrom: 'chat', confidence: 'stated' },
      },

      merkuryIdentity: {
        merkuryId: 'MRK-MT-004',
        identityTier: 'known',
        confidence: 0.92,
        resolvedAt: new Date().toISOString(),
      },

      savedPaymentMethods: [
        { id: 'pm-4', type: 'card', brand: 'visa', last4: '7823', isDefault: true },
      ],
      shippingAddresses: [
        {
          id: 'addr-4',
          name: 'Sunrise Solar Installations - Warehouse',
          line1: '1440 S Main St, Unit B',
          city: 'Phoenix',
          state: 'AZ',
          postalCode: '85034',
          country: 'US',
          isDefault: true,
        },
      ],
    },
  },

  // ────────────────────────────────────────────────────────────────
  // 5. Jenny Park — Technical Operations Manager, WindTech O&M
  // Known, no tier, wind O&M services
  // ────────────────────────────────────────────────────────────────
  {
    stub: PERSONA_STUBS[4],
    profile: {
      id: 'persona-jenny-park',
      name: 'Jenny Park',
      email: 'jenny.park@windtechoms.com',
      company: 'WindTech O&M Services',
      jobTitle: 'Technical Operations Manager',

      beautyProfile: {
        industry: 'Wind O&M',
        primaryApplications: ['gearbox overhaul', 'blade repair', 'drivetrain maintenance'],
        certifications: ['GWO Basic Safety Training', 'ISO 45001'],
        preferredProcessingMethods: ['field service', 'preventive maintenance'],
        preferredResins: [],
        preferredBrands: ['ZF Wind Power', 'SKF', 'Castrol'],
        volumeTier: 'standard',
      },

      orders: [
        {
          orderId: 'RPO-2025-5001',
          orderDate: '2025-08-14',
          channel: 'online',
          lineItems: [
            { productId: 'wt-gearbox-bearing-skf', productName: 'SKF Spherical Roller Bearing 240/630', quantity: 12, unitPrice: 4200, unit: 'ea' },
            { productId: 'wt-gearbox-oil-castrol', productName: 'Castrol Optigear Synthetic CT 320 (55gal)', quantity: 8, unitPrice: 890, unit: 'drum' },
          ],
          totalAmount: 57520,
          status: 'completed',
          poNumber: 'PO-WTO-2025-0088',
        },
        {
          orderId: 'RPO-2025-5044',
          orderDate: '2025-10-28',
          channel: 'phone',
          lineItems: [
            { productId: 'wt-gearbox-repair-kit', productName: 'ZF Gearbox Repair Kit 2.5MW (Seal + Bearing Set)', quantity: 6, unitPrice: 8500, unit: 'kit' },
          ],
          totalAmount: 51000,
          status: 'completed',
          poNumber: 'PO-WTO-2025-0109',
        },
        {
          orderId: 'RPO-2026-0015',
          orderDate: '2026-01-05',
          channel: 'online',
          lineItems: [
            { productId: 'wt-gearbox-bearing-skf', productName: 'SKF Spherical Roller Bearing 240/630', quantity: 20, unitPrice: 4200, unit: 'ea' },
            { productId: 'wt-gearbox-oil-castrol', productName: 'Castrol Optigear Synthetic CT 320 (55gal)', quantity: 12, unitPrice: 890, unit: 'drum' },
          ],
          totalAmount: 94680,
          status: 'processing',
          poNumber: 'PO-WTO-2026-0004',
        },
      ],
      purchaseHistory: [],

      chatSummaries: [
        {
          sessionDate: '2025-09-20',
          summary: 'Jenny discussed scheduling preventive maintenance for a 50-turbine wind farm in Oklahoma. Needs gearbox bearing replacements in bulk — several units showing vibration anomalies. Asked about expedited shipping for critical parts and whether we offer condition monitoring sensor packages.',
          sentiment: 'neutral',
          topicsDiscussed: ['preventive maintenance', 'bulk bearings', 'vibration anomalies', 'expedited shipping', 'condition monitoring'],
        },
        {
          sessionDate: '2025-12-10',
          summary: 'Jenny reported that 3 gearboxes at the Oklahoma site failed earlier than predicted. Needs emergency repair kits shipped overnight. Also exploring a blanket PO for quarterly consumables (oil, filters, seals) across all their service contracts.',
          sentiment: 'negative',
          topicsDiscussed: ['gearbox failures', 'emergency parts', 'overnight shipping', 'blanket PO', 'quarterly consumables'],
        },
      ],

      meaningfulEvents: [
        {
          eventType: 'concern',
          description: 'Premature gearbox failures at Oklahoma wind farm — 3 units down',
          capturedAt: '2025-12-10',
          agentNote: 'Urgent. Expedite ZF repair kits. Flag to engineering for root cause analysis.',
        },
        {
          eventType: 'intent',
          description: 'Setting up blanket PO for quarterly O&M consumables across all contracts',
          capturedAt: '2025-12-10',
          agentNote: 'Route to inside sales for blanket PO setup. Estimate ~$200K/year in consumables.',
        },
        {
          eventType: 'preference',
          description: 'Needs reliable overnight shipping for emergency parts',
          capturedAt: '2025-09-20',
        },
      ],

      browseSessions: [
        {
          sessionDate: '2025-12-08',
          categoriesBrowsed: ['gearbox-components', 'lubricants', 'condition-monitoring'],
          productsViewed: ['wt-gearbox-bearing-skf', 'wt-gearbox-repair-kit', 'wt-gearbox-oil-castrol'],
          durationMinutes: 16,
          device: 'desktop',
        },
      ],

      loyalty: null,

      agentCapturedProfile: {
        annualVolume: { value: '~$200K-$400K/year in O&M parts and consumables', capturedAt: '2025-12-10', capturedFrom: 'chat', confidence: 'stated' },
        primaryApplication: { value: 'Wind turbine O&M — gearbox, drivetrain, blade services', capturedAt: '2025-09-20', capturedFrom: 'chat', confidence: 'stated' },
        painPoints: { value: 'Premature gearbox failures; emergency parts availability; overnight shipping reliability', capturedAt: '2025-12-10', capturedFrom: 'chat', confidence: 'stated' },
      },

      merkuryIdentity: {
        merkuryId: 'MRK-JP-005',
        identityTier: 'known',
        confidence: 0.90,
        resolvedAt: new Date().toISOString(),
      },

      savedPaymentMethods: [
        { id: 'pm-5', type: 'net-terms', isDefault: true, terms: 'Net 30' },
      ],
      shippingAddresses: [
        {
          id: 'addr-5',
          name: 'WindTech O&M - Oklahoma Field Office',
          line1: '3200 Wind Farm Service Rd',
          city: 'Woodward',
          state: 'OK',
          postalCode: '73801',
          country: 'US',
          isDefault: true,
        },
      ],
    },
  },

  // ────────────────────────────────────────────────────────────────
  // 6. Pacific Energy Group — Appended Only (3P data)
  // Identified via Merkury B2B append
  // ────────────────────────────────────────────────────────────────
  {
    stub: PERSONA_STUBS[5],
    profile: {
      id: 'persona-pacific-energy-group',
      name: 'Guest',
      email: '',
      company: 'Pacific Energy Group',

      beautyProfile: {} as CustomerProfile['beautyProfile'],

      orders: [],
      purchaseHistory: [],
      chatSummaries: [],
      meaningfulEvents: [],
      browseSessions: [],
      loyalty: null,

      merkuryIdentity: {
        merkuryId: 'MRK-PEG-006',
        identityTier: 'appended',
        confidence: 0.74,
        resolvedAt: new Date().toISOString(),
      },

      appendedProfile: {
        companySize: '500-1000 employees',
        industryVertical: 'Renewable Energy Development',
        annualRevenue: '$200M-$500M',
        geoRegion: 'West US',
        interests: ['utility-scale solar', 'battery storage', 'PPA structuring'],
        lifestyleSignals: ['large-scale developer', 'IPP', 'grid-scale projects'],
      },

      savedPaymentMethods: [],
      shippingAddresses: [],
    },
  },

  // ────────────────────────────────────────────────────────────────
  // 7. Heartland Power Co-op — Appended Only (3P data)
  // Identified via Merkury B2B append
  // ────────────────────────────────────────────────────────────────
  {
    stub: PERSONA_STUBS[6],
    profile: {
      id: 'persona-heartland-power',
      name: 'Guest',
      email: '',
      company: 'Heartland Power Co-op',

      beautyProfile: {} as CustomerProfile['beautyProfile'],

      orders: [],
      purchaseHistory: [],
      chatSummaries: [],
      meaningfulEvents: [],
      browseSessions: [],
      loyalty: null,

      merkuryIdentity: {
        merkuryId: 'MRK-HPC-007',
        identityTier: 'appended',
        confidence: 0.69,
        resolvedAt: new Date().toISOString(),
      },

      appendedProfile: {
        companySize: '100-250 employees',
        industryVertical: 'Rural Electric Cooperative',
        annualRevenue: '$50M-$100M',
        geoRegion: 'Midwest US',
        interests: ['community solar', 'wind power', 'grid modernization'],
        lifestyleSignals: ['member-owned cooperative', 'rural electrification', 'clean energy transition'],
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
