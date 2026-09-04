import { Router } from "express";
import crypto from "crypto";
import Order from "../models/Order.js";
import Recipient from "../models/Recipient.js";
import { requireAuth, requireRoles } from "../middleware/auth.js";

const router = Router();

router.post("/", requireAuth, async (req, res) => {
  const idempotencyKey = req.headers["idempotency-key"];
  if (idempotencyKey) {
    const existing = await Order.findOne({ "metadata.idempotencyKey": idempotencyKey });
    if (existing) return res.status(200).json(existing);
  }
  const { recipientId, sourceCountry, destinationCountry, destinationCurrency, amount, fee, exchangeRate, recipientAmount, paymentMethod } = req.body;
  const recipient = await Recipient.findOne({ _id: recipientId, owner: req.user._id });
  if (!recipient) return res.status(400).json({ message: "Recipient not found" });
  const order = await Order.create({
    orderNumber: "MW-" + Date.now().toString(36).toUpperCase() + "-" + crypto.randomBytes(3).toString("hex").toUpperCase(),
    customer: req.user._id, recipient: recipient._id, sourceCountry, destinationCountry, destinationCurrency,
    amount, fee, exchangeRate, recipientAmount, paymentMethod, status: "payment_pending", metadata: { idempotencyKey: idempotencyKey || null }
  });
  res.status(201).json(order);
});

router.get("/", requireAuth, async (req, res) => {
  const filter = req.user.role === "customer" ? { customer: req.user._id } : {};
  res.json(await Order.find(filter).populate("customer", "fullName phone").populate("recipient").sort({ createdAt: -1 }).limit(500));
});

router.get("/:orderNumber", requireAuth, async (req, res) => {
  const order = await Order.findOne({ orderNumber: req.params.orderNumber }).populate("recipient");
  if (!order) return res.status(404).json({ message: "Order not found" });
  if (req.user.role === "customer" && order.customer.toString() !== req.user._id.toString()) return res.status(403).json({ message: "Forbidden" });
  res.json(order);
});

router.patch("/:id/status", requireAuth, requireRoles("super_admin", "operations", "finance", "compliance"), async (req, res) => {
  const allowed = ["created", "payment_pending", "payment_received", "compliance_review", "payout_processing", "paid", "cancelled", "failed"];
  if (!allowed.includes(req.body.status)) return res.status(400).json({ message: "Invalid status" });
  const order = await Order.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
  if (!order) return res.status(404).json({ message: "Order not found" });
  res.json(order);
});

export default router;
