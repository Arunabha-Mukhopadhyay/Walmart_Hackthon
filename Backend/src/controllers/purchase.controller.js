import { asyncHandler } from "../utils/asyncHandler.js";
import { Product } from "../models/products.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const getPurchaseRecommendations = asyncHandler(async (req, res) => {
  const products = await Product.find().populate("category");

  // Assign priority and group by category
  const recommendations = {};

  products.forEach((prod) => {
    const percent = prod.stock_quantity / prod.stock_threshold;
    let priority = null;
    let reason = "";

    if (prod.stock_quantity < prod.stock_threshold) {
      if (percent < 0.5) {
        priority = "High";
        reason = "Low Stock";
      } else {
        priority = "Medium";
        reason = "Low Stock";
      }
    } else if (prod.stock_quantity < prod.stock_threshold * 1.5) {
      priority = "Low";
      reason = "Stock is sufficient but should be monitored";
    }

    if (priority) {
      const cat = prod.category?.category || "Uncategorized";
      if (!recommendations[cat]) recommendations[cat] = [];
      recommendations[cat].push({
        name: prod.product_name,
        reason,
        current: prod.stock_quantity,
        minimum: prod.stock_threshold,
        supplier: prod.supplier || "",
        unitCost: prod.price,
        priority,
      });
    }
  });


  const result = Object.entries(recommendations).map(([category, items]) => ({
    category,
    items,
  }));

  res.json(new ApiResponse(200, result));

  if(!result){
    res.status(404).json(new ApiResponse(404, "No recommendations found"));
  }
});