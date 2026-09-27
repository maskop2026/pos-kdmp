import React, { useState, useMemo } from 'react';
import {
  ShoppingBag,
  Plus,
  Search,
  ShoppingCart,
  Receipt,
  Truck,
  RotateCcw,
  ListOrdered,
  Banknote,
  Info,
  Boxes,
  X,
  PlusCircle,
  CheckCircle,
  Eye,
  ChevronLeft,
  ChevronRight,
  Trash2,
} from 'lucide-react';
import { PurchaseOrder, PurchaseOrderItem, SupplierItem, WarehouseItem } from '../../types/kdmp';
import { INITIAL_PURCHASE_ORDERS, INITIAL_VARIANTS, INITIAL_SUPPLIERS, INITIAL_WAREHOUSES, VariantOption } from '../../data/kdmpData';

interface PurchaseOrdersViewProps {
  onShowToast: (type: 'success' | 'info' | 'warning', title: string, message: string) => void;
}

interface FormRowItem {
  id: string;
  variantId: string;
  productName: string;
  unit: string;
  qty: number;
  purchasePrice: number;
  subtotal: number;
}

export const PurchaseOrdersView: React.FC<PurchaseOrdersViewProps> = ({ onShowToast }) => {
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(INITIAL_PURCHASE_ORDERS);
  const [suppliers] = useState<SupplierItem[]>(INITIAL_SUPPLIERS);
  const [warehouses] = useState<WarehouseItem[]>(INITIAL_WAREHOUSES);
  const [variants] = useState<VariantOption[]>(INITIAL_VARIANTS);

  // Active Tab
  const [activeTab, setActiveTab] = useState<'po' | 'hutang'>('po');

  // Search & Pagination
  const [search, setSearch] = useState('');
  const [pageSize, setPageSize] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Modal Create PO State
  const [isModalCreateOpen, setIsModalCreateOpen] = useState(false);
  const [selectedSupplierId, setSelectedSupplierId] = useState<string>('');
  const [poDate, setPoDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [expectedDate, setExpectedDate] = useState<string>(
    new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [selectedWarehouseId, setSelectedWarehouseId] = useState<string>(warehouses[0]?.id || '1');

  // Items table in Create PO
  const [poFormItems, setPoFormItems] = useState<FormRowItem[]>([
    {
      id: 'row-1',
      variantId: '',
      productName: '',
      unit: '',
      qty: 1,
      purchasePrice: 0,
      subtotal: 0,
    },
  ]);

  const [usePpn, setUsePpn] = useState(false);
  const [taxAmount, setTaxAmount] = useState(0);
  const [shippingFee, setShippingFee] = useState(0);

  // Detail Modal State
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [detailPO, setDetailPO] = useState<PurchaseOrder | null>(null);

  // Summary Cards Calculations
  const currentMonthTotal = useMemo(() => {
    return purchaseOrders.reduce((sum, po) => sum + po.grandTotal, 0);
  }, [purchaseOrders]);

  const totalDebt = useMemo(() => {
    return purchaseOrders.reduce((sum, po) => sum + (po.paymentStatus === 'Belum Lunas' ? po.debtAmount : 0), 0);
  }, [purchaseOrders]);

  const sentPOCount = useMemo(() => {
    return purchaseOrders.filter((po) => po.status === 'Dikirim').length;
  }, [purchaseOrders]);

  // Filtered Purchase Orders
  const filteredPOs = useMemo(() => {
    const q = search.toLowerCase();
    return purchaseOrders.filter(
      (po) =>
        po.poNumber.toLowerCase().includes(q) ||
        po.supplierName.toLowerCase().includes(q) ||
        po.warehouseName.toLowerCase().includes(q)
    );
  }, [purchaseOrders, search]);

  // Filtered Hutang (Only Belum Lunas)
  const debtPOs = useMemo(() => {
    return purchaseOrders.filter((po) => po.paymentStatus === 'Belum Lunas');
  }, [purchaseOrders]);

  // Pagination for PO tab
  const totalItems = filteredPOs.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  const currentData = filteredPOs.slice(startIndex, endIndex);

  // Filter variants based on chosen supplier
  const availableVariants = useMemo(() => {
    if (!selectedSupplierId) return [];
    return variants.filter((v) => v.supplier_id === selectedSupplierId);
  }, [variants, selectedSupplierId]);

  // Subtotal calculation in create modal
  const itemsSubtotal = useMemo(() => {
    return poFormItems.reduce((sum, item) => sum + item.subtotal, 0);
  }, [poFormItems]);

  const grandTotal = useMemo(() => {
    return itemsSubtotal + taxAmount + shippingFee;
  }, [itemsSubtotal, taxAmount, shippingFee]);

  // Handle supplier change
  const handleSupplierChange = (supId: string) => {
    setSelectedSupplierId(supId);
    const sup = suppliers.find((s) => s.id === supId);
    // Reset items when supplier changes
    setPoFormItems([
      {
        id: `row-${Date.now()}`,
        variantId: '',
        productName: '',
        unit: '',
        qty: 1,
        purchasePrice: 0,
        subtotal: 0,
      },
    ]);
    if (sup && sup.taxStatus === 'PPN Include') {
      setUsePpn(true);
      setTaxAmount(0); // Included
    } else if (sup && sup.taxStatus === 'PPN Exclude') {
      setUsePpn(true);
      setTaxAmount(Math.round(itemsSubtotal * 0.11));
    } else {
      setUsePpn(false);
      setTaxAmount(0);
    }
  };

  // Checkbox PPN
  const handleTogglePpn = (checked: boolean) => {
    setUsePpn(checked);
    if (checked) {
      setTaxAmount(Math.round(itemsSubtotal * 0.11));
    } else {
      setTaxAmount(0);
    }
  };

  // Add Row Item
  const handleAddRowItem = () => {
    setPoFormItems((prev) => [
      ...prev,
      {
        id: `row-${Date.now()}-${Math.random()}`,
        variantId: '',
        productName: '',
        unit: '',
        qty: 1,
        purchasePrice: 0,
        subtotal: 0,
      },
    ]);
  };

  // Remove Row Item
  const handleRemoveRowItem = (rowId: string) => {
    if (poFormItems.length === 1) {
      alert('Minimal harus ada 1 baris item!');
      return;
    }
    setPoFormItems((prev) => prev.filter((r) => r.id !== rowId));
  };

  // Handle Item Variant Select
  const handleVariantSelect = (rowId: string, variantId: string) => {
    const v = availableVariants.find((item) => item.id === variantId);
    if (!v) return;

    setPoFormItems((prev) =>
      prev.map((row) => {
        if (row.id === rowId) {
          const sub = row.qty * v.defaultPrice;
          return {
            ...row,
            variantId: v.id,
            productName: `${v.master_name} (${v.variant_name})`,
            unit: v.unit,
            purchasePrice: v.defaultPrice,
            subtotal: sub,
          };
        }
        return row;
      })
    );
  };

  // Handle Qty or Price Change
  const handleRowChange = (rowId: string, field: 'qty' | 'purchasePrice' | 'unit', val: any) => {
    setPoFormItems((prev) =>
      prev.map((row) => {
        if (row.id === rowId) {
          const updated = { ...row, [field]: val };
          const qty = field === 'qty' ? Number(val) : row.qty;
          const price = field === 'purchasePrice' ? Number(val) : row.purchasePrice;
          updated.subtotal = qty * price;
          return updated;
        }
        return row;
      })
    );
  };

  // Open Detail Modal
  const handleOpenDetail = (po: PurchaseOrder) => {
    setDetailPO(po);
    setIsDetailOpen(true);
  };

  // Save PO
  const handleSavePO = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSupplierId) {
      alert('Silakan pilih supplier terlebih dahulu!');
      return;
    }

    const validItems = poFormItems.filter((i) => i.variantId && i.qty > 0);
    if (validItems.length === 0) {
      alert('Pilih minimal satu produk varian yang valid!');
      return;
    }

    const supplier = suppliers.find((s) => s.id === selectedSupplierId);
    const warehouse = warehouses.find((w) => w.id === selectedWarehouseId);

    const nextPoNum = `PO-${new Date().getFullYear()}-${String(purchaseOrders.length + 1).padStart(3, '0')}`;

    const newPO: PurchaseOrder = {
      id: `po-${Date.now()}`,
      poNumber: nextPoNum,
      date: poDate,
      expectedDate: expectedDate,
      supplierId: selectedSupplierId,
      supplierName: supplier?.name || 'Supplier External',
      warehouseId: selectedWarehouseId,
      warehouseName: warehouse?.warehouse_name || 'Gudang Pusat',
      items: validItems.map((v, idx) => ({
        id: `poi-${Date.now()}-${idx}`,
        variantId: v.variantId,
        productName: v.productName,
        unit: v.unit || 'Pcs',
        qty: v.qty,
        purchasePrice: v.purchasePrice,
        subtotal: v.subtotal,
      })),
      subtotal: itemsSubtotal,
      taxAmount: taxAmount,
      shippingFee: shippingFee,
      grandTotal: grandTotal,
      status: 'Dikirim',
      paymentStatus: 'Belum Lunas',
      debtAmount: grandTotal,
    };

    setPurchaseOrders((prev) => [newPO, ...prev]);
    setIsModalCreateOpen(false);
    onShowToast('success', 'PO Berhasil Dibuat', `Purchase Order ${nextPoNum} berhasil disimpan.`);
  };

  // Mark Debt as Paid
  const handlePayDebt = (poId: string, poNumber: string) => {
    if (confirm(`Apakah Anda ingin melunasi tagihan hutang untuk ${poNumber}?`)) {
      setPurchaseOrders((prev) =>
        prev.map((p) =>
          p.id === poId
            ? { ...p, paymentStatus: 'Lunas', debtAmount: 0, status: 'Selesai' }
            : p
        )
      );
      onShowToast('success', 'Hutang Lunas', `Pembayaran untuk ${poNumber} telah tercatat lunas.`);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-[#E0E0E0] shadow-xs overflow-hidden">
      {/* 1. CARD HEADER KDMP */}
      <div className="p-4 sm:p-5 border-b border-[#E0E0E0] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 flex-1">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#D32F2F]" />
            <h5 className="text-base font-bold text-gray-900 tracking-tight">Pembelian Barang</h5>
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
              placeholder="Cari PO/Supplier..."
              className="w-full text-xs pl-8 pr-3 py-1.5 bg-white border border-[#E0E0E0] rounded-lg focus:outline-none focus:border-[#D32F2F] placeholder:text-gray-400"
            />
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            setSelectedSupplierId('');
            setIsModalCreateOpen(true);
          }}
          className="bg-[#D32F2F] hover:bg-[#B71C1C] text-white px-3.5 py-2 rounded-lg text-xs font-bold shadow-xs flex items-center justify-center gap-1.5 transition-colors self-start sm:self-auto shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Buat PO Baru</span>
        </button>
      </div>

      {/* 2. CARD BODY */}
      <div className="p-4 sm:p-5 space-y-5">
        {/* SUMMARY CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3.5">
          {/* Card 1: Pembelian Bulan Ini */}
          <div className="p-3.5 rounded-xl shadow-xs border-l-4 border-blue-500 bg-[#e3f2fd] flex items-center justify-between">
            <div>
              <p className="text-[12px] text-gray-500 font-medium mb-0.5">Pembelian Bulan Ini</p>
              <h5 className="text-lg font-bold text-[#0d47a1] whitespace-nowrap">
                Rp {currentMonthTotal.toLocaleString('id-ID')}
              </h5>
            </div>
            <div className="bg-white p-2.5 rounded-xl text-blue-600 shadow-xs">
              <ShoppingCart className="w-5 h-5" />
            </div>
          </div>

          {/* Card 2: Total Hutang */}
          <div className="p-3.5 rounded-xl shadow-xs border-l-4 border-red-500 bg-[#ffebee] flex items-center justify-between">
            <div>
              <p className="text-[12px] text-gray-500 font-medium mb-0.5">Total Hutang</p>
              <h5 className="text-lg font-bold text-[#c62828] whitespace-nowrap">
                Rp {totalDebt.toLocaleString('id-ID')}
              </h5>
            </div>
            <div className="bg-white p-2.5 rounded-xl text-red-600 shadow-xs">
              <Receipt className="w-5 h-5" />
            </div>
          </div>

          {/* Card 3: PO Dikirim */}
          <div className="p-3.5 rounded-xl shadow-xs border-l-4 border-amber-500 bg-[#fff3e0] flex items-center justify-between">
            <div>
              <p className="text-[12px] text-gray-500 font-medium mb-0.5">PO Dikirim</p>
              <h5 className="text-lg font-bold text-[#e65100] whitespace-nowrap">
                {sentPOCount} PO
              </h5>
            </div>
            <div className="bg-white p-2.5 rounded-xl text-amber-600 shadow-xs">
              <Truck className="w-5 h-5" />
            </div>
          </div>

          {/* Card 4: Total Retur */}
          <div className="p-3.5 rounded-xl shadow-xs border-l-4 border-purple-500 bg-[#f3e5f5] flex items-center justify-between">
            <div>
              <p className="text-[12px] text-gray-500 font-medium mb-0.5">Total Retur</p>
              <h5 className="text-lg font-bold text-[#4a148c] whitespace-nowrap">
                0 Transaksi
              </h5>
            </div>
            <div className="bg-white p-2.5 rounded-xl text-purple-600 shadow-xs">
              <RotateCcw className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* TAB NAVIGATION */}
        <div className="border-b border-[#E0E0E0] flex gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('po')}
            className={`pb-2.5 px-3 text-xs font-bold flex items-center gap-1.5 transition-colors border-b-2 -mb-[1px] ${
              activeTab === 'po'
                ? 'border-[#D32F2F] text-[#D32F2F]'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            <ListOrdered className="w-3.5 h-3.5" />
            <span>Daftar Purchase Order</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('hutang')}
            className={`pb-2.5 px-3 text-xs font-bold flex items-center gap-1.5 transition-colors border-b-2 -mb-[1px] ${
              activeTab === 'hutang'
                ? 'border-[#D32F2F] text-[#D32F2F]'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            <Banknote className="w-3.5 h-3.5" />
            <span>Hutang Supplier</span>
            {debtPOs.length > 0 && (
              <span className="bg-red-100 text-red-700 px-1.5 py-0.2 rounded-full text-[10px]">
                {debtPOs.length}
              </span>
            )}
          </button>
        </div>

        {/* TAB 1: DAFTAR PO */}
        {activeTab === 'po' && (
          <div className="space-y-4">
            <div className="overflow-x-auto border border-gray-100 rounded-lg">
              <table className="w-full text-left text-xs align-middle">
                <thead className="bg-[#f8f9fa] border-b border-[#E0E0E0] text-[10.5px] font-bold uppercase tracking-wider text-gray-500">
                  <tr>
                    <th className="py-2.5 px-3 w-12 text-center">No</th>
                    <th className="py-2.5 px-3">No. PO</th>
                    <th className="py-2.5 px-3">Tanggal</th>
                    <th className="py-2.5 px-3">Supplier</th>
                    <th className="py-2.5 px-3 text-right">Total Nilai</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {currentData.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-gray-400 text-xs">
                        Tidak ada transaksi purchase order.
                      </td>
                    </tr>
                  ) : (
                    currentData.map((po, idx) => (
                      <tr key={po.id} className="hover:bg-gray-50/70 transition-colors">
                        <td className="py-3 px-3 text-center text-gray-500 font-mono">
                          {startIndex + idx + 1}
                        </td>
                        <td className="py-3 px-3 font-mono font-bold text-gray-900">
                          {po.poNumber}
                        </td>
                        <td className="py-3 px-3 text-gray-600 font-mono text-[11px]">
                          {po.date}
                        </td>
                        <td className="py-3 px-3">
                          <span className="font-bold text-gray-900 block">{po.supplierName}</span>
                          <span className="text-[10px] text-gray-400">Tujuan: {po.warehouseName}</span>
                        </td>
                        <td className="py-3 px-3 text-right font-mono font-bold text-gray-900">
                          Rp {po.grandTotal.toLocaleString('id-ID')}
                        </td>
                        <td className="py-3 px-3">
                          {po.status === 'Dikirim' && (
                            <span className="px-2.5 py-0.5 rounded-full text-[10.5px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                              Dikirim
                            </span>
                          )}
                          {po.status === 'Selesai' && (
                            <span className="px-2.5 py-0.5 rounded-full text-[10.5px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              Selesai
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-3 text-right">
                          <button
                            type="button"
                            onClick={() => handleOpenDetail(po)}
                            className="inline-flex items-center gap-1 text-xs text-[#D32F2F] hover:bg-red-50 px-2 py-1 rounded-md font-semibold transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Detail</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
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

        {/* TAB 2: HUTANG SUPPLIER */}
        {activeTab === 'hutang' && (
          <div className="space-y-4">
            <div className="overflow-x-auto border border-gray-100 rounded-lg">
              <table className="w-full text-left text-xs align-middle">
                <thead className="bg-[#f8f9fa] border-b border-[#E0E0E0] text-[10.5px] font-bold uppercase tracking-wider text-gray-500">
                  <tr>
                    <th className="py-2.5 px-3">Supplier</th>
                    <th className="py-2.5 px-3">No. PO</th>
                    <th className="py-2.5 px-3">Tanggal</th>
                    <th className="py-2.5 px-3 text-right">Total Hutang</th>
                    <th className="py-2.5 px-3 text-end">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {debtPOs.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-gray-400 text-xs">
                        Belum ada data hutang
                      </td>
                    </tr>
                  ) : (
                    debtPOs.map((d) => (
                      <tr key={d.id} className="hover:bg-gray-50/70">
                        <td className="py-3 px-3 font-bold text-gray-900">
                          {d.supplierName}
                        </td>
                        <td className="py-3 px-3 font-mono text-gray-700">
                          {d.poNumber}
                        </td>
                        <td className="py-3 px-3 font-mono text-gray-500 text-[11px]">
                          {d.date}
                        </td>
                        <td className="py-3 px-3 text-right font-mono font-bold text-red-600">
                          Rp {d.debtAmount.toLocaleString('id-ID')}
                        </td>
                        <td className="py-3 px-3 text-right">
                          <button
                            type="button"
                            onClick={() => handlePayDebt(d.id, d.poNumber)}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white px-2.5 py-1 rounded text-xs font-bold shadow-xs transition-colors"
                          >
                            Bayar Hutang
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

      {/* ===== MODAL BUAT PURCHASE ORDER (PO) ===== */}
      {isModalCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-4xl w-full overflow-hidden shadow-2xl my-8">
            <div className="p-4 border-b border-[#E0E0E0] flex items-center justify-between bg-white">
              <h5 className="font-bold text-sm text-gray-900 flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-[#D32F2F]" />
                <span>Buat Purchase Order (PO) Baru</span>
              </h5>
              <button
                type="button"
                onClick={() => setIsModalCreateOpen(false)}
                className="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSavePO}>
              <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
                {/* SECTION 1: INFORMASI PO */}
                <div className="text-xs font-bold text-[#1E1E1E] bg-[#f8f9fa] px-3 py-2 rounded-md border-l-[3px] border-[#D32F2F] flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-[#D32F2F]" />
                  <span>Informasi PO</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                  <div className="sm:col-span-4">
                    <label className="text-xs font-bold text-gray-700 block mb-1">
                      Supplier <span className="text-red-500">*</span>
                    </label>
                    <select
                      required
                      value={selectedSupplierId}
                      onChange={(e) => handleSupplierChange(e.target.value)}
                      className="w-full text-xs px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:outline-none focus:border-[#D32F2F]"
                    >
                      <option value="" disabled>
                        Pilih Supplier
                      </option>
                      {suppliers.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name} ({s.taxStatus})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="sm:col-span-3">
                    <label className="text-xs font-bold text-gray-700 block mb-1">
                      Tanggal PO <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      required
                      value={poDate}
                      onChange={(e) => setPoDate(e.target.value)}
                      className="w-full text-xs px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:outline-none focus:border-[#D32F2F]"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-xs font-bold text-gray-700 block mb-1">
                      Estimasi Tiba
                    </label>
                    <input
                      type="date"
                      value={expectedDate}
                      onChange={(e) => setExpectedDate(e.target.value)}
                      className="w-full text-xs px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:outline-none focus:border-[#D32F2F]"
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <label className="text-xs font-bold text-gray-700 block mb-1">
                      Gudang Tujuan <span className="text-red-500">*</span>
                    </label>
                    <select
                      required
                      value={selectedWarehouseId}
                      onChange={(e) => setSelectedWarehouseId(e.target.value)}
                      className="w-full text-xs px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:outline-none focus:border-[#D32F2F]"
                    >
                      {warehouses.map((w) => (
                        <option key={w.id} value={w.id}>
                          {w.warehouse_name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* SECTION 2: DAFTAR BARANG */}
                <div className="text-xs font-bold text-[#1E1E1E] bg-[#f8f9fa] px-3 py-2 rounded-md border-l-[3px] border-[#D32F2F] flex items-center gap-1.5 mt-2">
                  <Boxes className="w-3.5 h-3.5 text-[#D32F2F]" />
                  <span>Daftar Barang</span>
                </div>

                <div className="border border-gray-200 rounded-lg overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-gray-100 text-gray-700 font-bold border-b border-gray-200">
                      <tr>
                        <th className="py-2 px-3 w-[35%]">Produk (Varian)</th>
                        <th className="py-2 px-3 text-center w-[15%]">Satuan</th>
                        <th className="py-2 px-3 text-center w-[12%]">Qty</th>
                        <th className="py-2 px-3 text-center w-[18%]">Harga Beli</th>
                        <th className="py-2 px-3 text-right w-[15%]">Subtotal</th>
                        <th className="py-2 px-2 text-center w-[5%]">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {poFormItems.map((item) => (
                        <tr key={item.id}>
                          <td className="p-2">
                            <select
                              required
                              value={item.variantId}
                              onChange={(e) => handleVariantSelect(item.id, e.target.value)}
                              disabled={!selectedSupplierId}
                              className="w-full text-xs px-2 py-1.5 bg-white border border-gray-200 rounded focus:border-[#D32F2F] disabled:bg-gray-100"
                            >
                              <option value="" disabled>
                                {selectedSupplierId
                                  ? 'Pilih Varian Produk...'
                                  : 'Pilih supplier dulu...'}
                              </option>
                              {availableVariants.map((v) => (
                                <option key={v.id} value={v.id}>
                                  {v.master_name} ({v.variant_name})
                                </option>
                              ))}
                            </select>
                          </td>
                          <td className="p-2">
                            <input
                              type="text"
                              value={item.unit}
                              onChange={(e) => handleRowChange(item.id, 'unit', e.target.value)}
                              placeholder="Pcs/Dus"
                              className="w-full text-center text-xs px-2 py-1.5 bg-white border border-gray-200 rounded focus:border-[#D32F2F]"
                            />
                          </td>
                          <td className="p-2">
                            <input
                              type="number"
                              min={1}
                              required
                              value={item.qty}
                              onChange={(e) => handleRowChange(item.id, 'qty', e.target.value)}
                              className="w-full text-center text-xs px-2 py-1.5 bg-white border border-gray-200 rounded focus:border-[#D32F2F]"
                            />
                          </td>
                          <td className="p-2">
                            <input
                              type="number"
                              min={0}
                              required
                              value={item.purchasePrice}
                              onChange={(e) => handleRowChange(item.id, 'purchasePrice', e.target.value)}
                              className="w-full text-right text-xs px-2 py-1.5 bg-white border border-gray-200 rounded focus:border-[#D32F2F]"
                            />
                          </td>
                          <td className="p-2 text-right font-mono font-bold text-gray-900 whitespace-nowrap">
                            Rp {item.subtotal.toLocaleString('id-ID')}
                          </td>
                          <td className="p-2 text-center">
                            <button
                              type="button"
                              onClick={() => handleRemoveRowItem(item.id)}
                              className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <button
                  type="button"
                  onClick={handleAddRowItem}
                  className="w-full py-1.5 border border-dashed border-gray-300 hover:border-gray-400 bg-gray-50 hover:bg-gray-100 text-gray-700 text-xs font-bold rounded-lg flex items-center justify-center gap-1 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah Baris Item</span>
                </button>

                {/* KALKULASI & TOTAL */}
                <div className="flex justify-end pt-2">
                  <div className="w-full sm:w-80 bg-gray-50 p-4 rounded-xl space-y-2 border border-gray-200">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">Subtotal</span>
                      <span className="font-semibold text-gray-900">
                        Rp {itemsSubtotal.toLocaleString('id-ID')}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={usePpn}
                          onChange={(e) => handleTogglePpn(e.target.checked)}
                          className="rounded text-[#D32F2F] focus:ring-[#D32F2F]"
                        />
                        <span className="text-gray-700 font-medium">PPN 11%</span>
                      </label>
                      <input
                        type="number"
                        value={taxAmount}
                        onChange={(e) => setTaxAmount(Number(e.target.value))}
                        className="w-28 text-right text-xs px-2 py-1 bg-white border border-gray-200 rounded focus:border-[#D32F2F]"
                      />
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500">Ongkir / Lain-lain</span>
                      <input
                        type="number"
                        value={shippingFee}
                        onChange={(e) => setShippingFee(Number(e.target.value))}
                        className="w-28 text-right text-xs px-2 py-1 bg-white border border-gray-200 rounded focus:border-[#D32F2F]"
                      />
                    </div>

                    <hr className="border-gray-200 my-2" />

                    <div className="flex items-center justify-between">
                      <h6 className="text-xs font-bold text-gray-900">Total Nilai PO</h6>
                      <h5 className="text-sm font-bold text-[#D32F2F]">
                        Rp {grandTotal.toLocaleString('id-ID')}
                      </h5>
                    </div>
                  </div>
                </div>
              </div>

              {/* FOOTER */}
              <div className="p-4 border-t border-[#E0E0E0] bg-gray-50 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalCreateOpen(false)}
                  className="px-3 py-1.5 text-xs text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-bold text-white bg-[#D32F2F] hover:bg-[#B71C1C] rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Simpan PO</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===== MODAL DETAIL PURCHASE ORDER ===== */}
      {isDetailOpen && detailPO && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-[#E0E0E0] flex items-center justify-between bg-white">
              <h5 className="font-bold text-sm text-gray-900 flex items-center gap-2">
                <Eye className="w-4 h-4 text-[#D32F2F]" />
                <span>Detail PO: <span className="text-[#D32F2F] font-mono">{detailPO.poNumber}</span></span>
              </h5>
              <button
                type="button"
                onClick={() => setIsDetailOpen(false)}
                className="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4 bg-gray-50 p-3 rounded-lg border border-gray-100 text-xs">
                <div>
                  <small className="text-gray-400 block">Supplier</small>
                  <h6 className="font-bold text-gray-800">{detailPO.supplierName}</h6>
                </div>
                <div>
                  <small className="text-gray-400 block">Gudang Tujuan</small>
                  <h6 className="font-bold text-gray-800">{detailPO.warehouseName}</h6>
                </div>
              </div>

              <div className="overflow-x-auto border border-gray-100 rounded-lg">
                <table className="w-full text-xs text-left align-middle">
                  <thead className="bg-gray-50 border-b border-gray-100 text-gray-600 font-bold">
                    <tr>
                      <th className="py-2 px-3">Produk (Varian)</th>
                      <th className="py-2 px-3 text-center">Qty</th>
                      <th className="py-2 px-3 text-right">Harga</th>
                      <th className="py-2 px-3 text-right">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {detailPO.items.map((item) => (
                      <tr key={item.id}>
                        <td className="py-2.5 px-3 font-semibold text-gray-800">
                          {item.productName}
                        </td>
                        <td className="py-2.5 px-3 text-center font-mono">
                          {item.qty} {item.unit}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono">
                          Rp {item.purchasePrice.toLocaleString('id-ID')}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono font-bold text-gray-900">
                          Rp {item.subtotal.toLocaleString('id-ID')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-end">
                <div className="w-64 bg-gray-50 p-3 rounded-xl border border-gray-200 text-xs space-y-1.5">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span className="font-mono">Rp {detailPO.subtotal.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>PPN</span>
                    <span className="font-mono">Rp {detailPO.taxAmount.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Ongkir</span>
                    <span className="font-mono">Rp {detailPO.shippingFee.toLocaleString('id-ID')}</span>
                  </div>
                  <hr className="border-gray-200" />
                  <div className="flex justify-between font-bold text-sm">
                    <span>Total</span>
                    <span className="text-[#D32F2F] font-mono">Rp {detailPO.grandTotal.toLocaleString('id-ID')}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-[#E0E0E0] bg-gray-50 flex justify-end">
              <button
                type="button"
                onClick={() => setIsDetailOpen(false)}
                className="px-3 py-1.5 text-xs text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
