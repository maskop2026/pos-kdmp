/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Sidebar } from './components/kdmp/Sidebar';
import { TopNavbar } from './components/kdmp/TopNavbar';
import { StatCards } from './components/kdmp/StatCards';
import { SalesChart } from './components/kdmp/SalesChart';
import { TopProducts } from './components/kdmp/TopProducts';
import { RecentTransactions } from './components/kdmp/RecentTransactions';
import { QuickActions } from './components/kdmp/QuickActions';

// Modals
import { PosTransactionModal } from './components/kdmp/PosTransactionModal';
import { AddProductModal } from './components/kdmp/AddProductModal';
import { PrintReceiptModal } from './components/kdmp/PrintReceiptModal';

// Sub Views
import { PosCashierView } from './components/kdmp/PosCashierView';
import { MasterProductsView } from './components/kdmp/MasterProductsView';
import { MasterCategoriesView } from './components/kdmp/MasterCategoriesView';
import { MasterBrandsView } from './components/kdmp/MasterBrandsView';
import { MasterSuppliersView } from './components/kdmp/MasterSuppliersView';
import { MasterCustomersView } from './components/kdmp/MasterCustomersView';
import { WarehouseView } from './components/kdmp/WarehouseView';
import { PurchaseOrdersView } from './components/kdmp/PurchaseOrdersView';
import { PaymentHutangView } from './components/kdmp/PaymentHutangView';
import { CashBankView } from './components/kdmp/CashBankView';
import { StockLedgerView } from './components/kdmp/StockLedgerView';
import { ReportsView } from './components/kdmp/ReportsView';
import { UserRoleView } from './components/kdmp/UserRoleView';
import { MultiOutletView } from './components/kdmp/MultiOutletView';
import { SettingsView } from './components/kdmp/SettingsView';
import { LoginView } from './components/kdmp/LoginView';

import { ActiveMenuId, AuthUser, DashboardStat, RecentTransactionItem, UserItem } from './types/kdmp';
import { INITIAL_OUTLETS, INITIAL_STATS, INITIAL_TRANSACTIONS, INITIAL_USERS } from './data/kdmpData';
import { Toast, ToastItem } from './components/Toast';

