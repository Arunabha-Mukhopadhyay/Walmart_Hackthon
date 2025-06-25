import express from "express";
import {Product} from "../models/products.models.js"; // adjust path as needed

const router = express.Router();

function normalizeShelfName(shelf) {
  if (!shelf) return "";
  shelf = shelf.replace(/^Shelf:\s*/, "");
  const match = shelf.match(/^([A-Z])[-:]?(\d{1,2})$/i);
  if (match) {
    return `${match[1].toUpperCase()}-${match[2].padStart(2, "0")}`;
  }
  return shelf;
}

router.get("/", async (req, res) => {
  try {
    const products = await Product.find().populate("category");

    // Group by normalized shelf
    const shelfMap = {};
    products.forEach((prod) => {
      const normalizedShelf = normalizeShelfName(prod.shelf);
      if (!shelfMap[normalizedShelf]) {
        shelfMap[normalizedShelf] = {
          shelf: normalizedShelf,
          categories: new Set(),
          highlight: true, 
        };
      }
      shelfMap[normalizedShelf].categories.add(
        prod.category?.category || prod.category?.toString() || "Unknown"
      );
    });

    const shelves = Object.values(shelfMap).map((shelf) => ({
      shelf: shelf.shelf,
      categories: Array.from(shelf.categories),
      highlight: shelf.highlight,
    }));

    res.json(shelves);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch shelves" });
  }
});

export default router;