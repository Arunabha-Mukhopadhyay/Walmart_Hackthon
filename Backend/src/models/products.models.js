import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  product_name: 
  { 
    type: String, 
    required: true 
  },
  category: 
  { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Category', 
    required: true 
  },
  price: 
  { 
    type: Number, 
    required: true 
  },
  shelf: 
  { 
    type: String, 
    required: true 
  },
  stock_quantity: 
  { 
    type: Number, 
    required: true 
  },
  expiry_date: 
  { 
    type: Date, 
    required: true 
  },
  stock_threshold: 
  { 
    type: Number, 
    required: true 
  }
});

export const Product = mongoose.model("Product", ProductSchema);