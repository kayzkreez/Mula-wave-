import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  fullName: { type: String, required: true, trim: true },
  phone: { type: String, required: true, unique: true, index: true },
  email: { type: String, lowercase: true, trim: true, sparse: true, index: true },
  countryOfResidence: String,
  pinHash: { type: String, required: true, select: false },
  role: {
    type: String,
    enum: ["customer", "operations", "finance", "compliance", "support", "auditor", "super_admin"],
    default: "customer",
    index: true
  },
  kycStatus: {
    type: String,
    enum: ["pending", "verified", "rejected"],
    default: "pending",
    index: true
  },
  status: { type: String, enum: ["active", "suspended", "closed"], default: "active" }
}, { timestamps: true });

export default mongoose.model("User", UserSchema);
