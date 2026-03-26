import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import { errorMiddleware } from "./middleware/error.middleware.js";
import authRoutes from "./routes/auth.route.js";
import testRoutes from "./routes/test.route.js";
import storeRoutes from "./routes/store.route.js";
import productRoutes from "./routes/product.route.js";
import orderRoutes from "./routes/order.route.js";
import stripeRoutes from "./routes/payment.route.js";
import ratelimiter from "express-rate-limit";

export const createApp = () => {
  const app = express();

  // Middleware
  app.use(express.json());
  app.use(cors());
  app.use(helmet());
  app.use(morgan("dev"));

  // Rate limiter: limit requests to 100 per 15 min
  const limiter = ratelimiter({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: "Too many requests, please try again later.",
  });
  app.use("/api", limiter);

  // ✅ Root route for browser testing
  app.get("/", (req, res) => {
    res.send("Server is running ✅");
  });

  // API Routes
  app.use("/api/users", authRoutes);       // login/register
  app.use("/api/test", testRoutes);
  app.use("/api/store", storeRoutes);
  app.use("/api/products", productRoutes);
  app.use("/api/orders", orderRoutes);
  app.use("/api/payment", stripeRoutes);

  // Error middleware
  app.use(errorMiddleware);

  return app;
};