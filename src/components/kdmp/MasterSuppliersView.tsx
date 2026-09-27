import React, { useState, useMemo } from 'react';
import { Truck, Plus, Search, Edit2, Trash2, X, PlusCircle, CheckCircle, ChevronLeft, ChevronRight, Info, Phone, MapPin, Building2 } from 'lucide-react';
import { SupplierItem, TaxStatus, CategoryStatus } from '../../types/kdmp';
import { INITIAL_SUPPLIERS } from '../../data/kdmpData';

interface MasterSuppliersViewProps {
  onShowToast: (type: 'success' | 'info' | 'warning', title: string, message: string) => void;
}

export const MasterSuppliersView: React.FC<MasterSuppliersViewProps> = ({ onShowToast }) => {
  const [suppliers, setSuppliers] = useState<SupplierItem[]>(INITIAL_SUPPLIERS);
  const [search, setSearch] = useState('');
  const [pageSize, setPageSize] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<SupplierItem | null>(null);

  // Form fields
  const [formName, setFormName] = useState('');
  const [formContactPerson, setFormContactPerson] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formTaxStatus, setFormTaxStatus] = useState<TaxStatus>('Non-PPN');
  const [formAddress, setFormAddress] = useState('');
  const [formStatus, setFormStatus] = useState<CategoryStatus>('Aktif');

  // Filter & Search
  const filteredSuppliers = useMemo(() => {
    return suppliers.filter((s) => {
      const q = search.toLowerCase();
      return (
        s.name.toLowerCase().includes(q) ||
        s.code.toLowerCase().includes(q) ||
        s.contactPerson.toLowerCase().includes(q) ||
        s.phone.toLowerCase().includes(q) ||
        s.address.toLowerCase().includes(q)
      );
    });
  }, [suppliers, search]);

  // Pagination calculation
  const totalItems = filteredSuppliers.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  const currentData = filteredSuppliers.slice(startIndex, endIndex);

  // Open modal for Create
  const handleOpenCreate = () => {
    setEditingItem(null);
    setFormName('');
    setFormContactPerson('');
    setFormPhone('');
    setFormTaxStatus('Non-PPN');
    setFormAddress('');
    setFormStatus('Aktif');
    setIsModalOpen(true);
  };

  // Open modal for Edit
  const handleOpenEdit = (item: SupplierItem) => {
    setEditingItem(item);
    setFormName(item.name);
    setFormContactPerson(item.contactPerson);
    setFormPhone(item.phone);
    setFormTaxStatus(item.taxStatus);
    setFormAddress(item.address);
    setFormStatus(item.status);
    setIsModalOpen(true);
  };

  // Delete
  const handleDelete = (id: string, name: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus supplier "${name}"?`)) {
      setSuppliers((prev) => prev.filter((s) => s.id !== id));
      onShowToast('info', 'Supplier Dihapus', `Supplier "${name}" berhasil dihapus.`);
    }
  };

  // Save (Create or Update)
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    if (editingItem) {
      // Update
      setSuppliers((prev) =>
        prev.map((s) =>
          s.id === editingItem.id
            ? {
                ...s,
                name: formName.trim(),
                contactPerson: formContactPerson.trim(),
                phone: formPhone.trim(),
                taxStatus: formTaxStatus,
                address: formAddress.trim(),
                status: formStatus,
              }
            : s
        )
      );
      onShowToast('success', 'Perubahan Disimpan', `Supplier "${formName}" berhasil diperbarui.`);
    } else {
      // Create with automatic code generation (Format: SUP-01)
      const nextNum = suppliers.length + 1;
      const autoCode = `SUP-${String(nextNum).padStart(2, '0')}`;
      const newSup: SupplierItem = {
        id: `sup-${Date.now()}`,
        code: autoCode,
        name: formName.trim(),
        contactPerson: formContactPerson.trim(),
        taxStatus: formTaxStatus,
        phone: formPhone.trim(),
        address: formAddress.trim(),
        status: formStatus,
      };
      setSuppliers((prev) => [...prev, newSup]);
      onShowToast('success', 'Supplier Ditambahkan', `Supplier "${formName}" (${autoCode}) berhasil dibuat.`);
    }

    setIsModalOpen(false);
  };

  // Badge Tax
  const renderTaxBadge = (tax: TaxStatus) => {
    switch (tax) {
      case 'PPN Include':
        return (
          <span className="px-2 py-0.5 rounded text-[10.5px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
            PPN Include
          </span>
        );
      case 'PPN Exclude':
        return (
          <span className="px-2 py-0.5 rounded text-[10.5px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
            PPN Exclude
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded text-[10.5px] font-bold bg-gray-100 text-gray-600 border border-gray-200">
            Non-PPN
          </span>
        );
    }
  };

  // Badge Status
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
            <Truck className="w-5 h-5 text-[#D32F2F]" />
            <h5 className="text-base font-bold text-gray-900 tracking-tight">Master Supplier (External)</h5>
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
              placeholder="Cari supplier..."
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
          <span>Tambah Supplier</span>
        </button>
      </div>

      {/* CARD BODY */}
      <div className="p-4 sm:p-5 space-y-4">
        <div className="overflow-x-auto border border-gray-100 rounded-lg">
          <table className="w-full text-left text-xs align-middle">
            <thead className="bg-[#f8f9fa] border-b border-[#E0E0E0] text-[10.5px] font-bold uppercase tracking-wider text-gray-500">
              <tr>
                <th className="py-2.5 px-3 w-12 text-center">No</th>
                <th className="py-2.5 px-3 w-24">Kode</th>
                <th className="py-2.5 px-3">Nama Supplier</th>
                <th className="py-2.5 px-3">Contact Person</th>
                <th className="py-2.5 px-3">Tipe PPN</th>
                <th className="py-2.5 px-3">No Telp</th>
                <th className="py-2.5 px-3">Alamat</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {currentData.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-gray-400 text-xs">
                    {search ? 'Tidak ada supplier yang cocok dengan pencarian.' : 'Belum ada data supplier.'}
                  </td>
                </tr>
              ) : (
                currentData.map((sup, idx) => (
                  <tr key={sup.id} className="hover:bg-gray-50/70 transition-colors">
                    <td className="py-3 px-3 text-center text-gray-500 font-mono">
                      {startIndex + idx + 1}
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-gray-800">
                      {sup.code}
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-bold text-gray-900 block">{sup.name}</span>
                    </td>
                    <td className="py-3 px-3 text-gray-700">
                      {sup.contactPerson || '-'}
                    </td>
                    <td className="py-3 px-3">
                      {renderTaxBadge(sup.taxStatus)}
                    </td>
                    <td className="py-3 px-3 font-mono text-gray-700">
                      {sup.phone || '-'}
                    </td>
                    <td className="py-3 px-3 text-gray-600 max-w-[200px] truncate" title={sup.address}>
                      {sup.address || '-'}
                    </td>
                    <td className="py-3 px-3">
                      {renderStatusBadge(sup.status)}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <div className="inline-flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(sup)}
                          className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                          title="Edit Supplier"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(sup.id, sup.name)}
                          className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                          title="Hapus Supplier"
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

      {/* ===== MODAL TAMBAH/EDIT PARTNER SUPPLIER (REPLACES Bootstrap #modalPartner) ===== */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl">
            {/* Header */}
            <div className="p-4 border-b border-[#E0E0E0] flex items-center justify-between bg-white">
              <h5 className="font-bold text-sm text-gray-900 flex items-center gap-2">
                <PlusCircle className="w-4 h-4 text-[#D32F2F]" />
                <span>{editingItem ? 'Edit Supplier' : 'Tambah Supplier'}</span>
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
                {/* Row 1: Nama Supplier & Contact Person */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                  <div className="md:col-span-8">
                    <label className="text-xs font-bold text-gray-700 block mb-1">
                      Nama Supplier / Principal <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      autoFocus
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      placeholder="Contoh: PT Indofood CBP Sukses Makmur"
                      className="w-full text-xs px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:outline-none focus:border-[#D32F2F]"
                    />
                  </div>
                  <div className="md:col-span-4">
                    <label className="text-xs font-bold text-gray-700 block mb-1">
                      Contact Person
                    </label>
                    <input
                      type="text"
                      value={formContactPerson}
                      onChange={(e) => setFormContactPerson(e.target.value)}
                      placeholder="Nama Sales"
                      className="w-full text-xs px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:outline-none focus:border-[#D32F2F]"
                    />
                  </div>
                </div>

                {/* Row 2: No Telp, Tipe PPN, Alamat Lengkap */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                  <div className="md:col-span-4">
                    <label className="text-xs font-bold text-gray-700 block mb-1">
                      No Telp
                    </label>
                    <input
                      type="text"
                      value={formPhone}
                      onChange={(e) => setFormPhone(e.target.value)}
                      placeholder="021... atau 0812..."
                      className="w-full text-xs px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:outline-none focus:border-[#D32F2F]"
                    />
                  </div>
                  <div className="md:col-span-3">
                    <label className="text-xs font-bold text-gray-700 block mb-1">
                      Tipe PPN
                    </label>
                    <select
                      value={formTaxStatus}
                      onChange={(e) => setFormTaxStatus(e.target.value as TaxStatus)}
                      className="w-full text-xs px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:outline-none focus:border-[#D32F2F]"
                    >
                      <option value="Non-PPN">Non-PPN</option>
                      <option value="PPN Exclude">PPN Exclude</option>
                      <option value="PPN Include">PPN Include</option>
                    </select>
                  </div>
                  <div className="md:col-span-5">
                    <label className="text-xs font-bold text-gray-700 block mb-1">
                      Alamat Lengkap
                    </label>
                    <input
                      type="text"
                      value={formAddress}
                      onChange={(e) => setFormAddress(e.target.value)}
                      placeholder="Jl. ..."
                      className="w-full text-xs px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:outline-none focus:border-[#D32F2F]"
                    />
                  </div>
                </div>

                {/* Row 3: Dropdown Status */}
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
                      ? `Kode Supplier saat ini: ${editingItem.code}`
                      : 'Kode akan dibuat otomatis oleh sistem (Format: SUP-01)'}
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
