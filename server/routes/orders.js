import { Router } from "express";
import { Order, formatOrder } from "../models/Order.js";
import { requireAuth, optionalAuth } from "../middleware/auth.js";
import { sendOrderPlacedEmail } from "../lib/email.js";

const router = Router();

router.post("/", optionalAuth, async (req, res) => {
  const { customer, items, deliveryFee, total, paymentMethod } = req.body || {};

  if (!customer || !customer.fullName || !customer.phone || !customer.address || !customer.city) {
    return res.status(400).json({ error: "Missing required customer details." });
  }

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: "Order must contain at least one item." });
  }

  const fee = deliveryFee ?? 300;
  const orderId = `KS-${Date.now()}`;

  const order = await Order.create({
    orderId,
    userId: req.user?._id || null,
    customer: {
      fullName: customer.fullName,
      phone: customer.phone,
      email: customer.email || req.user?.email || "",
      address: customer.address,
      city: customer.city,
      postalCode: customer.postalCode || "",
    },
    items,
    deliveryFee: fee,
    total: total ?? items.reduce((sum, it) => sum + it.price * it.quantity, 0) + fee,
    paymentMethod: paymentMethod || "Cash on Delivery",
    status: "pending",
  });

  sendOrderPlacedEmail(order).catch((err) => console.error("Order email failed:", err.message));

  res.status(201).json(formatOrder(order));
});

router.get("/mine", requireAuth, async (req, res) => {
  const orders = await Order.find({ userId: req.user._id }).sort({ createdAt: -1 });
  res.json(orders.map(formatOrder));
});

export default router;
