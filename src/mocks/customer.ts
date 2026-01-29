import type { CustomerProfile } from '@/types/customer';

export const MOCK_CUSTOMER: CustomerProfile = {
  id: 'cust-12345',
  name: 'Sarah',
  email: 'sarah@example.com',
  beautyProfile: {
    skinType: 'sensitive',
    concerns: ['hydration', 'redness'],
    allergies: ['fragrance'],
    preferredBrands: ['SERENE', 'Gentle Care'],
    ageRange: '30-40',
  },
  purchaseHistory: [
    {
      productId: 'cleanser-gentle',
      productName: 'Gentle Foaming Cleanser',
      purchaseDate: '2024-11-15',
      quantity: 1,
      rating: 5,
    },
  ],
  savedPaymentMethods: [
    {
      id: 'pm-1',
      type: 'card',
      last4: '4242',
      brand: 'visa',
      isDefault: true,
    },
  ],
  shippingAddresses: [
    {
      id: 'addr-1',
      name: 'Sarah Chen',
      line1: '123 Main St',
      city: 'San Francisco',
      state: 'CA',
      postalCode: '94102',
      country: 'US',
      isDefault: true,
    },
  ],
  travelPreferences: {
    upcomingTrips: [
      {
        destination: 'Mumbai, India',
        departureDate: '2025-03-15',
        climate: 'hot',
      },
    ],
    prefersTravelSize: true,
  },
};
