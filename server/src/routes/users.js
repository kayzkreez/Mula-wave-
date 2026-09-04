import { Router } from "express";
import User from "../models/User.js";
import { requireAuth, requireRoles } from "../middleware/auth.js";
import AuditLog from "../models/AuditLog.js";

const router = Router();

router.get("/me", requireAuth, (req, res) => res.json(req.user));

router.get("/", requireAuth, requireRoles("super_admin", "operations", "compliance", "auditor", "support"), async (req, res) => {
  const users = await User.find().select("-pinHash").sort({ createdAt: -1 }).limit(500);
  res.json(users);
});

router.patch("/:id/role", requireAuth, requireRoles("super_admin"), async (req, res) => {
  const allowed = ["customer", "operations", "finance", "compliance", "support", "auditor", "super_admin"];
  if (!allowed.includes(req.body.role)) return res.status(400).json({ message: "Invalid role" });
  if (req.params.id === req.user._id.toString() && req.body.role !== req.user.role) return res.status(400).json({ message: "You cannot change your own role" });
  const before = await User.findById(req.params.id).select("-pinHash");
  if (!before) return res.status(404).json({ message: "User not found" });
  const updated = await User.findByIdAndUpdate(req.params.id, { role: req.body.role }, { new: true }).select("-pinHash");
  await AuditLog.create({ actor: req.user._id, action: "ROLE_CHANGED", resource: "user", resourceId: updated._id.toString(), reason: req.body.reason || "Admin role assignment", beforeState: { role: before.role }, afterState: { role: updated.role }, ip: req.ip, userAgent: req.headers["user-agent"] });
  res.json(updated);
});

export default router;
