import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, CheckCircle2 } from 'lucide-react';
import { CartItem } from '../types/palope';
import { formatRupiah } from '../utils/formatters';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQty: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  onUpdateQty,
  onRemoveItem,
  onClearCart,
}) => {
  const [deliveryMethod, setDeliveryMethod] = useState<'posko' | 'kurir'>('posko');
  const [isSuccessCheckedOut, setIsSuccessCheckedOut] = useState(false);

  if (!isOpen) return null;

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const shippingFee = deliveryMethod === 'posko' ? 0 : 10000;
  const grandTotal = subtotal + shippingFee;

  const handleCheckout = () => {
    setIsSuccessCheckedOut(true);
  };

  const handleFinishSuccess = () => {
    setIsSuccessCheckedOut(false);
    onClearCart();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#e60023]" />
              <h3 className="text-sm font-extrabold text-gray-900">
                Keranjang Belanja ({cart.reduce((s, i) => s + i.quantity, 0)})
              </h3>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Checkout success screen */}
          {isSuccessCheckedOut ? (
            <div className="p-8 flex-1 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h4 className="text-lg font-extrabold text-gray-900">
                Pesanan Berhasil Dibuat!
              </h4>
              <p className="text-xs text-gray-600 mt-2 max-w-xs leading-relaxed">
                Terima kasih telah berbelanja di PALOPE Market. Pesananmu sedang diproses oleh pedagang lokal.
              </p>
              <div className="mt-4 p-3 bg-gray-50 rounded-xl text-xs font-mono text-gray-700 w-full">
                Total Pembayaran: <strong className="text-[#e60023]">{formatRupiah(grandTotal)}</strong>
                <br />
                Metode: {deliveryMethod === 'posko' ? 'Ambil di Posko PALOPE (Gratis)' : 'Kurir Lokal Pekalongan'}
              </div>
              <button
                type="button"
                onClick={handleFinishSuccess}
                className="mt-6 w-full py-2.5 bg-[#e60023] hover:bg-[#cc001f] text-white text-xs font-bold rounded-xl shadow transition-colors"
              >
                Kembali ke Belanja
              </button>
            </div>
          ) : (
            <>
              {/* Items List */}
              <div className="p-4 overflow-y-auto flex-1 space-y-3">
                {cart.length === 0 ? (
                  <div className="h-64 flex flex-col items-center justify-center text-center text-gray-400">
                    <ShoppingBag className="w-12 h-12 stroke-1 text-gray-300 mb-2" />
                    <p className="text-xs font-semibold text-gray-600">
                      Keranjangmu masih kosong
                    </p>
                    <p className="text-[11px] text-gray-400 mt-0.5">
                      Pilih produk sembako atau UMKM untuk mulai belanja.
                    </p>
                  </div>
                ) : (
                  cart.map((item) => (
                    <div
                      key={item.product.id}
                      className="flex items-center gap-3 p-2.5 bg-gray-50 rounded-xl border border-gray-100"
                    >
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-14 h-14 rounded-lg object-cover bg-gray-200 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-semibold text-gray-800 truncate">
                          {item.product.name}
                        </h4>
                        <span className="text-xs font-bold text-[#e60023] block mt-0.5">
                          {formatRupiah(item.product.price)}
                        </span>
                        <div className="flex items-center justify-between mt-1">
                          <div className="flex items-center border border-gray-300 rounded bg-white">
                            <button
                              type="button"
                              onClick={() => onUpdateQty(item.product.id, -1)}
                              className="px-1.5 py-0.5 text-gray-600 hover:text-black"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="px-2 text-xs font-semibold">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => onUpdateQty(item.product.id, 1)}
                              className="px-1.5 py-0.5 text-gray-600 hover:text-black"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          <span className="text-xs font-bold font-mono text-gray-700">
                            {formatRupiah(item.product.price * item.quantity)}
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => onRemoveItem(item.product.id)}
                        className="p-1 text-gray-400 hover:text-red-600"
                        title="Hapus item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* Cart Summary */}
              {cart.length > 0 && (
                <div className="p-4 border-t border-gray-100 bg-gray-50 space-y-3">
                  {/* Delivery selector */}
                  <div>
                    <span className="text-xs font-semibold text-gray-700 block mb-1.5">
                      Pilihan Pengiriman:
                    </span>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <button
                        type="button"
                        onClick={() => setDeliveryMethod('posko')}
                        className={`p-2 rounded-lg border text-left transition-colors ${
                          deliveryMethod === 'posko'
                            ? 'bg-red-50 border-[#e60023] text-[#e60023] font-bold'
                            : 'bg-white border-gray-200 text-gray-600'
                        }`}
                      >
                        Ambil di Posko
                        <span className="block text-[10px] text-gray-400 font-normal">
                          Gratis Ongkir
                        </span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeliveryMethod('kurir')}
                        className={`p-2 rounded-lg border text-left transition-colors ${
                          deliveryMethod === 'kurir'
                            ? 'bg-red-50 border-[#e60023] text-[#e60023] font-bold'
                            : 'bg-white border-gray-200 text-gray-600'
                        }`}
                      >
                        Kurir Lokal
                        <span className="block text-[10px] text-gray-400 font-normal">
                          Rp 10.000
                        </span>
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1 text-xs pt-2 border-t border-gray-200">
                    <div className="flex justify-between text-gray-500">
                      <span>Subtotal Produk</span>
                      <span>{formatRupiah(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-gray-500">
                      <span>Ongkos Kirim</span>
                      <span>{shippingFee === 0 ? 'Gratis' : formatRupiah(shippingFee)}</span>
                    </div>
                    <div className="flex justify-between text-sm font-extrabold text-gray-900 pt-1 border-t border-gray-200">
                      <span>Total Tagihan</span>
                      <span className="text-[#e60023]">{formatRupiah(grandTotal)}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleCheckout}
                    className="w-full py-3 bg-[#e60023] hover:bg-[#cc001f] text-white font-bold rounded-xl text-xs sm:text-sm transition-colors shadow flex items-center justify-center gap-2"
                  >
                    <span>Lanjutkan ke Pembayaran</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
