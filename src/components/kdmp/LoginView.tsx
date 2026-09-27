import React, { useState } from 'react';
import {
  Store,
  Lock,
  User,
  Eye,
  EyeOff,
  LogIn,
  ShieldCheck,
  Building,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  HelpCircle,
  KeyRound,
  X,
  ShoppingCart,
  Wallet,
  Package,
  Award,
} from 'lucide-react';
import { AuthUser, OutletItem, UserItem } from '../../types/kdmp';
import { DEMO_CREDENTIALS, INITIAL_OUTLETS } from '../../data/kdmpData';

interface LoginViewProps {
  users: UserItem[];
  outlets?: OutletItem[];
  onLoginSuccess: (user: AuthUser, rememberMe: boolean) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({
  users,
  outlets = INITIAL_OUTLETS,
  onLoginSuccess,
}) => {
  // Form State
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [selectedOutletId, setSelectedOutletId] = useState<number>(outlets[0]?.id || 1);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Status & Error
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [capsLockActive, setCapsLockActive] = useState(false);

  // Modal Help / Credential list
  const [showHelpModal, setShowHelpModal] = useState(false);

  // Check CapsLock
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.getModifierState && e.getModifierState('CapsLock')) {
      setCapsLockActive(true);
    } else {
      setCapsLockActive(false);
    }
  };

  // Submit Handler
  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMsg(null);

    const cleanUsername = username.trim().toLowerCase();
    const cleanPassword = password.trim();

    if (!cleanUsername) {
      setErrorMsg('Silakan masukkan username atau ID pengguna.');
      return;
    }
    if (!cleanPassword) {
      setErrorMsg('Silakan masukkan kata sandi (password).');
      return;
    }

    setIsLoading(true);

    // Simulate authenticating against PHP/database
    setTimeout(() => {
      // Find matching user
      const found = users.find((u) => u.username.toLowerCase() === cleanUsername);

      if (!found) {
        setIsLoading(false);
        setErrorMsg(`Username "${cleanUsername}" tidak ditemukan di database.`);
        return;
      }

      if (found.status === 'Non-Aktif') {
        setIsLoading(false);
        setErrorMsg(`Akun "${found.name}" berstatus Non-Aktif. Hubungi Super Admin KDMP untuk aktivasi kembali.`);
        return;
      }

      // Password verification:
      // Accepts explicit user.password, or default fallback strings 'password', '123456', 'admin123', or the username itself
      const validPasswords = [
        found.password,
        'password',
        '123456',
        'admin123',
        cleanUsername,
      ].filter(Boolean);

      const isPasswordMatch = validPasswords.includes(cleanPassword);

      if (!isPasswordMatch) {
        setIsLoading(false);
        setErrorMsg('Kata sandi (password) salah. Silakan coba lagi atau gunakan tombol Akun Demo.');
        return;
      }

      // Selected Outlet
      const outlet = outlets.find((o) => o.id === Number(selectedOutletId)) || outlets[0];

      const authUser: AuthUser = {
        id: found.id,
        name: found.name,
        username: found.username,
        role_id: found.role_id,
        role_name: found.role_name || 'User KDMP',
        status: found.status,
        outlet_id: outlet ? outlet.id : 1,
        outlet_name: outlet ? outlet.outlet_name : 'Outlet Pusat',
        avatar_url: `https://ui-avatars.com/api/?name=${encodeURIComponent(
          found.name
        )}&background=D32F2F&color=fff&bold=true`,
        last_login: new Date().toLocaleString('id-ID'),
      };

      setIsLoading(false);
      onLoginSuccess(authUser, rememberMe);
    }, 400);
  };

  // Quick switch to demo account
  const handleSelectDemo = (demo: (typeof DEMO_CREDENTIALS)[0]) => {
    setUsername(demo.username);
    setPassword(demo.password);
    setErrorMsg(null);
  };

  // Quick icon selector
  const getDemoIcon = (iconName: string) => {
    switch (iconName) {
      case 'ShieldCheck':
        return <ShieldCheck className="w-3.5 h-3.5 text-red-600 shrink-0" />;
      case 'ShoppingCart':
        return <ShoppingCart className="w-3.5 h-3.5 text-blue-600 shrink-0" />;
      case 'Wallet':
        return <Wallet className="w-3.5 h-3.5 text-emerald-600 shrink-0" />;
      case 'Package':
        return <Package className="w-3.5 h-3.5 text-amber-600 shrink-0" />;
      case 'Award':
        return <Award className="w-3.5 h-3.5 text-purple-600 shrink-0" />;
      default:
        return <User className="w-3.5 h-3.5 text-gray-500 shrink-0" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-rose-50/40 to-slate-200 flex flex-col justify-center items-center p-4 sm:p-6 relative select-none">
      {/* Background Decorative Circles */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-red-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

      {/* Main Login Card Container */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden relative z-10 transition-all">
        {/* Brand Header Banner */}
        <div className="bg-[#D32F2F] text-white p-6 relative overflow-hidden text-center">
          <div className="absolute -right-6 -bottom-6 opacity-10 pointer-events-none">
            <Store className="w-36 h-36" />
          </div>

          {/* Logo Badge */}
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-xs text-white shadow-inner mb-3 border border-white/20">
            <Store className="w-8 h-8 text-white drop-shadow-xs" />
          </div>

          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
            POS KDMP
          </h2>
          <p className="text-xs text-red-100 font-medium tracking-wide mt-1">
            Koperasi Desa Merdeka Perkasa
          </p>

          <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 bg-black/20 rounded-full text-[10px] text-white/90 border border-white/10">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Sistem Point of Sale & Inventaris Terpadu</span>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6 sm:p-8 space-y-5">
          {/* Welcome Text */}
          <div className="text-center">
            <h3 className="text-base font-bold text-gray-800">
              Selamat Datang Kembali
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Masuk dengan akun terdaftar untuk mengakses kasir & sistem toko.
            </p>
          </div>

          {/* Error Alert */}
          {errorMsg && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3.5 text-xs text-red-700 flex items-start gap-2.5 animate-in fade-in duration-200">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <div className="flex-1 font-medium leading-relaxed">{errorMsg}</div>
              <button
                type="button"
                onClick={() => setErrorMsg(null)}
                className="text-red-400 hover:text-red-700"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Input Username */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                Username / ID Pengguna <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Contoh: superadmin atau rina.kasir"
                  className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-gray-50 hover:bg-white focus:bg-white border border-gray-200 focus:border-[#D32F2F] rounded-xl focus:outline-none transition-all"
                  autoFocus
                />
              </div>
            </div>

            {/* Input Password */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-bold text-gray-700">
                  Kata Sandi (Password) <span className="text-red-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => setShowHelpModal(true)}
                  className="text-[11px] font-semibold text-[#D32F2F] hover:underline flex items-center gap-1"
                >
                  <HelpCircle className="w-3 h-3" />
                  <span>Info Password?</span>
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Masukkan kata sandi..."
                  className="w-full pl-10 pr-10 py-2.5 text-xs bg-gray-50 hover:bg-white focus:bg-white border border-gray-200 focus:border-[#D32F2F] rounded-xl focus:outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-700"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* CapsLock Warning */}
              {capsLockActive && (
                <p className="text-[10px] text-amber-600 font-semibold mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  <span>Peringatan: Tombol CapsLock sedang aktif.</span>
                </p>
              )}
            </div>

            {/* Outlet Selection */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                Lokasi Cabang / Outlet Masuk
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Building className="w-4 h-4" />
                </div>
                <select
                  value={selectedOutletId}
                  onChange={(e) => setSelectedOutletId(Number(e.target.value))}
                  className="w-full pl-10 pr-8 py-2.5 text-xs bg-gray-50 hover:bg-white focus:bg-white border border-gray-200 focus:border-[#D32F2F] rounded-xl focus:outline-none transition-all appearance-none cursor-pointer"
                >
                  {outlets.map((otl) => (
                    <option key={otl.id} value={otl.id}>
                      [{otl.outlet_code}] {otl.outlet_name} ({otl.city})
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400 text-xs">
                  ▼
                </div>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-gray-300 text-[#D32F2F] focus:ring-[#D32F2F] h-4 w-4"
                />
                <span className="text-xs text-gray-600 select-none">Ingat sesi di perangkat ini</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3 px-4 bg-[#D32F2F] hover:bg-[#B71C1C] disabled:bg-red-400 text-white font-bold text-xs rounded-xl shadow-md shadow-red-500/20 flex items-center justify-center gap-2 transition-all"
            >
              {isLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Memverifikasi Akun...</span>
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>Masuk ke Sistem POS KDMP</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Login with Demo Accounts */}
          <div className="pt-2 border-t border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-gray-600 uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Pilih Akun Cepat (Demo):</span>
              </span>
              <span className="text-[10px] text-gray-400">Klik untuk isi otomatis</span>
            </div>

            <div className="grid grid-cols-2 gap-1.5">
              {DEMO_CREDENTIALS.map((demo) => (
                <button
                  key={demo.username}
                  type="button"
                  onClick={() => handleSelectDemo(demo)}
                  className={`text-left p-2 rounded-lg border text-xs flex items-center gap-2 transition-all ${
                    username === demo.username
                      ? 'border-[#D32F2F] bg-red-50 ring-1 ring-red-400'
                      : demo.color
                  }`}
                >
                  {getDemoIcon(demo.icon)}
                  <div className="truncate">
                    <div className="font-bold text-[11px] truncate leading-tight">
                      {demo.role}
                    </div>
                    <div className="text-[9.5px] opacity-75 truncate">
                      {demo.username}
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-2 text-center">
              <span className="text-[10px] text-gray-400">
                Password default semua akun: <code className="bg-gray-100 px-1.5 py-0.5 rounded text-gray-700 font-mono font-bold">password</code>
              </span>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="bg-gray-50 border-t border-gray-100 py-3 px-6 text-center text-[10.5px] text-gray-400">
          <span>&copy; 2024 KDMP POS &bull; Dilindungi Hak Cipta Koperasi Desa Merdeka Perkasa</span>
        </div>
      </div>

      {/* MODAL BANTUAN USER & PASSWORD */}
      {showHelpModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden border border-gray-100 animate-in zoom-in-95">
            <div className="p-4 bg-[#D32F2F] text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <KeyRound className="w-5 h-5" />
                <h4 className="font-bold text-sm">Daftar Akun & Password Sistem KDMP</h4>
              </div>
              <button
                type="button"
                onClick={() => setShowHelpModal(false)}
                className="text-white/80 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
              <p className="text-gray-600 leading-relaxed">
                Berikut adalah daftar pengguna bawaan sistem yang tersimpan pada tabel database <code className="bg-gray-100 px-1 rounded text-red-600">users</code> dan <code className="bg-gray-100 px-1 rounded text-red-600">roles</code>:
              </p>

              <div className="divide-y divide-gray-100 border border-gray-200 rounded-xl overflow-hidden">
                {users.map((u) => (
                  <div key={u.id} className="p-3 bg-white hover:bg-gray-50 flex items-center justify-between gap-3">
                    <div>
                      <div className="font-bold text-gray-800 text-xs flex items-center gap-2">
                        <span>{u.name}</span>
                        <span
                          className={`text-[9px] px-2 py-0.5 rounded-full font-bold ${
                            u.status === 'Aktif'
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-gray-200 text-gray-600'
                          }`}
                        >
                          {u.status}
                        </span>
                      </div>
                      <div className="text-gray-500 text-[11px] mt-0.5">
                        Username: <span className="font-mono font-bold text-gray-700">{u.username}</span> | Role: <span className="text-[#D32F2F] font-semibold">{u.role_name}</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      disabled={u.status === 'Non-Aktif'}
                      onClick={() => {
                        setUsername(u.username);
                        setPassword(u.password || 'password');
                        setShowHelpModal(false);
                      }}
                      className="shrink-0 px-3 py-1.5 bg-red-50 hover:bg-red-100 disabled:opacity-40 text-red-700 font-bold rounded-lg border border-red-200 transition-colors"
                    >
                      Pilih Akun Ini
                    </button>
                  </div>
                ))}
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-blue-800 space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-blue-600" />
                  <span>Kunci Password Standar:</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  Semua akun default di atas dapat login menggunakan kata sandi: <strong className="text-blue-900 font-mono bg-blue-100 px-1.5 py-0.5 rounded">password</strong> atau <strong className="text-blue-900 font-mono bg-blue-100 px-1.5 py-0.5 rounded">admin123</strong>. Anda juga dapat mengubah password setiap saat pada menu <strong>User & Role</strong>.
                </p>
              </div>
            </div>

            <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end">
              <button
                type="button"
                onClick={() => setShowHelpModal(false)}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl font-bold text-xs"
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
