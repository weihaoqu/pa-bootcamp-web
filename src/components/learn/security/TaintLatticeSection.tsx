"use client";

import { useState } from "react";
import type { TaintValue } from "@/lib/security-explorer-data";
import { TAINT_HASSE, TAINT_JOIN, TAINT_MEET } from "@/lib/security-explorer-data";

const POSITIONS: Record<TaintValue, [number, number]> = {
  Top: [150, 30],
  Untainted: [75, 100],
  Tainted: [225, 100],
  Bot: [150, 170],
};

const COLORS: Record<TaintValue, string> = {
  Bot: "#94a3b8",
  Untainted: "#10b981",
  Tainted: "#ef4444",
  Top: "#f59e0b",
};

const PROPAGATION_RULES: { op: string; a: string; b: string; result: string; why: string }[] = [
  { op: "+", a: "Tainted", b: "Untainted", result: "Tainted", why: "Any tainted operand taints the result" },
  { op: "+", a: "Untainted", b: "Untainted", result: "Untainted", why: "Both safe → result safe" },
  { op: "concat", a: "Tainted", b: "Untainted", result: "Tainted", why: "String concat with tainted = tainted string" },
  { op: "assign", a: "Tainted", b: "—", result: "Tainted", why: "Assigning tainted value propagates taint" },
];

export default function TaintLatticeSection() {
  const [selectedA, setSelectedA] = useState<TaintValue | null>(null);
  const [selectedB, setSelectedB] = useState<TaintValue | null>(null);

  const handleClick = (v: TaintValue) => {
    if (!selectedA) setSelectedA(v);
    else if (!selectedB) setSelectedB(v);
    else { setSelectedA(v); setSelectedB(null); }
  };

  const joinResult = selectedA && selectedB ? TAINT_JOIN[`${selectedA},${selectedB}`] : null;
  const meetResult = selectedA && selectedB ? TAINT_MEET[`${selectedA},${selectedB}`] : null;

  return (
    <section id="taint-lattice" className="scroll-mt-20">
      <h2 className="mb-4 text-2xl font-bold text-navy">The Taint Lattice</h2>
      <p className="mb-4 text-slate-600">
        Taint analysis uses a simple 4-element lattice. Every variable is tracked as one of:
        <strong> Bot</strong> (unreachable), <strong className="text-emerald-700"> Untainted</strong> (safe),
        <strong className="text-red-600"> Tainted</strong> (user-controlled), or
        <strong className="text-amber-600"> Top</strong> (might be either).
      </p>

      {/* Interactive lattice */}
      <div className="mb-6 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 bg-slate-50 px-4 py-3">
          <span className="text-sm font-medium text-navy">Interactive Taint Lattice</span>
          <span className="ml-2 text-xs text-slate-500">Click two elements to compute join &amp; meet</span>
        </div>
        <div className="p-6">
          <svg viewBox="0 0 300 200" className="mx-auto w-full max-w-xs">
            {TAINT_HASSE.map((e) => (
              <line
                key={`${e.from}-${e.to}`}
                x1={POSITIONS[e.from][0]} y1={POSITIONS[e.from][1]}
                x2={POSITIONS[e.to][0]} y2={POSITIONS[e.to][1]}
                stroke="#cbd5e1" strokeWidth={1.5}
              />
            ))}
            {(Object.entries(POSITIONS) as [TaintValue, [number, number]][]).map(([v, [cx, cy]]) => {
              const isSelected = v === selectedA || v === selectedB;
              const isResult = v === joinResult || v === meetResult;
              return (
                <g key={v} onClick={() => handleClick(v)} className="cursor-pointer">
                  <circle
                    cx={cx} cy={cy} r={22}
                    fill={isResult ? "#fef3c7" : isSelected ? "#dbeafe" : "white"}
                    stroke={isResult ? "#f59e0b" : isSelected ? "#3b82f6" : COLORS[v]}
                    strokeWidth={isSelected || isResult ? 2.5 : 2}
                  />
                  <text x={cx} y={cy + 4} textAnchor="middle" className="text-[10px] font-semibold" fill={COLORS[v]}>
                    {v === "Bot" ? "\u22A5" : v === "Top" ? "\u22A4" : v}
                  </text>
                </g>
              );
            })}
          </svg>

          {selectedA && selectedB ? (
            <div className="mt-4 flex flex-wrap justify-center gap-6 text-sm">
              <div>
                <span className="text-slate-500">join(</span>
                <span className="font-semibold" style={{ color: COLORS[selectedA] }}>{selectedA}</span>
                <span className="text-slate-500">, </span>
                <span className="font-semibold" style={{ color: COLORS[selectedB] }}>{selectedB}</span>
                <span className="text-slate-500">) = </span>
                <span className="rounded bg-amber-100 px-2 py-0.5 font-bold" style={{ color: COLORS[joinResult!] }}>{joinResult}</span>
              </div>
              <div>
                <span className="text-slate-500">meet(</span>
                <span className="font-semibold" style={{ color: COLORS[selectedA] }}>{selectedA}</span>
                <span className="text-slate-500">, </span>
                <span className="font-semibold" style={{ color: COLORS[selectedB] }}>{selectedB}</span>
                <span className="text-slate-500">) = </span>
                <span className="rounded bg-amber-100 px-2 py-0.5 font-bold" style={{ color: COLORS[meetResult!] }}>{meetResult}</span>
              </div>
            </div>
          ) : (
            <p className="mt-4 text-center text-xs text-slate-400">
              {selectedA ? `Selected: ${selectedA} — click another` : "Click two elements above"}
            </p>
          )}
        </div>
      </div>

      {/* Propagation rules */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 bg-slate-50 px-4 py-3">
          <span className="text-sm font-medium text-navy">Taint Propagation Rules</span>
        </div>
        <div className="p-4">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="px-2 py-1.5 text-left text-slate-500">Operation</th>
                <th className="px-2 py-1.5 text-left text-slate-500">Input A</th>
                <th className="px-2 py-1.5 text-left text-slate-500">Input B</th>
                <th className="px-2 py-1.5 text-left text-slate-500">Result</th>
                <th className="px-2 py-1.5 text-left text-slate-500">Why</th>
              </tr>
            </thead>
            <tbody>
              {PROPAGATION_RULES.map((r, i) => (
                <tr key={i} className="border-b border-slate-100">
                  <td className="px-2 py-1.5 font-mono font-medium text-navy">{r.op}</td>
                  <td className="px-2 py-1.5">
                    <span className={r.a === "Tainted" ? "text-red-600 font-medium" : "text-emerald-600 font-medium"}>
                      {r.a}
                    </span>
                  </td>
                  <td className="px-2 py-1.5">
                    <span className={r.b === "Tainted" ? "text-red-600 font-medium" : r.b === "Untainted" ? "text-emerald-600 font-medium" : "text-slate-400"}>
                      {r.b}
                    </span>
                  </td>
                  <td className="px-2 py-1.5">
                    <span className={`font-bold ${r.result === "Tainted" ? "text-red-600" : "text-emerald-600"}`}>{r.result}</span>
                  </td>
                  <td className="px-2 py-1.5 text-slate-600">{r.why}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
