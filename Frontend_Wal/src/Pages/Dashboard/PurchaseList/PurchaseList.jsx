import React, { useEffect, useState } from "react";
import Header from "../../../components/Header";
import DashboardNav from "../../../components/DashboardNav";
import axios from "axios";

function getPriorityStyles(priority) {
  if (priority === "High") return "bg-red-200 text-red-700";
  if (priority === "Medium") return "bg-yellow-100 text-yellow-800";
  return "bg-gray-100 text-gray-700";
}

function getCardStyles(priority) {
  if (priority === "High") return "bg-red-50 border border-red-200";
  if (priority === "Medium") return "bg-yellow-50 border border-yellow-200";
  return "bg-gray-50 border";
}

function PurchaseList() {
  const [purchaseRecommendations, setPurchaseRecommendations] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/v1/purchase-recommendations")
      .then((res) => {
        setPurchaseRecommendations(res.data.data || []);
      })
      .catch((err) => {
        console.error("Error fetching purchase recommendations:", err);
      });
  }, []);

  const getOrderInfo = (item) => {
    const orderQty = Math.max(item.minimum - item.current, 0);
    const estCost = orderQty * item.unitCost;
    return { orderQty, estCost };
  };

  // Count total items recommended
  const totalItems = purchaseRecommendations.reduce(
    (sum, cat) => sum + cat.items.length,
    0
  );

  // Calculate order summary
  let totalUnits = 0;
  let totalCost = 0;
  purchaseRecommendations.forEach((cat) => {
    cat.items.forEach((item) => {
      const { orderQty, estCost } = getOrderInfo(item);
      totalUnits += orderQty;
      totalCost += estCost;
    });
  });

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 px-4 py-6">
        <DashboardNav />
        <div className="max-w-5xl mx-auto bg-white rounded-xl shadow p-8">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-green-700 mb-1">
            <span role="img" aria-label="cart">
              🛒
            </span>{" "}
            Purchase Recommendations
          </h2>
          <div className="text-gray-500 mb-6">
            Organized by category - {totalItems} items recommended
          </div>
          {purchaseRecommendations.map((cat) => (
            <div key={cat.category} className="mb-8">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-blue-600 text-xl">📦</span>
                <span className="font-bold text-lg">{cat.category}</span>
              </div>
              {cat.items.map((item) => {
                const { orderQty, estCost } = getOrderInfo(item);
                return (
                  <div
                    key={item.name}
                    className={`${getCardStyles(
                      item.priority
                    )} rounded-lg px-6 py-4 flex flex-col md:flex-row md:items-center md:justify-between mb-4`}
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-base">
                          {item.name}
                        </span>
                        <span
                          className={`text-xs font-semibold px-2 py-0.5 rounded ${getPriorityStyles(
                            item.priority
                          )}`}
                        >
                          {item.priority} Priority
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 mb-1">
                        Reason: {item.reason}
                      </div>
                      <div className="text-sm text-gray-600">
                        Current Stock: {item.current} | Minimum: {item.minimum}
                      </div>
                      <div className="text-sm text-gray-600">
                        Supplier: {item.supplier}
                      </div>
                    </div>
                    <div className="flex flex-col items-end mt-3 md:mt-0">
                      <span className="font-bold text-lg mb-1">
                        {orderQty} units
                      </span>
                      <span className="text-sm text-gray-700 mb-2">
                        Est. Cost: ${estCost.toFixed(2)}
                      </span>
                      <button className="bg-green-600 hover:bg-green-700 text-white text-xs font-semibold px-4 py-2 rounded transition">
                        Add to Order
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
          {/* Order Summary */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-8">
            <h3 className="font-semibold text-blue-900 mb-2">Order Summary</h3>
            <div className="text-sm text-blue-900 mb-1">
              <span className="font-semibold">Total Items:</span> {totalUnits} units
            </div>
            <div className="text-sm text-blue-900 mb-4">
              <span className="font-semibold">Estimated Total Cost:</span> ${totalCost.toFixed(2)}
            </div>
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded transition text-base">
              Generate Purchase Order
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default PurchaseList;