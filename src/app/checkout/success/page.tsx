"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useCart } from "@/lib/cart";

type Status = "loading" | "paid" | "unpaid";

export default function CheckoutSuccessPage() {
  const { clearCart, ready } = useCart();
  const [status, setStatus] = useState<Status>("loading");

  useEffect(() => {
    if (!ready) return;

    const sessionId = new URLSearchParams(window.location.search).get("session_id");
    if (!sessionId) {
      setStatus("unpaid");
      return;
    }

    fetch(`/api/checkout/verify?session_id=${encodeURIComponent(sessionId)}`)
      .then((response) => response.json() as Promise<{ paid?: boolean }>)
      .then((data) => {
        if (data.paid) {
          clearCart();
          setStatus("paid");
        } else {
          setStatus("unpaid");
        }
      })
      .catch(() => setStatus("unpaid"));
  }, [ready, clearCart]);

  if (status === "loading") {
    return (
      <section className="mx-auto max-w-lg px-6 py-20 text-center">
        <h1 className="font-display text-4xl">Confirming your order…</h1>
      </section>
    );
  }

  if (status === "unpaid") {
    return (
      <section className="mx-auto max-w-lg px-6 py-20 text-center">
        <h1 className="font-display text-4xl">Payment not found</h1>
        <p className="mt-4 text-ink/70">
          We couldn&apos;t confirm a Stripe payment for this visit. If you were charged, check your
          email receipt or contact us on Instagram.
        </p>
        <Link href="/checkout" className="btn-primary mt-8">
          BACK TO CHECKOUT
        </Link>
      </section>
    );
  }

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
