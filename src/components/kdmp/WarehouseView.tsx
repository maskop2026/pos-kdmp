import React, { useState, useMemo } from 'react';
import {
  Warehouse,
  Plus,
  Search,
  ArrowRightLeft,
  Boxes,
  AlertTriangle,
  Truck,
  MapPin,
  Edit2,
  Trash2,
  X,
  PlusCircle,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Info,
} from 'lucide-react';
import { WarehouseItem, WarehouseType, StockMutationRecord } from '../../types/kdmp';
import { INITIAL_WAREHOUSES } from '../../data/kdmpData';

interface WarehouseViewProps {
  onShowToast: (type: 'success' | 'info' | 'warning', title: string, message: string) => void;
}

export const WarehouseView: React.FC<WarehouseViewProps> = ({ onShowToast }) => {
  const [warehouses, setWarehouses] = useState<WarehouseItem[]>(INITIAL_WAREHOUSES);
  const [mutations, setMutations] = useState<StockMutationRecord[]>([
    {
      id: 'mut-1',
      mutationCode: 'MUT-2024-001',
      date: '2024-10-24 08:30',
      sourceWarehouse: 'Gudang Pusat Jetakkidul',
      targetWarehouse: 'Outlet Kasir Utama KDMP',
      totalItems: 50,
      status: 'Selesai',
    },
    {
      id: 'mut-2',
      mutationCode: 'MUT-2024-002',
      date: '2024-10-24 10:15',
      sourceWarehouse: 'Gudang Pusat Jetakkidul',
      targetWarehouse: 'Rak Sembako A1',
      totalItems: 25,
      status: 'Selesai',
    },
  ]);

  // Active Tab
  const [activeTab, setActiveTab] = useState<'daftar' | 'mutasi'>('daftar');

  // Search & Pagination
  const [search, setSearch] = useState('');
  const [pageSize, setPageSize] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Modal State Tambah Warehouse
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<WarehouseItem | null>(null);

  // Form Fields
  const [formName, setFormName] = useState('');
  const [formType, setFormType] = useState<WarehouseType>('Pusat');
  const [formCapacity, setFormCapacity] = useState<number>(0);
  const [formAddress, setFormAddress] = useState('');

  // Modal Mutasi Stok
  const [isMutationModalOpen, setIsMutationModalOpen] = useState(false);
  const [mutSource, setMutSource] = useState(warehouses[0]?.warehouse_name || 'Gudang Pusat Jetakkidul');
  const [mutTarget, setMutTarget] = useState(warehouses[1]?.warehouse_name || 'Outlet Kasir Utama KDMP');
  const [mutQty, setMutQty] = useState<number>(10);

  // Filter warehouses
  const filteredWarehouses = useMemo(() => {
    const q = search.toLowerCase();
    return warehouses.filter(
      (w) =>
        w.warehouse_name.toLowerCase().includes(q) ||
        w.warehouse_code.toLowerCase().includes(q) ||
        w.type.toLowerCase().includes(q) ||
        w.address.toLowerCase().includes(q)
    );
  }, [warehouses, search]);

  // Pagination calculation
  const totalItems = filteredWarehouses.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  const currentData = filteredWarehouses.slice(startIndex, endIndex);

  // Open modal create
  const handleOpenCreate = () => {
    setEditingItem(null);
    setFormName('');
    setFormType('Pusat');
    setFormCapacity(0);
    setFormAddress('');
    setIsModalOpen(true);
  };

  // Open modal edit
  const handleOpenEdit = (item: WarehouseItem) => {
    setEditingItem(item);
    setFormName(item.warehouse_name);
    setFormType(item.type);
    setFormCapacity(item.capacity || 0);
    setFormAddress(item.address);
    setIsModalOpen(true);
  };

  // Delete
  const handleDelete = (id: string, name: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus warehouse "${name}"?`)) {
      setWarehouses((prev) => prev.filter((w) => w.id !== id));
      onShowToast('info', 'Warehouse Dihapus', `Warehouse "${name}" berhasil dihapus.`);
    }
  };

  // Save (Simulasi PHP Backend: company_id = 1, Auto Generate WH-xxx)
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    if (editingItem) {
      // Update
      setWarehouses((prev) =>
        prev.map((w) =>
          w.id === editingItem.id
            ? {
                ...w,
                warehouse_name: formName.trim(),
                type: formType,
                capacity: Number(formCapacity),
                address: formAddress.trim(),
              }
            : w
        )
      );
      onShowToast('success', 'Perubahan Disimpan', `Warehouse "${formName}" berhasil diperbarui.`);
    } else {
      // Auto Generate Code (Format: WH-007) persis algoritma PHP:
      // SELECT MAX(CAST(SUBSTRING_INDEX(warehouse_code, '-', -1) AS UNSIGNED))
      const codeNums = warehouses.map((w) => {
        const parts = w.warehouse_code.split('-');
        return parseInt(parts[1] || '0', 10);
      });
      const maxNum = codeNums.length > 0 ? Math.max(...codeNums) : 0;
      const nextNum = maxNum + 1;
      const autoCode = `WH-${String(nextNum).padStart(3, '0')}`;

      const newWarehouse: WarehouseItem = {
        id: String(Date.now()),
        company_id: 1, // KDMP Jetakkidul
        warehouse_code: autoCode,
        warehouse_name: formName.trim(),
        type: formType,
        capacity: Number(formCapacity),
        address: formAddress.trim(),
        status: 'Aktif',
      };

      setWarehouses((prev) => [...prev, newWarehouse]);
      onShowToast('success', 'Warehouse Berhasil Ditambahkan', `Warehouse "${formName}" berhasil dibuat dengan Kode: ${autoCode}`);
    }

    setIsModalOpen(false);
  };

  // Handle New Mutation
  const handleSaveMutation = (e: React.FormEvent) => {
    e.preventDefault();
    if (mutSource === mutTarget) {
      alert('Gudang asal dan gudang tujuan tidak boleh sama!');
      return;
    }

    const nextCode = `MUT-2024-${String(mutations.length + 1).padStart(3, '0')}`;
    const now = new Date();
    const dateStr = `${now.toISOString().split('T')[0]} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const newMut: StockMutationRecord = {
      id: `mut-${Date.now()}`,
      mutationCode: nextCode,
      date: dateStr,
      sourceWarehouse: mutSource,
      targetWarehouse: mutTarget,
      totalItems: Number(mutQty),
      status: 'Selesai',
    };

    setMutations((prev) => [newMut, ...prev]);
    setIsMutationModalOpen(false);
    onShowToast('success', 'Mutasi Berhasil', `Transfer stok ${mutQty} item dari ${mutSource} ke ${mutTarget} selesai.`);
  };

  // Render Type Badge
  const renderTypeBadge = (type: WarehouseType) => {
    switch (type) {
      case 'Pusat':
        return (
          <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
            Pusat (Utama)
          </span>
        );
      case 'Cabang':
        return (
          <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
            Cabang (Outlet)
          </span>
        );
      case 'Rak':
        return (
          <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
            Rak Display
          </span>
        );
      case 'Office':
        return (
          <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-gray-100 text-gray-700 border border-gray-200">
            Office
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-xl border border-[#E0E0E0] shadow-xs overflow-hidden">
      {/* 1. CARD HEADER KDMP */}
      <div className="p-4 sm:p-5 border-b border-[#E0E0E0] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 flex-1">
          <div className="flex items-center gap-2">
            <Warehouse className="w-5 h-5 text-[#D32F2F]" />
            <h5 className="text-base font-bold text-gray-900 tracking-tight">Warehouse & Lokasi</h5>
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
              placeholder="Cari warehouse..."
              className="w-full text-xs pl-8 pr-3 py-1.5 bg-white border border-[#E0E0E0] rounded-lg focus:outline-none focus:border-[#D32F2F] placeholder:text-gray-400"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
          <button
            type="button"
            onClick={() => setIsMutationModalOpen(true)}
            className="px-3 py-1.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-bold rounded-lg shadow-xs flex items-center gap-1.5 transition-colors"
          >
            <ArrowRightLeft className="w-3.5 h-3.5 text-gray-600" />
            <span>Mutasi Stok</span>
          </button>

          <button
            type="button"
            onClick={handleOpenCreate}
            className="px-3.5 py-1.5 bg-[#D32F2F] hover:bg-[#B71C1C] text-white text-xs font-bold rounded-lg shadow-xs flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Warehouse</span>
          </button>
        </div>
      </div>

      {/* 2. CARD BODY */}
      <div className="p-4 sm:p-5 space-y-5">
        {/* SUMMARY CARDS (Matching Bootstrap row g-3) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3.5">
          {/* Card 1: Total Gudang */}
          <div className="p-3.5 rounded-xl shadow-xs border-l-4 border-blue-500 bg-[#e3f2fd] flex items-center justify-between">
            <div>
              <p className="text-[12px] text-black/50 font-medium mb-0.5">Total Gudang</p>
              <h5 className="text-lg font-bold text-[#0d47a1]">{warehouses.length} Lokasi</h5>
            </div>
            <div className="bg-white p-2.5 rounded-xl text-blue-600 shadow-xs">
              <Warehouse className="w-5 h-5" />
            </div>
          </div>

          {/* Card 2: Total Stok */}
          <div className="p-3.5 rounded-xl shadow-xs border-l-4 border-emerald-500 bg-[#e8f5e9] flex items-center justify-between">
            <div>
              <p className="text-[12px] text-black/50 font-medium mb-0.5">Total Stok (Item)</p>
              <h5 className="text-lg font-bold text-[#1b5e20]">8.750 Pcs</h5>
            </div>
            <div className="bg-white p-2.5 rounded-xl text-emerald-600 shadow-xs">
              <Boxes className="w-5 h-5" />
            </div>
          </div>

          {/* Card 3: Stok Menipis */}
          <div className="p-3.5 rounded-xl shadow-xs border-l-4 border-amber-500 bg-[#fff3e0] flex items-center justify-between">
            <div>
              <p className="text-[12px] text-black/50 font-medium mb-0.5">Stok Menipis</p>
              <h5 className="text-lg font-bold text-[#e65100]">15 Item</h5>
            </div>
            <div className="bg-white p-2.5 rounded-xl text-amber-600 shadow-xs">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>

          {/* Card 4: Mutasi Pending */}
          <div className="p-3.5 rounded-xl shadow-xs border-l-4 border-purple-500 bg-[#f3e5f5] flex items-center justify-between">
            <div>
              <p className="text-[12px] text-black/50 font-medium mb-0.5">Mutasi Pending</p>
              <h5 className="text-lg font-bold text-[#4a148c]">0 Transfer</h5>
            </div>
            <div className="bg-white p-2.5 rounded-xl text-purple-600 shadow-xs">
              <Truck className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* TAB NAVIGATION */}
        <div className="border-b border-[#E0E0E0] flex gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('daftar')}
            className={`pb-2.5 px-3 text-xs font-bold flex items-center gap-1.5 transition-colors border-b-2 -mb-[1px] ${
              activeTab === 'daftar'
                ? 'border-[#D32F2F] text-[#D32F2F]'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Daftar Lokasi & Rak</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('mutasi')}
            className={`pb-2.5 px-3 text-xs font-bold flex items-center gap-1.5 transition-colors border-b-2 -mb-[1px] ${
              activeTab === 'mutasi'
                ? 'border-[#D32F2F] text-[#D32F2F]'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            <ArrowRightLeft className="w-3.5 h-3.5" />
            <span>Riwayat Mutasi Stok</span>
            {mutations.length > 0 && (
              <span className="bg-gray-100 text-gray-700 px-1.5 py-0.2 rounded-full text-[10px]">
                {mutations.length}
              </span>
            )}
          </button>
        </div>

        {/* TAB 1: DAFTAR LOKASI */}
        {activeTab === 'daftar' && (
          <div className="space-y-4">
            <div className="overflow-x-auto border border-gray-100 rounded-lg">
              <table className="w-full text-left text-xs align-middle">
                <thead className="bg-[#f8f9fa] border-b border-[#E0E0E0] text-[10.5px] font-bold uppercase tracking-wider text-gray-500">
                  <tr>
                    <th className="py-2.5 px-3 w-12 text-center">No</th>
                    <th className="py-2.5 px-3 w-28">Kode Lokasi</th>
                    <th className="py-2.5 px-3">Nama Warehouse</th>
                    <th className="py-2.5 px-3">Tipe</th>
                    <th className="py-2.5 px-3">Alamat</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {currentData.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-gray-400 text-xs">
                        {search ? 'Tidak ada lokasi/warehouse yang cocok.' : 'Belum ada data warehouse.'}
                      </td>
                    </tr>
                  ) : (
                    currentData.map((item, idx) => (
                      <tr key={item.id} className="hover:bg-gray-50/70 transition-colors">
                        <td className="py-3 px-3 text-center text-gray-500 font-mono">
                          {startIndex + idx + 1}
                        </td>
                        <td className="py-3 px-3 font-mono font-bold text-gray-800">
                          {item.warehouse_code}
                        </td>
                        <td className="py-3 px-3">
                          <span className="font-bold text-gray-900 block">{item.warehouse_name}</span>
                          {item.capacity ? (
                            <span className="text-[10px] text-gray-400 font-mono">
                              Kapasitas: {item.capacity.toLocaleString('id-ID')} unit
                            </span>
                          ) : null}
                        </td>
                        <td className="py-3 px-3">
                          {renderTypeBadge(item.type)}
                        </td>
                        <td className="py-3 px-3 text-gray-600 max-w-[220px] truncate" title={item.address}>
                          {item.address || '-'}
                        </td>
                        <td className="py-3 px-3">
                          <span className="px-2 py-0.5 rounded-full text-[10.5px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            {item.status}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right">
                          <div className="inline-flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleOpenEdit(item)}
                              className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                              title="Edit Warehouse"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(item.id, item.warehouse_name)}
                              className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                              title="Hapus Warehouse"
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

            {/* Pagination & Limit */}
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
        )}

        {/* TAB 2: RIWAYAT MUTASI */}
        {activeTab === 'mutasi' && (
          <div className="space-y-4">
            <div className="overflow-x-auto border border-gray-100 rounded-lg">
              <table className="w-full text-left text-xs align-middle">
                <thead className="bg-[#f8f9fa] border-b border-[#E0E0E0] text-[10.5px] font-bold uppercase tracking-wider text-gray-500">
                  <tr>
                    <th className="py-2.5 px-3">Kode Mutasi</th>
                    <th className="py-2.5 px-3">Tanggal</th>
                    <th className="py-2.5 px-3">Gudang Asal</th>
                    <th className="py-2.5 px-3">Gudang Tujuan</th>
                    <th className="py-2.5 px-3">Total Item</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {mutations.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center text-gray-400 py-6 text-xs">
                        Belum ada riwayat mutasi
                      </td>
                    </tr>
                  ) : (
                    mutations.map((m) => (
                      <tr key={m.id} className="hover:bg-gray-50/70">
                        <td className="py-3 px-3 font-mono font-bold text-gray-900">
                          {m.mutationCode}
                        </td>
                        <td className="py-3 px-3 font-mono text-gray-500 text-[11px]">
                          {m.date}
                        </td>
                        <td className="py-3 px-3 text-gray-800 font-medium">
                          {m.sourceWarehouse}
                        </td>
                        <td className="py-3 px-3 text-gray-800 font-medium">
                          {m.targetWarehouse}
                        </td>
                        <td className="py-3 px-3 font-mono font-bold text-blue-700">
                          {m.totalItems} Pcs
                        </td>
                        <td className="py-3 px-3">
                          <span className="px-2.5 py-0.5 rounded-full text-[10.5px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            {m.status}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right">
                          <button
                            type="button"
                            onClick={() => alert(`Detail Mutasi ${m.mutationCode}`)}
                            className="text-xs text-[#D32F2F] hover:underline font-semibold"
                          >
                            Detail
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* ===== MODAL TAMBAH/EDIT WAREHOUSE (Replaces #modalTambahWarehouse) ===== */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl">
            {/* Header */}
            <div className="p-4 border-b border-[#E0E0E0] flex items-center justify-between bg-white">
              <h5 className="font-bold text-sm text-gray-900 flex items-center gap-2">
                <PlusCircle className="w-4 h-4 text-[#D32F2F]" />
                <span>{editingItem ? 'Edit Warehouse/Lokasi' : 'Tambah Warehouse/Lokasi'}</span>
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
                    Nama Lokasi <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    autoFocus
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="Contoh: Rak Obat A"
                    className="w-full text-xs px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:outline-none focus:border-[#D32F2F]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">
                      Tipe Lokasi
                    </label>
                    <select
                      value={formType}
                      onChange={(e) => setFormType(e.target.value as WarehouseType)}
                      className="w-full text-xs px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:outline-none focus:border-[#D32F2F]"
                    >
                      <option value="Pusat">Pusat (Gudang Utama)</option>
                      <option value="Cabang">Cabang (Outlet/Gerai)</option>
                      <option value="Rak">Rak</option>
                      <option value="Office">Office</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">
                      Kapasitas Maksimal
                    </label>
                    <input
                      type="number"
                      value={formCapacity}
                      onChange={(e) => setFormCapacity(Number(e.target.value))}
                      placeholder="0"
                      className="w-full text-xs px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:outline-none focus:border-[#D32F2F]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">
                    Alamat / Keterangan
                  </label>
                  <textarea
                    rows={2}
                    value={formAddress}
                    onChange={(e) => setFormAddress(e.target.value)}
                    placeholder="Masukkan alamat / area lokasi..."
                    className="w-full text-xs px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:outline-none focus:border-[#D32F2F]"
                  />
                </div>

                <div className="flex items-start gap-1.5 text-gray-400 text-[11px] pt-1">
                  <Info className="w-3.5 h-3.5 text-gray-400 shrink-0 mt-0.5" />
                  <span>
                    {editingItem
                      ? `Kode Warehouse saat ini: ${editingItem.warehouse_code}`
                      : 'Kode akan dibuat otomatis (Format: WH-007, Perusahaan: KDMP Jetakkidul)'}
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

      {/* ===== MODAL MUTASI STOK CEPAT ===== */}
      {isMutationModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-[#E0E0E0] flex items-center justify-between bg-white">
              <h5 className="font-bold text-sm text-gray-900 flex items-center gap-2">
                <ArrowRightLeft className="w-4 h-4 text-[#D32F2F]" />
                <span>Formulir Mutasi Stok Antar Gudang</span>
              </h5>
              <button
                type="button"
                onClick={() => setIsMutationModalOpen(false)}
                className="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveMutation}>
              <div className="p-5 space-y-3.5">
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">
                    Gudang / Lokasi Asal
                  </label>
                  <select
                    value={mutSource}
                    onChange={(e) => setMutSource(e.target.value)}
                    className="w-full text-xs px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:outline-none focus:border-[#D32F2F]"
                  >
                    {warehouses.map((w) => (
                      <option key={w.id} value={w.warehouse_name}>
                        {w.warehouse_name} ({w.type})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">
                    Gudang / Lokasi Tujuan
                  </label>
                  <select
                    value={mutTarget}
                    onChange={(e) => setMutTarget(e.target.value)}
                    className="w-full text-xs px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:outline-none focus:border-[#D32F2F]"
                  >
                    {warehouses.map((w) => (
                      <option key={w.id} value={w.warehouse_name}>
                        {w.warehouse_name} ({w.type})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">
                    Jumlah Barang yang Dimutasi (Pcs)
                  </label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={mutQty}
                    onChange={(e) => setMutQty(Number(e.target.value))}
                    className="w-full text-xs px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:outline-none focus:border-[#D32F2F]"
                  />
                </div>
              </div>

              <div className="p-4 border-t border-[#E0E0E0] bg-gray-50 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsMutationModalOpen(false)}
                  className="px-3 py-1.5 text-xs text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-bold text-white bg-[#D32F2F] hover:bg-[#B71C1C] rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Proses Mutasi</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
