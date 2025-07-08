// Sidebar.jsx
import React from 'react';
import {
  FaShoppingCart,
  FaMapMarkedAlt,
  FaTags,
  FaRobot,
  FaStore,
} from "react-icons/fa";
import { NavLink } from "react-router-dom";

function Sidebar() {
  const navItemClass = ({ isActive }) =>
    `flex items-center gap-2 px-2 py-1 rounded-md ${
      isActive ? "text-blue-600 font-semibold" : "text-gray-800"
    }`;

  return (
    <aside className="w-[220px] bg-white border-r border-gray-200 p-6">
      <div className="font-bold text-xl mb-8 flex items-center gap-2">
        <FaStore className="text-blue-600 text-2xl" />
        WalmartPro
      </div>
      <nav className="flex flex-col gap-5 text-sm">
        <NavLink to="/customer-dashboard" className={navItemClass}>
          <FaShoppingCart /> Shopping List
        </NavLink>
        <NavLink to="/navigation" className={navItemClass}>
          <FaMapMarkedAlt /> Store Navigation
        </NavLink>
        <NavLink to="/deals" className={navItemClass}>
          <FaTags /> Deals & Offers
        </NavLink>
        <NavLink to="/ai" className={navItemClass}>
          <FaRobot /> AI Suggestions
        </NavLink>
      </nav>
    </aside>
  );
}

export default Sidebar;
