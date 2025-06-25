import { Router } from "express";
import {
  createProduct,
  getAllProducts,
  getProductsByCategory,
  getLowStockProducts,
  getExpiringProducts
} from "../controllers/product.controllers.js";

const router = Router();

router.route("/").post(createProduct).get(getAllProducts);
router.route("/category/:categoryId").get(getProductsByCategory);
router.route("/low-stock").get(getLowStockProducts);
router.route("/expiring").get(getExpiringProducts);

export default router;