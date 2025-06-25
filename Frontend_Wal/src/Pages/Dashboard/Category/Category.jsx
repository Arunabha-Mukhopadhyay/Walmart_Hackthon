import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "../../../components/Header";
import DashboardNav from "../../../components/DashboardNav";

const statusColor = {
  "In Stock": "bg-green-100 text-green-700",
  Low: "bg-yellow-100 text-yellow-700",
};

function getProductStatus(stock, threshold) {
  return stock <= threshold ? "Low" : "In Stock";
}

function Category() {
  const [activeTab, setActiveTab] = useState("All");
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/v1/category")
      .then((res) => {
        setCategories(res.data.data || []);
      })
      .catch((err) => {
        console.error("Error fetching categories:", err);
      });
  }, []);

  const tabs = [
    { label: "All", count: categories.reduce((acc, cat) => acc + (cat.products?.length || 0), 0) },
    ...categories.map((cat) => ({
      label: cat.category,
      count: cat.products?.length || 0,
    })),
  ];

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 px-4 py-6">
        <DashboardNav />

        <div className="flex gap-2 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.label}
              className={`px-4 py-2 rounded-lg font-semibold text-sm ${
                activeTab === tab.label
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700"
              }`}
              onClick={() => setActiveTab(tab.label)}
            >
              {tab.label}{" "}
              <span className="ml-1 text-xs font-normal">({tab.count})</span>
            </button>
          ))}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(activeTab === "All"
            ? categories
            : categories.filter((cat) => cat.category === activeTab)
          ).map((cat) => (
            <div key={cat._id} className="bg-white rounded-xl shadow p-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-blue-600 text-xl">📦</span>
                <span className="font-bold text-lg">{cat.category}</span>
              </div>
              <div className="text-gray-500 text-sm mb-4">
                {cat.products?.length || 0} products
              </div>
              <ul className="space-y-2">
                {cat.products?.map((prod) => (
                  <li
                    key={prod._id}
                    className="flex justify-between items-center bg-gray-50 rounded-lg px-4 py-2"
                  >
                    <div>
                      <div className="font-medium">{prod.product_name}</div>
                      <div className="text-xs text-gray-500">
                        Stock: {prod.stock_quantity} | Shelf: {prod.shelf}
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <div className="font-semibold">
                        ${prod.price.toFixed(2)}
                      </div>
                      <span
                        className={`mt-1 px-2 py-0.5 rounded-full text-xs font-semibold ${
                          statusColor[getProductStatus(prod.stock_quantity, prod.stock_threshold)]
                        }`}
                      >
                        {getProductStatus(prod.stock_quantity, prod.stock_threshold)}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Category;