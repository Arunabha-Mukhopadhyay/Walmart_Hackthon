import React, { useEffect, useState, useRef, useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import Sidebar from "../../../components/Sidebar";

const ROWS = ["A", "B", "C"];
const COLS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17];

function Navigation() {
  const location = useLocation();
  const selectedItems = location.state?.selectedItems || [];
  const [shelves, setShelves] = useState([]);
  const containerRef = useRef(null);
  const [pathPoints, setPathPoints] = useState([]);
  const [orderedShelfCodes, setOrderedShelfCodes] = useState([]);

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

  const sortByDistance = (points) => {
    if (points.length === 0) return [];
    const visited = [];
    let current = points[0];
    visited.push(current);

    while (visited.length < points.length) {
      let nearest = null;
      let minDist = Infinity;

      for (let p of points) {
        if (visited.includes(p)) continue;
        const dist = Math.abs(current.x - p.x) + Math.abs(current.y - p.y);
        if (dist < minDist) {
          minDist = dist;
          nearest = p;
        }
      }

      visited.push(nearest);
      current = nearest;
    }

    return visited;
  };

  useLayoutEffect(() => {
    const updatePath = () => {
      const coords = highlightedShelves
        .map((code) => {
          const el = document.getElementById(`shelf-${code}`);
          if (!el || !containerRef.current) return null;

          const elRect = el.getBoundingClientRect();
          const containerRect = containerRef.current.getBoundingClientRect();

          return {
            x: elRect.left + elRect.width / 2 - containerRect.left,
            y: elRect.top + elRect.height / 2 - containerRect.top,
            code,
          };
        })
        .filter(Boolean);

      const sorted = sortByDistance(coords);

      const same =
        pathPoints.length === sorted.length &&
        pathPoints.every(
          (pt, i) =>
            pt.x === sorted[i].x &&
            pt.y === sorted[i].y &&
            pt.code === sorted[i].code
        );

      if (!same) {
        setPathPoints(sorted);
        setOrderedShelfCodes(sorted.map((p) => p.code));
      }
    };

    const timeout = setTimeout(updatePath, 0);
    return () => clearTimeout(timeout);
  }, [highlightedShelves.join(","), shelves.length]);

  return (
    <div className="flex min-h-screen font-sans">
      <Sidebar />
      <main className="flex-1 bg-gray-100 p-8">
        <h1 className="text-2xl font-bold mb-6">🧭 Store Shelf Navigation</h1>

        <div ref={containerRef} className="relative">
          {/* SVG Path */}
          <svg className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
            <defs>
              <marker
                id="arrowhead"
                markerWidth="10"
                markerHeight="7"
                refX="0"
                refY="3.5"
                orient="auto"
              >
                <polygon points="0 0, 10 3.5, 0 7" fill="red" />
              </marker>
            </defs>
            {pathPoints.map((point, index) => {
              const next = pathPoints[index + 1];
              if (!next) return null;
              return (
                <line
                  key={index}
                  x1={point.x}
                  y1={point.y}
                  x2={next.x}
                  y2={next.y}
                  stroke="red"
                  strokeWidth={2}
                  markerEnd="url(#arrowhead)"
                />
              );
            })}
          </svg>

          {/* Shelf Grid */}
          <div className="grid grid-cols-4 gap-4 relative z-10">
            {ROWS.flatMap((row) =>
              COLS.map((col) => {
                const shelfCode = `${row}-${col < 10 ? `0${col}` : col}`;
                const shelfInfo = getShelfInfo(shelfCode);
                const isHighlighted = highlightedShelves.includes(shelfCode);
                const stepNumber =
                  orderedShelfCodes.indexOf(shelfCode) !== -1
                    ? orderedShelfCodes.indexOf(shelfCode) + 1
                    : null;

                return (
                  <div
                    key={shelfCode}
                    id={`shelf-${shelfCode}`}
                    className={`border rounded-lg h-24 flex flex-col items-center justify-center relative
                      ${isHighlighted
                        ? "bg-blue-100 border-blue-400 text-blue-700"
                        : "bg-white border-gray-300 text-gray-700"
                      }`}
                  >
                    <span className="font-semibold">{shelfCode}</span>

                    {stepNumber && (
                      <div className="absolute top-1 left-1 w-6 h-6 bg-red-600 text-white text-xs rounded-full flex items-center justify-center font-bold">
                        {stepNumber}
                      </div>
                    )}

                    {isHighlighted && (
                      <span className="text-sm text-center px-1">
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
        </div>
      </main>
    </div>
  );
}

export default Navigation;
