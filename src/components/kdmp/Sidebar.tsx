import React, { useState } from 'react';
import {
  Store,
  LayoutDashboard,
  Database,
  Box,
  Tags,
  Copyright,
  Building,
  Truck,
  Users,
  Ruler,
  PackageOpen,
  Layers,
  DollarSign,
  Warehouse,
  MapPin,
  ClipboardList,
  FolderInput,
  CreditCard,
  ShoppingCart,
  ShoppingBag,
  Receipt,
  Wallet,
  PieChart,
  Settings,
  ShieldCheck,
  History,
  HardDrive,
  Bell,
  Wrench,
  ChevronDown,
  X,
  LogOut,
} from 'lucide-react';
import { ActiveMenuId, AuthUser } from '../../types/kdmp';

interface SidebarProps {
  isOpen: boolean;
  activeMenu: ActiveMenuId;
  onSelectMenu: (menu: ActiveMenuId) => void;
  onCloseMobile: () => void;
  currentUser?: AuthUser | null;
  onLogout?: () => void;
}

type SubmenuKey = 'master' | 'inventory' | 'transaksi' | 'sistem';

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  activeMenu,
  onSelectMenu,
  onCloseMobile,
  currentUser,
  onLogout,
}) => {
  // Accordion state (auto-close other submenus)
  const [openSubmenu, setOpenSubmenu] = useState<SubmenuKey | null>('transaksi');

  const handleToggleSubmenu = (key: SubmenuKey) => {
    setOpenSubmenu((prev) => (prev === key ? null : key));
  };

  const handleMenuClick = (menu: ActiveMenuId) => {
    onSelectMenu(menu);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile overlay backdrop */}
      {isOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/50 z-30 md:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 left-0 h-screen w-[260px] bg-[#D32F2F] text-white/90 z-40 flex flex-col transition-transform duration-300 ease-in-out select-none shadow-xl ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar Heading */}
        <div className="h-16 px-6 bg-[#B71C1C] border-b border-white/10 flex items-center justify-between shrink-0 sticky top-0 z-10">
          <div className="flex items-center gap-2.5 font-extrabold text-xl tracking-tight text-white">
            <Store className="w-6 h-6 text-white" />
            <span>POS KDMP</span>
          </div>
          {/* Close for mobile */}
          <button
            type="button"
            onClick={onCloseMobile}
            className="md:hidden p-1 rounded text-white/80 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Menu Items */}
        <div className="flex-1 overflow-y-auto py-3 scrollbar-none text-[13.5px]">
          {/* Group: Main */}
          <div className="px-6 py-2 text-[10.5px] font-bold tracking-wider text-white/50 uppercase">
            Main
          </div>
          <button
            type="button"
            onClick={() => handleMenuClick('dashboard')}
            className={`w-full text-left px-6 py-2.5 flex items-center gap-3 transition-colors ${
              activeMenu === 'dashboard'
                ? 'bg-black/20 text-white font-semibold border-l-4 border-white'
                : 'hover:bg-white/15 text-white/85'
            }`}
          >
            <LayoutDashboard className="w-4 h-4 text-white/80" />
            <span>Dashboard</span>
          </button>

          {/* Group: Master Data */}
          <div className="px-6 pt-4 pb-1 text-[10.5px] font-bold tracking-wider text-white/50 uppercase">
            Master Data
          </div>
          <button
            type="button"
            onClick={() => handleToggleSubmenu('master')}
            className="w-full text-left px-6 py-2.5 flex items-center justify-between hover:bg-white/15 text-white/85 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Database className="w-4 h-4 text-white/80" />
              <span>Master Data</span>
            </div>
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-200 ${
                openSubmenu === 'master' ? 'rotate-180' : ''
              }`}
            />
          </button>
          {openSubmenu === 'master' && (
            <div className="bg-black/10 py-1 transition-all">
              <button
                type="button"
                onClick={() => handleMenuClick('produk')}
                className={`w-full text-left pl-14 pr-6 py-2 flex items-center gap-2.5 text-xs transition-colors ${
                  activeMenu === 'produk' ? 'text-white font-bold bg-black/15' : 'text-white/75 hover:text-white'
                }`}
              >
                <Box className="w-3.5 h-3.5" />
                <span>Produk</span>
              </button>
              <button
                type="button"
                onClick={() => handleMenuClick('kategori')}
                className={`w-full text-left pl-14 pr-6 py-2 flex items-center gap-2.5 text-xs transition-colors ${
                  activeMenu === 'kategori' ? 'text-white font-bold bg-black/15' : 'text-white/75 hover:text-white'
                }`}
              >
                <Tags className="w-3.5 h-3.5" />
                <span>Kategori</span>
              </button>
              <button
                type="button"
                onClick={() => handleMenuClick('brand')}
                className={`w-full text-left pl-14 pr-6 py-2 flex items-center gap-2.5 text-xs transition-colors ${
                  activeMenu === 'brand' ? 'text-white font-bold bg-black/15' : 'text-white/75 hover:text-white'
                }`}
              >
                <Copyright className="w-3.5 h-3.5" />
                <span>Brand</span>
              </button>
              <button
                type="button"
                onClick={() => handleMenuClick('supplier')}
                className={`w-full text-left pl-14 pr-6 py-2 flex items-center gap-2.5 text-xs transition-colors ${
                  activeMenu === 'supplier' ? 'text-white font-bold bg-black/15' : 'text-white/75 hover:text-white'
                }`}
              >
                <Truck className="w-3.5 h-3.5" />
                <span>Supplier</span>
              </button>
              <button
                type="button"
                onClick={() => handleMenuClick('customer')}
                className={`w-full text-left pl-14 pr-6 py-2 flex items-center gap-2.5 text-xs transition-colors ${
                  activeMenu === 'customer' ? 'text-white font-bold bg-black/15' : 'text-white/75 hover:text-white'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>Customer</span>
              </button>
            </div>
          )}

          {/* Group: Inventory */}
          <div className="px-6 pt-4 pb-1 text-[10.5px] font-bold tracking-wider text-white/50 uppercase">
            Inventory
          </div>
          <button
            type="button"
            onClick={() => handleToggleSubmenu('inventory')}
            className="w-full text-left px-6 py-2.5 flex items-center justify-between hover:bg-white/15 text-white/85 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Warehouse className="w-4 h-4 text-white/80" />
              <span>Warehouse</span>
            </div>
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-200 ${
                openSubmenu === 'inventory' ? 'rotate-180' : ''
              }`}
            />
          </button>
          {openSubmenu === 'inventory' && (
            <div className="bg-black/10 py-1 transition-all">
              <button
                type="button"
                onClick={() => handleMenuClick('warehouse')}
                className={`w-full text-left pl-14 pr-6 py-2 flex items-center gap-2.5 text-xs transition-colors ${
                  activeMenu === 'warehouse' ? 'text-white font-bold bg-black/15' : 'text-white/75 hover:text-white'
                }`}
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>Warehouse & Loc</span>
              </button>
              <button
                type="button"
                onClick={() => handleMenuClick('stok-ledger')}
                className={`w-full text-left pl-14 pr-6 py-2 flex items-center gap-2.5 text-xs transition-colors ${
                  activeMenu === 'stok-ledger' ? 'text-white font-bold bg-black/15' : 'text-white/75 hover:text-white'
                }`}
              >
                <ClipboardList className="w-3.5 h-3.5" />
                <span>Stok Ledger</span>
              </button>
            </div>
          )}

          {/* Group: Transaksi */}
          <div className="px-6 pt-4 pb-1 text-[10.5px] font-bold tracking-wider text-white/50 uppercase">
            Transaksi
          </div>
          <button
            type="button"
            onClick={() => handleToggleSubmenu('transaksi')}
            className="w-full text-left px-6 py-2.5 flex items-center justify-between hover:bg-white/15 text-white/85 transition-colors"
          >
            <div className="flex items-center gap-3">
              <CreditCard className="w-4 h-4 text-white/80" />
              <span>Transaksi</span>
            </div>
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-200 ${
                openSubmenu === 'transaksi' ? 'rotate-180' : ''
              }`}
            />
          </button>
          {openSubmenu === 'transaksi' && (
            <div className="bg-black/10 py-1 transition-all">
              <button
                type="button"
                onClick={() => handleMenuClick('pos')}
                className={`w-full text-left pl-14 pr-6 py-2 flex items-center gap-2.5 text-xs transition-colors ${
                  activeMenu === 'pos' ? 'text-white font-bold bg-black/15' : 'text-white/75 hover:text-white'
                }`}
              >
                <ShoppingCart className="w-3.5 h-3.5" />
                <span>Penjualan (POS)</span>
              </button>
              <button
                type="button"
                onClick={() => handleMenuClick('pembelian')}
                className={`w-full text-left pl-14 pr-6 py-2 flex items-center gap-2.5 text-xs transition-colors ${
                  activeMenu === 'pembelian' ? 'text-white font-bold bg-black/15' : 'text-white/75 hover:text-white'
                }`}
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Pembelian</span>
              </button>
              <button
                type="button"
                onClick={() => handleMenuClick('pembayaran')}
                className={`w-full text-left pl-14 pr-6 py-2 flex items-center gap-2.5 text-xs transition-colors ${
                  activeMenu === 'pembayaran' ? 'text-white font-bold bg-black/15' : 'text-white/75 hover:text-white'
                }`}
              >
                <Receipt className="w-3.5 h-3.5" />
                <span>Pembayaran</span>
              </button>
              <button
                type="button"
                onClick={() => handleMenuClick('kas')}
                className={`w-full text-left pl-14 pr-6 py-2 flex items-center gap-2.5 text-xs transition-colors ${
                  activeMenu === 'kas' ? 'text-white font-bold bg-black/15' : 'text-white/75 hover:text-white'
                }`}
              >
                <Wallet className="w-3.5 h-3.5" />
                <span>Kas</span>
              </button>
            </div>
          )}

          {/* Group: Laporan & Sistem */}
          <div className="px-6 pt-4 pb-1 text-[10.5px] font-bold tracking-wider text-white/50 uppercase">
            Laporan & Sistem
          </div>
          <button
            type="button"
            onClick={() => handleMenuClick('laporan')}
            className={`w-full text-left px-6 py-2.5 flex items-center gap-3 transition-colors ${
              activeMenu === 'laporan'
                ? 'bg-black/20 text-white font-semibold border-l-4 border-white'
                : 'hover:bg-white/15 text-white/85'
            }`}
          >
            <PieChart className="w-4 h-4 text-white/80" />
            <span>Laporan</span>
          </button>

          <button
            type="button"
            onClick={() => handleToggleSubmenu('sistem')}
            className="w-full text-left px-6 py-2.5 flex items-center justify-between hover:bg-white/15 text-white/85 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Settings className="w-4 h-4 text-white/80" />
              <span>Sistem</span>
            </div>
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-200 ${
                openSubmenu === 'sistem' ? 'rotate-180' : ''
              }`}
            />
          </button>
          {openSubmenu === 'sistem' && (
            <div className="bg-black/10 py-1 transition-all">
              <button
                type="button"
                onClick={() => handleMenuClick('user-role')}
                className={`w-full text-left pl-14 pr-6 py-2 flex items-center gap-2.5 text-xs transition-colors ${
                  activeMenu === 'user-role' ? 'text-white font-bold bg-black/15' : 'text-white/75 hover:text-white'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>User & Role</span>
              </button>
              <button
                type="button"
                onClick={() => handleMenuClick('multi-outlet')}
                className={`w-full text-left pl-14 pr-6 py-2 flex items-center gap-2.5 text-xs transition-colors ${
                  activeMenu === 'multi-outlet' ? 'text-white font-bold bg-black/15' : 'text-white/75 hover:text-white'
                }`}
              >
                <Store className="w-3.5 h-3.5" />
                <span>Multi Outlet</span>
              </button>
              <button
                type="button"
                onClick={() => handleMenuClick('setting')}
                className={`w-full text-left pl-14 pr-6 py-2 flex items-center gap-2.5 text-xs transition-colors ${
                  activeMenu === 'setting' ? 'text-white font-bold bg-black/15' : 'text-white/75 hover:text-white'
                }`}
              >
                <Wrench className="w-3.5 h-3.5" />
                <span>Setting</span>
              </button>
            </div>
          )}
        </div>

        {/* User Profile Footer in Sidebar */}
        <div className="p-3 bg-[#B71C1C]/90 border-t border-white/10 shrink-0">
          <div className="flex items-center justify-between gap-2 bg-black/20 rounded-xl p-2.5">
            <div className="flex items-center gap-2.5 min-w-0">
              <img
                src={
                  currentUser?.avatar_url ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    currentUser?.name || 'Admin KDMP'
                  )}&background=D32F2F&color=fff&bold=true`
                }
                alt={currentUser?.name || 'User'}
                className="w-8 h-8 rounded-full border border-white/30 shrink-0"
              />
              <div className="min-w-0">
                <div className="text-xs font-bold text-white truncate leading-tight">
                  {currentUser?.name || 'Admin KDMP'}
                </div>
                <div className="text-[10px] text-white/70 truncate flex items-center gap-1">
                  <span>{currentUser?.role_name || 'Super Admin'}</span>
                </div>
              </div>
            </div>

            {onLogout && (
              <button
                type="button"
                onClick={onLogout}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-colors shrink-0"
                title="Keluar (Logout)"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};
