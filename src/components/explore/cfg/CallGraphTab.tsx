"use client";

import { useState, useCallback } from "react";
import type { CFGSnippet } from "@/lib/cfg-explorer-data";

interface CallGraphTabProps {
  snippet: CFGSnippet;
}

const NODE_W = 120;
const NODE_H = 44;
const GAP_X = 60;

export default function CallGraphTab({ snippet }: CallGraphTabProps) {
  const [selectedFn, setSelectedFn] = useState<string | null>(null);

  const cg = snippet.callGraph;

  const handleClick = useCallback((fnId: string) => {
    setSelectedFn((prev) => (prev === fnId ? null : fnId));
  }, []);

  if (!cg) {
    return (
      <div className="p-6 text-center">
        <p className="text-sm text-slate-500">
          Call graph analysis is only available for multi-function snippets.
        </p>
        <p className="mt-2 text-xs text-slate-400">
          Select the &quot;Multi&quot; snippet to explore call graphs, reachability, and recursion detection.
        </p>
      </div>
    );
  }

  const reachable = selectedFn ? new Set(cg.reachableFrom[selectedFn] ?? []) : new Set<string>();

  // Simple horizontal layout
  const nodes = cg.nodes.map((n, i) => ({
    ...n,
    x: i * (NODE_W + GAP_X),
    y: 40,
  }));
  const nodeMap = new Map(nodes.map((n) => [n.id, n]));

  const totalW = nodes.length * NODE_W + (nodes.length - 1) * GAP_X + 80;
  const totalH = NODE_H + 80;

  return (
    <div className="p-3">
      <div className="mb-3">
        <h3 className="text-sm font-semibold text-navy">Call Graph</h3>
        <p className="text-xs text-slate-500">
          Click a function to see its reachable set. Recursive functions are highlighted with a self-loop indicator.
        </p>
      </div>

      <svg viewBox={`-40 0 ${totalW} ${totalH}`} className="w-full" style={{ maxHeight: 180 }}>
        <defs>
          <marker id="cg-arrow" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" fill="#64748b" />
          </marker>
          <marker id="cg-arrow-hl" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" fill="#2563eb" />
          </marker>
        </defs>
        {/* Edges */}
        {cg.edges.map((e, i) => {
          const from = nodeMap.get(e.from);
          const to = nodeMap.get(e.to);
          if (!from || !to) return null;
          const isHighlighted = selectedFn === e.from || (selectedFn !== null && reachable.has(e.to) && reachable.has(e.from));
          return (
            <line
              key={i}
              x1={from.x + NODE_W / 2}
              y1={from.y + NODE_H / 2}
              x2={to.x - NODE_W / 2 + 8}
              y2={to.y + NODE_H / 2}
              stroke={isHighlighted ? "#2563eb" : "#94a3b8"}
              strokeWidth={isHighlighted ? 2 : 1.5}
              markerEnd={isHighlighted ? "url(#cg-arrow-hl)" : "url(#cg-arrow)"}
            />
          );
        })}
        {/* Nodes */}
        {nodes.map((n) => {
          const isSelected = selectedFn === n.id;
          const isReachable = selectedFn !== null && reachable.has(n.id);
          let fill = "#f8fafc";
          let stroke = "#94a3b8";
          if (isSelected) {
            fill = "#dbeafe";
            stroke = "#2563eb";
          } else if (isReachable) {
            fill = "#ecfdf5";
            stroke = "#10b981";
          }
          return (
            <g key={n.id} onClick={() => handleClick(n.id)} className="cursor-pointer">
              <rect
                x={n.x}
                y={n.y}
                width={NODE_W}
                height={NODE_H}
                rx={8}
                fill={fill}
                stroke={stroke}
                strokeWidth={isSelected ? 2.5 : 1.5}
              />
              <text
                x={n.x + NODE_W / 2}
                y={n.y + NODE_H / 2 + 1}
                textAnchor="middle"
                dominantBaseline="middle"
                className="text-[12px] font-semibold"
                fill={isSelected ? "#1e40af" : "#1e293b"}
              >
                {n.name}()
              </text>
              {n.isRecursive && (
                <text
                  x={n.x + NODE_W - 6}
                  y={n.y + 10}
                  textAnchor="end"
                  className="text-[10px]"
                  fill="#f59e0b"
                >
                  ↻
                </text>
              )}
            </g>
          );
        })}
      </svg>

      {/* Reachability info */}
      {selectedFn && (
        <div className="mt-3 rounded-lg border border-blue-100 bg-blue-50 p-3">
          <p className="text-xs font-medium text-blue-800">
            Reachable from {selectedFn}():
          </p>
          <p className="mt-1 text-xs text-blue-700">
            {(cg.reachableFrom[selectedFn] ?? []).length > 0
              ? `{${(cg.reachableFrom[selectedFn] ?? []).join(", ")}}`
              : "∅ (no callees)"}
          </p>
        </div>
      )}

      {/* Legend */}
      <div className="mt-3 grid grid-cols-3 gap-2 text-[10px]">
        <div className="flex items-center gap-1">
          <span className="inline-block h-3 w-3 rounded" style={{ background: "#dbeafe", border: "1.5px solid #2563eb" }} />
          <span className="text-slate-600">Selected</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="inline-block h-3 w-3 rounded" style={{ background: "#ecfdf5", border: "1.5px solid #10b981" }} />
          <span className="text-slate-600">Reachable</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-amber-500">↻</span>
          <span className="text-slate-600">Recursive</span>
        </div>
      </div>
    </div>
  );
}
