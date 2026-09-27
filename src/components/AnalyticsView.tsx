import React from 'react';
import { TrendingUp, DollarSign, ShoppingBag, Award, PieChart } from 'lucide-react';
import { Transaction, Product } from '../types';
import { formatRupiah } from '../utils/formatters';

interface AnalyticsViewProps {
  transactions: Transaction[];
  products: Product[];
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ transactions, products }) => {
  // Compute analytics
  const totalRevenue = transactions.reduce((sum, t) => sum + t.grandTotal, 0);

  // Compute total COGS (HPP)
  const totalCost = transactions.reduce((sum, t) => {
    const txCost = t.items.reduce((s, i) => s + (i.product.costPrice || 0) * i.quantity, 0);
    return sum + txCost;
  }, 0);

  const estimatedGrossProfit = Math.max(0, totalRevenue - totalCost);
  const avgBasket = transactions.length > 0 ? Math.round(totalRevenue / transactions.length) : 0;

  // Item sales map
  const itemCounts: Record<string, { name: string; qty: number; revenue: number }> = {};
  const categoryRevenue: Record<string, number> = {};

  transactions.forEach((tx) => {
    tx.items.forEach((item) => {
      const pid = item.product.id;
      const sub = item.product.sellingPrice * item.quantity;
      if (!itemCounts[pid]) {
        itemCounts[pid] = { name: item.product.name, qty: 0, revenue: 0 };
      }
      itemCounts[pid].qty += item.quantity;
      itemCounts[pid].revenue += sub;

      const cat = item.product.category || 'Lainnya';
      categoryRevenue[cat] = (categoryRevenue[cat] || 0) + sub;
    });
  });

  const topProducts = Object.values(itemCounts)
    .sort((a, b) => b.qty - a.qty)
    .slice(0, 5);

  return (
    <div className="space-y-5">
      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Omset */}
        <div className="bg-slate-900/70 border border-slate-800/80 rounded-2xl p-4">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Total Omset Penjualan</span>
            <DollarSign className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-xl font-bold font-mono text-slate-100">
            {formatRupiah(totalRevenue)}
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">Dari {transactions.length} transaksi</span>
        </div>

        {/* Laba Kotor */}
        <div className="bg-slate-900/70 border border-slate-800/80 rounded-2xl p-4">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Estimasi Laba Kotor</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl font-bold font-mono text-emerald-400">
            {formatRupiah(estimatedGrossProfit)}
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">Margin keuntungan bersih kasir</span>
        </div>

        {/* Total Transaksi */}
        <div className="bg-slate-900/70 border border-slate-800/80 rounded-2xl p-4">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Total Transaksi</span>
            <ShoppingBag className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-xl font-bold font-mono text-slate-100">
            {transactions.length}
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">Transaksi berhasil diselesaikan</span>
        </div>

        {/* Rata-rata Keranjang */}
        <div className="bg-slate-900/70 border border-slate-800/80 rounded-2xl p-4">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Rata-rata Pembelian</span>
            <PieChart className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-xl font-bold font-mono text-slate-100">
            {formatRupiah(avgBasket)}
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">Nilai belanja per pelanggan</span>
        </div>
      </div>

      {/* Two Column Section: Top Products & Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Top 5 Products */}
        <div className="lg:col-span-7 bg-slate-900/70 border border-slate-800/80 rounded-2xl p-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-xs font-semibold text-slate-100 flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" />
              <span>5 Produk Terlaris</span>
            </h3>
            <span className="text-[11px] text-slate-500">Berdasarkan kuantitas terjual</span>
          </div>

          <div className="mt-4 space-y-3">
            {topProducts.length === 0 ? (
              <p className="text-xs text-slate-500 py-6 text-center">
                Belum ada transaksi untuk menganalisis produk terlaris.
              </p>
            ) : (
              topProducts.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/40 border border-slate-800/60"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-amber-500/10 text-amber-400 font-mono text-xs font-bold flex items-center justify-center">
                      0{idx + 1}
                    </span>
                    <div>
                      <h4 className="text-xs font-medium text-slate-200">{item.name}</h4>
                      <span className="text-[11px] text-slate-500">Terjual {item.qty} item</span>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-semibold text-amber-300">
                    {formatRupiah(item.revenue)}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="lg:col-span-5 bg-slate-900/70 border border-slate-800/80 rounded-2xl p-5">
          <div className="pb-3 border-b border-slate-800">
            <h3 className="text-xs font-semibold text-slate-100">Kontribusi Penjualan Kategori</h3>
          </div>

          <div className="mt-4 space-y-3">
            {Object.keys(categoryRevenue).length === 0 ? (
              <p className="text-xs text-slate-500 py-6 text-center">
                Belum ada data penjualan kategori.
              </p>
            ) : (
              Object.entries(categoryRevenue).map(([cat, rev]) => {
                const pct = totalRevenue > 0 ? Math.round((rev / totalRevenue) * 100) : 0;
                return (
                  <div key={cat} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-300 font-medium">{cat}</span>
                      <span className="text-slate-400 font-mono">
                        {formatRupiah(rev)} ({pct}%)
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-500 rounded-full transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
