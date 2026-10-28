import { products } from "@/lib/products";
import { ProductCard } from "./ProductCard";

export function ShopGrid() {
  return (
    <section id="shop" className="bg-paper">
      <div className="mx-auto max-w-5xl px-6 py-16 sm:py-20">
        <div className="mb-14 text-center">
          <h2 className="font-display text-4xl text-ink sm:text-5xl">Shop Bisbas</h2>
          <p className="mt-4 text-xs tracking-[0.22em] text-ink/70">
            CHOOSE YOUR SIZE. ADD TO CART.
          </p>
          <div className="mx-auto mt-4 h-[2px] w-10 bg-burgundy" />
        </div>
        <div className="grid gap-16 md:grid-cols-2 md:gap-12">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
