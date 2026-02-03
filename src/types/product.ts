export type ProductCategory =
  | 'engineered-resin'
  | 'commodity-resin'
  | 'elastomer'
  | 'adhesive'
  | 'sealant'
  | 'color-masterbatch'
  | 'sustainable-resin'
  | 'high-performance-polymer'
  | 'compound'
  | 'additive'
  | 'purge-compound'
  | 'recycled-resin';

export interface ProductAttributes {
  processingMethod?: ('injection-molding' | 'extrusion' | 'blow-molding' | 'thermoforming' | 'rotational-molding' | '3d-printing')[];
  industries?: string[];
  certifications?: string[];
  packagingSize?: string;
  minOrderQty?: string;
  leadTimeDays?: number;
  sustainableContent?: string;
  // Legacy compat
  skinType?: string[];
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
