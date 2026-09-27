import React, { useState } from 'react';
import { Box, Plus, Search, Filter, Edit, Trash2 } from 'lucide-react';

interface ProductRow {
  id: string;
  sku: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: 'Tersedia' | 'Menipis' | 'Habis';
}

const INITIAL_PRODUCTS: ProductRow[] = [
  { id: '1', sku: 'PRD-001', name: 'Kopi Hitam Pekalongan', category: 'Minuman', price: 10000, stock: 45, status: 'Tersedia' },
  { id: '2', sku: 'PRD-002', name: 'Roti Bakar Coklat Keju', category: 'Makanan', price: 15000, stock: 25, status: 'Tersedia' },
  { id: '3', sku: 'PRD-003', name: 'Es Teh Manis', category: 'Minuman', price: 5000, stock: 98, status: 'Tersedia' },
  { id: '4', sku: 'PRD-004', name: 'Mie Goreng Spesial', category: 'Makanan', price: 15000, stock: 8, status: 'Menipis' },
  { id: '5', sku: 'PRD-005', name: 'Beras Pandan Wangi 5kg', category: 'Sembako', price: 72000, stock: 15, status: 'Menipis' },
  { id: '6', sku: 'PRD-006', name: 'Minyak Goreng 2L', category: 'Sembako', price: 34000, stock: 20, status: 'Tersedia' },
  { id: '7', sku: 'PRD-007', name: 'Gula Pasir 1kg', category: 'Sembako', price: 17500, stock: 3, status: 'Menipis' },
  { id: '8', sku: 'PRD-008', name: 'Telur Ayam 1kg', category: 'Sembako', price: 29000, stock: 0, status: 'Habis' },
];

interface MasterProductsViewProps {
  onAddProduct: () => void;
}

export const MasterProductsView: React.FC<MasterProductsViewProps> = ({ onAddProduct }) => {
  const [products, setProducts] = useState<ProductRow[]>(INITIAL_PRODUCTS);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('Semua');

  const filtered = products.filter((p) => {
    const matchCat = categoryFilter === 'Semua' || p.category === categoryFilter;
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleDelete = (id: string) => {
    if (confirm('Hapus produk ini dari master data?')) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
    }
  };

  return (
    <div className="bg-white rounded-xl border border-[#E0E0E0] p-5 shadow-xs space-y-4">
      {/* Top action header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h5 className="text-sm font-bold text-gray-800 flex items-center gap-2">
            <Box className="w-4 h-4 text-[#D32F2F]" />
            Master Data Produk KDMP
          </h5>
          <p className="text-[11px] text-gray-400">
            Daftar seluruh item barang dan inventaris outlet
          </p>
        </div>

        <button
          type="button"
          onClick={onAddProduct}
          className="px-3.5 py-2 bg-[#D32F2F] hover:bg-[#B71C1C] text-white text-xs font-bold rounded-lg shadow-xs flex items-center gap-1.5 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Produk</span>
        </button>
      </div>

      {/* Filter & Search */}
      <div className="flex flex-col sm:flex-row gap-2.5 items-center justify-between">
        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari SKU atau nama produk..."
            className="w-full text-xs pl-9 pr-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:outline-none focus:border-[#D32F2F]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-gray-500 font-semibold flex items-center gap-1">
            <Filter className="w-3 h-3" /> Kategori:
          </span>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="text-xs bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-[#D32F2F]"
          >
            <option>Semua</option>
            <option>Minuman</option>
            <option>Makanan</option>
            <option>Sembako</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-[#E0E0E0] text-[10.5px] font-bold uppercase tracking-wider text-gray-400 bg-gray-50">
              <th className="py-2.5 px-3">SKU</th>
              <th className="py-2.5 px-3">Nama Produk</th>
              <th className="py-2.5 px-3">Kategori</th>
              <th className="py-2.5 px-3">Harga Jual</th>
              <th className="py-2.5 px-3">Stok</th>
              <th className="py-2.5 px-3">Status</th>
              <th className="py-2.5 px-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 font-medium">
            {filtered.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50/80 transition-colors">
                <td className="py-3 px-3 font-mono font-bold text-gray-700">
                  {item.sku}
                </td>
                <td className="py-3 px-3 text-gray-900 font-bold">
                  {item.name}
                </td>
                <td className="py-3 px-3 text-gray-500">
                  <span className="bg-gray-100 px-2 py-0.5 rounded text-[11px] font-semibold">
                    {item.category}
                  </span>
                </td>
                <td className="py-3 px-3 font-mono font-bold text-gray-800">
                  Rp {item.price.toLocaleString('id-ID')}
                </td>
                <td className="py-3 px-3 font-mono font-bold">
                  {item.stock} unit
                </td>
                <td className="py-3 px-3">
                  {item.status === 'Tersedia' && (
                    <span className="text-[10.5px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                      Tersedia
                    </span>
                  )}
                  {item.status === 'Menipis' && (
                    <span className="text-[10.5px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                      Menipis
                    </span>
                  )}
                  {item.status === 'Habis' && (
                    <span className="text-[10.5px] font-bold text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full">
                      Habis
                    </span>
                  )}
                </td>
                <td className="py-3 px-3 text-right space-x-1">
                  <button
                    type="button"
                    onClick={() => alert(`Edit ${item.name}`)}
                    className="p-1 text-gray-400 hover:text-blue-600 rounded"
                    title="Edit"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(item.id)}
                    className="p-1 text-gray-400 hover:text-red-600 rounded"
                    title="Hapus"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
