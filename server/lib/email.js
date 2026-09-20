import { Resend } from "resend";
import { maskEmail } from "./privacy.js";

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

function normalizeOrder(order) {
  return order?.toObject ? order.toObject() : order;
}

function getCustomerEmail(order) {
  const o = normalizeOrder(order);
  return o.customer?.email?.trim().toLowerCase() || "";
}

function getResend() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;
  return new Resend(apiKey);
}

async function sendEmail({ to, subject, text, html }) {
  const resend = getResend();
  const from = process.env.RESEND_FROM || "Khan Scents <onboarding@resend.dev>";

  if (!resend) {
    console.log(`[email skipped — RESEND_API_KEY not set] ${subject}`);
    return { ok: false, reason: "RESEND_API_KEY not configured" };
  }

  const { data, error } = await resend.emails.send({ from, to, subject, text, html });

  if (error) {
    console.error(`Resend email failed (${maskEmail(to)}):`, error.message || error);
    return { ok: false, reason: error.message || "Send failed" };
  }

  console.log(`Email sent (${maskEmail(to)}) — id: ${data?.id}`);
  return { ok: true, id: data?.id };
}

function buildEmailContent(order, status) {
  const o = normalizeOrder(order);
  const orderId = o.orderId || o.id;
  const label = STATUS_LABELS[status] || status;
  const message = STATUS_MESSAGES[status] || `Your order status is now: ${status}.`;
  const total = o.total?.toLocaleString?.() ?? o.total;

  const subject = `Khan Scents — Order ${orderId} ${label}`;
  const text = [
    `Hi ${o.customer.fullName},`,
    "",
    message,
    "",
    `Order ID: ${orderId}`,
    `Status: ${status}`,
    `Total: PKR ${total}`,
    "",
    "Questions? Reply to this email or contact us through our website.",
    "",
    "Your personal details are kept private and used only for this order.",
    "",
    "— Khan Scents",
  ].join("\n");

  const html = `
    <div style="font-family: sans-serif; max-width: 520px; color: #141414; line-height: 1.6;">
      <p>Hi ${o.customer.fullName},</p>
      <p>${message}</p>
      <table style="margin: 24px 0; border-collapse: collapse; width: 100%;">
        <tr><td style="padding: 8px 0; color: #6d6d6d;">Order ID</td><td style="padding: 8px 0;"><strong>${orderId}</strong></td></tr>
        <tr><td style="padding: 8px 0; color: #6d6d6d;">Status</td><td style="padding: 8px 0; text-transform: capitalize;"><strong>${status}</strong></td></tr>
        <tr><td style="padding: 8px 0; color: #6d6d6d;">Total</td><td style="padding: 8px 0;"><strong>PKR ${total}</strong></td></tr>
      </table>
      <p style="color: #6d6d6d; font-size: 14px;">Questions? Reply to this email or contact us through our website.</p>
      <p style="color: #6d6d6d; font-size: 12px;">Your personal details are kept private and used only for this order.</p>
      <p>— Khan Scents</p>
    </div>
  `;

  return { subject, text, html };
}

export async function sendOrderStatusEmail(order, status) {
  const o = normalizeOrder(order);
  const to = getCustomerEmail(o);
  if (!to) {
    console.warn(`[email skipped] No customer email on order ${o.orderId || o.id}`);
    return { ok: false, reason: "No customer email" };
  }

  const { subject, text, html } = buildEmailContent(o, status);
  const result = await sendEmail({ to, subject, text, html });

  if (!result.ok && result.reason?.includes("403")) {
    console.error(
      "Resend blocked this recipient. Verify a domain at resend.com/domains and update RESEND_FROM to send to any customer email.",
    );
  }

  return result;
}

export async function sendOrderPlacedEmail(order) {
  return sendOrderStatusEmail(order, "pending");
}

export async function sendAdminNewOrderEmail(order) {
  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  if (!adminEmail) return { ok: false, reason: "ADMIN_EMAIL not set" };

  const o = normalizeOrder(order);
  const orderId = o.orderId || o.id;
  const subject = `New order ${orderId} — ${o.customer.fullName}`;
  const text = [
    "New Khan Scents order placed.",
    "",
    `Order ID: ${orderId}`,
    `Customer: ${o.customer.fullName}`,
    `Phone: ${o.customer.phone}`,
    `Email: ${o.customer.email || "—"}`,
    `Address: ${o.customer.address}, ${o.customer.city}`,
    `Total: PKR ${o.total?.toLocaleString?.() ?? o.total}`,
    `Payment: ${o.paymentMethod}`,
    "",
    "Update status in the admin panel to notify the customer by email.",
  ].join("\n");

  const html = `
    <div style="font-family: sans-serif; max-width: 520px; line-height: 1.6;">
      <h2>New order received</h2>
      <p><strong>${orderId}</strong></p>
      <p>${o.customer.fullName}<br>${o.customer.phone}<br>${o.customer.email || ""}</p>
      <p>${o.customer.address}, ${o.customer.city}</p>
      <p><strong>PKR ${o.total?.toLocaleString?.() ?? o.total}</strong> · ${o.paymentMethod}</p>
    </div>
  `;

  return sendEmail({ to: adminEmail, subject, text, html });
}
