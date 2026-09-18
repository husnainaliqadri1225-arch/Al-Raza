export interface FragranceNotes {
  top: string[];
  heart: string[];
  base: string[];
}

export interface Product {
  id: string;
  shopifyId?: string;
  title: string;
  tagline?: string;
  handle: string;
  price: number;
  compareAtPrice?: number;
  currency: string;
  images: string[];
  featuredImage: string;
  category: 'Signature' | 'Oud & Oriental' | 'Fresh & Citrus' | 'Woody & Amber' | 'Aquatic & Floral';
  volume: string[];
  rating: number;
  reviewsCount: number;
  inStock: boolean;
  isBestSeller?: boolean;
  isFeatured?: boolean;
  notes: FragranceNotes;
  sillage: 'Moderate' | 'Intense' | 'Beast Mode' | 'Intimate';
  longevity: '6-8 Hours' | '8-12 Hours' | '14+ Hours';
  description: string;
  updatedAt?: string;
}

export interface ShopifyConfig {
  storeDomain: string;
  storefrontAccessToken: string;
  autoSync: boolean;
  syncIntervalMinutes: number;
  lastSyncedAt: string | null;
  syncStatus: 'idle' | 'syncing' | 'success' | 'error';
  syncMessage?: string;
  webhookSecret?: string;
  syncedProductsCount: number;
}

export interface StoreSettings {
  brandName: string;
  tagline: string;
  heroHeadline: string;
  heroHighlight: string;
  heroSubhead: string;
  heroDiscountBadge: string;
  heroDiscountSub: string;
  currency: string;
  currencySymbol: string;
  whatsappNumber: string;
  supportEmail: string;
  announcementText: string;
  showAnnouncement: boolean;
  heroImage: string;
  maisonImage?: string;
}

export interface Review {
  id: string;
  author: string;
  location?: string;
  perfumeTitle: string;
  rating: number;
  comment: string;
  verified: boolean;
  date: string;
}

export interface CartItem {
  product: Product;
  selectedVolume: string;
  quantity: number;
}
