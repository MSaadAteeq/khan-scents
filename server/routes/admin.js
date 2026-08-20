import { Router } from "express";
import { Product, formatProduct } from "../models/Product.js";
import { getSiteDoc, formatSite } from "../models/Site.js";
import { Order, formatOrder } from "../models/Order.js";
import { slugify, nextItemId } from "../lib/seedMongo.js";
import { requireAuth, requireAdmin } from "../middleware/auth.js";
import { sendOrderStatusEmail } from "../lib/email.js";

const router = Router();

router.use(requireAuth, requireAdmin);

// ——— Products ———
router.get("/products", async (_req, res) => {
  const products = await Product.find().sort({ createdAt: 1 });
  res.json(products.map(formatProduct));
});

router.post("/products", async (req, res) => {
  const body = req.body || {};
  if (!body.name?.trim()) {
    return res.status(400).json({ error: "Product name is required" });
  }

  let slug = body.slug?.trim() || slugify(body.name);
  const existing = await Product.findOne({ slug });
  if (existing) slug = `${slug}-${Date.now()}`;

  const product = await Product.create({
    slug,
    name: body.name.trim(),
    inspiredBy: body.inspiredBy?.trim() || "",
    size: body.size?.trim() || "50 mL / 1.7 FL. OZ.",
    price: Number(body.price) || 0,
    gender: body.gender || "unisex",
    notes: Array.isArray(body.notes) ? body.notes : [],
    longevity: body.longevity?.trim() || "",
    howToUse: body.howToUse?.trim() || "",
    images: Array.isArray(body.images) ? body.images.filter(Boolean) : ["/images/products/fallback.jpg"],
    bestSeller: Boolean(body.bestSeller),
    description: body.description?.trim() || "",
  });

  res.status(201).json(formatProduct(product));
});

router.put("/products/:id", async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ error: "Product not found" });

  const body = req.body || {};
  const slug = body.slug?.trim() || product.slug;

  const slugTaken = await Product.findOne({ slug, _id: { $ne: product._id } });
  if (slugTaken) return res.status(400).json({ error: "Slug already in use" });

  product.slug = slug;
  if (body.name !== undefined) product.name = body.name.trim();
  if (body.inspiredBy !== undefined) product.inspiredBy = body.inspiredBy.trim();
  if (body.size !== undefined) product.size = body.size.trim();
  if (body.price !== undefined) product.price = Number(body.price);
  if (body.gender !== undefined) product.gender = body.gender;
  if (body.notes !== undefined) product.notes = body.notes;
  if (body.longevity !== undefined) product.longevity = body.longevity.trim();
  if (body.howToUse !== undefined) product.howToUse = body.howToUse.trim();
  if (body.images !== undefined) product.images = body.images.filter(Boolean);
  if (body.bestSeller !== undefined) product.bestSeller = Boolean(body.bestSeller);
  if (body.description !== undefined) product.description = body.description.trim();

  await product.save();
  res.json(formatProduct(product));
});

router.delete("/products/:id", async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) return res.status(404).json({ error: "Product not found" });
  res.json({ ok: true });
});

// ——— Site settings ———
router.get("/site", async (_req, res) => {
  const doc = await getSiteDoc();
  res.json(formatSite(doc));
});

router.put("/site", async (req, res) => {
  const doc = await getSiteDoc();
  if (req.body?.site) {
    Object.assign(doc.site, req.body.site);
    doc.markModified("site");
  }
  await doc.save();
  res.json(formatSite(doc));
});

// ——— Reviews ———
router.post("/reviews", async (req, res) => {
  const doc = await getSiteDoc();
  const { name, city, rating, text } = req.body || {};
  if (!name?.trim() || !text?.trim()) {
    return res.status(400).json({ error: "Name and review text are required" });
  }
  const review = {
    id: nextItemId(doc.reviews, "rev"),
    name: name.trim(),
    city: city?.trim() || "",
    rating: Math.min(5, Math.max(1, Number(rating) || 5)),
    text: text.trim(),
  };
  doc.reviews.push(review);
  await doc.save();
  res.status(201).json(review);
});

router.put("/reviews/:id", async (req, res) => {
  const doc = await getSiteDoc();
  const review = doc.reviews.find((r) => r.id === req.params.id);
  if (!review) return res.status(404).json({ error: "Review not found" });

  const body = req.body || {};
  if (body.name !== undefined) review.name = body.name.trim();
  if (body.city !== undefined) review.city = body.city.trim();
  if (body.rating !== undefined) review.rating = Math.min(5, Math.max(1, Number(body.rating)));
  if (body.text !== undefined) review.text = body.text.trim();

  await doc.save();
  res.json(review);
});

router.delete("/reviews/:id", async (req, res) => {
  const doc = await getSiteDoc();
  const before = doc.reviews.length;
  doc.reviews = doc.reviews.filter((r) => r.id !== req.params.id);
  if (doc.reviews.length === before) {
    return res.status(404).json({ error: "Review not found" });
  }
  await doc.save();
  res.json({ ok: true });
});

// ——— FAQs ———
router.post("/faqs", async (req, res) => {
  const doc = await getSiteDoc();
  const { question, answer } = req.body || {};
  if (!question?.trim() || !answer?.trim()) {
    return res.status(400).json({ error: "Question and answer are required" });
  }
  const faq = {
    id: nextItemId(doc.faqs, "faq"),
    question: question.trim(),
    answer: answer.trim(),
  };
  doc.faqs.push(faq);
  await doc.save();
  res.status(201).json(faq);
});

router.put("/faqs/:id", async (req, res) => {
  const doc = await getSiteDoc();
  const faq = doc.faqs.find((f) => f.id === req.params.id);
  if (!faq) return res.status(404).json({ error: "FAQ not found" });

  const body = req.body || {};
  if (body.question !== undefined) faq.question = body.question.trim();
  if (body.answer !== undefined) faq.answer = body.answer.trim();

  await doc.save();
  res.json(faq);
});

router.delete("/faqs/:id", async (req, res) => {
  const doc = await getSiteDoc();
  const before = doc.faqs.length;
  doc.faqs = doc.faqs.filter((f) => f.id !== req.params.id);
  if (doc.faqs.length === before) {
    return res.status(404).json({ error: "FAQ not found" });
  }
  await doc.save();
  res.json({ ok: true });
});

// ——— Orders ———
router.get("/orders", async (_req, res) => {
  const orders = await Order.find().sort({ createdAt: -1 });
  res.json(orders.map(formatOrder));
});

router.patch("/orders/:id", async (req, res) => {
  const order = await Order.findOne({ orderId: req.params.id });
  if (!order) return res.status(404).json({ error: "Order not found" });

  const { status } = req.body || {};
  if (!status) return res.status(400).json({ error: "Status is required" });

  const prev = order.status;
  order.status = status;
  await order.save();

  if (prev !== status) {
    sendOrderStatusEmail(order, status).catch((err) =>
      console.error("Status email failed:", err.message),
    );
  }

  res.json(formatOrder(order));
});

export default router;
