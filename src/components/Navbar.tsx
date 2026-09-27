import React, { useState } from 'react';
import {
  MapPin,
  Search,
  Heart,
  ShoppingCart,
  Menu,
  X,
  Store,
  HelpCircle,
  Truck,
} from 'lucide-react';

interface NavbarProps {
  cartCount: number;
  wishlistCount: number;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onOpenAuth: (mode: 'login' | 'register') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  cartCount,
  wishlistCount,
  searchQuery,
  onSearchChange,
  onOpenCart,
  onOpenWishlist,
  onOpenAuth,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Top Bar (Pekalongan info & Quick links) */}
      <div className="bg-[#cc001f] text-white text-[12px] py-1.5 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          <div className="flex items-center gap-1.5 opacity-90">
            <MapPin className="w-3.5 h-3.5" />
            <span>Pasar Lokal Pekalongan & Sekitarnya</span>
          </div>
          <div className="flex items-center gap-5 text-xs font-normal">
            <button
              type="button"
              onClick={() => alert('Pusat Bantuan PALOPE:\nWhatsApp: 0812-3456-7890\nJam Operasional: 08.00 - 17.00 WIB')}
              className="hover:underline flex items-center gap-1"
            >
              <HelpCircle className="w-3.5 h-3.5" /> Bantuan
            </button>
            <button
              type="button"
              onClick={() => onOpenAuth('register')}
              className="hover:underline flex items-center gap-1"
            >
              <Store className="w-3.5 h-3.5" /> Mulai Berjualan
            </button>
            <button
              type="button"
              onClick={() => alert('Fitur Lacak Pesanan: Masukkan nomor invoice yang tertera pada struk pembelian.')}
              className="hover:underline flex items-center gap-1"
            >
              <Truck className="w-3.5 h-3.5" /> Lacak Pesanan
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          {/* Logo Brand */}
          <a href="#" className="flex items-center gap-2.5 shrink-0 group">
            <div className="w-9 h-9 rounded-lg bg-[#e60023] text-white flex items-center justify-center font-black text-xl shadow-sm group-hover:bg-[#cc001f] transition-colors">
              P
            </div>
            <span className="font-extrabold text-2xl tracking-tight text-[#e60023]">
              PALOPE
            </span>
          </a>

          {/* Search Bar */}
          <div className="flex-1 max-w-xl mx-2 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Cari sembako, produk UMKM..."
              className="w-full rounded-full py-2.5 pl-5 pr-14 bg-gray-100 border border-gray-200 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:bg-white focus:border-[#e60023] transition-colors"
            />
            <button
              type="button"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-[#e60023] hover:bg-[#cc001f] text-white rounded-full p-2 px-4 flex items-center justify-center transition-colors shadow-sm"
              title="Cari"
            >
              <Search className="w-4 h-4" />
            </button>
          </div>

          {/* Right Action Icons & Auth */}
          <div className="hidden lg:flex items-center gap-4">
            {/* Wishlist Button */}
            <button
              type="button"
              onClick={onOpenWishlist}
              className="relative p-2 text-gray-600 hover:text-[#e60023] transition-colors"
              title="Daftar Keinginan (Wishlist)"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#e60023] text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center border-2 border-white">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Cart Button */}
            <button
              type="button"
              onClick={onOpenCart}
              className="relative p-2 text-gray-600 hover:text-[#e60023] transition-colors"
              title="Keranjang Belanja"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#e60023] text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center border-2 border-white">
                  {cartCount}
                </span>
              )}
            </button>

            <div className="h-6 w-px bg-gray-200 mx-1" />

            {/* Auth Buttons */}
            <button
              type="button"
              onClick={() => onOpenAuth('login')}
              className="px-5 py-2 rounded-full border border-[#e60023] text-[#e60023] hover:bg-red-50 text-xs font-bold transition-colors"
            >
              Masuk
            </button>
            <button
              type="button"
              onClick={() => onOpenAuth('register')}
              className="px-5 py-2 rounded-full bg-[#e60023] hover:bg-[#cc001f] text-white text-xs font-bold transition-colors shadow-sm"
            >
              Daftar
            </button>
          </div>

          {/* Mobile hamburger */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              type="button"
              onClick={onOpenCart}
              className="relative p-2 text-gray-700"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#e60023] text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-gray-700 hover:text-[#e60023]"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-100 px-4 py-3 space-y-2.5">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAuth('login');
                }}
                className="flex-1 py-2 rounded-full border border-[#e60023] text-[#e60023] text-xs font-bold text-center"
              >
                Masuk
              </button>
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAuth('register');
                }}
                className="flex-1 py-2 rounded-full bg-[#e60023] text-white text-xs font-bold text-center"
              >
                Daftar
              </button>
            </div>
            <div className="pt-2 border-t border-gray-100 flex justify-around text-xs text-gray-600">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenWishlist();
                }}
                className="flex items-center gap-1.5 py-1"
              >
                <Heart className="w-4 h-4 text-[#e60023]" /> Wishlist ({wishlistCount})
              </button>
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenCart();
                }}
                className="flex items-center gap-1.5 py-1"
              >
                <ShoppingCart className="w-4 h-4 text-[#e60023]" /> Keranjang ({cartCount})
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
