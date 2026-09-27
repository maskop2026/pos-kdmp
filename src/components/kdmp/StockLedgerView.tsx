import React from 'react';
import { ClipboardList, ArrowDownLeft, ArrowUpRight, RefreshCw } from 'lucide-react';

export const StockLedgerView: React.FC = () => {
  const ledgerData = [
    { id: '1', date: '2024-10-24 09:30', item: 'Kopi Hitam', type: 'Masuk', qty: '+50', ref: 'PO-2024-089', pic: 'Admin' },
    { id: '2', date: '2024-10-24 10:45', item: 'Kopi Hitam', type: 'Keluar', qty: '-2', ref: 'INV-001', pic: 'Kasir 1' },
    { id: '3', date: '2024-10-24 11:00', item: 'Beras Ramos 5kg', type: 'Masuk', qty: '+20', ref: 'PO-2024-090', pic: 'Admin' },
    { id: '4', date: '2024-10-24 11:15', item: 'Roti Bakar', type: 'Keluar', qty: '-1', ref: 'INV-002', pic: 'Kasir 1' },
    { id: '5', date: '2024-10-24 12:05', item: 'Minyak Goreng 2L', type: 'Keluar', qty: '-4', ref: 'INV-004', pic: 'Kasir 2' },
  ];

  return (
    <div className="bg-white rounded-xl border border-[#E0E0E0] p-5 shadow-xs space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h5 className="text-sm font-bold text-gray-800 flex items-center gap-2">
            <ClipboardList className="w-4 h-4 text-[#D32F2F]" />
            Buku Mutasi Stok (Stok Ledger)
          </h5>
          <p className="text-[11px] text-gray-400">
            Pencatatan real-time arus masuk dan keluar barang gudang & outlet
          </p>
        </div>

        <button
          type="button"
          onClick={() => alert('Data stok diperbarui!')}
          className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-lg flex items-center gap-1.5"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Mutasi</span>
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-[#E0E0E0] text-[10.5px] font-bold uppercase tracking-wider text-gray-400 bg-gray-50">
              <th className="py-2.5 px-3">Waktu Mutasi</th>
              <th className="py-2.5 px-3">Nama Produk</th>
              <th className="py-2.5 px-3">Tipe</th>
              <th className="py-2.5 px-3">Kuantitas</th>
              <th className="py-2.5 px-3">Referensi Dokumen</th>
              <th className="py-2.5 px-3">Petugas</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 font-medium">
            {ledgerData.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50/80">
                <td className="py-3 px-3 text-gray-500 font-mono text-[11px]">{row.date}</td>
                <td className="py-3 px-3 font-bold text-gray-900">{row.item}</td>
                <td className="py-3 px-3">
                  {row.type === 'Masuk' ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      <ArrowDownLeft className="w-3 h-3 text-emerald-600" /> Masuk
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                      <ArrowUpRight className="w-3 h-3 text-amber-600" /> Keluar
                    </span>
                  )}
                </td>
                <td className="py-3 px-3 font-mono font-bold">{row.qty} unit</td>
                <td className="py-3 px-3 font-mono text-gray-600">{row.ref}</td>
                <td className="py-3 px-3 text-gray-600">{row.pic}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
