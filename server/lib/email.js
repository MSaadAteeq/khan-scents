import { Resend } from "resend";

const STATUS_LABELS = {
  pending: "received",
  confirmed: "confirmed",
  shipped: "shipped",
  delivered: "delivered",
  cancelled: "cancelled",
};

const STATUS_MESSAGES = {
  pending:
    "Thank you for your order! We have received it and will confirm it shortly.",
  confirmed:
    "Great news — your order has been confirmed and is being prepared for dispatch.",
  shipped:
    "Your order is on its way! It should arrive within a few working days.",
  delivered:
    "Your order has been delivered. We hope you love your new fragrance!",
  cancelled:
    "Your order has been cancelled. If you have questions, please contact us.",
};

function getResend() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;
  return new Resend(apiKey);
}

function buildEmailContent(order, status) {
  const orderId = order.orderId || order.id;
  const label = STATUS_LABELS[status] || status;
  const message = STATUS_MESSAGES[status] || `Your order status is now: ${status}.`;
  const total = order.total?.toLocaleString?.() ?? order.total;

  const subject = `Khan Scents — Order ${orderId} ${label}`;
  const text = [
    `Hi ${order.customer.fullName},`,
    "",
    message,
    "",
    `Order ID: ${orderId}`,
    `Status: ${status}`,
    `Total: PKR ${total}`,
    "",
    "Questions? Reply to this email or message us on WhatsApp.",
    "",
    "— Khan Scents",
  ].join("\n");

  const html = `
    <div style="font-family: sans-serif; max-width: 520px; color: #141414; line-height: 1.6;">
      <p>Hi ${order.customer.fullName},</p>
      <p>${message}</p>
      <table style="margin: 24px 0; border-collapse: collapse; width: 100%;">
        <tr><td style="padding: 8px 0; color: #6d6d6d;">Order ID</td><td style="padding: 8px 0;"><strong>${orderId}</strong></td></tr>
        <tr><td style="padding: 8px 0; color: #6d6d6d;">Status</td><td style="padding: 8px 0; text-transform: capitalize;"><strong>${status}</strong></td></tr>
        <tr><td style="padding: 8px 0; color: #6d6d6d;">Total</td><td style="padding: 8px 0;"><strong>PKR ${total}</strong></td></tr>
      </table>
      <p style="color: #6d6d6d; font-size: 14px;">Questions? Reply to this email or message us on WhatsApp.</p>
      <p>— Khan Scents</p>
    </div>
  `;

  return { subject, text, html };
}

export async function sendOrderStatusEmail(order, status) {
  const to = order.customer?.email?.trim();
  if (!to) return;

  const resend = getResend();
  const { subject, text, html } = buildEmailContent(order, status);
  const from = process.env.RESEND_FROM || "Khan Scents <onboarding@resend.dev>";

  if (!resend) {
    console.log(`[email skipped — RESEND_API_KEY not set] To: ${to} | ${subject}`);
    return;
  }

  const { data, error } = await resend.emails.send({
    from,
    to,
    subject,
    text,
    html,
  });

  if (error) {
    console.error(`Resend email failed (${status}) → ${to}:`, error.message);
    if (error.message?.includes("403") || error.message?.includes("own email")) {
      console.error(
        "Tip: Without a verified domain, Resend only sends to your Resend account email via onboarding@resend.dev.",
      );
    }
    return;
  }

  console.log(`Order email sent to ${to} (${status}) — id: ${data?.id}`);
}

export async function sendOrderPlacedEmail(order) {
  await sendOrderStatusEmail(order, "pending");
}
