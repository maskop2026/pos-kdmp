import React, { useState } from 'react';
import {
  Wrench,
  Store,
  Printer,
  Receipt,
  Percent,
  Database,
  Save,
  RotateCcw,
  Download,
  Upload,
  CheckCircle,
  HelpCircle,
  Sliders,
  ShieldAlert,
  Server,
  Sparkles,
  Smartphone,
  Eye,
  Info,
} from 'lucide-react';
import { KdmpSettings } from '../../types/kdmp';
import { DEFAULT_KDMP_SETTINGS } from '../../data/kdmpData';

interface SettingsViewProps {
  onShowToast?: (type: 'success' | 'info' | 'warning', title: string, message: string) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ onShowToast }) => {
  // Settings Form State
  const [settings, setSettings] = useState<KdmpSettings>(DEFAULT_KDMP_SETTINGS);

  // Active Tab: 'profile' | 'receipt' | 'transaction' | 'database'
  const [activeTab, setActiveTab] = useState<'profile' | 'receipt' | 'transaction' | 'database'>('profile');

  // Test Print simulation state
  const [isTestPrinting, setIsTestPrinting] = useState<boolean>(false);

  // Save Settings Handler
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    if (onShowToast) {
      onShowToast(
        'success',
        'Pengaturan Tersimpan',
        'Konfigurasi sistem POS KDMP berhasil diperbarui dan diterapkan ke seluruh modul.'
      );
    } else {
      alert('Pengaturan sistem POS KDMP berhasil disimpan!');
    }
  };

  // Reset to Default Handler
  const handleResetDefault = () => {
    if (confirm('Kembalikan semua konfigurasi ke pengaturan default awal KDMP?')) {
      setSettings(DEFAULT_KDMP_SETTINGS);
      if (onShowToast) {
        onShowToast('info', 'Reset Pengaturan', 'Pengaturan telah dikembalikan ke pengaturan awal pabrik.');
      }
    }
  };

  // Test Print Thermal Receipt
  const handleTestPrint = () => {
    setIsTestPrinting(true);
    setTimeout(() => {
      setIsTestPrinting(false);
      window.print();
      if (onShowToast) {
        onShowToast('success', 'Uji Cetak Selesai', 'Perintah cetak struk thermal telah dikirim ke printer.');
      }
    }, 600);
  };

  // Download SQL Backup Dump
  const handleDownloadBackup = () => {
    const today = new Date().toISOString().split('T')[0];
    const sqlDumpContent = `-- ========================================================
-- BACKUP DATABASE SISTEM POS KDMP (KOPERASI DESA MERDEKA PERKASA)
-- Tanggal Ekspor: ${new Date().toLocaleString('id-ID')}
-- Versi Aplikasi: KDMP POS Enterprise v2.4.0
-- Database Server: MySQL 8.0.32
-- ========================================================

SET FOREIGN_KEY_CHECKS=0;
DROP TABLE IF EXISTS users, roles, products, categories, brands, suppliers, warehouses, purchase_orders, accounts, expenses, sales, outlets;

-- Table structure for roles
CREATE TABLE roles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  role_name VARCHAR(100) NOT NULL,
  description TEXT,
  status ENUM('Aktif', 'Non-Aktif') DEFAULT 'Aktif'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO roles VALUES 
(1, 'Super Admin', 'Akses penuh seluruh sistem', 'Aktif'),
(2, 'Ketua Koperasi', 'Approval pembayaran & pengeluaran', 'Aktif'),
(3, 'Bendahara', 'Manajemen kas & bank', 'Aktif'),
(4, 'Kasir POS', 'Layanan kasir & transaksi penjualan', 'Aktif'),
(5, 'Admin Gudang', 'Penerimaan stok & mutasi barang', 'Aktif');

-- Table structure for outlets
CREATE TABLE outlets (
  id INT AUTO_INCREMENT PRIMARY KEY,
  outlet_code VARCHAR(50) NOT NULL,
  outlet_name VARCHAR(150) NOT NULL,
  type ENUM('Pusat', 'Cabang', 'Kios', 'Mitra') DEFAULT 'Cabang',
  pic_name VARCHAR(100),
  city VARCHAR(100),
  status ENUM('Aktif', 'Non-Aktif', 'Maintenance') DEFAULT 'Aktif'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO outlets VALUES
(1, 'OTL-001', 'Outlet Pusat Swalayan KDMP Jetakkidul', 'Pusat', 'Drs. H. Mulyono', 'Pekalongan', 'Aktif'),
(2, 'OTL-002', 'Cabang KDMP Tirto Makmur', 'Cabang', 'Budi Santoso', 'Pekalongan', 'Aktif'),
(3, 'OTL-003', 'Cabang KDMP Buaran Lestari', 'Cabang', 'Siti Aminah', 'Pekalongan', 'Aktif');

-- End of backup dump
SET FOREIGN_KEY_CHECKS=1;
`;

    const blob = new Blob([sqlDumpContent], { type: 'text/sql;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `kdmp_backup_database_${today}.sql`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    if (onShowToast) {
      onShowToast('success', 'Backup Berhasil', `File database 'kdmp_backup_database_${today}.sql' berhasil diunduh.`);
    }
  };

  // Restore Simulation
  const handleRestoreSimulation = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.sql';
    input.onchange = (e: any) => {
      const file = e.target.files[0];
      if (file) {
        if (confirm(`Apakah Anda yakin ingin memulihkan (restore) database dari file '${file.name}'? Data saat ini akan disinkronkan.`)) {
          if (onShowToast) {
            onShowToast('success', 'Restore Selesai', `Database berhasil dipulihkan dari '${file.name}'.`);
          }
        }
      }
    };
    input.click();
  };

  return (
    <div className="space-y-4">
      {/* 1. CARD UTAMA KDMP: HEADER & ACTION BUTTONS */}
      <div className="bg-white rounded-xl border border-[#E0E0E0] p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-[#D32F2F] shrink-0 border border-red-100">
            <Wrench className="w-5 h-5" />
          </div>
          <div>
            <h5 className="text-base font-bold text-gray-900 tracking-tight flex items-center gap-2">
              Pengaturan Sistem POS KDMP
            </h5>
            <p className="text-xs text-gray-500">
              Konfigurasi profil toko koperasi, cetak struk nota, printer thermal, perpajakan, dan pemeliharaan database.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
          <button
            type="button"
            onClick={handleResetDefault}
            className="px-3 py-1.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-600 text-xs font-bold rounded-lg shadow-xs flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Default</span>
          </button>

          <button
            type="button"
            onClick={handleSaveSettings}
            className="px-4 py-1.5 bg-[#D32F2F] hover:bg-[#B71C1C] text-white text-xs font-bold rounded-lg shadow-xs flex items-center gap-1.5 transition-colors"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Simpan Perubahan</span>
          </button>
        </div>
      </div>

      {/* 2. CARD BODY: TAB NAVIGASI & CONTENT */}
      <div className="bg-white rounded-xl border border-[#E0E0E0] shadow-xs overflow-hidden">
        {/* TAB NAVIGATION (nav-tabs-kdmp) */}
        <div className="border-b border-[#E0E0E0] px-4 pt-3 flex gap-2 overflow-x-auto scrollbar-none bg-gray-50/50">
          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors ${
              activeTab === 'profile'
                ? 'border-[#D32F2F] text-[#D32F2F] bg-white rounded-t-lg shadow-xs'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Store className="w-3.5 h-3.5" />
            <span>Profil Toko & Koperasi</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('receipt')}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors ${
              activeTab === 'receipt'
                ? 'border-[#D32F2F] text-[#D32F2F] bg-white rounded-t-lg shadow-xs'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Receipt className="w-3.5 h-3.5" />
            <span>Struk & Printer Thermal</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('transaction')}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors ${
              activeTab === 'transaction'
                ? 'border-[#D32F2F] text-[#D32F2F] bg-white rounded-t-lg shadow-xs'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Percent className="w-3.5 h-3.5" />
            <span>Transaksi & Pajak (PPN)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('database')}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors ${
              activeTab === 'database'
                ? 'border-[#D32F2F] text-[#D32F2F] bg-white rounded-t-lg shadow-xs'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>Backup & Database</span>
          </button>
        </div>

        {/* TAB CONTENTS */}
        <div className="p-4 sm:p-6">
          {/* ======================================================== */}
          {/* TAB 1: PROFIL TOKO & KOPERASI                           */}
          {/* ======================================================== */}
          {activeTab === 'profile' && (
            <form onSubmit={handleSaveSettings} className="space-y-5 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">
                    Nama Induk Koperasi <span className="text-[#D32F2F]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={settings.cooperativeName}
                    onChange={(e) => setSettings({ ...settings, cooperativeName: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-800 font-medium focus:outline-none focus:ring-1 focus:ring-red-500"
                  />
                  <small className="text-gray-400 text-[10px]">
                    Nama resmi badan usaha koperasi sesuai akta Kemenkumham
                  </small>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-1">
                    Nama Toko / Swalayan (Brand POS) <span className="text-[#D32F2F]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={settings.storeName}
                    onChange={(e) => setSettings({ ...settings, storeName: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-800 font-medium focus:outline-none focus:ring-1 focus:ring-red-500"
                  />
                  <small className="text-gray-400 text-[10px]">
                    Nama gerai yang ditampilkan pada layar kasir dan aplikasi
                  </small>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-1">
                    Nomor Badan Hukum Koperasi
                  </label>
                  <input
                    type="text"
                    value={settings.legalEntityNumber}
                    onChange={(e) => setSettings({ ...settings, legalEntityNumber: e.target.value })}
                    placeholder="Contoh: AHU-0012981.AH.01.26.TAHUN 2023"
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-800 font-mono focus:outline-none focus:ring-1 focus:ring-red-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-1">
                    Nomor Pokok Wajib Pajak (NPWP)
                  </label>
                  <input
                    type="text"
                    value={settings.npwp}
                    onChange={(e) => setSettings({ ...settings, npwp: e.target.value })}
                    placeholder="03.xxx.xxx.x-xxx.xxx"
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-800 font-mono focus:outline-none focus:ring-1 focus:ring-red-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-gray-700 font-semibold mb-1">
                    Alamat Lengkap Kantor & Toko Utama <span className="text-[#D32F2F]">*</span>
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={settings.storeAddress}
                    onChange={(e) => setSettings({ ...settings, storeAddress: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-800 focus:outline-none focus:ring-1 focus:ring-red-500 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-1">
                    Kota / Kabupaten & Provinsi <span className="text-[#D32F2F]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={settings.city}
                    onChange={(e) => setSettings({ ...settings, city: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-800 focus:outline-none focus:ring-1 focus:ring-red-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Kode Pos</label>
                  <input
                    type="text"
                    value={settings.postalCode}
                    onChange={(e) => setSettings({ ...settings, postalCode: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-800 font-mono focus:outline-none focus:ring-1 focus:ring-red-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-1">
                    No. Telepon / WhatsApp Customer Service <span className="text-[#D32F2F]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={settings.storePhone}
                    onChange={(e) => setSettings({ ...settings, storePhone: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-800 font-mono focus:outline-none focus:ring-1 focus:ring-red-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-1">
                    Email Resmi Koperasi
                  </label>
                  <input
                    type="email"
                    value={settings.storeEmail}
                    onChange={(e) => setSettings({ ...settings, storeEmail: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-800 focus:outline-none focus:ring-1 focus:ring-red-500"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 flex justify-end">
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#D32F2F] hover:bg-[#B71C1C] text-white text-xs font-bold rounded-lg shadow-xs flex items-center gap-1.5 transition-colors"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Simpan Profil Toko</span>
                </button>
              </div>
            </form>
          )}

          {/* ======================================================== */}
          {/* TAB 2: STRUK NOTA & PRINTER THERMAL (WITH LIVE PREVIEW)  */}
          {/* ======================================================== */}
          {activeTab === 'receipt' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Form Settings Struk (7 Cols) */}
              <div className="lg:col-span-7 space-y-4">
                <h6 className="text-xs font-bold text-gray-800 uppercase tracking-wider">
                  Konfigurasi Desain & Format Struk
                </h6>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-1">
                      Header Utama Struk (Nama Toko Dicetak) <span className="text-[#D32F2F]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={settings.receiptHeader}
                      onChange={(e) => setSettings({ ...settings, receiptHeader: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-800 font-bold focus:outline-none focus:ring-1 focus:ring-red-500 uppercase"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-1">
                      Catatan Kaki Struk (Footer Message) <span className="text-[#D32F2F]">*</span>
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={settings.receiptFooter}
                      onChange={(e) => setSettings({ ...settings, receiptFooter: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-800 focus:outline-none focus:ring-1 focus:ring-red-500 resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-1">
                      Ukuran Kertas Printer Thermal
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setSettings({ ...settings, paperWidth: '58mm' })}
                        className={`p-3 rounded-xl border text-center transition-all ${
                          settings.paperWidth === '58mm'
                            ? 'border-[#D32F2F] bg-red-50/30 text-[#D32F2F] font-bold shadow-xs'
                            : 'border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        <Printer className="w-4 h-4 mx-auto mb-1 text-gray-700" />
                        <span className="block text-xs">58 mm Thermal</span>
                        <span className="text-[10px] text-gray-400 font-normal">Standar Printer Mini / EDC</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setSettings({ ...settings, paperWidth: '80mm' })}
                        className={`p-3 rounded-xl border text-center transition-all ${
                          settings.paperWidth === '80mm'
                            ? 'border-[#D32F2F] bg-red-50/30 text-[#D32F2F] font-bold shadow-xs'
                            : 'border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        <Printer className="w-4 h-4 mx-auto mb-1 text-gray-700" />
                        <span className="block text-xs">80 mm Thermal</span>
                        <span className="text-[10px] text-gray-400 font-normal">Supermarket & Kasir Lebar</span>
                      </button>
                    </div>
                  </div>

                  {/* Switch Toggles */}
                  <div className="space-y-2 pt-2 border-t border-gray-100">
                    <label className="flex items-center justify-between p-2.5 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100/80 transition-colors">
                      <div>
                        <span className="font-semibold text-gray-800 block">Cetak QRIS / Barcode Invoice</span>
                        <span className="text-[10px] text-gray-400">Menyertakan barcode struk untuk scan retur atau verifikasi kasir</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.showBarcode}
                        onChange={(e) => setSettings({ ...settings, showBarcode: e.target.checked })}
                        className="w-4 h-4 accent-[#D32F2F] rounded cursor-pointer"
                      />
                    </label>

                    <label className="flex items-center justify-between p-2.5 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100/80 transition-colors">
                      <div>
                        <span className="font-semibold text-gray-800 block">Tampilkan Nama Petugas Kasir</span>
                        <span className="text-[10px] text-gray-400">Mencetak nama kasir yang melayani transaksi</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.showCashierName}
                        onChange={(e) => setSettings({ ...settings, showCashierName: e.target.checked })}
                        className="w-4 h-4 accent-[#D32F2F] rounded cursor-pointer"
                      />
                    </label>

                    <label className="flex items-center justify-between p-2.5 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100/80 transition-colors">
                      <div>
                        <span className="font-semibold text-gray-800 block">Tampilkan Poin & Hemat Belanja Member</span>
                        <span className="text-[10px] text-gray-400">Informasi penghematan harga grosir / SHU untuk anggota koperasi</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.showMemberPoints}
                        onChange={(e) => setSettings({ ...settings, showMemberPoints: e.target.checked })}
                        className="w-4 h-4 accent-[#D32F2F] rounded cursor-pointer"
                      />
                    </label>

                    <label className="flex items-center justify-between p-2.5 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100/80 transition-colors">
                      <div>
                        <span className="font-semibold text-gray-800 block">Auto-Print Struk Selesai Bayar</span>
                        <span className="text-[10px] text-gray-400">Membuka dialog cetak otomatis saat kasir klik Selesai Bayar</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.autoPrintReceipt}
                        onChange={(e) => setSettings({ ...settings, autoPrintReceipt: e.target.checked })}
                        className="w-4 h-4 accent-[#D32F2F] rounded cursor-pointer"
                      />
                    </label>
                  </div>

                  <div className="pt-3 flex gap-2">
                    <button
                      type="button"
                      disabled={isTestPrinting}
                      onClick={handleTestPrint}
                      className="px-3.5 py-1.5 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-bold rounded-lg text-xs flex items-center gap-1.5 shadow-xs"
                    >
                      <Printer className="w-3.5 h-3.5 text-gray-600" />
                      <span>{isTestPrinting ? 'Mengirim ke Printer...' : 'Test Print Struk'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveSettings}
                      className="px-4 py-1.5 bg-[#D32F2F] hover:bg-[#B71C1C] text-white font-bold rounded-lg text-xs shadow-xs flex items-center gap-1.5"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Simpan Format Struk</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Live Paper Receipt Preview (5 Cols) */}
              <div className="lg:col-span-5 bg-gray-100 p-4 sm:p-5 rounded-2xl border border-gray-200">
                <div className="flex items-center justify-between mb-3 text-xs">
                  <span className="font-bold text-gray-700 flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5 text-[#D32F2F]" />
                    Pratinjau Kertas Thermal ({settings.paperWidth})
                  </span>
                  <span className="text-[10px] text-gray-400 font-mono">Live Reactive</span>
                </div>

                {/* Printable Thermal Receipt Card */}
                <div
                  className={`mx-auto bg-white p-4 shadow-md rounded border border-dashed border-gray-300 font-mono text-gray-800 text-[11px] leading-tight select-none transition-all ${
                    settings.paperWidth === '58mm' ? 'max-w-[280px]' : 'max-w-[340px]'
                  }`}
                >
                  {/* Header */}
                  <div className="text-center pb-2 border-b border-dashed border-gray-400 space-y-0.5">
                    <h5 className="font-black text-xs text-gray-900 tracking-wider">
                      {settings.receiptHeader || 'KDMP MART'}
                    </h5>
                    <p className="text-[9.5px] text-gray-600">{settings.storeAddress}</p>
                    <p className="text-[9.5px] text-gray-600">Telp: {settings.storePhone}</p>
                  </div>

                  {/* Metadata */}
                  <div className="py-2 border-b border-dashed border-gray-400 text-[10px] space-y-0.5">
                    <div className="flex justify-between">
                      <span>No: INV-202410-098</span>
                      <span>24/10/24 14:30</span>
                    </div>
                    {settings.showCashierName && (
                      <div className="flex justify-between">
                        <span>Kasir: Rina Fitriyani</span>
                        <span>POS-01</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>Plg: Budi Santoso (Member)</span>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="py-2 border-b border-dashed border-gray-400 space-y-1 text-[10.5px]">
                    <div>
                      <div className="flex justify-between font-bold">
                        <span>Beras Rojolele 5kg</span>
                        <span>75.000</span>
                      </div>
                      <span className="text-[9px] text-gray-500">1 x 75.000</span>
                    </div>

                    <div>
                      <div className="flex justify-between font-bold">
                        <span>Minyak Bimoli 2L</span>
                        <span>76.000</span>
                      </div>
                      <span className="text-[9px] text-gray-500">2 x 38.000</span>
                    </div>

                    <div>
                      <div className="flex justify-between font-bold">
                        <span>Gula Gulaku 1kg</span>
                        <span>19.000</span>
                      </div>
                      <span className="text-[9px] text-gray-500">1 x 19.000</span>
                    </div>
                  </div>

                  {/* Totals */}
                  <div className="py-2 border-b border-dashed border-gray-400 space-y-1 text-[10.5px]">
                    <div className="flex justify-between">
                      <span>Subtotal (4 Item):</span>
                      <span>170.000</span>
                    </div>
                    {settings.showMemberPoints && (
                      <div className="flex justify-between text-emerald-700 font-bold">
                        <span>Hemat Member KDMP:</span>
                        <span>-5.000</span>
                      </div>
                    )}
                    <div className="flex justify-between font-black text-xs text-gray-900 pt-1 border-t border-gray-200">
                      <span>TOTAL BAYAR:</span>
                      <span>Rp 165.000</span>
                    </div>
                    <div className="flex justify-between">
                      <span>TUNAI:</span>
                      <span>200.000</span>
                    </div>
                    <div className="flex justify-between">
                      <span>KEMBALI:</span>
                      <span>35.000</span>
                    </div>
                  </div>

                  {/* Barcode Mock */}
                  {settings.showBarcode && (
                    <div className="py-2.5 text-center">
                      <div className="h-7 w-40 bg-gray-800 mx-auto tracking-widest text-white text-[7px] flex items-center justify-center font-mono">
                        ||| | || |||| | ||| || |||
                      </div>
                      <span className="text-[8px] text-gray-400 mt-0.5 block font-mono">
                        *INV-202410-098*
                      </span>
                    </div>
                  )}

                  {/* Footer Message */}
                  <div className="text-center pt-2 text-[9px] text-gray-600 leading-normal">
                    <p>{settings.receiptFooter}</p>
                    <p className="mt-1 text-[8px] text-gray-400 font-sans">
                      Koperasi Desa Merdeka Perkasa • Jetakkidul
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 3: TRANSAKSI & PERPAJAKAN (PPN)                     */}
          {/* ======================================================== */}
          {activeTab === 'transaction' && (
            <form onSubmit={handleSaveSettings} className="space-y-5 text-xs max-w-2xl">
              <div>
                <h6 className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-3">
                  Aturan Pajak Penjualan (PPN)
                </h6>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-1">
                      Status Pajak Penjualan Toko
                    </label>
                    <select
                      value={settings.taxStatus}
                      onChange={(e) => setSettings({ ...settings, taxStatus: e.target.value as any })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-2 text-xs text-gray-800 focus:outline-none focus:ring-1 focus:ring-red-500 font-medium"
                    >
                      <option value="Non-PPN">Non-PPN (Bebas Pajak Koperasi)</option>
                      <option value="PPN Include">PPN Include (Harga Sudah Termasuk Pajak)</option>
                      <option value="PPN Exclude">PPN Exclude (Pajak Ditambahkan di Kasir)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-1">
                      Tarif PPN (%)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={settings.taxRatePercent}
                      onChange={(e) =>
                        setSettings({ ...settings, taxRatePercent: Number(e.target.value) || 0 })
                      }
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-800 font-mono focus:outline-none focus:ring-1 focus:ring-red-500"
                    />
                    <small className="text-gray-400 text-[10px]">
                      Standar PPN nasional Indonesia: 11%
                    </small>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-gray-100">
                <h6 className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-3">
                  Kebijakan Kasir & Pembulatan
                </h6>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-1">
                      Pembulatan Kembalian Kasir
                    </label>
                    <select
                      value={settings.roundingMethod}
                      onChange={(e) => setSettings({ ...settings, roundingMethod: e.target.value as any })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-2 text-xs text-gray-800 focus:outline-none focus:ring-1 focus:ring-red-500 font-medium"
                    >
                      <option value="none">Tidak Ada Pembulatan (Sesuai Rupiah Asli)</option>
                      <option value="100">Bulatkan ke Rp 100 terdekat</option>
                      <option value="500">Bulatkan ke Rp 500 terdekat</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-1">
                      Modal Awal Laci Kasir Default (Rp)
                    </label>
                    <input
                      type="number"
                      step="10000"
                      value={settings.defaultCashierModal}
                      onChange={(e) =>
                        setSettings({ ...settings, defaultCashierModal: Number(e.target.value) || 0 })
                      }
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-800 font-mono focus:outline-none focus:ring-1 focus:ring-red-500 font-bold"
                    />
                    <small className="text-gray-400 text-[10px]">
                      Uang kembalian awal saat kasir membuka shift pagi/siang
                    </small>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-gray-100">
                <h6 className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-3">
                  Batasan Piutang & Inventaris
                </h6>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-1">
                      Batas Maksimal Hutang Member (Rp)
                    </label>
                    <input
                      type="number"
                      step="100000"
                      value={settings.maxCustomerDebt}
                      onChange={(e) =>
                        setSettings({ ...settings, maxCustomerDebt: Number(e.target.value) || 0 })
                      }
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-800 font-mono focus:outline-none focus:ring-1 focus:ring-red-500"
                    />
                    <small className="text-gray-400 text-[10px]">
                      Peringatan kasir jika bon hutang anggota koperasi melebihi batas
                    </small>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-1">
                      Ambang Batas Peringatan Stok Menipis
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={settings.minStockAlert}
                      onChange={(e) =>
                        setSettings({ ...settings, minStockAlert: Number(e.target.value) || 1 })
                      }
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-800 font-mono focus:outline-none focus:ring-1 focus:ring-red-500"
                    />
                    <small className="text-gray-400 text-[10px]">
                      Tampilkan notifikasi jika stok barang di bawah kuantitas ini
                    </small>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 flex justify-end">
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#D32F2F] hover:bg-[#B71C1C] text-white text-xs font-bold rounded-lg shadow-xs flex items-center gap-1.5 transition-colors"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Simpan Kebijakan Transaksi</span>
                </button>
              </div>
            </form>
          )}

          {/* ======================================================== */}
          {/* TAB 4: BACKUP & DATABASE MAINTENANCE                    */}
          {/* ======================================================== */}
          {activeTab === 'database' && (
            <div className="space-y-6 text-xs max-w-3xl">
              {/* System Info Banner */}
              <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-red-100 text-[#D32F2F] flex items-center justify-center font-bold">
                    <Server className="w-4 h-4" />
                  </div>
                  <div>
                    <h6 className="font-bold text-gray-900 text-xs">
                      Status Database POS KDMP Enterprise
                    </h6>
                    <p className="text-[11px] text-gray-500">
                      Versi Aplikasi: <strong>v2.4.0 KDMP</strong> • Mesin: <strong>MySQL 8.0 InnoDB</strong> • Status: <span className="text-emerald-600 font-bold">Tersambung (Online)</span>
                    </p>
                  </div>
                </div>

                <span className="text-[10px] font-bold px-2 py-1 bg-emerald-50 text-emerald-700 rounded border border-emerald-200">
                  Koneksi Stabil (24 ms)
                </span>
              </div>

              {/* Actions Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Backup Card */}
                <div className="p-5 border border-gray-200 rounded-xl bg-white shadow-xs space-y-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Download className="w-4 h-4" />
                  </div>
                  <div>
                    <h6 className="font-bold text-gray-900 text-sm">Cadangkan Data (Backup)</h6>
                    <p className="text-gray-500 text-[11px] mt-1">
                      Unduh salinan lengkap seluruh tabel master produk, pengguna, mutasi stok, laporan keuangan, dan transaksi ke file SQL.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleDownloadBackup}
                    className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs shadow-xs flex items-center justify-center gap-2 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Cadangan Database (.sql)</span>
                  </button>
                </div>

                {/* Restore Card */}
                <div className="p-5 border border-gray-200 rounded-xl bg-white shadow-xs space-y-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                    <Upload className="w-4 h-4" />
                  </div>
                  <div>
                    <h6 className="font-bold text-gray-900 text-sm">Pulihkan Data (Restore)</h6>
                    <p className="text-gray-500 text-[11px] mt-1">
                      Unggah file cadangan SQL hasil ekspor sebelumnya untuk memulihkan seluruh data transaksi dan inventaris koperasi.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleRestoreSimulation}
                    className="w-full py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-bold rounded-lg text-xs shadow-xs flex items-center justify-center gap-2 transition-colors"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Pilih File Backup SQL</span>
                  </button>
                </div>
              </div>

              {/* Maintenance Tools */}
              <div className="p-4 border border-gray-200 rounded-xl space-y-3 bg-gray-50/40">
                <h6 className="font-bold text-gray-800 text-xs uppercase tracking-wider">
                  Pemeliharaan & Cache Sesi
                </h6>
                <div className="flex items-center justify-between flex-wrap gap-2 text-xs">
                  <div>
                    <span className="font-semibold text-gray-800 block">Bersihkan Cache & Refresh Data Toko</span>
                    <span className="text-[10px] text-gray-400">
                      Hapus cache query transaksi dan sinkronkan ulang saldo kasir
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (onShowToast) {
                        onShowToast('success', 'Cache Dibersihkan', 'Cache sistem berhasil di-refresh.');
                      }
                    }}
                    className="px-3.5 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold rounded-lg text-xs"
                  >
                    Bersihkan Cache
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
