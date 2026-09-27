import React from 'react';
import { RecentTransactionItem } from '../../types/kdmp';
import { CheckCircle2, Clock, XCircle, ArrowUpRight } from 'lucide-react';

interface RecentTransactionsProps {
  transactions: RecentTransactionItem[];
  onViewAll?: () => void;
}

export const RecentTransactions: React.FC<RecentTransactionsProps> = ({
  transactions,
  onViewAll,
}) => {
  return (
    <div className="bg-white rounded-xl border border-[#E0E0E0] p-5 shadow-xs h-full flex flex-col justify-between">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h6 className="text-sm font-bold text-gray-800">Penjualan Terbaru</h6>
          <span className="text-[11px] text-gray-400">
            Aktivitas kasir hari ini secara real-time
          </span>
        </div>
        {onViewAll && (
          <button
            type="button"
            onClick={onViewAll}
            className="text-xs text-[#D32F2F] hover:underline font-bold flex items-center gap-1"
          >
            Lihat Semua <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-[#E0E0E0] text-[10.5px] font-bold uppercase tracking-wider text-gray-400">
              <th className="py-2.5 px-3">Invoice</th>
              <th className="py-2.5 px-3">Customer</th>
              <th className="py-2.5 px-3">Metode / Jam</th>
              <th className="py-2.5 px-3">Total</th>
              <th className="py-2.5 px-3 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 font-medium">
            {transactions.map((tx) => (
              <tr key={tx.id} className="hover:bg-gray-50/80 transition-colors">
                <td className="py-3 px-3 font-mono font-bold text-gray-900">
                  {tx.invoice}
                </td>
                <td className="py-3 px-3 text-gray-800 font-semibold">
                  {tx.customer}
                </td>
                <td className="py-3 px-3 text-gray-500 text-[11px]">
                  <span>{tx.paymentMethod}</span>
                  <span className="text-gray-300 mx-1.5">·</span>
                  <span>{tx.time}</span>
                </td>
                <td className="py-3 px-3 font-bold font-mono text-gray-900">
                  Rp {tx.total.toLocaleString('id-ID')}
                </td>
                <td className="py-3 px-3 text-right">
                  {tx.status === 'Lunas' && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      Lunas
                    </span>
                  )}
                  {tx.status === 'Pending' && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                      <Clock className="w-3 h-3 text-amber-600" />
                      Pending
                    </span>
                  )}
                  {tx.status === 'Batal' && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-red-50 text-red-700 border border-red-200">
                      <XCircle className="w-3 h-3 text-red-600" />
                      Batal
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
