import React, { useState } from 'react';
import { ShoppingCart, Plus, Minus, Trash2, Search, CheckCircle, CreditCard, Banknote, QrCode } from 'lucide-react';
import { RecentTransactionItem } from '../../types/kdmp';

interface PosCashierViewProps {
  onCompleteTransaction: (tx: RecentTransactionItem) => void;
}

interface PosProduct {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  image: string;
}

const CASHIER_PRODUCTS: PosProduct[] = [
  { id: 'pos-1', name: 'Kopi Hitam Pekalongan', category: 'Minuman', price: 10000, stock: 45, image: '☕' },
  { id: 'pos-2', name: 'Roti Bakar Coklat Keju', category: 'Makanan', price: 15000, stock: 25, image: '🍞' },
  { id: 'pos-3', name: 'Es Teh Manis Jumbo', category: 'Minuman', price: 5000, stock: 80, image: '🧋' },
  { id: 'pos-4', name: 'Mie Goreng Spesial Telur', category: 'Makanan', price: 18000, stock: 30, image: '🍜' },
  { id: 'pos-5', name: 'Beras Ramos 5kg', category: 'Sembako', price: 68000, stock: 12, image: '🌾' },
  { id: 'pos-6', name: 'Minyak Goreng Sawit 2L', category: 'Sembako', price: 34000, stock: 18, image: '🍳' },
  { id: 'pos-7', name: 'Gula Pasir Kristal 1kg', category: 'Sembako', price: 17500, stock: 40, image: '🧂' },
  { id: 'pos-8', name: 'Keripik Tempe Renyah', category: 'Snack', price: 12000, stock: 22, image: '🥟' },
];

