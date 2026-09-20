import { Router } from "express";
import { Order, formatOrder } from "../models/Order.js";
import { requireAuth, optionalAuth } from "../middleware/auth.js";
import { sendOrderPlacedEmail, sendAdminNewOrderEmail } from "../lib/email.js";
import { formatOrderPublic } from "../lib/privacy.js";

const router = Router();

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

router.post("/", optionalAuth, async (req, res) => {
  const { customer, items, deliveryFee, total, paymentMethod } = req.body || {};

  if (!customer || !customer.fullName || !customer.phone || !customer.address || !customer.city) {
    return res.status(400).json({ error: "Missing required customer details." });
  }

  // Guests: only the email they enter at checkout. Signed-in users may fall back to account email.
  const rawEmail = req.user
    ? customer.email || req.user.email
    : customer.email;

  const email = rawEmail?.trim().toLowerCase() || "";
  if (!email) {
    return res.status(400).json({ error: "Email is required for order confirmation." });
  }
  if (!isValidEmail(email)) {
    return res.status(400).json({ error: "Please enter a valid email address." });
  }

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: "Order must contain at least one item." });
  }

  const fee = deliveryFee ?? 300;
  const orderId = `KS-${Date.now()}`;

  // Link order to account only when the customer is signed in — never attach guest orders to another user's account by email alone.
  const userId = req.user?._id || null;

  const order = await Order.create({
    orderId,
    userId,
    customer: {
      fullName: customer.fullName.trim(),
      phone: customer.phone.trim(),
      email,
      address: customer.address.trim(),
      city: customer.city.trim(),
      postalCode: customer.postalCode?.trim() || "",
    },
    items,
    deliveryFee: fee,
    total: total ?? items.reduce((sum, it) => sum + it.price * it.quantity, 0) + fee,
    paymentMethod: paymentMethod || "Cash on Delivery",
    status: "pending",
  });

  const customerEmail = await sendOrderPlacedEmail(order);
  await sendAdminNewOrderEmail(order);

  res.status(201).json(formatOrderPublic(order, { emailSent: customerEmail.ok }));
});

router.get("/mine", requireAuth, async (req, res) => {
  const userEmail = req.user.email.toLowerCase();
  const orders = await Order.find({
    $or: [{ userId: req.user._id }, { userId: null, "customer.email": userEmail }],
  }).sort({ createdAt: -1 });

  // Return only this user's orders — strip other customers' data if any edge case
  res.json(
    orders.map((o) => {
      const formatted = formatOrder(o);
      if (formatted.customer?.email?.toLowerCase() !== userEmail && String(o.userId) !== String(req.user._id)) {
        return null;
      }
      return formatted;
    }).filter(Boolean),
  );
});

export default router;
