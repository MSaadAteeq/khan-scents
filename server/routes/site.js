import { Router } from "express";
import { getSiteDoc, formatSite } from "../models/Site.js";

const router = Router();

router.get("/", async (_req, res) => {
  const doc = await getSiteDoc();
  res.json(formatSite(doc));
});

export default router;
