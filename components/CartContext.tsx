"use client";
import React from "react";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  color?: string;
  size?: string;
  image?: string;
}

interface CartContextValue {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = React.createContext<CartContextValue>({
  items: [],
  addItem: (_i: CartItem) => {},
  removeItem: (_id: string) => {},
  updateQuantity: (_id: string, _q: number) => {},
  clearCart: () => {},
  totalItems: 0,
  totalPrice: 0,
});

const SESSION_KEY = "cart_hi";

function loadFromSession(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as CartItem[];
  } catch {
    return [];
  }
}

function saveToSession(items: CartItem[]): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(items));
  } catch {
    // quota exceeded or private mode — fail silently
  }
}

export default function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = React.useState<CartItem[]>([]);
  const [hydrated, setHydrated] = React.useState(false);

  React.useEffect(() => {
    const stored = loadFromSession();
    setItems(stored);
    setHydrated(true);
  }, []);

  React.useEffect(() => {
    if (hydrated) {
      saveToSession(items);
    }
  }, [items, hydrated]);

  const addItem = React.useCallback((incoming: CartItem) => {
    setItems((prev) => {
      const key = incoming.id + (incoming.color ?? "") + (incoming.size ?? "");
      const exists = prev.find(
        (i) => i.id + (i.color ?? "") + (i.size ?? "") === key
      );
      if (exists) {
        return prev.map((i) =>
          i.id + (i.color ?? "") + (i.size ?? "") === key
            ? { ...i, quantity: i.quantity + incoming.quantity }
            : i
        );
      }
      return [...prev, incoming];
    });
  }, []);

  const removeItem = React.useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const updateQuantity = React.useCallback((id: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((i) => i.id !== id));
    } else {
      setItems((prev) =>
        prev.map((i) => (i.id === id ? { ...i, quantity } : i))
      );
    }
  }, []);

  const clearCart = React.useCallback(() => {
    setItems([]);
  }, []);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  return React.useContext(CartContext);
}