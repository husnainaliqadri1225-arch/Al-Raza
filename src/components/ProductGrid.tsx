import React, { useState } from 'react';
import { Product, StoreSettings } from '../types';
import { ShoppingBag, Eye, Star, Sparkles, RefreshCw } from 'lucide-react';

interface ProductGridProps {
  products: Product[];
  settings: StoreSettings;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product, volume?: string) => void;
  onSyncRequest?: () => void;
  isSyncing?: boolean;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  settings,
  onSelectProduct,
  onAddToCart,
  onSyncRequest,
  isSyncing = false,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = [
    'All',
    'Signature',
    'Woody & Amber',
    'Fresh & Citrus',
    'Oud & Oriental',
    'Aquatic & Floral',
  ];

  const filteredProducts =
    selectedCategory === 'All'
      ? products
      : products.filter((p) => p.category === selectedCategory);

  return (
    <section id="scents-section" className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header matching reference image: "Shop Our Wide Selection of Scents" */}
        <div className="text-center space-y-3 mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0E3550]/60 border border-[#38BDF8]/20 text-xs text-[#F3E5AB] uppercase tracking-widest font-medium">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Curated Fragrance Collection</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-gold-gradient font-bold tracking-tight max-w-2xl mx-auto leading-tight">
            Shop Our Wide Selection of Scents
          </h2>

          <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto font-light">
            Each bottle is masterfully distilled with aged naturals and rare essences, delivering an aura of unforgettable distinction.
          </p>

          {/* Shopify Auto-Sync status pill & manual trigger */}
          {onSyncRequest && (
            <div className="pt-2 flex items-center justify-center gap-2">
              <button
                onClick={onSyncRequest}
                disabled={isSyncing}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#0A263B] hover:bg-[#0F3854] text-slate-300 hover:text-[#D4AF37] border border-[#1E4D6E] transition-all disabled:opacity-50"
                title="Refresh listings and images from Shopify"
              >
                <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin text-[#D4AF37]' : ''}`} />
                <span>{isSyncing ? 'Syncing with Shopify...' : 'Shopify Auto-Sync Active'}</span>
              </button>
            </div>
          )}
        </div>

        {/* Category Filters Carousel / Row */}
        <div id="categories-section" className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-4 mb-8 sm:mb-12 no-scrollbar px-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-medium tracking-wide whitespace-nowrap transition-all duration-200 cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-gradient-to-r from-[#D4AF37] via-[#E5C07B] to-[#B8860B] text-[#05131E] shadow-md font-semibold'
                  : 'bg-[#0A2234]/70 hover:bg-[#0F3550] text-slate-300 border border-[#184666]/60'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Products Grid matching the 3-column rounded pill cards from the uploaded image */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 bg-[#092233]/40 rounded-3xl border border-[#184666]">
            <p className="text-slate-300 text-base">No perfumes found in this olfactory family.</p>
            <button
              onClick={() => setSelectedCategory('All')}
              className="mt-4 px-5 py-2 rounded-full bg-[#0F3852] text-[#D4AF37] text-xs font-medium hover:bg-[#154A70]"
            >
              View All Scents
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredProducts.map((product) => {
              const mainImage = product.featuredImage || product.images[0] || '/crystal_cyan_perfume.jpg';

              return (
                <div
                  key={product.id}
                  id={`product-card-${product.id}`}
                  className="perfume-card-glass rounded-[28px] sm:rounded-[36px] p-6 sm:p-8 flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-1.5 group relative overflow-hidden"
                >
                  {/* Subtle radial inner glow */}
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-48 h-48 bg-[#38BDF8]/10 rounded-full blur-2xl pointer-events-none group-hover:bg-[#D4AF37]/15 transition-all" />

                  {/* Badges: Best Seller, New, or Shopify Synced */}
                  <div className="w-full flex items-center justify-between mb-2 z-10">
                    {product.shopifyId ? (
                      <span className="text-[10px] tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-[#08293D] text-[#38BDF8] border border-[#38BDF8]/30 font-medium">
                        Shopify Live
                      </span>
                    ) : (
                      <span className="text-[10px] tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-[#08293D] text-[#D4AF37] border border-[#D4AF37]/30 font-medium">
                        Artisanal
                      </span>
                    )}

                    <div className="flex items-center gap-1 text-[11px] text-[#F3E5AB]">
                      <Star className="w-3.5 h-3.5 fill-[#D4AF37] text-[#D4AF37]" />
                      <span>{product.rating}</span>
                    </div>
                  </div>

                  {/* Bottle Image Showcase Container */}
                  <div
                    onClick={() => onSelectProduct(product)}
                    className="relative w-44 h-48 sm:w-52 sm:h-56 my-2 flex items-center justify-center cursor-pointer select-none"
                  >
                    {/* Bottle Image with smooth hover float effect */}
                    <img
                      src={mainImage}
                      alt={product.title}
                      className="max-h-full max-w-full object-contain filter drop-shadow-[0_15px_20px_rgba(0,0,0,0.6)] group-hover:scale-105 group-hover:drop-shadow-[0_20px_25px_rgba(56,189,248,0.25)] transition-all duration-500 ease-out"
                      loading="lazy"
                    />

                    {/* Quick View Button overlay on hover */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-[#05131E]/40 rounded-2xl backdrop-blur-[2px]">
                      <span className="px-3.5 py-1.5 rounded-full bg-[#0A263B] border border-[#D4AF37]/60 text-xs font-serif text-[#F3E5AB] flex items-center gap-1.5 shadow-lg">
                        <Eye className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span>Quick Notes</span>
                      </span>
                    </div>
                  </div>

                  {/* Perfume Title matching the reference image */}
                  <h3
                    onClick={() => onSelectProduct(product)}
                    className="font-serif text-lg sm:text-xl font-medium text-slate-100 mt-2 mb-1 tracking-wide hover:text-[#D4AF37] cursor-pointer transition-colors"
                  >
                    {product.title}
                  </h3>

                  {/* Fragrance Accords brief tag */}
                  <p className="text-[11px] text-slate-400 font-light mb-3 tracking-wider line-clamp-1">
                    {product.notes.top.slice(0, 2).join(' · ')} · {product.notes.base[0]}
                  </p>

                  {/* Perfume Price in radiant bold gold matching reference ($50.0, etc.) */}
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="font-serif text-2xl sm:text-3xl font-bold text-gold-gradient tracking-tight">
                      {settings.currencySymbol}
                      {product.price.toFixed(1)}
                    </span>
                    {product.compareAtPrice && product.compareAtPrice > product.price && (
                      <span className="text-xs text-slate-500 line-through">
                        {settings.currencySymbol}
                        {product.compareAtPrice.toFixed(1)}
                      </span>
                    )}
                  </div>

                  {/* Actions: Add to Cart button */}
                  <div className="w-full flex items-center gap-2 pt-1 mt-auto z-10">
                    <button
                      id={`btn-add-cart-${product.id}`}
                      onClick={() => onAddToCart(product, product.volume[0] || '50ml')}
                      className="flex-1 py-2.5 px-4 rounded-xl sm:rounded-2xl bg-gradient-to-r from-[#0E3A57] to-[#15547D] hover:from-[#134D74] hover:to-[#1C6DA1] border border-[#38BDF8]/20 hover:border-[#D4AF37]/60 text-slate-100 text-xs sm:text-sm font-medium transition-all shadow-md flex items-center justify-center gap-2 group-hover:shadow-[0_0_15px_rgba(212,175,55,0.2)]"
                    >
                      <ShoppingBag className="w-4 h-4 text-[#F3E5AB]" />
                      <span>Add to Bag</span>
                    </button>
                    <button
                      onClick={() => onSelectProduct(product)}
                      className="p-2.5 rounded-xl sm:rounded-2xl bg-[#092233] hover:bg-[#0E3550] border border-[#1B4E70] text-slate-300 hover:text-white transition-colors"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
};
