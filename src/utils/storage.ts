import { Product, Review, ShopifyConfig, StoreSettings } from '../types';
import { INITIAL_PRODUCTS, INITIAL_REVIEWS, INITIAL_SETTINGS, INITIAL_SHOPIFY_CONFIG } from '../data/initialData';

const STORAGE_KEYS = {
  PRODUCTS: 'alraza_products_v1',
  SETTINGS: 'alraza_settings_v1',
  REVIEWS: 'alraza_reviews_v1',
  SHOPIFY: 'alraza_shopify_config_v1',
  ADMIN_AUTH: 'alraza_admin_auth_v1',
};

export function getStoredProducts(): Product[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    if (raw) {
      const parsed: Product[] = JSON.parse(raw);
      // Migrate any legacy or non-unique image URLs to pure individual digital renders
      const needsMigration = parsed.some(
        p =>
          p.featuredImage.includes('unsplash') ||
          p.featuredImage.includes('crystal_cyan_perfume') ||
          p.featuredImage.includes('digital_amber_perfume') ||
          p.featuredImage.includes('digital_emerald_perfume')
      );
      if (needsMigration) {
        saveStoredProducts(INITIAL_PRODUCTS);
        return INITIAL_PRODUCTS;
      }
      return parsed;
    }
  } catch (e) {
    console.error('Failed to parse stored products', e);
  }
  return INITIAL_PRODUCTS;
}

export function saveStoredProducts(products: Product[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  } catch (e) {
    console.error('Failed to save products', e);
  }
}

export function getStoredSettings(): StoreSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.brandName === 'Al Raza Fragrances' || !parsed.brandName) {
        parsed.brandName = 'Al Raza';
      }
      if (!parsed.heroImage || parsed.heroImage === '/alraza_hero_perfume.jpg' || parsed.heroImage === '/hero_man.jpg') {
        parsed.heroImage = '/hero_man.jpg';
      }
      if (!parsed.maisonImage || parsed.maisonImage === '/our_heritage.jpg' || parsed.maisonImage === '/crystal_cyan_perfume.jpg') {
        parsed.maisonImage = '/maison_modern.jpg';
      }
      return { ...INITIAL_SETTINGS, ...parsed };
    }
  } catch (e) {
    console.error('Failed to parse stored settings', e);
  }
  return INITIAL_SETTINGS;
}

export function saveStoredSettings(settings: StoreSettings) {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save settings', e);
  }
}

export function getStoredReviews(): Review[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.REVIEWS);
    if (raw) {
      const parsed: Review[] = JSON.parse(raw);
      return parsed.map((rev) => {
        if (rev.author === 'Sarah M.') return { ...rev, author: 'Omar Al-Sayed' };
        if (rev.author === 'Zainab R.') return { ...rev, author: 'Zayn R.' };
        return rev;
      });
    }
  } catch (e) {
    console.error('Failed to parse stored reviews', e);
  }
  return INITIAL_REVIEWS;
}

export function saveStoredReviews(reviews: Review[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(reviews));
  } catch (e) {
    console.error('Failed to save reviews', e);
  }
}

export function getStoredShopifyConfig(): ShopifyConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SHOPIFY);
    if (raw) return { ...INITIAL_SHOPIFY_CONFIG, ...JSON.parse(raw) };
  } catch (e) {
    console.error('Failed to parse stored Shopify config', e);
  }
  return INITIAL_SHOPIFY_CONFIG;
}

export function saveStoredShopifyConfig(config: ShopifyConfig) {
  try {
    localStorage.setItem(STORAGE_KEYS.SHOPIFY, JSON.stringify(config));
  } catch (e) {
    console.error('Failed to save Shopify config', e);
  }
}

export interface AdminAuthData {
  passwordHash: string;
  isPasswordSet: boolean;
  pinCode: string;
  lastLogin?: string;
  hideEntryButton: boolean;
}

export function getAdminAuthData(): AdminAuthData {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ADMIN_AUTH);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to parse admin auth data', e);
  }
  // Default: owner can create their custom password immediately
  return {
    passwordHash: '',
    isPasswordSet: false,
    pinCode: '1225',
    hideEntryButton: false,
  };
}

export function saveAdminAuthData(data: AdminAuthData) {
  try {
    localStorage.setItem(STORAGE_KEYS.ADMIN_AUTH, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save admin auth data', e);
  }
}
