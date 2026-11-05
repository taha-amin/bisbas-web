import Stripe from "stripe";
import { US_SHIPPING_CENTS } from "@/lib/commerce";
import { products, type SizeId } from "@/lib/products";
import { getStripe, productImageUrl, siteUrl } from "@/lib/stripe";

type CartPayloadItem = {
  productId: string;
  sizeId: SizeId;
  quantity: number;
};

export async function POST(request: Request) {
  let stripe: Stripe;
  try {
    stripe = getStripe();
  } catch (err) {
    return Response.json(
      { error: err instanceof Error ? err.message : "Stripe is not configured." },
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
  const summary: string[] = [];

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
    summary.push(`${product.id}:${size.id}x${quantity}`);
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

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items,
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout`,
      billing_address_collection: "required",
      phone_number_collection: { enabled: true },
      shipping_address_collection: {
        allowed_countries: ["US"],
      },
      shipping_options:
        US_SHIPPING_CENTS > 0
          ? [
              {
                shipping_rate_data: {
                  type: "fixed_amount",
                  fixed_amount: { amount: US_SHIPPING_CENTS, currency: "usd" },
                  display_name: "US shipping",
                  delivery_estimate: {
                    minimum: { unit: "business_day", value: 5 },
                    maximum: { unit: "business_day", value: 10 },
                  },
                },
              },
            ]
          : undefined,
      customer_creation: "always",
      payment_intent_data: {
        description: "Bisbas sauce order",
      },
      metadata: {
        source: "bisbas-web",
        items: summary.join(",").slice(0, 500),
      },
    });

    if (!session.url) {
      return Response.json({ error: "Could not start Stripe Checkout." }, { status: 500 });
    }

    return Response.json({ url: session.url });
  } catch (err) {
    const message =
      err instanceof Stripe.errors.StripeError
        ? err.message
        : "Could not start Stripe Checkout.";
    return Response.json({ error: message }, { status: 500 });
  }
}
