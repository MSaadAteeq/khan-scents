import { Order } from "../models/Order.js";

/** Attach guest orders with this email to the customer's account. */
export async function attachOrdersToUser(user) {
  if (!user?._id || user.role === "admin") return;
  const email = String(user.email || "").trim().toLowerCase();
  if (!email) return;
  await Order.updateMany(
    {
      "customer.email": email,
      $or: [{ userId: null }, { userId: { $exists: false } }],
    },
    { $set: { userId: user._id } },
  );
}
