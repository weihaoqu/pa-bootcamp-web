"use client";

import { useState } from "react";
import type { ReachingDefBlockInfo } from "@/lib/cfg-explorer-data";

interface ReachingDefsTabProps {
  reachingDefs: ReachingDefBlockInfo[];
  onHighlightBlock: (blockId: string | null) => void;
}

export default function ReachingDefsTab({ reachingDefs, onHighlightBlock }: ReachingDefsTabProps) {
  const maxIter = Math.max(...reachingDefs.map((r) => r.iterations.length)) - 1;
  const [iteration, setIteration] = useState(0);

  // Filter out ENTRY/EXIT for gen/kill display if they're empty
  const dataBlocks = reachingDefs.filter(
    (r) => r.gen.length > 0 || r.kill.length > 0 || r.iterations.some((it) => it.in.length > 0 || it.out.length > 0),
  );
  const allBlocks = reachingDefs;

  return (
    <div className="p-3">
      {/* Header */}
      <div className="mb-3">
        <h3 className="text-sm font-semibold text-navy">Reaching Definitions</h3>
        <p className="text-xs text-slate-500">
          Forward may-analysis: OUT = gen ∪ (IN − kill). Definitions &quot;reach&quot; a point if there&apos;s a path where they aren&apos;t killed.
        </p>
      </div>

      {/* Gen/Kill table */}
      {dataBlocks.length > 0 && (
        <div className="mb-4 overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-2 py-1.5 text-left font-medium text-slate-600">Block</th>
                <th className="px-2 py-1.5 text-left font-medium text-emerald-700">gen</th>
                <th className="px-2 py-1.5 text-left font-medium text-red-700">kill</th>
              </tr>
            </thead>
            <tbody>
              {dataBlocks.map((r) => (
                <tr
                  key={r.blockId}
                  className="border-b border-slate-100 hover:bg-slate-50 cursor-pointer"
                  onMouseEnter={() => onHighlightBlock(r.blockId)}
                  onMouseLeave={() => onHighlightBlock(null)}
                >
                  <td className="px-2 py-1.5 font-medium text-navy">{r.blockId}</td>
                  <td className="px-2 py-1.5">
                    {r.gen.length > 0 ? (
                      <span className="text-emerald-700">{`{${r.gen.join(", ")}}`}</span>
                    ) : (
                      <span className="text-slate-400">∅</span>
                    )}
                  </td>
                  <td className="px-2 py-1.5">
                    {r.kill.length > 0 ? (
                      <span className="text-red-700">{`{${r.kill.join(", ")}}`}</span>
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

      {/* IN/OUT iteration table */}
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
            {allBlocks.map((r) => {
              const it = r.iterations[Math.min(iteration, r.iterations.length - 1)];
              return (
                <tr
                  key={r.blockId}
                  className="border-b border-slate-100 hover:bg-slate-50 cursor-pointer"
                  onMouseEnter={() => onHighlightBlock(r.blockId)}
                  onMouseLeave={() => onHighlightBlock(null)}
                >
                  <td className="px-2 py-1.5 font-medium text-navy">{r.blockId}</td>
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
      <div className="mt-3 rounded-lg border border-blue-100 bg-blue-50 p-2">
        <p className="text-[10px] font-medium text-blue-800">
          Transfer function: OUT[B] = gen[B] ∪ (IN[B] − kill[B])
        </p>
        <p className="text-[10px] text-blue-700">
          Join (merge): IN[B] = ∪ OUT[P] for all predecessors P of B
        </p>
      </div>
    </div>
  );
}
