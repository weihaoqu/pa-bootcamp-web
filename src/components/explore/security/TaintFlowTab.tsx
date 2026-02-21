"use client";

import { useState } from "react";
import type { SecurityProgram } from "@/lib/security-explorer-data";

interface TaintFlowTabProps {
  program: SecurityProgram;
}

const TAINT_BG: Record<string, string> = {
  Tainted: "bg-red-100 text-red-800",
  Untainted: "bg-emerald-100 text-emerald-800",
  Top: "bg-amber-100 text-amber-800",
  Bot: "bg-slate-100 text-slate-500",
};

export default function TaintFlowTab({ program }: TaintFlowTabProps) {
  const [step, setStep] = useState(0);
  const maxStep = program.steps.length - 1;
  const current = program.steps[step];

  return (
    <div className="p-3">
      {/* Header */}
      <div className="mb-3">
        <h3 className="text-sm font-semibold text-navy">Taint Flow Trace</h3>
        <p className="text-xs text-slate-500">
          Watch taint propagate statement-by-statement. Red = Tainted (user-controlled), green = Untainted (safe).
        </p>
      </div>

      {/* Stepper controls */}
      <div className="mb-3 flex items-center gap-3">
        <span className="text-xs font-medium text-slate-600">Step:</span>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setStep(Math.max(0, step - 1))}
            disabled={step === 0}
            className="rounded px-2 py-0.5 text-xs font-medium bg-slate-100 text-slate-600 hover:bg-slate-200 disabled:opacity-40"
          >
            &larr; Prev
          </button>
          <span className="min-w-[80px] text-center text-xs font-mono text-navy">
            {step + 1} / {maxStep + 1}
          </span>
          <button
            onClick={() => setStep(Math.min(maxStep, step + 1))}
            disabled={step >= maxStep}
            className="rounded px-2 py-0.5 text-xs font-medium bg-slate-100 text-slate-600 hover:bg-slate-200 disabled:opacity-40"
          >
            Next &rarr;
          </button>
        </div>
        {current.sanitized && (
          <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-medium text-emerald-700">
            Sanitized
          </span>
        )}
      </div>

      {/* Current statement */}
      <div className={`mb-3 rounded-lg border p-3 ${
        current.vulnerability
          ? "border-red-200 bg-red-50"
          : current.sanitized
            ? "border-emerald-200 bg-emerald-50"
            : "border-slate-200 bg-slate-50"
      }`}>
        <div className="flex items-start justify-between">
          <div>
            <span className="text-[10px] text-slate-400">Line {current.line}</span>
            <div className="font-mono text-sm font-medium text-navy">{current.statement}</div>
          </div>
          {current.vulnerability && (
            <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ${
              current.vulnerability.severity === "Critical"
                ? "bg-red-200 text-red-800"
                : current.vulnerability.severity === "High"
                  ? "bg-orange-200 text-orange-800"
                  : "bg-amber-200 text-amber-800"
            }`}>
              {current.vulnerability.severity}
            </span>
          )}
        </div>
        {current.vulnerability && (
          <div className="mt-2 rounded bg-red-100 p-2">
            <div className="text-xs font-bold text-red-800">{current.vulnerability.type}</div>
            <div className="mt-0.5 text-xs text-red-700">{current.vulnerability.message}</div>
          </div>
        )}
        {current.sanitized && (
          <div className="mt-2 rounded bg-emerald-100 p-2 text-xs text-emerald-700">
            {current.sanitized}
          </div>
        )}
      </div>

      {/* Taint environment */}
      <div className="mb-3 overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              <th className="px-3 py-1.5 text-left font-medium text-slate-600">Variable</th>
              <th className="px-3 py-1.5 text-left font-medium text-slate-600">Taint</th>
              <th className="px-3 py-1.5 text-left font-medium text-slate-600">Reason</th>
            </tr>
          </thead>
          <tbody>
            {current.env.map((v) => (
              <tr key={v.variable} className="border-b border-slate-100">
                <td className="px-3 py-2 font-mono font-medium text-navy">{v.variable}</td>
                <td className="px-3 py-2">
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${TAINT_BG[v.taint]}`}>
                    {v.taint}
                  </span>
                </td>
                <td className="px-3 py-2 text-slate-600">{v.reason}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Explanation */}
      <div className="rounded-lg border border-blue-100 bg-blue-50 p-3">
        <p className="text-[10px] font-medium text-blue-800">Explanation</p>
        <p className="mt-1 text-xs text-blue-700">{current.explanation}</p>
      </div>
    </div>
  );
}
