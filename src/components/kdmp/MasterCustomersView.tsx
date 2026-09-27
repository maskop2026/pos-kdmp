import React, { useState, useMemo } from 'react';
import { Users, Plus, Search, Edit2, Trash2, X, PlusCircle, CheckCircle, ChevronLeft, ChevronRight, Info, Phone, MapPin, ShieldCheck, ShieldAlert } from 'lucide-react';
import { CustomerItem, CustomerType, CustomerStatus } from '../../types/kdmp';
import { INITIAL_CUSTOMERS } from '../../data/kdmpData';

interface MasterCustomersViewProps {
  onShowToast: (type: 'success' | 'info' | 'warning', title: string, message: string) => void;
}

export const MasterCustomersView: React.FC<MasterCustomersViewProps> = ({ onShowToast }) => {
  const [customers, setCustomers] = useState<CustomerItem[]>(INITIAL_CUSTOMERS);
  const [search, setSearch] = useState('');
  const [pageSize, setPageSize] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<CustomerItem | null>(null);

  // Form Fields
  const [formName, setFormName] = useState('');
  const [formCustomerType, setFormCustomerType] = useState<CustomerType>('Umum');
  const [formPhone, setFormPhone] = useState('');
  const [formAddress, setFormAddress] = useState('');
  const [formStatus, setFormStatus] = useState<CustomerStatus>('Aktif');

  // Filter & Search
  const filteredCustomers = useMemo(() => {
    const q = search.toLowerCase();
    return customers.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.code.toLowerCase().includes(q) ||
        c.phone.toLowerCase().includes(q) ||
        c.address.toLowerCase().includes(q) ||
        c.customerType.toLowerCase().includes(q)
    );
  }, [customers, search]);

  // Pagination calculation
  const totalItems = filteredCustomers.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  const currentData = filteredCustomers.slice(startIndex, endIndex);

  // Open modal for Create
  const handleOpenCreate = () => {
    setEditingItem(null);
    setFormName('');
    setFormCustomerType('Umum');
    setFormPhone('');
    setFormAddress('');
    setFormStatus('Aktif');
    setIsModalOpen(true);
  };

  // Open modal for Edit
  const handleOpenEdit = (item: CustomerItem) => {
    setEditingItem(item);
    setFormName(item.name);
    setFormCustomerType(item.customerType);
    setFormPhone(item.phone);
    setFormAddress(item.address);
    setFormStatus(item.status);
    setIsModalOpen(true);
  };

  // Delete
  const handleDelete = (id: string, name: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus data customer "${name}"?`)) {
      setCustomers((prev) => prev.filter((c) => c.id !== id));
      onShowToast('info', 'Customer Dihapus', `Data customer "${name}" berhasil dihapus.`);
    }
  };

  // Save (Create or Update)
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    if (editingItem) {
      // Update
      setCustomers((prev) =>
        prev.map((c) =>
          c.id === editingItem.id
            ? {
                ...c,
                name: formName.trim(),
                customerType: formCustomerType,
                phone: formPhone.trim(),
                address: formAddress.trim(),
                status: formStatus,
              }
            : c
        )
      );
      onShowToast('success', 'Perubahan Disimpan', `Data customer "${formName}" berhasil diperbarui.`);
    } else {
      // Create with automatic code generation (Format: CUS-01)
      const nextNum = customers.length + 1;
      const autoCode = `CUS-${String(nextNum).padStart(2, '0')}`;
      const newCus: CustomerItem = {
        id: `cus-${Date.now()}`,
        code: autoCode,
        name: formName.trim(),
        customerType: formCustomerType,
        phone: formPhone.trim(),
        address: formAddress.trim(),
        status: formStatus,
        totalTransactions: 0,
      };
      setCustomers((prev) => [...prev, newCus]);
      onShowToast('success', 'Customer Ditambahkan', `Customer "${formName}" (${autoCode}) berhasil didaftarkan.`);
    }

    setIsModalOpen(false);
  };

  // Badge Customer Type
  const renderTypeBadge = (type: CustomerType) => {
    switch (type) {
      case 'Member':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10.5px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
            ★ Member
          </span>
        );
      case 'Grosir':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10.5px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
            📦 Grosir
          </span>
        );
      case 'Reseller':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10.5px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
            🤝 Reseller
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10.5px] font-bold bg-gray-100 text-gray-700 border border-gray-200">
            Umum
          </span>
        );
    }
  };

  // Badge Status
  const renderStatusBadge = (status: CustomerStatus) => {
    if (status === 'Aktif') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10.5px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <ShieldCheck className="w-3 h-3 text-emerald-600" />
          Aktif
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10.5px] font-bold bg-red-50 text-red-700 border border-red-200">
        <ShieldAlert className="w-3 h-3 text-red-600" />
        Non-Aktif (Blacklist)
      </span>
    );
  };

  return (
    <div className="bg-white rounded-xl border border-[#E0E0E0] shadow-xs overflow-hidden">
      {/* CARD HEADER KDMP */}
      <div className="p-4 sm:p-5 border-b border-[#E0E0E0] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 flex-1">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-[#D32F2F]" />
            <h5 className="text-base font-bold text-gray-900 tracking-tight">Master Customer</h5>
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
              placeholder="Cari customer/no telp..."
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
          <span>Tambah Customer</span>
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
                <th className="py-2.5 px-3">Nama Customer</th>
                <th className="py-2.5 px-3">Tipe</th>
                <th className="py-2.5 px-3">No Telp</th>
                <th className="py-2.5 px-3">Alamat</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {currentData.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-gray-400 text-xs">
                    {search ? 'Tidak ada customer yang cocok dengan pencarian.' : 'Belum ada data customer.'}
                  </td>
                </tr>
              ) : (
                currentData.map((cus, idx) => (
                  <tr key={cus.id} className="hover:bg-gray-50/70 transition-colors">
                    <td className="py-3 px-3 text-center text-gray-500 font-mono">
                      {startIndex + idx + 1}
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-gray-800">
                      {cus.code}
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-bold text-gray-900 block">{cus.name}</span>
                      {cus.totalTransactions !== undefined && (
                        <span className="text-[10px] text-gray-400 font-medium">
                          {cus.totalTransactions} transaksi tersimpan
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3">
                      {renderTypeBadge(cus.customerType)}
                    </td>
                    <td className="py-3 px-3 font-mono text-gray-700">
                      {cus.phone || '-'}
                    </td>
                    <td className="py-3 px-3 text-gray-600 max-w-[200px] truncate" title={cus.address}>
                      {cus.address || '-'}
                    </td>
                    <td className="py-3 px-3">
                      {renderStatusBadge(cus.status)}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <div className="inline-flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(cus)}
                          className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                          title="Edit Customer"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(cus.id, cus.name)}
                          className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                          title="Hapus Customer"
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

      {/* ===== MODAL TAMBAH/EDIT CUSTOMER (REPLACES Bootstrap #modalCustomer) ===== */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl">
            {/* Header */}
            <div className="p-4 border-b border-[#E0E0E0] flex items-center justify-between bg-white">
              <h5 className="font-bold text-sm text-gray-900 flex items-center gap-2">
                <PlusCircle className="w-4 h-4 text-[#D32F2F]" />
                <span>{editingItem ? 'Edit Customer' : 'Tambah Customer'}</span>
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
                {/* Row 1: Nama, Tipe Customer, No WA / Telp */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                  <div className="md:col-span-5">
                    <label className="text-xs font-bold text-gray-700 block mb-1">
                      Nama Customer <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      autoFocus
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      placeholder="Contoh: Budi Santoso"
                      className="w-full text-xs px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:outline-none focus:border-[#D32F2F]"
                    />
                  </div>
                  <div className="md:col-span-3">
                    <label className="text-xs font-bold text-gray-700 block mb-1">
                      Tipe Customer
                    </label>
                    <select
                      value={formCustomerType}
                      onChange={(e) => setFormCustomerType(e.target.value as CustomerType)}
                      className="w-full text-xs px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:outline-none focus:border-[#D32F2F]"
                    >
                      <option value="Umum">Umum</option>
                      <option value="Member">Member</option>
                      <option value="Grosir">Grosir</option>
                      <option value="Reseller">Reseller</option>
                    </select>
                  </div>
                  <div className="md:col-span-4">
                    <label className="text-xs font-bold text-gray-700 block mb-1">
                      No WA / Telp
                    </label>
                    <input
                      type="text"
                      value={formPhone}
                      onChange={(e) => setFormPhone(e.target.value)}
                      placeholder="081..."
                      className="w-full text-xs px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:outline-none focus:border-[#D32F2F]"
                    />
                  </div>
                </div>

                {/* Row 2: Alamat Lengkap & Status */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                  <div className="md:col-span-8">
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
                  <div className="md:col-span-4">
                    <label className="text-xs font-bold text-gray-700 block mb-1">
                      Status
                    </label>
                    <select
                      value={formStatus}
                      onChange={(e) => setFormStatus(e.target.value as CustomerStatus)}
                      className="w-full text-xs px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:outline-none focus:border-[#D32F2F]"
                    >
                      <option value="Aktif">Aktif</option>
                      <option value="Non-Aktif">Non-Aktif (Blacklist)</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-start gap-1.5 text-gray-400 text-[11px] pt-1">
                  <Info className="w-3.5 h-3.5 text-gray-400 shrink-0 mt-0.5" />
                  <span>
                    {editingItem
                      ? `Kode Customer saat ini: ${editingItem.code}`
                      : 'Kode akan dibuat otomatis (Format: CUS-01)'}
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
