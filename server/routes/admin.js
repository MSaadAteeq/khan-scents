import { Router } from "express";
import multer from "multer";
import { Product, formatProduct } from "../models/Product.js";
import { getSiteDoc, formatSite } from "../models/Site.js";
import { Order, formatOrder } from "../models/Order.js";
import { slugify, nextItemId } from "../lib/seedMongo.js";
import { requireAuth, requireAdmin } from "../middleware/auth.js";
import { sendOrderStatusEmail } from "../lib/email.js";
import { isCloudinaryConfigured, uploadProductImage } from "../lib/cloudinary.js";

const router = Router();

const imageUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 12 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype?.startsWith("image/")) {
      cb(new Error("Only image files are allowed"));
      return;
    }
    cb(null, true);
  },
});

const GENDERS = new Set(["him", "her", "unisex"]);

function mongoErrorMessage(err) {
  if (err?.code === 11000) {
    return "A product with this name or URL slug already exists. Change the name or slug and try again.";
  }
  if (err?.name === "ValidationError") {
    return Object.values(err.errors || {}).map((e) => e.message).join(". ") || "Invalid product data";
  }
  return err?.message || "Could not save product";
}

async function uniqueProductSlug(raw, excludeId) {
  const base = slugify(raw) || `product-${Date.now()}`;
  let candidate = base;
  let n = 2;
  while (true) {
    const query = excludeId ? { slug: candidate, _id: { $ne: excludeId } } : { slug: candidate };
    const taken = await Product.findOne(query).select("_id");
    if (!taken) return candidate;
    candidate = `${base}-${n++}`;
  }
}

function parseProductImages(images) {
  const list = Array.isArray(images) ? images.map(String).map((s) => s.trim()).filter(Boolean) : [];
  if (list.length === 0) return { error: "At least one product image is required" };
  return { images: list };
}

router.use(requireAuth, requireAdmin);

router.post("/upload/product-image", (req, res, next) => {
  imageUpload.single("file")(req, res, (err) => {
    if (err) return res.status(400).json({ error: err.message || "Invalid upload" });
    next();
  });
}, async (req, res) => {
  if (!isCloudinaryConfigured()) {
    return res.status(503).json({ error: "Image upload is not configured (Cloudinary env vars missing)" });
  }
  if (!req.file?.buffer) {
    return res.status(400).json({ error: "No image file provided" });
  }
  try {
    const { url } = await uploadProductImage(req.file.buffer);
    res.json({ url });
  } catch (err) {
    console.error("Cloudinary upload failed:", err.message);
    res.status(502).json({ error: err.message || "Image upload failed" });
  }
});

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

  const parsedImages = parseProductImages(body.images);
  if (parsedImages.error) return res.status(400).json({ error: parsedImages.error });

  try {
    const slug = await uniqueProductSlug(body.slug || body.name);
    const product = await Product.create({
      slug,
      name: body.name.trim(),
      inspiredBy: body.inspiredBy?.trim() || "",
      size: body.size?.trim() || "50 mL / 1.7 FL. OZ.",
      price: Number(body.price) || 0,
      gender: GENDERS.has(body.gender) ? body.gender : "unisex",
      notes: Array.isArray(body.notes) ? body.notes : [],
      longevity: body.longevity?.trim() || "",
      howToUse: body.howToUse?.trim() || "",
      images: parsedImages.images,
      bestSeller: Boolean(body.bestSeller),
      description: body.description?.trim() || "",
    });
    res.status(201).json(formatProduct(product));
  } catch (err) {
    console.error("Create product failed:", err.message);
    res.status(400).json({ error: mongoErrorMessage(err) });
  }
});

router.put("/products/:id", async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ error: "Product not found" });

  const body = req.body || {};
  try {
    const incomingSlug = body.slug !== undefined ? String(body.slug).trim() : product.slug;
    if (incomingSlug && incomingSlug !== product.slug) {
      product.slug = await uniqueProductSlug(incomingSlug, product._id);
    } else if (!incomingSlug) {
      product.slug = await uniqueProductSlug(body.name || product.name, product._id);
    }
    if (body.name !== undefined) product.name = body.name.trim();
    if (body.inspiredBy !== undefined) product.inspiredBy = body.inspiredBy.trim();
    if (body.size !== undefined) product.size = body.size.trim();
    if (body.price !== undefined) product.price = Number(body.price);
    if (body.gender !== undefined) product.gender = GENDERS.has(body.gender) ? body.gender : product.gender;
    if (body.notes !== undefined) product.notes = body.notes;
    if (body.longevity !== undefined) product.longevity = body.longevity.trim();
    if (body.howToUse !== undefined) product.howToUse = body.howToUse.trim();
    if (body.images !== undefined) {
      const parsedImages = parseProductImages(body.images);
      if (parsedImages.error) return res.status(400).json({ error: parsedImages.error });
      product.images = parsedImages.images;
    }
    if (body.bestSeller !== undefined) product.bestSeller = Boolean(body.bestSeller);
    if (body.description !== undefined) product.description = body.description.trim();

    await product.save();
    res.json(formatProduct(product));
  } catch (err) {
    console.error("Update product failed:", err.message);
    res.status(400).json({ error: mongoErrorMessage(err) });
  }
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
    await sendOrderStatusEmail(order, status);
  }

  res.json(formatOrder(order));
});

export default router;
