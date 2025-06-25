import React from "react";

function Footer() {
  return (
    <footer className="bg-[#181A20] text-white py-12 px-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-12">
        {/* Left Section */}

        <div className="flex-1 min-w-[260px]">
          <div className="flex items-center gap-3">

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
                <rect x="7" y="14" width="4" height="6" rx="1" fill="#2563eb" />
              </svg>
            </div>
            <span className="font-semibold text-2xl">Smart Walmart</span>
          
          </div>

          <p className="text-gray-400 mt-5 mb-6 max-w-xs leading-relaxed">
            Revolutionizing retail management with AI-powered inventory
            solutions and intelligent customer shopping experiences.
          </p>

          <div className="flex gap-4">
            <a href="#" aria-label="Facebook" className={iconClass}>
              f
            </a>
            <a href="#" aria-label="Twitter" className={iconClass}>
              t
            </a>
            <a href="#" aria-label="LinkedIn" className={iconClass}>
              in
            </a>
            <a href="#" aria-label="Instagram" className={iconClass}>
              ig
            </a>
          </div>

        </div>


        {/* Right Section */}

        <div className="flex-1 flex flex-wrap gap-12">

          <div>
            <h4 className={headingClass}>Solutions</h4>
            <ul className={listClass}>
              <li>Inventory Management</li>
              <li>FIFO Optimization</li>
              <li>Expiry Tracking</li>
              <li>Smart Navigation</li>
              <li>AI Recommendations</li>
              <li>Route Optimization</li>
            </ul>
          </div>
          
          <div>
            <h4 className={headingClass}>Resources</h4>
            <ul className={listClass}>
              <li>Documentation</li>
              <li>API Reference</li>
              <li>Help Center</li>
              <li>Video Tutorials</li>
              <li>Case Studies</li>
              <li>Best Practices</li>
            </ul>
          </div>

          <div>
            <h4 className={headingClass}>Company</h4>
            <ul className={listClass}>
              <li>About Us</li>
              <li>Careers</li>
              <li>Press</li>
              <li>Partners</li>
              <li>Contact</li>
              <li>Support</li>
            </ul>
          </div>

        </div>

      </div>
      
      <div className="border-t border-[#23262f] mt-12 pt-6 text-center text-gray-400 text-sm">
        © {new Date().getFullYear()} Smart Walmart. All rights reserved.
      </div>
    </footer>
  );
}

const iconClass =
  "bg-[#23262f] text-white rounded-full w-10 h-10 flex items-center justify-center font-semibold text-lg hover:bg-blue-600 transition-colors";
const headingClass = "text-white font-semibold text-lg mb-4";
const listClass = "space-y-1 text-gray-400 text-base";

export default Footer;
