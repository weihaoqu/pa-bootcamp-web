"use client";

import { useState } from "react";
import type { SignValue } from "@/lib/abstract-interp-explorer-data";
import { SIGN_HASSE, SIGN_JOIN, SIGN_MEET } from "@/lib/abstract-interp-explorer-data";

const SIGN_POSITIONS: Record<SignValue, [number, number]> = {
  Top: [150, 30],
  Neg: [50, 100],
  Zero: [150, 100],
  Pos: [250, 100],
  Bot: [150, 170],
};

const ADD_TABLE: [SignValue, SignValue, SignValue][] = [
  ["Pos", "Pos", "Pos"],
  ["Pos", "Zero", "Pos"],
  ["Pos", "Neg", "Top"],
  ["Zero", "Zero", "Zero"],
  ["Zero", "Neg", "Neg"],
  ["Neg", "Neg", "Neg"],
];

const MUL_TABLE: [SignValue, SignValue, SignValue][] = [
  ["Pos", "Pos", "Pos"],
  ["Pos", "Neg", "Neg"],
  ["Pos", "Zero", "Zero"],
  ["Neg", "Neg", "Pos"],
  ["Neg", "Zero", "Zero"],
  ["Zero", "Zero", "Zero"],
];

export default function SignDomainSection() {
  const [selectedA, setSelectedA] = useState<SignValue | null>(null);
  const [selectedB, setSelectedB] = useState<SignValue | null>(null);

  const handleClick = (v: SignValue) => {
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
    <section id="sign-domain" className="scroll-mt-20">
      <h2 className="mb-4 text-2xl font-bold text-navy">The Sign Domain</h2>
      <p className="mb-4 text-slate-600">
        The simplest useful abstract domain: every integer is either <strong>negative</strong>,{" "}
        <strong>zero</strong>, or <strong>positive</strong>. Add <strong>Bot</strong> (unreachable)
        and <strong>Top</strong> (unknown sign) to form a complete lattice.
      </p>

      {/* Interactive Hasse diagram */}
      <div className="mb-6 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 bg-slate-50 px-4 py-3">
          <span className="text-sm font-medium text-navy">Interactive Sign Lattice</span>
          <span className="ml-2 text-xs text-slate-500">Click two elements to compute join &amp; meet</span>
        </div>
        <div className="p-6">
          <svg viewBox="0 0 300 200" className="mx-auto w-full max-w-xs">
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
            {(Object.entries(SIGN_POSITIONS) as [SignValue, [number, number]][]).map(([v, [cx, cy]]) => {
              const isSelected = v === selectedA || v === selectedB;
              const isResult = v === joinResult || v === meetResult;
              return (
                <g key={v} onClick={() => handleClick(v)} className="cursor-pointer">
                  <circle
                    cx={cx}
                    cy={cy}
                    r={20}
                    fill={isResult ? "#fef3c7" : isSelected ? "#dbeafe" : "white"}
                    stroke={isResult ? "#f59e0b" : isSelected ? "#3b82f6" : "#94a3b8"}
                    strokeWidth={isSelected || isResult ? 2.5 : 1.5}
                  />
                  <text x={cx} y={cy + 5} textAnchor="middle" className="text-xs font-semibold" fill="#1e293b">
                    {v === "Bot" ? "\u22A5" : v === "Top" ? "\u22A4" : v}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Results */}
          {selectedA && selectedB ? (
            <div className="mt-4 flex flex-wrap justify-center gap-6 text-sm">
              <div>
                <span className="text-slate-500">join(</span>
                <span className="font-semibold text-navy">{selectedA}</span>
                <span className="text-slate-500">, </span>
                <span className="font-semibold text-navy">{selectedB}</span>
                <span className="text-slate-500">) = </span>
                <span className="rounded bg-amber-100 px-2 py-0.5 font-bold text-amber-800">{joinResult}</span>
              </div>
              <div>
                <span className="text-slate-500">meet(</span>
                <span className="font-semibold text-navy">{selectedA}</span>
                <span className="text-slate-500">, </span>
                <span className="font-semibold text-navy">{selectedB}</span>
                <span className="text-slate-500">) = </span>
                <span className="rounded bg-amber-100 px-2 py-0.5 font-bold text-amber-800">{meetResult}</span>
              </div>
            </div>
          ) : (
            <p className="mt-4 text-center text-xs text-slate-400">
              {selectedA ? `Selected: ${selectedA} — click another` : "Click two elements above"}
            </p>
          )}
        </div>
      </div>

      {/* Arithmetic tables */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <h3 className="mb-2 text-sm font-semibold text-navy">Abstract Addition</h3>
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="px-2 py-1 text-left text-slate-500">a</th>
                <th className="px-2 py-1 text-left text-slate-500">b</th>
                <th className="px-2 py-1 text-left text-slate-500">a + b</th>
              </tr>
            </thead>
            <tbody>
              {ADD_TABLE.map(([a, b, r], i) => (
                <tr key={i} className="border-b border-slate-100">
                  <td className="px-2 py-1 font-medium text-navy">{a}</td>
                  <td className="px-2 py-1 font-medium text-navy">{b}</td>
                  <td className={`px-2 py-1 font-bold ${r === "Top" ? "text-amber-600" : "text-emerald-700"}`}>{r}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <h3 className="mb-2 text-sm font-semibold text-navy">Abstract Multiplication</h3>
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="px-2 py-1 text-left text-slate-500">a</th>
                <th className="px-2 py-1 text-left text-slate-500">b</th>
                <th className="px-2 py-1 text-left text-slate-500">a * b</th>
              </tr>
            </thead>
            <tbody>
              {MUL_TABLE.map(([a, b, r], i) => (
                <tr key={i} className="border-b border-slate-100">
                  <td className="px-2 py-1 font-medium text-navy">{a}</td>
                  <td className="px-2 py-1 font-medium text-navy">{b}</td>
                  <td className={`px-2 py-1 font-bold ${r === "Top" ? "text-amber-600" : "text-emerald-700"}`}>{r}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3">
        <p className="text-xs font-medium text-amber-800">Loss of Precision</p>
        <p className="mt-1 text-xs text-amber-700">
          Notice: <code className="rounded bg-amber-100 px-1">Pos + Neg = Top</code>. We don&apos;t know if 5 + (-3) is positive
          or negative without the actual values. This is the fundamental trade-off: we gain coverage of all inputs
          but lose some precision. Also: <code className="rounded bg-amber-100 px-1">x * x</code> is always non-negative,
          but sign analysis says <code className="rounded bg-amber-100 px-1">Top * Top = Top</code> — it can&apos;t track correlations.
        </p>
      </div>
    </section>
  );
}
