import React from 'react';
import { Plus, AlertTriangle, PackageX } from 'lucide-react';
import { Product } from '../types';
import { formatRupiah } from '../utils/formatters';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= product.minStock;

  return (
    <div
      onClick={() => {
        if (!isOutOfStock) onAddToCart(product);
      }}
      className={`group relative flex flex-col justify-between p-3.5 rounded-xl border transition-all select-none text-left ${
        isOutOfStock
          ? 'bg-slate-900/30 border-slate-800/50 opacity-60 cursor-not-allowed'
          : 'bg-slate-900/70 border-slate-800/80 hover:border-amber-500/40 hover:bg-slate-800/70 hover:shadow-lg hover:-translate-y-0.5 cursor-pointer'
      }`}
    >
      <div>
        {/* Top: Category & SKU */}
        <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1.5">
          <span className="font-mono text-slate-400">{product.sku}</span>
          <span>{product.category}</span>
        </div>

        {/* Product Title */}
        <h3 className="text-xs font-semibold text-slate-100 group-hover:text-amber-200 transition-colors line-clamp-2 leading-snug">
          {product.name}
        </h3>
      </div>

      {/* Bottom: Price & Stock & Action */}
      <div className="mt-3 pt-2.5 border-t border-slate-800/60 flex items-end justify-between gap-2">
        <div>
          <div className="text-sm font-bold font-mono text-amber-400">
            {formatRupiah(product.sellingPrice)}
          </div>
          <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
            {isOutOfStock ? (
              <span className="text-rose-400 font-medium flex items-center gap-1">
                <PackageX className="w-3 h-3" /> Stok Habis
              </span>
            ) : isLowStock ? (
              <span className="text-amber-400 font-medium flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" /> Sisa {product.stock} {product.unit}
              </span>
            ) : (
              <span>
                Stok: {product.stock} {product.unit}
              </span>
            )}
          </div>
        </div>

        {/* Add icon button */}
        <button
          type="button"
          disabled={isOutOfStock}
          onClick={(e) => {
            e.stopPropagation();
            if (!isOutOfStock) onAddToCart(product);
          }}
          className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors shrink-0 ${
            isOutOfStock
              ? 'bg-slate-800 text-slate-600 cursor-not-allowed'
              : 'bg-amber-500/20 group-hover:bg-amber-500 text-amber-300 group-hover:text-slate-950'
          }`}
          title="Tambah ke keranjang"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
