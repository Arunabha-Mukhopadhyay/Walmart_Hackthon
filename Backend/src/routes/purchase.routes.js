import { Router } from "express";
import { getPurchaseRecommendations } from "../controllers/purchase.controller.js";

const router = Router();

router.get("/", getPurchaseRecommendations);

export default router;