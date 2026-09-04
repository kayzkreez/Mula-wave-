import mongoose from "mongoose";

const SettingSchema = new mongoose.Schema({
  key: { type: String, unique: true, required: true, index: true },
  value: mongoose.Schema.Types.Mixed,
  description: String,
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
}, { timestamps: true });

export default mongoose.model("Setting", SettingSchema);
