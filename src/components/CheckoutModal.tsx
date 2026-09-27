import React, { useState } from 'react';
import { Banknote, QrCode, CreditCard, Building2, X, Check, AlertCircle } from 'lucide-react';
import { CartItem, PaymentMethod } from '../types';
import { formatRupiah } from '../utils/formatters';

interface CheckoutModalProps {
  items: CartItem[];
  subtotal: number;
  discountAmount: number;
  taxAmount: number;
  grandTotal: number;
  onConfirm: (payload: {
    paymentMethod: PaymentMethod;
    amountPaid: number;
    change: number;
    customerName?: string;
    notes?: string;
  }) => void;
  onClose: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  items,
  subtotal,
  discountAmount,
  taxAmount,
  grandTotal,
  onConfirm,
  onClose,
}) => {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [amountPaidInput, setAmountPaidInput] = useState<string>(grandTotal.toString());
  const [customerName, setCustomerName] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [isQrisVerified, setIsQrisVerified] = useState<boolean>(false);

  const amountPaidNumber = parseFloat(amountPaidInput) || 0;
  const change = Math.max(0, amountPaidNumber - grandTotal);
  const isInsufficient = paymentMethod === 'cash' && amountPaidNumber < grandTotal;

  const quickNominals = [
    grandTotal, // Uang Pas
    Math.ceil(grandTotal / 10000) * 10000,
    Math.ceil(grandTotal / 20000) * 20000,
    Math.ceil(grandTotal / 50000) * 50000,
    Math.ceil(grandTotal / 100000) * 100000,
  ].filter((v, i, a) => a.indexOf(v) === i && v >= grandTotal);

  const handleSelectQuickAmount = (val: number) => {
    setAmountPaidInput(val.toString());
  };

  const handleSelectMethod = (m: PaymentMethod) => {
    setPaymentMethod(m);
    if (m !== 'cash') {
      setAmountPaidInput(grandTotal.toString());
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isInsufficient) return;

    onConfirm({
      paymentMethod,
      amountPaid: paymentMethod === 'cash' ? amountPaidNumber : grandTotal,
      change: paymentMethod === 'cash' ? change : 0,
      customerName: customerName.trim() || undefined,
      notes: notes.trim() || undefined,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-950/40">
          <div>
            <h3 className="text-sm font-semibold text-slate-100">Pembayaran Kasir</h3>
            <span className="text-xs text-slate-400">Pilih metode pembayaran & konfirmasi</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-5 flex-1">
          {/* Total display box */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-center">
            <span className="text-xs text-slate-400 font-medium">TOTAL TAGIHAN</span>
            <div className="text-3xl font-bold font-mono text-amber-400 mt-0.5 tracking-tight">
              {formatRupiah(grandTotal)}
            </div>
            <div className="flex items-center justify-center gap-3 text-[11px] text-slate-500 mt-1">
              <span>{items.length} Macam Produk</span>
              <span>·</span>
              <span>Subtotal: {formatRupiah(subtotal)}</span>
              {discountAmount > 0 && (
                <>
                  <span>·</span>
                  <span className="text-rose-400">Diskon: -{formatRupiah(discountAmount)}</span>
                </>
              )}
            </div>
          </div>

          {/* Payment Method Selector */}
          <div>
            <label className="text-xs font-medium text-slate-300 block mb-2">Metode Pembayaran</label>
            <div className="grid grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => handleSelectMethod('cash')}
                className={`p-2.5 rounded-xl border text-center transition-all ${
                  paymentMethod === 'cash'
                    ? 'bg-amber-500/15 border-amber-500/50 text-amber-300'
                    : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <Banknote className="w-4 h-4 mx-auto mb-1" />
                <span className="text-[11px] font-medium block">Tunai</span>
              </button>

              <button
                type="button"
                onClick={() => handleSelectMethod('qris')}
                className={`p-2.5 rounded-xl border text-center transition-all ${
                  paymentMethod === 'qris'
                    ? 'bg-amber-500/15 border-amber-500/50 text-amber-300'
                    : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <QrCode className="w-4 h-4 mx-auto mb-1" />
                <span className="text-[11px] font-medium block">QRIS</span>
              </button>

              <button
                type="button"
                onClick={() => handleSelectMethod('transfer')}
                className={`p-2.5 rounded-xl border text-center transition-all ${
                  paymentMethod === 'transfer'
                    ? 'bg-amber-500/15 border-amber-500/50 text-amber-300'
                    : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <Building2 className="w-4 h-4 mx-auto mb-1" />
                <span className="text-[11px] font-medium block">Transfer</span>
              </button>

              <button
                type="button"
                onClick={() => handleSelectMethod('debit')}
                className={`p-2.5 rounded-xl border text-center transition-all ${
                  paymentMethod === 'debit'
                    ? 'bg-amber-500/15 border-amber-500/50 text-amber-300'
                    : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <CreditCard className="w-4 h-4 mx-auto mb-1" />
                <span className="text-[11px] font-medium block">Debit/EDC</span>
              </button>
            </div>
          </div>

          {/* If Cash: Nominal input & Quick Buttons */}
          {paymentMethod === 'cash' && (
            <div className="space-y-3 p-3.5 rounded-xl bg-slate-950/40 border border-slate-800/80">
              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">
                  Uang Diterima (Rp)
                </label>
                <input
                  type="number"
                  value={amountPaidInput}
                  onChange={(e) => setAmountPaidInput(e.target.value)}
                  placeholder="0"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-base font-mono font-bold text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Quick Nominal Chips */}
              <div className="flex flex-wrap gap-1.5">
                {quickNominals.map((nom, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleSelectQuickAmount(nom)}
                    className="px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-slate-100 text-[11px] font-mono transition-colors"
                  >
                    {nom === grandTotal ? 'Uang Pas' : formatRupiah(nom)}
                  </button>
                ))}
              </div>

              {/* Kembalian / Kurang Readout */}
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-xs text-slate-400">Kembalian:</span>
                <span
                  className={`text-base font-bold font-mono ${
                    isInsufficient ? 'text-rose-400' : 'text-emerald-400'
                  }`}
                >
                  {isInsufficient
                    ? `Kurang ${formatRupiah(grandTotal - amountPaidNumber)}`
                    : formatRupiah(change)}
                </span>
              </div>
            </div>
          )}

          {/* If QRIS: QR Code Simulation */}
          {paymentMethod === 'qris' && (
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-center space-y-3">
              <div className="inline-block p-3 bg-white rounded-xl shadow-md">
                {/* SVG mock QR Code */}
                <svg className="w-36 h-36" viewBox="0 0 100 100" fill="currentColor">
                  <path d="M0 0h30v30H0zM5 5h20v20H5zM10 10h10v10H10zM70 0h30v30H70zM75 5h20v20H75zM80 10h10v10H80zM0 70h30v30H0zM5 75h20v20H5zM10 80h10v10H10zM40 10h10v20H40zM55 5h10v15H55zM40 40h20v10H40zM70 40h10v30H70zM85 45h15v10H85zM40 60h10v40H40zM60 60h10v20H60zM80 80h20v20H80zM20 40h10v15H20z" />
                </svg>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-200">QRIS Standar Pembayaran Nasional</p>
                <p className="text-[11px] text-slate-400">
                  Scan melalui GoPay, OVO, Dana, BCA, Mandiri, dll.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsQrisVerified(true)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                  isQrisVerified
                    ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {isQrisVerified ? '✓ Notifikasi Bayar Diterima' : 'Simulasi Cek Status Bayar'}
              </button>
            </div>
          )}

          {/* Optional Customer Name & Note */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Nama Pelanggan (Opsional)</label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Contoh: Bpk. Budi / Meja 04"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Catatan Transaksi</label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Contoh: Tanpa sedotan, bungkus"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isInsufficient}
              className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-sm transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>Selesaikan Transaksi & Buat Struk</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
