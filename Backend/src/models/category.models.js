import mongoose from 'mongoose';

const CategorySchema = new mongoose.Schema({
  category: 
  { 
    type: String, 
    required: true, 
    unique: true 
  },
  products: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }]
  ,
  total_category_items: 
  { 
    type: Number,
    default: 0 
  }
});

export const Category = mongoose.model("Category", CategorySchema);