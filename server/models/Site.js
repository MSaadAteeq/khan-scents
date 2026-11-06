import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
    city: { type: String, default: "" },
    rating: { type: Number, min: 1, max: 5, default: 5 },
    text: { type: String, required: true },
  },
  { _id: false },
);

const faqSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    question: { type: String, required: true },
    answer: { type: String, required: true },
  },
  { _id: false },
);

const siteSchema = new mongoose.Schema(
  {
    key: { type: String, default: "main", unique: true },
    site: {
      name: { type: String, default: "Khan Scents" },
      tagline: { type: String, default: "Find Your Signature Scent" },
      whatsapp: { type: String, default: "923122909152" },
      whatsappDisplay: { type: String, default: "+92 312 2909152" },
      email: { type: String, default: "khanscentsofficial@gmail.com" },
      phone: { type: String, default: "+92 312 2909152" },
      instagram: { type: String, default: "https://instagram.com/khanscents" },
      facebook: { type: String, default: "https://facebook.com/khanscents" },
      deliveryFee: { type: Number, default: 300 },
      address: { type: String, default: "Pakistan — Nationwide Delivery" },
      heroVideo: {
        type: String,
        default: "https://assets.mixkit.co/videos/20766/20766-720.mp4",
      },
      heroPoster: {
        type: String,
        default: "https://assets.mixkit.co/videos/20766/20766-thumb-720-0.jpg",
      },
    },
    reviews: [reviewSchema],
    faqs: [faqSchema],
  },
  { timestamps: true },
);

export const Site = mongoose.model("Site", siteSchema);

export async function getSiteDoc() {
  let doc = await Site.findOne({ key: "main" });
  if (!doc) {
    doc = await Site.create({ key: "main" });
  }
  return doc;
}

export function formatSite(doc) {
  const s = doc.toObject ? doc.toObject() : doc;
  return {
    site: s.site,
    reviews: s.reviews,
    faqs: s.faqs,
  };
}
