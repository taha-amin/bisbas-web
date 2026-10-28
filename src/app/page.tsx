import Image from "next/image";
import Link from "next/link";
import { ShopGrid } from "@/components/ShopGrid";

export default function Home() {
  return (
    <>
      <section className="bg-hero">
        <div className="mx-auto grid max-w-6xl items-center gap-8 px-6 py-10 sm:grid-cols-2 sm:px-8 lg:py-6">
          <div className="max-w-xl pt-4">
            <h1 className="font-display text-5xl leading-[1.05] font-bold tracking-tight text-ink sm:text-6xl lg:text-[68px]">
              Bold flavor.
              <br />
              Made with love.
            </h1>
            <div className="mt-6 h-[3px] w-16 bg-burgundy" />
            <p className="mt-6 text-[15px] tracking-wide text-ink/75">
              Mediterranean • East African • Family Recipe
            </p>
            <Link href="#shop" className="btn-primary mt-8">
              SHOP BISBAS
              <span aria-hidden>→</span>
            </Link>
          </div>
          <div className="relative mx-auto aspect-[6/5] w-full max-w-[560px] overflow-hidden rounded-[2rem] bg-hero lg:max-w-none">
            <Image
              src="/images/hero-front.jpg"
              alt="Original and Spicy Bisbas sauce in jars and bottles, with lime, garlic, and chili peppers"
              fill
              priority
              className="object-contain"
              sizes="(min-width: 640px) 50vw, 90vw"
            />
          </div>
        </div>
      </section>
      <ShopGrid />
    </>
  );
}
