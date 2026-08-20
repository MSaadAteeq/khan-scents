import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { products as seedProducts } from "../data/products.js";
import { productImages, imageFallback } from "../data/images.js";
import { Product, formatProduct } from "../models/Product.js";
import { Site, getSiteDoc, formatSite } from "../models/Site.js";
import { Order } from "../models/Order.js";
import { User } from "../models/User.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const DEFAULT_REVIEWS = [
  { id: "rev-1", name: "Ayesha K.", city: "Lahore", rating: 5, text: "Velvet Noir smells incredibly close to the original and lasts all evening. Packaging felt premium too." },
  { id: "rev-2", name: "Bilal R.", city: "Karachi", rating: 5, text: "Ordered Blue Intense — compliments everywhere I go. COD made it an easy first order." },
  { id: "rev-3", name: "Sana M.", city: "Islamabad", rating: 4, text: "Rose Absolu is gorgeous, soft and elegant. Delivery took 3 days, well packed and safe." },
  { id: "rev-4", name: "Hamza T.", city: "Faisalabad", rating: 5, text: "Amber Dusk has incredible longevity — genuinely lasted over 10 hours. Will be reordering." },
  { id: "rev-5", name: "Zara N.", city: "Multan", rating: 5, text: "Best value for luxury-inspired scents in Pakistan. Soft Petal is now my everyday signature." },
];

const DEFAULT_FAQS = [
  { id: "faq-1", question: "How long does delivery take?", answer: "Orders are dispatched within 1–2 working days and typically arrive within 3–5 working days depending on your city." },
  { id: "faq-2", question: "Do you offer Cash on Delivery?", answer: "Yes. Cash on Delivery (COD) is available nationwide on every order, so you only pay when your fragrance arrives." },
  { id: "faq-3", question: "Where do you deliver?", answer: "We deliver across all major cities and towns in Pakistan for a flat rate of PKR 300." },
  { id: "faq-4", question: "What size bottles do you offer?", answer: "Every Khan Scents fragrance comes in a 50 mL / 1.7 FL. OZ. bottle, designed for everyday carry and long-term use." },
  { id: "faq-5", question: "Are your perfumes original or inspired fragrances?", answer: "Our fragrances are luxury-inspired compositions, carefully developed to capture the character of iconic scents at a fraction of the price." },
  { id: "faq-6", question: "Can I return or exchange my perfume?", answer: "Yes, we offer exchanges for damaged or incorrect products. Please contact us within 48 hours of delivery with your order details." },
  { id: "faq-7", question: "How should I store my perfume?", answer: "Keep your bottle away from direct sunlight and extreme heat. Store it upright in a cool, dry place to preserve the fragrance." },
  { id: "faq-8", question: "How can I contact you?", answer: "Reach us anytime on WhatsApp or by email — our team typically responds within a few hours." },
];

export function slugify(text) {
  return String(text)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function nextItemId(items, prefix) {
  const nums = items
    .map((item) => item.id)
    .filter(Boolean)
    .map((id) => {
      const match = String(id).match(/(\d+)$/);
      return match ? Number(match[1]) : 0;
    });
  const max = nums.length ? Math.max(...nums) : 0;
  return `${prefix}-${max + 1}`;
}

async function seedProducts() {
  const count = await Product.countDocuments();
  if (count > 0) return;

  const jsonPath = path.join(__dirname, "../data/products.json");
  let source = seedProducts;

  if (fs.existsSync(jsonPath)) {
    try {
      source = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));
    } catch {
      source = seedProducts;
    }
  }

  for (const p of source) {
    const images = productImages[p.slug] ?? p.images ?? [imageFallback];
    await Product.create({
      slug: p.slug,
      name: p.name,
      inspiredBy: p.inspiredBy,
      size: p.size,
      price: p.price,
      gender: p.gender,
      notes: p.notes,
      longevity: p.longevity,
      howToUse: p.howToUse,
      images,
      bestSeller: p.bestSeller,
      description: p.description,
    });
  }
  console.log(`Seeded ${source.length} products`);
}

async function seedSite() {
  const doc = await getSiteDoc();
  if (doc.reviews.length === 0) doc.reviews = DEFAULT_REVIEWS;
  if (doc.faqs.length === 0) doc.faqs = DEFAULT_FAQS;

  const jsonPath = path.join(__dirname, "../data/site.json");
  if (fs.existsSync(jsonPath)) {
    try {
      const data = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));
      if (data.site) doc.site = { ...doc.site, ...data.site };
      if (data.reviews?.length) doc.reviews = data.reviews;
      if (data.faqs?.length) doc.faqs = data.faqs;
    } catch {
      /* use defaults */
    }
  }

  await doc.save();
  console.log("Site settings seeded");
}

async function seedAdmin() {
  const adminEmail = process.env.ADMIN_EMAIL || "admin@khanscents.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "khanadmin123";
  const existing = await User.findOne({ role: "admin" });
  if (existing) return;

  await User.create({
    name: "Admin",
    email: adminEmail.toLowerCase(),
    password: adminPassword,
    role: "admin",
  });
  console.log(`Admin user created: ${adminEmail}`);
}

async function seedOrders() {
  const count = await Order.countDocuments();
  if (count > 0) return;

  const jsonPath = path.join(__dirname, "../data/orders.json");
  if (!fs.existsSync(jsonPath)) return;

  try {
    const orders = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));
    for (const o of orders) {
      await Order.create({
        orderId: o.id,
        customer: o.customer,
        items: o.items,
        deliveryFee: o.deliveryFee,
        total: o.total,
        paymentMethod: o.paymentMethod,
        status: o.status || "pending",
        createdAt: o.createdAt ? new Date(o.createdAt) : new Date(),
      });
    }
    console.log(`Seeded ${orders.length} orders`);
  } catch {
    /* ignore */
  }
}

export async function seedDatabase() {
  await seedProducts();
  await seedSite();
  await seedAdmin();
  await seedOrders();
}

export { formatProduct, formatSite, getSiteDoc };
