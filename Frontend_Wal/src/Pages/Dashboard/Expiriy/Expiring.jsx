import React, { useState, useEffect } from "react";
import Header from "../../../components/Header";
import DashboardNav from "../../../components/DashboardNav";
import axios from "axios";

function Expiring() {
  const [expiringProducts, setExpiringProducts] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/v1/product/expiring")
      .then((res) => {
        setExpiringProducts(res.data.data || []);
      })
      .catch((err) => {
        console.error("Error fetching expiring products:", err);
      });
  }, []);

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 px-4 py-6">
        <DashboardNav />

        <div className="max-w-5xl mx-auto bg-white rounded-xl shadow p-8">

          <h2 className="flex items-center gap-2 text-lg font-semibold text-red-600 mb-1">
            <span>⏰</span> Products Expiring Soon
          </h2>

          <div className="text-gray-500 mb-6">
            {expiringProducts.length} products require immediate attention
          </div>

          <ul className="space-y-4">

            {expiringProducts.map((item) => (
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
                    Stock: {item.stock_quantity} units | Expires: {new Date(item.expiry_date).toLocaleDateString()}
                  </div>

                </div>

                <div className="flex flex-col items-end mt-2 md:mt-0">

                  <span className="bg-orange-200 text-orange-700 text-xs font-semibold px-3 py-1 rounded-full mb-2">
                    {Math.ceil((new Date(item.expiry_date) - new Date()) / (1000 * 60 * 60 * 24))}{" "}
                    {Math.ceil((new Date(item.expiry_date) - new Date()) / (1000 * 60 * 60 * 24)) === 1 ? "day" : "days"}
                  </span>

                  <span className="text-base font-bold">
                    ${item.price.toFixed(2)}
                  </span>
                </div>
                
              </li>
            ))}
          </ul>

        </div>
      </div>
    </>
  );
}

export default Expiring;