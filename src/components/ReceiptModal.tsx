import React, { useState } from 'react';
import { Printer, Share2, Check, X, Download } from 'lucide-react';
import { Transaction, StoreSettings } from '../types';
import { formatRupiah, formatDateTime } from '../utils/formatters';

interface ReceiptModalProps {
  transaction: Transaction;
  settings: StoreSettings;
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({ transaction, settings, onClose }) => {
  const [copied, setCopied] = useState<boolean>(false);

  const handlePrint = () => {
    window.print();
  };

  const getPlainTextReceipt = () => {
    let text = `================================\n`;
    text += `       ${settings.storeName}\n`;
    text += `  ${settings.storeAddress}\n`;
    text += `       Telp: ${settings.storePhone}\n`;
    text += `================================\n`;
    text += `No. Inv  : ${transaction.invoiceNumber}\n`;
    text += `Waktu    : ${formatDateTime(transaction.createdAt)}\n`;
    text += `Kasir    : ${transaction.cashierName}\n`;
    if (transaction.customerName) {
      text += `Pelanggan: ${transaction.customerName}\n`;
    }
    text += `--------------------------------\n`;
    transaction.items.forEach((item) => {
      text += `${item.product.name}\n`;
      text += `  ${item.quantity} x ${formatRupiah(item.product.sellingPrice)} = ${formatRupiah(
        item.quantity * item.product.sellingPrice
      )}\n`;
    });
    text += `--------------------------------\n`;
    text += `Subtotal    : ${formatRupiah(transaction.subtotal)}\n`;
    if (transaction.discountAmount > 0) {
      text += `Diskon      : -${formatRupiah(transaction.discountAmount)}\n`;
    }
    if (transaction.taxEnabled) {
      text += `PPN (${settings.taxRate}%)    : ${formatRupiah(transaction.taxAmount)}\n`;
    }
    text += `TOTAL       : ${formatRupiah(transaction.grandTotal)}\n`;
    text += `Metode      : ${transaction.paymentMethod.toUpperCase()}\n`;
    text += `Bayar       : ${formatRupiah(transaction.amountPaid)}\n`;
    text += `Kembali     : ${formatRupiah(transaction.change)}\n`;
    text += `================================\n`;
    text += `${settings.receiptFooter}\n`;
    text += `================================\n`;
    return text;
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(getPlainTextReceipt());
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(getPlainTextReceipt());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-950/40">
          <div>
            <h3 className="text-sm font-semibold text-slate-100">Struk Transaksi Selesai</h3>
            <span className="text-[11px] text-slate-400 font-mono">{transaction.invoiceNumber}</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Thermal Receipt Container */}
        <div className="p-6 overflow-y-auto flex-1 flex justify-center bg-slate-950/50">
          <div
            id="printable-receipt"
            className="bg-white text-slate-900 w-[310px] p-5 rounded-lg shadow-md font-mono text-xs select-text"
            style={{ fontFamily: 'monospace' }}
          >
            {/* Header */}
            <div className="text-center pb-3 border-b border-dashed border-slate-400">
              <h4 className="font-bold text-sm tracking-wider uppercase">{settings.storeName}</h4>
              <p className="text-[10px] text-slate-600 mt-0.5">{settings.storeAddress}</p>
              <p className="text-[10px] text-slate-600">Telp: {settings.storePhone}</p>
            </div>

            {/* Info */}
            <div className="py-2.5 text-[11px] border-b border-dashed border-slate-400 space-y-0.5">
              <div className="flex justify-between">
                <span>No. Inv:</span>
                <span className="font-semibold">{transaction.invoiceNumber}</span>
              </div>
              <div className="flex justify-between">
                <span>Tanggal:</span>
                <span>{formatDateTime(transaction.createdAt)}</span>
              </div>
              <div className="flex justify-between">
                <span>Kasir:</span>
                <span>{transaction.cashierName}</span>
              </div>
              {transaction.customerName && (
                <div className="flex justify-between">
                  <span>Pelanggan:</span>
                  <span>{transaction.customerName}</span>
                </div>
              )}
            </div>

            {/* Item List */}
            <div className="py-2.5 border-b border-dashed border-slate-400 space-y-1.5">
              {transaction.items.map((item, idx) => (
                <div key={idx} className="text-[11px]">
                  <div className="font-medium truncate">{item.product.name}</div>
                  <div className="flex justify-between text-slate-600 text-[10px]">
                    <span>
                      {item.quantity} x {formatRupiah(item.product.sellingPrice)}
                    </span>
                    <span className="font-semibold text-slate-900">
                      {formatRupiah(item.quantity * item.product.sellingPrice)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Calculations */}
            <div className="py-2.5 text-[11px] space-y-1 border-b border-dashed border-slate-400">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatRupiah(transaction.subtotal)}</span>
              </div>
              {transaction.discountAmount > 0 && (
                <div className="flex justify-between text-rose-600">
                  <span>Diskon</span>
                  <span>-{formatRupiah(transaction.discountAmount)}</span>
                </div>
              )}
              {transaction.taxEnabled && (
                <div className="flex justify-between">
                  <span>PPN ({settings.taxRate}%)</span>
                  <span>{formatRupiah(transaction.taxAmount)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-xs pt-1 border-t border-slate-300">
                <span>TOTAL</span>
                <span>{formatRupiah(transaction.grandTotal)}</span>
              </div>
            </div>

            {/* Payment Details */}
            <div className="py-2.5 text-[11px] space-y-1 border-b border-dashed border-slate-400">
              <div className="flex justify-between">
                <span>Metode:</span>
                <span className="font-semibold uppercase">{transaction.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span>Bayar:</span>
                <span>{formatRupiah(transaction.amountPaid)}</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span>Kembali:</span>
                <span>{formatRupiah(transaction.change)}</span>
              </div>
            </div>

            {/* Footer */}
            <div className="pt-3 text-center text-[10px] text-slate-500 whitespace-pre-line leading-relaxed">
              {settings.receiptFooter}
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyText}
              className="px-3 py-2 rounded-lg bg-slate-800 text-slate-300 hover:text-slate-100 hover:bg-slate-700 text-xs font-medium transition-colors flex items-center gap-1.5"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copied ? 'Tersalin' : 'Salin Teks'}</span>
            </button>
            <button
              type="button"
              onClick={handleShareWhatsApp}
              className="px-3 py-2 rounded-lg bg-emerald-600/20 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-600/30 text-xs font-medium transition-colors"
            >
              Kirim WA
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 text-xs font-semibold flex items-center gap-1.5 shadow-md transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak Struk (Ctrl+P)</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs font-medium transition-colors"
            >
              Selesai
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
