import express from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import mongoSanitize from "express-mongo-sanitize";
import xssClean from "xss-clean";
import { StatusCodes } from "http-status-codes";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";

import connectDB from "./lib/db.js";
import { redisClient } from "./lib/redis.js";
import authRoutes from "./routes/auth.routes.js";
import transactionRoutes from "./routes/transaction.routes.js";
import analyticsRoutes from "./routes/analytics.routes.js";
import userRoutes from "./routes/user.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import errorHandler from "./middleware/errorHandler.js";

dotenv.config();

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN?.split(',') || "*", credentials: true }));
app.use(express.json({ limit: "1mb" }));
app.use(mongoSanitize());
app.use(xssClean());

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: "3.0.0",
    info: { title: "Finance Tracker API", version: "1.0.0" },
    servers: [{ url: `http://localhost:${process.env.PORT || 4000}` }],
    components: {
      securitySchemes: {
        bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" }
      }
    },
    security: [{ bearerAuth: [] }]
  },
  apis: ["./src/routes/*.js", "./src/models/*.js"]
});
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/users", userRoutes);
app.use("/api/categories", categoryRoutes);

app.get("/api/health", async (req, res) => {
  const redisOk = redisClient.isOpen;
  res.json({ status: "ok", redis: redisOk });
});

app.use((req, res) => res.status(StatusCodes.NOT_FOUND).json({ message: "Route not found" }));
app.use(errorHandler);

const port = process.env.PORT || 4000;
await connectDB(process.env.MONGO_URI);
await redisClient.connect().catch(() => console.warn("Redis connection failed (ensure Redis is running)"));
app.listen(port, () => console.log(`API running on port ${port}`));
