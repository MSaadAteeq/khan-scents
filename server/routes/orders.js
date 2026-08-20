import { Router } from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ORDERS_FILE = path.join(__dirname, "..", "data", "orders.json");

const router = Router();

function readOrders() {
  try {
    const raw = fs.readFileSync(ORDERS_FILE, "utf-8");
    return JSON.parse(raw || "[]");
  } catch {
    return [];
  }
}

function writeOrders(orders) {
  fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2), "utf-8");
}

router.get("/", (_req, res) => {
  res.json(readOrders());
});

router.post("/", (req, res) => {
  const { customer, items, deliveryFee, total, paymentMethod } = req.body || {};

  if (!customer || !customer.fullName || !customer.phone || !customer.address || !customer.city) {
    return res.status(400).json({ error: "Missing required customer details." });
  }

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: "Order must contain at least one item." });
  }

  const orders = readOrders();

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
    deliveryFee: deliveryFee ?? 300,
    total: total ?? items.reduce((sum, it) => sum + it.price * it.quantity, 0) + (deliveryFee ?? 300),
    paymentMethod: paymentMethod || "Cash on Delivery",
    status: "pending",
    createdAt: new Date().toISOString(),
  };

  orders.push(newOrder);
  writeOrders(orders);

  res.status(201).json(newOrder);
});

export default router;
