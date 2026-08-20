import { Router } from "express";
import { Product, formatProduct } from "../models/Product.js";

const router = Router();

router.get("/", async (_req, res) => {
  const products = await Product.find().sort({ createdAt: 1 });
  res.json(products.map(formatProduct));
});

router.get("/:slug", async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug });
  if (!product) {
    return res.status(404).json({ error: "Product not found" });
  }
  res.json(formatProduct(product));
});

export default router;
