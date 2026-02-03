export type ProductCategory =
  | 'wind-turbine'
  | 'solar-panel'
  | 'inverter'
  | 'mounting-system'
  | 'energy-storage'
  | 'balance-of-system'
  | 'monitoring'
  | 'transformer'
  | 'cable-harness';

export interface ProductAttributes {
  powerRating?: string;
  voltage?: string;
  efficiency?: string;
  weight?: string;
  dimensions?: string;
  warranty?: string;
  industries?: string[];
  certifications?: string[];
  packagingSize?: string;
  minOrderQty?: string;
  leadTimeDays?: number;
  sustainableContent?: string;
  processingMethod?: string[];
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
