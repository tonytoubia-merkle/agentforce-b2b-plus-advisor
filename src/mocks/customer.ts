import type { CustomerProfile } from '@/types/customer';

export const MOCK_CUSTOMER: CustomerProfile = {
  id: 'cust-12345',
  name: 'Rachel Nguyen',
  email: 'rachel.nguyen@spectra-auto.com',
  company: 'Spectra Automotive',
  jobTitle: 'Sr. Procurement Manager',
  beautyProfile: {
    industry: 'Automotive',
    primaryApplications: ['EV battery housings', 'interior trim'],
    certifications: ['IATF 16949', 'ISO 9001'],
    preferredProcessingMethods: ['injection-molding'],
    preferredResins: ['SABIC LEXAN', 'Ultramid Nylon'],
    preferredBrands: ['SABIC', 'BASF'],
    volumeTier: 'high',
  },
  purchaseHistory: [
    {
      productId: 'resin-pc-lexan',
      productName: 'LEXAN™ Polycarbonate Resin 141R',
      purchaseDate: '2024-11-15',
      quantity: 5000,
      rating: 5,
    },
  ],
  savedPaymentMethods: [],
  shippingAddresses: [
    {
      id: 'addr-1',
      name: 'Spectra Automotive — Receiving',
      line1: '4500 Industrial Blvd',
      city: 'Detroit',
      state: 'MI',
      postalCode: '48201',
      country: 'US',
      isDefault: true,
    },
  ],
  orders: [],
  chatSummaries: [],
  meaningfulEvents: [],
  browseSessions: [],
  loyalty: { tier: 'gold', pointsBalance: 12400, lifetimePoints: 48000, memberSince: '2022-03-15', rewardsAvailable: [] },
};
