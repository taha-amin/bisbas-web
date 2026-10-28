import Image from "next/image";
import Link from "next/link";

export function Logo({
  compact = false,
  href = "/",
}: {
  compact?: boolean;
  href?: string;
}) {
  const box = compact
    ? "h-16 w-[132px] sm:h-[4.5rem] sm:w-[148px]"
    : "h-[5.75rem] w-[190px] sm:h-[6.75rem] sm:w-[220px]";

  return (
    <Link
      href={href}
      className={`relative inline-block ${box}`}
      aria-label="Bisbas home"
    >
      <Image
        src="/images/logo.png"
        alt="Bisbas — Can't get enough, made with love"
        fill
        priority={!compact}
        className="object-contain object-left"
        sizes="220px"
      />
    </Link>
  );
}
