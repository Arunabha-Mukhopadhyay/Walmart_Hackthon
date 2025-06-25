import React from "react";

function MidPage() {
  return (
    <section className="py-20 px-2 bg-white mt-9.5 rounded-2xl">
      <div className="max-w-6xl mx-auto">
        
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">
          Dual-Purpose Platform
        </h2>
        <p className="text-gray-600 text-xl text-center mb-12">
          Comprehensive solutions for both staff operations and customer
          experience
        </p>
        
        
        <div className="flex flex-col md:flex-row gap-8 justify-center">
          
          <div className="flex-1 bg-gradient-to-br from-blue-50 to-white rounded-2xl p-8 shadow text-left">

            <div className="flex items-center gap-3 mb-4">
              <div className="bg-blue-600 rounded-xl w-12 h-12 flex items-center justify-center">
               
                <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
                  <rect x="3" y="7" width="18" height="13" rx="2" fill="#fff" />
                  <rect
                    x="1"
                    y="4"
                    width="22"
                    height="4"
                    rx="2"
                    fill="#fff"
                    stroke="#2563eb"
                    strokeWidth="2"
                  />
                  <rect
                    x="7"
                    y="14"
                    width="4"
                    height="6"
                    rx="1"
                    fill="#2563eb"
                  />
                </svg>

              </div>
              <span className="font-semibold text-2xl text-blue-900">
                For Staff
              </span>
            </div>

            <p className="text-blue-700 font-medium mb-6">
              Advanced inventory management and operational efficiency
            </p>

            <ul className="space-y-3 text-blue-900">
              <li className="flex items-center gap-2">
                <span className="text-xl">📦</span>
                <span>Smart inventory tracking by expiry & location</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-xl">📊</span>
                <span>FIFO-based product movement suggestions</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-xl">⏰</span>
                <span>Real-time expiration alerts & notifications</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-xl">📍</span>
                <span>Interactive shelf mapping & visualization</span>
              </li>
            </ul>
          </div>
          
          <div className="flex-1 bg-gradient-to-br from-green-50 to-white rounded-2xl p-8 shadow text-left">

            <div className="flex items-center gap-3 mb-4">
              <div className="bg-green-600 rounded-xl w-12 h-12 flex items-center justify-center">

                <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
                  <rect x="3" y="7" width="18" height="13" rx="2" fill="#fff" />
                  <rect
                    x="1"
                    y="4"
                    width="22"
                    height="4"
                    rx="2"
                    fill="#fff"
                    stroke="#22c55e"
                    strokeWidth="2"
                  />
                  <rect
                    x="7"
                    y="14"
                    width="4"
                    height="6"
                    rx="1"
                    fill="#22c55e"
                  />
                </svg>
              </div>

              <span className="font-semibold text-2xl text-green-900">
                For Customers
              </span>
            </div>

            <p className="text-green-700 font-medium mb-6">
              Intelligent shopping experience with AI-powered assistance
            </p>

            <ul className="space-y-3 text-green-900">
              <li className="flex items-center gap-2">
                <span className="text-xl">📱</span>
                <span>Interactive shopping list builder</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-xl">📍</span>
                <span>Optimized in-store navigation routes</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-xl">📈</span>
                <span>Smart deals & promotion discovery</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-xl">⚡</span>
                <span>
                  <span className="px-1 rounded">
                    AI-powered product recommendations
                  </span>
                </span>
              </li>
            </ul>

          </div>

        </div>
      </div>
    </section>
  );
}

export default MidPage;
