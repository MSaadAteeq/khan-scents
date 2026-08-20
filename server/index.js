import express from "express";
import cors from "cors";
import productsRouter from "./routes/products.js";
import ordersRouter from "./routes/orders.js";

const app = express();
const PORT = process.env.PORT || 5000;

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

app.get("/", (_req, res) => {
  res.json({ name: "Khan Scents API", status: "running" });
});

app.use("/api/products", productsRouter);
app.use("/api/orders", ordersRouter);

app.use((_req, res) => {
  res.status(404).json({ error: "Not found" });
});

app.listen(PORT, () => {
  console.log(`Khan Scents API running on port ${PORT}`);
});
