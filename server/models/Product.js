import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    inspiredBy: { type: String, default: "" },
    size: { type: String, default: "50 mL / 1.7 FL. OZ." },
    price: { type: Number, required: true },
    gender: { type: String, enum: ["him", "her", "unisex"], default: "unisex" },
    notes: [{ type: String }],
    longevity: { type: String, default: "" },
    howToUse: { type: String, default: "" },
    images: [{ type: String }],
    bestSeller: { type: Boolean, default: false },
    description: { type: String, default: "" },
  },
  { timestamps: true },
);

export const Product = mongoose.model("Product", productSchema);

export function formatProduct(doc) {
  const p = doc.toObject ? doc.toObject() : doc;
  return {
    id: p._id.toString(),
    slug: p.slug,
    name: p.name,
    inspiredBy: p.inspiredBy,
    size: p.size,
    price: p.price,
    gender: p.gender,
    notes: p.notes,
    longevity: p.longevity,
    howToUse: p.howToUse,
    images: p.images,
    bestSeller: p.bestSeller,
    description: p.description,
  };
}
