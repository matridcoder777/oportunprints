export interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'store_manager' | 'multi_store' | 'vendor';
  firstName: string;
  lastName: string;
  storeIds: string[];
}

export interface Store {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  type: string;
  partner: string;
  active: boolean;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  campaign: string;
  storeType: string;
  partner: string;
  language: string;
  status: 'active' | 'disabled' | 'retired';
  imageUrl: string;
  description: string;
  internalNotes?: string;
}

export interface CartItem {
  productId: string;
  productName: string;
  sku: string;
  quantity: number;
}

export interface Cart {
  userId: string;
  items: CartItem[];
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  sku: string;
}

export interface Order {
  id: string;
  userId: string;
  storeId: string;
  items: OrderItem[];
  status:
    | 'pending'
    | 'approved'
    | 'rejected'
    | 'sent_to_vendor'
    | 'completed';
  createdAt: string;
  updatedAt: string;
}
