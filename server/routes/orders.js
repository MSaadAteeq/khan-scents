import { Router } from "express";
import { getOrders, saveOrders } from "../lib/seed.js";

const router = Router();

router.post("/", (req, res) => {
  const { customer, items, deliveryFee, total, paymentMethod } = req.body || {};

  if (!customer || !customer.fullName || !customer.phone || !customer.address || !customer.city) {
    return res.status(400).json({ error: "Missing required customer details." });
  }

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: "Order must contain at least one item." });
  }

  const orders = getOrders();
  const fee = deliveryFee ?? 300;

  const newOrder = {
    id: `KS-${Date.now()}`,
    customer: {
      fullName: customer.fullName,
      phone: customer.phone,
      email: customer.email || "",
      address: customer.address,
      city: customer.city,
      postalCode: customer.postalCode || "",
    },
    items,
    deliveryFee: fee,
    total: total ?? items.reduce((sum, it) => sum + it.price * it.quantity, 0) + fee,
    paymentMethod: paymentMethod || "Cash on Delivery",
    status: "pending",
    createdAt: new Date().toISOString(),
  };

  orders.unshift(newOrder);
  saveOrders(orders);

  res.status(201).json(newOrder);
});

export default router;
