import React, { useState } from 'react';
import { Product, StoreSettings } from '../types';
import { X, Star, ShoppingBag, Send, ShieldCheck, Clock, Wind, Check, ChevronRight } from 'lucide-react';

interface ProductModalProps {
  product: Product | null;
  settings: StoreSettings;
  onClose: () => void;
  onAddToCart: (product: Product, selectedVolume: string, qty: number) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  settings,
  onClose,
  onAddToCart,
}) => {
  if (!product) return null;

  const [selectedImage, setSelectedImage] = useState<string>(
    product.featuredImage || product.images[0] || '/crystal_cyan_perfume.jpg'
  );
  const [selectedVolume, setSelectedVolume] = useState<string>(product.volume[0] || '50ml');
  const [quantity, setQuantity] = useState<number>(1);
  const [addedNotice, setAddedNotice] = useState<boolean>(false);

  // Calculate volume adjusted price if 100ml is picked
  const is100ml = selectedVolume.includes('100');
  const finalPrice = is100ml ? product.price * 1.55 : product.price;

  const handleAdd = () => {
    onAddToCart(product, selectedVolume, quantity);
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 2200);
  };

  // WhatsApp pre-filled order text
  const generateWhatsAppUrl = () => {
    const cleanNumber = (settings.whatsappNumber || '+923001234567').replace(/[^0-9]/g, '');
    const message = encodeURIComponent(
      `As-salamu alaykum Al Raza,\nI would like to order:\n• Perfume: ${product.title}\n• Size: ${selectedVolume}\n• Quantity: ${quantity}\n• Total: ${settings.currencySymbol}${ (finalPrice * quantity).toFixed(1) }\n\nPlease confirm availability and delivery details.`
    );
    return `https://wa.me/${cleanNumber}?text=${message}`;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-4xl bg-[#071F30] border border-[#23587A] rounded-3xl sm:rounded-[36px] shadow-2xl overflow-hidden text-slate-100 my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20 p-2.5 rounded-full bg-[#09253A]/80 hover:bg-[#0E3550] text-slate-300 hover:text-white border border-[#1E4D6E] transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 p-6 sm:p-10">
          
          {/* Left Column: Image Showcase */}
          <div className="md:col-span-5 flex flex-col items-center justify-center space-y-4">
            <div className="relative w-full aspect-square rounded-3xl bg-gradient-to-b from-[#0E3550]/60 to-[#061826] border border-[#2B6A94]/30 p-6 flex items-center justify-center overflow-hidden">
              <img
                src={selectedImage}
                alt={product.title}
                className="max-h-full max-w-full object-contain filter drop-shadow-[0_20px_25px_rgba(0,0,0,0.7)] transition-all duration-300 hover:scale-105"
              />
              <div className="absolute top-3 left-3">
                <span className="text-[10px] tracking-wider uppercase px-2.5 py-1 rounded-full bg-[#0A2A3F] border border-[#D4AF37]/40 text-[#F3E5AB] font-medium">
                  {product.category}
                </span>
              </div>
            </div>

            {/* Thumbnail Gallery */}
            {product.images && product.images.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto max-w-full pb-2">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(img)}
                    className={`w-14 h-14 rounded-xl border p-1 bg-[#092233] transition-all flex-shrink-0 ${
                      selectedImage === img
                        ? 'border-[#D4AF37] ring-1 ring-[#D4AF37]'
                        : 'border-[#1E4A6B] opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`View ${i}`} className="w-full h-full object-contain" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Perfume Details */}
          <div className="md:col-span-7 flex flex-col justify-between space-y-5">
            <div>
              {/* Rating and Reviews */}
              <div className="flex items-center gap-2 text-xs mb-1">
                <div className="flex items-center gap-1 text-[#D4AF37]">
                  <Star className="w-4 h-4 fill-[#D4AF37]" />
                  <span className="font-bold text-slate-100">{product.rating}</span>
                </div>
                <span className="text-slate-400">·</span>
                <span className="text-slate-400">({product.reviewsCount} verified reviews)</span>
                {product.shopifyId && (
                  <span className="ml-auto text-[10px] uppercase font-semibold text-[#38BDF8] bg-[#0A2A3F] px-2 py-0.5 rounded-full border border-[#38BDF8]/30">
                    Live Listing
                  </span>
                )}
              </div>

              {/* Title & Tagline */}
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-100 tracking-wide">
                {product.title}
              </h2>
              {product.tagline && (
                <p className="text-xs sm:text-sm text-[#D4AF37] tracking-wider uppercase font-medium mt-0.5">
                  {product.tagline}
                </p>
              )}

              {/* Price */}
              <div className="flex items-baseline gap-3 my-3">
                <span className="text-3xl font-serif font-bold text-gold-gradient">
                  {settings.currencySymbol}
                  {finalPrice.toFixed(1)}
                </span>
                {product.compareAtPrice && (
                  <span className="text-sm text-slate-400 line-through">
                    {settings.currencySymbol}
                    {(product.compareAtPrice * (is100ml ? 1.55 : 1)).toFixed(1)}
                  </span>
                )}
                <span className="text-xs text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-800/50">
                  In Stock · Ready to Ship
                </span>
              </div>

              {/* Description */}
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed font-light mb-4">
                {product.description}
              </p>

              {/* Fragrance Olfactory Pyramid */}
              <div className="bg-[#051724]/70 border border-[#1B4B6B]/60 rounded-2xl p-3.5 space-y-2 mb-4">
                <div className="text-[11px] uppercase tracking-wider text-[#D4AF37] font-semibold flex items-center gap-1.5">
                  <span>Olfactory Notes Pyramid</span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="bg-[#072133] rounded-xl p-2 border border-[#16425F]">
                    <span className="block text-[10px] text-slate-400 uppercase font-medium">Top Notes</span>
                    <span className="text-slate-200 text-xs font-serif">{product.notes.top.join(', ')}</span>
                  </div>
                  <div className="bg-[#072133] rounded-xl p-2 border border-[#16425F]">
                    <span className="block text-[10px] text-slate-400 uppercase font-medium">Heart Notes</span>
                    <span className="text-slate-200 text-xs font-serif">{product.notes.heart.join(', ')}</span>
                  </div>
                  <div className="bg-[#072133] rounded-xl p-2 border border-[#16425F]">
                    <span className="block text-[10px] text-slate-400 uppercase font-medium">Base Notes</span>
                    <span className="text-slate-200 text-xs font-serif">{product.notes.base.join(', ')}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400 pt-1 px-1">
                  <span className="flex items-center gap-1">
                    <Wind className="w-3.5 h-3.5 text-[#38BDF8]" />
                    Sillage: <strong className="text-slate-200">{product.sillage}</strong>
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
                    Longevity: <strong className="text-slate-200">{product.longevity}</strong>
                  </span>
                </div>
              </div>

              {/* Volume Selection & Quantity */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-300 font-medium">Bottle Size:</span>
                  <div className="flex items-center gap-2">
                    {product.volume.map((vol) => (
                      <button
                        key={vol}
                        onClick={() => setSelectedVolume(vol)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                          selectedVolume === vol
                            ? 'bg-[#D4AF37] text-[#05131E] shadow'
                            : 'bg-[#0A263B] text-slate-300 border border-[#1F4E6E] hover:border-[#D4AF37]'
                        }`}
                      >
                        {vol}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quantity */}
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-300 font-medium">Quantity:</span>
                  <div className="flex items-center bg-[#092233] border border-[#1E4D6E] rounded-xl">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-1 text-slate-300 hover:text-white"
                    >
                      -
                    </button>
                    <span className="px-3 text-xs font-bold text-slate-100">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-3 py-1 text-slate-300 hover:text-white"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* CTAs: Add to Cart and Order via WhatsApp */}
            <div className="space-y-2.5 pt-2">
              <button
                id="btn-modal-add-to-bag"
                onClick={handleAdd}
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#D4AF37] via-[#E8C15A] to-[#B8860B] hover:from-[#DFBD47] hover:to-[#A37508] text-[#05131E] font-serif font-bold text-sm tracking-wider shadow-lg flex items-center justify-center gap-2 transition-all"
              >
                {addedNotice ? (
                  <>
                    <Check className="w-5 h-5 text-[#05131E]" />
                    <span>Added to Your Bag!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-5 h-5 text-[#05131E]" />
                    <span>
                      Add to Bag · {settings.currencySymbol}
                      {(finalPrice * quantity).toFixed(1)}
                    </span>
                  </>
                )}
              </button>

              <a
                id="btn-modal-order-whatsapp"
                href={generateWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-6 rounded-2xl bg-[#09283E] hover:bg-[#0D3856] border border-[#25D366]/40 hover:border-[#25D366] text-slate-100 text-xs sm:text-sm font-medium flex items-center justify-center gap-2 transition-all group"
              >
                <Send className="w-4 h-4 text-[#25D366] group-hover:translate-x-0.5 transition-transform" />
                <span>Instant Order via WhatsApp</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 ml-auto" />
              </a>

              <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400 pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#38BDF8]" />
                <span>100% Genuine Artisanal Oil · Free Returns · Discreet Packaging</span>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
