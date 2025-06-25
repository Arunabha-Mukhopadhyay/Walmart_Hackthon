import React from "react";
import { useNavigate } from "react-router-dom";

function Header() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:3000/api/v1/users/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.error("Logout failed:", err);
    }
    navigate("/login");
  };

  return (
    <div>
      <header className="flex justify-between items-center mb-5">
        <div className="flex m-3 items-center gap-2">
          <span className="bg-blue-100 p-2 rounded-lg">
            <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
              <path
                d="M4 7V5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2"
                stroke="#2563eb"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <rect
                x="2"
                y="7"
                width="20"
                height="14"
                rx="2"
                stroke="#2563eb"
                strokeWidth="2"
              />
            </svg>
          </span>
          <h1 className="text-2xl font-bold text-blue-900">Staff Dashboard</h1>
        </div>
        <button
          className="border px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition"
          onClick={handleLogout}
        >
          Logout
        </button>
      </header>
    </div>
  );
}

export default Header;
