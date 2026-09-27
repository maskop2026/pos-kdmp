import React, { useState, useRef, useEffect } from 'react';
import { Menu, Search, Bell, User, Settings, LogOut, CheckCircle, AlertCircle, ShieldCheck } from 'lucide-react';
import { NOTIFICATIONS } from '../../data/kdmpData';
import { ActiveMenuId, AuthUser } from '../../types/kdmp';

interface TopNavbarProps {
  onToggleSidebar: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  currentUser?: AuthUser | null;
  onLogout?: () => void;
  onNavigateMenu?: (menu: ActiveMenuId) => void;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({
  onToggleSidebar,
  searchQuery,
  onSearchChange,
  currentUser,
  onLogout,
  onNavigateMenu,
}) => {
  const [notifOpen, setNotifOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="h-16 bg-white border-b border-[#E0E0E0] px-4 sm:px-6 sticky top-0 z-20 flex items-center justify-between">
      {/* Left: Toggle & Search */}
      <div className="flex items-center gap-4 flex-1">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="p-2 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-700 shadow-xs border border-gray-200 transition-colors"
          title="Toggle Sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Search input matching HTML */}
        <div className="hidden md:flex items-center relative max-w-md w-full">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Cari produk, transaksi, customer..."
            className="w-full bg-white border border-[#E0E0E0] rounded-lg pl-9 pr-4 py-1.5 text-xs text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-[#D32F2F] transition-colors"
          />
        </div>
      </div>

      {/* Right: Notifications & User Profile */}
      <div className="flex items-center gap-3">
        {/* Notification Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            type="button"
            onClick={() => {
              setNotifOpen(!notifOpen);
              setUserMenuOpen(false);
            }}
            className="relative p-2 text-gray-700 hover:text-[#D32F2F] hover:bg-gray-50 rounded-lg transition-colors"
            title="Notifikasi"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute 1 top-1 right-1 bg-[#D32F2F] text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
              3
            </span>
          </button>

          {notifOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-100 rounded-xl shadow-xl py-2 z-50 text-xs animate-in fade-in">
              <div className="px-4 py-2 border-b border-gray-100 font-bold text-gray-800 flex justify-between">
                <span>Notifikasi</span>
                <span className="text-[10px] text-[#D32F2F] font-semibold">Tandai sudah baca</span>
              </div>
              <div className="divide-y divide-gray-50 max-h-60 overflow-y-auto">
                {NOTIFICATIONS.map((n) => (
                  <div key={n.id} className="p-3 hover:bg-gray-50 flex items-start gap-2.5">
                    {n.type === 'danger' && <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />}
                    {n.type === 'success' && <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />}
                    {n.type === 'warning' && <Bell className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />}
                    <div>
                      <p className="text-gray-700 leading-snug">{n.text}</p>
                      <span className="text-[10px] text-gray-400 mt-0.5 block">{n.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Dropdown */}
        <div className="relative" ref={userMenuRef}>
          <button
            type="button"
            onClick={() => {
              setUserMenuOpen(!userMenuOpen);
              setNotifOpen(false);
            }}
            className="flex items-center gap-2.5 p-1 rounded-lg hover:bg-gray-50 transition-colors text-left"
          >
            <img
              src={
                currentUser?.avatar_url ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  currentUser?.name || 'Admin KDMP'
                )}&background=D32F2F&color=fff&bold=true`
              }
              alt={currentUser?.name || 'Admin KDMP'}
              className="w-9 h-9 rounded-full object-cover ring-2 ring-red-100 shadow-xs"
            />
            <div className="hidden sm:block text-left">
              <span className="text-xs font-bold text-gray-900 block leading-tight truncate max-w-[130px]">
                {currentUser?.name || 'Admin KDMP'}
              </span>
              <div className="flex items-center gap-1 mt-0.5">
                <span className="text-[9.5px] px-1.5 py-0.2 bg-red-100 text-[#D32F2F] font-bold rounded-md">
                  {currentUser?.role_name || 'Super Admin'}
                </span>
              </div>
            </div>
          </button>

          {userMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-100 rounded-xl shadow-xl py-1.5 z-50 text-xs animate-in fade-in">
              <div className="px-4 py-2.5 bg-gray-50 border-b border-gray-100">
                <div className="font-bold text-gray-900 truncate">
                  {currentUser?.name || 'Admin KDMP'}
                </div>
                <div className="text-[10px] text-gray-500 font-mono">
                  @{currentUser?.username || 'superadmin'}
                </div>
                {currentUser?.outlet_name && (
                  <div className="text-[9.5px] text-red-600 mt-1 truncate font-medium">
                    📍 {currentUser.outlet_name}
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={() => {
                  setUserMenuOpen(false);
                  if (onNavigateMenu) onNavigateMenu('user-role');
                }}
                className="w-full px-4 py-2 flex items-center gap-2 text-gray-700 hover:bg-gray-50 text-left"
              >
                <User className="w-4 h-4 text-gray-400" />
                <span>Profil & Akun</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setUserMenuOpen(false);
                  if (onNavigateMenu) onNavigateMenu('setting');
                }}
                className="w-full px-4 py-2 flex items-center gap-2 text-gray-700 hover:bg-gray-50 text-left"
              >
                <Settings className="w-4 h-4 text-gray-400" />
                <span>Pengaturan Sistem</span>
              </button>
              <div className="border-t border-gray-100 my-1" />
              <button
                type="button"
                onClick={() => {
                  setUserMenuOpen(false);
                  if (onLogout) onLogout();
                }}
                className="w-full px-4 py-2 flex items-center gap-2 text-red-600 hover:bg-red-50 text-left font-semibold transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Keluar (Logout)</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
