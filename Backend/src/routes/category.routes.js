import { Router } from "express";
import { createCategory, getAllCategories } from "../controllers/category.controllers.js";

const router = Router();

router.route("/").post(createCategory).get(getAllCategories);

export default router;