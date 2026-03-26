import express from "express";
import {
  createProduct,
  deleteProduct,
  editProduct,
  getProducts,
  getSingleProductById,
  getSingleProductByStoreId,
  searchProducts,
} from "../controllers/product.controller.js";
import {
  authMiddleware,
  roleBasedAuthorization,
} from "../middleware/auth.middleware.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.post(
  "/addProduct",
  authMiddleware,
  roleBasedAuthorization('vendor'),
  upload.single("image"),
  createProduct,
);

router.delete(
  "/deleteProduct/:id",
  authMiddleware,
  roleBasedAuthorization("vendor"),
  deleteProduct,
);
router.put(
  "/updateProduct/:id",
  authMiddleware,
  roleBasedAuthorization("vendor"),
  editProduct,
);
router.get("/", getProducts);
router.get("/getSingleProductById/:id", getSingleProductById);
router.get("/getSingleProductByStoreId/:storeId", getSingleProductByStoreId);
router.get("/searchProducts", searchProducts);

export default router;
