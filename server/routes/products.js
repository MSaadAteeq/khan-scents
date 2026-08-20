import { Router } from "express";
import { getProducts } from "../lib/seed.js";

const router = Router();

router.get("/", (_req, res) => {
  res.json(getProducts());
});

router.get("/:slug", (req, res) => {
  const product = getProducts().find((p) => p.slug === req.params.slug);
  if (!product) {
    return res.status(404).json({ error: "Product not found" });
  }
  res.json(product);
});

export default router;
