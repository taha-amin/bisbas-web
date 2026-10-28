import { INSTAGRAM_HANDLE, INSTAGRAM_URL } from "@/lib/social";

export function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <rect
        x="3.5"
        y="3.5"
        width="17"
        height="17"
        rx="5"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <circle cx="12" cy="12" r="3.6" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="17.2" cy="6.8" r="1" fill="currentColor" />
    </svg>
  );
}

export function InstagramLink({
  variant = "icon",
  buttonLabel,
}: {
  variant?: "icon" | "text" | "button";
  buttonLabel?: string;
}) {
  const label = `Bisbas on Instagram, ${INSTAGRAM_HANDLE}`;

  if (variant === "text") {
    return (
      <a
        href={INSTAGRAM_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 text-ink/80 transition hover:text-burgundy"
      >
        <InstagramIcon />
        <span>{INSTAGRAM_HANDLE}</span>
      </a>
    );
  }

  if (variant === "button") {
    return (
      <a
        href={INSTAGRAM_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-primary mt-8"
      >
        {buttonLabel ?? `FOLLOW ${INSTAGRAM_HANDLE}`}
      </a>
    );
  }

  return (
    <a
      href={INSTAGRAM_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="rounded-full p-2 text-ink transition hover:bg-black/5 hover:text-burgundy"
      aria-label={label}
    >
      <InstagramIcon />
    </a>
  );
}
