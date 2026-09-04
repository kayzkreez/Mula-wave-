import mongoose from "mongoose";

const RecipientSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  fullName: { type: String, required: true },
  phone: String,
  countryCode: { type: String, required: true },
  payoutMethod: { type: String, enum: ["cash", "bank", "wallet"], required: true },
  bankName: String,
  accountName: String,
  accountNumber: String,
  branchCode: String,
  currency: String
}, { timestamps: true });

export default mongoose.model("Recipient", RecipientSchema);
