"use client";

import { FormEvent, useState } from "react";

export default function ContactPage() {
  const [sent, setSent] = useState(false);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSent(true);
  }

  return (
    <section className="bg-paper">
      <div className="mx-auto max-w-xl px-6 py-16">
        <h1 className="font-display text-center text-4xl sm:text-5xl">Contact</h1>
        <div className="mx-auto mt-4 h-[2px] w-10 bg-burgundy" />
        <p className="mt-5 text-center text-ink/70">
          Catering, wholesale, or just craving a jar? Send a note — we&apos;d love to hear from you.
        </p>
        {sent ? (
          <p className="mt-10 rounded-2xl bg-hero px-6 py-8 text-center">
            Thanks — we&apos;ll be in touch soon.
          </p>
        ) : (
          <form onSubmit={onSubmit} className="mt-10 space-y-4">
            <input className="field" name="name" placeholder="Name" required />
            <input className="field" name="email" type="email" placeholder="Email" required />
            <textarea
              className="field min-h-36"
              name="message"
              placeholder="How can we help?"
              required
            />
            <button type="submit" className="btn-primary w-full">
              SEND MESSAGE
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
