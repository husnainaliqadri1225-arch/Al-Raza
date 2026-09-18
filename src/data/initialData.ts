import { Product, Review, ShopifyConfig, StoreSettings } from '../types';

export const INITIAL_SETTINGS: StoreSettings = {
  brandName: 'Al Raza',
  tagline: 'Luxury Artisanal Parfums & Scents',
  heroHeadline: 'Fall in love with Our Signature',
  heroHighlight: 'Perfumes',
  heroSubhead: 'Discover the perfect fragrance for every moment. Luxury scents crafted for a confident, unforgettable you.',
  heroDiscountBadge: '50% - 15% OFF',
  heroDiscountSub: 'Exclusive · Limited Time',
  currency: 'USD',
  currencySymbol: '$',
  whatsappNumber: '+923001234567',
  supportEmail: 'concierge@alraza.com',
  announcementText: '✨ Worldwide Express Delivery | Use Code ALRAZA15 for Extra 15% Off',
  showAnnouncement: true,
  heroImage: '/hero_man.jpg',
  maisonImage: '/maison_modern.jpg',
};

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'perf-1',
    shopifyId: 'gid://shopify/Product/84729101',
    title: 'Fougerewood Elixir',
    tagline: 'Intense Woods & Rare Spices',
    handle: 'fougerewood-elixir',
    price: 50.0,
    compareAtPrice: 75.0,
    currency: '$',
    images: [
      '/perfume_fougerewood.jpg'
    ],
    featuredImage: '/perfume_fougerewood.jpg',
    category: 'Woody & Amber',
    volume: ['50ml', '100ml'],
    rating: 4.9,
    reviewsCount: 142,
    inStock: true,
    isBestSeller: true,
    isFeatured: true,
    notes: {
      top: ['Cardamom', 'Pink Pepper', 'Italian Bergamot'],
      heart: ['Lavender', 'Virginia Cedarwood', 'Smoked Birch'],
      base: ['Cambodian Oud', 'Amber Resin', 'Haitian Vetiver']
    },
    sillage: 'Intense',
    longevity: '14+ Hours',
    description: 'An alluring, aristocratic woody elixir capturing the quiet majesty of ancient midnight forests. Layered with rare Cambodian oud and crushed birch, wrapped in cool lavender mist.'
  },
  {
    id: 'perf-2',
    shopifyId: 'gid://shopify/Product/84729102',
    title: 'City of Petal',
    tagline: 'Luminescent Floral & Crisp Citrus',
    handle: 'city-of-petal',
    price: 90.0,
    compareAtPrice: 120.0,
    currency: '$',
    images: [
      '/perfume_city_petal.jpg'
    ],
    featuredImage: '/perfume_city_petal.jpg',
    category: 'Aquatic & Floral',
    volume: ['50ml', '100ml'],
    rating: 4.8,
    reviewsCount: 98,
    inStock: true,
    isBestSeller: true,
    isFeatured: true,
    notes: {
      top: ['White Peach', 'Mandarin Zest', 'Morning Dew'],
      heart: ['Damask Rose', 'Jasmine Sambac', 'French Peony'],
      base: ['White Musk', 'Cashmere Wood', 'Clear Amber']
    },
    sillage: 'Moderate',
    longevity: '8-12 Hours',
    description: 'A breathtaking morning walk through royal botanical gardens. Crisp morning dew melds into velvety Damask roses and luminous jasmine sambac.'
  },
  {
    id: 'perf-3',
    shopifyId: 'gid://shopify/Product/84729103',
    title: 'Oceanic Work',
    tagline: 'Deep Sea Amber & Mineral Salt',
    handle: 'oceanic-work',
    price: 70.0,
    compareAtPrice: 95.0,
    currency: '$',
    images: [
      '/perfume_oceanic.jpg'
    ],
    featuredImage: '/perfume_oceanic.jpg',
    category: 'Signature',
    volume: ['50ml', '100ml'],
    rating: 5.0,
    reviewsCount: 167,
    inStock: true,
    isBestSeller: true,
    isFeatured: true,
    notes: {
      top: ['Sea Salt Breeze', 'Calabrian Lemon', 'Crisp Sage'],
      heart: ['Blue Ambergris', 'Driftwood', 'Crushed Juniper'],
      base: ['Oakmoss', 'Mineral Marine Accord', 'Cedar']
    },
    sillage: 'Intense',
    longevity: '14+ Hours',
    description: 'Crashing turquoise waves against sun-warmed cliffs. A majestic, crisp mineral scent imbued with authentic blue ambergris and cool sea salt.'
  },
  {
    id: 'perf-4',
    shopifyId: 'gid://shopify/Product/84729104',
    title: 'Redwood Bliss',
    tagline: 'Smoky Warmth & Golden Vanilla',
    handle: 'redwood-bliss',
    price: 80.0,
    compareAtPrice: 110.0,
    currency: '$',
    images: [
      '/perfume_redwood.jpg'
    ],
    featuredImage: '/perfume_redwood.jpg',
    category: 'Woody & Amber',
    volume: ['50ml', '100ml'],
    rating: 4.9,
    reviewsCount: 84,
    inStock: true,
    isBestSeller: false,
    isFeatured: true,
    notes: {
      top: ['Cinnamon Bark', 'Blood Orange', 'Nutmeg'],
      heart: ['California Redwood', 'Tonka Bean', 'Tobacco Leaf'],
      base: ['Bourbon Vanilla', 'Sandalwood', 'Benzoin']
    },
    sillage: 'Beast Mode',
    longevity: '14+ Hours',
    description: 'A comforting, hypnotic evening fragrance of rich cured redwood, sweet bourbon vanilla, and golden spiced amber with intoxicating projection.'
  },
  {
    id: 'perf-5',
    shopifyId: 'gid://shopify/Product/84729105',
    title: 'Citrus Zeal',
    tagline: 'Sparkling Mediterranean Sunshine',
    handle: 'citrus-zeal',
    price: 70.0,
    compareAtPrice: 85.0,
    currency: '$',
    images: [
      '/perfume_citrus_zeal.jpg'
    ],
    featuredImage: '/perfume_citrus_zeal.jpg',
    category: 'Fresh & Citrus',
    volume: ['50ml', '100ml'],
    rating: 4.7,
    reviewsCount: 63,
    inStock: true,
    isBestSeller: false,
    isFeatured: true,
    notes: {
      top: ['Sicilian Grapefruit', 'Lime Blossom', 'Yuzu'],
      heart: ['Neroli Bigarade', 'Petitgrain', 'Ginger Root'],
      base: ['Vetiver Java', 'White Cedar', 'Clean Musk']
    },
    sillage: 'Moderate',
    longevity: '8-12 Hours',
    description: 'An invigorating blast of sparkling Sicilian sunshine, crushed yuzu rind, and vibrant neroli blossoms that leaves an electrifying, clean sillage.'
  },
  {
    id: 'perf-6',
    shopifyId: 'gid://shopify/Product/84729106',
    title: 'Verdant Work',
    tagline: 'Botanical Luxury & Royal Patchouli',
    handle: 'verdant-work',
    price: 100.0,
    compareAtPrice: 135.0,
    currency: '$',
    images: [
      '/perfume_verdant_work.jpg'
    ],
    featuredImage: '/perfume_verdant_work.jpg',
    category: 'Oud & Oriental',
    volume: ['50ml', '100ml'],
    rating: 4.9,
    reviewsCount: 112,
    inStock: true,
    isBestSeller: true,
    isFeatured: true,
    notes: {
      top: ['Green Angelica', 'Galbanum', 'Bergamot'],
      heart: ['Fig Leaf', 'Turkish Iris', 'Cardamom'],
      base: ['Indonesian Patchouli', 'Dark Amber', 'Leather']
    },
    sillage: 'Intense',
    longevity: '14+ Hours',
    description: 'Sophisticated botanical grandeur. Crisp green galbanum and velvety fig leaf resting on an opulent bed of dark Indonesian patchouli and soft leather.'
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    author: 'Hamza K.',
    location: 'Lahore, PK',
    perfumeTitle: 'Fougerewood Elixir',
    rating: 5,
    comment: 'Absolutely love this fragrance! It’s elegant, long-lasting, and makes me feel confident. The quality is outstanding and the packaging is beautiful. Highly recommend!',
    verified: true,
    date: '3 days ago'
  },
  {
    id: 'rev-2',
    author: 'Omar Al-Sayed',
    location: 'Dubai, UAE',
    perfumeTitle: 'Citrus Zeal',
    rating: 5,
    comment: 'Citrus Zeal is my go-to scent. Fresh, clean, and perfect for everyday use. It lasts for hours and always gets compliments. A must-have in your luxury collection!',
    verified: true,
    date: '1 week ago'
  },
  {
    id: 'rev-3',
    author: 'Zayn R.',
    location: 'Karachi, PK',
    perfumeTitle: 'Oceanic Work',
    rating: 5,
    comment: 'The projection on Oceanic Work is pure magic. Rich ambergris with mineral sea salt. Al Raza has outdone international designer houses.',
    verified: true,
    date: '2 weeks ago'
  }
];

export const INITIAL_SHOPIFY_CONFIG: ShopifyConfig = {
  storeDomain: 'alrazafragrances.myshopify.com',
  storefrontAccessToken: 'shpat_live_sample_token_alraza_2026',
  autoSync: true,
  syncIntervalMinutes: 10,
  lastSyncedAt: new Date().toISOString(),
  syncStatus: 'success',
  syncMessage: 'Connected to Shopify Storefront API. 6 products synchronized with high-res images.',
  webhookSecret: 'shsec_alraza_webhook_secret_key',
  syncedProductsCount: 6
};
