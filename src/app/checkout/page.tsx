"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useCart } from "@/lib/cart";
import { products } from "@/lib/products";

export default function CheckoutPage() {
  const { items, ready, subtotal, clearCart } = useCart();
  const [placed, setPlaced] = useState(false);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    clearCart();
    setPlaced(true);
  }

  if (!ready) {
    return <section className="mx-auto max-w-lg px-6 py-20 text-center">Loading checkout…</section>;
  }

  if (placed) {
    return (
      <section className="mx-auto max-w-lg px-6 py-20 text-center">
        <h1 className="font-display text-4xl">Order received</h1>
        <p className="mt-4 text-ink/70">
          Thank you. This demo checkout doesn&apos;t charge a card — when you&apos;re ready, we can
          connect Stripe or Square for live payments.
        </p>
        <Link href="/shop" className="btn-primary mt-8">
          BACK TO SHOP
        </Link>
      </section>
    );
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
    <section className="mx-auto grid max-w-5xl gap-10 px-6 py-14 lg:grid-cols-[1.1fr_0.9fr]">
      <div>
        <h1 className="font-display text-4xl">Checkout</h1>
        <p className="mt-2 text-sm text-ink/60">
          Demo checkout — no payment is processed.
        </p>
        <form onSubmit={onSubmit} className="mt-8 space-y-4">
          <input className="field" name="name" placeholder="Full name" required />
          <input className="field" name="email" type="email" placeholder="Email" required />
          <input className="field" name="address" placeholder="Shipping address" required />
          <div className="grid gap-4 sm:grid-cols-2">
            <input className="field" name="city" placeholder="City" required />
            <input className="field" name="zip" placeholder="ZIP" required />
          </div>
          <button type="submit" className="btn-primary mt-2 w-full">
            PLACE ORDER · ${subtotal}
          </button>
        </form>
      </div>
      <aside className="h-fit rounded-2xl bg-hero p-6">
        <h2 className="font-display text-2xl">Order summary</h2>
        <ul className="mt-5 space-y-3">
          {items.map((item) => {
            const product = products.find((p) => p.id === item.productId);
            const size = product?.sizes.find((s) => s.id === item.sizeId);
            if (!product || !size) return null;
            return (
              <li key={`${item.productId}-${item.sizeId}`} className="flex justify-between text-sm">
                <span>
                  {product.name} · {size.label} × {item.quantity}
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
    </section>
  );
}
