import { Router } from "express";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { signToken } from "../utils/auth.js";

const router = Router();

router.post("/register", async (req, res) => {
  try {
    const { fullName, phone, email, countryOfResidence, pin } = req.body;
    if (!fullName || !phone || !pin) return res.status(400).json({ message: "fullName, phone and pin are required" });
    if (!/^\d{4,8}$/.test(String(pin))) return res.status(400).json({ message: "PIN must be 4-8 digits" });
    const exists = await User.findOne({ phone });
    if (exists) return res.status(409).json({ message: "Phone number already registered" });

    const pinHash = await bcrypt.hash(String(pin), 12);
    const user = await User.create({ fullName, phone, email, countryOfResidence, pinHash });
    const token = signToken(user);
    res.status(201).json({ token, user: { id: user._id, fullName: user.fullName, phone: user.phone, role: user.role, kycStatus: user.kycStatus } });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

router.post("/login", async (req, res) => {
  try {
    const { phone, pin } = req.body;
    const user = await User.findOne({ phone }).select("+pinHash");
    if (!user || !(await bcrypt.compare(String(pin || ""), user.pinHash))) return res.status(401).json({ message: "Invalid credentials" });
    if (user.status !== "active") return res.status(403).json({ message: "Account is not active" });
    const token = signToken(user);
    res.json({ token, user: { id: user._id, fullName: user.fullName, phone: user.phone, role: user.role, kycStatus: user.kycStatus } });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

export default router;
