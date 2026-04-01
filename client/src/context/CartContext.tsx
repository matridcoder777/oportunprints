import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';
import apiClient from '../api/client';
import type { CartItem } from '../types';
import { useAuth } from './AuthContext';

interface CartContextValue {
  cart: CartItem[];
  cartCount: number;
  fetchCart: () => Promise<void>;
  addToCart: (
    productId: string,
    productName: string,
    sku: string,
    quantity: number
  ) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  clearCart: () => Promise<void>;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [cart, setCart] = useState<CartItem[]>([]);

  const fetchCart = useCallback(async () => {
    if (!user) {
      setCart([]);
      return;
    }
    try {
      const res = await apiClient.get<{ items: CartItem[] }>('/cart');
      setCart(res.data.items ?? []);
    } catch {
      setCart([]);
    }
  }, [user]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = useCallback(
    async (
      productId: string,
      productName: string,
      sku: string,
      quantity: number
    ) => {
      await apiClient.post('/cart/items', {
        productId,
        productName,
        sku,
        quantity,
      });
      await fetchCart();
    },
    [fetchCart]
  );

  const updateQuantity = useCallback(
    async (productId: string, quantity: number) => {
      await apiClient.put(`/cart/items/${productId}`, { quantity });
      await fetchCart();
    },
    [fetchCart]
  );

  const removeFromCart = useCallback(
    async (productId: string) => {
      await apiClient.delete(`/cart/items/${productId}`);
      await fetchCart();
    },
    [fetchCart]
  );

  const clearCart = useCallback(async () => {
    await apiClient.delete('/cart');
    setCart([]);
  }, []);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount,
        fetchCart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
