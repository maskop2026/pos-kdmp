export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  discountPercent?: number;
  image: string;
  location: string;
  rating: number;
  soldCount: string;
  description?: string;
  stock?: number;
  weight?: string;
}

export interface CategoryItem {
  id: string;
  name: string;
  iconName: string;
  count?: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface ArticleInfo {
  id: string;
  title: string;
  snippet: string;
  fullContent?: string;
  category: string;
  date: string;
  image: string;
}

export interface OrderStep {
  stepNumber: number;
  title: string;
  description: string;
  iconName: string;
}
