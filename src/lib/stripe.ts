import Stripe from "stripe";

export function getStripe() {
  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) {
    throw new Error("Stripe is not configured. Add STRIPE_SECRET_KEY to the environment.");
  }
  return new Stripe(secret);
}

export function siteUrl(request: Request) {
  const forwardedHost =
    request.headers.get("x-forwarded-host") ?? request.headers.get("host") ?? "";
  const host = forwardedHost.split(",")[0]?.trim();
  const isLocal = !host || host.startsWith("localhost") || host.startsWith("127.0.0.1");
  const proto =
    request.headers.get("x-forwarded-proto") ?? (isLocal ? "http" : "https");

  if (!isLocal) {
    return `${proto}://${host}`.replace(/\/$/, "");
  }

  return (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");
}

export function productImageUrl(base: string, path: string) {
  if (base.includes("localhost") || base.includes("127.0.0.1")) return undefined;
  return `${base}${path}`;
}
