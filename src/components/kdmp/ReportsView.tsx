import React, { useState, useMemo } from 'react';
import {
  PieChart,
  Download,
  Printer,
  Calendar,
  Filter,
  Search,
  FileText,
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingBag,
  Boxes,
  Users,
  Eye,
  CheckCircle2,
  Clock,
  AlertCircle,
  X,
  ChevronLeft,
  ChevronRight,
  Building2,
  Wallet,
  CreditCard,
  ArrowUpRight,
  ArrowDownLeft,
  BarChart3,
  RefreshCw,
  SlidersHorizontal,
} from 'lucide-react';
import { INITIAL_ACCOUNTS, INITIAL_EXPENSES, INITIAL_PURCHASE_ORDERS } from '../../data/kdmpData';

interface ReportsViewProps {
  onShowToast?: (type: 'success' | 'info' | 'warning', title: string, message: string) => void;
}

type ReportTab = 'labarugi' | 'penjualan' | 'pembelian' | 'aruskas' | 'produk';

interface SalesReportRecord {
  id: string;
  invoice: string;
  date: string;
  time: string;
  customerName: string;
  customerType: 'Umum' | 'Member' | 'Grosir';
  cashierName: string;
  paymentMethod: 'Tunai' | 'QRIS BCA' | 'Transfer Mandiri' | 'Debit BCA';
  itemsCount: number;
  subtotal: number;
  discount: number;
  grandTotal: number;
  totalHpp: number;
  grossProfit: number;
  status: 'Lunas' | 'Pending' | 'Batal';
  itemsDetail: { name: string; qty: number; unitPrice: number; hpp: number; subtotal: number }[];
}

interface ProductReportRecord {
  id: string;
  name: string;
  sku: string;
  category: string;
  brand: string;
  unit: string;
  qtySold: number;
  hpp: number;
  sellPrice: number;
  totalRevenue: number;
  totalProfit: number;
  marginPercent: number;
  currentStock: number;
  stockStatus: 'Aman' | 'Menipis' | 'Habis';
}

