"use client";

import { useState } from "react";
import type { TransformExample } from "@/lib/ast-explorer-data";

interface TransformTabProps {
  transforms: TransformExample[];
}

export default function TransformTab({ transforms }: TransformTabProps) {
  const [activeIdx, setActiveIdx] = useState(0);

  if (transforms.length === 0) {
    return (
      <div className="flex items-center justify-center p-8 text-sm text-slate-400">
        No transformations available for this snippet.
      </div>
    );
  }

  const transform = transforms[activeIdx];

  return (
    <div className="p-3">
      {/* Transform selector */}
      {transforms.length > 1 && (
        <div className="mb-3 flex flex-wrap gap-1.5">
          {transforms.map((t, i) => (
            <button
              key={i}
              onClick={() => setActiveIdx(i)}
              className={`rounded-full px-2.5 py-1 text-xs font-medium transition-colors ${
                i === activeIdx
                  ? "bg-navy text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {i + 1}. {t.name}
            </button>
          ))}
        </div>
      )}

      {/* Transform info */}
      <div className="mb-3 rounded-lg border border-indigo-200 bg-indigo-50 p-3">
        <p className="text-xs font-semibold text-indigo-800">{transform.name}</p>
        <p className="mt-1 text-xs text-indigo-700">{transform.description}</p>
      </div>

      {/* Before / After */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <div>
          <p className="mb-1.5 text-xs font-medium text-slate-500">Before</p>
          <pre className="overflow-x-auto rounded-lg border border-slate-200 bg-slate-900 p-3 text-xs">
            {transform.before.split("\n").map((line, i) => {
              const lineNum = i + 1;
              const isChanged = transform.changedLines.includes(lineNum);
              return (
                <div key={i} className={`flex ${isChanged ? "bg-red-900/30" : ""}`}>
                  <span className="mr-3 inline-block w-4 text-right text-slate-500">{lineNum}</span>
                  <code className={isChanged ? "text-red-300" : "text-slate-300"}>{line || " "}</code>
                </div>
              );
            })}
          </pre>
        </div>
        <div>
          <p className="mb-1.5 text-xs font-medium text-slate-500">After</p>
          <pre className="overflow-x-auto rounded-lg border border-slate-200 bg-slate-900 p-3 text-xs">
            {transform.after.split("\n").map((line, i) => {
              const lineNum = i + 1;
              const isChanged = transform.changedLines.includes(lineNum);
              return (
                <div key={i} className={`flex ${isChanged ? "bg-emerald-900/30" : ""}`}>
                  <span className="mr-3 inline-block w-4 text-right text-slate-500">{lineNum}</span>
                  <code className={isChanged ? "text-emerald-300" : "text-slate-300"}>{line || " "}</code>
                </div>
              );
            })}
          </pre>
        </div>
      </div>

      {/* Step indicator for multi-step transforms */}
      {transforms.length > 1 && (
        <div className="mt-3 flex items-center justify-center gap-1">
          {transforms.map((_, i) => (
            <div
              key={i}
              className={`flex items-center ${i < transforms.length - 1 ? "gap-1" : ""}`}
            >
              <button
                onClick={() => setActiveIdx(i)}
                className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-medium ${
                  i === activeIdx
                    ? "bg-navy text-white"
                    : i < activeIdx
                      ? "bg-navy/30 text-white"
                      : "bg-slate-200 text-slate-500"
                }`}
              >
                {i + 1}
              </button>
              {i < transforms.length - 1 && (
                <div className={`h-0.5 w-4 ${i < activeIdx ? "bg-navy/30" : "bg-slate-200"}`} />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
