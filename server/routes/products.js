import { Router } from "express";
import { products as rawProducts } from "../data/products.js";
import { productImages, imageFallback } from "../data/images.js";

const products = rawProducts.map((p) => ({
  ...p,
  images: productImages[p.slug] ?? [imageFallback, imageFallback],
}));

const router = Router();

router.get("/", (_req, res) => {
  res.json(products);
});

router.get("/:slug", (req, res) => {
  const product = products.find((p) => p.slug === req.params.slug);
  if (!product) {
    return res.status(404).json({ error: "Product not found" });
  }
  res.json(product);
});

export default router;
