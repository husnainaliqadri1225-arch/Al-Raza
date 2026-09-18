import React, { useState } from 'react';
import {
  Product,
  ShopifyConfig,
  StoreSettings,
  Review,
} from '../types';
import { AdminAuthData } from '../utils/storage';
import {
  Lock,
  Key,
  ShieldCheck,
  RefreshCw,
  ShoppingBag,
  Sliders,
  Store,
  Plus,
  Trash2,
  Edit2,
  Check,
  AlertCircle,
  ExternalLink,
  Sparkles,
  X,
  Eye,
  EyeOff,
  Image as ImageIcon,
  Send,
  HelpCircle,
  Upload,
} from 'lucide-react';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onUpdateProducts: (products: Product[]) => void;
  settings: StoreSettings;
  onUpdateSettings: (settings: StoreSettings) => void;
  reviews: Review[];
  onUpdateReviews: (reviews: Review[]) => void;
  shopifyConfig: ShopifyConfig;
  onUpdateShopifyConfig: (config: ShopifyConfig) => void;
  authData: AdminAuthData;
  onUpdateAuthData: (data: AdminAuthData) => void;
  isLoggedIn: boolean;
  setIsLoggedIn: (val: boolean) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  isOpen,
  onClose,
  products,
  onUpdateProducts,
  settings,
  onUpdateSettings,
  reviews,
  onUpdateReviews,
  shopifyConfig,
  onUpdateShopifyConfig,
  authData,
  onUpdateAuthData,
  isLoggedIn,
  setIsLoggedIn,
}) => {
  if (!isOpen) return null;

  // Active Tab inside Admin Panel
  const [adminTab, setAdminTab] = useState<'shopify' | 'products' | 'branding' | 'security' | 'reviews'>('shopify');

  // Password Login State
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // New Password Creation State (when owner sets password for the first time or changes it)
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [newPin, setNewPin] = useState(authData.pinCode || '1225');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Shopify Sync State
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatusMsg, setSyncStatusMsg] = useState<{ text: string; isError: boolean } | null>(null);
  const [testShopifyDomain, setTestShopifyDomain] = useState(shopifyConfig.storeDomain);
  const [testAccessToken, setTestAccessToken] = useState(shopifyConfig.storefrontAccessToken);

  // Product Editing / Add Modal State
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddingNewProduct, setIsAddingNewProduct] = useState(false);
  const [productForm, setProductForm] = useState<Partial<Product>>({});

  // Handle Login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (!authData.isPasswordSet) {
      // First time, allow them to set password immediately
      return;
    }

    if (loginPassword === authData.passwordHash || loginPassword === authData.pinCode) {
      setIsLoggedIn(true);
      setLoginPassword('');
    } else {
      setLoginError('Incorrect password or PIN. Please try again.');
    }
  };

  // Handle Setting or Updating Password
  const handleSavePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (newPassword.length < 4) {
      setPasswordError('Password must be at least 4 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match. Please re-enter.');
      return;
    }

    const updatedAuth: AdminAuthData = {
      ...authData,
      passwordHash: newPassword,
      isPasswordSet: true,
      pinCode: newPin || '1225',
      lastLogin: new Date().toISOString(),
    };

    onUpdateAuthData(updatedAuth);
    setIsLoggedIn(true);
    setPasswordSuccess('Admin password successfully saved! You can now manage your store securely.');
    setNewPassword('');
    setConfirmPassword('');
  };

  // Handle Live Shopify Sync
  const handleTriggerShopifySync = async () => {
    setIsSyncing(true);
    setSyncStatusMsg(null);

    try {
      const res = await fetch('/api/shopify/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          storeDomain: testShopifyDomain,
          accessToken: testAccessToken,
        }),
      });

      const data = await res.json();

      if (data.success && data.products && data.products.length > 0) {
        // Merge synced Shopify products with our catalog
        const syncedItems: Product[] = data.products;
        
        // Update products list: replace or prepend
        const existingNonShopify = products.filter((p) => !p.shopifyId);
        const merged = [...syncedItems, ...existingNonShopify];

        onUpdateProducts(merged);

        const updatedConfig: ShopifyConfig = {
          ...shopifyConfig,
          storeDomain: testShopifyDomain,
          storefrontAccessToken: testAccessToken,
          lastSyncedAt: new Date().toISOString(),
          syncStatus: 'success',
          syncMessage: `Successfully synchronized ${syncedItems.length} products & images from ${testShopifyDomain}.`,
          syncedProductsCount: syncedItems.length,
        };
        onUpdateShopifyConfig(updatedConfig);

        setSyncStatusMsg({
          text: `Success! ${syncedItems.length} products & high-resolution photos imported from Shopify directly to home page.`,
          isError: false,
        });
      } else {
        throw new Error(data.error || 'No products returned from Shopify. Check store domain.');
      }
    } catch (err: any) {
      // Fallback demo sync if the user's live store domain is not yet live or on sandbox
      setSyncStatusMsg({
        text: `Shopify Notice: ${err.message || 'Could not reach Shopify domain directly'}. The app is configured with custom Shopify API proxy & webhook listener ready to sync anytime!`,
        isError: true,
      });

      const updatedConfig: ShopifyConfig = {
        ...shopifyConfig,
        storeDomain: testShopifyDomain,
        storefrontAccessToken: testAccessToken,
        syncStatus: 'error',
        syncMessage: err.message,
      };
      onUpdateShopifyConfig(updatedConfig);
    } finally {
      setIsSyncing(false);
    }
  };

  // Handle Product Save (New or Edited)
  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.title || !productForm.price) return;

    if (editingProduct) {
      // Update existing
      const updated = products.map((p) =>
        p.id === editingProduct.id
          ? ({
              ...p,
              ...productForm,
              price: Number(productForm.price),
              compareAtPrice: productForm.compareAtPrice ? Number(productForm.compareAtPrice) : undefined,
            } as Product)
          : p
      );
      onUpdateProducts(updated);
      setEditingProduct(null);
    } else {
      // Create new
      const newProd: Product = {
        id: `custom-${Date.now()}`,
        title: productForm.title || 'New Luxury Scent',
        tagline: productForm.tagline || 'Artisanal Perfume',
        handle: (productForm.title || 'fragrance').toLowerCase().replace(/\s+/g, '-'),
        price: Number(productForm.price) || 60,
        compareAtPrice: productForm.compareAtPrice ? Number(productForm.compareAtPrice) : undefined,
        currency: settings.currencySymbol || '$',
        images: productForm.images?.length ? productForm.images : [productForm.featuredImage || '/perfume_fougerewood.jpg'],
        featuredImage: productForm.featuredImage || '/perfume_fougerewood.jpg',
        category: (productForm.category as any) || 'Signature',
        volume: productForm.volume || ['50ml', '100ml'],
        rating: 5.0,
        reviewsCount: 1,
        inStock: productForm.inStock !== false,
        isFeatured: true,
        notes: productForm.notes || {
          top: ['Bergamot', 'Mandarin'],
          heart: ['Rose', 'Cedarwood'],
          base: ['Oud', 'Amber'],
        },
        sillage: (productForm.sillage as any) || 'Intense',
        longevity: (productForm.longevity as any) || '14+ Hours',
        description: productForm.description || 'Exclusive luxury perfume distilled by Al Raza.',
      };

      onUpdateProducts([newProd, ...products]);
      setIsAddingNewProduct(false);
    }

    setProductForm({});
  };

  // Delete product
  const handleDeleteProduct = (id: string) => {
    if (window.confirm('Are you sure you want to remove this perfume from the store?')) {
      onUpdateProducts(products.filter((p) => p.id !== id));
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in">
      <div className="relative w-full max-w-5xl bg-[#061A28] border border-[#23587A] rounded-3xl shadow-2xl overflow-hidden text-slate-100 my-auto max-h-[92vh] flex flex-col">
        
        {/* Header Bar */}
        <div className="p-4 sm:p-6 bg-[#04131E] border-b border-[#184666] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-[#0A263B] border border-[#D4AF37]/40 text-[#D4AF37]">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif text-lg sm:text-xl font-bold text-slate-100">
                  Al Raza · Owner Control Panel
                </h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#0E3550] text-[#D4AF37] font-semibold border border-[#D4AF37]/30">
                  Admin Exclusive
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {isLoggedIn ? 'Manage Shopify Sync, Products, Pricing, and Security' : 'Enter Owner Password or PIN to unlock'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isLoggedIn && (
              <button
                onClick={() => setIsLoggedIn(false)}
                className="px-3 py-1.5 rounded-xl bg-[#0A263B] hover:bg-[#0E3550] text-xs text-slate-300 hover:text-white border border-[#1E4D6E]"
                title="Lock Dashboard"
              >
                Lock Panel
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-[#0A263B]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8">
          
          {/* STATE 1: If Not Logged In and Password is Set -> Password Prompt */}
          {!isLoggedIn && authData.isPasswordSet && (
            <div className="max-w-md mx-auto py-8 text-center space-y-6">
              <div className="w-16 h-16 mx-auto rounded-full bg-[#0A263B] border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] shadow-xl">
                <Key className="w-8 h-8 animate-pulse" />
              </div>

              <div>
                <h3 className="font-serif text-2xl font-bold text-slate-100 mb-2">
                  Owner Password Required
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Only you have access to modify the storefront, sync Shopify products, or update listings.
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4 text-left">
                <div>
                  <label className="block text-xs text-slate-300 mb-1.5 font-medium">
                    Enter Your Admin Password / PIN
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="Enter password..."
                      required
                      autoFocus
                      className="w-full bg-[#071926] border border-[#1E4D6E] rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-[#D4AF37]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-slate-400 hover:text-white"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {loginError && (
                  <div className="p-3 rounded-xl bg-red-950/60 border border-red-800/60 text-xs text-red-300 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{loginError}</span>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#D4AF37] via-[#E8C15A] to-[#B8860B] text-[#05131E] font-serif font-bold text-sm tracking-wider shadow-lg flex items-center justify-center gap-2 hover:opacity-95"
                >
                  <Key className="w-4 h-4" />
                  <span>Unlock Admin Dashboard</span>
                </button>

                <div className="pt-2 text-center">
                  <p className="text-[11px] text-slate-500">
                    Default Master PIN is available in initial setup if needed.
                  </p>
                </div>
              </form>
            </div>
          )}

          {/* STATE 2: If No Password Set Yet -> Owner Creates First Password */}
          {!isLoggedIn && !authData.isPasswordSet && (
            <div className="max-w-md mx-auto py-8 text-center space-y-6">
              <div className="w-16 h-16 mx-auto rounded-full bg-[#0E3550] border border-[#D4AF37] flex items-center justify-center text-[#D4AF37] shadow-xl">
                <Sparkles className="w-8 h-8 text-[#D4AF37]" />
              </div>

              <div>
                <h3 className="font-serif text-2xl font-bold text-gold-gradient mb-2">
                  Create Your Admin Password
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Aap apna password khud bana sakte hain taake store settings aur Shopify sync sirf aapke control mein rahein.
                </p>
              </div>

              <form onSubmit={handleSavePassword} className="space-y-4 text-left">
                <div>
                  <label className="block text-xs text-slate-300 mb-1 font-medium">
                    New Admin Password
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="e.g. Alraza2026@"
                    required
                    className="w-full bg-[#071926] border border-[#1E4D6E] rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-300 mb-1 font-medium">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter password"
                    required
                    className="w-full bg-[#071926] border border-[#1E4D6E] rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-300 mb-1 font-medium">
                    Backup Quick PIN (4 digits)
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    value={newPin}
                    onChange={(e) => setNewPin(e.target.value)}
                    placeholder="1225"
                    className="w-full bg-[#071926] border border-[#1E4D6E] rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                {passwordError && (
                  <div className="p-3 rounded-xl bg-red-950/60 border border-red-800/60 text-xs text-red-300">
                    {passwordError}
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#D4AF37] via-[#E8C15A] to-[#B8860B] text-[#05131E] font-serif font-bold text-sm tracking-wider shadow-lg flex items-center justify-center gap-2 hover:opacity-95"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Set Password & Open Dashboard</span>
                </button>
              </form>
            </div>
          )}

          {/* STATE 3: Logged In -> Full Admin Dashboard with Tabs */}
          {isLoggedIn && (
            <div className="space-y-6">
              
              {/* Tabs Navigation */}
              <div className="flex items-center gap-2 border-b border-[#184666] pb-3 overflow-x-auto no-scrollbar">
                <button
                  onClick={() => setAdminTab('shopify')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
                    adminTab === 'shopify'
                      ? 'bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#05131E] font-bold shadow'
                      : 'bg-[#0A263B] text-slate-300 hover:text-white border border-[#1B4E70]'
                  }`}
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Shopify Sync & Images</span>
                </button>

                <button
                  onClick={() => setAdminTab('products')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
                    adminTab === 'products'
                      ? 'bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#05131E] font-bold shadow'
                      : 'bg-[#0A263B] text-slate-300 hover:text-white border border-[#1B4E70]'
                  }`}
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Perfume Listings ({products.length})</span>
                </button>

                <button
                  onClick={() => setAdminTab('branding')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
                    adminTab === 'branding'
                      ? 'bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#05131E] font-bold shadow'
                      : 'bg-[#0A263B] text-slate-300 hover:text-white border border-[#1B4E70]'
                  }`}
                >
                  <Store className="w-4 h-4" />
                  <span>Store Branding & Hero</span>
                </button>

                <button
                  onClick={() => setAdminTab('reviews')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
                    adminTab === 'reviews'
                      ? 'bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#05131E] font-bold shadow'
                      : 'bg-[#0A263B] text-slate-300 hover:text-white border border-[#1B4E70]'
                  }`}
                >
                  <Sliders className="w-4 h-4" />
                  <span>Reviews ({reviews.length})</span>
                </button>

                <button
                  onClick={() => setAdminTab('security')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
                    adminTab === 'security'
                      ? 'bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#05131E] font-bold shadow'
                      : 'bg-[#0A263B] text-slate-300 hover:text-white border border-[#1B4E70]'
                  }`}
                >
                  <Key className="w-4 h-4" />
                  <span>Password & Entry Button</span>
                </button>
              </div>

              {/* TAB 1: SHOPIFY INTEGRATION HUB */}
              {adminTab === 'shopify' && (
                <div className="space-y-6 animate-in fade-in">
                  
                  {/* Status Banner */}
                  <div className="p-5 rounded-2xl bg-gradient-to-r from-[#08293D] via-[#0C3752] to-[#08293D] border border-[#2B6F9A]/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-lg">
                    <div className="flex items-start gap-3.5">
                      <div className="p-3 rounded-xl bg-[#0F4263] text-[#38BDF8] border border-[#38BDF8]/30">
                        <RefreshCw className={`w-6 h-6 ${isSyncing ? 'animate-spin text-[#D4AF37]' : ''}`} />
                      </div>
                      <div>
                        <h4 className="font-serif text-base sm:text-lg font-bold text-slate-100 flex items-center gap-2">
                          <span>Live Shopify Auto-Sync Engine</span>
                          <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded-full uppercase font-sans">
                            Ready
                          </span>
                        </h4>
                        <p className="text-xs text-slate-300 mt-1 max-w-xl">
                          Jab aap Shopify per new listing karte hain ya product images update karte hain, wo pictures automatically home page per load ho jati hain via our backend sync proxy and webhook receiver.
                        </p>
                      </div>
                    </div>

                    <button
                      id="btn-admin-sync-now"
                      onClick={handleTriggerShopifySync}
                      disabled={isSyncing}
                      className="w-full md:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B8860B] hover:opacity-95 text-[#05131E] font-serif font-bold text-xs sm:text-sm tracking-wider shadow-lg flex items-center justify-center gap-2 whitespace-nowrap disabled:opacity-50 cursor-pointer"
                    >
                      <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
                      <span>{isSyncing ? 'Syncing Images...' : 'Sync with Shopify Now'}</span>
                    </button>
                  </div>

                  {syncStatusMsg && (
                    <div
                      className={`p-4 rounded-xl border text-xs flex items-center gap-2.5 ${
                        syncStatusMsg.isError
                          ? 'bg-amber-950/60 border-amber-800/60 text-amber-200'
                          : 'bg-emerald-950/60 border-emerald-800/60 text-emerald-200'
                      }`}
                    >
                      {syncStatusMsg.isError ? (
                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      ) : (
                        <Check className="w-4 h-4 flex-shrink-0 text-emerald-400" />
                      )}
                      <span>{syncStatusMsg.text}</span>
                    </div>
                  )}

                  {/* Shopify Configuration Form */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    
                    {/* Connection Credentials */}
                    <div className="p-6 rounded-2xl bg-[#072133] border border-[#1B4E70] space-y-4">
                      <h4 className="font-serif text-base font-bold text-[#F3E5AB] flex items-center gap-2">
                        <Store className="w-4 h-4 text-[#D4AF37]" />
                        <span>Shopify Store Details</span>
                      </h4>

                      <div>
                        <label className="block text-xs text-slate-300 mb-1 font-medium">
                          Shopify Store Domain (e.g., your-store.myshopify.com)
                        </label>
                        <input
                          type="text"
                          value={testShopifyDomain}
                          onChange={(e) => setTestShopifyDomain(e.target.value)}
                          placeholder="alrazafragrances.myshopify.com"
                          className="w-full bg-[#051624] border border-[#1E4D6E] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-[#D4AF37]"
                        />
                        <p className="text-[11px] text-slate-400 mt-1">
                          Aap apna koi bhi Shopify store domain yahan enter kar sakte hain.
                        </p>
                      </div>

                      <div>
                        <label className="block text-xs text-slate-300 mb-1 font-medium">
                          Storefront Access Token (Optional for public catalog)
                        </label>
                        <input
                          type="password"
                          value={testAccessToken}
                          onChange={(e) => setTestAccessToken(e.target.value)}
                          placeholder="shpat_xxxxxxxxxxxxxxxxxxxxx"
                          className="w-full bg-[#051624] border border-[#1E4D6E] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-[#D4AF37]"
                        />
                        <p className="text-[11px] text-slate-400 mt-1">
                          Created in Shopify Admin → Apps → Develop apps → Storefront API.
                        </p>
                      </div>

                      <div className="pt-2 flex items-center justify-between">
                        <span className="text-xs text-slate-300">Auto-sync when page loads:</span>
                        <input
                          type="checkbox"
                          checked={shopifyConfig.autoSync}
                          onChange={(e) =>
                            onUpdateShopifyConfig({
                              ...shopifyConfig,
                              autoSync: e.target.checked,
                            })
                          }
                          className="w-4 h-4 accent-[#D4AF37]"
                        />
                      </div>
                    </div>

                    {/* Webhook & Automatic Update Setup */}
                    <div className="p-6 rounded-2xl bg-[#072133] border border-[#1B4E70] space-y-4">
                      <h4 className="font-serif text-base font-bold text-[#F3E5AB] flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-[#38BDF8]" />
                        <span>Instant Auto-Update Webhook</span>
                      </h4>

                      <p className="text-xs text-slate-300 leading-relaxed">
                        Jab aap Shopify dashboard mein koi new perfume add karein ya image change karein, Shopify yeh notification bhejega taake pictures fauran update hon:
                      </p>

                      <div className="bg-[#04121B] p-3 rounded-xl border border-[#153D57] font-mono text-[11px] text-[#38BDF8] break-all select-all">
                        {typeof window !== 'undefined' ? `${window.location.origin}/api/shopify/webhook` : '/api/shopify/webhook'}
                      </div>

                      <div className="space-y-2 text-xs text-slate-300">
                        <p className="font-medium text-[#F3E5AB]">How to setup in Shopify:</p>
                        <ol className="list-decimal list-inside space-y-1 text-[11px] text-slate-400">
                          <li>Shopify Admin → <strong>Settings</strong> → <strong>Notifications</strong></li>
                          <li>Scroll to <strong>Webhooks</strong> → Click <strong>Create Webhook</strong></li>
                          <li>Event: <strong>Product creation</strong> and <strong>Product update</strong></li>
                          <li>Format: <strong>JSON</strong> · URL: Paste the address above</li>
                        </ol>
                      </div>

                      <div className="pt-1 flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            fetch('/api/shopify/webhook', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ test: true }),
                            }).then(() => {
                              alert('Test webhook received! Images and products automatically refreshed.');
                            });
                          }}
                          className="px-3 py-1.5 rounded-lg bg-[#0E3550] hover:bg-[#13486E] text-xs text-[#38BDF8] border border-[#2B6F9A]"
                        >
                          Simulate Test Webhook
                        </button>
                      </div>
                    </div>

                  </div>

                  {/* Synced Products Preview Table */}
                  <div className="p-6 rounded-2xl bg-[#072133] border border-[#1B4E70] space-y-4">
                    <h4 className="font-serif text-base font-bold text-slate-100 flex items-center justify-between">
                      <span>Currently Loaded Storefront Products & Live Images</span>
                      <span className="text-xs text-slate-400 font-sans font-normal">
                        Total {products.length} Perfumes
                      </span>
                    </h4>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 pt-2">
                      {products.map((p) => {
                        const img = p.featuredImage || p.images[0] || '/perfume_fougerewood.jpg';
                        return (
                          <div
                            key={p.id}
                            className="bg-[#051724] border border-[#184666] rounded-xl p-2.5 flex flex-col items-center text-center group"
                          >
                            <div className="w-16 h-16 rounded-lg bg-[#061B29] p-1 flex items-center justify-center mb-1 overflow-hidden">
                              <img src={img} alt={p.title} className="max-h-full max-w-full object-contain group-hover:scale-110 transition-transform" />
                            </div>
                            <span className="text-[11px] font-medium text-slate-200 truncate w-full">
                              {p.title}
                            </span>
                            <span className="text-[10px] text-[#D4AF37] font-bold">
                              {settings.currencySymbol}{p.price.toFixed(1)}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                </div>
              )}

              {/* TAB 2: PRODUCTS MANAGER */}
              {adminTab === 'products' && (
                <div className="space-y-6 animate-in fade-in">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-serif text-xl font-bold text-slate-100">
                        Perfume Inventory Management
                      </h3>
                      <p className="text-xs text-slate-400">
                        Add new scents, update prices, change images, and edit notes
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        setIsAddingNewProduct(true);
                        setEditingProduct(null);
                        setProductForm({
                          title: '',
                          tagline: 'Artisanal Luxury Scent',
                          price: 65,
                          category: 'Signature',
                          featuredImage: '/perfume_fougerewood.jpg',
                          volume: ['50ml', '100ml'],
                          inStock: true,
                          notes: {
                            top: ['Bergamot', 'Mandarin'],
                            heart: ['Rose', 'Cedarwood'],
                            base: ['Oud', 'Amber'],
                          },
                          description: 'Handcrafted luxury fragrance with rich projection and longevity.',
                        });
                      }}
                      className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#05131E] font-semibold text-xs flex items-center gap-1.5 shadow"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add New Perfume</span>
                    </button>
                  </div>

                  {/* Add / Edit Form Modal */}
                  {(isAddingNewProduct || editingProduct) && (
                    <div className="p-6 rounded-2xl bg-[#09253A] border border-[#23587A] space-y-4 shadow-xl">
                      <div className="flex items-center justify-between border-b border-[#1A4B6B] pb-3">
                        <h4 className="font-serif text-lg font-bold text-gold-gradient">
                          {editingProduct ? `Edit: ${editingProduct.title}` : 'Add New Fragrance'}
                        </h4>
                        <button
                          onClick={() => {
                            setIsAddingNewProduct(false);
                            setEditingProduct(null);
                          }}
                          className="text-slate-400 hover:text-white"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>

                      <form onSubmit={handleSaveProduct} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs text-slate-300 mb-1">Perfume Title</label>
                            <input
                              type="text"
                              required
                              value={productForm.title || ''}
                              onChange={(e) => setProductForm({ ...productForm, title: e.target.value })}
                              placeholder="e.g. Royal Oud Sapphire"
                              className="w-full bg-[#061826] border border-[#1E4D6E] rounded-xl px-3.5 py-2 text-xs text-slate-100 focus:outline-none focus:border-[#D4AF37]"
                            />
                          </div>

                          <div>
                            <label className="block text-xs text-slate-300 mb-1">Tagline / Accord</label>
                            <input
                              type="text"
                              value={productForm.tagline || ''}
                              onChange={(e) => setProductForm({ ...productForm, tagline: e.target.value })}
                              placeholder="e.g. Precious Woods & Smoky Amber"
                              className="w-full bg-[#061826] border border-[#1E4D6E] rounded-xl px-3.5 py-2 text-xs text-slate-100 focus:outline-none focus:border-[#D4AF37]"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-xs text-slate-300 mb-1">Price ({settings.currencySymbol})</label>
                            <input
                              type="number"
                              step="0.1"
                              required
                              value={productForm.price || ''}
                              onChange={(e) => setProductForm({ ...productForm, price: parseFloat(e.target.value) })}
                              className="w-full bg-[#061826] border border-[#1E4D6E] rounded-xl px-3.5 py-2 text-xs text-slate-100 focus:outline-none focus:border-[#D4AF37]"
                            />
                          </div>

                          <div>
                            <label className="block text-xs text-slate-300 mb-1">Compare-At Price (Optional)</label>
                            <input
                              type="number"
                              step="0.1"
                              value={productForm.compareAtPrice || ''}
                              onChange={(e) => setProductForm({ ...productForm, compareAtPrice: parseFloat(e.target.value) })}
                              className="w-full bg-[#061826] border border-[#1E4D6E] rounded-xl px-3.5 py-2 text-xs text-slate-100 focus:outline-none focus:border-[#D4AF37]"
                            />
                          </div>

                          <div>
                            <label className="block text-xs text-slate-300 mb-1">Category</label>
                            <select
                              value={productForm.category || 'Signature'}
                              onChange={(e) => setProductForm({ ...productForm, category: e.target.value as any })}
                              className="w-full bg-[#061826] border border-[#1E4D6E] rounded-xl px-3.5 py-2 text-xs text-slate-100 focus:outline-none focus:border-[#D4AF37]"
                            >
                              <option value="Signature">Signature</option>
                              <option value="Woody & Amber">Woody & Amber</option>
                              <option value="Fresh & Citrus">Fresh & Citrus</option>
                              <option value="Oud & Oriental">Oud & Oriental</option>
                              <option value="Aquatic & Floral">Aquatic & Floral</option>
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs text-slate-300 mb-1">Featured Image URL</label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              required
                              value={productForm.featuredImage || ''}
                              onChange={(e) => setProductForm({ ...productForm, featuredImage: e.target.value })}
                              placeholder="/perfume_fougerewood.jpg or https://cdn.shopify.com/..."
                              className="w-full bg-[#061826] border border-[#1E4D6E] rounded-xl px-3.5 py-2 text-xs text-slate-100 focus:outline-none focus:border-[#D4AF37]"
                            />
                            {productForm.featuredImage && (
                              <div className="w-10 h-10 rounded-lg bg-[#05131E] p-1 border border-[#1E4D6E] flex items-center justify-center flex-shrink-0">
                                <img src={productForm.featuredImage} alt="Preview" className="max-h-full max-w-full object-contain" />
                              </div>
                            )}
                          </div>
                          <p className="text-[10px] text-slate-400 mt-1">
                            Use local presets like <code>/perfume_fougerewood.jpg</code> or any external Shopify CDN image link.
                          </p>
                        </div>

                        <div>
                          <label className="block text-xs text-slate-300 mb-1">Description</label>
                          <textarea
                            rows={2}
                            value={productForm.description || ''}
                            onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                            className="w-full bg-[#061826] border border-[#1E4D6E] rounded-xl px-3.5 py-2 text-xs text-slate-100 focus:outline-none focus:border-[#D4AF37] resize-none"
                          />
                        </div>

                        <div className="flex justify-end gap-3 pt-2">
                          <button
                            type="button"
                            onClick={() => {
                              setIsAddingNewProduct(false);
                              setEditingProduct(null);
                            }}
                            className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#05131E] font-semibold text-xs shadow-md"
                          >
                            Save Perfume
                          </button>
                        </div>
                      </form>
                    </div>
                  )}

                  {/* Products Table List */}
                  <div className="rounded-2xl border border-[#184666] overflow-hidden bg-[#072133]">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-[#051826] text-slate-300 font-serif border-b border-[#143E59]">
                          <tr>
                            <th className="p-3.5">Perfume</th>
                            <th className="p-3.5">Category</th>
                            <th className="p-3.5">Price</th>
                            <th className="p-3.5">Source</th>
                            <th className="p-3.5 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#133A52]">
                          {products.map((p) => {
                            const img = p.featuredImage || p.images[0] || '/perfume_fougerewood.jpg';
                            return (
                              <tr key={p.id} className="hover:bg-[#0A2A42]/50 transition-colors">
                                <td className="p-3.5 flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-lg bg-[#061928] p-1 flex items-center justify-center border border-[#16415E] flex-shrink-0">
                                    <img src={img} alt={p.title} className="max-h-full max-w-full object-contain" />
                                  </div>
                                  <div>
                                    <span className="font-serif font-semibold text-slate-100 block">
                                      {p.title}
                                    </span>
                                    <span className="text-[10px] text-slate-400">{p.volume.join(', ')}</span>
                                  </div>
                                </td>
                                <td className="p-3.5 text-slate-300">{p.category}</td>
                                <td className="p-3.5 font-bold text-gold-gradient">
                                  {settings.currencySymbol}{p.price.toFixed(1)}
                                </td>
                                <td className="p-3.5">
                                  {p.shopifyId ? (
                                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#0E3550] text-[#38BDF8] border border-[#38BDF8]/30">
                                      Shopify Live
                                    </span>
                                  ) : (
                                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#0E3550] text-[#D4AF37] border border-[#D4AF37]/30">
                                      Artisanal
                                    </span>
                                  )}
                                </td>
                                <td className="p-3.5 text-right space-x-2">
                                  <button
                                    onClick={() => {
                                      setEditingProduct(p);
                                      setProductForm(p);
                                      setIsAddingNewProduct(false);
                                    }}
                                    className="p-1.5 text-slate-300 hover:text-[#D4AF37] hover:bg-[#0E3550] rounded-lg"
                                    title="Edit Perfume"
                                  >
                                    <Edit2 className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteProduct(p.id)}
                                    className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-[#0E3550] rounded-lg"
                                    title="Delete Perfume"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>

                </div>
              )}

              {/* TAB 3: BRANDING & HERO CUSTOMIZATION */}
              {adminTab === 'branding' && (
                <div className="space-y-6 animate-in fade-in">
                  <div>
                    <h3 className="font-serif text-xl font-bold text-slate-100">
                      Store Branding & Visual Hero Customization
                    </h3>
                    <p className="text-xs text-slate-400">
                      Aap yahan se store ka brand name, hero banners, aur contact details customize kar sakte hain.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-6 rounded-2xl bg-[#072133] border border-[#1B4E70] space-y-4">
                      <h4 className="font-serif text-base font-bold text-[#F3E5AB]">Brand Identity</h4>
                      
                      <div>
                        <label className="block text-xs text-slate-300 mb-1">Brand Name</label>
                        <input
                          type="text"
                          value={settings.brandName}
                          onChange={(e) => onUpdateSettings({ ...settings, brandName: e.target.value })}
                          className="w-full bg-[#051624] border border-[#1E4D6E] rounded-xl px-3.5 py-2 text-xs text-slate-100 focus:outline-none focus:border-[#D4AF37]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs text-slate-300 mb-1">Tagline</label>
                        <input
                          type="text"
                          value={settings.tagline}
                          onChange={(e) => onUpdateSettings({ ...settings, tagline: e.target.value })}
                          className="w-full bg-[#051624] border border-[#1E4D6E] rounded-xl px-3.5 py-2 text-xs text-slate-100 focus:outline-none focus:border-[#D4AF37]"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs text-slate-300 mb-1">Currency Symbol</label>
                          <input
                            type="text"
                            value={settings.currencySymbol}
                            onChange={(e) => onUpdateSettings({ ...settings, currencySymbol: e.target.value })}
                            className="w-full bg-[#051624] border border-[#1E4D6E] rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-[#D4AF37]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs text-slate-300 mb-1">WhatsApp Order Number</label>
                          <input
                            type="text"
                            value={settings.whatsappNumber}
                            onChange={(e) => onUpdateSettings({ ...settings, whatsappNumber: e.target.value })}
                            placeholder="+923001234567"
                            className="w-full bg-[#051624] border border-[#1E4D6E] rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-[#D4AF37]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs text-slate-300 mb-1">Top Announcement Bar Text</label>
                        <input
                          type="text"
                          value={settings.announcementText}
                          onChange={(e) => onUpdateSettings({ ...settings, announcementText: e.target.value })}
                          className="w-full bg-[#051624] border border-[#1E4D6E] rounded-xl px-3.5 py-2 text-xs text-slate-100 focus:outline-none focus:border-[#D4AF37]"
                        />
                        <div className="pt-2 flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={settings.showAnnouncement}
                            onChange={(e) => onUpdateSettings({ ...settings, showAnnouncement: e.target.checked })}
                            className="w-4 h-4 accent-[#D4AF37]"
                          />
                          <span className="text-xs text-slate-300">Show Announcement Bar</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-6 rounded-2xl bg-[#072133] border border-[#1B4E70] space-y-4">
                      <h4 className="font-serif text-base font-bold text-[#F3E5AB]">Hero Section Texts</h4>

                      <div>
                        <label className="block text-xs text-slate-300 mb-1">Headline</label>
                        <input
                          type="text"
                          value={settings.heroHeadline}
                          onChange={(e) => onUpdateSettings({ ...settings, heroHeadline: e.target.value })}
                          className="w-full bg-[#051624] border border-[#1E4D6E] rounded-xl px-3.5 py-2 text-xs text-slate-100 focus:outline-none focus:border-[#D4AF37]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs text-slate-300 mb-1">Calligraphic Highlight (e.g. Perfumes)</label>
                        <input
                          type="text"
                          value={settings.heroHighlight}
                          onChange={(e) => onUpdateSettings({ ...settings, heroHighlight: e.target.value })}
                          className="w-full bg-[#051624] border border-[#1E4D6E] rounded-xl px-3.5 py-2 text-xs text-slate-100 focus:outline-none focus:border-[#D4AF37]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs text-slate-300 mb-1">Subhead Description</label>
                        <textarea
                          rows={2}
                          value={settings.heroSubhead}
                          onChange={(e) => onUpdateSettings({ ...settings, heroSubhead: e.target.value })}
                          className="w-full bg-[#051624] border border-[#1E4D6E] rounded-xl px-3.5 py-2 text-xs text-slate-100 focus:outline-none focus:border-[#D4AF37] resize-none"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs text-slate-300 mb-1">Discount Badge Text</label>
                          <input
                            type="text"
                            value={settings.heroDiscountBadge}
                            onChange={(e) => onUpdateSettings({ ...settings, heroDiscountBadge: e.target.value })}
                            className="w-full bg-[#051624] border border-[#1E4D6E] rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-[#D4AF37]"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-slate-300 mb-1">Discount Subhead</label>
                          <input
                            type="text"
                            value={settings.heroDiscountSub}
                            onChange={(e) => onUpdateSettings({ ...settings, heroDiscountSub: e.target.value })}
                            className="w-full bg-[#051624] border border-[#1E4D6E] rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-[#D4AF37]"
                          />
                        </div>
                      </div>

                      {/* Hero Image Control & Direct File Upload */}
                      <div className="pt-2 border-t border-[#1B4E70]/60 space-y-3">
                        <label className="block text-xs text-slate-300 font-medium">
                          Hero Campaign Photo (Man in suit with perfume)
                        </label>
                        <div className="flex gap-3 items-center">
                          <div className="w-14 h-14 rounded-xl bg-[#04121E] border border-[#2B638A] overflow-hidden flex-shrink-0">
                            <img
                              src={settings.heroImage || '/alraza_hero_perfume.jpg'}
                              alt="Hero Preview"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 space-y-2">
                            <input
                              type="text"
                              value={settings.heroImage || ''}
                              onChange={(e) => onUpdateSettings({ ...settings, heroImage: e.target.value })}
                              placeholder="/alraza_hero_perfume.jpg or custom image URL"
                              className="w-full bg-[#051624] border border-[#1E4D6E] rounded-xl px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-[#D4AF37]"
                            />
                            <div className="flex items-center gap-2">
                              <label className="cursor-pointer px-3 py-1 rounded-lg bg-[#0E3550] hover:bg-[#14486E] text-[11px] text-[#38BDF8] border border-[#38BDF8]/30 flex items-center gap-1.5">
                                <Upload className="w-3.5 h-3.5" />
                                <span>Upload Photo from Device</span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                      const reader = new FileReader();
                                      reader.onload = () => {
                                        if (typeof reader.result === 'string') {
                                          onUpdateSettings({ ...settings, heroImage: reader.result });
                                        }
                                      };
                                      reader.readAsDataURL(file);
                                    }
                                  }}
                                />
                              </label>
                              <button
                                type="button"
                                onClick={() => onUpdateSettings({ ...settings, heroImage: '/hero_man.jpg' })}
                                className="px-2.5 py-1 rounded-lg bg-[#071F30] hover:bg-[#0B2C44] text-[11px] text-[#D4AF37] border border-[#D4AF37]/30"
                              >
                                Restore Original Photo
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* The Maison of Al Raza Showcase Photo */}
                      <div className="pt-2 border-t border-[#1B4E70]/60 space-y-3">
                        <label className="block text-xs text-slate-300 font-medium">
                          The Maison of Al Raza Showcase Photo (Modern Atelier & Lab)
                        </label>
                        <div className="flex gap-3 items-center">
                          <div className="w-14 h-14 rounded-xl bg-[#04121E] border border-[#2B638A] overflow-hidden flex-shrink-0">
                            <img
                              src={settings.maisonImage || '/maison_modern.jpg'}
                              alt="Maison Preview"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 space-y-2">
                            <input
                              type="text"
                              value={settings.maisonImage || ''}
                              onChange={(e) => onUpdateSettings({ ...settings, maisonImage: e.target.value })}
                              placeholder="/maison_modern.jpg or custom image URL"
                              className="w-full bg-[#051624] border border-[#1E4D6E] rounded-xl px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-[#D4AF37]"
                            />
                            <div className="flex items-center gap-2">
                              <label className="cursor-pointer px-3 py-1 rounded-lg bg-[#0E3550] hover:bg-[#14486E] text-[11px] text-[#38BDF8] border border-[#38BDF8]/30 flex items-center gap-1.5">
                                <Upload className="w-3.5 h-3.5" />
                                <span>Upload Maison Photo</span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                      const reader = new FileReader();
                                      reader.onload = () => {
                                        if (typeof reader.result === 'string') {
                                          onUpdateSettings({ ...settings, maisonImage: reader.result });
                                        }
                                      };
                                      reader.readAsDataURL(file);
                                    }
                                  }}
                                />
                              </label>
                              <button
                                type="button"
                                onClick={() => onUpdateSettings({ ...settings, maisonImage: '/maison_modern.jpg' })}
                                className="px-2.5 py-1 rounded-lg bg-[#071F30] hover:bg-[#0B2C44] text-[11px] text-[#D4AF37] border border-[#D4AF37]/30"
                              >
                                Restore Modern Maison Photo
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: REVIEWS MANAGEMENT */}
              {adminTab === 'reviews' && (
                <div className="space-y-6 animate-in fade-in">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-serif text-xl font-bold text-slate-100">Customer Reviews</h3>
                      <p className="text-xs text-slate-400">Manage real customer feedback showcased on the homepage</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {reviews.map((rev) => (
                      <div key={rev.id} className="p-4 rounded-2xl bg-[#072133] border border-[#1B4E70] space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-sm text-[#F3E5AB]">{rev.author} ({rev.location})</span>
                          <button
                            onClick={() => onUpdateReviews(reviews.filter((r) => r.id !== rev.id))}
                            className="text-slate-400 hover:text-red-400"
                            title="Delete Review"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-xs text-slate-300 italic">"{rev.comment}"</p>
                        <div className="text-[11px] text-[#D4AF37]">
                          ★ {rev.rating}/5 · {rev.perfumeTitle}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 5: SECURITY & OWNER ENTRY BUTTON VISIBILITY */}
              {adminTab === 'security' && (
                <div className="space-y-6 animate-in fade-in max-w-2xl">
                  <div>
                    <h3 className="font-serif text-xl font-bold text-slate-100">
                      Security & Owner Entry Settings
                    </h3>
                    <p className="text-xs text-slate-400">
                      "adim ka passward creat ma kude kar saku ye batton show b sif mare pass hu"
                    </p>
                  </div>

                  {/* Change Password Form */}
                  <form onSubmit={handleSavePassword} className="p-6 rounded-2xl bg-[#072133] border border-[#1B4E70] space-y-4">
                    <h4 className="font-serif text-base font-bold text-[#F3E5AB] flex items-center gap-2">
                      <Key className="w-4 h-4 text-[#D4AF37]" />
                      <span>Update Your Admin Password</span>
                    </h4>

                    <div>
                      <label className="block text-xs text-slate-300 mb-1">New Password</label>
                      <input
                        type="password"
                        required
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Enter new password"
                        className="w-full bg-[#051624] border border-[#1E4D6E] rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-[#D4AF37]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-slate-300 mb-1">Confirm New Password</label>
                      <input
                        type="password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Re-type new password"
                        className="w-full bg-[#051624] border border-[#1E4D6E] rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-[#D4AF37]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-slate-300 mb-1">Quick Backup PIN (4-6 digits)</label>
                      <input
                        type="text"
                        maxLength={6}
                        value={newPin}
                        onChange={(e) => setNewPin(e.target.value)}
                        className="w-full bg-[#051624] border border-[#1E4D6E] rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-[#D4AF37]"
                      />
                    </div>

                    {passwordSuccess && (
                      <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-800/60 text-xs text-emerald-300">
                        {passwordSuccess}
                      </div>
                    )}

                    {passwordError && (
                      <div className="p-3 rounded-xl bg-red-950/60 border border-red-800/60 text-xs text-red-300">
                        {passwordError}
                      </div>
                    )}

                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#05131E] font-semibold text-xs shadow-md"
                    >
                      Update Password
                    </button>
                  </form>

                  {/* Secret Entry Button Visibility Control */}
                  <div className="p-6 rounded-2xl bg-[#072133] border border-[#1B4E70] space-y-4">
                    <h4 className="font-serif text-base font-bold text-[#F3E5AB] flex items-center gap-2">
                      <Lock className="w-4 h-4 text-[#38BDF8]" />
                      <span>Admin Entry Button Visibility (Private to You)</span>
                    </h4>

                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        id="check-hide-entry"
                        checked={authData.hideEntryButton}
                        onChange={(e) =>
                          onUpdateAuthData({
                            ...authData,
                            hideEntryButton: e.target.checked,
                          })
                        }
                        className="w-5 h-5 accent-[#D4AF37] mt-0.5"
                      />
                      <div>
                        <label htmlFor="check-hide-entry" className="text-xs font-semibold text-slate-200 block cursor-pointer">
                          Hide Admin Lock Icon from Public Viewers
                        </label>
                        <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                          Agar aap yeh toggle on karenge, toh store per aam customer ko Admin button nazar nahi aayega.
                          Sirf aap <strong>Al Raza Logo per 3 baar tap/click karenge</strong> toh Admin login modal khul jayega!
                        </p>
                      </div>
                    </div>
                  </div>

                </div>
              )}

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
