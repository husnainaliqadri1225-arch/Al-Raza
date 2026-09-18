import React from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Flame } from 'lucide-react';
import { StoreSettings } from '../types';

interface HeroProps {
  settings: StoreSettings;
  onShopNowClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ settings, onShopNowClick }) => {
  return (
    <section className="relative overflow-hidden pt-4 pb-10 sm:py-12 px-4 sm:px-6 lg:px-8">
      {/* Background ambient lighting effects matching reference photo */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-[#0E5173]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -top-10 right-0 w-[32rem] h-[32rem] bg-[#166088]/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        {/* Main Hero Card Container matching the uploaded design */}
        <div className="relative rounded-3xl sm:rounded-[36px] bg-gradient-to-br from-[#0A263B]/80 via-[#071F30]/90 to-[#04121B] border border-[#21567A]/40 shadow-2xl p-6 sm:p-10 lg:p-12 overflow-hidden">
          
          {/* Decorative Subtle Grid / Vignette */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(30,111,155,0.25),transparent_70%)] pointer-events-none" />
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 items-center relative z-10">
            
            {/* Left Content Column */}
            <div className="lg:col-span-6 xl:col-span-7 flex flex-col justify-center space-y-6 sm:space-y-8">
              
              {/* Luxury Badge */}
              <div className="inline-flex items-center gap-2 self-start px-3.5 py-1.5 rounded-full bg-[#0F3852]/60 border border-[#38BDF8]/30 text-xs text-[#F3E5AB] font-medium tracking-wider uppercase backdrop-blur-md">
                <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Al Raza Haute Parfumerie</span>
              </div>

              {/* Main Headline with cursive golden 'Perfumes' */}
              <div className="space-y-1 sm:space-y-2">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif text-slate-100 font-bold leading-[1.15] tracking-tight">
                  {settings.heroHeadline || 'Fall in love with Our Signature'}
                </h1>
                <div className="flex items-center gap-4 flex-wrap">
                  <span className="font-serif italic text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-gold-gradient font-normal tracking-wide drop-shadow-md">
                    {settings.heroHighlight || 'Perfumes'}
                  </span>

                  {/* Circular SHOP NOW! Badge matching reference */}
                  <button
                    id="btn-hero-shop-now-badge"
                    onClick={onShopNowClick}
                    className="shop-now-badge group cursor-pointer w-20 h-20 sm:w-24 sm:h-24 rounded-full flex flex-col items-center justify-center text-center p-2 transition-transform duration-300 hover:scale-105 active:scale-95 shadow-xl"
                    aria-label="Shop Signature Perfumes"
                  >
                    <span className="text-[10px] sm:text-xs tracking-wider text-[#D4AF37] font-serif font-bold uppercase leading-tight group-hover:text-[#FFF1B8]">
                      Shop
                    </span>
                    <span className="text-xs sm:text-sm tracking-widest text-[#F3E5AB] font-serif font-extrabold uppercase leading-tight group-hover:text-white">
                      Now!
                    </span>
                  </button>
                </div>
              </div>

              {/* Subhead Description with vertical accent line */}
              <div className="border-l-2 border-[#D4AF37]/50 pl-4 py-0.5 max-w-lg">
                <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-light">
                  {settings.heroSubhead ||
                    'Discover the perfect fragrance for every moment. Luxury scents for a confident you.'}
                </p>
              </div>

              {/* Discount / Exclusive Offers Block */}
              <div className="pt-2 flex items-center gap-6">
                <div className="flex flex-col">
                  <div className="flex items-baseline gap-2">
                    <span className="font-serif text-2xl sm:text-3xl font-bold text-gold-gradient">
                      {settings.heroDiscountBadge || '50% - 15% OFF'}
                    </span>
                    <Flame className="w-5 h-5 text-[#D4AF37] inline-block animate-bounce" />
                  </div>
                  <span className="text-xs text-slate-400 tracking-wider uppercase font-medium">
                    {settings.heroDiscountSub || 'Exclusive · Limited Time'}
                  </span>
                </div>

                <div className="h-10 w-px bg-[#1F4E6E]/60 hidden sm:block" />

                <div className="hidden sm:flex items-center gap-3 text-xs text-slate-300">
                  <ShieldCheck className="w-5 h-5 text-[#38BDF8]" />
                  <span>100% Authentic French & Arabian Oils</span>
                </div>
              </div>

              {/* Mobile Quick Action Buttons */}
              <div className="flex sm:hidden items-center gap-3 pt-2">
                <button
                  id="btn-hero-explore-mobile"
                  onClick={onShopNowClick}
                  className="flex-1 py-3 px-5 rounded-xl bg-gradient-to-r from-[#D4AF37] via-[#E8C15A] to-[#B8860B] text-[#05131E] font-semibold text-sm shadow-lg flex items-center justify-center gap-2 hover:opacity-95"
                >
                  <span>Explore Scents</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>

            {/* Right Visual Column matching the uploaded reference image */}
            <div className="lg:col-span-6 xl:col-span-5 relative flex items-center justify-center">
              <div className="relative w-full max-w-md lg:max-w-none rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border border-[#38BDF8]/20 group">
                
                {/* Visual Image */}
                <div className="relative aspect-square sm:aspect-[4/4.2] overflow-hidden bg-[#071D2B]">
                  <img
                    id="img-hero-campaign"
                    src={settings.heroImage || '/hero_man.jpg'}
                    alt="Al Raza Luxury Perfume Campaign - Man in suit with Signature Perfume"
                    className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-700 ease-out"
                    loading="eager"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      e.currentTarget.src = '/alraza_hero_perfume.jpg';
                    }}
                  />
                  
                  {/* Subtle Vignette Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#05131E] via-transparent to-transparent opacity-50" />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#05131E]/30 via-transparent to-transparent hidden lg:block" />
                </div>

                {/* Floating Tag over image */}
                <div className="absolute bottom-4 left-4 right-4 sm:left-6 sm:right-6 p-3 sm:p-4 rounded-2xl backdrop-blur-md bg-[#072438]/80 border border-[#38BDF8]/25 flex items-center justify-between">
                  <div>
                    <p className="text-[11px] uppercase tracking-wider text-[#D4AF37] font-medium">Signature Release</p>
                    <p className="text-xs sm:text-sm font-serif font-bold text-white">Extrait de Parfum Collection</p>
                  </div>
                  <span className="text-xs font-bold text-[#F3E5AB] bg-[#0E3E5B] px-2.5 py-1 rounded-full border border-[#D4AF37]/30">
                    24h Sillage
                  </span>
                </div>

              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
