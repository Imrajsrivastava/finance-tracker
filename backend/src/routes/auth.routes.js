import express from "express";
import jwt from "jsonwebtoken";
import Joi from "joi";
import User from "../models/User.js";
import { auth } from "../middleware/auth.js";
import { authLimiter } from "../middleware/rateLimiters.js";

const router = express.Router();

/**
 * @openapi
 * /api/auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Register a new user
 */
router.post("/register", authLimiter, async (req, res, next) => {
  try {
    const schema = Joi.object({
      name: Joi.string().min(2).required(),
      email: Joi.string().email().required(),
      password: Joi.string().min(6).required(),
      role: Joi.string().valid("admin", "user", "read-only").optional()
    });
    const { value, error } = schema.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });

    const exists = await User.findOne({ email: value.email });
    if (exists) return res.status(400).json({ message: "Email already in use" });

    const user = await User.create(value);
    res.status(201).json({ message: "Registered", user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (e) { next(e); }
});

/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Login
 */
router.post("/login", authLimiter, async (req, res, next) => {
  try {
    const schema = Joi.object({ email: Joi.string().email().required(), password: Joi.string().required() });
    const { value, error } = schema.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });

    const user = await User.findOne({ email: value.email });
    if (!user || !(await user.comparePassword(value.password))) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign({ id: user._id, role: user.role, name: user.name, email: user.email }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || "7d" });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (e) { next(e); }
});

router.get("/me", auth, async (req, res) => {
  res.json({ user: req.user });
});

export default router;
