import mongoose from "mongoose";

/**
 * @openapi
 * components:
 *   schemas:
 *     Transaction:
 *       type: object
 *       properties:
 *         _id: { type: string }
 *         user: { type: string }
 *         type: { type: string, enum: [income, expense] }
 *         category: { type: string }
 *         amount: { type: number }
 *         date: { type: string, format: date-time }
 *         note: { type: string }
 */
const transactionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  type: { type: String, enum: ["income", "expense"], required: true },
  category: { type: String, required: true },
  amount: { type: Number, required: true, min: 0 },
  date: { type: Date, required: true },
  note: { type: String, default: "" }
}, { timestamps: true });

export default mongoose.model("Transaction", transactionSchema);
