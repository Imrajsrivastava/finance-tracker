import express from "express";
import { auth } from "../middleware/auth.js";
import { redisClient, cacheGet, cacheSet } from "../lib/redis.js";

const router = express.Router();

const DEFAULT_CATEGORIES = ["Food","Transport","Entertainment","Bills","Shopping","Health","Rent","Salary","Investment","Other"];

/**
 * @openapi
 * /api/categories:
 *   get:
 *     tags: [Categories]
 *     summary: Get categories (cached 1 hour)
 */
router.get("/", auth, async (req, res, next) => {
  try {
    const key = "categories:list";
    const cached = await cacheGet(key);
    if (cached) return res.json(cached);
    // Could be fetched from DB; using constant for simplicity
    await cacheSet(key, DEFAULT_CATEGORIES, 3600);
    res.json(DEFAULT_CATEGORIES);
  } catch (e) { next(e); }
});

export default router;
