"use client";

import Image from "next/image";
import { useState } from "react";
import { useCart } from "@/lib/cart";
import type { Product, SizeId } from "@/lib/products";

export function ProductCard({ product }: { product: Product }) {
  const [sizeId, setSizeId] = useState<SizeId>("16oz");
  const [pairingsOpen, setPairingsOpen] = useState(false);
  const { addItem } = useCart();
  const selected = product.sizes.find((size) => size.id === sizeId)!;

  return (
    <article className="flex flex-col items-center text-center">
      <div
        className={`group relative mb-6 aspect-[3/4] w-full max-w-[320px] overflow-hidden rounded-[1.35rem] bg-white ${
          pairingsOpen ? "is-open" : ""
        }`}
      >
        <button
          type="button"
          className="relative h-full w-full cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-burgundy"
          aria-label={`See pairings for ${product.name}`}
          aria-expanded={pairingsOpen}
          aria-controls={`pairings-${product.id}`}
          onClick={() => setPairingsOpen((open) => !open)}
        >
          <Image
            src={selected.image}
            alt={`${product.name} ${selected.format}`}
            fill
            className="object-contain p-4"
            sizes="320px"
          />
          <span className="pairing-hint" aria-hidden>
            See pairings
          </span>
        </button>

        <div
          id={`pairings-${product.id}`}
          className="pairing-badge"
          aria-hidden={!pairingsOpen}
        >
          <p className="pairing-kicker">
            <ChiliMark />
            Pairs well with
          </p>
          <ul className="mt-2.5 flex flex-wrap justify-center gap-1.5">
            {product.pairsWith.map((food, index) => (
              <li
                key={food}
                className="pairing-chip"
                style={{ animationDelay: `${80 + index * 55}ms` }}
              >
                {food}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <p className="text-[11px] font-semibold tracking-[0.22em] text-burgundy uppercase">
        {product.color}
      </p>
      <h3 className="mt-1 font-display text-2xl text-ink sm:text-[28px]">{product.name}</h3>
      <p className="mt-2 text-sm text-ink/60">Bottle or jar</p>
      <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
        {product.sizes.map((size) => {
          const active = size.id === sizeId;
          return (
            <button
              key={size.id}
              type="button"
              onClick={() => setSizeId(size.id)}
              className={`rounded-full border px-4 py-2 text-sm transition ${
                active
                  ? "border-burgundy bg-burgundy text-white"
                  : "border-ink/20 bg-white text-ink hover:border-ink/40"
              }`}
            >
              {size.format} · {size.label} ${size.price}
            </button>
          );
        })}
      </div>
      <button
        type="button"
        onClick={() => addItem(product.id, selected.id)}
        className="btn-primary mt-5 w-56"
      >
        ADD TO CART
        <CartSmall />
      </button>
    </article>
  );
}

function ChiliMark() {
  return (
    <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M9.2 2.2c.2 1.4-.4 2.4-1.4 3.1 1.8.2 3.6 1.6 4.1 3.6.6 2.4-.8 4.8-3.2 5.4-2.4.6-4.8-.8-5.4-3.2-.5-2 0-4 1.6-5.2C4.2 4.7 5.3 3 6.8 1.8c.7 1.1 1.7 1.4 2.4.4Z"
        fill="currentColor"
      />
    </svg>
  );
}

function CartSmall() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M6 7h15l-1.4 8.2a2 2 0 0 1-2 1.6H9.2a2 2 0 0 1-2-1.7L5.2 4H3"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="10" cy="20" r="1.2" fill="currentColor" />
      <circle cx="17" cy="20" r="1.2" fill="currentColor" />
    </svg>
  );
}
