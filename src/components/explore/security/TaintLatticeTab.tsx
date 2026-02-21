"use client";

import { useState } from "react";
import type { TaintValue } from "@/lib/security-explorer-data";
import { TAINT_HASSE, TAINT_JOIN, TAINT_MEET } from "@/lib/security-explorer-data";

const TAINT_POSITIONS: Record<TaintValue, [number, number]> = {
  Top: [150, 30],
  Untainted: [75, 100],
  Tainted: [225, 100],
  Bot: [150, 170],
};

const TAINT_COLORS: Record<TaintValue, string> = {
  Bot: "#94a3b8",
  Untainted: "#10b981",
  Tainted: "#ef4444",
  Top: "#f59e0b",
};

export default function TaintLatticeTab() {
  const [selectedA, setSelectedA] = useState<TaintValue | null>(null);
  const [selectedB, setSelectedB] = useState<TaintValue | null>(null);

  const handleClick = (v: TaintValue) => {
    if (!selectedA) {
      setSelectedA(v);
    } else if (!selectedB) {
      setSelectedB(v);
    } else {
      setSelectedA(v);
      setSelectedB(null);
    }
  };

  const joinResult = selectedA && selectedB ? TAINT_JOIN[`${selectedA},${selectedB}`] : null;
  const meetResult = selectedA && selectedB ? TAINT_MEET[`${selectedA},${selectedB}`] : null;

  return (
    <div className="p-4">
      <h3 className="mb-1 text-sm font-semibold text-navy">Taint Lattice</h3>
      <p className="mb-4 text-xs text-slate-500">
        4-element flat lattice: Bot &lt; {"{Untainted, Tainted}"} &lt; Top. Tracks whether data is user-controlled (tainted) or safe (untainted).
      </p>

      {/* Properties */}
      <div className="mb-4 flex flex-wrap gap-3">
        <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5">
          <span className="text-[10px] text-slate-500">Height: </span>
          <span className="text-xs font-medium text-navy">2 (finite)</span>
        </div>
        <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5">
          <span className="text-[10px] text-slate-500">Width: </span>
          <span className="text-xs font-medium text-navy">2</span>
        </div>
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5">
          <span className="text-[10px] text-slate-500">Widening: </span>
          <span className="text-xs font-medium text-emerald-700">Not needed</span>
        </div>
      </div>

      {/* Hasse diagram */}
      <div className="mb-4 rounded-xl border border-slate-200 bg-white p-2">
        <div className="mb-1 px-2 text-[10px] font-medium text-slate-400">
          Hasse Diagram — click two elements to compute join &amp; meet
        </div>
        <svg viewBox="0 0 300 200" className="mx-auto w-full max-w-sm">
          {/* Edges */}
          {TAINT_HASSE.map((e) => (
            <line
              key={`${e.from}-${e.to}`}
              x1={TAINT_POSITIONS[e.from][0]}
              y1={TAINT_POSITIONS[e.from][1]}
              x2={TAINT_POSITIONS[e.to][0]}
              y2={TAINT_POSITIONS[e.to][1]}
              stroke="#cbd5e1"
              strokeWidth={1.5}
            />
          ))}
          {/* Nodes */}
          {(Object.entries(TAINT_POSITIONS) as [TaintValue, [number, number]][]).map(([v, [cx, cy]]) => {
            const isSelected = v === selectedA || v === selectedB;
            const isResult = v === joinResult || v === meetResult;
            return (
              <g key={v} onClick={() => handleClick(v)} className="cursor-pointer">
                <circle
                  cx={cx}
                  cy={cy}
                  r={20}
                  fill={isResult ? "#fef3c7" : isSelected ? "#dbeafe" : "white"}
                  stroke={isResult ? "#f59e0b" : isSelected ? "#3b82f6" : TAINT_COLORS[v]}
                  strokeWidth={isSelected || isResult ? 2.5 : 2}
                />
                <text x={cx} y={cy + 4} textAnchor="middle" className="text-[10px] font-semibold" fill={TAINT_COLORS[v]}>
                  {v === "Bot" ? "\u22A5" : v === "Top" ? "\u22A4" : v}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Join/Meet results */}
      {selectedA && selectedB ? (
        <div className="mb-4 rounded-xl border border-blue-100 bg-blue-50 p-3">
          <div className="flex flex-wrap gap-4 text-xs">
            <div>
              <span className="text-blue-600">join(</span>
              <span className="font-semibold" style={{ color: TAINT_COLORS[selectedA] }}>{selectedA}</span>
              <span className="text-blue-600">, </span>
              <span className="font-semibold" style={{ color: TAINT_COLORS[selectedB] }}>{selectedB}</span>
              <span className="text-blue-600">) = </span>
              <span className="rounded bg-amber-100 px-1.5 py-0.5 font-bold text-amber-800">{joinResult}</span>
            </div>
            <div>
              <span className="text-blue-600">meet(</span>
              <span className="font-semibold" style={{ color: TAINT_COLORS[selectedA] }}>{selectedA}</span>
              <span className="text-blue-600">, </span>
              <span className="font-semibold" style={{ color: TAINT_COLORS[selectedB] }}>{selectedB}</span>
              <span className="text-blue-600">) = </span>
              <span className="rounded bg-amber-100 px-1.5 py-0.5 font-bold text-amber-800">{meetResult}</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="mb-4 rounded-xl border border-blue-100 bg-blue-50 p-3">
          <p className="text-xs text-blue-600">
            {selectedA ? `Selected: ${selectedA} — click another element` : "Click an element in the diagram above"}
          </p>
        </div>
      )}

      {/* Key insight */}
      <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
        <p className="text-xs font-medium text-amber-800">Key Property</p>
        <p className="mt-1 text-xs text-amber-700">
          <code className="rounded bg-amber-100 px-1">join(Untainted, Tainted) = Top</code> — if data might be
          tainted OR untainted, we must treat it as potentially tainted (conservative/sound). This is why merge
          points after branches can increase taint levels.
        </p>
      </div>
    </div>
  );
}
