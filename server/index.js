import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import productsRouter from "./routes/products.js";
import ordersRouter from "./routes/orders.js";
import siteRouter from "./routes/site.js";
import adminRouter from "./routes/admin.js";
import { ensureDataFiles } from "./lib/seed.js";

ensureDataFiles();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const clientDist = path.resolve(__dirname, "../client/dist");
const serveClient =
  process.env.SERVE_CLIENT === "true" ||
  (process.env.NODE_ENV === "production" && fs.existsSync(clientDist));

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_DEV_URL = process.env.CLIENT_DEV_URL || "http://localhost:5173";

app.use(
  cors({
    origin: process.env.CLIENT_URL
      ? [process.env.CLIENT_URL, "http://localhost:5173", "http://127.0.0.1:5173"]
      : true,
  }),
);
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

if (!serveClient) {
  app.get("/", (_req, res) => {
    res.json({ name: "Khan Scents API", status: "running" });
  });
}

app.use("/api/products", productsRouter);
app.use("/api/orders", ordersRouter);
app.use("/api/site", siteRouter);
app.use("/api/admin", adminRouter);

if (serveClient) {
  app.use(express.static(clientDist));
  app.get("*", (_req, res) => {
    res.sendFile(path.join(clientDist, "index.html"));
  });
} else if (process.env.NODE_ENV !== "production") {
  app.get("*", (req, res, next) => {
    if (req.path.startsWith("/api")) return next();
    res.redirect(302, `${CLIENT_DEV_URL}${req.originalUrl}`);
  });
  app.use((_req, res) => {
    res.status(404).json({ error: "Not found" });
  });
} else {
  app.use((_req, res) => {
    res.status(404).json({ error: "Not found" });
  });
}

app.listen(PORT, () => {
  console.log(`Khan Scents API running on port ${PORT}`);
});