export default function App() {
  // Navigation State
  const [activeMenu, setActiveMenu] = useState<ActiveMenuId>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Transactions State
  const [transactions, setTransactions] = useState<RecentTransactionItem[]>(INITIAL_TRANSACTIONS);
  const [stats, setStats] = useState<DashboardStat[]>(INITIAL_STATS);

  // Users State (Persistent in local storage for editing and adding users)
  const [users, setUsers] = useState<UserItem[]>(() => {
    try {
      const stored = localStorage.getItem('kdmp_users');
      return stored ? JSON.parse(stored) : INITIAL_USERS;
    } catch {
      return INITIAL_USERS;
    }
  });

  const handleUpdateUsers = (newUsers: UserItem[]) => {
    setUsers(newUsers);
    try {
      localStorage.setItem('kdmp_users', JSON.stringify(newUsers));
    } catch {
      // ignore
    }
  };

  // Auth User Session State
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    try {
      const session = localStorage.getItem('kdmp_auth_session');
      return session ? JSON.parse(session) : null;
    } catch {
      return null;
    }
  });

  // Modals
  const [isAddTxOpen, setIsAddTxOpen] = useState(false);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [isPrintReceiptOpen, setIsPrintReceiptOpen] = useState(false);
  const [activeReceiptTx, setActiveReceiptTx] = useState<RecentTransactionItem>(INITIAL_TRANSACTIONS[0]);

  // Notifications Toast
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = (type: 'success' | 'info' | 'warning', title: string, message: string) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 2500);
  };

  const handleDismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Login handler
  const handleLoginSuccess = (user: AuthUser, rememberMe: boolean) => {
    setCurrentUser(user);
    if (rememberMe) {
      try {
        localStorage.setItem('kdmp_auth_session', JSON.stringify(user));
      } catch {
        // ignore
      }
    }
    showToast('success', 'Login Berhasil', `Selamat datang kembali, ${user.name}! (${user.role_name})`);
  };

  // Logout handler
  const handleLogout = () => {
    try {
      localStorage.removeItem('kdmp_auth_session');
    } catch {
      // ignore
    }
    setCurrentUser(null);
    setActiveMenu('dashboard');
    showToast('info', 'Sesi Berakhir', 'Anda telah berhasil keluar dari sistem POS KDMP.');
  };

  // Handler for adding new transaction
  const handleNewTransaction = (newTx: RecentTransactionItem) => {
    setTransactions((prev) => [newTx, ...prev]);
    setActiveReceiptTx(newTx);

    // Update stats dynamically
    setStats((prev) =>
      prev.map((s) => {
        if (s.id === 'stat-sales') {
          return { ...s, value: 'Rp 4.650.000' };
        }
        if (s.id === 'stat-orders') {
          return { ...s, value: '121 Order' };
        }
        return s;
      })
    );

    showToast('success', 'Transaksi Berhasil!', `${newTx.invoice} senilai Rp ${newTx.total.toLocaleString('id-ID')} disimpan.`);
  };

  // Handler for adding product
  const handleProductAdded = (name: string) => {
    showToast('success', 'Produk Ditambahkan', `"${name}" berhasil disimpan ke master data.`);
  };

  // If not logged in, show Login Screen
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#F4F6F9] font-sans antialiased">
        <Toast toasts={toasts} onDismiss={handleDismissToast} />
        <LoginView
          users={users}
          outlets={INITIAL_OUTLETS}
          onLoginSuccess={handleLoginSuccess}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F6F9] text-[#2B2B2B] flex font-sans antialiased">
      {/* Toast Notification System */}
      <Toast toasts={toasts} onDismiss={handleDismissToast} />

      {/* 1. SIDEBAR (Auto-close accordion, active menu highlight) */}
      <Sidebar
        isOpen={sidebarOpen}
        activeMenu={activeMenu}
        onSelectMenu={(menu) => setActiveMenu(menu)}
        onCloseMobile={() => setSidebarOpen(false)}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      {/* 2. MAIN CONTENT WRAPPER */}
      <div
        className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${
          sidebarOpen ? 'md:ml-[260px]' : 'ml-0'
        }`}
      >
        {/* Top Navbar */}
        <TopNavbar
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          currentUser={currentUser}
          onLogout={handleLogout}
          onNavigateMenu={(menu) => setActiveMenu(menu)}
        />

        {/* Page Content Container */}
        <main className="p-4 sm:p-6 flex-1 max-w-7xl w-full mx-auto space-y-6">
          {/* Breadcrumb / Title Bar */}
          {activeMenu === 'dashboard' && (
            <div>
              <h4 className="text-xl sm:text-2xl font-black text-[#D32F2F] tracking-tight">
                Dashboard
              </h4>
              <p className="text-xs text-gray-500 mt-0.5 font-medium">
                Selamat datang kembali, berikut ringkasan aktivitas outlet hari ini.
              </p>
            </div>
          )}

          {/* VIEW: DASHBOARD */}
          {activeMenu === 'dashboard' && (
            <>
              {/* Stat Cards (Soft Blue, Soft Green, Soft Orange, Soft Purple) */}
              <StatCards stats={stats} />

              {/* Chart & Top Products Row */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
                {/* 7-Day Sales Chart with Red Gradient Area (8 Cols) */}
                <div className="lg:col-span-8 min-h-[320px]">
                  <SalesChart />
                </div>

                {/* Top Products (4 Cols) */}
                <div className="lg:col-span-4 min-h-[320px]">
                  <TopProducts />
                </div>
              </div>

              {/* Recent Transactions & Quick Action Row */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
                {/* Recent Transactions Table (8 Cols) */}
                <div className="lg:col-span-8">
                  <RecentTransactions
                    transactions={transactions}
                    onViewAll={() => setActiveMenu('pos')}
                  />
                </div>

                {/* Quick Actions (4 Cols - Soft Pink Card) */}
                <div className="lg:col-span-4">
                  <QuickActions
                    onAddTransaction={() => setIsAddTxOpen(true)}
                    onAddProduct={() => setIsAddProductOpen(true)}
                    onPrintReceipt={() => setIsPrintReceiptOpen(true)}
                  />
                </div>
              </div>
            </>
          )}

          {/* VIEW: PENJUALAN (POS) */}
          {activeMenu === 'pos' && (
            <div>
              <div className="mb-4">
                <h4 className="text-xl font-black text-[#D32F2F]">Kasir Penjualan (POS)</h4>
                <p className="text-xs text-gray-500">Pilih produk, tentukan jumlah, dan proses pembayaran kasir langsung.</p>
              </div>
              <PosCashierView onCompleteTransaction={handleNewTransaction} />
            </div>
          )}

          {/* VIEW: MASTER PRODUK */}
          {activeMenu === 'produk' && (
            <div>
              <div className="mb-4">
                <h4 className="text-xl font-black text-[#D32F2F]">Master Data Produk</h4>
                <p className="text-xs text-gray-500">Kelola inventaris, harga jual, stok, dan SKU produk.</p>
              </div>
              <MasterProductsView onAddProduct={() => setIsAddProductOpen(true)} />
            </div>
          )}

          {/* VIEW: MASTER KATEGORI */}
          {activeMenu === 'kategori' && (
            <div>
              <div className="mb-4">
                <h4 className="text-xl font-black text-[#D32F2F]">Master Kategori</h4>
                <p className="text-xs text-gray-500">Klasifikasi kelompok produk, pengaturan status display, dan kulakan.</p>
              </div>
              <MasterCategoriesView onShowToast={showToast} />
            </div>
          )}

          {/* VIEW: MASTER BRAND */}
          {activeMenu === 'brand' && (
            <div>
              <div className="mb-4">
                <h4 className="text-xl font-black text-[#D32F2F]">Master Brand</h4>
                <p className="text-xs text-gray-500">Daftar merk produk dagangan dan inventaris outlet.</p>
              </div>
              <MasterBrandsView onShowToast={showToast} />
            </div>
          )}

          {/* VIEW: MASTER SUPPLIER */}
          {activeMenu === 'supplier' && (
            <div>
              <div className="mb-4">
                <h4 className="text-xl font-black text-[#D32F2F]">Master Supplier (External)</h4>
                <p className="text-xs text-gray-500">Daftar rekanan distributor, principal, kontak person, dan perpajakan PPN.</p>
              </div>
              <MasterSuppliersView onShowToast={showToast} />
            </div>
          )}

          {/* VIEW: MASTER CUSTOMER */}
          {activeMenu === 'customer' && (
            <div>
              <div className="mb-4">
                <h4 className="text-xl font-black text-[#D32F2F]">Master Customer</h4>
                <p className="text-xs text-gray-500">Daftar data pelanggan, kategori member/grosir/reseller, dan status keaktifan.</p>
              </div>
              <MasterCustomersView onShowToast={showToast} />
            </div>
          )}

          {/* VIEW: WAREHOUSE & LOKASI */}
          {activeMenu === 'warehouse' && (
            <div>
              <div className="mb-4">
                <h4 className="text-xl font-black text-[#D32F2F]">Warehouse & Lokasi Rak</h4>
                <p className="text-xs text-gray-500">Kelola inventaris gudang utama, cabang/outlet, rak display, serta riwayat mutasi stok antar lokasi.</p>
              </div>
              <WarehouseView onShowToast={showToast} />
            </div>
          )}

          {/* VIEW: PEMBELIAN BARANG */}
          {activeMenu === 'pembelian' && (
            <div>
              <div className="mb-4">
                <h4 className="text-xl font-black text-[#D32F2F]">Pembelian Barang (Purchase Order)</h4>
                <p className="text-xs text-gray-500">Pencatatan pengadaan stok dari supplier, pembuatan PO, perhitungan PPN & ongkir, serta monitoring hutang.</p>
              </div>
              <PurchaseOrdersView onShowToast={showToast} />
            </div>
          )}

          {/* VIEW: PEMBAYARAN & HUTANG */}
          {activeMenu === 'pembayaran' && (
            <div>
              <div className="mb-4">
                <h4 className="text-xl font-black text-[#D32F2F]">Pembayaran & Hutang Supplier</h4>
                <p className="text-xs text-gray-500">Alur pengajuan pembayaran (Bendahara), approval & verifikasi fisik surat jalan (Ketua), serta eksekusi transfer dana.</p>
              </div>
              <PaymentHutangView onShowToast={showToast} />
            </div>
          )}

          {/* VIEW: KAS & PEMBAYARAN */}
          {activeMenu === 'kas' && (
            <div>
              <div className="mb-4">
                <h4 className="text-xl font-black text-[#D32F2F]">Kas & Pembayaran</h4>
                <p className="text-xs text-gray-500">Pengelolaan saldo kasir, mutasi kas masuk penjualan, pencatatan pengeluaran operasional, transfer antar bank, dan modal awal.</p>
              </div>
              <CashBankView onShowToast={showToast} />
            </div>
          )}

          {/* VIEW: STOK LEDGER */}
          {activeMenu === 'stok-ledger' && (
            <div>
              <div className="mb-4">
                <h4 className="text-xl font-black text-[#D32F2F]">Stok Ledger</h4>
                <p className="text-xs text-gray-500">Buku pencatatan mutasi masuk dan keluar barang.</p>
              </div>
              <StockLedgerView />
            </div>
          )}

          {/* VIEW: LAPORAN */}
          {activeMenu === 'laporan' && (
            <div>
              <div className="mb-4">
                <h4 className="text-xl font-black text-[#D32F2F]">Laporan & Analitik</h4>
                <p className="text-xs text-gray-500">Rekapitulasi penjualan, laba kotor, dan performa outlet.</p>
              </div>
              <ReportsView onShowToast={showToast} />
            </div>
          )}

          {/* VIEW: USER & ROLE */}
          {activeMenu === 'user-role' && (
            <div>
              <div className="mb-4">
                <h4 className="text-xl font-black text-[#D32F2F]">User & Role</h4>
                <p className="text-xs text-gray-500">Manajemen pengguna sistem, otorisasi jabatan, dan pembatasan hak akses.</p>
              </div>
              <UserRoleView
                onShowToast={showToast}
                users={users}
                onUpdateUsers={handleUpdateUsers}
              />
            </div>
          )}

          {/* VIEW: MULTI OUTLET */}
          {activeMenu === 'multi-outlet' && (
            <div>
              <div className="mb-4">
                <h4 className="text-xl font-black text-[#D32F2F]">Multi Outlet & Cabang</h4>
                <p className="text-xs text-gray-500">Pengelolaan cabang toko, pemantauan terminal kasir POS, dan perbandingan omset antar cabang.</p>
              </div>
              <MultiOutletView onShowToast={showToast} />
            </div>
          )}

          {/* VIEW: SETTING */}
          {activeMenu === 'setting' && (
            <div>
              <div className="mb-4">
                <h4 className="text-xl font-black text-[#D32F2F]">Pengaturan Sistem</h4>
                <p className="text-xs text-gray-500">Konfigurasi profil toko koperasi, printer struk nota, perpajakan, dan pemeliharaan database.</p>
              </div>
              <SettingsView onShowToast={showToast} />
            </div>
          )}

          {/* FALLBACK FOR OTHER MENUS */}
          {![
            'dashboard',
            'pos',
            'produk',
            'kategori',
            'brand',
            'supplier',
            'customer',
            'warehouse',
            'pembelian',
            'pembayaran',
            'kas',
            'stok-ledger',
            'laporan',
            'user-role',
            'multi-outlet',
            'setting',
          ].includes(activeMenu) && (
            <div className="bg-white rounded-xl border border-[#E0E0E0] p-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-red-50 text-[#D32F2F] flex items-center justify-center mx-auto font-bold text-lg">
                KDMP
              </div>
              <h5 className="text-base font-bold text-gray-900 capitalize">
                Modul {activeMenu.replace('-', ' ')}
              </h5>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                Modul ini siap dikonfigurasi dengan skema database backend dan aturan hak akses role.
              </p>
              <button
                type="button"
                onClick={() => setActiveMenu('dashboard')}
                className="mt-2 px-4 py-2 bg-[#D32F2F] hover:bg-[#B71C1C] text-white text-xs font-bold rounded-lg shadow-xs transition-colors"
              >
                Kembali ke Dashboard
              </button>
            </div>
          )}
        </main>

        {/* 3. FOOTER (Matching HTML) */}
        <footer className="bg-white border-t border-[#E0E0E0] py-3.5 px-6 text-center text-xs text-gray-500 mt-auto">
          <strong>POS KDMP</strong> &copy; 2024. Dibuat dengan{' '}
          <span className="text-[#D32F2F] font-bold">❤️</span> di Indonesia.
        </footer>
      </div>

      {/* MODAL 1: POS Transaksi Cepat */}
      {isAddTxOpen && (
        <PosTransactionModal
          onClose={() => setIsAddTxOpen(false)}
          onSubmitTransaction={handleNewTransaction}
        />
      )}

      {/* MODAL 2: Tambah Produk Baru */}
      {isAddProductOpen && (
        <AddProductModal
          onClose={() => setIsAddProductOpen(false)}
          onSuccess={handleProductAdded}
        />
      )}

      {/* MODAL 3: Cetak Struk Thermal */}
      {isPrintReceiptOpen && (
        <PrintReceiptModal
          transaction={activeReceiptTx}
          onClose={() => setIsPrintReceiptOpen(false)}
        />
      )}
    </div>
  );
}
