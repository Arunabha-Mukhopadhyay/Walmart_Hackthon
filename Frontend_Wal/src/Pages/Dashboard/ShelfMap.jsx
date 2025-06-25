import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../../components/Header";
import DashboardNav from "../../components/DashboardNav";

// Define rows and columns
const ROWS = ["A", "B", "C", "D"];
const COLS = [1, 2, 3, 4, 5, 6, 7, 8,9,10,11,12,13,14,15];

function ShelfMap() {
  const [shelves, setShelves] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/v1/shelves")
      .then((res) => {
        setShelves(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Helper to find shelf info by matching all possible backend formats
  const getShelfInfo = (id) => {
    // Try A-01, Shelf: A-01, etc.
    return (
      shelves.find((s) => s.shelf === id) ||
      shelves.find((s) => s.shelf === `Shelf: ${id}`)
    );
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 px-4 py-6">
        <DashboardNav />

        

        <div className="mb-2">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <span className="text-lg">📍</span> Store Shelf Map Editor
          </h1>
          <p className="text-gray-500 text-sm">
            Visual layout of store shelves and product locations
          </p>
        </div>

        <div className="bg-white rounded-xl shadow p-6 mt-2">
          {loading ? (
            <div className="text-center text-gray-400 py-12">Loading shelf map...</div>
          ) : (
            <div className="grid grid-cols-4 gap-6">
              {ROWS.map((row) =>
                COLS.map((col) => {
                  // Pad col with leading zero for 2 digits
                  const id = `${row}-${col.toString().padStart(2, "0")}`;
                  const info = getShelfInfo(id);
                  const isOccupied = !!info;
                  return (
                    <div
                      key={id}
                      className={`flex flex-col items-center justify-center border-2 rounded-lg h-32 transition
                        ${
                          isOccupied
                            ? "bg-blue-100 border-blue-300"
                            : "bg-gray-50 border-dashed border-gray-300"
                        }
                      `}
                    >
                      <span
                        className={`font-medium ${
                          isOccupied ? "text-blue-600" : "text-gray-500"
                        }`}
                      >
                        {id}
                      </span>
                      {isOccupied && info.categories && info.categories.length > 0 && (
                        <span className="text-xs text-gray-500 mt-1 text-center">
                          {info.categories.join(", ")}
                        </span>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default ShelfMap;