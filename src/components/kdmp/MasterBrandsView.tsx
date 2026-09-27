import React, { useState, useMemo } from 'react';
import { Copyright, Plus, Search, Edit2, Trash2, X, PlusCircle, CheckCircle, ChevronLeft, ChevronRight, Info } from 'lucide-react';
import { BrandItem, CategoryStatus } from '../../types/kdmp';
import { INITIAL_BRANDS } from '../../data/kdmpData';

interface MasterBrandsViewProps {
  onShowToast: (type: 'success' | 'info' | 'warning', title: string, message: string) => void;
}

export const MasterBrandsView: React.FC<MasterBrandsViewProps> = ({ onShowToast }) => {
  const [brands, setBrands] = useState<BrandItem[]>(INITIAL_BRANDS);
  const [search, setSearch] = useState('');
  const [pageSize, setPageSize] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<BrandItem | null>(null);
  const [formName, setFormName] = useState('');
  const [formStatus, setFormStatus] = useState<CategoryStatus>('Aktif');

  // Filter & Search
  const filteredBrands = useMemo(() => {
    return brands.filter(
      (b) =>
        b.name.toLowerCase().includes(search.toLowerCase()) ||
        b.code.toLowerCase().includes(search.toLowerCase())
    );
  }, [brands, search]);

  // Pagination calculation
  const totalItems = filteredBrands.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  const currentData = filteredBrands.slice(startIndex, endIndex);

  // Open modal for Create
  const handleOpenCreate = () => {
    setEditingItem(null);
    setFormName('');
    setFormStatus('Aktif');
    setIsModalOpen(true);
  };

  // Open modal for Edit
  const handleOpenEdit = (item: BrandItem) => {
    setEditingItem(item);
    setFormName(item.name);
    setFormStatus(item.status);
    setIsModalOpen(true);
  };

  // Delete
  const handleDelete = (id: string, name: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus brand "${name}"?`)) {
      setBrands((prev) => prev.filter((b) => b.id !== id));
      onShowToast('info', 'Brand Dihapus', `Brand "${name}" berhasil dihapus.`);
    }
  };

  // Save (Create or Update)
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    if (editingItem) {
      // Update
      setBrands((prev) =>
        prev.map((b) =>
          b.id === editingItem.id ? { ...b, name: formName.trim(), status: formStatus } : b
        )
      );
      onShowToast('success', 'Perubahan Disimpan', `Brand "${formName}" berhasil diperbarui.`);
    } else {
      // Create with automatic code generation (Format: BRD-01)
      const nextNum = brands.length + 1;
      const autoCode = `BRD-${String(nextNum).padStart(2, '0')}`;
      const newBrand: BrandItem = {
        id: `brd-${Date.now()}`,
        code: autoCode,
        name: formName.trim(),
        status: formStatus,
        productCount: 0,
      };
      setBrands((prev) => [...prev, newBrand]);
      onShowToast('success', 'Brand Ditambahkan', `Brand "${formName}" (${autoCode}) berhasil dibuat.`);
    }

    setIsModalOpen(false);
  };

  // Badge Status Styling matching KDMP
  const renderStatusBadge = (status: CategoryStatus) => {
    switch (status) {
      case 'Aktif':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            Aktif
          </span>
        );
      case 'Tidak Dikulak':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
            Tidak Dikulak
          </span>
        );
      case 'Discontinue':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-red-50 text-red-700 border border-red-200">
            Discontinue
          </span>
        );
      case 'Non-Aktif':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-gray-100 text-gray-600 border border-gray-200">
            Non-Aktif
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-xl border border-[#E0E0E0] shadow-xs overflow-hidden">
      {/* CARD HEADER KDMP */}
      <div className="p-4 sm:p-5 border-b border-[#E0E0E0] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 flex-1">
          <div className="flex items-center gap-2">
            <Copyright className="w-5 h-5 text-[#D32F2F]" />
            <h5 className="text-base font-bold text-gray-900 tracking-tight">Master Brand</h5>
          </div>

          <div className="relative w-full sm:w-64">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <Search className="w-3.5 h-3.5" />
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Cari brand..."
              className="w-full text-xs pl-8 pr-3 py-1.5 bg-white border border-[#E0E0E0] rounded-lg focus:outline-none focus:border-[#D32F2F] placeholder:text-gray-400"
            />
          </div>
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          className="bg-[#D32F2F] hover:bg-[#B71C1C] text-white px-3.5 py-2 rounded-lg text-xs font-bold shadow-xs flex items-center justify-center gap-1.5 transition-colors self-start sm:self-auto shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Brand</span>
        </button>
      </div>

      {/* CARD BODY */}
      <div className="p-4 sm:p-5 space-y-4">
        <div className="overflow-x-auto border border-gray-100 rounded-lg">
          <table className="w-full text-left text-xs align-middle">
            <thead className="bg-[#f8f9fa] border-b border-[#E0E0E0] text-[10.5px] font-bold uppercase tracking-wider text-gray-500">
              <tr>
                <th className="py-2.5 px-3 w-12 text-center">No</th>
                <th className="py-2.5 px-3 w-28">Kode</th>
                <th className="py-2.5 px-3">Nama Brand</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {currentData.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-400 text-xs">
                    {search ? 'Tidak ada brand yang cocok dengan pencarian.' : 'Belum ada data brand.'}
                  </td>
                </tr>
              ) : (
                currentData.map((brand, idx) => (
                  <tr key={brand.id} className="hover:bg-gray-50/70 transition-colors">
                    <td className="py-3 px-3 text-center text-gray-500 font-mono">
                      {startIndex + idx + 1}
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-gray-800">
                      {brand.code}
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-bold text-gray-900 block">{brand.name}</span>
                      {brand.productCount !== undefined && (
                        <span className="text-[10px] text-gray-400">
                          {brand.productCount} Produk terdaftar
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3">
                      {renderStatusBadge(brand.status)}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <div className="inline-flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(brand)}
                          className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                          title="Edit Brand"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(brand.id, brand.name)}
                          className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                          title="Hapus Brand"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION & LIMIT MATCHING TEMPLATE */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-gray-500 text-[11px]">
              Menampilkan {totalItems === 0 ? 0 : startIndex + 1}-{endIndex} dari {totalItems} data
            </span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="text-xs bg-white border border-[#E0E0E0] rounded-md px-2 py-1 focus:outline-none focus:border-[#D32F2F]"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="px-2.5 py-1 text-xs border border-gray-200 rounded-md bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
            >
              <ChevronLeft className="w-3 h-3" />
              <span>Sebelumnya</span>
            </button>

            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setCurrentPage(i + 1)}
                className={`w-7 h-7 text-xs font-semibold rounded-md transition-colors ${
                  currentPage === i + 1
                    ? 'bg-[#D32F2F] text-white'
                    : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              type="button"
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="px-2.5 py-1 text-xs border border-gray-200 rounded-md bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
            >
              <span>Berikutnya</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* ===== MODAL TAMBAH/EDIT BRAND (REPLACES Bootstrap #modalSimple) ===== */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl">
            {/* Header */}
            <div className="p-4 border-b border-[#E0E0E0] flex items-center justify-between bg-white">
              <h5 className="font-bold text-sm text-gray-900 flex items-center gap-2">
                <PlusCircle className="w-4 h-4 text-[#D32F2F]" />
                <span>{editingItem ? 'Edit Brand' : 'Tambah Brand'}</span>
              </h5>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSave}>
              <div className="p-5 space-y-3.5">
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">
                    Nama Brand
                  </label>
                  <input
                    type="text"
                    required
                    autoFocus
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="Contoh: Indomie"
                    className="w-full text-xs px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:outline-none focus:border-[#D32F2F]"
                  />
                </div>

                {/* Dropdown Status */}
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">
                    Status
                  </label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as CategoryStatus)}
                    className="w-full text-xs px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:outline-none focus:border-[#D32F2F]"
                  >
                    <option value="Aktif">Aktif</option>
                    <option value="Tidak Dikulak">Tidak Dikulak</option>
                    <option value="Discontinue">Discontinue (Tidak Diproduksi)</option>
                    <option value="Non-Aktif">Non-Aktif (Sembunyikan)</option>
                  </select>
                </div>

                <div className="flex items-start gap-1.5 text-gray-400 text-[11px] pt-1">
                  <Info className="w-3.5 h-3.5 text-gray-400 shrink-0 mt-0.5" />
                  <span>
                    {editingItem
                      ? `Kode Brand saat ini: ${editingItem.code}`
                      : 'Kode akan dibuat otomatis oleh sistem (Format: BRD-01)'}
                  </span>
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-[#E0E0E0] bg-gray-50 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 text-xs text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-bold text-white bg-[#D32F2F] hover:bg-[#B71C1C] rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Simpan</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
