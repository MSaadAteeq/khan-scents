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

function formatItems(order) {
  const items = Array.isArray(order.items) ? order.items : [];
  if (!items.length) return "—";
  return items
    .map((item) => `${item.name} × ${item.quantity} — PKR ${(item.price * item.quantity).toLocaleString()}`)
    .join("\n");
}

function formatItemsHtml(order) {
  const items = Array.isArray(order.items) ? order.items : [];
  if (!items.length) return "<p>—</p>";
  return `<ul style="padding-left:18px;">${items
    .map(
      (item) =>
        `<li>${item.name} × ${item.quantity} — PKR ${(item.price * item.quantity).toLocaleString()}</li>`,
    )
    .join("")}</ul>`;
}

function shopReplyTo() {
  return process.env.ADMIN_EMAIL?.trim() || "khanscentsofficial@gmail.com";
}

async function sendEmail({ to, subject, text, html, replyTo }) {
  const resend = getResend();
  const from = process.env.RESEND_FROM || "Khan Scents Official <orders@khanscents.shop>";
  const reply = replyTo || shopReplyTo();

  if (!resend) {
    console.log(`[email skipped — RESEND_API_KEY not set] ${subject}`);
    return { ok: false, reason: "RESEND_API_KEY not configured" };
  }

  try {
    const { data, error } = await resend.emails.send({
      from,
      to,
      subject,
      text,
      html,
      ...(reply ? { replyTo: reply } : {}),
    });

    if (error) {
      console.error(`Resend email failed (${maskEmail(to)}):`, error.message || error);
      return { ok: false, reason: error.message || "Send failed" };
    }

    console.log(`Email sent (${maskEmail(to)}) — id: ${data?.id}`);
    return { ok: true, id: data?.id };
  } catch (err) {
    console.error(`Resend email threw (${maskEmail(to)}):`, err.message || err);
    return { ok: false, reason: err.message || "Send failed" };
  }
}

function buildEmailContent(order, status) {
  const o = normalizeOrder(order);
  const orderId = o.orderId || o.id;
  const label = STATUS_LABELS[status] || status;
  const message = STATUS_MESSAGES[status] || `Your order status is now: ${status}.`;
  const total = o.total?.toLocaleString?.() ?? o.total;
  const itemsText = formatItems(o);
  const address = [o.customer.address, o.customer.city, o.customer.postalCode].filter(Boolean).join(", ");

  const subject = `Khan Scents — Order ${orderId} ${label}`;
  const text = [
    `Hi ${o.customer.fullName},`,
    "",
    message,
    "",
    `Order ID: ${orderId}`,
    `Status: ${status}`,
    `Phone: ${o.customer.phone || "—"}`,
    `Ship to: ${address}`,
    `Items:\n${itemsText}`,
    `Delivery: PKR ${o.deliveryFee?.toLocaleString?.() ?? o.deliveryFee ?? 0}`,
    `Payment: ${o.paymentMethod}`,
    `Total: PKR ${total}`,
    "",
    `Questions? Reply to this email — it goes to ${shopReplyTo()}.`,
    "You can also track this order in your Khan Scents account (same email).",
    "",
    "Your personal details are kept private and used only for this order.",
    "",
    "— Khan Scents Official",
  ].join("\n");

  const html = `
    <div style="font-family: sans-serif; max-width: 520px; color: #141414; line-height: 1.6;">
      <p>Hi ${o.customer.fullName},</p>
      <p>${message}</p>
      <table style="margin: 24px 0; border-collapse: collapse; width: 100%;">
        <tr><td style="padding: 8px 0; color: #6d6d6d;">Order ID</td><td style="padding: 8px 0;"><strong>${orderId}</strong></td></tr>
        <tr><td style="padding: 8px 0; color: #6d6d6d;">Status</td><td style="padding: 8px 0; text-transform: capitalize;"><strong>${status}</strong></td></tr>
        <tr><td style="padding: 8px 0; color: #6d6d6d;">Phone</td><td style="padding: 8px 0;">${o.customer.phone || "—"}</td></tr>
        <tr><td style="padding: 8px 0; color: #6d6d6d;">Ship to</td><td style="padding: 8px 0;">${address}</td></tr>
        <tr><td style="padding: 8px 0; color: #6d6d6d; vertical-align: top;">Items</td><td style="padding: 8px 0;">${formatItemsHtml(o)}</td></tr>
        <tr><td style="padding: 8px 0; color: #6d6d6d;">Delivery</td><td style="padding: 8px 0;">PKR ${o.deliveryFee?.toLocaleString?.() ?? o.deliveryFee ?? 0}</td></tr>
        <tr><td style="padding: 8px 0; color: #6d6d6d;">Payment</td><td style="padding: 8px 0;">${o.paymentMethod}</td></tr>
        <tr><td style="padding: 8px 0; color: #6d6d6d;">Total</td><td style="padding: 8px 0;"><strong>PKR ${total}</strong></td></tr>
      </table>
      <p style="color: #6d6d6d; font-size: 14px;">Questions? Reply to this email — it goes to ${shopReplyTo()}.</p>
      <p style="color: #6d6d6d; font-size: 14px;">Track this same order in your Khan Scents account using this email address.</p>
      <p style="color: #6d6d6d; font-size: 12px;">Your personal details are kept private and used only for this order.</p>
      <p>— Khan Scents Official</p>
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
  let adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  if (!adminEmail) {
    try {
      const { getSiteDoc } = await import("../models/Site.js");
      const site = await getSiteDoc();
      adminEmail = site.site?.email?.trim().toLowerCase() || "";
    } catch {
      adminEmail = "";
    }
  }
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
    `Items:\n${formatItems(o)}`,
    `Total: PKR ${o.total?.toLocaleString?.() ?? o.total}`,
    `Payment: ${o.paymentMethod}`,
    "",
    "Open the admin Orders page to confirm, ship, or cancel this order.",
  ].join("\n");

  const html = `
    <div style="font-family: sans-serif; max-width: 520px; line-height: 1.6;">
      <h2>New order received</h2>
      <p><strong>${orderId}</strong></p>
      <p>${o.customer.fullName}<br>${o.customer.phone}<br>${o.customer.email || ""}</p>
      <p>${o.customer.address}, ${o.customer.city}</p>
      ${formatItemsHtml(o)}
      <p><strong>PKR ${o.total?.toLocaleString?.() ?? o.total}</strong> · ${o.paymentMethod}</p>
      <p>Open the admin Orders page to update status. The customer is emailed when status changes.</p>
    </div>
  `;

  return sendEmail({
    to: adminEmail,
    subject,
    text,
    html,
    replyTo: o.customer.email || shopReplyTo(),
  });
}
