import React, { useState, useMemo } from 'react';
import {
  Store,
  Building2,
  MonitorCheck,
  TrendingUp,
  MapPin,
  Phone,
  User,
  Plus,
  Edit2,
  Trash2,
  Search,
  CheckCircle,
  X,
  AlertTriangle,
  RefreshCw,
  Power,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  ArrowRightLeft,
  DollarSign,
  Radio,
} from 'lucide-react';
import { OutletItem, PosTerminalItem, OutletType } from '../../types/kdmp';
import { INITIAL_OUTLETS, INITIAL_POS_TERMINALS, INITIAL_WAREHOUSES } from '../../data/kdmpData';

interface MultiOutletViewProps {
  onShowToast?: (type: 'success' | 'info' | 'warning', title: string, message: string) => void;
}

export const MultiOutletView: React.FC<MultiOutletViewProps> = ({ onShowToast }) => {
  // State
  const [outlets, setOutlets] = useState<OutletItem[]>(INITIAL_OUTLETS);
  const [terminals, setTerminals] = useState<PosTerminalItem[]>(INITIAL_POS_TERMINALS);
  const [currentActiveOutletId, setCurrentActiveOutletId] = useState<number>(1);

  // Tab State: 'outlets' | 'terminals' | 'performance'
  const [activeTab, setActiveTab] = useState<'outlets' | 'terminals' | 'performance'>('outlets');

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedOutletFilter, setSelectedOutletFilter] = useState<string>('all');

  // Modals
  const [isOutletModalOpen, setIsOutletModalOpen] = useState(false);
  const [editingOutlet, setEditingOutlet] = useState<OutletItem | null>(null);

  const [isTerminalModalOpen, setIsTerminalModalOpen] = useState(false);
  const [editingTerminal, setEditingTerminal] = useState<PosTerminalItem | null>(null);

  const [isSwitchModalOpen, setIsSwitchModalOpen] = useState(false);

  // Form Outlet Fields
  const [outletCode, setOutletCode] = useState('');
  const [outletName, setOutletName] = useState('');
  const [outletType, setOutletType] = useState<OutletType>('Cabang');
  const [outletPic, setOutletPic] = useState('');
  const [outletPhone, setOutletPhone] = useState('');
  const [outletAddress, setOutletAddress] = useState('');
  const [outletCity, setOutletCity] = useState('Pekalongan');
  const [outletWarehouseId, setOutletWarehouseId] = useState('1');
  const [outletStatus, setOutletStatus] = useState<'Aktif' | 'Non-Aktif' | 'Maintenance'>('Aktif');

  // Form Terminal Fields
  const [terminalCode, setTerminalCode] = useState('');
  const [terminalName, setTerminalName] = useState('');
  const [terminalOutletId, setTerminalOutletId] = useState<number>(1);
  const [terminalCashierName, setTerminalCashierName] = useState('');
  const [terminalDeviceName, setTerminalDeviceName] = useState('');
  const [terminalIp, setTerminalIp] = useState('192.168.1.105');
  const [terminalMethods, setTerminalMethods] = useState<string[]>(['Tunai', 'QRIS BCA']);
  const [terminalShiftStatus, setTerminalShiftStatus] = useState<'Buka Shift' | 'Tutup Shift'>('Buka Shift');
  const [terminalStatus, setTerminalStatus] = useState<'Aktif' | 'Non-Aktif'>('Aktif');

  // Delete Target Modal
  const [deleteTarget, setDeleteTarget] = useState<{
    type: 'outlet' | 'terminal';
    id: number;
    name: string;
  } | null>(null);

  // Current Active Outlet Object
  const currentActiveOutlet = useMemo(() => {
    return outlets.find((o) => o.id === currentActiveOutletId) || outlets[0];
  }, [outlets, currentActiveOutletId]);

  // Total Metrics
  const summaryMetrics = useMemo(() => {
    const totalBranches = outlets.length;
    const activeBranches = outlets.filter((o) => o.status === 'Aktif').length;
    const totalTerminals = terminals.length;
    const activeTerminals = terminals.filter((t) => t.status === 'Aktif' && t.shift_status === 'Buka Shift').length;
    const totalTodaySales = outlets.reduce((sum, o) => sum + (o.today_sales || 0), 0);
    const totalMonthlySales = outlets.reduce((sum, o) => sum + (o.monthly_sales || 0), 0);

    return {
      totalBranches,
      activeBranches,
      totalTerminals,
      activeTerminals,
      totalTodaySales,
      totalMonthlySales,
    };
  }, [outlets, terminals]);

  // Filtered Outlets
  const filteredOutlets = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return outlets;
    return outlets.filter(
      (o) =>
        o.outlet_name.toLowerCase().includes(q) ||
        o.outlet_code.toLowerCase().includes(q) ||
        o.pic_name.toLowerCase().includes(q) ||
        o.city.toLowerCase().includes(q)
    );
  }, [outlets, searchQuery]);

  // Filtered Terminals
  const filteredTerminals = useMemo(() => {
    return terminals.filter((t) => {
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        t.terminal_name.toLowerCase().includes(q) ||
        t.terminal_code.toLowerCase().includes(q) ||
        t.cashier_name.toLowerCase().includes(q) ||
        t.outlet_name.toLowerCase().includes(q);

      const matchOutlet =
        selectedOutletFilter === 'all' || t.outlet_id === Number(selectedOutletFilter);

      return matchSearch && matchOutlet;
    });
  }, [terminals, searchQuery, selectedOutletFilter]);

  // ==========================================
  // HANDLERS: OUTLET CRUD
  // ==========================================
  const handleOpenAddOutlet = () => {
    setEditingOutlet(null);
    const nextNum = outlets.length + 1;
    setOutletCode(`OTL-${String(nextNum).padStart(3, '0')}`);
    setOutletName('');
    setOutletType('Cabang');
    setOutletPic('');
    setOutletPhone('');
    setOutletAddress('');
    setOutletCity('Pekalongan');
    setOutletWarehouseId(INITIAL_WAREHOUSES[0]?.id || '1');
    setOutletStatus('Aktif');
    setIsOutletModalOpen(true);
  };

  const handleOpenEditOutlet = (outlet: OutletItem) => {
    setEditingOutlet(outlet);
    setOutletCode(outlet.outlet_code);
    setOutletName(outlet.outlet_name);
    setOutletType(outlet.type);
    setOutletPic(outlet.pic_name);
    setOutletPhone(outlet.phone);
    setOutletAddress(outlet.address);
    setOutletCity(outlet.city);
    setOutletWarehouseId(outlet.warehouse_id || '1');
    setOutletStatus(outlet.status);
    setIsOutletModalOpen(true);
  };

  const handleSaveOutlet = (e: React.FormEvent) => {
    e.preventDefault();

    if (!outletCode.trim() || !outletName.trim()) {
      alert('Kode outlet dan nama outlet wajib diisi!');
      return;
    }

    const wh = INITIAL_WAREHOUSES.find((w) => w.id === outletWarehouseId);
    const whName = wh?.warehouse_name || 'Gudang Pusat Jetakkidul';

    if (!editingOutlet) {
      // Check duplicate code
      const check = outlets.some(
        (o) => o.outlet_code.toLowerCase() === outletCode.trim().toLowerCase()
      );
      if (check) {
        if (onShowToast) {
          onShowToast('warning', 'Kode Outlet Duplikat', `Kode '${outletCode}' sudah digunakan!`);
        } else {
          alert(`Kode '${outletCode}' sudah digunakan!`);
        }
        return;
      }

      const newOutlet: OutletItem = {
        id: outlets.length > 0 ? Math.max(...outlets.map((o) => o.id)) + 1 : 1,
        outlet_code: outletCode.trim(),
        outlet_name: outletName.trim(),
        type: outletType,
        pic_name: outletPic.trim() || 'Staff KDMP',
        phone: outletPhone.trim() || '-',
        address: outletAddress.trim() || 'Pekalongan',
        city: outletCity.trim() || 'Pekalongan',
        warehouse_id: outletWarehouseId,
        warehouse_name: whName,
        pos_terminal_count: 0,
        today_sales: 0,
        monthly_sales: 0,
        status: outletStatus,
        is_main: false,
      };

      setOutlets([...outlets, newOutlet]);
      setIsOutletModalOpen(false);
      if (onShowToast) {
        onShowToast('success', 'Outlet Berhasil Ditambahkan', `Cabang ${newOutlet.outlet_name} telah terdaftar.`);
      }
    } else {
      // Edit Outlet
      setOutlets((prev) =>
        prev.map((o) => {
          if (o.id === editingOutlet.id) {
            return {
              ...o,
              outlet_code: outletCode.trim(),
              outlet_name: outletName.trim(),
              type: outletType,
              pic_name: outletPic.trim(),
              phone: outletPhone.trim(),
              address: outletAddress.trim(),
              city: outletCity.trim(),
              warehouse_id: outletWarehouseId,
              warehouse_name: whName,
              status: outletStatus,
            };
          }
          return o;
        })
      );

      // Update terminal outlet_name
      setTerminals((prev) =>
        prev.map((t) => (t.outlet_id === editingOutlet.id ? { ...t, outlet_name: outletName.trim() } : t))
      );

      setIsOutletModalOpen(false);
      if (onShowToast) {
        onShowToast('success', 'Outlet Diperbarui', `Informasi cabang ${outletName} berhasil diperbarui.`);
      }
    }
  };

  // ==========================================
  // HANDLERS: TERMINAL CRUD
  // ==========================================
  const handleOpenAddTerminal = () => {
    setEditingTerminal(null);
    const nextNum = terminals.length + 1;
    setTerminalCode(`POS-${String(nextNum).padStart(2, '0')}`);
    setTerminalName('');
    setTerminalOutletId(outlets[0]?.id || 1);
    setTerminalCashierName('');
    setTerminalDeviceName('POS Terminal Standard');
    setTerminalIp(`192.168.1.${100 + nextNum}`);
    setTerminalMethods(['Tunai', 'QRIS BCA']);
    setTerminalShiftStatus('Buka Shift');
    setTerminalStatus('Aktif');
    setIsTerminalModalOpen(true);
  };

  const handleOpenEditTerminal = (terminal: PosTerminalItem) => {
    setEditingTerminal(terminal);
    setTerminalCode(terminal.terminal_code);
    setTerminalName(terminal.terminal_name);
    setTerminalOutletId(terminal.outlet_id);
    setTerminalCashierName(terminal.cashier_name);
    setTerminalDeviceName(terminal.device_name);
    setTerminalIp(terminal.ip_address);
    setTerminalMethods(terminal.payment_methods);
    setTerminalShiftStatus(terminal.shift_status);
    setTerminalStatus(terminal.status);
    setIsTerminalModalOpen(true);
  };

  const handleSaveTerminal = (e: React.FormEvent) => {
    e.preventDefault();

    if (!terminalCode.trim() || !terminalName.trim()) {
      alert('Kode dan nama terminal wajib diisi!');
      return;
    }

    const targetOutlet = outlets.find((o) => o.id === terminalOutletId);
    const otName = targetOutlet?.outlet_name || 'Outlet KDMP';

    if (!editingTerminal) {
      const newTerminal: PosTerminalItem = {
        id: terminals.length > 0 ? Math.max(...terminals.map((t) => t.id)) + 1 : 1,
        terminal_code: terminalCode.trim(),
        terminal_name: terminalName.trim(),
        outlet_id: terminalOutletId,
        outlet_name: otName,
        cashier_name: terminalCashierName.trim() || 'Kasir Bertugas',
        device_name: terminalDeviceName.trim() || 'POS Device',
        ip_address: terminalIp.trim() || '192.168.1.100',
        payment_methods: terminalMethods,
        shift_status: terminalShiftStatus,
        status: terminalStatus,
      };

      setTerminals([...terminals, newTerminal]);

      // Update terminal count in outlet
      setOutlets((prev) =>
        prev.map((o) =>
          o.id === terminalOutletId ? { ...o, pos_terminal_count: (o.pos_terminal_count || 0) + 1 } : o
        )
      );

      setIsTerminalModalOpen(false);
      if (onShowToast) {
        onShowToast('success', 'Terminal Ditambahkan', `Terminal ${newTerminal.terminal_name} siap digunakan di ${otName}.`);
      }
    } else {
      setTerminals((prev) =>
        prev.map((t) => {
          if (t.id === editingTerminal.id) {
            return {
              ...t,
              terminal_code: terminalCode.trim(),
              terminal_name: terminalName.trim(),
              outlet_id: terminalOutletId,
              outlet_name: otName,
              cashier_name: terminalCashierName.trim(),
              device_name: terminalDeviceName.trim(),
              ip_address: terminalIp.trim(),
              payment_methods: terminalMethods,
              shift_status: terminalShiftStatus,
              status: terminalStatus,
            };
          }
          return t;
        })
      );

      setIsTerminalModalOpen(false);
      if (onShowToast) {
        onShowToast('success', 'Terminal Diperbarui', `Terminal ${terminalName} berhasil disimpan.`);
      }
    }
  };

  const handleToggleShift = (terminal: PosTerminalItem) => {
    const newStatus = terminal.shift_status === 'Buka Shift' ? 'Tutup Shift' : 'Buka Shift';
    setTerminals((prev) =>
      prev.map((t) => (t.id === terminal.id ? { ...t, shift_status: newStatus } : t))
    );

    if (onShowToast) {
      onShowToast(
        newStatus === 'Buka Shift' ? 'success' : 'info',
        `Shift ${newStatus}`,
        `Terminal ${terminal.terminal_code} (${terminal.terminal_name}) sekarang dalam status ${newStatus}.`
      );
    }
  };

  // ==========================================
  // CONFIRM DELETE
  // ==========================================
  const handleExecuteDelete = () => {
    if (!deleteTarget) return;

    if (deleteTarget.type === 'outlet') {
      if (deleteTarget.id === 1) {
        if (onShowToast) {
          onShowToast('warning', 'Pencegahan Sistem', 'Outlet Pusat utama (ID 1) tidak dapat dihapus!');
        } else {
          alert('Outlet Pusat utama tidak dapat dihapus!');
        }
        setDeleteTarget(null);
        return;
      }

      setOutlets((prev) => prev.filter((o) => o.id !== deleteTarget.id));
      setTerminals((prev) => prev.filter((t) => t.outlet_id !== deleteTarget.id));

      if (currentActiveOutletId === deleteTarget.id) {
        setCurrentActiveOutletId(1);
      }

      if (onShowToast) {
        onShowToast('success', 'Outlet Dihapus', `Cabang ${deleteTarget.name} berhasil dihapus dari sistem.`);
      }
    } else {
      setTerminals((prev) => prev.filter((t) => t.id !== deleteTarget.id));
      if (onShowToast) {
        onShowToast('success', 'Terminal Dihapus', `Terminal ${deleteTarget.name} berhasil dihapus.`);
      }
    }

    setDeleteTarget(null);
  };

  // Switch Active Branch
  const handleSwitchBranch = (outletId: number) => {
    setCurrentActiveOutletId(outletId);
    setIsSwitchModalOpen(false);
    const selected = outlets.find((o) => o.id === outletId);
    if (onShowToast) {
      onShowToast(
        'success',
        'Outlet Aktif Berpindah',
        `Sesi kerja saat ini dialihkan ke: ${selected?.outlet_name || 'Outlet KDMP'}.`
      );
    }
  };

  return (
    <div className="space-y-4">
      {/* 1. CARD UTAMA KDMP: HEADER & ACTIVE BRANCH BAR */}
      <div className="bg-white rounded-xl border border-[#E0E0E0] p-4 sm:p-5 shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-[#D32F2F] shrink-0 border border-red-100">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h5 className="text-base font-bold text-gray-900">
                  Multi Outlet & Cabang Toko
                </h5>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                  Online Multi-Branch
                </span>
              </div>
              <p className="text-xs text-gray-500">
                Outlet Sesi Aktif Anda:{' '}
                <strong className="text-[#D32F2F]">{currentActiveOutlet.outlet_name}</strong>{' '}
                ({currentActiveOutlet.outlet_code}) • {currentActiveOutlet.city}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => setIsSwitchModalOpen(true)}
              className="px-3 py-1.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-bold rounded-lg shadow-xs flex items-center gap-1.5 transition-colors"
            >
              <ArrowRightLeft className="w-3.5 h-3.5 text-blue-600" />
              <span>Ganti Outlet Aktif</span>
            </button>

            <button
              type="button"
              onClick={handleOpenAddOutlet}
              className="px-3.5 py-1.5 bg-[#D32F2F] hover:bg-[#B71C1C] text-white text-xs font-bold rounded-lg shadow-xs flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Outlet</span>
            </button>
          </div>
        </div>

        {/* Search & Sub-Filter Bar */}
        <div className="pt-3 border-t border-gray-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                activeTab === 'outlets'
                  ? 'Cari nama cabang / kode / PIC...'
                  : activeTab === 'terminals'
                  ? 'Cari terminal kasir / kasir...'
                  : 'Cari performa cabang...'
              }
              className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-3 py-1.5 text-xs text-gray-700 focus:outline-none focus:ring-1 focus:ring-red-500"
            />
          </div>

          {activeTab === 'terminals' && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400 font-medium whitespace-nowrap">Filter Cabang:</span>
              <select
                value={selectedOutletFilter}
                onChange={(e) => setSelectedOutletFilter(e.target.value)}
                className="bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs text-gray-700 focus:outline-none focus:ring-1 focus:ring-red-500 font-medium"
              >
                <option value="all">Semua Cabang ({outlets.length})</option>
                {outlets.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.outlet_name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* 2. SUMMARY KPI CARDS (4 BARIS METRIK KEUANGAN CABANG) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3.5">
        {/* Card 1: Total Outlet Cabang */}
        <div className="p-3.5 rounded-xl shadow-xs border-l-4 border-blue-500 bg-[#e3f2fd] flex items-center justify-between">
          <div>
            <p className="text-[12px] text-gray-500 font-medium mb-0.5">Total Outlet Toko</p>
            <h5 className="text-lg font-bold text-[#0d47a1] whitespace-nowrap">
              {summaryMetrics.totalBranches} Lokasi
            </h5>
            <span className="text-[10px] text-blue-700 font-medium">
              {summaryMetrics.activeBranches} Cabang Beroperasi Aktif
            </span>
          </div>
          <div className="bg-white p-2.5 rounded-xl text-blue-600 shadow-xs">
            <Building2 className="w-5 h-5" />
          </div>
        </div>

        {/* Card 2: Titik Terminal Kasir POS */}
        <div className="p-3.5 rounded-xl shadow-xs border-l-4 border-emerald-500 bg-[#e8f5e9] flex items-center justify-between">
          <div>
            <p className="text-[12px] text-gray-500 font-medium mb-0.5">Terminal Kasir POS</p>
            <h5 className="text-lg font-bold text-[#1b5e20] whitespace-nowrap">
              {summaryMetrics.totalTerminals} Terminal
            </h5>
            <span className="text-[10px] text-emerald-700 font-bold">
              {summaryMetrics.activeTerminals} Kasir Sedang Buka Shift
            </span>
          </div>
          <div className="bg-white p-2.5 rounded-xl text-emerald-600 shadow-xs">
            <MonitorCheck className="w-5 h-5" />
          </div>
        </div>

        {/* Card 3: Omset Hari Ini Seluruh Cabang */}
        <div className="p-3.5 rounded-xl shadow-xs border-l-4 border-indigo-500 bg-[#ede7f6] flex items-center justify-between">
          <div>
            <p className="text-[12px] text-gray-500 font-medium mb-0.5">Omset Hari Ini (Gabungan)</p>
            <h5 className="text-lg font-bold text-[#311b92] whitespace-nowrap">
              Rp {summaryMetrics.totalTodaySales.toLocaleString('id-ID')}
            </h5>
            <span className="text-[10px] text-indigo-700 font-medium">
              Akumulasi 4 cabang toko
            </span>
          </div>
          <div className="bg-white p-2.5 rounded-xl text-indigo-600 shadow-xs">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>

        {/* Card 4: Penjualan Bulan Ini */}
        <div className="p-3.5 rounded-xl shadow-xs border-l-4 border-amber-500 bg-[#fff3e0] flex items-center justify-between">
          <div>
            <p className="text-[12px] text-gray-500 font-medium mb-0.5">Omset Bulan Ini (Okt 2024)</p>
            <h5 className="text-lg font-bold text-[#e65100] whitespace-nowrap">
              Rp {summaryMetrics.totalMonthlySales.toLocaleString('id-ID')}
            </h5>
            <span className="text-[10px] text-amber-700 font-medium">
              Target Koperasi: Rp 120.000.000
            </span>
          </div>
          <div className="bg-white p-2.5 rounded-xl text-amber-600 shadow-xs">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* 3. CARD BODY: TAB NAVIGASI & TABEL DATA */}
      <div className="bg-white rounded-xl border border-[#E0E0E0] shadow-xs overflow-hidden">
        {/* TAB NAVIGATION (nav-tabs-kdmp) */}
        <div className="border-b border-[#E0E0E0] px-4 pt-3 flex gap-2 overflow-x-auto scrollbar-none bg-gray-50/50">
          <button
            type="button"
            onClick={() => setActiveTab('outlets')}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors ${
              activeTab === 'outlets'
                ? 'border-[#D32F2F] text-[#D32F2F] bg-white rounded-t-lg shadow-xs'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Store className="w-3.5 h-3.5" />
            <span>Daftar Cabang & Outlet ({outlets.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('terminals')}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors ${
              activeTab === 'terminals'
                ? 'border-[#D32F2F] text-[#D32F2F] bg-white rounded-t-lg shadow-xs'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <MonitorCheck className="w-3.5 h-3.5" />
            <span>Terminal Kasir POS ({terminals.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('performance')}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors ${
              activeTab === 'performance'
                ? 'border-[#D32F2F] text-[#D32F2F] bg-white rounded-t-lg shadow-xs'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Perbandingan Performa Cabang</span>
          </button>
        </div>

        {/* TAB CONTENTS */}
        <div className="p-4 sm:p-5">
          {/* ======================================================== */}
          {/* TAB 1: DAFTAR CABANG & OUTLET                            */}
          {/* ======================================================== */}
          {activeTab === 'outlets' && (
            <div className="space-y-4">
              <div className="border border-gray-200 rounded-xl overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 font-bold uppercase text-[10.5px] tracking-wider">
                        <th className="py-3 px-3.5 w-12 text-center">No</th>
                        <th className="py-3 px-3.5">Kode & Nama Outlet</th>
                        <th className="py-3 px-3.5">Tipe Cabang</th>
                        <th className="py-3 px-3.5">Kepala Toko (PIC)</th>
                        <th className="py-3 px-3.5">Alamat & Kota</th>
                        <th className="py-3 px-3.5 text-center">Kasir POS</th>
                        <th className="py-3 px-3.5 text-right">Omset Hari Ini</th>
                        <th className="py-3 px-3.5 text-center">Status</th>
                        <th className="py-3 px-3.5 text-end">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 font-medium">
                      {filteredOutlets.length === 0 ? (
                        <tr>
                          <td colSpan={9} className="py-8 text-center text-gray-400">
                            Tidak ada data outlet yang cocok dengan pencarian.
                          </td>
                        </tr>
                      ) : (
                        filteredOutlets.map((outlet, idx) => (
                          <tr key={outlet.id} className="hover:bg-gray-50/80 transition-colors">
                            <td className="py-3 px-3.5 text-center text-gray-400 font-mono text-[11px]">
                              {idx + 1}
                            </td>
                            <td className="py-3 px-3.5">
                              <div className="flex items-center gap-2">
                                <div>
                                  <div className="flex items-center gap-1.5">
                                    <span className="font-bold text-gray-900 block">
                                      {outlet.outlet_name}
                                    </span>
                                    {outlet.id === currentActiveOutletId && (
                                      <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-red-100 text-[#D32F2F] border border-red-200">
                                        Aktif Digunakan
                                      </span>
                                    )}
                                  </div>
                                  <span className="text-[10px] text-gray-400 font-mono">
                                    {outlet.outlet_code} • {outlet.warehouse_name}
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-3.5">
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                                  outlet.type === 'Pusat'
                                    ? 'bg-red-50 text-[#D32F2F] border border-red-200'
                                    : outlet.type === 'Cabang'
                                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                    : 'bg-amber-50 text-amber-700 border border-amber-200'
                                }`}
                              >
                                {outlet.type}
                              </span>
                            </td>
                            <td className="py-3 px-3.5">
                              <div className="text-gray-800 font-semibold">{outlet.pic_name}</div>
                              <div className="text-[10px] text-gray-400 font-mono">{outlet.phone}</div>
                            </td>
                            <td className="py-3 px-3.5 text-gray-600 max-w-xs">
                              <div>{outlet.address}</div>
                              <span className="text-[10px] font-bold text-gray-400 uppercase">
                                {outlet.city}
                              </span>
                            </td>
                            <td className="py-3 px-3.5 text-center font-bold text-blue-700 font-mono">
                              {terminals.filter((t) => t.outlet_id === outlet.id).length} Kasir
                            </td>
                            <td className="py-3 px-3.5 text-right font-bold text-gray-900 font-mono">
                              Rp {outlet.today_sales.toLocaleString('id-ID')}
                            </td>
                            <td className="py-3 px-3.5 text-center">
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                  outlet.status === 'Aktif'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : outlet.status === 'Maintenance'
                                    ? 'bg-amber-100 text-amber-800'
                                    : 'bg-gray-100 text-gray-600'
                                }`}
                              >
                                {outlet.status}
                              </span>
                            </td>
                            <td className="py-3 px-3.5 text-end">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => handleOpenEditOutlet(outlet)}
                                  className="p-1.5 rounded-lg text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                                  title="Edit Outlet"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() =>
                                    setDeleteTarget({
                                      type: 'outlet',
                                      id: outlet.id,
                                      name: outlet.outlet_name,
                                    })
                                  }
                                  className={`p-1.5 rounded-lg transition-colors ${
                                    outlet.id === 1
                                      ? 'text-gray-300 cursor-not-allowed'
                                      : 'text-gray-500 hover:text-red-600 hover:bg-red-50'
                                  }`}
                                  title={outlet.id === 1 ? 'Outlet Pusat tidak bisa dihapus' : 'Hapus Outlet'}
                                  disabled={outlet.id === 1}
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
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 2: ALOKASI TERMINAL KASIR POS                        */}
          {/* ======================================================== */}
          {activeTab === 'terminals' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center flex-wrap gap-2">
                <span className="text-xs text-gray-500">
                  Total perangkat kasir terdaftar: <strong className="text-gray-800">{terminals.length}</strong> unit
                </span>

                <button
                  type="button"
                  onClick={handleOpenAddTerminal}
                  className="px-3.5 py-1.5 bg-[#D32F2F] hover:bg-[#B71C1C] text-white text-xs font-bold rounded-lg shadow-xs flex items-center gap-1.5 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah Terminal Kasir</span>
                </button>
              </div>

              <div className="border border-gray-200 rounded-xl overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 font-bold uppercase text-[10.5px] tracking-wider">
                        <th className="py-3 px-3.5 w-12 text-center">No</th>
                        <th className="py-3 px-3.5">Terminal & Perangkat</th>
                        <th className="py-3 px-3.5">Cabang Penempatan</th>
                        <th className="py-3 px-3.5">Kasir Bertugas</th>
                        <th className="py-3 px-3.5">Metode Bayar</th>
                        <th className="py-3 px-3.5 text-center">Status Shift</th>
                        <th className="py-3 px-3.5 text-center">Status Alat</th>
                        <th className="py-3 px-3.5 text-end">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 font-medium">
                      {filteredTerminals.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="py-8 text-center text-gray-400">
                            Tidak ada terminal kasir yang cocok.
                          </td>
                        </tr>
                      ) : (
                        filteredTerminals.map((terminal, idx) => (
                          <tr key={terminal.id} className="hover:bg-gray-50/80 transition-colors">
                            <td className="py-3 px-3.5 text-center text-gray-400 font-mono text-[11px]">
                              {idx + 1}
                            </td>
                            <td className="py-3 px-3.5">
                              <span className="font-bold text-gray-900 block font-mono">
                                {terminal.terminal_code} - {terminal.terminal_name}
                              </span>
                              <span className="text-[10px] text-gray-400">
                                {terminal.device_name} • IP: {terminal.ip_address}
                              </span>
                            </td>
                            <td className="py-3 px-3.5 text-gray-800 font-semibold">
                              {terminal.outlet_name}
                            </td>
                            <td className="py-3 px-3.5">
                              <div className="flex items-center gap-1.5">
                                <User className="w-3.5 h-3.5 text-gray-400" />
                                <span className="font-medium text-gray-900">{terminal.cashier_name}</span>
                              </div>
                            </td>
                            <td className="py-3 px-3.5">
                              <div className="flex flex-wrap gap-1">
                                {terminal.payment_methods.map((pm, pIdx) => (
                                  <span
                                    key={pIdx}
                                    className="text-[9.5px] font-bold px-1.5 py-0.5 rounded bg-gray-100 text-gray-700"
                                  >
                                    {pm}
                                  </span>
                                ))}
                              </div>
                            </td>
                            <td className="py-3 px-3.5 text-center">
                              <button
                                type="button"
                                onClick={() => handleToggleShift(terminal)}
                                className={`text-[10px] font-bold px-2 py-0.5 rounded border flex items-center justify-center gap-1 mx-auto transition-colors ${
                                  terminal.shift_status === 'Buka Shift'
                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                                    : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                                }`}
                                title="Klik untuk Buka/Tutup Shift"
                              >
                                <Power className="w-2.5 h-2.5" />
                                <span>{terminal.shift_status}</span>
                              </button>
                            </td>
                            <td className="py-3 px-3.5 text-center">
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                  terminal.status === 'Aktif'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : 'bg-gray-100 text-gray-600'
                                }`}
                              >
                                {terminal.status}
                              </span>
                            </td>
                            <td className="py-3 px-3.5 text-end">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => handleOpenEditTerminal(terminal)}
                                  className="p-1.5 rounded-lg text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                                  title="Edit Terminal"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() =>
                                    setDeleteTarget({
                                      type: 'terminal',
                                      id: terminal.id,
                                      name: `${terminal.terminal_code} (${terminal.terminal_name})`,
                                    })
                                  }
                                  className="p-1.5 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                                  title="Hapus Terminal"
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
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 3: PERBANDINGAN PERFORMA CABANG                      */}
          {/* ======================================================== */}
          {activeTab === 'performance' && (
            <div className="space-y-6">
              <div className="border border-gray-200 rounded-xl p-4 bg-gray-50/50 space-y-3">
                <h6 className="text-xs font-bold text-gray-800 uppercase tracking-wider">
                  Distribusi Penjualan Cabang (Bulan Ini)
                </h6>
                <div className="space-y-3">
                  {outlets.map((o) => {
                    const pct = ((o.monthly_sales / summaryMetrics.totalMonthlySales) * 100).toFixed(1);
                    return (
                      <div key={o.id} className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="font-semibold text-gray-800">
                            {o.outlet_name} ({o.type})
                          </span>
                          <span className="font-mono font-bold text-gray-900">
                            Rp {o.monthly_sales.toLocaleString('id-ID')} ({pct}%)
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                          <div
                            className={`h-2.5 rounded-full ${
                              o.type === 'Pusat'
                                ? 'bg-[#D32F2F]'
                                : o.type === 'Cabang'
                                ? 'bg-blue-600'
                                : 'bg-amber-500'
                            }`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Performance Table */}
              <div className="border border-gray-200 rounded-xl overflow-hidden shadow-xs">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 font-bold uppercase text-[10.5px] tracking-wider">
                      <th className="py-3 px-3.5">Nama Cabang</th>
                      <th className="py-3 px-3.5">Tipe</th>
                      <th className="py-3 px-3.5 text-center">Jumlah Kasir</th>
                      <th className="py-3 px-3.5 text-right">Omset Hari Ini</th>
                      <th className="py-3 px-3.5 text-right">Omset Bulan Ini</th>
                      <th className="py-3 px-3.5 text-center">Kontribusi (%)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 font-medium">
                    {outlets.map((o) => {
                      const pct = ((o.monthly_sales / summaryMetrics.totalMonthlySales) * 100).toFixed(1);
                      return (
                        <tr key={o.id} className="hover:bg-gray-50">
                          <td className="py-3 px-3.5 font-bold text-gray-900">{o.outlet_name}</td>
                          <td className="py-3 px-3.5">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-gray-100 text-gray-700">
                              {o.type}
                            </span>
                          </td>
                          <td className="py-3 px-3.5 text-center font-bold text-blue-600 font-mono">
                            {terminals.filter((t) => t.outlet_id === o.id).length} Unit
                          </td>
                          <td className="py-3 px-3.5 text-right font-mono font-semibold text-gray-800">
                            Rp {o.today_sales.toLocaleString('id-ID')}
                          </td>
                          <td className="py-3 px-3.5 text-right font-mono font-bold text-gray-900">
                            Rp {o.monthly_sales.toLocaleString('id-ID')}
                          </td>
                          <td className="py-3 px-3.5 text-center font-bold text-emerald-700 font-mono">
                            {pct}%
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ======================================================== */}
      {/* MODAL 1: TAMBAH / EDIT OUTLET CABANG                    */}
      {/* ======================================================== */}
      {isOutletModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between bg-white">
              <h5 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                <Store className="w-4 h-4 text-[#D32F2F]" />
                {editingOutlet ? 'Edit Outlet Cabang' : 'Tambah Outlet Baru'}
              </h5>
              <button
                type="button"
                onClick={() => setIsOutletModalOpen(false)}
                className="p-1 rounded text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveOutlet} className="p-5 space-y-3 text-xs max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">
                    Kode Outlet <span className="text-[#D32F2F]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={outletCode}
                    onChange={(e) => setOutletCode(e.target.value)}
                    placeholder="Contoh: OTL-005"
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-800 font-mono focus:outline-none focus:ring-1 focus:ring-red-500 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Tipe Outlet</label>
                  <select
                    value={outletType}
                    onChange={(e) => setOutletType(e.target.value as any)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-2 text-xs text-gray-800 focus:outline-none focus:ring-1 focus:ring-red-500 font-medium"
                  >
                    <option value="Pusat">Pusat</option>
                    <option value="Cabang">Cabang Mandiri</option>
                    <option value="Kios">Kios</option>
                    <option value="Mitra">Mitra Kemitraan</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">
                  Nama Outlet / Cabang <span className="text-[#D32F2F]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={outletName}
                  onChange={(e) => setOutletName(e.target.value)}
                  placeholder="Contoh: Cabang KDMP Wiradesa"
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-800 focus:outline-none focus:ring-1 focus:ring-red-500 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Kepala Cabang (PIC)</label>
                  <input
                    type="text"
                    value={outletPic}
                    onChange={(e) => setOutletPic(e.target.value)}
                    placeholder="Nama penanggung jawab"
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-800 focus:outline-none focus:ring-1 focus:ring-red-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-1">No. Telepon / WhatsApp</label>
                  <input
                    type="text"
                    value={outletPhone}
                    onChange={(e) => setOutletPhone(e.target.value)}
                    placeholder="0812-xxxx-xxxx"
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-800 font-mono focus:outline-none focus:ring-1 focus:ring-red-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">Alamat Lengkap</label>
                <textarea
                  rows={2}
                  value={outletAddress}
                  onChange={(e) => setOutletAddress(e.target.value)}
                  placeholder="Jl. Raya ..."
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-800 focus:outline-none focus:ring-1 focus:ring-red-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Kota / Kabupaten</label>
                  <input
                    type="text"
                    value={outletCity}
                    onChange={(e) => setOutletCity(e.target.value)}
                    placeholder="Pekalongan"
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-800 focus:outline-none focus:ring-1 focus:ring-red-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Gudang Pasokan Utama</label>
                  <select
                    value={outletWarehouseId}
                    onChange={(e) => setOutletWarehouseId(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-2 text-xs text-gray-800 focus:outline-none focus:ring-1 focus:ring-red-500 font-medium"
                  >
                    {INITIAL_WAREHOUSES.map((w) => (
                      <option key={w.id} value={w.id}>
                        {w.warehouse_name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">Status Operasional</label>
                <select
                  value={outletStatus}
                  onChange={(e) => setOutletStatus(e.target.value as any)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-2 text-xs text-gray-800 focus:outline-none focus:ring-1 focus:ring-red-500 font-medium"
                >
                  <option value="Aktif">Aktif (Buka Operasional)</option>
                  <option value="Maintenance">Maintenance / Renovasi</option>
                  <option value="Non-Aktif">Non-Aktif (Tutup Sementara)</option>
                </select>
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsOutletModalOpen(false)}
                  className="px-3.5 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-lg text-xs"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#D32F2F] hover:bg-[#B71C1C] text-white font-bold rounded-lg text-xs shadow-xs"
                >
                  Simpan Cabang
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 2: TAMBAH / EDIT TERMINAL KASIR POS               */}
      {/* ======================================================== */}
      {isTerminalModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between bg-white">
              <h5 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                <MonitorCheck className="w-4 h-4 text-[#D32F2F]" />
                {editingTerminal ? 'Edit Terminal Kasir' : 'Tambah Terminal Kasir POS'}
              </h5>
              <button
                type="button"
                onClick={() => setIsTerminalModalOpen(false)}
                className="p-1 rounded text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveTerminal} className="p-5 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">
                    Kode Terminal <span className="text-[#D32F2F]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={terminalCode}
                    onChange={(e) => setTerminalCode(e.target.value)}
                    placeholder="Contoh: POS-07"
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-800 font-mono font-bold focus:outline-none focus:ring-1 focus:ring-red-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-1">
                    Outlet Cabang <span className="text-[#D32F2F]">*</span>
                  </label>
                  <select
                    value={terminalOutletId}
                    onChange={(e) => setTerminalOutletId(Number(e.target.value))}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-2 text-xs text-gray-800 focus:outline-none focus:ring-1 focus:ring-red-500 font-medium"
                  >
                    {outlets.map((o) => (
                      <option key={o.id} value={o.id}>
                        {o.outlet_name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">
                  Nama Terminal / Posisi <span className="text-[#D32F2F]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={terminalName}
                  onChange={(e) => setTerminalName(e.target.value)}
                  placeholder="Contoh: Kasir Pintu Barat"
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-800 focus:outline-none focus:ring-1 focus:ring-red-500 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Kasir Bertugas</label>
                  <input
                    type="text"
                    value={terminalCashierName}
                    onChange={(e) => setTerminalCashierName(e.target.value)}
                    placeholder="Nama kasir"
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-800 focus:outline-none focus:ring-1 focus:ring-red-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-1">IP Address Perangkat</label>
                  <input
                    type="text"
                    value={terminalIp}
                    onChange={(e) => setTerminalIp(e.target.value)}
                    placeholder="192.168.1.xxx"
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-800 font-mono focus:outline-none focus:ring-1 focus:ring-red-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Status Shift</label>
                  <select
                    value={terminalShiftStatus}
                    onChange={(e) => setTerminalShiftStatus(e.target.value as any)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-2 text-xs text-gray-800 focus:outline-none focus:ring-1 focus:ring-red-500 font-medium"
                  >
                    <option value="Buka Shift">Buka Shift</option>
                    <option value="Tutup Shift">Tutup Shift</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Status Alat</label>
                  <select
                    value={terminalStatus}
                    onChange={(e) => setTerminalStatus(e.target.value as any)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-2 text-xs text-gray-800 focus:outline-none focus:ring-1 focus:ring-red-500 font-medium"
                  >
                    <option value="Aktif">Aktif</option>
                    <option value="Non-Aktif">Non-Aktif</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsTerminalModalOpen(false)}
                  className="px-3.5 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-lg text-xs"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#D32F2F] hover:bg-[#B71C1C] text-white font-bold rounded-lg text-xs shadow-xs"
                >
                  Simpan Terminal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 3: SWITCH ACTIVE OUTLET                           */}
      {/* ======================================================== */}
      {isSwitchModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <h5 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                <ArrowRightLeft className="w-4 h-4 text-[#D32F2F]" />
                Pindah Outlet Aktif
              </h5>
              <button
                type="button"
                onClick={() => setIsSwitchModalOpen(false)}
                className="p-1 rounded text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-gray-500">
              Pilih cabang toko yang ingin Anda kelola dan gunakan untuk transaksi POS kasir saat ini:
            </p>

            <div className="space-y-2 max-h-64 overflow-y-auto">
              {outlets.map((o) => (
                <div
                  key={o.id}
                  onClick={() => handleSwitchBranch(o.id)}
                  className={`p-3 rounded-xl border text-xs cursor-pointer transition-all flex items-center justify-between ${
                    o.id === currentActiveOutletId
                      ? 'border-[#D32F2F] bg-red-50/50 shadow-xs'
                      : 'border-gray-200 hover:border-red-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-900">{o.outlet_name}</span>
                      <span className="text-[9.5px] font-bold px-1.5 py-0.2 rounded bg-gray-100 text-gray-600">
                        {o.type}
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-500">
                      {o.address} • PIC: {o.pic_name}
                    </p>
                  </div>
                  {o.id === currentActiveOutletId ? (
                    <span className="text-[10px] font-bold text-[#D32F2F] bg-red-100 px-2 py-0.5 rounded">
                      Aktif
                    </span>
                  ) : (
                    <span className="text-[11px] font-medium text-blue-600 hover:underline">
                      Pilih
                    </span>
                  )}
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-gray-100 flex justify-end">
              <button
                type="button"
                onClick={() => setIsSwitchModalOpen(false)}
                className="px-4 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-lg text-xs"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 4: KONFIRMASI HAPUS                                */}
      {/* ======================================================== */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-red-50 text-[#D32F2F] flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <h5 className="text-sm font-bold text-gray-900">
              Konfirmasi Hapus {deleteTarget.type === 'outlet' ? 'Cabang Outlet' : 'Terminal POS'}
            </h5>

            <p className="text-xs text-gray-500">
              Apakah Anda yakin ingin menghapus {deleteTarget.type === 'outlet' ? 'cabang' : 'terminal'}{' '}
              <strong className="text-gray-800">{deleteTarget.name}</strong>? Tindakan ini tidak dapat dibatalkan.
            </p>

            <div className="pt-2 flex justify-center gap-2">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="px-3.5 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-lg text-xs"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleExecuteDelete}
                className="px-4 py-1.5 bg-[#D32F2F] hover:bg-[#B71C1C] text-white font-bold rounded-lg text-xs shadow-xs"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
