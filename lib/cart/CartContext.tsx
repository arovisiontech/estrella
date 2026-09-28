"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { CartItem } from "@/lib/types/cart";

const STORAGE_KEY = "torque:cart";

function lineKey(item: Pick<CartItem, "productId" | "size" | "color">) {
  return `${item.productId}__${item.size ?? ""}__${item.color ?? ""}`;
}

type CartContextValue = {
  items: CartItem[];
  itemCount: number;
  addItem: (item: CartItem) => void;
  removeItem: (item: Pick<CartItem, "productId" | "size" | "color">) => void;
  updateQuantity: (
    item: Pick<CartItem, "productId" | "size" | "color">,
    quantity: number
  ) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // One-time hydration from localStorage on mount. This must run in an
    // effect (not a lazy initializer) so the client's first render matches
    // the server-rendered empty cart and avoids a hydration mismatch.
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (raw) setItems(JSON.parse(raw));
    } catch {
      // ignore malformed/unavailable storage
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, hydrated]);

  const value = useMemo<CartContextValue>(() => {
    const addItem: CartContextValue["addItem"] = (item) => {
      setItems((prev) => {
        const key = lineKey(item);
        const existingIndex = prev.findIndex((line) => lineKey(line) === key);

        if (existingIndex >= 0) {
          const next = [...prev];
          next[existingIndex] = {
            ...next[existingIndex],
            quantity: next[existingIndex].quantity + item.quantity,
          };
          return next;
        }

        return [...prev, item];
      });
    };

    const removeItem: CartContextValue["removeItem"] = (target) => {
      setItems((prev) => prev.filter((line) => lineKey(line) !== lineKey(target)));
    };

    const updateQuantity: CartContextValue["updateQuantity"] = (target, quantity) => {
      setItems((prev) =>
        prev.map((line) =>
          lineKey(line) === lineKey(target) ? { ...line, quantity } : line
        )
      );
    };

    const clearCart = () => setItems([]);

    const itemCount = items.reduce((sum, line) => sum + line.quantity, 0);

    return { items, itemCount, addItem, removeItem, updateQuantity, clearCart };
  }, [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return ctx;
}
