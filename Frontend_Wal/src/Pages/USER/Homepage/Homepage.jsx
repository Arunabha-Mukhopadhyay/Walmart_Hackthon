import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../../../components/Sidebar";


const Homepage = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/v1/category")
      .then((res) => {
        const allProducts = (res.data.data || []).flatMap((category) =>
          category.products.map((product) => ({
            ...product,
            categoryName: category.category,
            quantity: 0,
          }))
        );
        setProducts(allProducts);
      })
      .catch((err) => console.error("Fetch failed:", err));
  }, []);

  const handleQuantityChange = (id, delta) => {
    setProducts((prev) =>
      prev.map((item) =>
        (item._id || item.id) === id
          ? { ...item, quantity: Math.max(0, item.quantity + delta) }
          : item
      )
    );
  };

  const totalCost = products.reduce(
    (sum, item) => sum + item.quantity * (item.price || 0),
    0
  );

  return (
    <div className="flex min-h-screen font-sans">


      <Sidebar />


      <main className="flex-1 p-8 bg-gray-100">
        <h1 className="text-2xl font-bold mb-6">Products</h1>
        <div className="grid grid-cols-2 gap-4">
          {products.map((item) => (
            <div
              key={item._id}
              className="bg-white p-4 rounded-lg shadow flex justify-between items-center"
            >
              <div>
                <h3 className="font-semibold text-lg">{item.product_name}</h3>
                <p className="text-sm text-gray-600">
                  Category: {item.categoryName} | Shelf: {item.shelf}
                </p>
                <p className="text-sm text-gray-500">${item.price.toFixed(2)}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleQuantityChange(item._id, -1)}
                  className="bg-red-500 text-white px-3 py-1 rounded text-lg"
                >
                  −
                </button>
                <span className="text-md">{item.quantity}</span>
                <button
                  onClick={() => handleQuantityChange(item._id, 1)}
                  className="bg-green-500 text-white px-3 py-1 rounded text-lg"
                >
                  +
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>



      <aside className="w-[260px] bg-white border-l border-gray-200 p-6">
        <h2 className="font-bold text-lg mb-4">Bill Summary</h2>
        <div className="text-gray-800 text-sm">
          {products
            .filter((p) => p.quantity > 0)
            .map((item) => (
              <div key={item._id || item.id} className="flex justify-between mb-2">
                <span>
                  {item.product_name} x {item.quantity}
                </span>
                <span>${(item.quantity * item.price).toFixed(2)}</span>
              </div>
            ))}
        </div>
        <hr className="my-4" />
        <div className="text-lg font-semibold flex justify-between">
          <span>Total:</span>
          <span>${totalCost.toFixed(2)}</span>
        </div>
      </aside>
    </div>
  );
};

export default Homepage;
