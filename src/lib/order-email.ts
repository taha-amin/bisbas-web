import type Stripe from "stripe";

export type OrderEmail = {
  sessionId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: { name: string; quantity: number; amount: number }[];
  subtotal: number;
  shipping: number;
  total: number;
  shippingName: string;
  shippingLines: string[];
};

function dollars(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function formatAddress(address?: Stripe.Address | null) {
  if (!address) return [];
  return [
    address.line1,
    address.line2,
    [address.city, address.state, address.postal_code].filter(Boolean).join(", "),
    address.country,
  ].filter((line): line is string => Boolean(line?.trim()));
}

function shippingFrom(session: Stripe.Checkout.Session) {
  return session.collected_information?.shipping_details ?? null;
}

export function orderFromSession(
  session: Stripe.Checkout.Session,
  lineItems: Stripe.LineItem[],
): OrderEmail {
  const shipping = shippingFrom(session);
  const customer = session.customer_details;
  const shippingCents =
    session.total_details?.amount_shipping ??
    Math.max((session.amount_total ?? 0) - (session.amount_subtotal ?? 0), 0);

  return {
    sessionId: session.id,
    customerName: customer?.name || shipping?.name || "Customer",
    customerEmail: customer?.email || session.customer_email || "",
    customerPhone: customer?.phone || "",
    items: lineItems.map((item) => ({
      name: item.description || "Bisbas sauce",
      quantity: item.quantity ?? 1,
      amount: item.amount_total ?? 0,
    })),
    subtotal: session.amount_subtotal ?? 0,
    shipping: shippingCents,
    total: session.amount_total ?? 0,
    shippingName: shipping?.name || customer?.name || "",
    shippingLines: formatAddress(shipping?.address ?? customer?.address),
  };
}

function itemRows(order: OrderEmail) {
  return order.items
    .map(
      (item) =>
        `<tr>
          <td style="padding:8px 0;border-bottom:1px solid #eee;">${escapeHtml(item.name)} × ${item.quantity}</td>
          <td style="padding:8px 0;border-bottom:1px solid #eee;text-align:right;">${dollars(item.amount)}</td>
        </tr>`,
    )
    .join("");
}

function wrap(title: string, body: string) {
  return `<!doctype html>
<html>
  <body style="margin:0;padding:24px;background:#f7f1e8;font-family:Georgia,serif;color:#1a1512;">
    <div style="max-width:560px;margin:0 auto;background:#fff;padding:28px;border-radius:16px;">
      <p style="margin:0 0 4px;color:#8b1e2d;letter-spacing:.18em;font-size:11px;text-transform:uppercase;">Bisbas</p>
      <h1 style="margin:0 0 20px;font-size:28px;">${title}</h1>
      ${body}
    </div>
  </body>
</html>`;
}

export function shopOwnerEmail(order: OrderEmail) {
  const ship = [order.shippingName, ...order.shippingLines].filter(Boolean).join("<br>");
  const html = wrap(
    "New Bisbas order",
    `<p style="margin:0 0 16px;">A customer paid. Pack and ship this order.</p>
      <table style="width:100%;border-collapse:collapse;font-size:15px;">${itemRows(order)}
        <tr><td style="padding:10px 0;">Subtotal</td><td style="text-align:right;">${dollars(order.subtotal)}</td></tr>
        <tr><td style="padding:4px 0;">Shipping</td><td style="text-align:right;">${dollars(order.shipping)}</td></tr>
        <tr><td style="padding:10px 0;font-weight:700;">Total</td><td style="text-align:right;font-weight:700;">${dollars(order.total)}</td></tr>
      </table>
      <h2 style="margin:24px 0 8px;font-size:18px;">Ship to</h2>
      <p style="margin:0;line-height:1.5;">${ship || "No shipping address"}</p>
      <h2 style="margin:24px 0 8px;font-size:18px;">Customer</h2>
      <p style="margin:0;line-height:1.5;">
        ${escapeHtml(order.customerName)}<br>
        ${escapeHtml(order.customerEmail)}<br>
        ${escapeHtml(order.customerPhone)}
      </p>
      <p style="margin:20px 0 0;font-size:13px;color:#666;">Stripe session ${escapeHtml(order.sessionId)}</p>`,
  );

  return {
    subject: `New Bisbas order · ${dollars(order.total)}`,
    html,
  };
}

export function customerEmail(order: OrderEmail) {
  const ship = [order.shippingName, ...order.shippingLines].filter(Boolean).join("<br>");
  const html = wrap(
    "We got your order",
    `<p style="margin:0 0 16px;">Thank you, ${escapeHtml(order.customerName.split(" ")[0] || "friend")}. Your Bisbas is paid for and we’ll pack it soon.</p>
      <table style="width:100%;border-collapse:collapse;font-size:15px;">${itemRows(order)}
        <tr><td style="padding:10px 0;">Subtotal</td><td style="text-align:right;">${dollars(order.subtotal)}</td></tr>
        <tr><td style="padding:4px 0;">Shipping</td><td style="text-align:right;">${dollars(order.shipping)}</td></tr>
        <tr><td style="padding:10px 0;font-weight:700;">Total paid</td><td style="text-align:right;font-weight:700;">${dollars(order.total)}</td></tr>
      </table>
      <h2 style="margin:24px 0 8px;font-size:18px;">Shipping to</h2>
      <p style="margin:0;line-height:1.5;">${ship || "We’ll use the address from checkout."}</p>
      <p style="margin:20px 0 0;font-size:14px;color:#444;">Questions? Message <a href="https://www.instagram.com/bisbaspdx/" style="color:#8b1e2d;">@bisbaspdx</a> on Instagram.</p>`,
  );

  return {
    subject: "Your Bisbas order is confirmed",
    html,
  };
}

export async function sendMail(to: string, subject: string, html: string) {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.ORDER_FROM_EMAIL || "Bisbas <onboarding@resend.dev>";
  if (!key || !to) return false;

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from, to, subject, html }),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Could not send email: ${detail}`);
  }

  return true;
}
