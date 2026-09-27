import React, { useState } from 'react';
import { Search, Receipt, Eye, Printer, Calendar, Banknote, QrCode } from 'lucide-react';
import { Transaction } from '../types';
import { formatRupiah, formatDateTime } from '../utils/formatters';

interface TransactionsViewProps {
  transactions: Transaction[];
  onViewReceipt: (transaction: Transaction) => void;
}

export const TransactionsView: React.FC<TransactionsViewProps> = ({ transactions, onViewReceipt }) => {
  const [search, setSearch] = useState<string>('');
  const [methodFilter, setMethodFilter] = useState<string>('all');

  const filtered = transactions.filter((t) => {
    const matchSearch =
      !search ||
      t.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
      (t.customerName && t.customerName.toLowerCase().includes(search.toLowerCase()));

    const matchMethod = methodFilter === 'all' || t.paymentMethod === methodFilter;

    return matchSearch && matchMethod;
  });

  const totalRevenue = transactions.reduce((sum, t) => sum + t.grandTotal, 0);

  return (
    <div className="bg-slate-900/70 border border-slate-800/80 rounded-2xl p-5 space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
        <div>
          <h2 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
            <span>Riwayat Transaksi & Struk Kasir</span>
            <span className="text-xs text-amber-400 font-mono">({transactions.length} Transaksi)</span>
          </h2>
          <p className="text-xs text-slate-400">
            Daftar seluruh penjualan yang tercatat, cetak ulang struk, atau audit pembayaran.
          </p>
        </div>

        <div className="text-right">
          <span className="text-[11px] text-slate-400 block">Total Omset Tercatat</span>
          <span className="text-base font-bold font-mono text-amber-400">
            {formatRupiah(totalRevenue)}
          </span>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nomor invoice / pelanggan..."
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={methodFilter}
            onChange={(e) => setMethodFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-amber-500"
          >
            <option value="all">Semua Metode</option>
            <option value="cash">Tunai</option>
            <option value="qris">QRIS</option>
            <option value="transfer">Transfer</option>
            <option value="debit">Debit/EDC</option>
          </select>
        </div>
      </div>

      {/* Transaction List */}
      <div className="overflow-x-auto rounded-xl border border-slate-800/80 bg-slate-950/40">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-900/80 text-slate-400 font-medium border-b border-slate-800">
            <tr>
              <th className="py-2.5 px-3">No. Invoice</th>
              <th className="py-2.5 px-3">Waktu Transaksi</th>
              <th className="py-2.5 px-3">Pelanggan</th>
              <th className="py-2.5 px-3">Ringkasan Item</th>
              <th className="py-2.5 px-3">Metode</th>
              <th className="py-2.5 px-3 text-right">Total Tagihan</th>
              <th className="py-2.5 px-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-slate-500">
                  Belum ada riwayat transaksi.
                </td>
              </tr>
            ) : (
              filtered.map((tx) => {
                const totalItemsCount = tx.items.reduce((s, i) => s + i.quantity, 0);
                return (
                  <tr key={tx.id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="py-2.5 px-3 font-mono font-medium text-amber-300">
                      {tx.invoiceNumber}
                    </td>
                    <td className="py-2.5 px-3 text-slate-400">
                      {formatDateTime(tx.createdAt)}
                    </td>
                    <td className="py-2.5 px-3 text-slate-300">
                      {tx.customerName || 'Umum'}
                    </td>
                    <td className="py-2.5 px-3 text-slate-400 max-w-xs truncate">
                      {totalItemsCount} item ({tx.items.map((i) => `${i.product.name} (${i.quantity})`).join(', ')})
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="uppercase text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                        {tx.paymentMethod}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-100">
                      {formatRupiah(tx.grandTotal)}
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <button
                        type="button"
                        onClick={() => onViewReceipt(tx)}
                        className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-medium inline-flex items-center gap-1 transition-colors"
                      >
                        <Receipt className="w-3.5 h-3.5" />
                        <span>Lihat Struk</span>
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