export const ReportsView: React.FC<ReportsViewProps> = ({ onShowToast }) => {
  // Active Tab
  const [activeTab, setActiveTab] = useState<ReportTab>('labarugi');

  // Filters
  const [periodPreset, setPeriodPreset] = useState<'today' | 'yesterday' | '7days' | 'month' | 'custom'>('month');
  const [startDate, setStartDate] = useState<string>('2024-10-01');
  const [endDate, setEndDate] = useState<string>('2024-10-31');
  const [selectedOutlet, setSelectedOutlet] = useState<string>('all');

  // Tab-specific filters & search
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [paymentFilter, setPaymentFilter] = useState<string>('all');
  const [cashierFilter, setCashierFilter] = useState<string>('all');
  const [productCategoryFilter, setProductCategoryFilter] = useState<string>('all');
  const [productSortBy, setProductSortBy] = useState<'qty' | 'revenue' | 'profit' | 'margin'>('revenue');

  // Pagination for Sales Table
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 8;

  // Modals
  const [selectedInvoice, setSelectedInvoice] = useState<SalesReportRecord | null>(null);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState<boolean>(false);

  // --- DUMMY DATA FOR EXTENSIVE KDMP REPORTING ---
  const salesData: SalesReportRecord[] = useMemo(() => [
    {
      id: 'sal-101',
      invoice: 'INV-202410-001',
      date: '2024-10-24',
      time: '14:32 WIB',
      customerName: 'Budi Santoso',
      customerType: 'Member',
      cashierName: 'Rina (Shift 2)',
      paymentMethod: 'Tunai',
      itemsCount: 3,
      subtotal: 135000,
      discount: 10000,
      grandTotal: 125000,
      totalHpp: 88000,
      grossProfit: 37000,
      status: 'Lunas',
      itemsDetail: [
        { name: 'Kopi Kapal Api Spesial Mix (Renceng)', qty: 2, unitPrice: 15000, hpp: 11000, subtotal: 30000 },
        { name: 'Minyak Goreng Bimoli 2L', qty: 2, unitPrice: 38000, hpp: 32000, subtotal: 76000 },
        { name: 'Biskuit Roma Kelapa 300g', qty: 2, unitPrice: 14500, hpp: 10500, subtotal: 29000 },
      ],
    },
    {
      id: 'sal-102',
      invoice: 'INV-202410-002',
      date: '2024-10-24',
      time: '13:10 WIB',
      customerName: 'Citra Lestari',
      customerType: 'Umum',
      cashierName: 'Rina (Shift 2)',
      paymentMethod: 'QRIS BCA',
      itemsCount: 4,
      subtotal: 350000,
      discount: 0,
      grandTotal: 350000,
      totalHpp: 245000,
      grossProfit: 105000,
      status: 'Lunas',
      itemsDetail: [
        { name: 'Beras Rojolele Super 5kg', qty: 3, unitPrice: 75000, hpp: 62000, subtotal: 225000 },
        { name: 'Gula Pasir Gulaku 1kg', qty: 5, unitPrice: 19000, hpp: 15500, subtotal: 95000 },
        { name: 'Teh Celup Sariwangi 25s', qty: 3, unitPrice: 10000, hpp: 7500, subtotal: 30000 },
      ],
    },
    {
      id: 'sal-103',
      invoice: 'INV-202410-003',
      date: '2024-10-24',
      time: '11:45 WIB',
      customerName: 'Toko Kelontong Barokah',
      customerType: 'Grosir',
      cashierName: 'Andi (Shift 1)',
      paymentMethod: 'Transfer Mandiri',
      itemsCount: 6,
      subtotal: 1850000,
      discount: 50000,
      grandTotal: 1800000,
      totalHpp: 1420000,
      grossProfit: 380000,
      status: 'Lunas',
      itemsDetail: [
        { name: 'Indomie Goreng Dus (40 pcs)', qty: 10, unitPrice: 118000, hpp: 102000, subtotal: 1180000 },
        { name: 'Minyak Goreng Bimoli 2L Dus (6 pouch)', qty: 2, unitPrice: 220000, hpp: 190000, subtotal: 440000 },
        { name: 'Kopi Kapal Api Dus (12 renceng)', qty: 1, unitPrice: 180000, hpp: 150000, subtotal: 180000 },
      ],
    },
    {
      id: 'sal-104',
      invoice: 'INV-202410-004',
      date: '2024-10-23',
      time: '18:20 WIB',
      customerName: 'Siti Aminah',
      customerType: 'Member',
      cashierName: 'Rina (Shift 2)',
      paymentMethod: 'Tunai',
      itemsCount: 2,
      subtotal: 84000,
      discount: 0,
      grandTotal: 84000,
      totalHpp: 58000,
      grossProfit: 26000,
      status: 'Lunas',
      itemsDetail: [
        { name: 'Gula Pasir Gulaku 1kg', qty: 2, unitPrice: 19000, hpp: 15500, subtotal: 38000 },
        { name: 'Biskuit Roma Kelapa 300g', qty: 2, unitPrice: 14500, hpp: 10500, subtotal: 29000 },
        { name: 'Kopi Kapal Api Renceng', qty: 1, unitPrice: 17000, hpp: 13000, subtotal: 17000 },
      ],
    },
    {
      id: 'sal-105',
      invoice: 'INV-202410-005',
      date: '2024-10-23',
      time: '16:55 WIB',
      customerName: 'Ahmad Dahlan',
      customerType: 'Umum',
      cashierName: 'Rina (Shift 2)',
      paymentMethod: 'Debit BCA',
      itemsCount: 5,
      subtotal: 420000,
      discount: 0,
      grandTotal: 420000,
      totalHpp: 295000,
      grossProfit: 125000,
      status: 'Lunas',
      itemsDetail: [
        { name: 'Beras Rojolele Super 5kg', qty: 4, unitPrice: 75000, hpp: 62000, subtotal: 300000 },
        { name: 'Indomie Goreng Satuan', qty: 20, unitPrice: 3500, hpp: 2800, subtotal: 70000 },
        { name: 'Teh Celup Sariwangi 25s', qty: 5, unitPrice: 10000, hpp: 7500, subtotal: 50000 },
      ],
    },
    {
      id: 'sal-106',
      invoice: 'INV-202410-006',
      date: '2024-10-22',
      time: '10:15 WIB',
      customerName: 'Dewi Sartika',
      customerType: 'Member',
      cashierName: 'Andi (Shift 1)',
      paymentMethod: 'Tunai',
      itemsCount: 1,
      subtotal: 675000,
      discount: 15000,
      grandTotal: 660000,
      totalHpp: 520000,
      grossProfit: 140000,
      status: 'Lunas',
      itemsDetail: [
        { name: 'Beras Rojolele Super 5kg', qty: 8, unitPrice: 75000, hpp: 62000, subtotal: 600000 },
        { name: 'Gula Pasir Gulaku 1kg', qty: 4, unitPrice: 18750, hpp: 15500, subtotal: 75000 },
      ],
    },
    {
      id: 'sal-107',
      invoice: 'INV-202410-007',
      date: '2024-10-21',
      time: '15:40 WIB',
      customerName: 'Haji Bambang',
      customerType: 'Grosir',
      cashierName: 'Rina (Shift 2)',
      paymentMethod: 'Transfer Mandiri',
      itemsCount: 8,
      subtotal: 2450000,
      discount: 75000,
      grandTotal: 2375000,
      totalHpp: 1860000,
      grossProfit: 515000,
      status: 'Lunas',
      itemsDetail: [
        { name: 'Indomie Goreng Dus (40 pcs)', qty: 15, unitPrice: 118000, hpp: 102000, subtotal: 1770000 },
        { name: 'Gula Pasir Karung 50kg', qty: 1, unitPrice: 680000, hpp: 610000, subtotal: 680000 },
      ],
    },
    {
      id: 'sal-108',
      invoice: 'INV-202410-008',
      date: '2024-10-20',
      time: '09:30 WIB',
      customerName: 'Warung Bu Sri',
      customerType: 'Grosir',
      cashierName: 'Andi (Shift 1)',
      paymentMethod: 'QRIS BCA',
      itemsCount: 4,
      subtotal: 920000,
      discount: 20000,
      grandTotal: 900000,
      totalHpp: 710000,
      grossProfit: 190000,
      status: 'Lunas',
      itemsDetail: [
        { name: 'Minyak Goreng Bimoli 2L Dus', qty: 3, unitPrice: 220000, hpp: 190000, subtotal: 660000 },
        { name: 'Biskuit Roma Dus', qty: 2, unitPrice: 130000, hpp: 110000, subtotal: 260000 },
      ],
    },
    {
      id: 'sal-109',
      invoice: 'INV-202410-009',
      date: '2024-10-19',
      time: '14:12 WIB',
      customerName: 'Agus Riyadi',
      customerType: 'Umum',
      cashierName: 'Rina (Shift 2)',
      paymentMethod: 'Tunai',
      itemsCount: 2,
      subtotal: 165000,
      discount: 0,
      grandTotal: 165000,
      totalHpp: 120000,
      grossProfit: 45000,
      status: 'Lunas',
      itemsDetail: [
        { name: 'Beras Rojolele Super 5kg', qty: 1, unitPrice: 75000, hpp: 62000, subtotal: 75000 },
        { name: 'Minyak Goreng Bimoli 2L', qty: 2, unitPrice: 38000, hpp: 32000, subtotal: 76000 },
        { name: 'Kopi Kapal Api Renceng', qty: 1, unitPrice: 14000, hpp: 11000, subtotal: 14000 },
      ],
    },
    {
      id: 'sal-110',
      invoice: 'INV-202410-010',
      date: '2024-10-18',
      time: '11:05 WIB',
      customerName: 'Toko Surya Kencana',
      customerType: 'Grosir',
      cashierName: 'Andi (Shift 1)',
      paymentMethod: 'Transfer Mandiri',
      itemsCount: 7,
      subtotal: 3120000,
      discount: 100000,
      grandTotal: 3020000,
      totalHpp: 2380000,
      grossProfit: 640000,
      status: 'Lunas',
      itemsDetail: [
        { name: 'Beras Rojolele 5kg Zak', qty: 30, unitPrice: 74000, hpp: 62000, subtotal: 2220000 },
        { name: 'Minyak Goreng Bimoli Dus', qty: 4, unitPrice: 225000, hpp: 190000, subtotal: 900000 },
      ],
    },
  ], []);

  // Products Analytical Data
  const productsReportData: ProductReportRecord[] = useMemo(() => [
    {
      id: 'prd-1',
      name: 'Beras Rojolele Super 5kg',
      sku: 'SKU-BRS-001',
      category: 'Sembako',
      brand: 'Rojolele',
      unit: 'Zak',
      qtySold: 420,
      hpp: 62000,
      sellPrice: 75000,
      totalRevenue: 31500000,
      totalProfit: 5460000,
      marginPercent: 17.3,
      currentStock: 145,
      stockStatus: 'Aman',
    },
    {
      id: 'prd-2',
      name: 'Minyak Goreng Bimoli 2L Pouch',
      sku: 'SKU-MYK-002',
      category: 'Sembako',
      brand: 'Indofood',
      unit: 'Pouch',
      qtySold: 380,
      hpp: 32000,
      sellPrice: 38000,
      totalRevenue: 14440000,
      totalProfit: 2280000,
      marginPercent: 15.8,
      currentStock: 82,
      stockStatus: 'Aman',
    },
    {
      id: 'prd-3',
      name: 'Indomie Goreng Original (Dus 40 Pcs)',
      sku: 'SKU-MIE-003',
      category: 'Makanan',
      brand: 'Indofood',
      unit: 'Karton',
      qtySold: 185,
      hpp: 102000,
      sellPrice: 118000,
      totalRevenue: 21830000,
      totalProfit: 2960000,
      marginPercent: 13.6,
      currentStock: 48,
      stockStatus: 'Aman',
    },
    {
      id: 'prd-4',
      name: 'Gula Pasir Gulaku Premium 1kg',
      sku: 'SKU-GLA-004',
      category: 'Sembako',
      brand: 'Gulaku',
      unit: 'Pcs',
      qtySold: 520,
      hpp: 15500,
      sellPrice: 19000,
      totalRevenue: 9880000,
      totalProfit: 1820000,
      marginPercent: 18.4,
      currentStock: 25,
      stockStatus: 'Menipis',
    },
    {
      id: 'prd-5',
      name: 'Kopi Kapal Api Spesial Mix Renceng',
      sku: 'SKU-KPI-005',
      category: 'Minuman',
      brand: 'Kapal Api',
      unit: 'Renceng',
      qtySold: 310,
      hpp: 11000,
      sellPrice: 15000,
      totalRevenue: 4650000,
      totalProfit: 1240000,
      marginPercent: 26.7,
      currentStock: 120,
      stockStatus: 'Aman',
    },
    {
      id: 'prd-6',
      name: 'Biskuit Roma Kelapa 300g',
      sku: 'SKU-BSK-006',
      category: 'Snack / Camilan',
      brand: 'Mayora',
      unit: 'Pack',
      qtySold: 240,
      hpp: 10500,
      sellPrice: 14500,
      totalRevenue: 3480000,
      totalProfit: 960000,
      marginPercent: 27.6,
      currentStock: 35,
      stockStatus: 'Aman',
    },
    {
      id: 'prd-7',
      name: 'Teh Celup Sariwangi Asli Kotak 25s',
      sku: 'SKU-TEH-007',
      category: 'Minuman',
      brand: 'Unilever',
      unit: 'Kotak',
      qtySold: 215,
      hpp: 7500,
      sellPrice: 10000,
      totalRevenue: 2150000,
      totalProfit: 537500,
      marginPercent: 25.0,
      currentStock: 14,
      stockStatus: 'Menipis',
    },
    {
      id: 'prd-8',
      name: 'Kopiko Candy Bag 150g',
      sku: 'SKU-PRM-008',
      category: 'Snack / Camilan',
      brand: 'Mayora',
      unit: 'Bag',
      qtySold: 160,
      hpp: 8500,
      sellPrice: 11500,
      totalRevenue: 1840000,
      totalProfit: 480000,
      marginPercent: 26.1,
      currentStock: 8,
      stockStatus: 'Menipis',
    },
  ], []);

  // Summary Metrics Calculation (Monthly Total KDMP standard)
  const summaryMetrics = useMemo(() => {
    const grossSales = 107900000;
    const cogs = 72350000;
    const grossProfit = grossSales - cogs; // 35.550.000
    const operatingExpenses = 3150000;
    const netProfit = grossProfit - operatingExpenses; // 32.400.000
    const totalTransactions = 842;
    const totalItemsSold = 3420;

    return {
      grossSales,
      cogs,
      grossProfit,
      operatingExpenses,
      netProfit,
      grossMargin: ((grossProfit / grossSales) * 100).toFixed(1),
      netMargin: ((netProfit / grossSales) * 100).toFixed(1),
      totalTransactions,
      totalItemsSold,
    };
  }, []);

  // Filtered Sales Records
  const filteredSales = useMemo(() => {
    return salesData.filter((item) => {
      const matchSearch =
        item.invoice.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.cashierName.toLowerCase().includes(searchQuery.toLowerCase());

      const matchPayment = paymentFilter === 'all' || item.paymentMethod === paymentFilter;
      const matchCashier = cashierFilter === 'all' || item.cashierName.toLowerCase().includes(cashierFilter.toLowerCase());

      return matchSearch && matchPayment && matchCashier;
    });
  }, [salesData, searchQuery, paymentFilter, cashierFilter]);

  // Paginated Sales
  const totalSalesPages = Math.ceil(filteredSales.length / itemsPerPage) || 1;
  const currentSalesSlice = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredSales.slice(start, start + itemsPerPage);
  }, [filteredSales, currentPage, itemsPerPage]);

  // Filtered & Sorted Products
  const filteredProducts = useMemo(() => {
    const list = productsReportData.filter((p) => {
      const matchCat = productCategoryFilter === 'all' || p.category === productCategoryFilter;
      const matchSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.brand.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });

    return list.sort((a, b) => {
      if (productSortBy === 'qty') return b.qtySold - a.qtySold;
      if (productSortBy === 'revenue') return b.totalRevenue - a.totalRevenue;
      if (productSortBy === 'profit') return b.totalProfit - a.totalProfit;
      if (productSortBy === 'margin') return b.marginPercent - a.marginPercent;
      return 0;
    });
  }, [productsReportData, productCategoryFilter, searchQuery, productSortBy]);

  // Handlers
  const handlePeriodChange = (preset: 'today' | 'yesterday' | '7days' | 'month' | 'custom') => {
    setPeriodPreset(preset);
    const today = new Date().toISOString().split('T')[0];
    if (preset === 'today') {
      setStartDate(today);
      setEndDate(today);
    } else if (preset === 'yesterday') {
      const y = new Date();
      y.setDate(y.getDate() - 1);
      const yStr = y.toISOString().split('T')[0];
      setStartDate(yStr);
      setEndDate(yStr);
    } else if (preset === '7days') {
      const past = new Date();
      past.setDate(past.getDate() - 7);
      setStartDate(past.toISOString().split('T')[0]);
      setEndDate(today);
    } else if (preset === 'month') {
      setStartDate('2024-10-01');
      setEndDate('2024-10-31');
    }
  };

  // Export CSV Handler
  const handleExportCSV = () => {
    let csvContent = '';
    let filename = `laporan_kdmp_${activeTab}_${startDate}_${endDate}.csv`;

    if (activeTab === 'labarugi') {
      csvContent = 'Kategori,Rincian,Nominal (IDR)\r\n';
      csvContent += `PENDAPATAN USAHA,Penjualan Kotor (Gross Sales),107900000\r\n`;
      csvContent += `PENDAPATAN USAHA,Diskon & Promo,0\r\n`;
      csvContent += `PENDAPATAN USAHA,Penjualan Bersih (Net Sales),107900000\r\n`;
      csvContent += `BEBAN POKOK PENJUALAN,Total HPP Kulakan Supplier,72350000\r\n`;
      csvContent += `LABA KOTOR,Gross Profit,35550000\r\n`;
      csvContent += `BEBAN OPERASIONAL,Gaji Karyawan & Kasir,1800000\r\n`;
      csvContent += `BEBAN OPERASIONAL,Listrik PLN Pascabayar,1450000\r\n`;
      csvContent += `BEBAN OPERASIONAL,Konsumsi & Logistik,95000\r\n`;
      csvContent += `BEBAN OPERASIONAL,Perawatan & Maintenance,220000\r\n`;
      csvContent += `TOTAL BEBAN OPERASIONAL,Beban Usaha,3565000\r\n`;
      csvContent += `LABA BERSIH,Net Profit Operasional,31985000\r\n`;
    } else if (activeTab === 'penjualan') {
      csvContent = 'No Invoice,Tanggal,Customer,Tipe,Kasir,Metode,Total HPP,Diskon,Grand Total,Laba Kotor,Status\r\n';
      filteredSales.forEach((s) => {
        csvContent += `"${s.invoice}","${s.date} ${s.time}","${s.customerName}","${s.customerType}","${s.cashierName}","${s.paymentMethod}",${s.totalHpp},${s.discount},${s.grandTotal},${s.grossProfit},"${s.status}"\r\n`;
      });
    } else if (activeTab === 'pembelian') {
      csvContent = 'No PO,Tanggal,Supplier,Gudang,Subtotal,PPN,Ongkir,Grand Total,Status PO,Status Bayar\r\n';
      INITIAL_PURCHASE_ORDERS.forEach((po) => {
        csvContent += `"${po.poNumber}","${po.date}","${po.supplierName}","${po.warehouseName}",${po.subtotal},${po.taxAmount},${po.shippingFee},${po.grandTotal},"${po.status}","${po.paymentStatus}"\r\n`;
      });
    } else if (activeTab === 'produk') {
      csvContent = 'SKU,Nama Produk,Kategori,Brand,Qty Terjual,HPP Satuan,Harga Jual,Total Omset,Total Laba,Margin (%),Sisa Stok,Status Stok\r\n';
      filteredProducts.forEach((p) => {
        csvContent += `"${p.sku}","${p.name}","${p.category}","${p.brand}",${p.qtySold},${p.hpp},${p.sellPrice},${p.totalRevenue},${p.totalProfit},${p.marginPercent}%,${p.currentStock},"${p.stockStatus}"\r\n`;
      });
    } else {
      csvContent = 'Tanggal,No Transaksi,Akun Kas/Bank,Deskripsi,Arus,Nominal\r\n';
      csvContent += `"2024-10-24","INV-202410-001","Kas Kecil (Kasir)","Penjualan Kasir POS","Masuk",125000\r\n`;
      csvContent += `"2024-10-24","INV-202410-002","Bank BCA","Penjualan QRIS","Masuk",350000\r\n`;
      csvContent += `"2024-10-24","EXP-20241024-001","Bank BCA","Listrik PLN Pascabayar","Keluar",1450000\r\n`;
      csvContent += `"2024-10-24","EXP-20241024-002","Kas Kecil (Kasir)","Galon air & konsumsi","Keluar",95000\r\n`;
    }

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    if (onShowToast) {
      onShowToast('success', 'Export Berhasil', `File ${filename} berhasil diunduh.`);
    }
  };

  return (
    <div className="space-y-4">
      {/* 1. CARD UTAMA KDMP: HEADER & FILTER BAR */}
      <div className="bg-white rounded-xl border border-[#E0E0E0] p-4 sm:p-5 shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-[#D32F2F] shrink-0 border border-red-100">
              <PieChart className="w-5 h-5" />
            </div>
            <div>
              <h5 className="text-base font-bold text-gray-900 flex items-center gap-2">
                Laporan Keuangan & Analitik POS KDMP
              </h5>
              <p className="text-xs text-gray-500">
                Koperasi Desa Merdeka Perkasa • Periode: <span className="font-semibold text-gray-700">{startDate}</span> s/d <span className="font-semibold text-gray-700">{endDate}</span>
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => setIsPrintModalOpen(true)}
              className="px-3 py-1.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-bold rounded-lg shadow-xs flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-3.5 h-3.5 text-gray-600" />
              <span>Cetak / PDF</span>
            </button>

            <button
              type="button"
              onClick={handleExportCSV}
              className="px-3.5 py-1.5 bg-[#D32F2F] hover:bg-[#B71C1C] text-white text-xs font-bold rounded-lg shadow-xs flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Excel / CSV</span>
            </button>
          </div>
        </div>

        {/* Filter Toolbar (Preset, Range, Outlet) */}
        <div className="pt-3 border-t border-gray-100 grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          {/* Preset Buttons */}
          <div className="md:col-span-6 flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mr-1">
              Periode:
            </span>
            <button
              type="button"
              onClick={() => handlePeriodChange('today')}
              className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors ${
                periodPreset === 'today'
                  ? 'bg-red-50 text-[#D32F2F] border border-red-200 font-bold'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Hari Ini
            </button>
            <button
              type="button"
              onClick={() => handlePeriodChange('yesterday')}
              className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors ${
                periodPreset === 'yesterday'
                  ? 'bg-red-50 text-[#D32F2F] border border-red-200 font-bold'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Kemarin
            </button>
            <button
              type="button"
              onClick={() => handlePeriodChange('7days')}
              className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors ${
                periodPreset === '7days'
                  ? 'bg-red-50 text-[#D32F2F] border border-red-200 font-bold'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              7 Hari
            </button>
            <button
              type="button"
              onClick={() => handlePeriodChange('month')}
              className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors ${
                periodPreset === 'month'
                  ? 'bg-red-50 text-[#D32F2F] border border-red-200 font-bold'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Bulan Ini (Okt 2024)
            </button>
          </div>

          {/* Date Picker Range */}
          <div className="md:col-span-3 flex items-center gap-1.5 text-xs text-gray-600">
            <Calendar className="w-3.5 h-3.5 text-gray-400 shrink-0" />
            <input
              type="date"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                setPeriodPreset('custom');
              }}
              className="bg-gray-50 border border-gray-200 rounded px-2 py-1 text-xs text-gray-700 w-full focus:outline-none focus:ring-1 focus:ring-red-500"
            />
            <span className="text-gray-400">-</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => {
                setEndDate(e.target.value);
                setPeriodPreset('custom');
              }}
              className="bg-gray-50 border border-gray-200 rounded px-2 py-1 text-xs text-gray-700 w-full focus:outline-none focus:ring-1 focus:ring-red-500"
            />
          </div>

          {/* Outlet Selection */}
          <div className="md:col-span-3 flex items-center gap-2">
            <Building2 className="w-3.5 h-3.5 text-gray-400 shrink-0" />
            <select
              value={selectedOutlet}
              onChange={(e) => setSelectedOutlet(e.target.value)}
              className="bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1 text-xs text-gray-700 w-full focus:outline-none focus:ring-1 focus:ring-red-500 font-medium"
            >
              <option value="all">Semua Outlet & Gudang</option>
              <option value="outlet-1">Outlet Kasir Utama KDMP</option>
              <option value="wh-1">Gudang Pusat Jetakkidul</option>
            </select>
          </div>
        </div>
      </div>

      {/* 2. SUMMARY CARDS (4 BARIS METRIK KEUANGAN UTAMA) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3.5">
        {/* Card 1: Omset Penjualan Kotor */}
        <div className="p-3.5 rounded-xl shadow-xs border-l-4 border-blue-500 bg-[#e3f2fd] flex items-center justify-between">
          <div>
            <p className="text-[12px] text-gray-500 font-medium mb-0.5">Omset Penjualan Kotor</p>
            <h5 className="text-lg font-bold text-[#0d47a1] whitespace-nowrap">
              Rp {summaryMetrics.grossSales.toLocaleString('id-ID')}
            </h5>
            <span className="text-[10px] text-blue-700 font-medium">
              842 Transaksi • Rata-rata Rp 128rb/trx
            </span>
          </div>
          <div className="bg-white p-2.5 rounded-xl text-blue-600 shadow-xs">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>

        {/* Card 2: Beban Pokok Penjualan (HPP) */}
        <div className="p-3.5 rounded-xl shadow-xs border-l-4 border-amber-500 bg-[#fff3e0] flex items-center justify-between">
          <div>
            <p className="text-[12px] text-gray-500 font-medium mb-0.5">Harga Pokok (HPP)</p>
            <h5 className="text-lg font-bold text-[#e65100] whitespace-nowrap">
              Rp {summaryMetrics.cogs.toLocaleString('id-ID')}
            </h5>
            <span className="text-[10px] text-amber-700 font-medium">
              67.0% dari total omset kulakan
            </span>
          </div>
          <div className="bg-white p-2.5 rounded-xl text-amber-600 shadow-xs">
            <ShoppingBag className="w-5 h-5" />
          </div>
        </div>

        {/* Card 3: Laba Kotor (Gross Profit) */}
        <div className="p-3.5 rounded-xl shadow-xs border-l-4 border-emerald-500 bg-[#e8f5e9] flex items-center justify-between">
          <div>
            <p className="text-[12px] text-gray-500 font-medium mb-0.5">Laba Kotor (Gross)</p>
            <h5 className="text-lg font-bold text-[#1b5e20] whitespace-nowrap">
              Rp {summaryMetrics.grossProfit.toLocaleString('id-ID')}
            </h5>
            <span className="text-[10px] text-emerald-700 font-bold">
              Margin Kotor: {summaryMetrics.grossMargin}%
            </span>
          </div>
          <div className="bg-white p-2.5 rounded-xl text-emerald-600 shadow-xs">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>

        {/* Card 4: Laba Bersih Operasional */}
        <div className="p-3.5 rounded-xl shadow-xs border-l-4 border-purple-500 bg-[#ede7f6] flex items-center justify-between">
          <div>
            <p className="text-[12px] text-gray-500 font-medium mb-0.5">Laba Bersih Operasional</p>
            <h5 className="text-lg font-bold text-[#311b92] whitespace-nowrap">
              Rp {summaryMetrics.netProfit.toLocaleString('id-ID')}
            </h5>
            <span className="text-[10px] text-purple-700 font-medium">
              Margin Netto: {summaryMetrics.netMargin}% • Beban Rp 3.15Jt
            </span>
          </div>
          <div className="bg-white p-2.5 rounded-xl text-purple-600 shadow-xs">
            <FileText className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* 3. CARD UTAMA TAB & TABEL LAPORAN */}
      <div className="bg-white rounded-xl border border-[#E0E0E0] shadow-xs overflow-hidden">
        {/* TAB NAVIGATION (nav-tabs-kdmp) */}
        <div className="border-b border-[#E0E0E0] px-4 pt-3 flex gap-2 overflow-x-auto scrollbar-none bg-gray-50/50">
          <button
            type="button"
            onClick={() => {
              setActiveTab('labarugi');
              setCurrentPage(1);
            }}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors ${
              activeTab === 'labarugi'
                ? 'border-[#D32F2F] text-[#D32F2F] bg-white rounded-t-lg shadow-xs'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Laba Rugi (P&L)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('penjualan');
              setCurrentPage(1);
            }}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors ${
              activeTab === 'penjualan'
                ? 'border-[#D32F2F] text-[#D32F2F] bg-white rounded-t-lg shadow-xs'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Laporan Penjualan</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('pembelian');
              setCurrentPage(1);
            }}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors ${
              activeTab === 'pembelian'
                ? 'border-[#D32F2F] text-[#D32F2F] bg-white rounded-t-lg shadow-xs'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>Pembelian & Hutang</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('aruskas');
              setCurrentPage(1);
            }}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors ${
              activeTab === 'aruskas'
                ? 'border-[#D32F2F] text-[#D32F2F] bg-white rounded-t-lg shadow-xs'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Wallet className="w-3.5 h-3.5" />
            <span>Buku & Arus Kas</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('produk');
              setCurrentPage(1);
            }}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors ${
              activeTab === 'produk'
                ? 'border-[#D32F2F] text-[#D32F2F] bg-white rounded-t-lg shadow-xs'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Boxes className="w-3.5 h-3.5" />
            <span>Performa Produk & Margin</span>
          </button>
        </div>

        {/* TAB CONTENTS */}
        <div className="p-4 sm:p-6">
          {/* ======================================================== */}
          {/* TAB 1: LAPORAN LABA RUGI (INCOME STATEMENT / P&L)       */}
          {/* ======================================================== */}
          {activeTab === 'labarugi' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-200 pb-3">
                <div>
                  <h6 className="text-sm font-bold text-gray-900">
                    Laporan Laba Rugi Komprehensif
                  </h6>
                  <p className="text-[11px] text-gray-500">
                    Format Standar Akuntansi Koperasi KDMP Jetakkidul
                  </p>
                </div>
                <span className="text-xs px-2.5 py-1 bg-emerald-50 text-emerald-700 font-bold rounded-md border border-emerald-200">
                  Status: Sehat / Surplus Finansial
                </span>
              </div>

              {/* Rincian P&L Table */}
              <div className="border border-gray-200 rounded-xl overflow-hidden text-xs">
                <table className="w-full text-left">
                  <tbody>
                    {/* BAGIAN A: PENDAPATAN USAHA */}
                    <tr className="bg-gray-100 font-bold text-gray-800 border-b border-gray-200">
                      <td colSpan={2} className="py-2.5 px-4 uppercase text-[11px] tracking-wider text-gray-700">
                        A. Pendapatan Usaha Penjualan
                      </td>
                      <td className="py-2.5 px-4 text-right">Nominal (IDR)</td>
                    </tr>
                    <tr className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-2.5 px-4 pl-8 text-gray-700">Penjualan Kasir POS (Retail & Walk-in)</td>
                      <td className="py-2.5 px-4 text-gray-400 text-[11px]">842 Transaksi</td>
                      <td className="py-2.5 px-4 text-right font-medium text-gray-800">Rp 74.250.000</td>
                    </tr>
                    <tr className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-2.5 px-4 pl-8 text-gray-700">Penjualan Grosir & Pelanggan Warung</td>
                      <td className="py-2.5 px-4 text-gray-400 text-[11px]">Pasar & Warung Mitra</td>
                      <td className="py-2.5 px-4 text-right font-medium text-gray-800">Rp 33.650.000</td>
                    </tr>
                    <tr className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-2.5 px-4 pl-8 text-gray-700">Potongan Harga & Diskon Promosi (-)</td>
                      <td className="py-2.5 px-4 text-gray-400 text-[11px]">Voucher / Diskon Khusus</td>
                      <td className="py-2.5 px-4 text-right font-medium text-rose-600">- Rp 0</td>
                    </tr>
                    <tr className="bg-blue-50/50 font-bold border-b border-blue-100">
                      <td className="py-2.5 px-4 text-blue-900">Total Pendapatan Bersih (Net Revenue)</td>
                      <td></td>
                      <td className="py-2.5 px-4 text-right text-blue-900 font-extrabold text-sm">
                        Rp 107.900.000
                      </td>
                    </tr>

                    {/* BAGIAN B: HARGA POKOK PENJUALAN */}
                    <tr className="bg-gray-100 font-bold text-gray-800 border-b border-gray-200">
                      <td colSpan={2} className="py-2.5 px-4 uppercase text-[11px] tracking-wider text-gray-700">
                        B. Harga Pokok Penjualan (HPP / COGS)
                      </td>
                      <td className="py-2.5 px-4 text-right"></td>
                    </tr>
                    <tr className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-2.5 px-4 pl-8 text-gray-700">Persediaan Awal Barang Dagangan (01 Okt 2024)</td>
                      <td className="py-2.5 px-4 text-gray-400 text-[11px]">Saldo Gudang Pusat</td>
                      <td className="py-2.5 px-4 text-right font-medium text-gray-800">Rp 48.500.000</td>
                    </tr>
                    <tr className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-2.5 px-4 pl-8 text-gray-700">Pembelian Barang Dagang Bersih (PO Supplier)</td>
                      <td className="py-2.5 px-4 text-gray-400 text-[11px]">Indofood, Mayora, Berkah</td>
                      <td className="py-2.5 px-4 text-right font-medium text-gray-800">Rp 65.850.000</td>
                    </tr>
                    <tr className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-2.5 px-4 pl-8 text-gray-700">Ongkos Angkut & Ekspedisi Pembelian</td>
                      <td className="py-2.5 px-4 text-gray-400 text-[11px]">Pengiriman Truk Logistik</td>
                      <td className="py-2.5 px-4 text-right font-medium text-gray-800">Rp 450.000</td>
                    </tr>
                    <tr className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-2.5 px-4 pl-8 text-gray-700">Persediaan Akhir Barang Dagangan (-)</td>
                      <td className="py-2.5 px-4 text-gray-400 text-[11px]">Stock Opname 31 Okt</td>
                      <td className="py-2.5 px-4 text-right font-medium text-amber-700">- Rp 42.450.000</td>
                    </tr>
                    <tr className="bg-amber-50/50 font-bold border-b border-amber-100">
                      <td className="py-2.5 px-4 text-amber-900">Total Harga Pokok Penjualan (HPP)</td>
                      <td></td>
                      <td className="py-2.5 px-4 text-right text-amber-900 font-extrabold text-sm">
                        Rp 72.350.000
                      </td>
                    </tr>

                    {/* LABA KOTOR */}
                    <tr className="bg-emerald-50 font-extrabold text-emerald-900 border-b-2 border-emerald-300">
                      <td className="py-3 px-4 text-sm">LABA KOTOR USAHA (GROSS PROFIT)</td>
                      <td className="py-3 px-4 text-xs font-semibold text-emerald-700">
                        Margin Kotor: {summaryMetrics.grossMargin}%
                      </td>
                      <td className="py-3 px-4 text-right text-base text-emerald-900">
                        Rp 35.550.000
                      </td>
                    </tr>

                    {/* BAGIAN C: BEBAN OPERASIONAL */}
                    <tr className="bg-gray-100 font-bold text-gray-800 border-b border-gray-200">
                      <td colSpan={2} className="py-2.5 px-4 uppercase text-[11px] tracking-wider text-gray-700">
                        C. Beban Operasional & Administrasi
                      </td>
                      <td className="py-2.5 px-4 text-right"></td>
                    </tr>
                    <tr className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-2.5 px-4 pl-8 text-gray-700">Beban Gaji Karyawan Toko & Kasir</td>
                      <td className="py-2.5 px-4 text-gray-400 text-[11px]">2 Kasir & 1 Helper</td>
                      <td className="py-2.5 px-4 text-right font-medium text-gray-800">Rp 1.800.000</td>
                    </tr>
                    <tr className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-2.5 px-4 pl-8 text-gray-700">Beban Listrik PLN Pascabayar Toko</td>
                      <td className="py-2.5 px-4 text-gray-400 text-[11px]">EXP-20241024-001</td>
                      <td className="py-2.5 px-4 text-right font-medium text-gray-800">Rp 1.450.000</td>
                    </tr>
                    <tr className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-2.5 px-4 pl-8 text-gray-700">Beban Konsumsi & Logistik Kasir</td>
                      <td className="py-2.5 px-4 text-gray-400 text-[11px]">EXP-20241024-002</td>
                      <td className="py-2.5 px-4 text-right font-medium text-gray-800">Rp 95.000</td>
                    </tr>
                    <tr className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-2.5 px-4 pl-8 text-gray-700">Beban Perawatan & Thermal Paper Kasir</td>
                      <td className="py-2.5 px-4 text-gray-400 text-[11px]">EXP-20241023-001</td>
                      <td className="py-2.5 px-4 text-right font-medium text-gray-800">Rp 220.000</td>
                    </tr>
                    <tr className="bg-purple-50/50 font-bold border-b border-purple-100">
                      <td className="py-2.5 px-4 text-purple-900">Total Beban Operasional</td>
                      <td></td>
                      <td className="py-2.5 px-4 text-right text-purple-900 font-extrabold text-sm">
                        Rp 3.565.000
                      </td>
                    </tr>

                    {/* LABA BERSIH (NET PROFIT) */}
                    <tr className="bg-[#D32F2F] text-white font-black text-sm">
                      <td className="py-3 px-4">LABA BERSIH AKHIR (NET PROFIT SETELAH BEBAN)</td>
                      <td className="py-3 px-4 text-xs font-normal text-red-100">
                        Surplus Hasil Usaha Koperasi KDMP
                      </td>
                      <td className="py-3 px-4 text-right text-lg font-black tracking-wide">
                        Rp 31.985.000
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 2: LAPORAN PENJUALAN TRANSAKSI                      */}
          {/* ======================================================== */}
          {activeTab === 'penjualan' && (
            <div className="space-y-4">
              {/* Filter Controls Bar */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="relative flex-1 max-w-sm">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCurrentPage(1);
                    }}
                    placeholder="Cari no. faktur / pelanggan / kasir..."
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-3 py-1.5 text-xs text-gray-700 focus:outline-none focus:ring-1 focus:ring-red-500"
                  />
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <select
                    value={paymentFilter}
                    onChange={(e) => {
                      setPaymentFilter(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs text-gray-700 focus:outline-none focus:ring-1 focus:ring-red-500 font-medium"
                  >
                    <option value="all">Semua Metode Pembayaran</option>
                    <option value="Tunai">Tunai</option>
                    <option value="QRIS BCA">QRIS BCA</option>
                    <option value="Transfer Mandiri">Transfer Mandiri</option>
                    <option value="Debit BCA">Debit BCA</option>
                  </select>

                  <select
                    value={cashierFilter}
                    onChange={(e) => {
                      setCashierFilter(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs text-gray-700 focus:outline-none focus:ring-1 focus:ring-red-500 font-medium"
                  >
                    <option value="all">Semua Petugas Kasir</option>
                    <option value="Rina">Kasir Rina (Shift 2)</option>
                    <option value="Andi">Kasir Andi (Shift 1)</option>
                  </select>
                </div>
              </div>

              {/* Sales Table */}
              <div className="border border-gray-200 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 font-bold uppercase text-[10.5px] tracking-wider">
                        <th className="py-3 px-3.5">Faktur / Waktu</th>
                        <th className="py-3 px-3.5">Pelanggan</th>
                        <th className="py-3 px-3.5">Kasir</th>
                        <th className="py-3 px-3.5">Metode Bayar</th>
                        <th className="py-3 px-3.5 text-right">HPP</th>
                        <th className="py-3 px-3.5 text-right">Total Transaksi</th>
                        <th className="py-3 px-3.5 text-right">Laba Kotor</th>
                        <th className="py-3 px-3.5 text-center">Status</th>
                        <th className="py-3 px-3.5 text-center">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 font-medium">
                      {currentSalesSlice.length === 0 ? (
                        <tr>
                          <td colSpan={9} className="py-8 text-center text-gray-400">
                            Tidak ada transaksi penjualan yang cocok dengan filter.
                          </td>
                        </tr>
                      ) : (
                        currentSalesSlice.map((sale) => (
                          <tr key={sale.id} className="hover:bg-gray-50/80 transition-colors">
                            <td className="py-3 px-3.5">
                              <span className="font-bold text-gray-900 block font-mono">
                                {sale.invoice}
                              </span>
                              <span className="text-[11px] text-gray-400">
                                {sale.date} {sale.time}
                              </span>
                            </td>
                            <td className="py-3 px-3.5">
                              <span className="text-gray-900 font-semibold block">
                                {sale.customerName}
                              </span>
                              <span
                                className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                                  sale.customerType === 'Grosir'
                                    ? 'bg-amber-100 text-amber-800'
                                    : sale.customerType === 'Member'
                                    ? 'bg-blue-100 text-blue-800'
                                    : 'bg-gray-100 text-gray-600'
                                }`}
                              >
                                {sale.customerType}
                              </span>
                            </td>
                            <td className="py-3 px-3.5 text-gray-600">
                              {sale.cashierName}
                            </td>
                            <td className="py-3 px-3.5">
                              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-gray-700 bg-gray-100 px-2 py-0.5 rounded">
                                {sale.paymentMethod}
                              </span>
                            </td>
                            <td className="py-3 px-3.5 text-right font-mono text-gray-500">
                              Rp {sale.totalHpp.toLocaleString('id-ID')}
                            </td>
                            <td className="py-3 px-3.5 text-right font-bold text-gray-900 font-mono">
                              Rp {sale.grandTotal.toLocaleString('id-ID')}
                            </td>
                            <td className="py-3 px-3.5 text-right font-bold text-emerald-600 font-mono">
                              +Rp {sale.grossProfit.toLocaleString('id-ID')}
                            </td>
                            <td className="py-3 px-3.5 text-center">
                              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                                {sale.status}
                              </span>
                            </td>
                            <td className="py-3 px-3.5 text-center">
                              <button
                                type="button"
                                onClick={() => setSelectedInvoice(sale)}
                                className="p-1.5 rounded-lg text-gray-600 hover:text-[#D32F2F] hover:bg-red-50 transition-colors"
                                title="Lihat Rincian Struk"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Table Footer & Pagination */}
                <div className="p-3 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
                  <span>
                    Menampilkan {filteredSales.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} -{' '}
                    {Math.min(currentPage * itemsPerPage, filteredSales.length)} dari {filteredSales.length} transaksi
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      className="p-1 rounded border border-gray-200 bg-white hover:bg-gray-100 disabled:opacity-40 disabled:hover:bg-white text-gray-700"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="px-2 text-xs font-bold text-gray-700">
                      {currentPage} / {totalSalesPages}
                    </span>
                    <button
                      type="button"
                      disabled={currentPage >= totalSalesPages}
                      onClick={() => setCurrentPage((p) => Math.min(totalSalesPages, p + 1))}
                      className="p-1 rounded border border-gray-200 bg-white hover:bg-gray-100 disabled:opacity-40 disabled:hover:bg-white text-gray-700"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 3: LAPORAN PEMBELIAN & HUTANG                        */}
          {/* ======================================================== */}
          {activeTab === 'pembelian' && (
            <div className="space-y-5">
              {/* Summary Hutang & PO cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl">
                  <span className="text-[11px] text-blue-700 font-bold block">Total Pengadaan (PO)</span>
                  <h5 className="text-base font-bold text-blue-900 mt-0.5">Rp 16.705.700</h5>
                  <span className="text-[10px] text-gray-500">4 Pesanan PO Terverifikasi</span>
                </div>
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                  <span className="text-[11px] text-emerald-700 font-bold block">PO Telah Lunas Dibayar</span>
                  <h5 className="text-base font-bold text-emerald-900 mt-0.5">Rp 6.800.000</h5>
                  <span className="text-[10px] text-emerald-600 font-medium">Beras Rojolele UD Sumber Makmur</span>
                </div>
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl">
                  <span className="text-[11px] text-rose-700 font-bold block">Sisa Hutang Dagang (Payables)</span>
                  <h5 className="text-base font-bold text-rose-900 mt-0.5">Rp 9.905.700</h5>
                  <span className="text-[10px] text-rose-600 font-medium">Jatuh tempo dlm 14 hari ke depan</span>
                </div>
              </div>

              {/* Purchase Orders Table */}
              <div className="border border-gray-200 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 font-bold uppercase text-[10.5px] tracking-wider">
                        <th className="py-3 px-3.5">No. PO & Tanggal</th>
                        <th className="py-3 px-3.5">Supplier Distributor</th>
                        <th className="py-3 px-3.5">Gudang Penerima</th>
                        <th className="py-3 px-3.5 text-right">Subtotal</th>
                        <th className="py-3 px-3.5 text-right">PPN + Ongkir</th>
                        <th className="py-3 px-3.5 text-right">Grand Total</th>
                        <th className="py-3 px-3.5 text-center">Status PO</th>
                        <th className="py-3 px-3.5 text-center">Status Bayar</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 font-medium">
                      {INITIAL_PURCHASE_ORDERS.map((po) => (
                        <tr key={po.id} className="hover:bg-gray-50/80 transition-colors">
                          <td className="py-3 px-3.5">
                            <span className="font-bold text-gray-900 font-mono block">{po.poNumber}</span>
                            <span className="text-[11px] text-gray-400">{po.date}</span>
                          </td>
                          <td className="py-3 px-3.5 font-semibold text-gray-800">
                            {po.supplierName}
                          </td>
                          <td className="py-3 px-3.5 text-gray-600">
                            {po.warehouseName}
                          </td>
                          <td className="py-3 px-3.5 text-right font-mono text-gray-600">
                            Rp {po.subtotal.toLocaleString('id-ID')}
                          </td>
                          <td className="py-3 px-3.5 text-right font-mono text-gray-400 text-[11px]">
                            Rp {(po.taxAmount + po.shippingFee).toLocaleString('id-ID')}
                          </td>
                          <td className="py-3 px-3.5 text-right font-bold text-gray-900 font-mono">
                            Rp {po.grandTotal.toLocaleString('id-ID')}
                          </td>
                          <td className="py-3 px-3.5 text-center">
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                                po.status === 'Selesai'
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : 'bg-blue-50 text-blue-700 border border-blue-200'
                              }`}
                            >
                              {po.status}
                            </span>
                          </td>
                          <td className="py-3 px-3.5 text-center">
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                                po.paymentStatus === 'Lunas'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : po.paymentStatus === 'Disetujui'
                                  ? 'bg-indigo-100 text-indigo-800'
                                  : po.paymentStatus === 'Diajukan'
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-rose-100 text-rose-800'
                              }`}
                            >
                              {po.paymentStatus}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 4: BUKU KAS & ARUS KAS (CASH FLOW)                   */}
          {/* ======================================================== */}
          {activeTab === 'aruskas' && (
            <div className="space-y-5">
              {/* Account Balances Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {INITIAL_ACCOUNTS.map((acc) => (
                  <div key={acc.id} className="p-3.5 bg-gray-50 border border-gray-200 rounded-xl flex items-center justify-between">
                    <div>
                      <p className="text-[11px] text-gray-500 font-medium">{acc.account_name}</p>
                      <h5 className="text-base font-bold text-gray-900 font-mono mt-0.5">
                        Rp {acc.balance.toLocaleString('id-ID')}
                      </h5>
                      <span className="text-[10px] text-gray-400 font-mono">{acc.account_number}</span>
                    </div>
                    <div className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-600 shadow-xs">
                      <Wallet className="w-4 h-4 text-emerald-600" />
                    </div>
                  </div>
                ))}
              </div>

              {/* Cash Flow Ledger Table */}
              <div className="border border-gray-200 rounded-xl overflow-hidden">
                <div className="p-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
                  <h6 className="text-xs font-bold text-gray-800">Riwayat Mutasi Arus Kas Masuk & Keluar</h6>
                  <span className="text-[11px] text-gray-400">Diperbarui real-time dari POS & Kasir</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-white border-b border-gray-200 text-gray-500 font-bold uppercase text-[10px] tracking-wider">
                        <th className="py-2.5 px-3.5">Waktu Transaksi</th>
                        <th className="py-2.5 px-3.5">No. Referensi</th>
                        <th className="py-2.5 px-3.5">Akun Kas / Bank</th>
                        <th className="py-2.5 px-3.5">Kategori / Deskripsi</th>
                        <th className="py-2.5 px-3.5 text-center">Arus</th>
                        <th className="py-2.5 px-3.5 text-right">Nominal Masuk</th>
                        <th className="py-2.5 px-3.5 text-right">Nominal Keluar</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 font-medium">
                      <tr className="hover:bg-gray-50">
                        <td className="py-2.5 px-3.5 text-gray-500">2024-10-24 14:32</td>
                        <td className="py-2.5 px-3.5 font-mono font-bold text-gray-900">INV-202410-001</td>
                        <td className="py-2.5 px-3.5 text-gray-700">Kas Kecil (Kasir)</td>
                        <td className="py-2.5 px-3.5 text-gray-600">Penjualan Retail Kasir POS</td>
                        <td className="py-2.5 px-3.5 text-center">
                          <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                            <ArrowDownLeft className="w-3 h-3 text-emerald-600" /> Masuk
                          </span>
                        </td>
                        <td className="py-2.5 px-3.5 text-right font-mono font-bold text-emerald-600">
                          +Rp 125.000
                        </td>
                        <td className="py-2.5 px-3.5 text-right font-mono text-gray-400">-</td>
                      </tr>

                      <tr className="hover:bg-gray-50">
                        <td className="py-2.5 px-3.5 text-gray-500">2024-10-24 13:10</td>
                        <td className="py-2.5 px-3.5 font-mono font-bold text-gray-900">INV-202410-002</td>
                        <td className="py-2.5 px-3.5 text-gray-700">Bank BCA</td>
                        <td className="py-2.5 px-3.5 text-gray-600">Penjualan QRIS Dinamis</td>
                        <td className="py-2.5 px-3.5 text-center">
                          <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                            <ArrowDownLeft className="w-3 h-3 text-emerald-600" /> Masuk
                          </span>
                        </td>
                        <td className="py-2.5 px-3.5 text-right font-mono font-bold text-emerald-600">
                          +Rp 350.000
                        </td>
                        <td className="py-2.5 px-3.5 text-right font-mono text-gray-400">-</td>
                      </tr>

                      {INITIAL_EXPENSES.map((exp) => (
                        <tr key={exp.id} className="hover:bg-gray-50">
                          <td className="py-2.5 px-3.5 text-gray-500">{exp.date} 10:00</td>
                          <td className="py-2.5 px-3.5 font-mono font-bold text-gray-900">{exp.expense_number}</td>
                          <td className="py-2.5 px-3.5 text-gray-700">{exp.account_name}</td>
                          <td className="py-2.5 px-3.5 text-gray-600">{exp.description}</td>
                          <td className="py-2.5 px-3.5 text-center">
                            <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded">
                              <ArrowUpRight className="w-3 h-3 text-rose-600" /> Keluar
                            </span>
                          </td>
                          <td className="py-2.5 px-3.5 text-right font-mono text-gray-400">-</td>
                          <td className="py-2.5 px-3.5 text-right font-mono font-bold text-rose-600">
                            -Rp {exp.amount.toLocaleString('id-ID')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 5: PERFORMA PRODUK & ANALISIS MARGIN                 */}
          {/* ======================================================== */}
          {activeTab === 'produk' && (
            <div className="space-y-4">
              {/* Product Toolbar */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="relative flex-1 max-w-sm">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari nama produk / SKU / merk..."
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-3 py-1.5 text-xs text-gray-700 focus:outline-none focus:ring-1 focus:ring-red-500"
                  />
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <select
                    value={productCategoryFilter}
                    onChange={(e) => setProductCategoryFilter(e.target.value)}
                    className="bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs text-gray-700 focus:outline-none focus:ring-1 focus:ring-red-500 font-medium"
                  >
                    <option value="all">Semua Kategori</option>
                    <option value="Sembako">Sembako</option>
                    <option value="Makanan">Makanan</option>
                    <option value="Minuman">Minuman</option>
                    <option value="Snack / Camilan">Snack / Camilan</option>
                  </select>

                  <select
                    value={productSortBy}
                    onChange={(e) => setProductSortBy(e.target.value as any)}
                    className="bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs text-gray-700 focus:outline-none focus:ring-1 focus:ring-red-500 font-medium"
                  >
                    <option value="revenue">Urutkan: Omset Tertinggi (Rp)</option>
                    <option value="profit">Urutkan: Laba Tertinggi (Rp)</option>
                    <option value="qty">Urutkan: Kuantitas Terbanyak (Qty)</option>
                    <option value="margin">Urutkan: Margin Tertinggi (%)</option>
                  </select>
                </div>
              </div>

              {/* Product Analytical Table */}
              <div className="border border-gray-200 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 font-bold uppercase text-[10px] tracking-wider">
                        <th className="py-3 px-3.5">Nama Produk & SKU</th>
                        <th className="py-3 px-3.5">Kategori / Brand</th>
                        <th className="py-3 px-3.5 text-center">Terjual</th>
                        <th className="py-3 px-3.5 text-right">HPP Satuan</th>
                        <th className="py-3 px-3.5 text-right">Harga Jual</th>
                        <th className="py-3 px-3.5 text-right">Total Omset</th>
                        <th className="py-3 px-3.5 text-right">Total Laba</th>
                        <th className="py-3 px-3.5 text-center">Margin</th>
                        <th className="py-3 px-3.5 text-center">Stok</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 font-medium">
                      {filteredProducts.map((p, idx) => (
                        <tr key={p.id} className="hover:bg-gray-50/80 transition-colors">
                          <td className="py-3 px-3.5">
                            <div className="flex items-center gap-2">
                              <span className="w-5 h-5 rounded-full bg-gray-100 text-gray-600 text-[10px] font-bold flex items-center justify-center shrink-0">
                                {idx + 1}
                              </span>
                              <div>
                                <span className="font-bold text-gray-900 block">{p.name}</span>
                                <span className="text-[10px] text-gray-400 font-mono">{p.sku}</span>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-3.5">
                            <span className="text-gray-800 font-semibold block">{p.category}</span>
                            <span className="text-[10px] text-gray-400">{p.brand}</span>
                          </td>
                          <td className="py-3 px-3.5 text-center font-bold text-blue-700">
                            {p.qtySold} {p.unit}
                          </td>
                          <td className="py-3 px-3.5 text-right font-mono text-gray-500">
                            Rp {p.hpp.toLocaleString('id-ID')}
                          </td>
                          <td className="py-3 px-3.5 text-right font-mono text-gray-900">
                            Rp {p.sellPrice.toLocaleString('id-ID')}
                          </td>
                          <td className="py-3 px-3.5 text-right font-mono font-bold text-gray-900">
                            Rp {p.totalRevenue.toLocaleString('id-ID')}
                          </td>
                          <td className="py-3 px-3.5 text-right font-mono font-bold text-emerald-600">
                            +Rp {p.totalProfit.toLocaleString('id-ID')}
                          </td>
                          <td className="py-3 px-3.5 text-center">
                            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                              {p.marginPercent}%
                            </span>
                          </td>
                          <td className="py-3 px-3.5 text-center">
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                                p.stockStatus === 'Aman'
                                  ? 'bg-gray-100 text-gray-700'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {p.currentStock} {p.unit}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ======================================================== */}
      {/* MODAL 1: RINCIAN FAKTUR / DETAIL STRUK TRANSAKSI         */}
      {/* ======================================================== */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#D32F2F]" />
                <h5 className="text-sm font-bold text-gray-900">
                  Rincian Transaksi {selectedInvoice.invoice}
                </h5>
              </div>
              <button
                type="button"
                onClick={() => setSelectedInvoice(null)}
                className="p-1 rounded text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-4 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2 p-2.5 bg-gray-50 rounded-lg">
                <div>
                  <span className="text-gray-400 block text-[10px]">Waktu Transaksi</span>
                  <span className="font-semibold text-gray-800">{selectedInvoice.date} {selectedInvoice.time}</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px]">Kasir Petugas</span>
                  <span className="font-semibold text-gray-800">{selectedInvoice.cashierName}</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px]">Pelanggan</span>
                  <span className="font-semibold text-gray-800">{selectedInvoice.customerName} ({selectedInvoice.customerType})</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px]">Metode Bayar</span>
                  <span className="font-semibold text-emerald-700">{selectedInvoice.paymentMethod}</span>
                </div>
              </div>

              {/* Items List */}
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="p-2 bg-gray-100 font-bold text-gray-700 text-[11px]">
                  Item Barang yang Dibeli
                </div>
                <div className="divide-y divide-gray-100 max-h-44 overflow-y-auto">
                  {selectedInvoice.itemsDetail.map((item, idx) => (
                    <div key={idx} className="p-2.5 flex items-center justify-between">
                      <div>
                        <p className="font-bold text-gray-900">{item.name}</p>
                        <p className="text-[10px] text-gray-400">
                          {item.qty} x Rp {item.unitPrice.toLocaleString('id-ID')} • HPP: Rp {item.hpp.toLocaleString('id-ID')}
                        </p>
                      </div>
                      <span className="font-bold text-gray-800 font-mono">
                        Rp {item.subtotal.toLocaleString('id-ID')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Totals & Margin */}
              <div className="space-y-1.5 pt-2 border-t border-gray-100 text-xs">
                <div className="flex justify-between text-gray-500">
                  <span>Subtotal Belanja:</span>
                  <span className="font-mono">Rp {selectedInvoice.subtotal.toLocaleString('id-ID')}</span>
                </div>
                {selectedInvoice.discount > 0 && (
                  <div className="flex justify-between text-rose-600">
                    <span>Diskon / Potongan:</span>
                    <span className="font-mono">-Rp {selectedInvoice.discount.toLocaleString('id-ID')}</span>
                  </div>
                )}
                <div className="flex justify-between font-extrabold text-sm text-gray-900 pt-1 border-t border-gray-100">
                  <span>Grand Total Bayar:</span>
                  <span className="text-[#D32F2F] font-mono">
                    Rp {selectedInvoice.grandTotal.toLocaleString('id-ID')}
                  </span>
                </div>
                <div className="flex justify-between text-[11px] text-emerald-700 bg-emerald-50 p-2 rounded-lg mt-2 font-bold">
                  <span>Estimasi Laba Transaksi Ini:</span>
                  <span className="font-mono">+Rp {selectedInvoice.grossProfit.toLocaleString('id-ID')}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedInvoice(null)}
                className="px-4 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-lg text-xs"
              >
                Tutup Rincian
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 2: CETAK LAPORAN (PRINT PREVIEW RESMI KDMP)         */}
      {/* ======================================================== */}
      {isPrintModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-gray-200 animate-in fade-in zoom-in-95 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <Printer className="w-5 h-5 text-[#D32F2F]" />
                <h5 className="text-sm font-bold text-gray-900">
                  Pratinjau Cetak Laporan Resmi Koperasi KDMP
                </h5>
              </div>
              <button
                type="button"
                onClick={() => setIsPrintModalOpen(false)}
                className="p-1 rounded text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Printable Paper Canvas */}
            <div className="my-4 p-6 border border-gray-300 rounded-xl bg-white text-gray-800 text-xs space-y-4 shadow-xs font-sans">
              {/* Kop Koperasi KDMP */}
              <div className="text-center border-b-2 border-gray-800 pb-3">
                <h3 className="text-base font-extrabold tracking-wider uppercase text-gray-900">
                  KOPERASI DESA MERDEKA PERKASA (KDMP)
                </h3>
                <p className="text-[11px] text-gray-600">
                  Badan Hukum No: AHU-0012981.AH.01.26.TAHUN 2023 • Pekalongan, Jawa Tengah
                </p>
                <p className="text-[10px] text-gray-500">
                  Unit Usaha Toko Swalayan, Distributor & Kasir POS Jetakkidul
                </p>
              </div>

              {/* Document Header */}
              <div className="text-center">
                <h4 className="text-sm font-bold uppercase underline tracking-wide">
                  REKAPITULASI LAPORAN {activeTab.toUpperCase()}
                </h4>
                <p className="text-[11px] text-gray-600 mt-0.5">
                  Periode Transaksi: {startDate} s/d {endDate}
                </p>
              </div>

              {/* High-level Summary Box */}
              <div className="grid grid-cols-3 gap-2 p-3 bg-gray-50 border border-gray-200 rounded-lg text-center">
                <div>
                  <span className="text-[10px] text-gray-500 block">Total Omset Penjualan</span>
                  <span className="font-bold text-xs text-blue-900">
                    Rp {summaryMetrics.grossSales.toLocaleString('id-ID')}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-500 block">Total Beban Pokok (HPP)</span>
                  <span className="font-bold text-xs text-amber-900">
                    Rp {summaryMetrics.cogs.toLocaleString('id-ID')}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-500 block">Laba Bersih Operasional</span>
                  <span className="font-bold text-xs text-emerald-800">
                    Rp {summaryMetrics.netProfit.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>

              {/* Brief Table Excerpt */}
              <table className="w-full text-left border-collapse text-[11px]">
                <thead>
                  <tr className="border-b border-gray-300 font-bold bg-gray-100">
                    <th className="py-1.5 px-2">Komponen Finansial</th>
                    <th className="py-1.5 px-2 text-right">Rincian Nilai (IDR)</th>
                    <th className="py-1.5 px-2 text-center">Rasio</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="py-1.5 px-2">Penjualan Kotor (Gross Sales)</td>
                    <td className="py-1.5 px-2 text-right font-mono font-semibold">Rp 107.900.000</td>
                    <td className="py-1.5 px-2 text-center">100.0%</td>
                  </tr>
                  <tr>
                    <td className="py-1.5 px-2">Harga Pokok Penjualan (HPP)</td>
                    <td className="py-1.5 px-2 text-right font-mono">Rp 72.350.000</td>
                    <td className="py-1.5 px-2 text-center">67.0%</td>
                  </tr>
                  <tr className="font-bold bg-gray-50">
                    <td className="py-1.5 px-2">Laba Kotor Usaha</td>
                    <td className="py-1.5 px-2 text-right font-mono text-emerald-800">Rp 35.550.000</td>
                    <td className="py-1.5 px-2 text-center text-emerald-700">33.0%</td>
                  </tr>
                  <tr>
                    <td className="py-1.5 px-2">Total Beban Operasional</td>
                    <td className="py-1.5 px-2 text-right font-mono text-rose-700">Rp 3.565.000</td>
                    <td className="py-1.5 px-2 text-center">3.3%</td>
                  </tr>
                  <tr className="font-black bg-gray-100 text-gray-900 border-t-2 border-gray-800">
                    <td className="py-2 px-2">LABA BERSIH AKHIR (SHU KOPERASI)</td>
                    <td className="py-2 px-2 text-right font-mono text-xs">Rp 31.985.000</td>
                    <td className="py-2 px-2 text-center">29.6%</td>
                  </tr>
                </tbody>
              </table>

              {/* Signatures */}
              <div className="pt-6 grid grid-cols-3 text-center text-[10.5px] text-gray-700">
                <div>
                  <p className="font-medium">Dibuat Oleh,</p>
                  <div className="h-12 flex items-center justify-center text-gray-300 italic text-[9px]">
                    [Tanda Tangan Digital]
                  </div>
                  <p className="font-bold text-gray-900">Rina Fitriyani</p>
                  <p className="text-[10px] text-gray-500">Kasir / Admin Toko</p>
                </div>

                <div>
                  <p className="font-medium">Diperiksa Oleh,</p>
                  <div className="h-12 flex items-center justify-center text-gray-300 italic text-[9px]">
                    [Tanda Tangan Digital]
                  </div>
                  <p className="font-bold text-gray-900">Siti Rahmawati, S.E.</p>
                  <p className="text-[10px] text-gray-500">Bendahara KDMP</p>
                </div>

                <div>
                  <p className="font-medium">Disetujui Oleh,</p>
                  <div className="h-12 flex items-center justify-center text-gray-300 italic text-[9px]">
                    [Tanda Tangan Digital]
                  </div>
                  <p className="font-bold text-gray-900">Drs. H. Mulyono</p>
                  <p className="text-[10px] text-gray-500">Ketua Pengurus KDMP</p>
                </div>
              </div>
            </div>

            {/* Print Modal Footer */}
            <div className="pt-3 border-t border-gray-200 flex items-center justify-between">
              <span className="text-xs text-gray-400">
                Tip: Tekan Cetak Dokumen untuk membuka dialog printer browser.
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsPrintModalOpen(false)}
                  className="px-3.5 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-lg text-xs"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-4 py-1.5 bg-[#D32F2F] hover:bg-[#B71C1C] text-white font-bold rounded-lg text-xs flex items-center gap-1.5 shadow-xs"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Cetak Dokumen</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
