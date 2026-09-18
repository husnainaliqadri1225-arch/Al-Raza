import React from 'react';
import { StoreSettings } from '../types';
import { Lock, Send, Mail, MapPin, ShieldCheck, Sparkles, Heart } from 'lucide-react';

interface FooterProps {
  settings: StoreSettings;
  onOpenAdmin: () => void;
  isAdminLoggedIn: boolean;
  hideAdminButton: boolean;
  onNavigateContent?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  settings,
  onOpenAdmin,
  isAdminLoggedIn,
  hideAdminButton,
  onNavigateContent,
}) => {
  return (
    <footer className="bg-[#030E17] border-t border-[#133A52] pt-14 pb-8 px-4 sm:px-6 lg:px-8 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          
          {/* Brand Column */}
          <div className="space-y-4">
            <span className="font-serif text-2xl font-bold tracking-wider text-gold-gradient block">
              {settings.brandName || 'Al Raza'}
            </span>
            <p className="text-slate-400 leading-relaxed font-light max-w-xs">
              Luxury artisanal fragrances designed for true connoisseurs. Hand-crafted with precious oils and pure extrait longevity.
            </p>
            <div className="flex items-center gap-2 text-[#D4AF37] text-xs pt-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Shopify Synced & Direct WhatsApp Delivery</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="font-serif text-sm font-bold text-slate-200 tracking-wider uppercase">
              Olfactory Collections
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={onNavigateContent}
                  className="text-left text-[#D4AF37] hover:underline font-medium"
                >
                  📖 Content Page & Scent Care Guide
                </button>
              </li>
              <li>
                <a href="#scents-section" className="hover:text-[#D4AF37] transition-colors">
                  Signature Extraits
                </a>
              </li>
              <li>
                <a href="#scents-section" className="hover:text-[#D4AF37] transition-colors">
                  Woody & Cambodian Oud
                </a>
              </li>
              <li>
                <a href="#scents-section" className="hover:text-[#D4AF37] transition-colors">
                  Sparkling Citrus & Florals
                </a>
              </li>
              <li>
                <a href="#scents-section" className="hover:text-[#D4AF37] transition-colors">
                  Oceanic & Ambergris Accords
                </a>
              </li>
            </ul>
          </div>

          {/* Concierge & Orders */}
          <div className="space-y-3">
            <h4 className="font-serif text-sm font-bold text-slate-200 tracking-wider uppercase">
              Concierge & Ordering
            </h4>
            <ul className="space-y-2.5">
              <li className="flex items-center gap-2">
                <Send className="w-4 h-4 text-[#25D366] flex-shrink-0" />
                <a
                  href={`https://wa.me/${(settings.whatsappNumber || '+923001234567').replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  WhatsApp: {settings.whatsappNumber}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#38BDF8] flex-shrink-0" />
                <a href={`mailto:${settings.supportEmail}`} className="hover:text-white transition-colors">
                  {settings.supportEmail}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#D4AF37] flex-shrink-0" />
                <span>100% Genuine Perfume Guarantee</span>
              </li>
            </ul>
          </div>

          {/* Discreet Owner Access Portal */}
          <div className="space-y-3">
            <h4 className="font-serif text-sm font-bold text-slate-200 tracking-wider uppercase">
              Store Owner
            </h4>
            <p className="text-slate-400 text-xs">
              Secure administrative access for updating Shopify listings, product photos, and store pricing.
            </p>

            {(!hideAdminButton || isAdminLoggedIn) && (
              <button
                id="btn-footer-admin-login"
                onClick={onOpenAdmin}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#092233] hover:bg-[#0E3550] border border-[#1E4D6E] text-slate-300 hover:text-[#D4AF37] transition-all"
              >
                <Lock className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span className="text-xs font-medium">
                  {isAdminLoggedIn ? 'Owner Dashboard (Unlocked)' : 'Owner Secure Login'}
                </span>
              </button>
            )}

            {hideAdminButton && !isAdminLoggedIn && (
              <p className="text-[11px] text-slate-600 italic">
                (Private owner key hidden. Tap brand logo 3 times to open)
              </p>
            )}
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#0D293D] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>© {new Date().getFullYear()} {settings.brandName}. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-slate-400">Privacy Policy</span>
            <span>·</span>
            <span className="hover:text-slate-400">Terms of Service</span>
            <span>·</span>
            <span className="hover:text-slate-400">Shipping Policy</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
