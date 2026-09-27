export type Category = 'Semua' | 'Makanan' | 'Minuman' | 'Sembako' | 'Snack' | 'Kebutuhan Rumah';

export interface Product {
  id: string;
  sku: string;
  name: string;
  category: Category;
  costPrice: number; // Harga modal / HPP
  sellingPrice: number; // Harga jual
  stock: number;
  minStock: number;
  unit: string; // pcs, botol, porsi, kg, pack
  barcode?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  note?: string;
}

export type PaymentMethod = 'cash' | 'qris' | 'transfer' | 'debit';

export interface Transaction {
  id: string;
  invoiceNumber: string;
  createdAt: string; // ISO string
  items: CartItem[];
  subtotal: number;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  discountAmount: number;
  taxEnabled: boolean;
  taxAmount: number;
  grandTotal: number;
  paymentMethod: PaymentMethod;
  amountPaid: number;
  change: number;
  cashierName: string;
  customerName?: string;
  notes?: string;
}

export interface StoreSettings {
  storeName: string;
  storeAddress: string;
  storePhone: string;
  receiptFooter: string;
  taxRate: number; // e.g. 11%
  currencySymbol: string;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
}
