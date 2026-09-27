import React from 'react';
import { Store, QrCode, CreditCard, Banknote, Smartphone } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#2b2b2b] text-[#bdbdbd] pt-12 pb-6 mt-12 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 pb-8">
          {/* Kolom 1: Tentang PALOPE (Cols 4) */}
          <div className="lg:col-span-4">
            <div className="flex items-center gap-2 text-xl font-extrabold text-[#e60023] mb-3">
              <div className="w-8 h-8 rounded-lg bg-[#e60023] text-white flex items-center justify-center font-black text-base shadow">
                P
              </div>
              <span>PALOPE</span>
            </div>
            <p className="text-gray-400 text-xs leading-relaxed mb-4">
              Pasar Lokal Pekalongan. Platform e-commerce yang menghubungkan warga
              melalui kebutuhan sembako harian dan produk UMKM unggulan daerah.
            </p>
            <div className="flex items-center gap-2">
              <a
                href="#"
                className="w-8 h-8 rounded-full bg-gray-700 hover:bg-[#e60023] text-white flex items-center justify-center transition-colors text-xs font-bold"
                title="Facebook"
              >
                f
              </a>
              <a
                href="#"
                className="w-8 h-8 rounded-full bg-gray-700 hover:bg-[#e60023] text-white flex items-center justify-center transition-colors text-xs font-bold"
                title="Instagram"
              >
                ig
              </a>
              <a
                href="#"
                className="w-8 h-8 rounded-full bg-gray-700 hover:bg-[#e60023] text-white flex items-center justify-center transition-colors text-xs font-bold"
                title="TikTok"
              >
                tt
              </a>
              <a
                href="#"
                className="w-8 h-8 rounded-full bg-gray-700 hover:bg-[#e60023] text-white flex items-center justify-center transition-colors text-xs font-bold"
                title="WhatsApp"
              >
                wa
              </a>
            </div>
          </div>

          {/* Kolom 2: Navigasi (Cols 2) */}
          <div className="lg:col-span-2">
            <h5 className="text-white text-sm font-bold mb-3">Navigasi</h5>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="#" className="hover:text-[#e60023] transition-colors">
                  Beranda
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#e60023] transition-colors">
                  Produk Unggulan
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#e60023] transition-colors">
                  Promo Bulan Ini
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#e60023] transition-colors">
                  Lintas Info
                </a>
              </li>
            </ul>
          </div>

          {/* Kolom 3: Layanan (Cols 2) */}
          <div className="lg:col-span-2">
            <h5 className="text-white text-sm font-bold mb-3">Layanan</h5>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="#" className="hover:text-[#e60023] transition-colors">
                  Pusat Bantuan
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#e60023] transition-colors">
                  Cara Pemesanan
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#e60023] transition-colors">
                  Syarat & Ketentuan
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#e60023] transition-colors">
                  Kebijakan Privasi
                </a>
              </li>
            </ul>
          </div>

          {/* Kolom 4: Pembayaran & Pengiriman (Cols 4) */}
          <div className="lg:col-span-4">
            <h5 className="text-white text-sm font-bold mb-2">Metode Pembayaran</h5>
            <div className="flex items-center gap-3 text-gray-400 mb-4">
              <div className="flex items-center gap-1 bg-gray-800 px-2 py-1 rounded text-[11px]">
                <CreditCard className="w-3.5 h-3.5 text-blue-400" />
                <span>Kartu / Debit</span>
              </div>
              <div className="flex items-center gap-1 bg-gray-800 px-2 py-1 rounded text-[11px]">
                <QrCode className="w-3.5 h-3.5 text-amber-400" />
                <span>QRIS</span>
              </div>
              <div className="flex items-center gap-1 bg-gray-800 px-2 py-1 rounded text-[11px]">
                <Banknote className="w-3.5 h-3.5 text-emerald-400" />
                <span>COD Posko</span>
              </div>
            </div>

            <h5 className="text-white text-sm font-bold mb-2">Jasa Pengiriman</h5>
            <div className="flex flex-wrap gap-1.5 mb-4">
              {['JNE', 'SiCepat', 'J&T', 'GoSend', 'GrabExpress'].map((courier) => (
                <span
                  key={courier}
                  className="bg-gray-100 text-gray-800 font-bold px-2 py-0.5 rounded text-[10px]"
                >
                  {courier}
                </span>
              ))}
            </div>

            <h5 className="text-white text-sm font-bold mb-2">Download Aplikasi</h5>
            <div className="flex items-center gap-2">
              <span className="bg-white text-gray-900 px-3 py-1 rounded font-bold text-[11px] inline-flex items-center gap-1">
                <Smartphone className="w-3.5 h-3.5" /> Google Play
              </span>
              <span className="bg-white text-gray-900 px-3 py-1 rounded font-bold text-[11px] inline-flex items-center gap-1">
                <Smartphone className="w-3.5 h-3.5" /> App Store
              </span>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700/80 pt-6 text-center text-gray-500 text-[11px]">
          <p>© 2023 PALOPE Market. Pilot Project KDMP. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};
