import React from "react";
import { useNavigate } from "react-router-dom";

const navigationItems = [
  { name: "Overview", path: "/dashboard" },
  { name: "Categories", path: "/categories" },
  { name: "Expiring", path: "/expiring" },
  { name: "Low Stock", path: "/low-stock" },
  { name: "Purchase List", path: "/purchase-list" },
  { name: "Shelf Map", path: "/shelf-map" },
  {name:"AI Assistant", path: "/ai-assistant" },
];

function DashboardNav() {
  const navigate = useNavigate();
  return (
    <nav className="flex gap-2 mb-8">
      {navigationItems.map((item) => (
        <button
          key={item.name}
          className={`px-4 py-2 rounded-lg font-medium ${
            window.location.pathname === item.path
              ? "bg-white shadow text-blue-700"
              : "bg-gray-100 text-gray-500"
          }`}
          onClick={() => navigate(item.path)}
        >
          {item.name}
        </button>
      ))}
    </nav>
  );
}

export default DashboardNav;
