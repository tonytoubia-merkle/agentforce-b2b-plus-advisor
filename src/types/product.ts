export type ProductCategory = 
  | 'moisturizer'
  | 'cleanser'
  | 'serum'
  | 'sunscreen'
  | 'mask'
  | 'toner'
  | 'travel-kit';

export interface ProductAttributes {
  skinType?: ('dry' | 'oily' | 'combination' | 'sensitive' | 'normal')[];
  concerns?: string[];
  ingredients?: string[];
  size?: string;
  isTravel?: boolean;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: ProductCategory;
  price: number;
  currency: string;
  description: string;
  shortDescription: string;
  imageUrl: string;
  images: string[];
  attributes: ProductAttributes;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  personalizationScore?: number;
}
