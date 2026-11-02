import Stripe from "stripe";
import { products, type SizeId } from "@/lib/products";

type CartPayloadItem = {
  productId: string;
  sizeId: SizeId;
  quantity: number;
};

function siteUrl(request: Request) {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (fromEnv) return fromEnv;
  const origin = request.headers.get("origin");
  if (origin) return origin;
  const host = request.headers.get("host");
  const proto = request.headers.get("x-forwarded-proto") ?? "http";
  return host ? `${proto}://${host}` : "http://localhost:3000";
}

function productImageUrl(base: string, path: string) {
  if (base.includes("localhost") || base.includes("127.0.0.1")) return undefined;
  return `${base}${path}`;
}

export async function POST(request: Request) {
  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) {
    return Response.json(
      { error: "Stripe is not configured. Add STRIPE_SECRET_KEY to the environment." },
      { status: 500 },
    );
  }

  let body: { items?: CartPayloadItem[] };
  try {
    body = (await request.json()) as { items?: CartPayloadItem[] };
  } catch {
    return Response.json({ error: "Invalid checkout request." }, { status: 400 });
  }

  const items = body.items ?? [];
  if (!Array.isArray(items) || items.length === 0) {
    return Response.json({ error: "Your cart is empty." }, { status: 400 });
  }

  const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
  const origin = siteUrl(request);

  for (const item of items) {
    const quantity = Math.floor(Number(item.quantity));
    if (!Number.isFinite(quantity) || quantity < 1 || quantity > 20) {
      return Response.json({ error: "Invalid quantity." }, { status: 400 });
    }

    const product = products.find((entry) => entry.id === item.productId);
    const size = product?.sizes.find((entry) => entry.id === item.sizeId);
    if (!product || !size) {
      return Response.json({ error: "A cart item is no longer available." }, { status: 400 });
    }

    const image = productImageUrl(origin, size.image);
    line_items.push({
      quantity,
      price_data: {
        currency: "usd",
        unit_amount: size.price * 100,
        product_data: {
          name: `${product.name} — ${size.format} ${size.label}`,
          description: `${product.color} · ${product.heat}`,
          ...(image ? { images: [image] } : {}),
        },
      },
    });
  }

  const stripe = new Stripe(secret);
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items,
    success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/checkout`,
    billing_address_collection: "required",
    shipping_address_collection: {
      allowed_countries: ["US"],
    },
    phone_number_collection: { enabled: true },
    metadata: {
      source: "bisbas-web",
    },
  });

  if (!session.url) {
    return Response.json({ error: "Could not start Stripe Checkout." }, { status: 500 });
  }

  return Response.json({ url: session.url });
}
