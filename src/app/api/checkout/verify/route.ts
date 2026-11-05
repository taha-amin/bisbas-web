import { getStripe } from "@/lib/stripe";

export async function GET(request: Request) {
  const sessionId = new URL(request.url).searchParams.get("session_id") ?? "";
  if (!sessionId.startsWith("cs_")) {
    return Response.json({ paid: false }, { status: 400 });
  }

  try {
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    return Response.json({
      paid: session.payment_status === "paid",
    });
  } catch {
    return Response.json({ paid: false }, { status: 400 });
  }
}
