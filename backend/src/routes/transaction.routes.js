import express from "express";
import Joi from "joi";
import Transaction from "../models/Transaction.js";
import { auth, permit } from "../middleware/auth.js";
import { txnLimiter } from "../middleware/rateLimiters.js";
import { cacheDel } from "../lib/redis.js";

const router = express.Router();

const txnSchema = Joi.object({
  type: Joi.string().valid("income", "expense").required(),
  category: Joi.string().required(),
  amount: Joi.number().min(0).required(),
  date: Joi.date().required(),
  note: Joi.string().allow("")
});

/**
 * @openapi
 * /api/transactions:
 *   get:
 *     tags: [Transactions]
 *     summary: List transactions (all roles)
 */
router.get("/", auth, txnLimiter, async (req, res, next) => {
  try {
    const { page = 1, limit = 10, q = "", type, category, sort = "-date" } = req.query;
    const filter = { user: req.user.id };
    if (type) filter.type = type;
    if (category) filter.category = category;
    if (q) filter.$or = [{ note: new RegExp(q, "i") }, { category: new RegExp(q, "i") }];

    const skip = (Number(page) - 1) * Number(limit);
    const [items, total] = await Promise.all([
      Transaction.find(filter).sort(sort).skip(skip).limit(Number(limit)),
      Transaction.countDocuments(filter)
    ]);
    res.json({ items, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
  } catch (e) { next(e); }
});

router.post("/", auth, permit("admin","user"), txnLimiter, async (req, res, next) => {
  try {
    const { value, error } = txnSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });
    const txn = await Transaction.create({ ...value, user: req.user.id });
    await cacheDel(`analytics:${req.user.id}:*`);
    res.status(201).json(txn);
  } catch (e) { next(e); }
});

router.put("/:id", auth, permit("admin","user"), txnLimiter, async (req, res, next) => {
  try {
    const { value, error } = txnSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });

    const txn = await Transaction.findOneAndUpdate({ _id: req.params.id, user: req.user.id }, value, { new: true });
    if (!txn) return res.status(404).json({ message: "Not found" });
    await cacheDel(`analytics:${req.user.id}:*`);
    res.json(txn);
  } catch (e) { next(e); }
});

router.delete("/:id", auth, permit("admin","user"), txnLimiter, async (req, res, next) => {
  try {
    const txn = await Transaction.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!txn) return res.status(404).json({ message: "Not found" });
    await cacheDel(`analytics:${req.user.id}:*`);
    res.json({ message: "Deleted" });
  } catch (e) { next(e); }
});

export default router;
