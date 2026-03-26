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

  app.use(express.json());
  app.use(cors());

  const limiter = ratelimiter({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: "Too many requests, please try again later.",
  });
  app.use("/api", limiter);
  app.use(helmet());
  app.use(morgan("dev"));

  app.use("/auth/users", authRoutes);
  app.use("/api", testRoutes);
  app.use("/api/store", storeRoutes);
  app.use("/api/products", productRoutes);
  app.use("/api/orders", orderRoutes);
  app.use("/api/payment", stripeRoutes);

  app.use(errorMiddleware);
  return app;
};
