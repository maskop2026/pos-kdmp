import React, { useState } from 'react';
import { ShoppingCart, Trash2, Plus, Minus, Tag, Percent, ArrowRight, RotateCcw } from 'lucide-react';
import { CartItem, StoreSettings } from '../types';
import { formatRupiah } from '../utils/formatters';

interface CartSidebarProps {
  cart: CartItem[];
  settings: StoreSettings;
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
}

export const CartSidebar: React.FC<CartSidebarProps> = ({
  cart,
  settings,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onOpenCheckout,
}) => {
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage');
  const [discountValue, setDiscountValue] = useState<number>(0);
  const [taxEnabled, setTaxEnabled] = useState<boolean>(false);

  // Computations
  const subtotal = cart.reduce((sum, item) => sum + item.product.sellingPrice * item.quantity, 0);

  let discountAmount = 0;
  if (discountType === 'percentage') {
    discountAmount = Math.round((subtotal * Math.min(100, Math.max(0, discountValue))) / 100);
  } else {
    discountAmount = Math.min(subtotal, Math.max(0, discountValue));
  }

  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const taxAmount = taxEnabled ? Math.round((taxableAmount * settings.taxRate) / 100) : 0;
  const grandTotal = taxableAmount + taxAmount;
  const totalItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleCheckoutClick = () => {
    if (cart.length === 0) return;
    onOpenCheckout({
      subtotal,
      discountType,
      discountValue,
      discountAmount,
      taxEnabled,
      taxAmount,
      grandTotal,
    });
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800/90 rounded-2xl flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/40">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <ShoppingCart className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-semibold text-slate-100">Keranjang Kasir</h3>
            <span className="text-[11px] text-slate-400">
              {totalItemCount} item ({cart.length} produk)
            </span>
          </div>
        </div>

        {cart.length > 0 && (
          <button
            type="button"
            onClick={onClearCart}
            className="text-[11px] text-slate-400 hover:text-rose-400 flex items-center gap-1 transition-colors"
            title="Kosongkan keranjang"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Cart Items List */}
      <div className="flex-1 p-3 overflow-y-auto space-y-2">
        {cart.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500">
            <ShoppingCart className="w-10 h-10 stroke-1 text-slate-600 mb-2" />
            <p className="text-xs font-medium text-slate-400">Keranjang masih kosong</p>
            <p className="text-[11px] text-slate-600 mt-1 max-w-[200px]">
              Klik produk di katalog atau scan barcode untuk menambahkan transaksi.
            </p>
          </div>
        ) : (
          cart.map((item) => {
            const itemTotal = item.product.sellingPrice * item.quantity;
            return (
              <div
                key={item.product.id}
                className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex flex-col gap-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h4 className="text-xs font-medium text-slate-200 truncate">
                      {item.product.name}
                    </h4>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {formatRupiah(item.product.sellingPrice)} / {item.product.unit}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => onRemoveItem(item.product.id)}
                    className="text-slate-500 hover:text-rose-400 p-1 transition-colors"
                    title="Hapus dari keranjang"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Quantity Controls & Total */}
                <div className="flex items-center justify-between pt-1 border-t border-slate-900">
                  <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded-lg p-0.5">
                    <button
                      type="button"
                      onClick={() => onUpdateQuantity(item.product.id, -1)}
                      className="w-6 h-6 rounded flex items-center justify-center text-slate-300 hover:bg-slate-800 hover:text-slate-100 transition-colors"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="font-mono text-xs font-semibold px-2 min-w-[24px] text-center text-slate-100">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => onUpdateQuantity(item.product.id, 1)}
                      disabled={item.quantity >= item.product.stock}
                      className="w-6 h-6 rounded flex items-center justify-center text-slate-300 hover:bg-slate-800 hover:text-slate-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  <span className="font-mono text-xs font-bold text-amber-400">
                    {formatRupiah(itemTotal)}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Cart Summary & Discount/Tax controls */}
      {cart.length > 0 && (
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 space-y-3">
          {/* Discount and Tax Controls */}
          <div className="space-y-2 pt-1">
            {/* Discount row */}
            <div className="flex items-center justify-between text-xs gap-2">
              <span className="text-slate-400 flex items-center gap-1">
                <Tag className="w-3 h-3" /> Diskon:
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setDiscountType(discountType === 'percentage' ? 'fixed' : 'percentage')}
                  className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300 hover:bg-slate-700"
                >
                  {discountType === 'percentage' ? '%' : 'Rp'}
                </button>
                <input
                  type="number"
                  min="0"
                  max={discountType === 'percentage' ? 100 : subtotal}
                  value={discountValue || ''}
                  onChange={(e) => setDiscountValue(parseFloat(e.target.value) || 0)}
                  placeholder="0"
                  className="w-20 bg-slate-900 border border-slate-800 rounded px-2 py-1 text-right text-xs font-mono text-slate-200 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* Tax toggle */}
            <div className="flex items-center justify-between text-xs">
              <label className="text-slate-400 flex items-center gap-1.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={taxEnabled}
                  onChange={(e) => setTaxEnabled(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-900 text-amber-500 focus:ring-0 cursor-pointer"
                />
                <span>PPN ({settings.taxRate}%)</span>
              </label>
              <span className="text-slate-300 font-mono text-xs">
                {taxEnabled ? formatRupiah(taxAmount) : 'Rp 0'}
              </span>
            </div>
          </div>

          {/* Pricing Breakdown */}
          <div className="pt-2 border-t border-slate-800/80 space-y-1 text-xs">
            <div className="flex justify-between text-slate-400">
              <span>Subtotal</span>
              <span className="font-mono text-slate-200">{formatRupiah(subtotal)}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-rose-400">
                <span>Potongan Diskon</span>
                <span className="font-mono">-{formatRupiah(discountAmount)}</span>
              </div>
            )}
            {taxEnabled && (
              <div className="flex justify-between text-slate-400">
                <span>Pajak PPN</span>
                <span className="font-mono text-slate-200">{formatRupiah(taxAmount)}</span>
              </div>
            )}
            <div className="flex justify-between items-baseline pt-2 border-t border-slate-800">
              <span className="text-xs font-semibold text-slate-200">TOTAL AKHIR</span>
              <span className="font-mono text-xl font-bold text-amber-400">
                {formatRupiah(grandTotal)}
              </span>
            </div>
          </div>

          {/* Checkout Button */}
          <button
            type="button"
            onClick={handleCheckoutClick}
            className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs sm:text-sm transition-all shadow-lg flex items-center justify-center gap-2"
          >
            <span>Bayar Sekarang</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
