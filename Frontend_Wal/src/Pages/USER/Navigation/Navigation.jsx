import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import Sidebar from "../../../components/Sidebar";

const ROWS = ["A", "B", "C"];
const COLS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17];

function Navigation() {
  const location = useLocation();
  const selectedItems = location.state?.selectedItems || [];
  const [shelves, setShelves] = useState([]);

  
  const highlightedShelves = selectedItems.map((item) =>
    item.shelf?.toUpperCase()
  );

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/v1/shelves")
      .then((res) => {
        setShelves(res.data || []);
      })
      .catch((err) => {
        console.error("Error fetching shelves:", err);
      });
  }, []);


  const getShelfInfo = (code) =>
    shelves.find((shelf) => shelf.shelf.toUpperCase() === code);

  
  return (
    <div className="flex min-h-screen font-sans">
      <Sidebar />

      <main className="flex-1 bg-gray-100 p-8">
        <h1 className="text-2xl font-bold mb-6">🧭 Store Shelf Navigation</h1>
        <div className="grid grid-cols-4 gap-4">
          {ROWS.flatMap((row) =>
            COLS.map((col) => {
              const shelfCode = `${row}-${col < 10 ? `0${col}` : col}`;
              const shelfInfo = getShelfInfo(shelfCode);
              const isHighlighted = highlightedShelves.includes(shelfCode);

              return (
                <div
                  key={shelfCode}
                  className={`border rounded-lg h-24 flex flex-col items-center justify-center
                    ${isHighlighted
                      ? "bg-blue-100 border-blue-400 text-blue-700"
                      : "bg-white border-gray-300 text-gray-700"
                    }`}
                >
                  <span className="font-semibold">{shelfCode}</span>
                  {isHighlighted && (
                    <span className="text-sm">
                      {
                        selectedItems.find(
                          (item) =>
                            item.shelf?.toUpperCase() === shelfCode
                        )?.product_name
                      }
                    </span>
                  )}
                  {!isHighlighted && shelfInfo?.category && (
                    <span className="text-xs text-gray-500">
                      {shelfInfo.category}
                    </span>
                  )}
                </div>
              );
            })
          )}
        </div>
      </main>
    </div>
  );
}

export default Navigation;
