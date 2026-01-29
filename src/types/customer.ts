export interface BeautyProfile {
  skinType: 'dry' | 'oily' | 'combination' | 'sensitive' | 'normal';
  concerns: string[];
  allergies: string[];
  preferredBrands: string[];
  ageRange?: string;
}

export interface TravelPreferences {
  upcomingTrips?: {
    destination: string;
    departureDate: string;
    climate: 'hot' | 'cold' | 'temperate' | 'humid';
  }[];
  prefersTravelSize: boolean;
}

export interface PurchaseRecord {
  productId: string;
  productName: string;
  purchaseDate: string;
  quantity: number;
  rating?: number;
}

export interface PaymentMethod {
  id: string;
  type: 'card' | 'paypal' | 'applepay';
  last4?: string;
  brand?: string;
  isDefault: boolean;
}

export interface Address {
  id: string;
  name: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

export interface CustomerProfile {
  id: string;
  name: string;
  email: string;
  beautyProfile: BeautyProfile;
  purchaseHistory: PurchaseRecord[];
  savedPaymentMethods: PaymentMethod[];
  shippingAddresses: Address[];
  travelPreferences?: TravelPreferences;
}
