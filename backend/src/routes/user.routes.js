import express from "express";
import User from "../models/User.js";
import { auth, permit } from "../middleware/auth.js";

const router = express.Router();

/**
 * @openapi
 * /api/users:
 *   get:
 *     tags: [Users]
 *     summary: List users (admin only)
 */
router.get("/", auth, permit("admin"), async (req, res, next) => {
  try {
    const users = await User.find().select("-password").sort("-createdAt");
    res.json(users);
  } catch (e) { next(e); }
});

export default router;
