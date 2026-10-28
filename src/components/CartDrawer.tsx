"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/lib/cart";
import { products } from "@/lib/products";

export function CartDrawer() {
  const { items, isOpen, closeCart, updateQuantity, removeItem, subtotal } =
    useCart();

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-black/35 transition-opacity ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={closeCart}
      />
      <aside
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-paper shadow-2xl transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        aria-hidden={!isOpen}
      >
        <div className="flex items-center justify-between border-b border-black/10 px-6 py-5">
          <h2 className="font-display text-2xl">Your cart</h2>
          <button type="button" onClick={closeCart} className="text-sm text-ink/70">
            Close
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {items.length === 0 ? (
            <p className="text-ink/70">Your cart is empty. Shop Bisbas and add a jar.</p>
          ) : (
            <ul className="space-y-5">
              {items.map((item) => {
                const product = products.find((p) => p.id === item.productId);
                const size = product?.sizes.find((s) => s.id === item.sizeId);
                if (!product || !size) return null;
                return (
                  <li key={`${item.productId}-${item.sizeId}`} className="flex gap-4">
                    <div className="relative h-20 w-16 shrink-0 overflow-hidden rounded-md bg-hero">
                      <Image
                        src={size.image}
                        alt=""
                        fill
                        sizes="64px"
                        className="object-contain"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-ink/60">
                        {size.format} · {size.label} · ${size.price}
                      </p>
                      <div className="mt-2 flex items-center gap-3">
                        <div className="flex items-center rounded-full border border-ink/15">
                          <button
                            type="button"
                            className="px-2 py-1"
                            onClick={() =>
                              updateQuantity(item.productId, item.sizeId, item.quantity - 1)
                            }
                          >
                            −
                          </button>
                          <span className="min-w-6 text-center text-sm">{item.quantity}</span>
                          <button
                            type="button"
                            className="px-2 py-1"
                            onClick={() =>
                              updateQuantity(item.productId, item.sizeId, item.quantity + 1)
                            }
                          >
                            +
                          </button>
                        </div>
                        <button
                          type="button"
                          className="text-xs text-burgundy"
                          onClick={() => removeItem(item.productId, item.sizeId)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                    <p className="text-sm font-medium">${size.price * item.quantity}</p>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
        <div className="border-t border-black/10 px-6 py-5">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-ink/70">Subtotal</span>
            <span className="font-display text-xl">${subtotal}</span>
          </div>
          <Link
            href="/checkout"
            className={`btn-primary w-full ${items.length === 0 ? "pointer-events-none opacity-40" : ""}`}
            onClick={() => {
              closeCart();
            }}
          >
            CHECKOUT
          </Link>
        </div>
      </aside>
    </>
  );
}
