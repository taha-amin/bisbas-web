"use client";

import { CartProvider } from "@/lib/cart";
import { CartDrawer } from "./CartDrawer";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      {children}
      <CartDrawer />
    </CartProvider>
  );
}
