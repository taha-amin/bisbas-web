"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/lib/cart";
import { products } from "@/lib/products";

export default function CheckoutPage() {
  const { items, ready, subtotal } = useCart();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function payWithStripe() {
    setError(null);
    setLoading(true);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((item) => ({
            productId: item.productId,
            sizeId: item.sizeId,
            quantity: item.quantity,
          })),
        }),
      });
      const data = (await response.json()) as { url?: string; error?: string };
      if (!response.ok || !data.url) {
        throw new Error(data.error || "Could not start checkout.");
      }
      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not start checkout.");
      setLoading(false);
    }
  }

  if (!ready) {
    return <section className="mx-auto max-w-lg px-6 py-20 text-center">Loading checkout…</section>;
  }

  if (items.length === 0) {
    return (
      <section className="mx-auto max-w-lg px-6 py-20 text-center">
        <h1 className="font-display text-4xl">Checkout</h1>
        <p className="mt-4 text-ink/70">Your cart is empty.</p>
        <Link href="/shop" className="btn-primary mt-8">
          SHOP BISBAS
        </Link>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-xl px-6 py-14">
      <h1 className="font-display text-4xl">Checkout</h1>
      <p className="mt-2 text-sm text-ink/60">
        You&apos;ll pay securely with Stripe. Card, name, and shipping address are collected on the
        next screen.
      </p>
      <aside className="mt-8 rounded-2xl bg-hero p-6">
        <h2 className="font-display text-2xl">Order summary</h2>
        <ul className="mt-5 space-y-3">
          {items.map((item) => {
            const product = products.find((p) => p.id === item.productId);
            const size = product?.sizes.find((s) => s.id === item.sizeId);
            if (!product || !size) return null;
            return (
              <li key={`${item.productId}-${item.sizeId}`} className="flex justify-between text-sm">
                <span>
                  {product.name} · {size.format} · {size.label} × {item.quantity}
                </span>
                <span>${size.price * item.quantity}</span>
              </li>
            );
          })}
        </ul>
        <div className="mt-5 flex justify-between border-t border-black/10 pt-4 font-medium">
          <span>Subtotal</span>
          <span>${subtotal}</span>
        </div>
      </aside>
      {error ? <p className="mt-4 text-sm text-burgundy">{error}</p> : null}
      <button
        type="button"
        className="btn-primary mt-6 w-full"
        onClick={payWithStripe}
        disabled={loading}
      >
        {loading ? "REDIRECTING TO STRIPE…" : `PAY WITH STRIPE · $${subtotal}`}
      </button>
    </section>
  );
}
