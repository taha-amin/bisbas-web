"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/lib/cart";

export default function CheckoutSuccessPage() {
  const { clearCart, ready } = useCart();

  useEffect(() => {
    if (ready) clearCart();
  }, [ready, clearCart]);

  return (
    <section className="mx-auto max-w-lg px-6 py-20 text-center">
      <h1 className="font-display text-4xl">Order received</h1>
      <p className="mt-4 text-ink/70">
        Thank you — your payment went through. You&apos;ll get a receipt from Stripe, and we&apos;ll
        pack your Bisbas soon.
      </p>
      <Link href="/shop" className="btn-primary mt-8">
        BACK TO SHOP
      </Link>
    </section>
  );
}
