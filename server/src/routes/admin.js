import { Router } from "express";
import { requireAuth, requireRoles } from "../middleware/auth.js";
import User from "../models/User.js";
import Order from "../models/Order.js";
import AuditLog from "../models/AuditLog.js";
import Setting from "../models/Setting.js";

const router = Router();
router.use(requireAuth, requireRoles("super_admin", "operations", "finance", "compliance", "support", "auditor"));

router.get("/overview", async (req, res) => {
  const [customers, pendingKyc, orders, paid] = await Promise.all([
    User.countDocuments({ role: "customer" }),
    User.countDocuments({ role: "customer", kycStatus: "pending" }),
    Order.countDocuments(),
    Order.countDocuments({ status: "paid" })
  ]);
  res.json({ customers, pendingKyc, orders, paid });
});

router.get("/audit", async (req, res) => res.json(await AuditLog.find().populate("actor", "fullName phone role").sort({ createdAt: -1 }).limit(500)));

router.get("/settings", async (req, res) => res.json(await Setting.find().sort({ key: 1 })));

router.put("/settings/:key", requireRoles("super_admin"), async (req, res) => {
  const setting = await Setting.findOneAndUpdate(
    { key: req.params.key },
    { value: req.body.value, description: req.body.description, updatedBy: req.user._id },
    { new: true, upsert: true }
  );
  await AuditLog.create({ actor: req.user._id, action: "SETTING_CHANGED", resource: "setting", resourceId: setting.key, reason: req.body.reason || "System setting update", afterState: { value: setting.value }, ip: req.ip, userAgent: req.headers["user-agent"] });
  res.json(setting);
});

export default router;
