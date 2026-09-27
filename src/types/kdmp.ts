export type ActiveMenuId =
  | 'dashboard'
  | 'produk'
  | 'kategori'
  | 'brand'
  | 'supplier'
  | 'customer'
  | 'warehouse'
  | 'stok-ledger'
  | 'pos'
  | 'pembelian'
  | 'pembayaran'
  | 'kas'
  | 'laporan'
  | 'user-role'
  | 'multi-outlet'
  | 'setting';

export interface DashboardStat {
  id: string;
  title: string;
  value: string;
  subtext?: string;
  icon: string;
  variant: 'blue' | 'green' | 'orange' | 'purple';
}

export interface ChartPoint {
  day: string;
  amountJuta: number;
}

export interface TopProductItem {
  id: string;
  rank: number;
  name: string;
  soldCount: number;
  revenue: number;
  avatarBg: string;
  avatarColor: string;
}

export interface RecentTransactionItem {
  id: string;
  invoice: string;
  customer: string;
  total: number;
  status: 'Lunas' | 'Pending' | 'Batal';
  time: string;
  paymentMethod: string;
}

export interface NotificationItem {
  id: string;
  type: 'danger' | 'success' | 'warning';
  text: string;
  time: string;
}

export type CategoryStatus = 'Aktif' | 'Tidak Dikulak' | 'Discontinue' | 'Non-Aktif';

export interface CategoryItem {
  id: string;
  code: string;
  name: string;
  status: CategoryStatus;
  productCount?: number;
}

export interface BrandItem {
  id: string;
  code: string;
  name: string;
  status: CategoryStatus;
  productCount?: number;
}

export type TaxStatus = 'Non-PPN' | 'PPN Exclude' | 'PPN Include';

export interface SupplierItem {
  id: string;
  code: string;
  name: string;
  contactPerson: string;
  taxStatus: TaxStatus;
  phone: string;
  address: string;
  status: CategoryStatus;
}

export type CustomerType = 'Umum' | 'Member' | 'Grosir' | 'Reseller';
export type CustomerStatus = 'Aktif' | 'Non-Aktif';

export interface CustomerItem {
  id: string;
  code: string;
  name: string;
  customerType: CustomerType;
  phone: string;
  address: string;
  status: CustomerStatus;
  totalTransactions?: number;
}

export type WarehouseType = 'Pusat' | 'Cabang' | 'Rak' | 'Office';

export interface WarehouseItem {
  id: string;
  company_id?: number;
  warehouse_code: string;
  warehouse_name: string;
  type: WarehouseType;
  capacity?: number;
  address: string;
  status: 'Aktif' | 'Non-Aktif';
}

export interface StockMutationRecord {
  id: string;
  mutationCode: string;
  date: string;
  sourceWarehouse: string;
  targetWarehouse: string;
  totalItems: number;
  status: 'Selesai' | 'Pending' | 'Batal';
}

export interface PurchaseOrderItem {
  id: string;
  variantId: string;
  productName: string;
  unit: string;
  qty: number;
  purchasePrice: number;
  subtotal: number;
}

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  date: string;
  expectedDate?: string;
  supplierId: string;
  supplierName: string;
  warehouseId: string;
  warehouseName: string;
  items: PurchaseOrderItem[];
  subtotal: number;
  taxAmount: number;
  shippingFee: number;
  grandTotal: number;
  status: 'Draft' | 'Dikirim' | 'Selesai' | 'Dibatalkan';
  paymentStatus: 'Belum Lunas' | 'Diajukan' | 'Disetujui' | 'Lunas';
  debtAmount: number;
}

export type PaymentRequestStatus = 'Menunggu Approval' | 'Disetujui' | 'Ditolak' | 'Selesai';

export interface PaymentRequest {
  id: string;
  payNumber: string;
  poId: string;
  poNumber: string;
  supplierName: string;
  accountId: string;
  accountName: string;
  totalAmount: number;
  status: PaymentRequestStatus;
  requestedAt: string;
  requestedBy: string;
  suratJalanUrl?: string;
  proofFile?: string;
  items: PurchaseOrderItem[];
}

export interface CashAccount {
  id: string;
  account_name: string;
  account_number?: string;
  balance: number;
  status: 'Aktif' | 'Non-Aktif';
}

export interface ExpenseCategory {
  id: string;
  category_name: string;
  status: 'Aktif' | 'Non-Aktif';
}

export interface ExpenseItem {
  id: string;
  expense_number: string;
  expense_category_id: string;
  category_name: string;
  account_id: string;
  account_name: string;
  description: string;
  amount: number;
  date: string;
  status: 'Approved' | 'Pending';
  created_by?: number;
}

export interface SalesCashItem {
  id: string;
  invoice_number: string;
  date: string;
  source_cash: string;
  grand_total: number;
  payment_status: 'Lunas';
}

export interface CashTransferItem {
  id: string;
  date: string;
  from_account_id: string | null;
  from_account_name?: string;
  to_account_id: string;
  to_account_name: string;
  amount: number;
  description: string;
}

export interface RoleItem {
  id: number;
  role_name: string;
  description: string;
  status: 'Aktif' | 'Non-Aktif';
}

export interface UserItem {
  id: number;
  name: string;
  username: string;
  password?: string;
  role_id: number;
  role_name?: string;
  status: 'Aktif' | 'Non-Aktif';
  created_at?: string;
}

export interface AuthUser {
  id: number;
  name: string;
  username: string;
  role_id: number;
  role_name: string;
  status: 'Aktif' | 'Non-Aktif';
  outlet_id?: number;
  outlet_name?: string;
  avatar_url?: string;
  last_login?: string;
}

export type OutletType = 'Pusat' | 'Cabang' | 'Kios' | 'Mitra';

export interface OutletItem {
  id: number;
  outlet_code: string;
  outlet_name: string;
  type: OutletType;
  pic_name: string;
  phone: string;
  address: string;
  city: string;
  warehouse_id?: string;
  warehouse_name?: string;
  pos_terminal_count: number;
  today_sales: number;
  monthly_sales: number;
  status: 'Aktif' | 'Non-Aktif' | 'Maintenance';
  is_main?: boolean;
}

export interface PosTerminalItem {
  id: number;
  terminal_code: string;
  terminal_name: string;
  outlet_id: number;
  outlet_name: string;
  cashier_name: string;
  device_name: string;
  ip_address: string;
  payment_methods: string[];
  shift_status: 'Buka Shift' | 'Tutup Shift';
  status: 'Aktif' | 'Non-Aktif';
}

export interface KdmpSettings {
  cooperativeName: string;
  storeName: string;
  legalEntityNumber: string;
  npwp: string;
  storeAddress: string;
  city: string;
  postalCode: string;
  storePhone: string;
  storeEmail: string;
  receiptHeader: string;
  receiptFooter: string;
  paperWidth: '58mm' | '80mm';
  showBarcode: boolean;
  showCashierName: boolean;
  showMemberPoints: boolean;
  taxStatus: 'Non-PPN' | 'PPN Include' | 'PPN Exclude';
  taxRatePercent: number;
  roundingMethod: 'none' | '100' | '500';
  defaultCashierModal: number;
  maxCustomerDebt: number;
  minStockAlert: number;
  autoPrintReceipt: boolean;
}



