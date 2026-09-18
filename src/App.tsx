import React, { useState, useEffect } from 'react';
import { Product, StoreSettings, Review, ShopifyConfig, CartItem } from './types';
import {
  getStoredProducts,
  saveStoredProducts,
  getStoredSettings,
  saveStoredSettings,
  getStoredReviews,
  saveStoredReviews,
  getStoredShopifyConfig,
  saveStoredShopifyConfig,
  getAdminAuthData,
  saveAdminAuthData,
  AdminAuthData,
} from './utils/storage';

import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ProductGrid } from './components/ProductGrid';
import { CustomerReviews } from './components/CustomerReviews';
import { ProductModal } from './components/ProductModal';
import { CartDrawer } from './components/CartDrawer';
import { AdminDashboard } from './components/AdminDashboard';
import { AboutSection } from './components/AboutSection';
import { Footer } from './components/Footer';
import { ContentPage } from './components/ContentPage';

export default function App() {
  // Store Core State
  const [products, setProducts] = useState<Product[]>(getStoredProducts);
  const [settings, setSettings] = useState<StoreSettings>(getStoredSettings);
  const [reviews, setReviews] = useState<Review[]>(getStoredReviews);
  const [shopifyConfig, setShopifyConfig] = useState<ShopifyConfig>(getStoredShopifyConfig);
  const [authData, setAuthData] = useState<AdminAuthData>(getAdminAuthData);

  // Interaction State
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [isMobileDeviceFrame, setIsMobileDeviceFrame] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('home');
  const [isSyncing, setIsSyncing] = useState(false);

  // Save changes to localStorage whenever state changes
  useEffect(() => {
    saveStoredProducts(products);
  }, [products]);

  useEffect(() => {
    saveStoredSettings(settings);
  }, [settings]);

  useEffect(() => {
    saveStoredReviews(reviews);
  }, [reviews]);

  useEffect(() => {
    saveStoredShopifyConfig(shopifyConfig);
  }, [shopifyConfig]);

  useEffect(() => {
    saveStoredAdminAuthData(authData);
  }, [authData]);

  function saveStoredAdminAuthData(data: AdminAuthData) {
    saveAdminAuthData(data);
  }

  // Keyboard shortcut Ctrl+Shift+A or Cmd+Shift+A to open Admin portal anytime
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        setIsAdminOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Auto-sync with Shopify on initial load if enabled
  useEffect(() => {
    if (shopifyConfig.autoSync && shopifyConfig.storeDomain) {
      handleSyncWithShopify(false);
    }
  }, []);

  // Sync with Shopify function
  const handleSyncWithShopify = async (showNotice = true) => {
    if (isSyncing) return;
    setIsSyncing(true);

    try {
      const res = await fetch('/api/shopify/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          storeDomain: shopifyConfig.storeDomain,
          accessToken: shopifyConfig.storefrontAccessToken,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.products && data.products.length > 0) {
          const syncedItems: Product[] = data.products;
          const existingNonShopify = products.filter((p) => !p.shopifyId);
          const merged = [...syncedItems, ...existingNonShopify];
          setProducts(merged);

          setShopifyConfig((prev) => ({
            ...prev,
            lastSyncedAt: new Date().toISOString(),
            syncStatus: 'success',
            syncedProductsCount: syncedItems.length,
          }));
        }
      }
    } catch (e) {
      console.warn('Shopify auto-sync check completed with fallback catalog.');
    } finally {
      setIsSyncing(false);
    }
  };

  // Cart operations
  const handleAddToCart = (product: Product, volume: string = '50ml', qty: number = 1) => {
    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex(
        (item) => item.product.id === product.id && item.selectedVolume === volume
      );
      if (existingIndex > -1) {
        const newCart = [...prevCart];
        newCart[existingIndex].quantity += qty;
        return newCart;
      } else {
        return [...prevCart, { product, selectedVolume: volume, quantity: qty }];
      }
    });
  };

  const handleUpdateCartQuantity = (productId: string, volume: string, qty: number) => {
    if (qty <= 0) {
      handleRemoveCartItem(productId, volume);
      return;
    }
    setCart((prev) =>
      prev.map((it) =>
        it.product.id === productId && it.selectedVolume === volume ? { ...it, quantity: qty } : it
      )
    );
  };

  const handleRemoveCartItem = (productId: string, volume: string) => {
    setCart((prev) =>
      prev.filter((it) => !(it.product.id === productId && it.selectedVolume === volume))
    );
  };

  const handleClearCart = () => {
    setCart([]);
  };

  // Filter products by search query
  const displayedProducts = searchQuery.trim()
    ? products.filter((p) => {
        const q = searchQuery.toLowerCase();
        return (
          p.title.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.tagline?.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.notes.top.some((n) => n.toLowerCase().includes(q)) ||
          p.notes.heart.some((n) => n.toLowerCase().includes(q)) ||
          p.notes.base.some((n) => n.toLowerCase().includes(q))
        );
      })
    : products;

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Render Inner Content
  const storeContent = (
    <div className="min-h-screen bg-[#05131E] text-slate-100 flex flex-col font-sans selection:bg-[#D4AF37]/30 selection:text-[#F3E5AB]">
      {/* Header */}
      <Header
        settings={settings}
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        isAdminLoggedIn={isAdminLoggedIn}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isMobileDeviceFrame={isMobileDeviceFrame}
        setIsMobileDeviceFrame={setIsMobileDeviceFrame}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        hideAdminButton={authData.hideEntryButton}
      />

      {/* Main Storefront Area */}
      <main className="flex-1">
        {activeTab === 'content' ? (
          <ContentPage
            settings={settings}
            onNavigateHome={() => setActiveTab('home')}
            onNavigateShop={() => {
              setActiveTab('home');
              setTimeout(() => {
                const el = document.getElementById('scents-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }, 100);
            }}
          />
        ) : (
          <>
            {/* Search Results Notice if searching */}
            {searchQuery.trim() && (
              <div className="max-w-7xl mx-auto px-4 pt-6 pb-2">
                <div className="p-3 rounded-2xl bg-[#09253A] border border-[#21567A] flex items-center justify-between text-xs sm:text-sm">
                  <span>
                    Showing results for: <strong className="text-[#F3E5AB]">"{searchQuery}"</strong> (
                    {displayedProducts.length} fragrances found)
                  </span>
                  <button
                    onClick={() => setSearchQuery('')}
                    className="text-xs text-[#D4AF37] hover:underline"
                  >
                    Clear Search
                  </button>
                </div>
              </div>
            )}

            {/* Hero Section matching the user's reference photo */}
            {!searchQuery && (
              <Hero
                settings={settings}
                onShopNowClick={() => {
                  const el = document.getElementById('scents-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
              />
            )}

            {/* Product Catalog Grid */}
            <ProductGrid
              products={displayedProducts}
              settings={settings}
              onSelectProduct={(p) => setSelectedProduct(p)}
              onAddToCart={(p, vol) => handleAddToCart(p, vol, 1)}
              onSyncRequest={() => handleSyncWithShopify(true)}
              isSyncing={isSyncing}
            />

            {/* Customer Reviews Section matching reference photo */}
            <CustomerReviews
              reviews={reviews}
              onAddReview={(newRev) => setReviews([newRev, ...reviews])}
            />

            {/* About the House of Al Raza */}
            <AboutSection settings={settings} />

            {/* Content & Fragrance Guide Section Embedded directly in Home page */}
            <ContentPage
              settings={settings}
              isHomeEmbedded={true}
              onNavigateShop={() => {
                const el = document.getElementById('scents-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
            />
          </>
        )}
      </main>

      {/* Luxury Footer */}
      <Footer
        settings={settings}
        onOpenAdmin={() => setIsAdminOpen(true)}
        isAdminLoggedIn={isAdminLoggedIn}
        hideAdminButton={authData.hideEntryButton}
        onNavigateContent={() => {
          const el = document.getElementById('content-section');
          if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
          } else {
            setActiveTab('content');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }}
      />

      {/* Product Detail Quick View Modal */}
      <ProductModal
        product={selectedProduct}
        settings={settings}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        settings={settings}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
      />

      {/* Admin Dashboard & Shopify Integration Hub */}
      <AdminDashboard
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        products={products}
        onUpdateProducts={setProducts}
        settings={settings}
        onUpdateSettings={setSettings}
        reviews={reviews}
        onUpdateReviews={setReviews}
        shopifyConfig={shopifyConfig}
        onUpdateShopifyConfig={setShopifyConfig}
        authData={authData}
        onUpdateAuthData={setAuthData}
        isLoggedIn={isAdminLoggedIn}
        setIsLoggedIn={setIsAdminLoggedIn}
      />
    </div>
  );

  // If Mobile Preview Frame is enabled, wrap in realistic smartphone bezel
  if (isMobileDeviceFrame) {
    return (
      <div className="min-h-screen bg-[#020A10] py-4 sm:py-8 px-2 sm:px-4 flex flex-col items-center justify-center">
        {/* Device Switcher Bar */}
        <div className="w-full max-w-sm mb-3 flex items-center justify-between text-xs text-slate-400 px-2">
          <span className="text-[#F3E5AB] font-serif font-semibold">
            📱 Mobile Store Preview (iPhone 16 Pro)
          </span>
          <button
            onClick={() => setIsMobileDeviceFrame(false)}
            className="px-3 py-1 rounded-full bg-[#0E3550] text-[#D4AF37] hover:bg-[#14486E] text-[11px] font-medium transition-colors"
          >
            Switch to Full View
          </button>
        </div>

        {/* Smartphone Shell */}
        <div className="relative w-full max-w-[412px] h-[850px] bg-[#000000] rounded-[52px] p-3 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_0_12px_#1B2631,0_0_0_14px_#091219] overflow-hidden border border-[#2B3B4C]/60 flex flex-col">
          {/* Dynamic Island Speaker Bar */}
          <div className="absolute top-5 left-1/2 -translate-x-1/2 w-28 h-6 bg-black rounded-full z-50 flex items-center justify-end px-3">
            <div className="w-2.5 h-2.5 bg-[#091522] rounded-full ring-1 ring-[#1E3347]" />
          </div>

          {/* Inner Scrollable Screen */}
          <div className="w-full h-full rounded-[40px] overflow-y-auto overflow-x-hidden relative bg-[#05131E]">
            {storeContent}
          </div>
        </div>
      </div>
    );
  }

  // Full Screen Responsive View
  return storeContent;
}
