import { asyncHandler } from "../utils/asyncHandler.js";
import { Product } from "../models/products.models.js";
import { Category } from "../models/category.models.js";
import { APIerror } from "../utils/APIerror.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// Create product
export const createProduct = asyncHandler(async (req, res) => {
  const product = await Product.create(req.body);

  // Add product to category
  await Category.findByIdAndUpdate(
    product.category,
    {
      $push: { products: product._id },
      $inc: { total_category_items: 1 }
    }
  );

  res.status(201).json(new ApiResponse(201, product, "Product created"));

  if (!product) {
    return res.status(400).json(new APIerror(400, "Product creation failed"));
  }
});


// Get all products
export const getAllProducts = asyncHandler(async (req, res) => {
  const products = await Product.find().populate("category");
  res.json(new ApiResponse(200, products," All products fetched successfully"));

  if (!products) {
    return res.status(404).json(new APIerror(404, "No products found"));
  }
});


// Get products by category
export const getProductsByCategory = asyncHandler(async (req, res) => {
  const products = await Product.find({ category: req.params.categoryId });
  res.json(new ApiResponse(200, products));
});


// Get low stock products
export const getLowStockProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ $expr: { $lt: ["$stock_quantity", "$stock_threshold"] } }).populate("category");
  res.json(new ApiResponse(200, products));
});


// Get expiring soon products (next 3 days)
export const getExpiringProducts = asyncHandler(async (req, res) => {
  const soon = new Date();
  soon.setDate(soon.getDate() + 3);
  const products = await Product.find({ expiry_date: { $lte: soon } }).populate("category");
  res.json(new ApiResponse(200, products));
});