import { Router } from "express";
import Recipient from "../models/Recipient.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.get("/", requireAuth, async (req, res) => res.json(await Recipient.find({ owner: req.user._id }).sort({ createdAt: -1 })));

router.post("/", requireAuth, async (req, res) => {
  const recipient = await Recipient.create({ ...req.body, owner: req.user._id });
  res.status(201).json(recipient);
});

router.patch("/:id", requireAuth, async (req, res) => {
  const recipient = await Recipient.findOneAndUpdate({ _id: req.params.id, owner: req.user._id }, req.body, { new: true, runValidators: true });
  if (!recipient) return res.status(404).json({ message: "Recipient not found" });
  res.json(recipient);
});

router.delete("/:id", requireAuth, async (req, res) => {
  const result = await Recipient.deleteOne({ _id: req.params.id, owner: req.user._id });
  if (!result.deletedCount) return res.status(404).json({ message: "Recipient not found" });
  res.status(204).end();
});

export default router;
