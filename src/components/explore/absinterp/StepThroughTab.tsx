"use client";

import { useState } from "react";
import type { AbstractInterpProgram, DomainId } from "@/lib/abstract-interp-explorer-data";

interface StepThroughTabProps {
  program: AbstractInterpProgram;
  domain: DomainId;
}

export default function StepThroughTab({ program, domain }: StepThroughTabProps) {
  const [step, setStep] = useState(0);
  const maxStep = program.steps.length - 1;
  const current = program.steps[step];

  // Get the value for the selected domain
  const getDomainValue = (v: { sign: string; constant: string; interval: string }) => {
    if (domain === "sign") return v.sign;
    if (domain === "constant") return v.constant;
    return v.interval;
  };

  const domainColor = domain === "sign" ? "purple" : domain === "constant" ? "blue" : "emerald";

  return (
    <div className="p-3">
      {/* Header */}
      <div className="mb-3">
        <h3 className="text-sm font-semibold text-navy">Step-by-Step Abstract Execution</h3>
        <p className="text-xs text-slate-500">
          Watch the abstract environment evolve as each statement executes under the{" "}
          <span className="font-medium capitalize">{domain}</span> domain.
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
        {current.widened && (
          <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-medium text-amber-700">
            Widening!
          </span>
        )}
      </div>

      {/* Current statement */}
      <div className={`mb-3 rounded-lg border p-3 ${current.warning ? "border-red-200 bg-red-50" : current.widened ? "border-amber-200 bg-amber-50" : "border-slate-200 bg-slate-50"}`}>
        <div className="flex items-start justify-between">
          <div>
            <span className="text-[10px] text-slate-400">Line {current.line}</span>
            <div className="font-mono text-sm font-medium text-navy">{current.statement}</div>
          </div>
          {current.warning && (
            <span className="shrink-0 rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-700">
              WARNING
            </span>
          )}
        </div>
        {current.warning && (
          <div className="mt-2 text-xs font-medium text-red-700">{current.warning}</div>
        )}
      </div>

      {/* Environment table */}
      <div className="mb-3 overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              <th className="px-3 py-1.5 text-left font-medium text-slate-600">Variable</th>
              <th className={`px-3 py-1.5 text-left font-medium text-${domainColor}-700`}>
                Abstract Value ({domain === "sign" ? "Sign" : domain === "constant" ? "Constant" : "Interval"})
              </th>
            </tr>
          </thead>
          <tbody>
            {current.env.map((v) => (
              <tr key={v.variable} className="border-b border-slate-100">
                <td className="px-3 py-2 font-mono font-medium text-navy">{v.variable}</td>
                <td className={`px-3 py-2 font-mono text-${domainColor}-700`}>
                  {getDomainValue(v)}
                </td>
              </tr>
            ))}
            {current.env.length === 0 && (
              <tr>
                <td colSpan={2} className="px-3 py-2 text-slate-400 italic">Empty environment</td>
              </tr>
            )}
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
