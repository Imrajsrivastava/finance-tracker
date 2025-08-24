import jwt from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";

export const auth = (req, res, next) => {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return res.status(StatusCodes.UNAUTHORIZED).json({ message: "No token" });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; 
    next();
  } catch {
    return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Invalid token" });
  }
};

export const permit = (...roles) => (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: "Unauthenticated" });
  if (!roles.includes(req.user.role)) return res.status(403).json({ message: "Forbidden" });
  next();
};
