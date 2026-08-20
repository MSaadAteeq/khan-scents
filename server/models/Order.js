import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    orderId: { type: String, required: true, unique: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    customer: {
      fullName: String,
      phone: String,
      email: String,
      address: String,
      city: String,
      postalCode: String,
    },
    items: [
      {
        slug: String,
        name: String,
        price: Number,
        quantity: Number,
      },
    ],
    deliveryFee: { type: Number, default: 300 },
    total: { type: Number, required: true },
    paymentMethod: { type: String, default: "Cash on Delivery" },
    status: {
      type: String,
      enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true },
);

export const Order = mongoose.model("Order", orderSchema);

export function formatOrder(doc) {
  const o = doc.toObject ? doc.toObject() : doc;
  return {
    id: o.orderId,
    userId: o.userId?.toString() || null,
    customer: o.customer,
    items: o.items,
    deliveryFee: o.deliveryFee,
    total: o.total,
    paymentMethod: o.paymentMethod,
    status: o.status,
    createdAt: o.createdAt?.toISOString?.() || o.createdAt,
  };
}
