import React from 'react';
import { PlusCircle, PackagePlus, Printer, Sparkles } from 'lucide-react';

interface QuickActionsProps {
  onAddTransaction: () => void;
  onAddProduct: () => void;
  onPrintReceipt: () => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({
  onAddTransaction,
  onAddProduct,
  onPrintReceipt,
}) => {
  return (
    <div className="bg-[#fce4ec] border border-[#f8bbd0] border-l-4 border-l-[#e91e63] rounded-xl p-5 shadow-xs h-full flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-3">
          <h6 className="text-sm font-bold text-[#880e4f] flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-[#e91e63]" />
            Aksi Cepat
          </h6>
          <span className="text-[10px] text-[#ad1457] font-semibold bg-white/60 px-2 py-0.5 rounded-full">
            Shortcut Kasir
          </span>
        </div>
        <p className="text-[11px] text-[#ad1457]/80 mb-4 leading-snug">
          Akses cepat untuk tugas kasir harian dan input data tanpa berpindah menu.
        </p>
      </div>

      <div className="space-y-2.5">
        <button
          type="button"
          onClick={onAddTransaction}
          className="w-full bg-white hover:bg-red-50 text-gray-800 hover:text-[#D32F2F] text-xs font-bold py-2.5 px-4 rounded-xl border border-[#f8bbd0]/60 shadow-xs flex items-center gap-2.5 transition-all text-left group"
        >
          <PlusCircle className="w-4 h-4 text-[#D32F2F] group-hover:scale-110 transition-transform" />
          <span>Tambah Transaksi (POS)</span>
        </button>

        <button
          type="button"
          onClick={onAddProduct}
          className="w-full bg-white hover:bg-red-50 text-gray-800 hover:text-[#D32F2F] text-xs font-bold py-2.5 px-4 rounded-xl border border-[#f8bbd0]/60 shadow-xs flex items-center gap-2.5 transition-all text-left group"
        >
          <PackagePlus className="w-4 h-4 text-[#D32F2F] group-hover:scale-110 transition-transform" />
          <span>Tambah Produk Baru</span>
        </button>

        <button
          type="button"
          onClick={onPrintReceipt}
          className="w-full bg-white hover:bg-red-50 text-gray-800 hover:text-[#D32F2F] text-xs font-bold py-2.5 px-4 rounded-xl border border-[#f8bbd0]/60 shadow-xs flex items-center gap-2.5 transition-all text-left group"
        >
          <Printer className="w-4 h-4 text-[#D32F2F] group-hover:scale-110 transition-transform" />
          <span>Cetak Struk Terakhir</span>
        </button>
      </div>
    </div>
  );
};
