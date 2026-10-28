import Image from "next/image";

export default function StoryPage() {
  return (
    <section className="bg-paper">
      <div className="mx-auto grid max-w-5xl items-center gap-12 px-6 py-16 lg:grid-cols-2">
        <div>
          <p className="text-xs tracking-[0.22em] text-burgundy">OUR STORY</p>
          <h1 className="font-display mt-3 text-4xl sm:text-5xl">A family recipe, jarred with love</h1>
          <div className="mt-5 h-[2px] w-12 bg-burgundy" />
          <div className="mt-6 space-y-4 text-[17px] leading-8 text-ink/80">
            <p>
              Bisbas started in a home kitchen — a sauce that sat on the table at every gathering,
              passed around until the jar was empty. The recipe blends Mediterranean brightness
              with East African heat: herbs, garlic, chili, and the kind of flavor people ask for
              by name.
            </p>
            <p>
              We still make it the same way. Two jars, two heats, one promise: you&apos;re going to
              want it on everything. Breakfast eggs. Grilled fish. Roasted vegetables. A spoon
              straight from the jar, if we&apos;re honest.
            </p>
            <p className="font-script text-2xl text-ink">Can&apos;t get enough.</p>
          </div>
        </div>
        <div className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-[2rem] bg-hero">
          <Image
            src="/images/jars.jpg"
            alt="Jars of Original and Spicy Bisbas sauce with fresh ingredients"
            fill
            className="object-contain"
            sizes="(min-width: 1024px) 28vw, 90vw"
          />
        </div>
      </div>
    </section>
  );
}
