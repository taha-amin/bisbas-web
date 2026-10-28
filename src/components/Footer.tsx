import { InstagramLink } from "./InstagramLink";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="bg-paper">
      <div className="mx-auto flex max-w-6xl flex-col items-center px-6 py-10">
        <div className="mb-6">
          <Logo compact />
        </div>
        <div className="mb-5">
          <InstagramLink variant="text" />
        </div>
        <p className="flex items-center gap-4 text-sm tracking-wide text-ink/70">
          <span className="h-px w-16 bg-burgundy/70" />
          #CantGetEnough
          <span className="h-px w-16 bg-burgundy/70" />
        </p>
      </div>
      <div className="h-3 bg-burgundy" />
    </footer>
  );
}