export const PosCashierView: React.FC<PosCashierViewProps> = ({ onCompleteTransaction }) => {
  const [activeCategory, setActiveCategory] = useState<string>('Semua');
  const [search, setSearch] = useState<string>('');
  const [cart, setCart] = useState<{ product: PosProduct; quantity: number }[]>([
    { product: CASHIER_PRODUCTS[0], quantity: 2 },
    { product: CASHIER_PRODUCTS[1], quantity: 1 },
  ]);
  const [customerName, setCustomerName] = useState<string>('Pelanggan Umum');
  const [paymentMethod, setPaymentMethod] = useState<'Tunai' | 'QRIS' | 'Debit' | 'Transfer Bank'>('Tunai');

  const addToCart = (product: PosProduct) => {
    setCart((prev) => {
      const idx = prev.findIndex((item) => item.product.id === product.id);
      if (idx > -1) {
        return prev.map((item, i) =>
          i === idx ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const updateQty = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product.id === id) {
            const next = item.quantity + delta;
            return next > 0 ? { ...item, quantity: next } : null;
          }
          return item;
        })
        .filter(Boolean) as { product: PosProduct; quantity: number }[]
    );
  };

  const removeItem = (id: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== id));
  };

  const clearCart = () => setCart([]);

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const handleCheckout = () => {
    if (cart.length === 0) return;
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')} WIB`;
    const invNumber = `INV-${Math.floor(100 + Math.random() * 900)}`;

    const newTx: RecentTransactionItem = {
      id: `tx-${Date.now()}`,
      invoice: invNumber,
      customer: customerName || 'Pelanggan Walk-in',
      total: subtotal,
      status: 'Lunas',
      time: timeStr,
      paymentMethod,
    };

    onCompleteTransaction(newTx);
    clearCart();
    alert(`Transaksi ${invNumber} berhasil dibayar!`);
  };

  const categories = ['Semua', 'Makanan', 'Minuman', 'Sembako', 'Snack'];

  const filteredProducts = CASHIER_PRODUCTS.filter((p) => {
    const matchCat = activeCategory === 'Semua' || p.category === activeCategory;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full items-start">
      {/* Product Selection (Col 8) */}
      <div className="lg:col-span-8 space-y-4">
        {/* Filter bar */}
        <div className="bg-white p-4 rounded-xl border border-[#E0E0E0] shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="flex flex-wrap gap-1.5 w-full sm:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  activeCategory === cat
                    ? 'bg-[#D32F2F] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari item cepat..."
              className="w-full text-xs pl-8 pr-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:outline-none focus:border-[#D32F2F]"
            />
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3.5">
          {filteredProducts.map((prod) => (
            <div
              key={prod.id}
              onClick={() => addToCart(prod)}
              className="bg-white rounded-xl border border-gray-200 p-3.5 shadow-xs hover:border-[#D32F2F] hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div className="text-3xl mb-2 text-center group-hover:scale-110 transition-transform">
                {prod.image}
              </div>
              <div>
                <span className="text-[10px] text-gray-400 font-semibold uppercase block">
                  {prod.category}
                </span>
                <h6 className="text-xs font-bold text-gray-800 line-clamp-1 group-hover:text-[#D32F2F]">
                  {prod.name}
                </h6>
              </div>
              <div className="mt-2.5 pt-2 border-t border-gray-100 flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-[#D32F2F]">
                  Rp {prod.price.toLocaleString('id-ID')}
                </span>
                <span className="text-[10px] text-gray-400">
                  Stok: {prod.stock}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* POS Cart Summary (Col 4) */}
      <div className="lg:col-span-4 bg-white rounded-xl border border-[#E0E0E0] shadow-xs p-4 sticky top-20 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-4 h-4 text-[#D32F2F]" />
              <h5 className="text-xs font-bold text-gray-800">Kasir POS KDMP</h5>
            </div>
            {cart.length > 0 && (
              <button
                type="button"
                onClick={clearCart}
                className="text-[11px] text-red-500 hover:underline"
              >
                Reset
              </button>
            )}
          </div>

          {/* Customer name */}
          <div className="mt-3">
            <label className="text-[10.5px] font-bold text-gray-500 block mb-1">
              Nama Customer:
            </label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full text-xs px-2.5 py-1.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#D32F2F]"
            />
          </div>

          {/* Cart list */}
          <div className="my-3 divide-y divide-gray-100 max-h-56 overflow-y-auto pr-1">
            {cart.length === 0 ? (
              <div className="py-8 text-center text-gray-400 text-xs">
                Belum ada produk dipilih.<br />
                Klik item di sebelah kiri untuk menambah.
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.product.id} className="py-2 flex items-center justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-800 truncate">
                      {item.product.name}
                    </p>
                    <span className="text-[11px] font-mono text-gray-500">
                      Rp {item.product.price.toLocaleString('id-ID')}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 bg-gray-50 border border-gray-200 rounded px-1 py-0.5">
                    <button
                      type="button"
                      onClick={() => updateQty(item.product.id, -1)}
                      className="text-gray-500 hover:text-black p-0.5"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-4 text-center text-xs font-bold">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateQty(item.product.id, 1)}
                      className="text-gray-500 hover:text-black p-0.5"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeItem(item.product.id)}
                    className="text-gray-400 hover:text-red-600 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Checkout bottom */}
        <div className="pt-3 border-t border-gray-100 space-y-3">
          {/* Payment Method Selector */}
          <div>
            <span className="text-[10.5px] font-bold text-gray-500 block mb-1">
              Metode Pembayaran:
            </span>
            <div className="grid grid-cols-4 gap-1">
              {(['Tunai', 'QRIS', 'Debit', 'Transfer Bank'] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setPaymentMethod(m)}
                  className={`py-1 rounded text-[10px] font-bold border transition-colors ${
                    paymentMethod === m
                      ? 'bg-red-50 border-[#D32F2F] text-[#D32F2F]'
                      : 'bg-white border-gray-200 text-gray-600'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-between items-baseline pt-1">
            <span className="text-xs font-bold text-gray-700">Total Tagihan:</span>
            <span className="text-base font-extrabold font-mono text-[#D32F2F]">
              Rp {subtotal.toLocaleString('id-ID')}
            </span>
          </div>

          <button
            type="button"
            disabled={cart.length === 0}
            onClick={handleCheckout}
            className="w-full py-2.5 bg-[#D32F2F] hover:bg-[#B71C1C] disabled:bg-gray-300 text-white font-bold rounded-xl text-xs shadow flex items-center justify-center gap-2 transition-colors"
          >
            <CheckCircle className="w-4 h-4" />
            <span>Bayar Sekarang (F9)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
