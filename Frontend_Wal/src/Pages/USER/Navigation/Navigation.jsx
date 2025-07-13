import React, { useEffect, useState, useRef, useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import Sidebar from "../../../components/Sidebar";

const ROWS = ["A", "B", "C", "D"];
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
    shelves.find((shelf) => shelf.shelf?.toUpperCase() === code);

  const ENTRANCE_POSITION = { x: 500, y: 550 }; // Bottom center of the smaller store

  const getAisleAndPosition = (shelfCode) => {
    const [row, colStr] = shelfCode.split('-');
    const col = parseInt(colStr);
    
    // Block 1: columns 1-9, Block 2: columns 10-17
    const block = col <= 9 ? 1 : 2;
    const positionInBlock = col <= 9 ? col : col - 9;
    
    return { row, col, block, positionInBlock };
  };

  const calculateWalkingDistance = (point1, point2) => {
    // Handle entrance as starting point
    if (point1.code === 'ENTRANCE') {
      const shelf = getAisleAndPosition(point2.code);
      const entranceToBlockDistance = shelf.block === 1 ? 20 : 40;
      const rowDistance = (4 - ROWS.indexOf(shelf.row)) * 15; // Distance from bottom
      return entranceToBlockDistance + rowDistance + shelf.positionInBlock * 2;
    }
    
    if (point2.code === 'ENTRANCE') {
      return calculateWalkingDistance(point2, point1);
    }
    
    const shelf1 = getAisleAndPosition(point1.code);
    const shelf2 = getAisleAndPosition(point2.code);
    
    // If in same block and same row, distance is just horizontal
    if (shelf1.block === shelf2.block && shelf1.row === shelf2.row) {
      return Math.abs(shelf1.positionInBlock - shelf2.positionInBlock) * 2;
    }
    
    // If in same block but different rows
    if (shelf1.block === shelf2.block) {
      return Math.abs(shelf1.positionInBlock - shelf2.positionInBlock) * 2 + 
             Math.abs(ROWS.indexOf(shelf1.row) - ROWS.indexOf(shelf2.row)) * 15;
    }
    
    // If in different blocks, need to go through aisle
    const toAisle1 = shelf1.positionInBlock * 2;
    const fromAisle2 = shelf2.positionInBlock * 2;
    const rowDiff = Math.abs(ROWS.indexOf(shelf1.row) - ROWS.indexOf(shelf2.row)) * 15;
    
    return toAisle1 + fromAisle2 + rowDiff + 25; // 25 is the aisle crossing penalty
  };

  const optimizeRouteFromEntrance = (points) => {
    if (points.length === 0) return [];
    
    // Add entrance as starting point
    const entrancePoint = { 
      x: ENTRANCE_POSITION.x, 
      y: ENTRANCE_POSITION.y, 
      code: 'ENTRANCE' 
    };
    
    // Use a modified nearest neighbor algorithm with layout awareness
    const route = [entrancePoint];
    const remaining = [...points];
    let current = entrancePoint;
    
    while (remaining.length > 0) {
      let bestNext = null;
      let minDistance = Infinity;
      let bestIndex = -1;
      
      remaining.forEach((point, index) => {
        const distance = calculateWalkingDistance(current, point);
        
        // Apply heuristics for better routing
        const shelf = getAisleAndPosition(point.code);
        let penalty = 0;
        
        // Prefer staying in same block if possible
        if (route.length > 1) {
          const lastShelf = route[route.length - 1];
          if (lastShelf.code !== 'ENTRANCE') {
            const lastShelfInfo = getAisleAndPosition(lastShelf.code);
            if (lastShelfInfo.block !== shelf.block) {
              penalty += 10; // Penalty for switching blocks
            }
          }
        }
        
        // Prefer completing rows before moving to next row
        const currentRowShelves = remaining.filter(p => {
          const pShelf = getAisleAndPosition(p.code);
          return pShelf.row === shelf.row && pShelf.block === shelf.block;
        });
        
        if (currentRowShelves.length > 1) {
          penalty -= 5; // Bonus for staying in same row
        }
        
        const totalDistance = distance + penalty;
        
        if (totalDistance < minDistance) {
          minDistance = totalDistance;
          bestNext = point;
          bestIndex = index;
        }
      });
      
      if (bestNext) {
        route.push(bestNext);
        remaining.splice(bestIndex, 1);
        current = bestNext;
      } else {
        break;
      }
    }
    
    return route;
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

      const sorted = optimizeRouteFromEntrance(coords);

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
        setOrderedShelfCodes(sorted.filter(p => p.code !== 'ENTRANCE').map((p) => p.code));
      }
    };

    const timeout = setTimeout(updatePath, 0);
    return () => clearTimeout(timeout);
  }, [highlightedShelves.join(","), shelves.length]);

  const getShelfPosition = (row, col) => {
    const rowIndex = ROWS.indexOf(row);
    const colIndex = col - 1;
    
    // Define shelf blocks based on your drawing
    // Each block contains certain columns with aisles between them
    let blockIndex = 0;
    let positionInBlock = colIndex;
    
    // Block 1: columns 1-9 (A1-A9, B1-B9, etc.)
    if (colIndex < 9) {
      blockIndex = 0;
      positionInBlock = colIndex;
    }
    // Block 2: columns 10-17 (A10-A17, B10-B17, etc.)
    else {
      blockIndex = 1;
      positionInBlock = colIndex - 9;
    }
    
    // Calculate positions with proper spacing for smaller container
    const shelfWidth = 50;
    const shelfHeight = 30;
    const aisleWidth = 40; // Space between blocks
    const rowSpacing = 60;
    
    const startX = 80;
    const startY = 180; // Moved down to make room for the route display
    
    const left = startX + (blockIndex * (9 * shelfWidth + aisleWidth)) + (positionInBlock * shelfWidth);
    const top = startY + (rowIndex * rowSpacing);
    
    return { left, top, shelfWidth, shelfHeight };
  };

  return (
    <div className="flex min-h-screen font-sans">
      <Sidebar />
      <main className="flex-1 bg-gray-100 p-8">
        <h1 className="text-2xl font-bold mb-6">🧭 Store Shelf Navigation</h1>

        {/* Route summary moved to top */}
        {orderedShelfCodes.length > 0 && (
          <div className="mb-6 bg-white border-2 border-gray-300 rounded-lg p-4 shadow-lg max-w-4xl mx-auto">
            <h3 className="font-bold text-lg mb-3 text-center">🗺️ Optimized Route:</h3>
            <div className="flex flex-wrap items-center justify-center gap-2 mb-3">
              <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full font-semibold text-sm">
                📍 START: Entrance
              </div>
              <div className="text-gray-400">→</div>
              {orderedShelfCodes.map((code, index) => {
                const shelf = getAisleAndPosition(code);
                return (
                  <React.Fragment key={index}>
                    <div className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-semibold text-sm flex items-center gap-1">
                      <span className="bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                        {index + 1}
                      </span>
                      {code}
                      <span className="text-xs text-gray-600">(Block {shelf.block})</span>
                    </div>
                    {index < orderedShelfCodes.length - 1 && (
                      <div className="text-gray-400">→</div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
            <div className="text-center text-sm text-gray-600 border-t pt-3">
              <div className="flex justify-center gap-6">
                <span>✨ Route optimized for shortest walking distance</span>
                <span>🏁 Total stops: {orderedShelfCodes.length}</span>
              </div>
            </div>
          </div>
        )}

        <div
          ref={containerRef}
          className="relative w-[1000px] h-[600px] bg-white border shadow mx-auto overflow-hidden"
        >
          {/* Store entrance indicator */}
          <div 
            style={{
              left: `${ENTRANCE_POSITION.x - 60}px`,
              top: `${ENTRANCE_POSITION.y - 10}px`,
            }}
            className="absolute text-lg font-bold text-gray-600 border-2 border-gray-400 px-4 py-2 bg-gray-100 rounded"
          >
            🚪 ENTRANCE
          </div>

          {/* Starting point indicator at entrance */}
          {pathPoints.length > 0 && (
            <div
              style={{
                left: `${ENTRANCE_POSITION.x - 12}px`,
                top: `${ENTRANCE_POSITION.y - 30}px`,
              }}
              className="absolute w-6 h-6 bg-green-500 text-white text-xs rounded-full flex items-center justify-center font-bold z-20 animate-pulse"
            >
              START
            </div>
          )}

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
                  strokeWidth={3}
                  markerEnd="url(#arrowhead)"
                />
              );
            })}
          </svg>

          {/* Shelves arranged in blocks */}
          {ROWS.map((row) =>
            COLS.map((col) => {
              const shelfCode = `${row}-${col < 10 ? `0${col}` : col}`;
              const shelfInfo = getShelfInfo(shelfCode);
              const isHighlighted = highlightedShelves.includes(shelfCode);
              const stepNumber =
                orderedShelfCodes.indexOf(shelfCode) !== -1
                  ? orderedShelfCodes.indexOf(shelfCode) + 1
                  : null;

              const position = getShelfPosition(row, col);

              return (
                <div
                  key={shelfCode}
                  id={`shelf-${shelfCode}`}
                  style={{ 
                    top: `${position.top}px`, 
                    left: `${position.left}px`,
                    width: `${position.shelfWidth}px`,
                    height: `${position.shelfHeight}px`
                  }}
                  className={`absolute text-[10px] border-2 flex flex-col items-center justify-center z-10 rounded
                    ${isHighlighted
                      ? "bg-blue-100 border-blue-500 text-blue-700 shadow-lg"
                      : "bg-white border-gray-400 text-gray-700 hover:bg-gray-50"}`}
                >
                  <span className="font-semibold text-[11px]">{shelfCode}</span>
                  {stepNumber && (
                    <div className="absolute -top-2 -right-2 w-5 h-5 bg-red-600 text-white text-[10px] rounded-full flex items-center justify-center font-bold border-2 border-white">
                      {stepNumber}
                    </div>
                  )}
                  {isHighlighted && (
                    <span className="text-[8px] text-center px-1 mt-1 leading-tight">
                      {
                        selectedItems.find(
                          (item) => item.shelf?.toUpperCase() === shelfCode
                        )?.product_name
                      }
                    </span>
                  )}
                  {!isHighlighted && shelfInfo?.category && (
                    <span className="text-[8px] text-gray-500 mt-1">
                      {shelfInfo.category}
                    </span>
                  )}
                </div>
              );
            })
          )}

          {/* Aisle labels */}
          <div className="absolute top-440 left-250 text-gray-500 font-semibold text-xs">
            AISLE 1
          </div>
          <div className="absolute top-440 left-650 text-gray-500 font-semibold text-xs">
            AISLE 2
          </div>
        </div>
      </main>
    </div>
  );
}

export default Navigation;