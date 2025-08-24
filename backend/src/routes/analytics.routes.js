import express from "express";
import { auth } from "../middleware/auth.js";
import Transaction from "../models/Transaction.js";
import { analyticsLimiter } from "../middleware/rateLimiters.js";
import { cacheGet, cacheSet } from "../lib/redis.js";

const router = express.Router();

/**
 * @openapi
 * /api/analytics:
 *   get:
 *     tags: [Analytics]
 *     summary: Analytics overview (cached 15 minutes)
 */
router.get("/", auth, analyticsLimiter, async (req, res, next) => {
  try {
    const { year } = req.query;
    const yearNum = Number(year) || new Date().getFullYear();
    const key = `analytics:${req.user.id}:year:${yearNum}`;

    const cached = await cacheGet(key);
    if (cached) return res.json({ cached: true, ...cached });

    const start = new Date(`${yearNum}-01-01T00:00:00.000Z`);
    const end = new Date(`${yearNum}-12-31T23:59:59.999Z`);

    const txns = await Transaction.find({ user: req.user.id, date: { $gte: start, $lte: end } });

    const monthly = Array(12).fill(0).map(() => ({ income: 0, expense: 0 }));
    const categoryMap = {};
    let incomeTotal = 0, expenseTotal = 0;

    for (const t of txns) {
      const m = new Date(t.date).getMonth();
      if (t.type === "income") {
        monthly[m].income += t.amount;
        incomeTotal += t.amount;
      } else {
        monthly[m].expense += t.amount;
        expenseTotal += t.amount;
        categoryMap[t.category] = (categoryMap[t.category] || 0) + t.amount;
      }
    }

    const category = Object.entries(categoryMap).map(([name, value]) => ({ name, value }));

    const payload = { year: yearNum, monthly, totals: { incomeTotal, expenseTotal }, category };
    await cacheSet(key, payload, 900); 
    res.json({ cached: false, ...payload });
  } catch (e) { next(e); }
});

export default router;
