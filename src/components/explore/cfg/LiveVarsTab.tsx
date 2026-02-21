"use client";

import { useState } from "react";
import type { LiveVarBlockInfo } from "@/lib/cfg-explorer-data";

interface LiveVarsTabProps {
  liveVars: LiveVarBlockInfo[];
  onHighlightBlock: (blockId: string | null) => void;
}

export default function LiveVarsTab({ liveVars, onHighlightBlock }: LiveVarsTabProps) {
  const maxIter = Math.max(...liveVars.map((l) => l.iterations.length)) - 1;
  const [iteration, setIteration] = useState(0);

  const dataBlocks = liveVars.filter(
    (l) => l.use.length > 0 || l.def.length > 0 || l.iterations.some((it) => it.in.length > 0 || it.out.length > 0),
  );
  const allBlocks = liveVars;

  return (
    <div className="p-3">
      {/* Header */}
      <div className="mb-3">
        <h3 className="text-sm font-semibold text-navy">Live Variables</h3>
        <p className="text-xs text-slate-500">
          Backward may-analysis: IN = use ∪ (OUT − def). A variable is &quot;live&quot; at a point if it <em>may</em> be read before being redefined.
        </p>
      </div>

      {/* Use/Def table */}
      {dataBlocks.length > 0 && (
        <div className="mb-4 overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-2 py-1.5 text-left font-medium text-slate-600">Block</th>
                <th className="px-2 py-1.5 text-left font-medium text-emerald-700">use</th>
                <th className="px-2 py-1.5 text-left font-medium text-red-700">def</th>
              </tr>
            </thead>
            <tbody>
              {dataBlocks.map((l) => (
                <tr
                  key={l.blockId}
                  className="border-b border-slate-100 hover:bg-slate-50 cursor-pointer"
                  onMouseEnter={() => onHighlightBlock(l.blockId)}
                  onMouseLeave={() => onHighlightBlock(null)}
                >
                  <td className="px-2 py-1.5 font-medium text-navy">{l.blockId}</td>
                  <td className="px-2 py-1.5">
                    {l.use.length > 0 ? (
                      <span className="text-emerald-700">{`{${l.use.join(", ")}}`}</span>
                    ) : (
                      <span className="text-slate-400">∅</span>
                    )}
                  </td>
                  <td className="px-2 py-1.5">
                    {l.def.length > 0 ? (
                      <span className="text-red-700">{`{${l.def.join(", ")}}`}</span>
                    ) : (
                      <span className="text-slate-400">∅</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Iteration stepper */}
      <div className="mb-3 flex items-center gap-3">
        <span className="text-xs font-medium text-slate-600">Iteration:</span>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIteration(Math.max(0, iteration - 1))}
            disabled={iteration === 0}
            className="rounded px-2 py-0.5 text-xs font-medium bg-slate-100 text-slate-600 hover:bg-slate-200 disabled:opacity-40"
          >
            ← Prev
          </button>
          <span className="min-w-[60px] text-center text-xs font-mono text-navy">
            {iteration === 0 ? "Init" : `Iter ${iteration}`}
          </span>
          <button
            onClick={() => setIteration(Math.min(maxIter, iteration + 1))}
            disabled={iteration >= maxIter}
            className="rounded px-2 py-0.5 text-xs font-medium bg-slate-100 text-slate-600 hover:bg-slate-200 disabled:opacity-40"
          >
            Next →
          </button>
        </div>
        {iteration >= maxIter && (
          <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-medium text-emerald-700">
            Fixpoint!
          </span>
        )}
      </div>

      {/* IN/OUT iteration table (note: backward — IN depends on OUT of successors) */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              <th className="px-2 py-1.5 text-left font-medium text-slate-600">Block</th>
              <th className="px-2 py-1.5 text-left font-medium text-blue-700">IN</th>
              <th className="px-2 py-1.5 text-left font-medium text-purple-700">OUT</th>
            </tr>
          </thead>
          <tbody>
            {allBlocks.map((l) => {
              const it = l.iterations[Math.min(iteration, l.iterations.length - 1)];
              return (
                <tr
                  key={l.blockId}
                  className="border-b border-slate-100 hover:bg-slate-50 cursor-pointer"
                  onMouseEnter={() => onHighlightBlock(l.blockId)}
                  onMouseLeave={() => onHighlightBlock(null)}
                >
                  <td className="px-2 py-1.5 font-medium text-navy">{l.blockId}</td>
                  <td className="px-2 py-1.5">
                    {it.in.length > 0 ? (
                      <span className="text-blue-700">{`{${it.in.join(", ")}}`}</span>
                    ) : (
                      <span className="text-slate-400">∅</span>
                    )}
                  </td>
                  <td className="px-2 py-1.5">
                    {it.out.length > 0 ? (
                      <span className="text-purple-700">{`{${it.out.join(", ")}}`}</span>
                    ) : (
                      <span className="text-slate-400">∅</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Transfer function reminder */}
      <div className="mt-3 rounded-lg border border-amber-100 bg-amber-50 p-2">
        <p className="text-[10px] font-medium text-amber-800">
          Transfer function: IN[B] = use[B] ∪ (OUT[B] − def[B])
        </p>
        <p className="text-[10px] text-amber-700">
          Join (merge): OUT[B] = ∪ IN[S] for all successors S of B
        </p>
      </div>

      {/* Duality note */}
      <div className="mt-2 rounded-lg border border-slate-200 bg-slate-50 p-2">
        <p className="text-[10px] text-slate-600">
          <strong>Duality with Reaching Defs:</strong> Both are may-analyses on the powerset lattice.
          Reaching defs flows <em>forward</em> (gen/kill), live vars flows <em>backward</em> (use/def).
        </p>
      </div>
    </div>
  );
}
