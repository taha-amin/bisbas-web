"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useCart } from "@/lib/cart";
import { INSTAGRAM_URL } from "@/lib/social";
import { InstagramLink } from "./InstagramLink";
import { Logo } from "./Logo";

const nav = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/story", label: "Our Story" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const pathname = usePathname();
  const { count, openCart } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="border-b border-black/5 bg-paper">
      <div className="mx-auto grid max-w-6xl grid-cols-[1fr_auto] items-center gap-4 px-5 py-5 md:grid-cols-[1fr_auto_1fr] sm:px-8">
        <div className="justify-self-start">
          <Logo />
        </div>

        <nav className="hidden items-center gap-9 text-[15px] text-ink/80 md:flex">
          {nav.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative pb-1 transition-colors hover:text-ink ${
                  active ? "text-ink" : ""
                }`}
              >
                {item.label}
                {active && (
                  <span className="absolute inset-x-1 -bottom-0.5 h-[2px] rounded-full bg-burgundy" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center justify-self-end gap-1 sm:gap-3">
          <InstagramLink />
          <button
            type="button"
            onClick={openCart}
            className="relative rounded-full p-2 text-ink transition hover:bg-black/5"
            aria-label="Open cart"
          >
            <CartIcon />
            {count > 0 && (
              <span className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-burgundy px-1 text-[10px] font-semibold text-white">
                {count}
              </span>
            )}
          </button>
          <button
            type="button"
            className="rounded-md p-2 md:hidden"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label="Toggle menu"
          >
            <span className="mb-1 block h-0.5 w-5 bg-ink" />
            <span className="mb-1 block h-0.5 w-5 bg-ink" />
            <span className="block h-0.5 w-5 bg-ink" />
          </button>
        </div>
      </div>
      {menuOpen && (
        <nav className="flex flex-col gap-3 border-t border-black/5 px-6 py-4 md:hidden">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              className="text-ink"
            >
              {item.label}
            </Link>
          ))}
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-ink"
            onClick={() => setMenuOpen(false)}
          >
            Instagram
          </a>
        </nav>
      )}
    </header>
  );
}

function CartIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M6 7h15l-1.4 8.2a2 2 0 0 1-2 1.6H9.2a2 2 0 0 1-2-1.7L5.2 4H3"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="10" cy="20" r="1.3" fill="currentColor" />
      <circle cx="17" cy="20" r="1.3" fill="currentColor" />
    </svg>
  );
}
