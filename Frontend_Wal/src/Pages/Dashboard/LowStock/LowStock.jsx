import React, { useState, useEffect } from "react";
import Header from "../../../components/Header";
import DashboardNav from "../../../components/DashboardNav";
import axios from "axios";

function getStatus(current, minimum) {
  const percent = Math.round((current / minimum) * 100);
  if (percent < 50)
    return { label: "Critical Low", color: "bg-orange-200 text-orange-700" };
  return { label: "Low Stock", color: "bg-yellow-100 text-yellow-700" };
}

function LowStock() {
  const [lowStockProducts, setLowStockProducts] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/v1/product/low-stock")
      .then((res) => {
        setLowStockProducts(res.data.data || []);
      })
      .catch((err) => {
        console.error("Error fetching low stock products:", err);
      });
  }, []);

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 px-4 py-6">
        <DashboardNav />
        <div className="max-w-5xl mx-auto bg-white rounded-xl shadow p-8">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-yellow-600 mb-1">
            <span>📉</span> Low Stock Products
          </h2>
          <div className="text-gray-500 mb-6">
            {lowStockProducts.length} products need restocking
          </div>
          <ul className="space-y-4">
            {lowStockProducts.map((item) => {
              const current = item.stock_quantity;
              const minimum = item.stock_threshold;
              const percent = Math.round((current / minimum) * 100);
              const status = getStatus(current, minimum);
              return (
                <li
                  key={item._id}
                  className="bg-orange-50 rounded-lg px-6 py-4 flex flex-col md:flex-row md:items-center md:justify-between border-l-4 border-orange-300"
                >
                  <div>
                    <div className="font-semibold text-lg">{item.product_name}</div>
                    <div className="text-sm text-gray-500">
                    Category: {item.category?.category || ""} | Shelf: {item.shelf}
                    </div>
                    <div className="text-sm text-gray-500">
                      Current: {current} | Minimum: {minimum}
                    </div>
                    {item.supplier && (
                      <div className="text-sm text-gray-500">
                        Supplier: {item.supplier}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col items-end mt-2 md:mt-0">
                    <span className="bg-orange-200 text-orange-700 text-xs font-semibold px-3 py-1 rounded-full mb-2">
                      {status.label}
                    </span>
                    <span className="text-xs text-gray-600">
                      {percent}% of minimum
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </>
  );
}

export default LowStock;