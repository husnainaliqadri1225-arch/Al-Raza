import React from 'react';
import { Sparkles, Award, Droplets, Gem } from 'lucide-react';
import { StoreSettings } from '../types';

interface AboutSectionProps {
  settings: StoreSettings;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ settings }) => {
  return (
    <section id="about-section" className="py-14 sm:py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="relative rounded-[32px] sm:rounded-[40px] bg-gradient-to-b from-[#0A263B]/90 via-[#071F30]/90 to-[#05141E] border border-[#1B4E70] p-6 sm:p-12 lg:p-16 overflow-hidden shadow-2xl">
          
          {/* Subtle Ambient Glow */}
          <div className="absolute -bottom-20 right-0 w-80 h-80 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Narrative */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0E3550] border border-[#38BDF8]/20 text-xs text-[#F3E5AB] font-medium tracking-wider uppercase">
                <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>The Maison of Al Raza · Contemporary Luxury</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-slate-100 font-bold leading-tight">
                Crafting Scents of <span className="text-gold-gradient italic">Pure Royalty</span>
              </h2>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-light">
                Founded with a relentless devotion to authentic perfumery, {settings.brandName} merges timeless Eastern agarwood traditions with avant-garde architectural distillation. Every flacon is formulated in state-of-the-art sterile cleanrooms and aged in dark temperature-regulated vaults for unrivaled depth.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-3.5 rounded-2xl bg-[#061825] border border-[#143B52] space-y-1.5">
                  <Droplets className="w-5 h-5 text-[#38BDF8]" />
                  <h4 className="font-serif font-bold text-sm text-slate-100">35% Extrait</h4>
                  <p className="text-[11px] text-slate-400">Pure oil concentration for 24h+ projection.</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#061825] border border-[#143B52] space-y-1.5">
                  <Award className="w-5 h-5 text-[#D4AF37]" />
                  <h4 className="font-serif font-bold text-sm text-slate-100">Noble Extracts</h4>
                  <p className="text-[11px] text-slate-400">Rare Assamese oud & Grasse damask rose.</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#061825] border border-[#143B52] space-y-1.5">
                  <Gem className="w-5 h-5 text-[#F3E5AB]" />
                  <h4 className="font-serif font-bold text-sm text-slate-100">Modern Flacons</h4>
                  <p className="text-[11px] text-slate-400">Heavy weighted Italian crystal with 24K gold crest.</p>
                </div>
              </div>
            </div>

            {/* Right Visual Showcase - Enlarged Ultra-Modern Picture */}
            <div className="lg:col-span-6 flex justify-center w-full">
              <div className="relative w-full h-[380px] sm:h-[460px] lg:h-[500px] rounded-3xl overflow-hidden border-2 border-[#2F7AA8]/70 shadow-[0_30px_70px_rgba(0,0,0,0.9)] group bg-[#04121E]">
                <img
                  src={settings.maisonImage || '/maison_modern.jpg'}
                  alt="The Maison of Al Raza - Modern Atelier & Showroom"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    e.currentTarget.src = '/maison_modern.jpg';
                  }}
                />
                
                {/* Modern Atmospheric Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#04101A] via-[#04101A]/20 to-transparent opacity-80" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#04101A]/40 via-transparent to-transparent hidden sm:block" />

                {/* Modern Frosted Glass Badge Card */}
                <div className="absolute bottom-5 left-5 right-5 sm:bottom-7 sm:left-7 sm:right-7 p-4 sm:p-5 rounded-2xl bg-[#061E30]/90 backdrop-blur-md border border-[#3480B0]/50 space-y-1.5 shadow-2xl">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] sm:text-xs uppercase tracking-widest text-[#D4AF37] font-serif font-bold">
                      The Modern Maison Atelier
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8] animate-pulse" />
                    <span className="text-[10px] sm:text-xs text-slate-300 font-medium">Bespoke Extraction</span>
                  </div>
                  <p className="font-serif text-base sm:text-lg font-bold text-white leading-snug">
                    Where Haute-Parfumerie Meets Avant-Garde Luxury Architecture
                  </p>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
