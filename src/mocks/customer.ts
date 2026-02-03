import type { CustomerProfile } from '@/types/customer';

export const MOCK_CUSTOMER: CustomerProfile = {
  id: 'cust-12345',
  name: 'Maria Santos',
  email: 'maria.santos@horizonwind.com',
  company: 'Horizon Wind Partners',
  jobTitle: 'VP of Procurement',
  beautyProfile: {
    industry: 'Wind Energy',
    primaryApplications: ['onshore wind farms', 'turbine procurement'],
    certifications: ['ISO 14001', 'IEC 61400'],
    preferredProcessingMethods: [],
    preferredResins: ['Vestas blades', 'Siemens Gamesa towers'],
    preferredBrands: ['Vestas', 'Siemens Gamesa', 'GE'],
    volumeTier: 'high',
  },
  purchaseHistory: [],
  savedPaymentMethods: [],
  shippingAddresses: [
    {
      id: 'addr-1',
      name: 'Horizon Wind — Project Site',
      line1: '8900 Wind Farm Road',
      city: 'Sweetwater',
      state: 'TX',
      postalCode: '79556',
      country: 'US',
      isDefault: true,
    },
  ],
  orders: [],
  chatSummaries: [],
  meaningfulEvents: [],
  browseSessions: [],
  loyalty: { tier: 'gold', pointsBalance: 18500, lifetimePoints: 62000, memberSince: '2022-06-15', rewardsAvailable: [] },
};
