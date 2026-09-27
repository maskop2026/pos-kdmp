import React, { useState } from 'react';
import { X, Lock, Mail, User, Store } from 'lucide-react';

interface AuthModalProps {
  initialMode: 'login' | 'register';
  onClose: () => void;
  onSuccess: (name: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  initialMode,
  onClose,
  onSuccess,
}) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSuccess(name.trim() || 'Warga Pekalongan');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#e60023] text-white flex items-center justify-center font-bold text-sm">
              P
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900">
                {mode === 'login' ? 'Masuk ke PALOPE' : 'Daftar Akun Baru'}
              </h3>
              <p className="text-[11px] text-gray-500">Pasar Lokal Pekalongan</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-gray-100 text-xs font-bold text-center">
          <button
            type="button"
            onClick={() => setMode('login')}
            className={`flex-1 py-2.5 transition-colors ${
              mode === 'login'
                ? 'text-[#e60023] border-b-2 border-[#e60023]'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            Masuk
          </button>
          <button
            type="button"
            onClick={() => setMode('register')}
            className={`flex-1 py-2.5 transition-colors ${
              mode === 'register'
                ? 'text-[#e60023] border-b-2 border-[#e60023]'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            Daftar
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-3">
          {mode === 'register' && (
            <div>
              <label className="text-[11px] font-semibold text-gray-700 block mb-1">
                Nama Lengkap / Nama Toko
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Contoh: Budi Santoso"
                  className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:bg-white focus:outline-none focus:border-[#e60023]"
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-[11px] font-semibold text-gray-700 block mb-1">
              Email atau No. Handphone
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@email.com / 08123456789"
                className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:bg-white focus:outline-none focus:border-[#e60023]"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-gray-700 block mb-1">
              Kata Sandi
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:bg-white focus:outline-none focus:border-[#e60023]"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full mt-2 py-2.5 bg-[#e60023] hover:bg-[#cc001f] text-white font-bold rounded-xl text-xs transition-colors shadow"
          >
            {mode === 'login' ? 'Masuk Sekarang' : 'Daftar Sekarang'}
          </button>
        </form>
      </div>
    </div>
  );
};
