import Stripe from "stripe";
import {
  customerEmail,
  orderFromSession,
  sendMail,
  shopOwnerEmail,
} from "@/lib/order-email";
import { getStripe } from "@/lib/stripe";

export async function POST(request: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    return Response.json({ error: "STRIPE_WEBHOOK_SECRET is not set." }, { status: 500 });
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return Response.json({ error: "Missing Stripe signature." }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    const stripe = getStripe();
    event = stripe.webhooks.constructEvent(await request.text(), signature, secret);
  } catch {
    return Response.json({ error: "Invalid Stripe signature." }, { status: 400 });
  }

  if (event.type !== "checkout.session.completed") {
    return Response.json({ received: true });
  }

  const session = event.data.object as Stripe.Checkout.Session;
  if (session.payment_status !== "paid") {
    return Response.json({ received: true, skipped: "unpaid" });
  }

  const stripe = getStripe();
  const full = await stripe.checkout.sessions.retrieve(session.id, {
    expand: ["line_items", "payment_intent"],
  });
  const lineItems = full.line_items?.data ?? [];
  const order = orderFromSession(full, lineItems);

  const paymentIntent = full.payment_intent;
  if (
    order.customerEmail &&
    paymentIntent &&
    typeof paymentIntent !== "string" &&
    !paymentIntent.receipt_email
  ) {
    await stripe.paymentIntents.update(paymentIntent.id, {
      receipt_email: order.customerEmail,
    });
  }

  const shopTo = process.env.ORDER_NOTIFICATION_EMAIL;
  if (shopTo) {
    const mail = shopOwnerEmail(order);
    await sendMail(shopTo, mail.subject, mail.html);
  }

  if (order.customerEmail) {
    const mail = customerEmail(order);
    await sendMail(order.customerEmail, mail.subject, mail.html);
  }

  return Response.json({ received: true });
}
