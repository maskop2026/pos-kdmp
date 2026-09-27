import React, { useState, useRef, useEffect } from 'react';
import { Search, Barcode, Filter, PackageSearch } from 'lucide-react';
import { Product, Category, CartItem, StoreSettings } from '../types';
import { ProductCard } from './ProductCard';
import { CartSidebar } from './CartSidebar';

interface PosViewProps {
  products: Product[];
  cart: CartItem[];
  settings: StoreSettings;
  onAddToCart: (product: Product) => void;
  onUpdateQuantity: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  onOpenCheckout: (calculations: {
    subtotal: number;
    discountType: 'percentage' | 'fixed';
    discountValue: number;
    discountAmount: number;
    taxEnabled: boolean;
    taxAmount: number;
    grandTotal: number;
  }) => void;
  onShowToast: (type: 'success' | 'error' | 'warning' | 'info', title: string, msg?: string) => void;
}

export const PosView: React.FC<PosViewProps> = ({
  products,
  cart,
  settings,
  onAddToCart,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onOpenCheckout,
  onShowToast,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<Category>('Semua');
  const [barcodeInput, setBarcodeInput] = useState<string>('');
  const barcodeInputRef = useRef<HTMLInputElement | null>(null);

  const categories: Category[] = [
    'Semua',
    'Makanan',
    'Minuman',
    'Sembako',
    'Snack',
    'Kebutuhan Rumah',
  ];

  // Handle Barcode Gun Scanner Enter
  const handleBarcodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!barcodeInput.trim()) return;

    const matched = products.find(
      (p) =>
        p.barcode === barcodeInput.trim() ||
        p.sku.toLowerCase() === barcodeInput.trim().toLowerCase()
    );

    if (matched) {
      if (matched.stock <= 0) {
        onShowToast('error', 'Stok Habis', `Produk ${matched.name} tidak memiliki sisa stok.`);
      } else {
        onAddToCart(matched);
        onShowToast('success', 'Produk Ditambahkan', matched.name);
      }
      setBarcodeInput('');
    } else {
      onShowToast('warning', 'Barcode Tidak Ditemukan', `Kode ${barcodeInput} belum terdaftar.`);
    }
  };

  // Filter products based on search and category
  const filteredProducts = products.filter((p) => {
    const matchesCategory = selectedCategory === 'Semua' || p.category === selectedCategory;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      p.name.toLowerCase().includes(q) ||
      p.sku.toLowerCase().includes(q) ||
      (p.barcode && p.barcode.includes(q));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 h-[calc(100vh-140px)] min-h-[580px]">
      {/* Left Area: Catalog & Fast Search (Cols 8) */}
      <div className="lg:col-span-8 flex flex-col h-full overflow-hidden">
        {/* Search & Barcode Scan Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 mb-3">
          {/* Main search */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari produk berdasarkan nama atau SKU..."
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-amber-500/60"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500 hover:text-slate-300"
              >
                ✕
              </button>
            )}
          </div>

          {/* Barcode scanner input */}
          <form onSubmit={handleBarcodeSubmit} className="relative w-full sm:w-56">
            <Barcode className="w-4 h-4 text-amber-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              ref={barcodeInputRef}
              type="text"
              value={barcodeInput}
              onChange={(e) => setBarcodeInput(e.target.value)}
              placeholder="Scan Barcode (Enter)..."
              className="w-full bg-slate-900/80 border border-amber-500/30 rounded-xl pl-9 pr-3 py-2 text-xs font-mono text-amber-200 placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
            />
          </form>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none mb-2">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors border ${
                selectedCategory === cat
                  ? 'bg-amber-500/15 border-amber-500/40 text-amber-300'
                  : 'bg-slate-900/60 border-slate-800/80 text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="flex-1 overflow-y-auto pr-1">
          {filteredProducts.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-center text-slate-500 border border-dashed border-slate-800 rounded-2xl">
              <PackageSearch className="w-10 h-10 stroke-1 text-slate-600 mb-2" />
              <p className="text-xs font-medium text-slate-400">Produk tidak ditemukan</p>
              <p className="text-[11px] text-slate-600 mt-0.5">
                Coba cari dengan kata kunci lain atau pilih kategori &quot;Semua&quot;.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-2.5">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right Area: Checkout Cart Sidebar (Cols 4) */}
      <div className="lg:col-span-4 h-full">
        <CartSidebar
          cart={cart}
          settings={settings}
          onUpdateQuantity={onUpdateQuantity}
          onRemoveItem={onRemoveItem}
          onClearCart={onClearCart}
          onOpenCheckout={onOpenCheckout}
        />
      </div>
    </div>
  );
};
