import { InstagramLink } from "@/components/InstagramLink";
import { INSTAGRAM_HANDLE } from "@/lib/social";

export default function ContactPage() {
  return (
    <section className="bg-paper">
      <div className="mx-auto max-w-xl px-6 py-16 text-center">
        <h1 className="font-display text-4xl sm:text-5xl">Contact</h1>
        <div className="mx-auto mt-4 h-[2px] w-10 bg-burgundy" />
        <p className="mt-5 text-ink/70">
          Catering, wholesale, or just craving a jar? Reach out on Instagram at{" "}
          {INSTAGRAM_HANDLE} — that&apos;s the best way to get in touch.
        </p>
        <div className="flex justify-center">
          <InstagramLink variant="button" buttonLabel={`MESSAGE ${INSTAGRAM_HANDLE}`} />
        </div>
      </div>
    </section>
  );
}
