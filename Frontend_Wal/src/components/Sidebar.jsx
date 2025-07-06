import React from 'react'
import {
  FaShoppingCart,
  FaMapMarkedAlt,
  FaTags,
  FaRobot,
  FaStore,
} from "react-icons/fa";

function Sidebar() {
  return (
    <>
      <aside className="w-[220px] bg-white border-r border-gray-200 p-6">
        <div className="font-bold text-xl mb-8 flex items-center gap-2">
          <FaStore className="text-blue-600 text-2xl" />
          WalmartPro
        </div>
        <nav className="flex flex-col gap-5 text-gray-800 text-sm">
          <span className="flex items-center gap-2">
            <FaShoppingCart /> Shopping List
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

    </>
  )
}

export default Sidebar