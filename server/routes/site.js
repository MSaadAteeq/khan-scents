import { Router } from "express";
import { getSiteData } from "../lib/seed.js";

const router = Router();

router.get("/", (_req, res) => {
  const data = getSiteData();
  res.json(data);
});

export default router;
