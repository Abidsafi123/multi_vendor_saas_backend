import express from "express";

import {
  createOrder,
  getMyOrders,
  getAllOrders,
  getMySingleOrder,
  updateOrderStatus,
  getTotalRevenue,
  getVendorOrders,
} from "../controllers/order.controller.js";
import {
  authMiddleware,
  roleBasedAuthorization,
} from "../middleware/auth.middleware.js";

const router = express.Router();
router.post("/create", authMiddleware, createOrder);
router.get("/getMyOrders", authMiddleware, getMyOrders);
router.get("/getMyOrder/:id", authMiddleware, getMySingleOrder);
router.get("/", authMiddleware, roleBasedAuthorization("admin"), getAllOrders);
router.put(
  "/updateOrderStatus/:id",
  authMiddleware,
  roleBasedAuthorization("admin", "vendor"),
  updateOrderStatus,
);
router.get(
  "/getTotalRevenue",
  authMiddleware,
  roleBasedAuthorization("admin"),
  getTotalRevenue,
);

router.get(
  "/vendor/orders",
  authMiddleware,
  roleBasedAuthorization("vendor"),
  getVendorOrders,
);
export default router;
