import React from 'react';
import { X, Printer, Check } from 'lucide-react';
import { RecentTransactionItem } from '../../types/kdmp';

interface PrintReceiptModalProps {
  transaction: RecentTransactionItem;
  onClose: () => void;
}

export const PrintReceiptModal: React.FC<PrintReceiptModalProps> = ({
  transaction,
  onClose,
}) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-sm w-full overflow-hidden shadow-2xl flex flex-col">
        <div className="p-3 bg-gray-100 border-b border-gray-200 flex items-center justify-between">
          <span className="text-xs font-bold text-gray-700">Preview Struk Kasir</span>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-full text-gray-400 hover:text-gray-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Thermal receipt look */}
        <div className="p-6 font-mono text-xs text-gray-800 bg-amber-50/20 border-b border-dashed border-gray-300">
          <div className="text-center pb-3 border-b border-dashed border-gray-300">
            <h4 className="font-extrabold text-sm text-[#D32F2F]">POS KDMP INDONESIA</h4>
            <p className="text-[10px] text-gray-500">Outlet Pekalongan Pusat</p>
            <p className="text-[10px] text-gray-400">Jl. KH Wahid Hasyim No. 45</p>
          </div>

          <div className="py-2.5 text-[11px] space-y-1 border-b border-dashed border-gray-300">
            <div className="flex justify-between">
              <span>No. Inv:</span>
              <span className="font-bold">{transaction.invoice}</span>
            </div>
            <div className="flex justify-between">
              <span>Kasir:</span>
              <span>Admin KDMP</span>
            </div>
            <div className="flex justify-between">
              <span>Pelanggan:</span>
              <span>{transaction.customer}</span>
            </div>
            <div className="flex justify-between">
              <span>Waktu:</span>
              <span>{transaction.time}</span>
            </div>
          </div>

          <div className="py-2.5 text-[11px] space-y-1 border-b border-dashed border-gray-300">
            <div className="flex justify-between font-semibold">
              <span>Pesanan Utama</span>
              <span>Rp {transaction.total.toLocaleString('id-ID')}</span>
            </div>
            <div className="text-[10px] text-gray-400">1x Paket Transaksi Kasir</div>
          </div>

          <div className="py-2.5 text-[11px] space-y-1">
            <div className="flex justify-between font-bold text-xs">
              <span>TOTAL:</span>
              <span className="text-[#D32F2F]">
                Rp {transaction.total.toLocaleString('id-ID')}
              </span>
            </div>
            <div className="flex justify-between text-gray-500 text-[10px]">
              <span>Metode:</span>
              <span>{transaction.paymentMethod}</span>
            </div>
            <div className="flex justify-between text-gray-500 text-[10px]">
              <span>Status:</span>
              <span className="text-emerald-600 font-bold">{transaction.status}</span>
            </div>
          </div>

          <div className="text-center pt-3 text-[10px] text-gray-400">
            Terima kasih telah berbelanja!<br />
            Simpan struk ini sebagai bukti pembayaran.
          </div>
        </div>

        <div className="p-3 bg-gray-50 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 text-xs text-gray-600 hover:text-gray-800"
          >
            Tutup
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="px-4 py-1.5 bg-[#D32F2F] hover:bg-[#B71C1C] text-white text-xs font-bold rounded-lg shadow flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Cetak Thermal</span>
          </button>
        </div>
      </div>
    </div>
  );
};
