import { createAgent, gemini } from '@inngest/agent-kit';
import { Category } from '../models/category.models.js';
import { Product } from '../models/products.models.js';

const recommendationProduct = async (userInput, existingCategories = []) => {
  const supportAgent = createAgent({
    model: gemini({
      model: "gemini-1.5-flash-8b",
      apiKey: process.env.AI_API_KEY,
    }),
    name: "Product Recommendation Agent",
    description: "An agent that provides product recommendations based on user preferences and current market trends.",
    system: `You are a Walmart Product Recommendation Agent. Your role is to help staff manage inventory by providing trending product recommendations and creating new product categories.

CURRENT STORE CATEGORIES:
1. Dairy (3 products) - Organic Milk, Yogurt Cups, Cheese Slices
2. Bakery (2 products) - Fresh Bread, Croissants  
3. Produce (3 products) - Bananas, Apples, Lettuce
4. Meat (2 products) - Ground Mutton, Chicken Breast

EXISTING CATEGORIES IN DATABASE: ${JSON.stringify(existingCategories)}

INSTRUCTIONS:
1. When asked for "famous products" or "trending products", provide 8-12 popular products that are currently trending online and would sell well in a Walmart store.
2. Organize recommendations by the 4 existing categories: Dairy, Bakery, Produce, Meat.
3. For each product, provide: product_name, estimated_price, suggested_shelf_location, initial_stock_quantity, expiry_date_days_from_now, stock_threshold.
4. When asked to "create new category", suggest 5-8 products for that category.
5. Always respond in JSON format for easy parsing.

RESPONSE FORMAT FOR TRENDING PRODUCTS:
{
  "type": "trending_recommendations",
  "message": "Here are the most popular products trending online that would boost your store sales:",
  "categories": {
    "Dairy": [
      {
        "product_name": "Greek Yogurt",
        "price": 4.99,
        "shelf": "A-16",
        "stock_quantity": 50,
        "expiry_days": 14,
        "stock_threshold": 15,
        "trend_reason": "High protein demand"
      }
    ],
    "Bakery": [...],
    "Produce": [...],
    "Meat": [...]
  }
}

RESPONSE FORMAT FOR NEW CATEGORY:
{
  "type": "new_category",
  "message": "Created new category with trending products:",
  "category_name": "Category Name",
  "products": [
    {
      "product_name": "Product Name",
      "price": 0.00,
      "shelf": "X-XX",
      "stock_quantity": 0,
      "expiry_days": 0,
      "stock_threshold": 0,
      "trend_reason": "Why this product is popular"
    }
  ]
}

IMPORTANT RULES:
- Always suggest realistic prices based on current market rates
- Shelf locations should follow format: Letter-Number (e.g., A-12, B-05)
- Stock quantities should be reasonable (20-100 units)
- Expiry days should be realistic for product type
- Stock threshold should be 20-30% of initial stock
- Focus on products that are actually trending and popular online
- Consider seasonal trends and health/wellness trends`
  });

  const response = await supportAgent.run(userInput);
  return response;
};

// Helper to extract JSON from markdown/code block and AgentKit output
function extractAIJson(agentResponse) {
  let content = agentResponse;

  // If AgentKit AgentResult object
  if (content && content.output && Array.isArray(content.output) && content.output[0].content) {
    content = content.output[0].content;
  }

  // If markdown code block
  if (typeof content === 'string' && content.trim().startsWith('```json')) {
    // Remove both the starting and ending code block markers
    content = content.replace(/^```json\s*/, '').replace(/```$/, '').trim();
  } else if (typeof content === 'string' && content.trim().startsWith('```')) {
    // Remove generic code block markers if present
    content = content.replace(/^```\w*\s*/, '').replace(/```$/, '').trim();
  }

  // Parse JSON
  if (typeof content === 'string') {
    return JSON.parse(content);
  }
  return content;
}

