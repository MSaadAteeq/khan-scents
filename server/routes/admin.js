import { Router } from "express";
import {
  getProducts,
  saveProducts,
  getSiteData,
  saveSiteData,
  getOrders,
  saveOrders,
  slugify,
  nextId,
} from "../lib/seed.js";
import { requireAdmin, signToken, verifyCredentials } from "../middleware/auth.js";

const router = Router();

router.post("/login", (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) {
    return res.status(400).json({ error: "Username and password required" });
  }
  if (!verifyCredentials(username, password)) {
    return res.status(401).json({ error: "Invalid credentials" });
  }
  res.json({ token: signToken(username), username });
});

router.get("/me", requireAdmin, (req, res) => {
  res.json({ username: req.admin.username, role: req.admin.role });
});

// ——— Products ———
router.get("/products", requireAdmin, (_req, res) => {
  res.json(getProducts());
});

router.post("/products", requireAdmin, (req, res) => {
  const products = getProducts();
  const body = req.body || {};

  if (!body.name?.trim()) {
    return res.status(400).json({ error: "Product name is required" });
  }

  let slug = body.slug?.trim() || slugify(body.name);
  if (products.some((p) => p.slug === slug)) {
    slug = `${slug}-${Date.now()}`;
  }

  const product = {
    id: String(
      Math.max(0, ...products.map((p) => parseInt(p.id, 10)).filter((n) => !Number.isNaN(n))) + 1,
    ),
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
  };

  products.push(product);
  saveProducts(products);
  res.status(201).json(product);
});

router.put("/products/:id", requireAdmin, (req, res) => {
  const products = getProducts();
  const idx = products.findIndex((p) => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Product not found" });

  const current = products[idx];
  const body = req.body || {};
  const slug = body.slug?.trim() || current.slug;

  if (products.some((p) => p.slug === slug && p.id !== current.id)) {
    return res.status(400).json({ error: "Slug already in use" });
  }

  products[idx] = {
    ...current,
    slug,
    name: body.name?.trim() ?? current.name,
    inspiredBy: body.inspiredBy?.trim() ?? current.inspiredBy,
    size: body.size?.trim() ?? current.size,
    price: body.price !== undefined ? Number(body.price) : current.price,
    gender: body.gender ?? current.gender,
    notes: Array.isArray(body.notes) ? body.notes : current.notes,
    longevity: body.longevity?.trim() ?? current.longevity,
    howToUse: body.howToUse?.trim() ?? current.howToUse,
    images: Array.isArray(body.images) ? body.images.filter(Boolean) : current.images,
    bestSeller: body.bestSeller !== undefined ? Boolean(body.bestSeller) : current.bestSeller,
    description: body.description?.trim() ?? current.description,
  };

  saveProducts(products);
  res.json(products[idx]);
});

router.delete("/products/:id", requireAdmin, (req, res) => {
  const products = getProducts();
  const filtered = products.filter((p) => p.id !== req.params.id);
  if (filtered.length === products.length) {
    return res.status(404).json({ error: "Product not found" });
  }
  saveProducts(filtered);
  res.json({ ok: true });
});

// ——— Site settings ———
router.get("/site", requireAdmin, (_req, res) => {
  res.json(getSiteData());
});

router.put("/site", requireAdmin, (req, res) => {
  const data = getSiteData();
  const body = req.body || {};
  if (body.site) {
    data.site = { ...data.site, ...body.site };
  }
  saveSiteData(data);
  res.json(data);
});

// ——— Reviews ———
router.post("/reviews", requireAdmin, (req, res) => {
  const data = getSiteData();
  const { name, city, rating, text } = req.body || {};
  if (!name?.trim() || !text?.trim()) {
    return res.status(400).json({ error: "Name and review text are required" });
  }
  const review = {
    id: nextId(data.reviews, "rev"),
    name: name.trim(),
    city: city?.trim() || "",
    rating: Math.min(5, Math.max(1, Number(rating) || 5)),
    text: text.trim(),
  };
  data.reviews.push(review);
  saveSiteData(data);
  res.status(201).json(review);
});

router.put("/reviews/:id", requireAdmin, (req, res) => {
  const data = getSiteData();
  const idx = data.reviews.findIndex((r) => r.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Review not found" });

  const body = req.body || {};
  data.reviews[idx] = {
    ...data.reviews[idx],
    name: body.name?.trim() ?? data.reviews[idx].name,
    city: body.city?.trim() ?? data.reviews[idx].city,
    rating: body.rating !== undefined ? Math.min(5, Math.max(1, Number(body.rating))) : data.reviews[idx].rating,
    text: body.text?.trim() ?? data.reviews[idx].text,
  };
  saveSiteData(data);
  res.json(data.reviews[idx]);
});

router.delete("/reviews/:id", requireAdmin, (req, res) => {
  const data = getSiteData();
  const before = data.reviews.length;
  data.reviews = data.reviews.filter((r) => r.id !== req.params.id);
  if (data.reviews.length === before) {
    return res.status(404).json({ error: "Review not found" });
  }
  saveSiteData(data);
  res.json({ ok: true });
});

// ——— FAQs ———
router.post("/faqs", requireAdmin, (req, res) => {
  const data = getSiteData();
  const { question, answer } = req.body || {};
  if (!question?.trim() || !answer?.trim()) {
    return res.status(400).json({ error: "Question and answer are required" });
  }
  const faq = {
    id: nextId(data.faqs, "faq"),
    question: question.trim(),
    answer: answer.trim(),
  };
  data.faqs.push(faq);
  saveSiteData(data);
  res.status(201).json(faq);
});

router.put("/faqs/:id", requireAdmin, (req, res) => {
  const data = getSiteData();
  const idx = data.faqs.findIndex((f) => f.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "FAQ not found" });

  const body = req.body || {};
  data.faqs[idx] = {
    ...data.faqs[idx],
    question: body.question?.trim() ?? data.faqs[idx].question,
    answer: body.answer?.trim() ?? data.faqs[idx].answer,
  };
  saveSiteData(data);
  res.json(data.faqs[idx]);
});

router.delete("/faqs/:id", requireAdmin, (req, res) => {
  const data = getSiteData();
  const before = data.faqs.length;
  data.faqs = data.faqs.filter((f) => f.id !== req.params.id);
  if (data.faqs.length === before) {
    return res.status(404).json({ error: "FAQ not found" });
  }
  saveSiteData(data);
  res.json({ ok: true });
});

// ——— Orders ———
router.get("/orders", requireAdmin, (_req, res) => {
  res.json(getOrders());
});

router.patch("/orders/:id", requireAdmin, (req, res) => {
  const orders = getOrders();
  const idx = orders.findIndex((o) => o.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Order not found" });

  const { status } = req.body || {};
  if (status) orders[idx].status = status;
  saveOrders(orders);
  res.json(orders[idx]);
});

export default router;
