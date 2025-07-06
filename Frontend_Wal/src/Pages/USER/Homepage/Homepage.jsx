import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  FaListAlt,
  FaMapMarkedAlt,
  FaTags,
  FaRobot,
  FaSearch,
  FaHeart,
  FaShareAlt,
} from "react-icons/fa";

const Homepage = () => {
  const [shoppingList, setShoppingList] = useState([]);
  const [newItem, setNewItem] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/v1/category")
      .then((res) => {
        setShoppingList(res.data.data || [])
      })
      .catch((err) => {
        console.error("Failed to fetch products:", err);
      });
  }, []);

  const handleAddItem = () => {
    if (!newItem.trim()) return;
    setShoppingList([
      ...shoppingList,
      {
        id: Date.now(),
        name: newItem,
        category: "Other",
        aisle: "-",
        price: 0,
        completed: false,
      },
    ]);
    setNewItem("");
  };

  const handleToggle = (id) => {
    setShoppingList((list) =>
      list.map((item) =>
        (item._id || item.id) === id
          ? { ...item, completed: !item.completed }
          : item
      )
    );
  };

  const handleClearCompleted = () => {
    setShoppingList((list) =>
      list.filter((item) => !item.completed)
    );
  };

  const total = shoppingList.reduce(
    (sum, item) => sum + (item.price || 0),
    0
  );
  const completed = shoppingList.filter((item) => item.completed).length;

  return (
    <div className="flex h-screen font-inter bg-gray-100">
      {/* Sidebar */}
      <aside className="w-[220px] bg-white border-r border-gray-200 p-6">
        <div className="font-bold text-xl mb-8 flex items-center gap-2">
          <img src="/logo192.png" alt="logo" className="w-7 h-7" />
          WalmartPro
        </div>
        <nav className="flex flex-col gap-4 text-gray-700">
          <span className="flex items-center gap-2">
            <FaListAlt /> Shopping List
          </span>
          <span className="flex items-center gap-2">
            <FaMapMarkedAlt /> Store Navigation
          </span>
          <span className="flex items-center gap-2">
            <FaTags /> Deals & Offers
          </span>
          <span className="flex items-center gap-2">
            <FaRobot /> AI Suggestions
          </span>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10 overflow-y-auto">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Shopping Assistant</h1>
          <div className="flex items-center gap-4">
            <span className="bg-gray-200 px-4 py-1 rounded-full font-semibold">
              Customer
            </span>
            <span className="text-xl cursor-pointer">🔔</span>
            <span className="text-xl cursor-pointer">⚙️</span>
            <span className="text-xl cursor-pointer">⤴️</span>
          </div>
        </div>

        <p className="text-gray-500 mt-1 mb-6">
          Smart shopping with optimized routes and deals
        </p>

        {/* Tabs */}
        <div className="flex mb-6 text-sm font-semibold">
          <button className="flex-1 px-4 py-3 bg-white border border-gray-200 border-b-2 border-b-blue-600">
            Shopping List
          </button>
          <button className="flex-1 px-4 py-3 bg-gray-100 border border-gray-200 text-gray-500">
            Navigation
          </button>
          <button className="flex-1 px-4 py-3 bg-gray-100 border border-gray-200 text-gray-500">
            Deals & Offers
          </button>
          <button className="flex-1 px-4 py-3 bg-gray-100 border border-gray-200 text-gray-500">
            AI Suggestions
          </button>
        </div>

        <div className="flex gap-8 flex-wrap">
          {/* Shopping List */}
          <section className="bg-white p-6 rounded-xl shadow-sm flex-1 min-w-[300px]">
            <h2 className="font-semibold text-lg mb-1">My Shopping List</h2>
            <p className="text-sm text-gray-500 mb-4">
              {shoppingList.length} items • {completed} completed
            </p>

            {/* Progress */}
            <div className="bg-gray-200 h-4 rounded mb-4 relative overflow-hidden">
              <div
                className="bg-blue-600 h-full rounded transition-all"
                style={{
                  width: `${
                    shoppingList.length
                      ? (completed / shoppingList.length) * 100
                      : 0
                  }%`,
                }}
              />
              <span className="absolute right-2 top-0 text-xs h-full flex items-center text-gray-700">
                {Math.round(
                  shoppingList.length
                    ? (completed / shoppingList.length) * 100
                    : 0
                )}
                % Complete
              </span>
            </div>

            {/* Add item */}
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                placeholder="Add new item..."
                value={newItem}
                onChange={(e) => setNewItem(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddItem()}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md"
              />
              <button
                onClick={handleAddItem}
                className="bg-blue-600 text-white px-4 text-xl rounded-md"
              >
                +
              </button>
            </div>

            {/* Item List */}
            <div className="divide-y divide-gray-100">
              {shoppingList.map((item) => (
                <div
                  key={item._id || item.id}
                  className="flex items-center gap-3 py-3 text-sm"
                >
                  <input
                    type="checkbox"
                    checked={item.completed}
                    onChange={() => handleToggle(item._id || item.id)}
                  />
                  <div className="flex-1">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-gray-500 text-xs">
                      {(typeof item.category === "string"
                        ? item.category
                        : item.category?.name || "Uncategorized")}{" "}
                      • Aisle {item.aisle || "-"} • $
                      {item.price?.toFixed(2) || "0.00"}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {completed > 0 && (
              <button
                onClick={handleClearCompleted}
                className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
              >
                Clear Completed
              </button>
            )}
          </section>

          {/* Stats and Quick Actions */}
          <aside className="flex flex-col gap-6 flex-1 min-w-[260px]">
            {/* Stats */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="font-semibold text-lg mb-4">Shopping Stats</h3>
              <div className="text-sm mb-2">
                Total Items{" "}
                <span className="float-right">{shoppingList.length}</span>
              </div>
              <div className="text-sm mb-2">
                Completed{" "}
                <span className="float-right text-green-600">
                  {completed}
                </span>
              </div>
              <div className="text-sm mb-2">
                Remaining{" "}
                <span className="float-right text-orange-500">
                  {shoppingList.length - completed}
                </span>
              </div>
              <div className="text-sm font-semibold mt-4">
                Est. Total{" "}
                <span className="float-right">
                  ${total.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="font-semibold text-lg mb-4">Quick Actions</h3>
              <div className="flex flex-col gap-3 text-sm">
                <button className="flex items-center gap-2 text-left hover:text-blue-600">
                  <FaSearch /> Find Product
                </button>
                <button className="flex items-center gap-2 text-left hover:text-blue-600">
                  <FaHeart /> Favorites
                </button>
                <button className="flex items-center gap-2 text-left hover:text-blue-600">
                  <FaShareAlt /> Share List
                </button>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default Homepage;
