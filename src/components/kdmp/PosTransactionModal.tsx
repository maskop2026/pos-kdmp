import React, { useState } from 'react';
import { X, ShoppingCart, Plus, Minus, CheckCircle, CreditCard, Banknote, QrCode } from 'lucide-react';
import { RecentTransactionItem } from '../../types/kdmp';

interface PosTransactionModalProps {
  onClose: () => void;
  onSubmitTransaction: (tx: RecentTransactionItem) => void;
}

const SAMPLE_POS_ITEMS = [
  { id: 'p1', name: 'Kopi Hitam KDMP', price: 10000 },
  { id: 'p2', name: 'Roti Bakar Keju', price: 15000 },
  { id: 'p3', name: 'Es Teh Manis', price: 5000 },
  { id: 'p4', name: 'Mie Goreng Spesial', price: 15000 },
  { id: 'p5', name: 'Beras Premium 5kg', price: 68000 },
  { id: 'p6', name: 'Minyak Goreng 2L', price: 34000 },
];

export const PosTransactionModal: React.FC<PosTransactionModalProps> = ({
  onClose,
  onSubmitTransaction,
}) => {
  const [customer, setCustomer] = useState('');
  const [selectedItems, setSelectedItems] = useState<{ [id: string]: number }>({
    p1: 2,
    p2: 1,
  });
  const [paymentMethod, setPaymentMethod] = useState<'Tunai' | 'QRIS' | 'Debit' | 'Transfer Bank'>('Tunai');

  const handleQty = (id: string, delta: number) => {
    setSelectedItems((prev) => {
      const current = prev[id] || 0;
      const next = current + delta;
      if (next <= 0) {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      }
      return { ...prev, [id]: next };
    });
  };

  const total = Object.entries(selectedItems).reduce((sum, [id, qty]) => {
    const item = SAMPLE_POS_ITEMS.find((p) => p.id === id);
    return sum + (item ? item.price * qty : 0);
  }, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (total === 0) return;

    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')} WIB`;
    const invNumber = `INV-${Math.floor(100 + Math.random() * 900)}`;

    const newTx: RecentTransactionItem = {
      id: `tx-${Date.now()}`,
      invoice: invNumber,
      customer: customer.trim() || 'Pelanggan Walk-in',
      total,
      status: 'Lunas',
      time: timeStr,
      paymentMethod,
    };

    onSubmitTransaction(newTx);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-xl w-full overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-4 bg-[#D32F2F] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            <h3 className="text-sm font-bold">Input Transaksi Kasir (POS KDMP)</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-full text-white/80 hover:text-white hover:bg-black/20"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 flex-1">
          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1">
              Nama Customer
            </label>
            <input
              type="text"
              value={customer}
              onChange={(e) => setCustomer(e.target.value)}
              placeholder="Contoh: Budi Santoso / Pelanggan Umum"
              className="w-full text-xs px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:outline-none focus:border-[#D32F2F]"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-gray-700 block mb-2">
              Pilih Item Transaksi
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {SAMPLE_POS_ITEMS.map((item) => {
                const qty = selectedItems[item.id] || 0;
                return (
                  <div
                    key={item.id}
                    className={`p-2.5 rounded-lg border text-xs flex items-center justify-between transition-colors ${
                      qty > 0 ? 'bg-red-50/70 border-[#D32F2F]' : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div>
                      <p className="font-bold text-gray-800">{item.name}</p>
                      <span className="text-[11px] font-mono text-gray-500">
                        Rp {item.price.toLocaleString('id-ID')}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 bg-white border border-gray-200 rounded p-1">
                      <button
                        type="button"
                        onClick={() => handleQty(item.id, -1)}
                        className="text-gray-500 hover:text-red-600 p-0.5"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-5 text-center font-bold">{qty}</span>
                      <button
                        type="button"
                        onClick={() => handleQty(item.id, 1)}
                        className="text-gray-500 hover:text-green-600 p-0.5"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1.5">
              Metode Pembayaran
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              {[
                { id: 'Tunai', icon: Banknote },
                { id: 'QRIS', icon: QrCode },
                { id: 'Debit', icon: CreditCard },
                { id: 'Transfer Bank', icon: CreditCard },
              ].map((m) => {
                const Icon = m.icon;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setPaymentMethod(m.id as any)}
                    className={`p-2 rounded-lg border flex flex-col items-center gap-1 transition-all ${
                      paymentMethod === m.id
                        ? 'bg-red-50 border-[#D32F2F] text-[#D32F2F] font-bold'
                        : 'bg-gray-50 border-gray-200 text-gray-600'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-[11px]">{m.id}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="p-3 bg-gray-100 rounded-xl flex items-center justify-between">
            <span className="text-xs font-bold text-gray-600">Total Transaksi:</span>
            <span className="text-lg font-extrabold font-mono text-[#D32F2F]">
              Rp {total.toLocaleString('id-ID')}
            </span>
          </div>

          <button
            type="submit"
            disabled={total === 0}
            className="w-full py-2.5 bg-[#D32F2F] hover:bg-[#B71C1C] disabled:bg-gray-300 text-white font-bold rounded-xl text-xs shadow transition-colors flex items-center justify-center gap-2"
          >
            <CheckCircle className="w-4 h-4" />
            <span>Selesaikan & Simpan Transaksi</span>
          </button>
        </form>
      </div>
    </div>
  );
};
