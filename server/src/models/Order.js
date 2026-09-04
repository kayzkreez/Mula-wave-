import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
  orderNumber: { type: String, required: true, unique: true, index: true },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: "Recipient", required: true },
  sourceCountry: { type: String, required: true },
  destinationCountry: { type: String, required: true },
  sourceCurrency: { type: String, default: "USD" },
  destinationCurrency: { type: String, required: true },
  amount: { type: Number, required: true, min: 0 },
  fee: { type: Number, required: true, min: 0 },
  exchangeRate: { type: Number, required: true, min: 0 },
  recipientAmount: { type: Number, required: true, min: 0 },
  paymentMethod: String,
  metadata: { type: mongoose.Schema.Types.Mixed },
  status: {
    type: String,
    enum: ["created", "payment_pending", "payment_received", "compliance_review", "payout_processing", "paid", "cancelled", "failed"],
    default: "created",
    index: true
  }
}, { timestamps: true });

export default mongoose.model("Order", OrderSchema);
