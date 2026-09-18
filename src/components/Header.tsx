import React, { useState } from 'react';
import { Search, ShoppingBag, Lock, Menu, X, Smartphone, Monitor, Sparkles } from 'lucide-react';
import { StoreSettings } from '../types';

interface HeaderProps {
  settings: StoreSettings;
  cartCount: number;
  onOpenCart: () => void;
  onOpenAdmin: () => void;
  isAdminLoggedIn: boolean;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isMobileDeviceFrame: boolean;
  setIsMobileDeviceFrame: (val: boolean) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  hideAdminButton: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  settings,
  cartCount,
  onOpenCart,
  onOpenAdmin,
  isAdminLoggedIn,
  activeTab,
  setActiveTab,
  isMobileDeviceFrame,
  setIsMobileDeviceFrame,
  searchQuery,
  setSearchQuery,
  hideAdminButton,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [logoClickCount, setLogoClickCount] = useState(0);

  // Triple click logo secret trigger if owner chooses to hide the admin button
  const handleLogoClick = () => {
    const next = logoClickCount + 1;
    if (next >= 3) {
      setLogoClickCount(0);
      onOpenAdmin();
    } else {
      setLogoClickCount(next);
      setTimeout(() => setLogoClickCount(0), 1200);
    }
  };

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-[#05131E]/90 border-b border-[#143B52]/60 transition-colors">
      {/* Top Announcement Bar if enabled */}
      {settings.showAnnouncement && settings.announcementText && (
        <div className="bg-gradient-to-r from-[#072438] via-[#0E425E] to-[#072438] py-1.5 px-4 text-center text-xs tracking-wider text-[#F3E5AB] font-medium border-b border-[#D4AF37]/20 flex items-center justify-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-[#D4AF37] animate-pulse" />
          <span>{settings.announcementText}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20 gap-2 sm:gap-4">
          
          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              id="btn-mobile-menu"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-300 hover:text-[#D4AF37] rounded-lg transition-colors focus:outline-none"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Brand Logo matching the reference image's Perf / Al Raza luxury script */}
          <div className="flex items-center cursor-pointer select-none" onClick={handleLogoClick}>
            <div className="flex flex-col">
              <span className="font-serif text-2xl sm:text-3xl font-bold tracking-wider text-gold-gradient hover:opacity-95 transition-opacity">
                {settings.brandName || 'Al Raza'}
              </span>
              <span className="text-[10px] tracking-[0.28em] text-slate-400 uppercase -mt-1 font-light">
                Haute Parfumerie
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-8 text-sm tracking-wider font-medium text-slate-300">
            <button
              onClick={() => setActiveTab('home')}
              className={`hover:text-[#D4AF37] transition-colors ${activeTab === 'home' ? 'text-[#D4AF37] font-semibold' : ''}`}
            >
              Home
            </button>
            <button
              onClick={() => {
                setActiveTab('home');
                const el = document.getElementById('scents-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="hover:text-[#D4AF37] transition-colors"
            >
              Shop
            </button>
            <button
              onClick={() => {
                if (activeTab !== 'home') {
                  setActiveTab('home');
                }
                setTimeout(() => {
                  const el = document.getElementById('content-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }, 80);
              }}
              className="hover:text-[#D4AF37] transition-colors"
            >
              Content
            </button>
            <button
              onClick={() => {
                setActiveTab('home');
                const el = document.getElementById('about-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="hover:text-[#D4AF37] transition-colors"
            >
              About us
            </button>
            <button
              onClick={() => {
                setActiveTab('home');
                const el = document.getElementById('reviews-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="hover:text-[#D4AF37] transition-colors"
            >
              Reviews
            </button>
          </nav>

          {/* Right Action Icons: Search, Cart, Admin Key & Device Frame Toggle */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Search Bar / Trigger */}
            <div className="relative">
              {searchOpen ? (
                <div className="flex items-center bg-[#0B263B] border border-[#1E5275] rounded-full px-3 py-1.5 shadow-inner">
                  <Search className="w-4 h-4 text-slate-400 mr-2" />
                  <input
                    id="input-header-search"
                    type="text"
                    placeholder="Search perfumes, notes..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoFocus
                    className="bg-transparent text-xs sm:text-sm text-slate-100 placeholder-slate-400 focus:outline-none w-32 sm:w-48"
                  />
                  <button
                    onClick={() => {
                      setSearchOpen(false);
                      setSearchQuery('');
                    }}
                    className="text-slate-400 hover:text-white ml-1 p-0.5"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  id="btn-open-search"
                  onClick={() => setSearchOpen(true)}
                  className="p-2 text-slate-300 hover:text-[#D4AF37] rounded-full hover:bg-[#0E3550]/40 transition-colors"
                  title="Search fragrances"
                >
                  <Search className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Viewport frame preview toggle (Mobile iPhone Frame vs Responsive Canvas) */}
            <button
              id="btn-toggle-device-frame"
              onClick={() => setIsMobileDeviceFrame(!isMobileDeviceFrame)}
              className={`hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-medium border transition-all ${
                isMobileDeviceFrame
                  ? 'bg-[#D4AF37]/15 border-[#D4AF37] text-[#F3E5AB]'
                  : 'bg-[#0A263B]/60 border-[#1B4E70] text-slate-400 hover:text-slate-200'
              }`}
              title="Toggle Mobile Screen Preview"
            >
              {isMobileDeviceFrame ? (
                <>
                  <Smartphone className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Mobile View</span>
                </>
              ) : (
                <>
                  <Monitor className="w-3.5 h-3.5" />
                  <span>Full Screen</span>
                </>
              )}
            </button>

            {/* Owner Admin Access Button */}
            {(!hideAdminButton || isAdminLoggedIn) && (
              <button
                id="btn-admin-portal"
                onClick={onOpenAdmin}
                className={`relative p-2 rounded-full transition-all group ${
                  isAdminLoggedIn
                    ? 'bg-[#D4AF37] text-[#05131E] hover:bg-[#F3E5AB]'
                    : 'text-slate-400 hover:text-[#D4AF37] hover:bg-[#0E3550]/50'
                }`}
                title={isAdminLoggedIn ? 'Admin Dashboard (Active)' : 'Admin Portal (Owner Only)'}
              >
                <Lock className="w-4 h-4 sm:w-5 sm:h-5" />
                {isAdminLoggedIn && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full ring-2 ring-[#05131E]" />
                )}
                {/* Tooltip */}
                <span className="hidden group-hover:block absolute top-full right-0 mt-2 px-2.5 py-1 bg-[#092233] text-[11px] text-[#F3E5AB] rounded shadow-lg border border-[#D4AF37]/30 whitespace-nowrap z-50 pointer-events-none">
                  {isAdminLoggedIn ? 'Admin Panel' : 'Owner Login'}
                </span>
              </button>
            )}

            {/* Shopping Cart Button with Badge */}
            <button
              id="btn-open-cart"
              onClick={onOpenCart}
              className="relative flex items-center gap-1.5 px-3 py-2 rounded-full bg-gradient-to-r from-[#0C324C] to-[#124B6F] hover:from-[#104366] hover:to-[#175E8B] border border-[#38BDF8]/20 hover:border-[#D4AF37]/50 text-slate-100 transition-all shadow-md group"
            >
              <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 text-[#F3E5AB] group-hover:scale-110 transition-transform" />
              <span className="text-xs sm:text-sm font-medium">Cart</span>
              {cartCount > 0 && (
                <span className="ml-0.5 px-1.5 py-0.2 text-[11px] font-bold bg-[#D4AF37] text-[#05131E] rounded-full min-w-[18px] text-center shadow">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-[#133A52] py-4 px-2 space-y-3 bg-[#061825]/95 backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-200">
            <button
              onClick={() => {
                setActiveTab('home');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium text-slate-200 hover:text-[#D4AF37] hover:bg-[#0B2C44]"
            >
              Home
            </button>
            <button
              onClick={() => {
                setActiveTab('home');
                setMobileMenuOpen(false);
                const el = document.getElementById('scents-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium text-slate-200 hover:text-[#D4AF37] hover:bg-[#0B2C44]"
            >
              Shop Scents
            </button>
            <button
              onClick={() => {
                if (activeTab !== 'home') {
                  setActiveTab('home');
                }
                setMobileMenuOpen(false);
                setTimeout(() => {
                  const el = document.getElementById('content-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }, 80);
              }}
              className="w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium text-slate-200 hover:text-[#D4AF37] hover:bg-[#0B2C44] flex items-center justify-between"
            >
              <span>Content & Fragrance Guide</span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#0E3550] text-[#D4AF37] border border-[#D4AF37]/30">Guide</span>
            </button>
            <button
              onClick={() => {
                setActiveTab('home');
                setMobileMenuOpen(false);
                const el = document.getElementById('reviews-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium text-slate-200 hover:text-[#D4AF37] hover:bg-[#0B2C44]"
            >
              Customer Reviews
            </button>
            <button
              onClick={() => {
                setActiveTab('home');
                setMobileMenuOpen(false);
                const el = document.getElementById('about-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium text-slate-200 hover:text-[#D4AF37] hover:bg-[#0B2C44]"
            >
              About Al Raza
            </button>
            <div className="pt-2 border-t border-[#133A52]/60 flex items-center justify-between px-3">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAdmin();
                }}
                className="flex items-center gap-2 text-xs text-[#D4AF37] py-2 font-medium"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>{isAdminLoggedIn ? 'Open Admin Panel' : 'Owner Admin Login'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
