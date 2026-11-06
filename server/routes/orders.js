import { Router } from "express";
import { Order, formatOrder } from "../models/Order.js";
import { User } from "../models/User.js";
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

  let userId = req.user?.role === "admin" ? null : req.user?._id || null;
  if (!userId) {
    const existing = await User.findOne({ email, role: "user" }).select("_id");
    if (existing) userId = existing._id;
  }

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

  let customerEmail = { ok: false };
  try {
    customerEmail = await sendOrderPlacedEmail(order);
    await sendAdminNewOrderEmail(order);
  } catch (err) {
    console.error("Order email failed:", err.message || err);
  }

  res.status(201).json(formatOrderPublic(order, { emailSent: customerEmail.ok }));
});

router.get("/mine", requireAuth, async (req, res) => {
  const userEmail = req.user.email.toLowerCase();
  const orders = await Order.find({
    $or: [{ userId: req.user._id }, { "customer.email": userEmail }],
  }).sort({ createdAt: -1 });

  res.json(orders.map(formatOrder));
});

export default router;
