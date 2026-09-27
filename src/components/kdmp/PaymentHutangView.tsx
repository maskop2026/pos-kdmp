import React, { useState } from 'react';
import {
  CreditCard,
  Paperclip,
  Send,
  CheckCircle,
  XCircle,
  Banknote,
  Eye,
  FileCheck,
  Check,
  X,
  Upload,
  Calendar,
  Building,
  AlertCircle,
} from 'lucide-react';
import { PurchaseOrder, PaymentRequest } from '../../types/kdmp';
import { INITIAL_PURCHASE_ORDERS, INITIAL_PAYMENT_REQUESTS } from '../../data/kdmpData';

interface PaymentHutangViewProps {
  onShowToast: (type: 'success' | 'info' | 'warning', title: string, message: string) => void;
}

export const PaymentHutangView: React.FC<PaymentHutangViewProps> = ({ onShowToast }) => {
  // Tab State: 'unpaid' | 'approval' | 'execute'
  const [activeTab, setActiveTab] = useState<'unpaid' | 'approval' | 'execute'>('unpaid');

  // Purchase Orders & Payment Requests State
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(INITIAL_PURCHASE_ORDERS);
  const [paymentRequests, setPaymentRequests] = useState<PaymentRequest[]>(INITIAL_PAYMENT_REQUESTS);

  // Modal 1: Ajukan Bayar (Bendahara)
  const [isModalRequestOpen, setIsModalRequestOpen] = useState(false);
  const [targetPOForRequest, setTargetPOForRequest] = useState<PurchaseOrder | null>(null);
  const [selectedAccountId, setSelectedAccountId] = useState<'1' | '2'>('2');

  // Modal 2: Approve & Cek Surat Jalan (Ketua)
  const [isModalApproveOpen, setIsModalApproveOpen] = useState(false);
  const [targetPayForApproval, setTargetPayForApproval] = useState<PaymentRequest | null>(null);

  // Modal 3: Eksekusi Bayar (Bendahara)
  const [isModalExecuteOpen, setIsModalExecuteOpen] = useState(false);
  const [targetPayForExecute, setTargetPayForExecute] = useState<PaymentRequest | null>(null);
  const [proofFileName, setProofFileName] = useState('');

  // 1. Data Tab 1: PO Siap Dibayar (Status: Belum Lunas)
  const unpaidPOs = purchaseOrders.filter(
    (po) => po.paymentStatus === 'Belum Lunas' && po.status !== 'Dibatalkan'
  );

  // 2. Data Tab 2: Approval Pembayaran (Status: Menunggu Approval)
  const approvalRequests = paymentRequests.filter(
    (req) => req.status === 'Menunggu Approval'
  );

  // 3. Data Tab 3: Siap Dieksekusi (Status: Disetujui)
  const readyToExecuteRequests = paymentRequests.filter(
    (req) => req.status === 'Disetujui'
  );

  // Action 1: Open Ajukan Bayar Modal
  const handleOpenRequestModal = (po: PurchaseOrder) => {
    setTargetPOForRequest(po);
    setSelectedAccountId('2'); // Default Bank BCA
    setIsModalRequestOpen(true);
  };

  // Submit Ajukan Bayar
  const handleSubmitRequestPay = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetPOForRequest) return;

    const nextPayNumber = `PAY-2024-${String(paymentRequests.length + 1).padStart(3, '0')}`;
    const now = new Date();
    const dateFormatted = `${now.toISOString().split('T')[0]} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const newRequest: PaymentRequest = {
      id: `pay-${Date.now()}`,
      payNumber: nextPayNumber,
      poId: targetPOForRequest.id,
      poNumber: targetPOForRequest.poNumber,
      supplierName: targetPOForRequest.supplierName,
      accountId: selectedAccountId,
      accountName: selectedAccountId === '1' ? 'Kas Kecil (Kasir)' : 'Bank BCA',
      totalAmount: targetPOForRequest.grandTotal,
      status: 'Menunggu Approval',
      requestedAt: dateFormatted,
      requestedBy: 'Bendahara Toko',
      suratJalanUrl: 'https://images.unsplash.com/photo-1554415707-9e496677e48b?w=600&auto=format&fit=crop&q=80',
      items: targetPOForRequest.items,
    };

    setPaymentRequests((prev) => [newRequest, ...prev]);

    // Update PO status to 'Diajukan'
    setPurchaseOrders((prev) =>
      prev.map((p) => (p.id === targetPOForRequest.id ? { ...p, paymentStatus: 'Diajukan' } : p))
    );

    setIsModalRequestOpen(false);
    onShowToast('success', 'Pengajuan Terkirim', `Pembayaran untuk ${targetPOForRequest.poNumber} (${nextPayNumber}) telah diajukan ke Ketua.`);
  };

  // Action 2: Open Modal Approve
  const handleOpenApproveModal = (req: PaymentRequest) => {
    setTargetPayForApproval(req);
    setIsModalApproveOpen(true);
  };

  // Approve Payment
  const handleApprovePayment = () => {
    if (!targetPayForApproval) return;

    setPaymentRequests((prev) =>
      prev.map((r) =>
        r.id === targetPayForApproval.id ? { ...r, status: 'Disetujui' } : r
      )
    );

    setPurchaseOrders((prev) =>
      prev.map((p) =>
        p.id === targetPayForApproval.poId ? { ...p, paymentStatus: 'Disetujui' } : p
      )
    );

    setIsModalApproveOpen(false);
    onShowToast('success', 'Pembayaran Disetujui', `Pengajuan ${targetPayForApproval.payNumber} telah disetujui untuk dieksekusi bendahara.`);
  };

  // Reject Payment
  const handleRejectPayment = () => {
    if (!targetPayForApproval) return;

    setPaymentRequests((prev) =>
      prev.map((r) =>
        r.id === targetPayForApproval.id ? { ...r, status: 'Ditolak' } : r
      )
    );

    setPurchaseOrders((prev) =>
      prev.map((p) =>
        p.id === targetPayForApproval.poId ? { ...p, paymentStatus: 'Belum Lunas' } : p
      )
    );

    setIsModalApproveOpen(false);
    onShowToast('warning', 'Pengajuan Ditolak', `Pengajuan ${targetPayForApproval.payNumber} ditolak.`);
  };

  // Action 3: Open Modal Eksekusi
  const handleOpenExecuteModal = (req: PaymentRequest) => {
    setTargetPayForExecute(req);
    setProofFileName('');
    setIsModalExecuteOpen(true);
  };

  // Execute Payment
  const handleExecutePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetPayForExecute) return;

    setPaymentRequests((prev) =>
      prev.map((r) =>
        r.id === targetPayForExecute.id
          ? {
              ...r,
              status: 'Selesai',
              proofFile: proofFileName || 'bukti-transfer-bca.jpg',
            }
          : r
      )
    );

    setPurchaseOrders((prev) =>
      prev.map((p) =>
        p.id === targetPayForExecute.poId
          ? {
              ...p,
              paymentStatus: 'Lunas',
              debtAmount: 0,
              status: 'Selesai',
            }
          : p
      )
    );

    setIsModalExecuteOpen(false);
    onShowToast('success', 'Pembayaran Berhasil Selesai', `Tagihan ${targetPayForExecute.poNumber} kepada ${targetPayForExecute.supplierName} telah lunas melalui ${targetPayForExecute.accountName}.`);
  };

  return (
    <div className="bg-white rounded-xl border border-[#E0E0E0] shadow-xs overflow-hidden">
      {/* 1. CARD HEADER KDMP */}
      <div className="p-4 sm:p-5 border-b border-[#E0E0E0] flex items-center justify-between bg-white">
        <div className="flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-[#D32F2F]" />
          <h5 className="text-base font-bold text-gray-900 tracking-tight">Pembayaran & Hutang</h5>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs bg-red-50 text-[#D32F2F] px-2.5 py-1 rounded-full font-bold border border-red-200">
            {unpaidPOs.length} Tagihan Belum Dibayar
          </span>
        </div>
      </div>

      {/* 2. CARD BODY */}
      <div className="p-4 sm:p-5 space-y-4">
        {/* TAB NAVIGATION (nav-tabs-kdmp) */}
        <div className="border-b border-[#E0E0E0] flex flex-wrap gap-1 sm:gap-2">
          {/* Tab 1: PO Siap Dibayar (Bendahara) */}
          <button
            type="button"
            onClick={() => setActiveTab('unpaid')}
            className={`pb-2.5 px-3 text-xs font-bold flex items-center gap-1.5 transition-colors border-b-2 -mb-[1px] ${
              activeTab === 'unpaid'
                ? 'border-[#D32F2F] text-[#D32F2F]'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            <Banknote className="w-3.5 h-3.5" />
            <span>PO Siap Dibayar</span>
            {unpaidPOs.length > 0 && (
              <span className="bg-red-100 text-red-700 px-1.5 py-0.2 rounded-full text-[10px]">
                {unpaidPOs.length}
              </span>
            )}
          </button>

          {/* Tab 2: Approval Pembayaran (Ketua) */}
          <button
            type="button"
            onClick={() => setActiveTab('approval')}
            className={`pb-2.5 px-3 text-xs font-bold flex items-center gap-1.5 transition-colors border-b-2 -mb-[1px] ${
              activeTab === 'approval'
                ? 'border-[#D32F2F] text-[#D32F2F]'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Approval Pembayaran</span>
            {approvalRequests.length > 0 && (
              <span className="bg-amber-100 text-amber-700 px-1.5 py-0.2 rounded-full text-[10px]">
                {approvalRequests.length}
              </span>
            )}
          </button>

          {/* Tab 3: Siap Dieksekusi (Bendahara) */}
          <button
            type="button"
            onClick={() => setActiveTab('execute')}
            className={`pb-2.5 px-3 text-xs font-bold flex items-center gap-1.5 transition-colors border-b-2 -mb-[1px] ${
              activeTab === 'execute'
                ? 'border-[#D32F2F] text-[#D32F2F]'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            <FileCheck className="w-3.5 h-3.5" />
            <span>Siap Dieksekusi</span>
            {readyToExecuteRequests.length > 0 && (
              <span className="bg-emerald-100 text-emerald-700 px-1.5 py-0.2 rounded-full text-[10px]">
                {readyToExecuteRequests.length}
              </span>
            )}
          </button>
        </div>

        {/* TAB 1: PO SIAP DIBAYAR (BENDAHARA) */}
        {activeTab === 'unpaid' && (
          <div className="space-y-4">
            <div className="overflow-x-auto border border-gray-100 rounded-lg">
              <table className="w-full text-left text-xs align-middle" id="table-unpaid">
                <thead className="bg-[#f8f9fa] border-b border-[#E0E0E0] text-[10.5px] font-bold uppercase tracking-wider text-gray-500">
                  <tr>
                    <th className="py-2.5 px-3">No. PO</th>
                    <th className="py-2.5 px-3">Supplier</th>
                    <th className="py-2.5 px-3">Tanggal PO</th>
                    <th className="py-2.5 px-3 text-right">Total</th>
                    <th className="py-2.5 px-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {unpaidPOs.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-gray-400 text-xs">
                        Tidak ada PO yang siap dibayar.
                      </td>
                    </tr>
                  ) : (
                    unpaidPOs.map((po) => (
                      <tr key={po.id} className="hover:bg-gray-50/70 transition-colors">
                        <td className="py-3 px-3 font-mono font-bold text-gray-900">
                          {po.poNumber}
                        </td>
                        <td className="py-3 px-3">
                          <span className="font-bold text-gray-900 block">{po.supplierName}</span>
                          <span className="text-[10px] text-gray-400">Gudang: {po.warehouseName}</span>
                        </td>
                        <td className="py-3 px-3 font-mono text-gray-500 text-[11px]">
                          {po.date}
                        </td>
                        <td className="py-3 px-3 text-right font-mono font-bold text-red-600">
                          Rp {po.grandTotal.toLocaleString('id-ID')}
                        </td>
                        <td className="py-3 px-3 text-right">
                          <button
                            type="button"
                            onClick={() => handleOpenRequestModal(po)}
                            className="bg-[#D32F2F] hover:bg-[#B71C1C] text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-xs inline-flex items-center gap-1.5 transition-colors"
                          >
                            <Send className="w-3.5 h-3.5" />
                            <span>Ajukan Bayar</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: APPROVAL PEMBAYARAN (KETUA) */}
        {activeTab === 'approval' && (
          <div className="space-y-4">
            <div className="overflow-x-auto border border-gray-100 rounded-lg">
              <table className="w-full text-left text-xs align-middle" id="table-approval">
                <thead className="bg-[#f8f9fa] border-b border-[#E0E0E0] text-[10.5px] font-bold uppercase tracking-wider text-gray-500">
                  <tr>
                    <th className="py-2.5 px-3">No. Pay</th>
                    <th className="py-2.5 px-3">No. PO</th>
                    <th className="py-2.5 px-3">Supplier</th>
                    <th className="py-2.5 px-3">Akun Diajukan</th>
                    <th className="py-2.5 px-3 text-right">Total</th>
                    <th className="py-2.5 px-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {approvalRequests.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-gray-400 text-xs">
                        Tidak ada pengajuan pembayaran yang membutuhkan approval.
                      </td>
                    </tr>
                  ) : (
                    approvalRequests.map((req) => (
                      <tr key={req.id} className="hover:bg-gray-50/70 transition-colors">
                        <td className="py-3 px-3 font-mono font-bold text-gray-900">
                          {req.payNumber}
                        </td>
                        <td className="py-3 px-3 font-mono text-gray-700">
                          {req.poNumber}
                        </td>
                        <td className="py-3 px-3 font-semibold text-gray-800">
                          {req.supplierName}
                        </td>
                        <td className="py-3 px-3 text-gray-600">
                          <span className="px-2 py-0.5 rounded bg-gray-100 font-medium text-[11px]">
                            {req.accountName}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right font-mono font-bold text-gray-900">
                          Rp {req.totalAmount.toLocaleString('id-ID')}
                        </td>
                        <td className="py-3 px-3 text-right">
                          <button
                            type="button"
                            onClick={() => handleOpenApproveModal(req)}
                            className="bg-amber-600 hover:bg-amber-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-xs inline-flex items-center gap-1.5 transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Cek & Approve</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: SIAP DIEKSEKUSI (BENDAHARA) */}
        {activeTab === 'execute' && (
          <div className="space-y-4">
            <div className="overflow-x-auto border border-gray-100 rounded-lg">
              <table className="w-full text-left text-xs align-middle" id="table-execute">
                <thead className="bg-[#f8f9fa] border-b border-[#E0E0E0] text-[10.5px] font-bold uppercase tracking-wider text-gray-500">
                  <tr>
                    <th className="py-2.5 px-3">No. Pay</th>
                    <th className="py-2.5 px-3">No. PO</th>
                    <th className="py-2.5 px-3">Supplier</th>
                    <th className="py-2.5 px-3">Akun</th>
                    <th className="py-2.5 px-3 text-right">Total</th>
                    <th className="py-2.5 px-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {readyToExecuteRequests.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-gray-400 text-xs">
                        Belum ada pembayaran yang disetujui untuk dieksekusi.
                      </td>
                    </tr>
                  ) : (
                    readyToExecuteRequests.map((req) => (
                      <tr key={req.id} className="hover:bg-gray-50/70 transition-colors">
                        <td className="py-3 px-3 font-mono font-bold text-gray-900">
                          {req.payNumber}
                        </td>
                        <td className="py-3 px-3 font-mono text-gray-700">
                          {req.poNumber}
                        </td>
                        <td className="py-3 px-3 font-semibold text-gray-800">
                          {req.supplierName}
                        </td>
                        <td className="py-3 px-3">
                          <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 font-medium text-[11px]">
                            {req.accountName}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right font-mono font-bold text-emerald-700">
                          Rp {req.totalAmount.toLocaleString('id-ID')}
                        </td>
                        <td className="py-3 px-3 text-right">
                          <button
                            type="button"
                            onClick={() => handleOpenExecuteModal(req)}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-xs inline-flex items-center gap-1.5 transition-colors"
                          >
                            <Banknote className="w-3.5 h-3.5" />
                            <span>Eksekusi Bayar</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* ===== MODAL 1: AJUKAN BAYAR (BENDAHARA) [#modalRequestPay] ===== */}
      {isModalRequestOpen && targetPOForRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-[#E0E0E0] flex items-center justify-between bg-white">
              <h5 className="font-bold text-sm text-gray-900 flex items-center gap-2">
                <Send className="w-4 h-4 text-[#D32F2F]" />
                <span>Ajukan Pembayaran</span>
              </h5>
              <button
                type="button"
                onClick={() => setIsModalRequestOpen(false)}
                className="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitRequestPay} id="form-request-pay">
              <div className="p-5 space-y-4">
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-xs space-y-1">
                  <p className="text-gray-600">
                    Anda akan mengajukan pembayaran untuk PO:{' '}
                    <strong className="text-gray-900 font-mono text-sm block">
                      {targetPOForRequest.poNumber}
                    </strong>
                  </p>
                  <p className="text-gray-600">
                    Supplier: <strong>{targetPOForRequest.supplierName}</strong>
                  </p>
                  <p className="text-gray-600">
                    Nominal Tagihan:{' '}
                    <strong className="text-[#D32F2F] font-mono">
                      Rp {targetPOForRequest.grandTotal.toLocaleString('id-ID')}
                    </strong>
                  </p>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">
                    Pilih Akun Kas/Bank
                  </label>
                  <select
                    name="account_id"
                    value={selectedAccountId}
                    onChange={(e) => setSelectedAccountId(e.target.value as '1' | '2')}
                    className="w-full text-xs px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:outline-none focus:border-[#D32F2F]"
                    required
                  >
                    <option value="1">Kas Kecil (Kasir)</option>
                    <option value="2">Bank BCA</option>
                  </select>
                </div>
              </div>

              <div className="p-4 border-t border-[#E0E0E0] bg-gray-50 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalRequestOpen(false)}
                  className="px-3 py-1.5 text-xs text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  id="btn-submit-request"
                  className="px-4 py-1.5 text-xs font-bold text-white bg-[#D32F2F] hover:bg-[#B71C1C] rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Kirim Pengajuan</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===== MODAL 2: APPROVE & CEK SURAT JALAN (KETUA) [#modalApprovePay] ===== */}
      {isModalApproveOpen && targetPayForApproval && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-5xl w-full overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-[#E0E0E0] flex items-center justify-between bg-white">
              <h5 className="font-bold text-sm text-gray-900 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>
                  Cek & Approve Pembayaran: <span className="font-mono text-gray-800">{targetPayForApproval.payNumber}</span> ({targetPayForApproval.poNumber})
                </span>
              </h5>
              <button
                type="button"
                onClick={() => setIsModalApproveOpen(false)}
                className="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5" style={{ minHeight: '380px' }}>
                {/* Sisi Kiri: Detail PO Sistem */}
                <div className="md:col-span-6 md:border-r border-gray-200 md:pr-5 flex flex-col">
                  <div className="flex items-center justify-between mb-2">
                    <h6 className="font-bold text-xs text-gray-900 uppercase tracking-wider">
                      Detail PO Sistem
                    </h6>
                    <span className="text-[11px] font-mono text-gray-500">
                      Rekanan: {targetPayForApproval.supplierName}
                    </span>
                  </div>

                  <div className="overflow-y-auto flex-1 border border-gray-200 rounded-lg max-h-[300px]">
                    <table className="w-full text-left text-xs align-middle">
                      <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 font-bold sticky top-0">
                        <tr>
                          <th className="py-2 px-2.5">Produk</th>
                          <th className="py-2 px-2.5 text-center">Qty</th>
                          <th className="py-2 px-2.5 text-right">Subtotal</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {targetPayForApproval.items.map((item) => (
                          <tr key={item.id}>
                            <td className="py-2 px-2.5 font-medium text-gray-800">
                              {item.productName}
                            </td>
                            <td className="py-2 px-2.5 text-center font-mono">
                              {item.qty} {item.unit}
                            </td>
                            <td className="py-2 px-2.5 text-right font-mono font-bold text-gray-900">
                              Rp {item.subtotal.toLocaleString('id-ID')}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200 flex justify-between items-center text-xs">
                    <span className="text-gray-600">Total Pengajuan:</span>
                    <span className="text-sm font-bold font-mono text-[#D32F2F]">
                      Rp {targetPayForApproval.totalAmount.toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>

                {/* Sisi Kanan: Foto Surat Jalan Supplier */}
                <div className="md:col-span-6 flex flex-col">
                  <div className="flex items-center justify-between mb-2">
                    <h6 className="font-bold text-xs text-gray-900 uppercase tracking-wider">
                      Foto Surat Jalan Supplier
                    </h6>
                    <span className="text-[11px] text-gray-500">Bukti Fisik Ekspedisi</span>
                  </div>

                  <div className="flex-1 border border-gray-200 rounded-xl p-2 flex items-center justify-center bg-gray-50 overflow-hidden max-h-[350px]">
                    <img
                      src={targetPayForApproval.suratJalanUrl}
                      alt="Surat Jalan"
                      className="w-full h-full object-contain rounded-lg"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-[#E0E0E0] bg-gray-50 flex items-center justify-end gap-2">
              <button
                type="button"
                id="btn-reject-pay"
                onClick={handleRejectPayment}
                className="px-4 py-1.5 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
              >
                <X className="w-3.5 h-3.5" />
                <span>Tolak</span>
              </button>
              <button
                type="button"
                id="btn-approve-pay"
                onClick={handleApprovePayment}
                className="px-4 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Approve</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== MODAL 3: EKSEKUSI BAYAR (BENDAHARA) [#modalExecutePay] ===== */}
      {isModalExecuteOpen && targetPayForExecute && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-[#E0E0E0] flex items-center justify-between bg-white">
              <h5 className="font-bold text-sm text-gray-900 flex items-center gap-2">
                <Banknote className="w-4 h-4 text-emerald-600" />
                <span>Proses Pembayaran</span>
              </h5>
              <button
                type="button"
                onClick={() => setIsModalExecuteOpen(false)}
                className="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleExecutePayment} id="form-execute-pay">
              <div className="p-5 space-y-4 text-xs">
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 space-y-1">
                  <p className="text-gray-600">
                    Upload bukti transfer/pembayaran ke:
                  </p>
                  <strong className="text-gray-900 block text-sm" id="exec_supplier">
                    {targetPayForExecute.supplierName}
                  </strong>
                  <div className="pt-1 flex justify-between">
                    <span className="text-gray-500">Sumber Rekening:</span>
                    <span className="font-bold text-blue-700">{targetPayForExecute.accountName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Nominal Transfer:</span>
                    <span className="font-bold font-mono text-emerald-700">
                      Rp {targetPayForExecute.totalAmount.toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">
                    File Bukti Bayar <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="file"
                    className="w-full text-xs px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:outline-none focus:border-[#D32F2F] file:mr-3 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-[#D32F2F] file:text-white hover:file:bg-[#B71C1C]"
                    name="file_bukti_bayar"
                    accept="image/*,.pdf"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setProofFileName(e.target.files[0].name);
                      }
                    }}
                    required
                  />
                  {proofFileName && (
                    <span className="text-[11px] text-emerald-600 mt-1 block">
                      ✓ File dipilih: {proofFileName}
                    </span>
                  )}
                </div>
              </div>

              <div className="p-4 border-t border-[#E0E0E0] bg-gray-50 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalExecuteOpen(false)}
                  className="px-3 py-1.5 text-xs text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  id="btn-execute-pay"
                  className="px-4 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Bayar & Selesai</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
