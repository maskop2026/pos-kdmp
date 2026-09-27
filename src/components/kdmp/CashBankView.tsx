import React, { useState, useMemo } from 'react';
import {
  Banknote,
  ArrowUpFromLine,
  ArrowDownToLine,
  ArrowRightLeft,
  PlusCircle,
  MinusCircle,
  TrendingUp,
  TrendingDown,
  Wallet,
  Building2,
  Calendar,
  X,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Info,
} from 'lucide-react';
import { CashAccount, ExpenseCategory, ExpenseItem, SalesCashItem, CashTransferItem } from '../../types/kdmp';
import {
  INITIAL_ACCOUNTS,
  INITIAL_EXPENSE_CATEGORIES,
  INITIAL_EXPENSES,
  INITIAL_SALES_CASH,
} from '../../data/kdmpData';

interface CashBankViewProps {
  onShowToast: (type: 'success' | 'info' | 'warning', title: string, message: string) => void;
}

export const CashBankView: React.FC<CashBankViewProps> = ({ onShowToast }) => {
  // Accounts, Categories, Expenses, Sales State
  const [accounts, setAccounts] = useState<CashAccount[]>(INITIAL_ACCOUNTS);
  const [categories] = useState<ExpenseCategory[]>(INITIAL_EXPENSE_CATEGORIES);
  const [expenses, setExpenses] = useState<ExpenseItem[]>(INITIAL_EXPENSES);
  const [sales] = useState<SalesCashItem[]>(INITIAL_SALES_CASH);
  const [, setTransfers] = useState<CashTransferItem[]>([]);

  // Active Tab: 'keluar' (Pengeluaran) | 'masuk' (Penjualan)
  const [activeTab, setActiveTab] = useState<'keluar' | 'masuk'>('keluar');

  // Pagination for Pengeluaran
  const [expensePage, setExpensePage] = useState<number>(1);
  const [expenseLimit] = useState<number>(10);

  // Pagination for Penjualan
  const [salesPage, setSalesPage] = useState<number>(1);
  const [salesLimit] = useState<number>(10);

  // Modals State
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [isAddBalanceModalOpen, setIsAddBalanceModalOpen] = useState(false);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);

  // Form Expense
  const [expDate, setExpDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [expAccountId, setExpAccountId] = useState<string>(accounts[0]?.id || '1');
  const [expCategoryId, setExpCategoryId] = useState<string>(categories[0]?.id || '1');
  const [expAmount, setExpAmount] = useState<number>(0);
  const [expDesc, setExpDesc] = useState<string>('');

  // Form Add Balance (Modal Awal)
  const [balDate, setBalDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [balAccountId, setBalAccountId] = useState<string>(accounts[0]?.id || '1');
  const [balAmount, setBalAmount] = useState<number>(0);
  const [balDesc, setBalDesc] = useState<string>('');

  // Form Transfer
  const [transDate, setTransDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [fromAccountId, setFromAccountId] = useState<string>(accounts[0]?.id || '1');
  const [toAccountId, setToAccountId] = useState<string>(accounts[1]?.id || '2');
  const [transAmount, setTransAmount] = useState<number>(0);
  const [transDesc, setTransDesc] = useState<string>('');

  // Summary Metrics: Kas Masuk, Kas Keluar, Total Saldo Kas/Bank
  const totalBalance = useMemo(() => {
    return accounts.reduce((acc, curr) => acc + (curr.status === 'Aktif' ? curr.balance : 0), 0);
  }, [accounts]);

  const totalExpenseToday = useMemo(() => {
    return expenses.reduce((acc, curr) => acc + curr.amount, 0);
  }, [expenses]);

  const totalIncomeToday = useMemo(() => {
    return sales.reduce((acc, curr) => acc + curr.grand_total, 0);
  }, [sales]);

  // Expenses Pagination Slices
  const totalExpenses = expenses.length;
  const totalExpensePages = Math.ceil(totalExpenses / expenseLimit) || 1;
  const startExpIndex = (expensePage - 1) * expenseLimit;
  const endExpIndex = Math.min(startExpIndex + expenseLimit, totalExpenses);
  const currentExpenses = expenses.slice(startExpIndex, endExpIndex);

  // Sales Pagination Slices
  const totalSalesCount = sales.length;
  const totalSalesPages = Math.ceil(totalSalesCount / salesLimit) || 1;
  const startSalesIndex = (salesPage - 1) * salesLimit;
  const endSalesIndex = Math.min(startSalesIndex + salesLimit, totalSalesCount);
  const currentSales = sales.slice(startSalesIndex, endSalesIndex);

  // 1. Submit Catat Pengeluaran (store_expense)
  const handleSaveExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (expAmount <= 0) {
      alert('Nominal pengeluaran harus lebih besar dari 0!');
      return;
    }

    const selectedAccount = accounts.find((a) => a.id === expAccountId);
    if (selectedAccount && selectedAccount.balance < expAmount) {
      if (!confirm(`Saldo ${selectedAccount.account_name} (Rp ${selectedAccount.balance.toLocaleString('id-ID')}) lebih kecil dari pengeluaran. Lanjutkan?`)) {
        return;
      }
    }

    const category = categories.find((c) => c.id === expCategoryId);
    const dateFormatted = expDate.replace(/-/g, '');
    const expNum = `EXP-${dateFormatted}-${String(expenses.length + 1).padStart(3, '0')}`;

    const newExpense: ExpenseItem = {
      id: `exp-${Date.now()}`,
      expense_number: expNum,
      expense_category_id: expCategoryId,
      category_name: category?.category_name || 'Operasional',
      account_id: expAccountId,
      account_name: selectedAccount?.account_name || 'Kas Kecil',
      description: expDesc.trim() || 'Biaya operasional',
      amount: expAmount,
      date: expDate,
      status: 'Approved',
    };

    // Kurangi saldo akun (UPDATE accounts SET balance = balance - amount)
    setAccounts((prev) =>
      prev.map((a) => (a.id === expAccountId ? { ...a, balance: a.balance - expAmount } : a))
    );

    setExpenses((prev) => [newExpense, ...prev]);
    setIsExpenseModalOpen(false);
    setExpAmount(0);
    setExpDesc('');
    onShowToast('success', 'Pengeluaran Dicatat', `Pengeluaran ${expNum} sebesar Rp ${expAmount.toLocaleString('id-ID')} berhasil dicatat.`);
  };

  // 2. Submit Tambah Saldo (store_add_balance)
  const handleSaveAddBalance = (e: React.FormEvent) => {
    e.preventDefault();
    if (balAmount <= 0) {
      alert('Nominal harus lebih besar dari 0!');
      return;
    }

    const selectedAccount = accounts.find((a) => a.id === balAccountId);

    // Tambah saldo akun
    setAccounts((prev) =>
      prev.map((a) => (a.id === balAccountId ? { ...a, balance: a.balance + balAmount } : a))
    );

    // Catat ke transfers (from_account_id = NULL)
    const newTransfer: CashTransferItem = {
      id: `trans-${Date.now()}`,
      date: balDate,
      from_account_id: null,
      from_account_name: 'Modal Awal / Setoran Luar',
      to_account_id: balAccountId,
      to_account_name: selectedAccount?.account_name || 'Akun',
      amount: balAmount,
      description: balDesc.trim() || 'Setoran saldo modal awal',
    };

    setTransfers((prev) => [newTransfer, ...prev]);
    setIsAddBalanceModalOpen(false);
    setBalAmount(0);
    setBalDesc('');
    onShowToast('success', 'Saldo Berhasil Ditambah', `Saldo ${selectedAccount?.account_name} bertambah Rp ${balAmount.toLocaleString('id-ID')}.`);
  };

  // 3. Submit Transfer Antar Akun (store_transfer)
  const handleSaveTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    if (fromAccountId === toAccountId) {
      alert('Akun asal dan akun tujuan tidak boleh sama!');
      return;
    }
    if (transAmount <= 0) {
      alert('Nominal transfer harus lebih besar dari 0!');
      return;
    }

    const fromAcc = accounts.find((a) => a.id === fromAccountId);
    const toAcc = accounts.find((a) => a.id === toAccountId);

    if (fromAcc && fromAcc.balance < transAmount) {
      alert(`Saldo ${fromAcc.account_name} tidak mencukupi (Tersedia: Rp ${fromAcc.balance.toLocaleString('id-ID')}).`);
      return;
    }

    // Update balances: Kurang dari Asal, Tambah ke Tujuan
    setAccounts((prev) =>
      prev.map((a) => {
        if (a.id === fromAccountId) return { ...a, balance: a.balance - transAmount };
        if (a.id === toAccountId) return { ...a, balance: a.balance + transAmount };
        return a;
      })
    );

    const newTransfer: CashTransferItem = {
      id: `trans-${Date.now()}`,
      date: transDate,
      from_account_id: fromAccountId,
      from_account_name: fromAcc?.account_name,
      to_account_id: toAccountId,
      to_account_name: toAcc?.account_name || '',
      amount: transAmount,
      description: transDesc.trim() || `Transfer dari ${fromAcc?.account_name} ke ${toAcc?.account_name}`,
    };

    setTransfers((prev) => [newTransfer, ...prev]);
    setIsTransferModalOpen(false);
    setTransAmount(0);
    setTransDesc('');
    onShowToast('success', 'Transfer Berhasil', `Transfer Rp ${transAmount.toLocaleString('id-ID')} dari ${fromAcc?.account_name} ke ${toAcc?.account_name} sukses.`);
  };

  return (
    <div className="bg-white rounded-xl border border-[#E0E0E0] shadow-xs overflow-hidden">
      {/* 1. CARD HEADER KDMP */}
      <div className="p-4 sm:p-5 border-b border-[#E0E0E0] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white">
        <div className="flex items-center gap-2">
          <Banknote className="w-5 h-5 text-[#D32F2F]" />
          <h5 className="text-base font-bold text-gray-900 tracking-tight">Kas & Pembayaran</h5>
        </div>

        {/* Action Buttons Sesuai Template */}
        <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
          <button
            type="button"
            onClick={() => setIsTransferModalOpen(true)}
            className="px-3 py-1.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-bold rounded-lg shadow-xs flex items-center gap-1.5 transition-colors"
          >
            <ArrowRightLeft className="w-3.5 h-3.5" />
            <span>Transfer</span>
          </button>

          <button
            type="button"
            onClick={() => setIsAddBalanceModalOpen(true)}
            className="px-3 py-1.5 bg-white border border-gray-200 hover:bg-gray-50 text-emerald-700 text-xs font-bold rounded-lg shadow-xs flex items-center gap-1.5 transition-colors"
          >
            <PlusCircle className="w-3.5 h-3.5 text-emerald-600" />
            <span>Tambah Saldo</span>
          </button>

          <button
            type="button"
            onClick={() => setIsExpenseModalOpen(true)}
            className="px-3.5 py-1.5 bg-[#D32F2F] hover:bg-[#B71C1C] text-white text-xs font-bold rounded-lg shadow-xs flex items-center gap-1.5 transition-colors"
          >
            <MinusCircle className="w-3.5 h-3.5" />
            <span>Pengeluaran</span>
          </button>
        </div>
      </div>

      {/* 2. CARD BODY */}
      <div className="p-4 sm:p-5 space-y-5">
        {/* SUMMARY CARDS (#summary-cards) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3.5">
          {/* Card 1: Total Saldo Kas/Bank */}
          <div className="p-3.5 rounded-xl shadow-xs border-l-4 border-blue-500 bg-[#e3f2fd] flex items-center justify-between">
            <div>
              <p className="text-[12px] text-gray-500 font-medium mb-0.5">Total Kas & Bank</p>
              <h5 className="text-lg font-bold text-[#0d47a1] whitespace-nowrap">
                Rp {totalBalance.toLocaleString('id-ID')}
              </h5>
            </div>
            <div className="bg-white p-2.5 rounded-xl text-blue-600 shadow-xs">
              <Wallet className="w-5 h-5" />
            </div>
          </div>

          {/* Card 2: Saldo Kas Kecil */}
          <div className="p-3.5 rounded-xl shadow-xs border-l-4 border-emerald-500 bg-[#e8f5e9] flex items-center justify-between">
            <div>
              <p className="text-[12px] text-gray-500 font-medium mb-0.5">Kas Kecil (Kasir)</p>
              <h5 className="text-lg font-bold text-[#1b5e20] whitespace-nowrap">
                Rp {(accounts.find((a) => a.id === '1')?.balance || 0).toLocaleString('id-ID')}
              </h5>
            </div>
            <div className="bg-white p-2.5 rounded-xl text-emerald-600 shadow-xs">
              <Banknote className="w-5 h-5" />
            </div>
          </div>

          {/* Card 3: Kas Masuk (Penjualan Hari Ini) */}
          <div className="p-3.5 rounded-xl shadow-xs border-l-4 border-indigo-500 bg-[#ede7f6] flex items-center justify-between">
            <div>
              <p className="text-[12px] text-gray-500 font-medium mb-0.5">Total Pemasukan</p>
              <h5 className="text-lg font-bold text-[#311b92] whitespace-nowrap">
                Rp {totalIncomeToday.toLocaleString('id-ID')}
              </h5>
            </div>
            <div className="bg-white p-2.5 rounded-xl text-indigo-600 shadow-xs">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>

          {/* Card 4: Kas Keluar (Pengeluaran) */}
          <div className="p-3.5 rounded-xl shadow-xs border-l-4 border-amber-500 bg-[#fff3e0] flex items-center justify-between">
            <div>
              <p className="text-[12px] text-gray-500 font-medium mb-0.5">Total Pengeluaran</p>
              <h5 className="text-lg font-bold text-[#e65100] whitespace-nowrap">
                Rp {totalExpenseToday.toLocaleString('id-ID')}
              </h5>
            </div>
            <div className="bg-white p-2.5 rounded-xl text-amber-600 shadow-xs">
              <TrendingDown className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* TAB NAVIGATION (nav-tabs-kdmp) */}
        <div className="border-b border-[#E0E0E0] flex gap-2">
          {/* Tab 1: Kas Keluar */}
          <button
            type="button"
            onClick={() => setActiveTab('keluar')}
            className={`pb-2.5 px-3 text-xs font-bold flex items-center gap-1.5 transition-colors border-b-2 -mb-[1px] ${
              activeTab === 'keluar'
                ? 'border-[#D32F2F] text-[#D32F2F]'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            <ArrowUpFromLine className="w-3.5 h-3.5" />
            <span>Kas Keluar (Pengeluaran)</span>
            {expenses.length > 0 && (
              <span className="bg-red-100 text-red-700 px-1.5 py-0.2 rounded-full text-[10px]">
                {expenses.length}
              </span>
            )}
          </button>

          {/* Tab 2: Kas Masuk */}
          <button
            type="button"
            onClick={() => setActiveTab('masuk')}
            className={`pb-2.5 px-3 text-xs font-bold flex items-center gap-1.5 transition-colors border-b-2 -mb-[1px] ${
              activeTab === 'masuk'
                ? 'border-[#D32F2F] text-[#D32F2F]'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            <ArrowDownToLine className="w-3.5 h-3.5" />
            <span>Kas Masuk (Penjualan)</span>
            {sales.length > 0 && (
              <span className="bg-emerald-100 text-emerald-700 px-1.5 py-0.2 rounded-full text-[10px]">
                {sales.length}
              </span>
            )}
          </button>
        </div>

        {/* TAB 1: KAS KELUAR (PENGELUARAN) */}
        {activeTab === 'keluar' && (
          <div className="space-y-4">
            <div className="overflow-x-auto border border-gray-100 rounded-lg">
              <table className="w-full text-left text-xs align-middle" id="table-expense">
                <thead className="bg-[#f8f9fa] border-b border-[#E0E0E0] text-[10.5px] font-bold uppercase tracking-wider text-gray-500">
                  <tr>
                    <th className="py-2.5 px-3 w-12 text-center">No</th>
                    <th className="py-2.5 px-3">Tanggal</th>
                    <th className="py-2.5 px-3">No. Transaksi</th>
                    <th className="py-2.5 px-3">Kategori</th>
                    <th className="py-2.5 px-3">Akun</th>
                    <th className="py-2.5 px-3">Deskripsi</th>
                    <th className="py-2.5 px-3 text-right">Nominal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {currentExpenses.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-gray-400 text-xs">
                        Belum ada pencatatan kas keluar.
                      </td>
                    </tr>
                  ) : (
                    currentExpenses.map((exp, idx) => (
                      <tr key={exp.id} className="hover:bg-gray-50/70 transition-colors">
                        <td className="py-3 px-3 text-center text-gray-500 font-mono">
                          {startExpIndex + idx + 1}
                        </td>
                        <td className="py-3 px-3 font-mono text-gray-500 text-[11px]">
                          {exp.date}
                        </td>
                        <td className="py-3 px-3 font-mono font-bold text-gray-900">
                          {exp.expense_number}
                        </td>
                        <td className="py-3 px-3">
                          <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-amber-50 text-amber-800 border border-amber-200">
                            {exp.category_name}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-gray-700">
                          <span className="font-semibold">{exp.account_name}</span>
                        </td>
                        <td className="py-3 px-3 text-gray-600 max-w-xs truncate" title={exp.description}>
                          {exp.description}
                        </td>
                        <td className="py-3 px-3 text-right font-mono font-bold text-red-600">
                          - Rp {exp.amount.toLocaleString('id-ID')}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Kas Keluar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 text-xs">
              <small className="text-gray-500" id="pagination-info">
                Menampilkan {totalExpenses === 0 ? 0 : startExpIndex + 1}-{endExpIndex} dari {totalExpenses} data
              </small>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  disabled={expensePage === 1}
                  onClick={() => setExpensePage((p) => Math.max(1, p - 1))}
                  className="px-2.5 py-1 text-xs border border-gray-200 rounded-md bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
                >
                  <ChevronLeft className="w-3 h-3" />
                  <span>Sebelumnya</span>
                </button>

                {Array.from({ length: totalExpensePages }).map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setExpensePage(i + 1)}
                    className={`w-7 h-7 text-xs font-semibold rounded-md transition-colors ${
                      expensePage === i + 1
                        ? 'bg-[#D32F2F] text-white'
                        : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}

                <button
                  type="button"
                  disabled={expensePage === totalExpensePages || totalExpensePages === 0}
                  onClick={() => setExpensePage((p) => Math.min(totalExpensePages, p + 1))}
                  className="px-2.5 py-1 text-xs border border-gray-200 rounded-md bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
                >
                  <span>Berikutnya</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: KAS MASUK (PENJUALAN) */}
        {activeTab === 'masuk' && (
          <div className="space-y-4">
            <div className="overflow-x-auto border border-gray-100 rounded-lg">
              <table className="w-full text-left text-xs align-middle" id="table-sales">
                <thead className="bg-[#f8f9fa] border-b border-[#E0E0E0] text-[10.5px] font-bold uppercase tracking-wider text-gray-500">
                  <tr>
                    <th className="py-2.5 px-3 w-12 text-center">No</th>
                    <th className="py-2.5 px-3">Tanggal</th>
                    <th className="py-2.5 px-3">No. Invoice</th>
                    <th className="py-2.5 px-3">Asal Kas</th>
                    <th className="py-2.5 px-3 text-right">Nominal Masuk</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {currentSales.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-gray-400 text-xs">
                        Belum ada data penerimaan kas penjualan.
                      </td>
                    </tr>
                  ) : (
                    currentSales.map((sale, idx) => (
                      <tr key={sale.id} className="hover:bg-gray-50/70 transition-colors">
                        <td className="py-3 px-3 text-center text-gray-500 font-mono">
                          {startSalesIndex + idx + 1}
                        </td>
                        <td className="py-3 px-3 font-mono text-gray-500 text-[11px]">
                          {sale.date}
                        </td>
                        <td className="py-3 px-3 font-mono font-bold text-gray-900">
                          {sale.invoice_number}
                        </td>
                        <td className="py-3 px-3 text-gray-700">
                          <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 text-[11px] font-medium">
                            {sale.source_cash}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right font-mono font-bold text-emerald-600">
                          + Rp {sale.grand_total.toLocaleString('id-ID')}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Kas Masuk */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 text-xs">
              <small className="text-muted" id="pagination-info-sales">
                Menampilkan {totalSalesCount === 0 ? 0 : startSalesIndex + 1}-{endSalesIndex} dari {totalSalesCount} data
              </small>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  disabled={salesPage === 1}
                  onClick={() => setSalesPage((p) => Math.max(1, p - 1))}
                  className="px-2.5 py-1 text-xs border border-gray-200 rounded-md bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
                >
                  <ChevronLeft className="w-3 h-3" />
                  <span>Sebelumnya</span>
                </button>

                {Array.from({ length: totalSalesPages }).map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setSalesPage(i + 1)}
                    className={`w-7 h-7 text-xs font-semibold rounded-md transition-colors ${
                      salesPage === i + 1
                        ? 'bg-[#D32F2F] text-white'
                        : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}

                <button
                  type="button"
                  disabled={salesPage === totalSalesPages || totalSalesPages === 0}
                  onClick={() => setSalesPage((p) => Math.min(totalSalesPages, p + 1))}
                  className="px-2.5 py-1 text-xs border border-gray-200 rounded-md bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
                >
                  <span>Berikutnya</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ===== MODAL 1: CATAT PENGELUARAN (#modalExpense) ===== */}
      {isExpenseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-[#E0E0E0] flex items-center justify-between bg-white">
              <h5 className="font-bold text-sm text-gray-900 flex items-center gap-2">
                <MinusCircle className="w-4 h-4 text-[#D32F2F]" />
                <span>Catat Pengeluaran</span>
              </h5>
              <button
                type="button"
                onClick={() => setIsExpenseModalOpen(false)}
                className="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveExpense} id="form-expense">
              <div className="p-5 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">
                      Tanggal <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      required
                      value={expDate}
                      onChange={(e) => setExpDate(e.target.value)}
                      className="w-full text-xs px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:outline-none focus:border-[#D32F2F]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">
                      Akun Kas/Bank <span className="text-red-500">*</span>
                    </label>
                    <select
                      required
                      value={expAccountId}
                      onChange={(e) => setExpAccountId(e.target.value)}
                      className="w-full text-xs px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:outline-none focus:border-[#D32F2F]"
                    >
                      {accounts.map((a) => (
                        <option key={a.id} value={a.id}>
                          {a.account_name} (Rp {a.balance.toLocaleString('id-ID')})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">
                      Kategori <span className="text-red-500">*</span>
                    </label>
                    <select
                      required
                      value={expCategoryId}
                      onChange={(e) => setExpCategoryId(e.target.value)}
                      className="w-full text-xs px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:outline-none focus:border-[#D32F2F]"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.category_name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">
                      Nominal (Rp) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      required
                      min={1}
                      placeholder="0"
                      value={expAmount || ''}
                      onChange={(e) => setExpAmount(Number(e.target.value))}
                      className="w-full text-xs px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:outline-none focus:border-[#D32F2F]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">
                    Deskripsi
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Contoh: Bayar listrik bulan ini"
                    value={expDesc}
                    onChange={(e) => setExpDesc(e.target.value)}
                    className="w-full text-xs px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:outline-none focus:border-[#D32F2F]"
                  />
                </div>
              </div>

              <div className="p-4 border-t border-[#E0E0E0] bg-gray-50 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsExpenseModalOpen(false)}
                  className="px-3 py-1.5 text-xs text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  id="btn-save-expense"
                  className="px-4 py-1.5 text-xs font-bold text-white bg-[#D32F2F] hover:bg-[#B71C1C] rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Simpan</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===== MODAL 2: TAMBAH SALDO (MODAL AWAL) (#modalAddBalance) ===== */}
      {isAddBalanceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-[#E0E0E0] flex items-center justify-between bg-white">
              <h5 className="font-bold text-sm text-gray-900 flex items-center gap-2">
                <PlusCircle className="w-4 h-4 text-emerald-600" />
                <span>Tambah Saldo (Modal Awal)</span>
              </h5>
              <button
                type="button"
                onClick={() => setIsAddBalanceModalOpen(false)}
                className="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveAddBalance} id="form-add-balance">
              <div className="p-5 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">
                      Tanggal <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      required
                      value={balDate}
                      onChange={(e) => setBalDate(e.target.value)}
                      className="w-full text-xs px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:outline-none focus:border-[#D32F2F]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">
                      Akun Tujuan <span className="text-red-500">*</span>
                    </label>
                    <select
                      required
                      value={balAccountId}
                      onChange={(e) => setBalAccountId(e.target.value)}
                      className="w-full text-xs px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:outline-none focus:border-[#D32F2F]"
                    >
                      {accounts.map((a) => (
                        <option key={a.id} value={a.id}>
                          {a.account_name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">
                    Nominal (Rp) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    placeholder="0"
                    value={balAmount || ''}
                    onChange={(e) => setBalAmount(Number(e.target.value))}
                    className="w-full text-xs px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:outline-none focus:border-[#D32F2F]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">
                    Keterangan
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Contoh: Modal awal dari bos"
                    value={balDesc}
                    onChange={(e) => setBalDesc(e.target.value)}
                    className="w-full text-xs px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:outline-none focus:border-[#D32F2F]"
                  />
                </div>
              </div>

              <div className="p-4 border-t border-[#E0E0E0] bg-gray-50 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddBalanceModalOpen(false)}
                  className="px-3 py-1.5 text-xs text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  id="btn-save-add-balance"
                  className="px-4 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Tambah Saldo</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===== MODAL 3: TRANSFER ANTAR AKUN (#modalTransfer) ===== */}
      {isTransferModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-[#E0E0E0] flex items-center justify-between bg-white">
              <h5 className="font-bold text-sm text-gray-900 flex items-center gap-2">
                <ArrowRightLeft className="w-4 h-4 text-[#D32F2F]" />
                <span>Transfer Antar Akun</span>
              </h5>
              <button
                type="button"
                onClick={() => setIsTransferModalOpen(false)}
                className="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveTransfer} id="form-transfer">
              <div className="p-5 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">
                      Dari Akun <span className="text-red-500">*</span>
                    </label>
                    <select
                      required
                      value={fromAccountId}
                      onChange={(e) => setFromAccountId(e.target.value)}
                      className="w-full text-xs px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:outline-none focus:border-[#D32F2F]"
                    >
                      {accounts.map((a) => (
                        <option key={a.id} value={a.id}>
                          {a.account_name} (Rp {a.balance.toLocaleString('id-ID')})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">
                      Ke Akun <span className="text-red-500">*</span>
                    </label>
                    <select
                      required
                      value={toAccountId}
                      onChange={(e) => setToAccountId(e.target.value)}
                      className="w-full text-xs px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:outline-none focus:border-[#D32F2F]"
                    >
                      {accounts.map((a) => (
                        <option key={a.id} value={a.id}>
                          {a.account_name} (Rp {a.balance.toLocaleString('id-ID')})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">
                      Tanggal <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      required
                      value={transDate}
                      onChange={(e) => setTransDate(e.target.value)}
                      className="w-full text-xs px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:outline-none focus:border-[#D32F2F]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">
                      Nominal (Rp) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      required
                      min={1}
                      placeholder="0"
                      value={transAmount || ''}
                      onChange={(e) => setTransAmount(Number(e.target.value))}
                      className="w-full text-xs px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:outline-none focus:border-[#D32F2F]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">
                    Keterangan
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Contoh: Setor hasil kasir ke Bank BCA"
                    value={transDesc}
                    onChange={(e) => setTransDesc(e.target.value)}
                    className="w-full text-xs px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:outline-none focus:border-[#D32F2F]"
                  />
                </div>
              </div>

              <div className="p-4 border-t border-[#E0E0E0] bg-gray-50 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsTransferModalOpen(false)}
                  className="px-3 py-1.5 text-xs text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  id="btn-save-transfer"
                  className="px-4 py-1.5 text-xs font-bold text-white bg-[#D32F2F] hover:bg-[#B71C1C] rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <ArrowRightLeft className="w-3.5 h-3.5" />
                  <span>Transfer</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
