import { asyncHandler } from "../utils/asyncHandler.js";
import { Category } from "../models/category.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { APIerror } from "../utils/APIerror.js";

export const createCategory = asyncHandler(async (req, res) => {
  const { category } = req.body;
  const newCategory = await Category.create({ category });
  res.status(201).json(new ApiResponse(201, newCategory, "Category created"));

  if(!newCategory){
    return res.status(400).json(new APIerror(400, "Category creation failed"));
  }
});


export const getAllCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find().populate("products");
  res.json(new ApiResponse(200, categories, "All categories fetched successfully"));

  if(!categories){
    return res.status(404).json(new APIerror(404, "No categories found"));
  }
});