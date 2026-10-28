"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { products, type SizeId } from "./products";

export type CartItem = {
  productId: string;
  sizeId: SizeId;
  quantity: number;
};

type CartContextValue = {
  items: CartItem[];
  ready: boolean;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (productId: string, sizeId: SizeId) => void;
  updateQuantity: (productId: string, sizeId: SizeId, quantity: number) => void;
  removeItem: (productId: string, sizeId: SizeId) => void;
  clearCart: () => void;
  count: number;
  subtotal: number;
};

const STORAGE_KEY = "bisbas-cart";
const CartContext = createContext<CartContextValue | null>(null);

function itemKey(productId: string, sizeId: SizeId) {
  return `${productId}:${sizeId}`;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw) as CartItem[]);
    } catch {
      /* ignore */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, ready]);

  const addItem = useCallback((productId: string, sizeId: SizeId) => {
    setItems((current) => {
      const key = itemKey(productId, sizeId);
      const existing = current.find(
        (item) => itemKey(item.productId, item.sizeId) === key,
      );
      if (existing) {
        return current.map((item) =>
          itemKey(item.productId, item.sizeId) === key
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      return [...current, { productId, sizeId, quantity: 1 }];
    });
    setIsOpen(true);
  }, []);

  const updateQuantity = useCallback(
    (productId: string, sizeId: SizeId, quantity: number) => {
      setItems((current) => {
        if (quantity <= 0) {
          return current.filter(
            (item) => itemKey(item.productId, item.sizeId) !== itemKey(productId, sizeId),
          );
        }
        return current.map((item) =>
          itemKey(item.productId, item.sizeId) === itemKey(productId, sizeId)
            ? { ...item, quantity }
            : item,
        );
      });
    },
    [],
  );

  const removeItem = useCallback((productId: string, sizeId: SizeId) => {
    setItems((current) =>
      current.filter(
        (item) => itemKey(item.productId, item.sizeId) !== itemKey(productId, sizeId),
      ),
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const count = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items],
  );

  const subtotal = useMemo(
    () =>
      items.reduce((sum, item) => {
        const product = products.find((p) => p.id === item.productId);
        const size = product?.sizes.find((s) => s.id === item.sizeId);
        return sum + (size?.price ?? 0) * item.quantity;
      }, 0),
    [items],
  );

  const value = useMemo(
    () => ({
      items,
      ready,
      isOpen,
      openCart: () => setIsOpen(true),
      closeCart: () => setIsOpen(false),
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
      count,
      subtotal,
    }),
    [items, ready, isOpen, addItem, updateQuantity, removeItem, clearCart, count, subtotal],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}
