import React, { useState } from 'react';
import { CartItem, StoreSettings } from '../types';
import { X, Trash2, ShoppingBag, Send, ArrowRight, ShieldCheck, Tag, Sparkles } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  settings: StoreSettings;
  onUpdateQuantity: (productId: string, volume: string, qty: number) => void;
  onRemoveItem: (productId: string, volume: string) => void;
  onClearCart: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  settings,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
}) => {
  if (!isOpen) return null;

  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [promoMessage, setPromoMessage] = useState<{ text: string; isError: boolean } | null>(null);
  const [isCheckoutCompleted, setIsCheckoutCompleted] = useState(false);

  // Calculate Subtotal
  const rawSubtotal = items.reduce((acc, item) => {
    const is100ml = item.selectedVolume.includes('100');
    const unitPrice = is100ml ? item.product.price * 1.55 : item.product.price;
    return acc + unitPrice * item.quantity;
  }, 0);

  const discountAmount = (rawSubtotal * discountPercent) / 100;
  const finalTotal = Math.max(0, rawSubtotal - discountAmount);
  const freeShippingThreshold = 150.0;
  const amountToFreeShipping = Math.max(0, freeShippingThreshold - rawSubtotal);
  const freeShippingProgress = Math.min(100, (rawSubtotal / freeShippingThreshold) * 100);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = promoCode.trim().toUpperCase();
    if (clean === 'ALRAZA15' || clean === 'VIP15') {
      setDiscountPercent(15);
      setPromoMessage({ text: '15% Al Raza VIP discount applied!', isError: false });
    } else if (clean === 'ALRAZA50') {
      setDiscountPercent(50);
      setPromoMessage({ text: '50% Signature Grand Opening discount applied!', isError: false });
    } else {
      setPromoMessage({ text: 'Invalid promo code. Try "ALRAZA15"', isError: true });
    }
  };

  // WhatsApp Checkout Generator
  const generateWhatsAppCheckout = () => {
    const cleanNumber = (settings.whatsappNumber || '+923001234567').replace(/[^0-9]/g, '');
    const itemsList = items
      .map(
        (it) =>
          `• ${it.product.title} (${it.selectedVolume}) x${it.quantity} = ${settings.currencySymbol}${((it.selectedVolume.includes('100') ? it.product.price * 1.55 : it.product.price) * it.quantity).toFixed(1)}`
      )
      .join('\n');

    const message = encodeURIComponent(
      `As-salamu alaykum Al Raza,\nI would like to place an order from your online store:\n\n${itemsList}\n\nSubtotal: ${settings.currencySymbol}${rawSubtotal.toFixed(1)}${discountPercent > 0 ? `\nDiscount (${discountPercent}%): -${settings.currencySymbol}${discountAmount.toFixed(1)}` : ''}\nFinal Total: ${settings.currencySymbol}${finalTotal.toFixed(1)}\n\nPlease assist me with payment and delivery address confirmation.`
    );
    return `https://wa.me/${cleanNumber}?text=${message}`;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#071E2E] border-l border-[#205273] shadow-2xl flex flex-col text-slate-100">
          
          {/* Header */}
          <div className="p-5 sm:p-6 border-b border-[#143E59] flex items-center justify-between bg-[#061825]">
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-5 h-5 text-[#D4AF37]" />
              <h2 className="font-serif text-lg sm:text-xl font-bold text-slate-100">
                Your Fragrance Bag
              </h2>
              <span className="text-xs px-2 py-0.5 rounded-full bg-[#0E3550] text-[#F3E5AB] font-medium">
                {items.reduce((sum, it) => sum + it.quantity, 0)} items
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-[#0A263B]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress */}
          <div className="p-4 bg-[#09253A] border-b border-[#143E59] text-xs">
            <div className="flex items-center justify-between mb-1.5 font-medium">
              <span className="text-slate-300">
                {amountToFreeShipping > 0
                  ? `Add ${settings.currencySymbol}${amountToFreeShipping.toFixed(1)} more for Free Express Delivery`
                  : '🎉 You have unlocked Free Express Delivery!'}
              </span>
              <span className="text-[#D4AF37] font-bold">{Math.round(freeShippingProgress)}%</span>
            </div>
            <div className="w-full h-1.5 bg-[#061622] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] rounded-full transition-all duration-500"
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {items.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-[#0A263B] flex items-center justify-center text-slate-500">
                  <ShoppingBag className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="font-serif text-lg text-slate-200">Your bag is empty</h3>
                <p className="text-xs text-slate-400 max-w-xs mx-auto">
                  Explore our artisanal perfumes and discover your signature luxury scent.
                </p>
                <button
                  onClick={onClose}
                  className="mt-2 px-6 py-2.5 rounded-full bg-[#0E3A57] text-[#F3E5AB] text-xs font-semibold hover:bg-[#134D74] transition-colors"
                >
                  Explore Collection
                </button>
              </div>
            ) : (
              items.map((item) => {
                const is100 = item.selectedVolume.includes('100');
                const unitPrice = is100 ? item.product.price * 1.55 : item.product.price;
                const itemTotal = unitPrice * item.quantity;
                const img = item.product.featuredImage || item.product.images[0] || '/crystal_cyan_perfume.jpg';

                return (
                  <div
                    key={`${item.product.id}-${item.selectedVolume}`}
                    className="flex gap-3.5 p-3 rounded-2xl bg-[#092233] border border-[#184666]/60 items-center"
                  >
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-[#061825] p-2 flex items-center justify-center flex-shrink-0 border border-[#143B54]">
                      <img src={img} alt={item.product.title} className="max-h-full max-w-full object-contain" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="font-serif text-sm font-semibold text-slate-100 truncate">
                        {item.product.title}
                      </h4>
                      <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                        <span className="px-1.5 py-0.2 bg-[#0E3550] rounded text-[10px] text-[#F3E5AB]">
                          {item.selectedVolume}
                        </span>
                        <span>{item.product.category}</span>
                      </div>

                      <div className="flex items-center justify-between mt-2.5">
                        {/* Quantity controls */}
                        <div className="flex items-center border border-[#1E4D6E] rounded-lg bg-[#071926]">
                          <button
                            onClick={() =>
                              onUpdateQuantity(item.product.id, item.selectedVolume, item.quantity - 1)
                            }
                            className="px-2 py-0.5 text-xs text-slate-400 hover:text-white"
                          >
                            -
                          </button>
                          <span className="px-2 text-xs font-bold text-slate-200">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              onUpdateQuantity(item.product.id, item.selectedVolume, item.quantity + 1)
                            }
                            className="px-2 py-0.5 text-xs text-slate-400 hover:text-white"
                          >
                            +
                          </button>
                        </div>

                        <div className="text-right">
                          <span className="font-serif text-sm font-bold text-gold-gradient">
                            {settings.currencySymbol}
                            {itemTotal.toFixed(1)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Delete button */}
                    <button
                      onClick={() => onRemoveItem(item.product.id, item.selectedVolume)}
                      className="p-1.5 text-slate-400 hover:text-red-400 transition-colors ml-1"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer & Checkout Area */}
          {items.length > 0 && (
            <div className="p-5 sm:p-6 bg-[#061724] border-t border-[#143E59] space-y-4">
              {/* Promo Code Input */}
              <form onSubmit={handleApplyPromo} className="space-y-1">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      placeholder="Promo code (try ALRAZA15)"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="w-full bg-[#0A263B] border border-[#1E4D6E] rounded-xl pl-8 pr-3 py-2 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-[#D4AF37] uppercase"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-3.5 py-2 rounded-xl bg-[#0E3A57] hover:bg-[#144E75] text-[#F3E5AB] text-xs font-semibold"
                  >
                    Apply
                  </button>
                </div>
                {promoMessage && (
                  <p
                    className={`text-[11px] ${
                      promoMessage.isError ? 'text-rose-400' : 'text-emerald-400'
                    }`}
                  >
                    {promoMessage.text}
                  </p>
                )}
              </form>

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-slate-300 pt-1">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-serif">
                    {settings.currencySymbol}
                    {rawSubtotal.toFixed(1)}
                  </span>
                </div>
                {discountPercent > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>VIP Discount ({discountPercent}%)</span>
                    <span>
                      -{settings.currencySymbol}
                      {discountAmount.toFixed(1)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Delivery</span>
                  <span className={amountToFreeShipping === 0 ? 'text-emerald-400 font-semibold' : ''}>
                    {amountToFreeShipping === 0 ? 'FREE' : `${settings.currencySymbol}10.0`}
                  </span>
                </div>
                <div className="flex justify-between text-base font-bold text-slate-100 pt-2 border-t border-[#143B52]">
                  <span className="font-serif">Total</span>
                  <span className="font-serif text-gold-gradient text-lg">
                    {settings.currencySymbol}
                    {(finalTotal + (amountToFreeShipping === 0 ? 0 : 10)).toFixed(1)}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                {/* Instant Order on WhatsApp */}
                <a
                  id="btn-cart-whatsapp-order"
                  href={generateWhatsAppCheckout()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 px-4 rounded-2xl bg-[#0E3550] hover:bg-[#134468] border border-[#25D366]/50 hover:border-[#25D366] text-white font-medium text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all group"
                >
                  <Send className="w-4 h-4 text-[#25D366] group-hover:scale-110 transition-transform" />
                  <span>Order Directly on WhatsApp</span>
                  <ArrowRight className="w-4 h-4 text-slate-400 ml-auto" />
                </a>

                {/* Direct Online Checkout */}
                <button
                  id="btn-cart-direct-checkout"
                  onClick={() => {
                    setIsCheckoutCompleted(true);
                    setTimeout(() => {
                      setIsCheckoutCompleted(false);
                      onClearCart();
                      onClose();
                    }, 2500);
                  }}
                  className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#D4AF37] via-[#E8C15A] to-[#B8860B] hover:from-[#DFBD47] hover:to-[#A37508] text-[#05131E] font-serif font-bold text-sm tracking-wider shadow-lg flex items-center justify-center gap-2 transition-all"
                >
                  {isCheckoutCompleted ? (
                    <span>Order Placed Successfully! ✨</span>
                  ) : (
                    <>
                      <span>Secure Express Checkout</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

              <div className="flex items-center justify-center gap-2 text-[10px] text-slate-400">
                <ShieldCheck className="w-3.5 h-3.5 text-[#38BDF8]" />
                <span>Cash on Delivery & Secure Bank Transfer Accepted</span>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
