"use client";

import { useState } from "react";
import type { DomainId, SignValue } from "@/lib/abstract-interp-explorer-data";
import {
  SIGN_HASSE,
  SIGN_JOIN,
  SIGN_MEET,
  DOMAIN_PROPERTIES,
} from "@/lib/abstract-interp-explorer-data";

interface DomainLatticeTabProps {
  domain: DomainId;
}

// Node positions for SVG Hasse diagrams (cx, cy)
const SIGN_POSITIONS: Record<SignValue, [number, number]> = {
  Top: [150, 30],
  Neg: [50, 100],
  Zero: [150, 100],
  Pos: [250, 100],
  Bot: [150, 170],
};

const CONSTANT_NODES = [
  { id: "Top", label: "Top", x: 150, y: 30 },
  { id: "C-2", label: "Const(-2)", x: 30, y: 100 },
  { id: "C0", label: "Const(0)", x: 110, y: 100 },
  { id: "C1", label: "Const(1)", x: 190, y: 100 },
  { id: "Cdots", label: "...", x: 270, y: 100 },
  { id: "Bot", label: "Bot", x: 150, y: 170 },
];

const INTERVAL_NODES = [
  { id: "Top", label: "[-Inf, +Inf]", x: 150, y: 20 },
  { id: "i1", label: "[0, +Inf]", x: 50, y: 65 },
  { id: "i2", label: "[-Inf, 0]", x: 250, y: 65 },
  { id: "i3", label: "[0, 10]", x: 50, y: 110 },
  { id: "i4", label: "[1, 1]", x: 150, y: 110 },
  { id: "i5", label: "[-5, 0]", x: 250, y: 110 },
  { id: "dots", label: "...", x: 150, y: 145 },
  { id: "Bot", label: "Bot", x: 150, y: 175 },
];

