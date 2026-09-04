import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import { connectDatabase } from "./config/db.js";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import recipientRoutes from "./routes/recipients.js";
import orderRoutes from "./routes/orders.js";
import adminRoutes from "./routes/admin.js";

const app = express();
app.use(cors({ origin: process.env.CLIENT_ORIGIN?.split(",") || true }));
app.use(express.json({ limit: "1mb" }));
app.use(morgan("combined"));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 300 }));

app.get("/health", (req, res) => res.json({ ok: true, service: "mulawave-api" }));
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/recipients", recipientRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Internal server error" });
});

const port = process.env.PORT || 5000;
connectDatabase().then(() => app.listen(port, () => console.log(`MulaWave API running on ${port}`))).catch(err => {
  console.error(err);
  process.exit(1);
});