// Function to add products to database and purchase list
const addProductsToDatabase = async (agentResponse) => {
  try {
    let data = agentResponse;
    if (typeof agentResponse === 'string' || (agentResponse && agentResponse.output)) {
      data = extractAIJson(agentResponse);
    }
    const results = {
      categories_created: [],
      products_added: [],
      purchase_list_items: []
    };

    if (data.type === "trending_recommendations") {
      // Handle trending products across existing categories
      for (const [categoryName, products] of Object.entries(data.categories)) {
        // Find or create category
        let category = await Category.findOne({ category: categoryName });
        if (!category) {
          category = new Category({
            category: categoryName,
            products: [],
            total_category_items: 0
          });
          await category.save();
          results.categories_created.push(categoryName);
        }

        // Add products to category
        for (const productData of products) {
          const expiryDate = new Date();
          expiryDate.setDate(expiryDate.getDate() + productData.expiry_days);

          const newProduct = new Product({
            product_name: productData.product_name,
            category: category._id,
            price: productData.price,
            shelf: productData.shelf,
            stock_quantity: productData.stock_quantity,
            expiry_date: expiryDate,
            stock_threshold: productData.stock_threshold
          });

          await newProduct.save();

          // Update category
          category.products.push(newProduct._id);
          category.total_category_items += 1;
          await category.save();

          results.products_added.push({
            name: productData.product_name,
            category: categoryName,
            price: productData.price
          });

          // Add to purchase list
          results.purchase_list_items.push({
            product_id: newProduct._id,
            product_name: productData.product_name,
            category: categoryName,
            quantity_to_order: productData.stock_quantity,
            estimated_cost: productData.price * productData.stock_quantity,
            priority: "Medium",
            reason: "Trending Product - " + (productData.trend_reason || "High demand")
          });
        }
      }
    }
    else if (data.type === "new_category") {
      // Handle new category creation
      const newCategory = new Category({
        category: data.category_name,
        products: [],
        total_category_items: 0
      });
      await newCategory.save();
      results.categories_created.push(data.category_name);

      // Add products to new category
      for (const productData of data.products) {
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + productData.expiry_days);

        const newProduct = new Product({
          product_name: productData.product_name,
          category: newCategory._id,
          price: productData.price,
          shelf: productData.shelf,
          stock_quantity: productData.stock_quantity,
          expiry_date: expiryDate,
          stock_threshold: productData.stock_threshold
        });

        await newProduct.save();

        // Update category
        newCategory.products.push(newProduct._id);
        newCategory.total_category_items += 1;
        await newCategory.save();

        results.products_added.push({
          name: productData.product_name,
          category: data.category_name,
          price: productData.price
        });

        // Add to purchase list
        results.purchase_list_items.push({
          product_id: newProduct._id,
          product_name: productData.product_name,
          category: data.category_name,
          quantity_to_order: productData.stock_quantity,
          estimated_cost: productData.price * productData.stock_quantity,
          priority: "Medium",
          reason: "New Category Product - " + (productData.trend_reason || "Market expansion")
        });
      }
    }

    return results;
  } catch (error) {
    console.error('Error adding products to database:', error);
    throw error;
  }
};

// Main function to handle user requests
const handleProductRecommendation = async (userInput) => {
  try {
    // Get existing categories from database
    const existingCategories = await Category.find({}, 'category total_category_items');

    // Get AI recommendation
    const agentResponse = await recommendationProduct(userInput, existingCategories);

    // Extract JSON from markdown/AgentKit output
    let aiData = agentResponse;
    if (typeof agentResponse === 'string' || (agentResponse && agentResponse.output)) {
      aiData = extractAIJson(agentResponse);
    }

    // Add products to database
    const dbResults = await addProductsToDatabase(aiData);

    // Return combined response
    return {
      ai_response: aiData,
      database_results: dbResults,
      success: true,
      message: `Successfully processed ${dbResults.products_added.length} products across ${dbResults.categories_created.length} categories`
    };

  } catch (error) {
    console.error('Error in handleProductRecommendation:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Example usage functions
const getTrendingProducts = async () => {
  const userInput = "What are the famous products that most people are buying online that we should stock in our store?";
  return await handleProductRecommendation(userInput);
};

const createNewCategory = async (categoryName) => {
  const userInput = `Create a new category called "${categoryName}" and suggest popular products for this category`;
  return await handleProductRecommendation(userInput);
};

// API endpoint examples
const setupRoutes = (app) => {
  // Get trending product recommendations
  app.post('/api/recommendations/trending', async (req, res) => {
    try {
      const result = await getTrendingProducts();
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Create new category with products
  app.post('/api/recommendations/new-category', async (req, res) => {
    try {
      const { categoryName } = req.body;
      if (!categoryName) {
        return res.status(400).json({ error: 'Category name is required' });
      }

      const result = await createNewCategory(categoryName);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Handle custom chat input
  app.post('/api/recommendations/chat', async (req, res) => {
    try {
      const { message } = req.body;
      if (!message) {
        return res.status(400).json({ error: 'Message is required' });
      }

      const result = await handleProductRecommendation(message);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
};

export {
  recommendationProduct,
  addProductsToDatabase,
  handleProductRecommendation,
  getTrendingProducts,
  createNewCategory,
  setupRoutes
};