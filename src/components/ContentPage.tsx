import React, { useState } from 'react';
import { StoreSettings } from '../types';
import {
  BookOpen,
  Sparkles,
  Droplets,
  HelpCircle,
  Sun,
  Flame,
  CheckCircle2,
  Phone,
  Mail,
  ArrowRight,
  Award,
  Gem,
  Send,
} from 'lucide-react';

interface ContentPageProps {
  settings: StoreSettings;
  onNavigateHome?: () => void;
  onNavigateShop?: () => void;
  isHomeEmbedded?: boolean;
}

export const ContentPage: React.FC<ContentPageProps> = ({
  settings,
  onNavigateHome,
  onNavigateShop,
  isHomeEmbedded = false,
}) => {
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [inquiryName, setInquiryName] = useState('');
  const [inquiryMessage, setInquiryMessage] = useState('');
  const [inquirySent, setInquirySent] = useState(false);

  const faqs = [
    {
      q: 'Are Al Raza perfumes pure Extrait de Parfum concentration?',
      a: 'Yes. Every bottle produced by Al Raza is formulated with a lavish 30% to 35% pure perfume oil concentration, drastically outlasting conventional Eau de Parfum (15-20%) and providing over 24 hours of projection and lingering sillage.'
    },
    {
      q: 'How does the Shopify sync work when new listings are added?',
      a: 'Our store utilizes real-time backend synchronization. When a new product or image is published to Shopify, our automated webhook engine immediately detects the update and displays the high-resolution photography on this storefront.'
    },
    {
      q: 'Can I order directly through WhatsApp?',
      a: 'Absolutely! Every fragrance includes a direct "Order via WhatsApp" button with an auto-generated luxury order invoice specifying your selected volume, price, and customer details.'
    },
    {
      q: 'What is your shipping and delivery timeline?',
      a: 'Orders are processed within 24 hours. We offer fast express shipping across major cities (1-3 business days) in temperature-guarded packaging with Cash on Delivery (COD) available.'
    },
    {
      q: 'How should I store my luxury perfume to preserve its strength?',
      a: 'Store your flacon in a cool, dark environment away from direct sunlight, humid bathrooms, and extreme heat. Keeping the cap securely fastened preserves the rare top notes for years.'
    }
  ];

  const handleSendInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiryName.trim() || !inquiryMessage.trim()) return;

    // Send via WhatsApp
    const phone = (settings.whatsappNumber || '+923001234567').replace(/[^0-9]/g, '');
    const text = encodeURIComponent(
      `*Customer Inquiry from ${settings.brandName} Content Guide*\n` +
      `👤 Name: ${inquiryName}\n` +
      `💬 Message: ${inquiryMessage}\n` +
      `Timestamp: ${new Date().toLocaleString()}`
    );
    window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
    setInquirySent(true);
    setTimeout(() => setInquirySent(false), 5000);
  };

  return (
    <section id="content-section" className="py-8 sm:py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-14 animate-in fade-in duration-300">
      
      {/* Editorial Header Banner (Full view mode or Top introduction) */}
      {!isHomeEmbedded ? (
        <div className="relative rounded-3xl sm:rounded-[36px] bg-gradient-to-br from-[#08263D] via-[#051C2C] to-[#03111C] border border-[#1C5073] p-8 sm:p-14 overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 left-10 w-80 h-80 bg-[#38BDF8]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0D3854] border border-[#38BDF8]/30 text-xs text-[#F3E5AB] tracking-widest uppercase font-medium">
              <BookOpen className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Maison Journal & Editorial Guide</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold text-slate-100 leading-tight">
              The World of <span className="text-gold-gradient italic">{settings.brandName}</span>
            </h1>

            <p className="text-slate-300 text-sm sm:text-base font-light leading-relaxed">
              Immerse yourself in our artisanal craft, discover insider perfume care secrets, decode olfactory notes, and learn how to extract 24 hours of projection from your signature scent.
            </p>

            <div className="pt-2 flex flex-wrap gap-4">
              {onNavigateShop && (
                <button
                  onClick={onNavigateShop}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#05131E] font-serif font-bold text-xs sm:text-sm tracking-wider shadow-lg hover:opacity-95 flex items-center gap-2 cursor-pointer"
                >
                  <span>Explore The Scents</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
              {onNavigateHome && (
                <button
                  onClick={onNavigateHome}
                  className="px-6 py-3 rounded-xl bg-[#092233] border border-[#1C4E70] text-slate-200 hover:text-[#D4AF37] font-medium text-xs sm:text-sm transition-colors cursor-pointer"
                >
                  Return to Storefront
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Seamless Section Heading when embedded inside Home */
        <div className="text-center max-w-3xl mx-auto space-y-3 pt-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0A263B] border border-[#1E5275] text-xs text-[#F3E5AB] font-medium tracking-widest uppercase">
            <BookOpen className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Editorial Journal & Fragrance Guide</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-slate-100 leading-tight">
            The Craft & Culture of <span className="text-gold-gradient italic">{settings.brandName}</span>
          </h2>
          <p className="text-slate-300 text-sm sm:text-base font-light leading-relaxed">
            Everything you need to know about our Cambodian agarwood heritage, pure extrait concentration, and master secrets for 24-hour fragrance projection.
          </p>
        </div>
      )}

      {/* SECTION 1: OUR HERITAGE (WITH SUBSTANTIALLY ENLARGED PROMINENT CRAFTSMANSHIP IMAGE) */}
      <div className="rounded-3xl sm:rounded-[36px] bg-[#061927] border border-[#17486B] p-6 sm:p-10 lg:p-12 shadow-2xl space-y-8">
        
        {/* Header and Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-4">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#D4AF37]">
              <Sparkles className="w-4 h-4" />
              <span>Our Heritage & Origins</span>
            </div>

            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-serif font-bold text-slate-100 leading-tight">
              Where Ancient Arab Agarwood Meets <span className="italic text-gold-gradient">French Grasse Artistry</span>
            </h2>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-light">
              Founded with an uncompromising passion for authentic perfumery, <strong className="text-white font-medium">{settings.brandName}</strong> was born to challenge mass-produced synthetic fragrances. We source aged Cambodian and Assamese wild agarwood, hand-harvested Grasse Damask roses, and cold-pressed Italian bergamot.
            </p>

            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed font-light">
              Each flacon undergoes a rigorous 90-day cold maturation maceration cycle in darkness, allowing delicate natural aromachemicals to marry with heavy resinous fixatives. The result is an intoxicating olfactory experience that evolves beautifully on your skin throughout the day.
            </p>
          </div>

          <div className="lg:col-span-4 grid grid-cols-2 lg:grid-cols-1 gap-4">
            <div className="p-5 rounded-2xl bg-[#041421] border border-[#164364] flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#0C2F47] border border-[#235F88] flex items-center justify-center text-[#D4AF37] font-bold font-serif text-xl flex-shrink-0">
                35%
              </div>
              <div>
                <span className="text-sm font-serif font-bold text-white block">Extrait Concentration</span>
                <span className="text-xs text-slate-400">Pure perfume oil density</span>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#041421] border border-[#164364] flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#0C2F47] border border-[#235F88] flex items-center justify-center text-[#38BDF8] font-bold font-serif text-xl flex-shrink-0">
                24h+
              </div>
              <div>
                <span className="text-sm font-serif font-bold text-white block">Lingering Sillage</span>
                <span className="text-xs text-slate-400">All-day magnetic presence</span>
              </div>
            </div>
          </div>
        </div>

        {/* ENLARGED PROMINENT "OUR HERITAGE" IMAGE SHOWCASE */}
        <div className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden border-2 border-[#2B6F9A]/50 shadow-[0_20px_50px_rgba(0,0,0,0.8)] group bg-[#04111C]">
          <div className="relative w-full h-80 sm:h-[440px] lg:h-[520px] overflow-hidden">
            <img
              src="/our_heritage.jpg"
              alt="Al Raza Heritage Fragrance Craftsmanship and Distillation"
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-1000 ease-out"
              loading="lazy"
              referrerPolicy="no-referrer"
              onError={(e) => {
                e.currentTarget.src = '/digital_heritage_origins.jpg';
              }}
            />

            {/* Cinematic Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#04121E] via-transparent to-transparent opacity-80" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#04121E]/60 via-transparent to-transparent hidden md:block" />

            {/* Bottom Showcase Card Badge */}
            <div className="absolute bottom-4 left-4 right-4 sm:bottom-8 sm:left-8 sm:right-8 p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-[#061E30]/90 backdrop-blur-md border border-[#2F739E]/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] sm:text-xs text-[#D4AF37] font-serif font-bold tracking-widest uppercase">
                    Maison Master Distillation
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8]" />
                  <span className="text-[11px] text-slate-300">Wild Assamese & Cambodian Agarwood</span>
                </div>
                <h3 className="font-serif text-base sm:text-xl font-bold text-white">
                  Hand-cut heavy Italian crystal flacon with 24K gold-leaf embossed crest
                </h3>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0A2D45] border border-[#1E5D87] text-xs text-[#F3E5AB]">
                  <Gem className="w-4 h-4 text-[#D4AF37]" />
                  <span className="font-medium">Artisanal Cut Glass</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0A2D45] border border-[#1E5D87] text-xs text-slate-200">
                  <Award className="w-4 h-4 text-[#38BDF8]" />
                  <span className="font-medium">Pure Extrait</span>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* SECTION 2: PERFUME APPLICATION & 24-HOUR LONGEVITY GUIDE */}
      <div className="p-6 sm:p-10 rounded-3xl bg-[#061C2C] border border-[#154466] space-y-8 shadow-xl">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-semibold text-[#D4AF37] uppercase tracking-widest">
            Expert Masterclass
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-100">
            How to Get 24 Hours of Sillage & Projection
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 font-light">
            Follow these golden rules shared by master perfumers to unlock the true potential of {settings.brandName} extraits.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="p-5 rounded-2xl bg-[#041421] border border-[#103A56] space-y-3 hover:border-[#38BDF8]/40 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-[#0B2C42] border border-[#2A658D] text-[#D4AF37] flex items-center justify-center font-bold font-serif text-lg">
              1
            </div>
            <h3 className="font-serif font-bold text-base text-slate-100 flex items-center gap-2">
              <Droplets className="w-4 h-4 text-[#38BDF8]" />
              <span>Hydrate the Skin First</span>
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed font-light">
              Fragrance molecules cling to lipid oils, not dry skin. Apply an unscented lotion or light jojoba oil to your pulse points prior to spraying to double the scent duration.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#041421] border border-[#103A56] space-y-3 hover:border-[#D4AF37]/40 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-[#0B2C42] border border-[#2A658D] text-[#D4AF37] flex items-center justify-center font-bold font-serif text-lg">
              2
            </div>
            <h3 className="font-serif font-bold text-base text-slate-100 flex items-center gap-2">
              <Flame className="w-4 h-4 text-[#D4AF37]" />
              <span>Never Rub Your Wrists</span>
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed font-light">
              Friction crushes the fragile top notes (such as sparkling citrus and bergamot) and overheats the blend. Spray generously and allow the perfume to air-dry naturally on skin.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#041421] border border-[#103A56] space-y-3 hover:border-[#F3E5AB]/40 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-[#0B2C42] border border-[#2A658D] text-[#D4AF37] flex items-center justify-center font-bold font-serif text-lg">
              3
            </div>
            <h3 className="font-serif font-bold text-base text-slate-100 flex items-center gap-2">
              <Sun className="w-4 h-4 text-[#F3E5AB]" />
              <span>Target Strategic Pulse Points</span>
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed font-light">
              Spray on warm pulse spots: sides of the neck, collarbones, inner elbows, and the back of your hair. As body heat radiates, the perfume will diffuse an intoxicating aura.
            </p>
          </div>

        </div>
      </div>

      {/* SECTION 3: OLFACTORY PYRAMID BREAKDOWN */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <div className="p-6 rounded-2xl bg-gradient-to-b from-[#092B42] to-[#051824] border border-[#1A5074] space-y-3 shadow-lg">
          <span className="text-[11px] uppercase tracking-widest text-[#38BDF8] font-semibold">
            Stage 1 · 0 - 20 Minutes
          </span>
          <h3 className="font-serif text-xl font-bold text-slate-100">Top Notes (The Greeting)</h3>
          <p className="text-xs text-slate-300 leading-relaxed font-light">
            The initial impression upon opening. Features bright, effervescent molecules like Calabrian Bergamot, Pink Peppercorn, Mint, and Neroli that evoke instant desire.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-gradient-to-b from-[#092B42] to-[#051824] border border-[#1A5074] space-y-3 shadow-lg">
          <span className="text-[11px] uppercase tracking-widest text-[#D4AF37] font-semibold">
            Stage 2 · 20 Mins - 5 Hours
          </span>
          <h3 className="font-serif text-xl font-bold text-slate-100">Heart Notes (The Soul)</h3>
          <p className="text-xs text-slate-300 leading-relaxed font-light">
            The true character and emotional body of the perfume. Composed of French Lavender, Damask Rose, Nutmeg, Smoky Birch, and rare floral concretes.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-gradient-to-b from-[#092B42] to-[#051824] border border-[#1A5074] space-y-3 shadow-lg">
          <span className="text-[11px] uppercase tracking-widest text-[#F3E5AB] font-semibold">
            Stage 3 · 5 - 24+ Hours
          </span>
          <h3 className="font-serif text-xl font-bold text-slate-100">Base Notes (The Legacy)</h3>
          <p className="text-xs text-slate-300 leading-relaxed font-light">
            Heavy, resinous molecules that anchor the perfume to skin and fabric. Aged Cambodian Oud, Ambergris, Bourbon Vanilla, Cedarwood, and Clean Musk.
          </p>
        </div>

      </div>

      {/* SECTION 4: FREQUENTLY ASKED QUESTIONS (FAQ) */}
      <div className="p-6 sm:p-10 rounded-3xl bg-[#061826] border border-[#143E5D] space-y-6 shadow-xl">
        <div className="flex items-center gap-3">
          <HelpCircle className="w-5 h-5 text-[#D4AF37]" />
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-slate-100">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = activeFaq === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-[#184666] bg-[#041421] overflow-hidden transition-all"
              >
                <button
                  onClick={() => setActiveFaq(isOpen ? null : idx)}
                  className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 font-serif font-semibold text-sm sm:text-base text-slate-100 hover:text-[#D4AF37] transition-colors cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <span className="text-[#D4AF37] text-lg font-mono flex-shrink-0">
                    {isOpen ? '−' : '+'}
                  </span>
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 sm:px-5 sm:pb-5 text-xs sm:text-sm text-slate-300 font-light leading-relaxed border-t border-[#123650]/60 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 5: CUSTOMER CONCIERGE & DIRECT INQUIRY */}
      <div className="p-6 sm:p-10 rounded-3xl bg-gradient-to-r from-[#072438] via-[#092B42] to-[#072438] border border-[#1F5377] space-y-6 shadow-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-6 space-y-4">
            <span className="text-xs font-semibold text-[#D4AF37] uppercase tracking-widest flex items-center gap-2">
              <Phone className="w-4 h-4" />
              <span>Personal Concierge</span>
            </span>

            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-100">
              Need Scent Advice or Bulk Custom Orders?
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed">
              Our fragrance sommeliers are available on WhatsApp and email to help you choose the ideal gift, customize private flacon labels, or answer any order inquiries.
            </p>

            <div className="space-y-2 text-xs text-slate-300 pt-2">
              <div className="flex items-center gap-2.5">
                <Send className="w-4 h-4 text-[#25D366]" />
                <span>WhatsApp: <strong>{settings.whatsappNumber}</strong> (Instant Response)</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#38BDF8]" />
                <span>Email: <strong>{settings.supportEmail}</strong></span>
              </div>
            </div>
          </div>

          {/* Quick Inquiry Form */}
          <div className="lg:col-span-6">
            <form onSubmit={handleSendInquiry} className="p-5 sm:p-6 rounded-2xl bg-[#04121E] border border-[#164363] space-y-4">
              <h3 className="font-serif font-bold text-sm text-[#F3E5AB]">
                Send Direct Message to Concierge
              </h3>

              <div>
                <label className="block text-xs text-slate-300 mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  value={inquiryName}
                  onChange={(e) => setInquiryName(e.target.value)}
                  placeholder="e.g. Ali Raza"
                  className="w-full bg-[#071F30] border border-[#1A4B6E] rounded-xl px-3.5 py-2 text-xs text-slate-100 focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-1">Your Message / Question</label>
                <textarea
                  rows={3}
                  required
                  value={inquiryMessage}
                  onChange={(e) => setInquiryMessage(e.target.value)}
                  placeholder="Which perfume do you recommend for evening events? Do you have samples?"
                  className="w-full bg-[#071F30] border border-[#1A4B6E] rounded-xl px-3.5 py-2 text-xs text-slate-100 focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              {inquirySent && (
                <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-700 text-emerald-200 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Connecting to WhatsApp concierge...</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#25D366] to-[#128C7E] hover:opacity-95 text-white font-medium text-xs flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Send to Concierge via WhatsApp</span>
              </button>
            </form>
          </div>

        </div>
      </div>

    </section>
  );
};