export default function DomainLatticeTab({ domain }: DomainLatticeTabProps) {
  const [selectedA, setSelectedA] = useState<SignValue | null>(null);
  const [selectedB, setSelectedB] = useState<SignValue | null>(null);
  const props = DOMAIN_PROPERTIES[domain];

  const handleSignClick = (v: SignValue) => {
    if (!selectedA) {
      setSelectedA(v);
    } else if (!selectedB) {
      setSelectedB(v);
    } else {
      setSelectedA(v);
      setSelectedB(null);
    }
  };

  const joinResult = selectedA && selectedB ? SIGN_JOIN[`${selectedA},${selectedB}`] : null;
  const meetResult = selectedA && selectedB ? SIGN_MEET[`${selectedA},${selectedB}`] : null;

  return (
    <div className="p-4">
      <h3 className="mb-1 text-sm font-semibold text-navy">{props.name} Domain</h3>
      <p className="mb-4 text-xs text-slate-500">{props.description}</p>

      {/* Properties row */}
      <div className="mb-4 flex flex-wrap gap-3">
        <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5">
          <span className="text-[10px] text-slate-500">Height: </span>
          <span className="text-xs font-medium text-navy">{props.height}</span>
        </div>
        <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5">
          <span className="text-[10px] text-slate-500">Width: </span>
          <span className="text-xs font-medium text-navy">{props.width}</span>
        </div>
        <div className={`rounded-lg border px-3 py-1.5 ${props.needsWidening ? "border-amber-200 bg-amber-50" : "border-emerald-200 bg-emerald-50"}`}>
          <span className="text-[10px] text-slate-500">Widening: </span>
          <span className={`text-xs font-medium ${props.needsWidening ? "text-amber-700" : "text-emerald-700"}`}>
            {props.needsWidening ? "Required" : "Not needed"}
          </span>
        </div>
      </div>

      {/* Hasse diagram */}
      <div className="mb-4 rounded-xl border border-slate-200 bg-white p-2">
        <div className="mb-1 px-2 text-[10px] font-medium text-slate-400">Hasse Diagram</div>
        <svg viewBox="0 0 300 200" className="mx-auto w-full max-w-sm">
          {domain === "sign" && (
            <>
              {/* Edges */}
              {SIGN_HASSE.map((e) => (
                <line
                  key={`${e.from}-${e.to}`}
                  x1={SIGN_POSITIONS[e.from][0]}
                  y1={SIGN_POSITIONS[e.from][1]}
                  x2={SIGN_POSITIONS[e.to][0]}
                  y2={SIGN_POSITIONS[e.to][1]}
                  stroke="#cbd5e1"
                  strokeWidth={1.5}
                />
              ))}
              {/* Nodes */}
              {(Object.entries(SIGN_POSITIONS) as [SignValue, [number, number]][]).map(([v, [cx, cy]]) => {
                const isSelected = v === selectedA || v === selectedB;
                const isResult = v === joinResult || v === meetResult;
                return (
                  <g key={v} onClick={() => handleSignClick(v)} className="cursor-pointer">
                    <circle
                      cx={cx}
                      cy={cy}
                      r={18}
                      fill={isResult ? "#fef3c7" : isSelected ? "#dbeafe" : "white"}
                      stroke={isResult ? "#f59e0b" : isSelected ? "#3b82f6" : "#94a3b8"}
                      strokeWidth={isSelected || isResult ? 2.5 : 1.5}
                    />
                    <text x={cx} y={cy + 4} textAnchor="middle" className="text-[11px] font-medium" fill="#1e293b">
                      {v === "Bot" ? "\u22A5" : v === "Top" ? "\u22A4" : v}
                    </text>
                  </g>
                );
              })}
            </>
          )}

          {domain === "constant" && (
            <>
              {/* Edges from Bot to all constants, from all constants to Top */}
              {CONSTANT_NODES.filter((n) => n.id !== "Top" && n.id !== "Bot" && n.id !== "Cdots").map((n) => (
                <g key={n.id}>
                  <line x1={150} y1={170} x2={n.x} y2={n.y + 10} stroke="#cbd5e1" strokeWidth={1.5} />
                  <line x1={n.x} y1={n.y - 10} x2={150} y2={30 + 10} stroke="#cbd5e1" strokeWidth={1.5} />
                </g>
              ))}
              {/* Dotted lines for ... */}
              <line x1={150} y1={170} x2={270} y2={110} stroke="#cbd5e1" strokeWidth={1.5} strokeDasharray="4,3" />
              <line x1={270} y1={90} x2={150} y2={40} stroke="#cbd5e1" strokeWidth={1.5} strokeDasharray="4,3" />
              {/* Nodes */}
              {CONSTANT_NODES.map((n) => (
                <g key={n.id}>
                  <circle cx={n.x} cy={n.y} r={n.id === "Cdots" ? 14 : 18} fill="white" stroke="#94a3b8" strokeWidth={1.5} />
                  <text x={n.x} y={n.y + 4} textAnchor="middle" className="text-[9px] font-medium" fill="#1e293b">
                    {n.id === "Bot" ? "\u22A5" : n.id === "Top" ? "\u22A4" : n.label}
                  </text>
                </g>
              ))}
            </>
          )}

          {domain === "interval" && (
            <>
              {/* Edges - simplified partial order */}
              <line x1={150} y1={35} x2={50} y2={55} stroke="#cbd5e1" strokeWidth={1.5} />
              <line x1={150} y1={35} x2={250} y2={55} stroke="#cbd5e1" strokeWidth={1.5} />
              <line x1={50} y1={75} x2={50} y2={100} stroke="#cbd5e1" strokeWidth={1.5} />
              <line x1={50} y1={75} x2={150} y2={100} stroke="#cbd5e1" strokeWidth={1.5} />
              <line x1={250} y1={75} x2={250} y2={100} stroke="#cbd5e1" strokeWidth={1.5} />
              <line x1={250} y1={75} x2={150} y2={100} stroke="#cbd5e1" strokeWidth={1.5} />
              {/* Down to dots */}
              <line x1={50} y1={120} x2={150} y2={140} stroke="#cbd5e1" strokeWidth={1.5} strokeDasharray="4,3" />
              <line x1={150} y1={120} x2={150} y2={140} stroke="#cbd5e1" strokeWidth={1.5} strokeDasharray="4,3" />
              <line x1={250} y1={120} x2={150} y2={140} stroke="#cbd5e1" strokeWidth={1.5} strokeDasharray="4,3" />
              <line x1={150} y1={150} x2={150} y2={168} stroke="#cbd5e1" strokeWidth={1.5} strokeDasharray="4,3" />
              {/* Nodes */}
              {INTERVAL_NODES.map((n) => (
                <g key={n.id}>
                  {n.id === "dots" ? (
                    <text x={n.x} y={n.y + 4} textAnchor="middle" className="text-sm" fill="#94a3b8">...</text>
                  ) : (
                    <>
                      <rect
                        x={n.x - (n.label.length > 6 ? 38 : 22)}
                        y={n.y - 12}
                        width={n.label.length > 6 ? 76 : 44}
                        height={24}
                        rx={6}
                        fill="white"
                        stroke="#94a3b8"
                        strokeWidth={1.5}
                      />
                      <text x={n.x} y={n.y + 4} textAnchor="middle" className="text-[9px] font-medium" fill="#1e293b">
                        {n.id === "Bot" ? "\u22A5" : n.label}
                      </text>
                    </>
                  )}
                </g>
              ))}
            </>
          )}
        </svg>
      </div>

      {/* Interactive join/meet for Sign domain */}
      {domain === "sign" && (
        <div className="rounded-xl border border-blue-100 bg-blue-50 p-3">
          <p className="mb-2 text-xs font-medium text-blue-800">
            Click two elements to compute join (least upper bound) and meet (greatest lower bound)
          </p>
          {selectedA && selectedB ? (
            <div className="flex flex-wrap gap-4 text-xs">
              <div>
                <span className="text-blue-600">join(</span>
                <span className="font-semibold text-navy">{selectedA}</span>
                <span className="text-blue-600">, </span>
                <span className="font-semibold text-navy">{selectedB}</span>
                <span className="text-blue-600">) = </span>
                <span className="rounded bg-amber-100 px-1.5 py-0.5 font-bold text-amber-800">{joinResult}</span>
              </div>
              <div>
                <span className="text-blue-600">meet(</span>
                <span className="font-semibold text-navy">{selectedA}</span>
                <span className="text-blue-600">, </span>
                <span className="font-semibold text-navy">{selectedB}</span>
                <span className="text-blue-600">) = </span>
                <span className="rounded bg-amber-100 px-1.5 py-0.5 font-bold text-amber-800">{meetResult}</span>
              </div>
            </div>
          ) : (
            <p className="text-xs text-blue-600">
              {selectedA ? `Selected: ${selectedA} — click another element` : "Click an element in the diagram above"}
            </p>
          )}
        </div>
      )}

      {domain !== "sign" && (
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
          <p className="text-xs text-slate-600">
            {domain === "constant"
              ? "Flat lattice: join(Const(a), Const(b)) = Top when a \u2260 b. Every constant is incomparable to every other. Height = 2, so no widening needed."
              : "Infinite ascending chains: [0,0] \u2291 [0,1] \u2291 [0,2] \u2291 ... This chain never stabilizes, so widening is required to force convergence. Widening jumps the upper bound to +\u221E."}
          </p>
        </div>
      )}
    </div>
  );
}
