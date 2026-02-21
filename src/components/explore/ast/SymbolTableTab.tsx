"use client";

import { useState, useCallback } from "react";
import type { SymbolEntry } from "@/lib/ast-explorer-data";

const KIND_COLORS: Record<string, { bg: string; text: string }> = {
  variable: { bg: "bg-sky-100", text: "text-sky-700" },
  parameter: { bg: "bg-amber-100", text: "text-amber-700" },
  function: { bg: "bg-purple-100", text: "text-purple-700" },
};

interface SymbolTableTabProps {
  symbols: SymbolEntry[];
  scopes: { name: string; parent: string | null; symbols: string[] }[];
  onHighlightLine: (lines: number[]) => void;
}

export default function SymbolTableTab({ symbols, scopes, onHighlightLine }: SymbolTableTabProps) {
  const [selectedSymbol, setSelectedSymbol] = useState<string | null>(null);

  const handleSymbolClick = useCallback((sym: SymbolEntry) => {
    setSelectedSymbol(`${sym.name}-${sym.scope}`);
    onHighlightLine([sym.declarationLine]);
  }, [onHighlightLine]);

  return (
    <div className="p-3">
      {/* Scope visualization */}
      <div className="mb-4">
        <p className="mb-2 text-xs font-medium text-slate-500">Scope chain</p>
        <div className="space-y-0">
          {scopes.map((scope) => {
            const depth = getDepth(scope.name, scopes);
            return (
              <div
                key={scope.name}
                className="rounded-lg border-2 border-dashed p-2.5"
                style={{
                  marginLeft: `${depth * 16}px`,
                  borderColor: depth === 0 ? "#94a3b8" : depth === 1 ? "#60a5fa" : "#a78bfa",
                  backgroundColor: depth === 0 ? "#f8fafc" : depth === 1 ? "#eff6ff" : "#f5f3ff",
                }}
              >
                <div className="mb-1.5 flex items-center gap-1.5">
                  <span
                    className="inline-block rounded px-1.5 py-0.5 text-[10px] font-medium text-white"
                    style={{
                      backgroundColor: depth === 0 ? "#64748b" : depth === 1 ? "#3b82f6" : "#8b5cf6",
                    }}
                  >
                    {scope.name}
                  </span>
                  {scope.parent && (
                    <span className="text-[10px] text-slate-400">
                      parent: {scope.parent}
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-1">
                  {scope.symbols.map((symName) => {
                    const sym = symbols.find((s) => s.name === symName && s.scope === scope.name);
                    if (!sym) return null;
                    const colors = KIND_COLORS[sym.kind] ?? KIND_COLORS.variable;
                    const isSelected = selectedSymbol === `${sym.name}-${sym.scope}`;
                    return (
                      <button
                        key={`${symName}-${scope.name}`}
                        onClick={() => handleSymbolClick(sym)}
                        className={`rounded px-2 py-0.5 text-xs font-medium transition-colors ${colors.bg} ${colors.text} ${
                          isSelected ? "ring-2 ring-amber-400" : "hover:opacity-80"
                        }`}
                      >
                        {symName}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Symbol table */}
      <div>
        <p className="mb-2 text-xs font-medium text-slate-500">Symbol table</p>
        <div className="overflow-hidden rounded-lg border border-slate-200">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-3 py-2 text-left font-medium text-slate-600">Name</th>
                <th className="px-3 py-2 text-left font-medium text-slate-600">Kind</th>
                <th className="px-3 py-2 text-left font-medium text-slate-600">Scope</th>
                <th className="px-3 py-2 text-left font-medium text-slate-600">Line</th>
                {symbols.some((s) => s.type) && (
                  <th className="px-3 py-2 text-left font-medium text-slate-600">Type</th>
                )}
              </tr>
            </thead>
            <tbody>
              {symbols.map((sym, i) => {
                const colors = KIND_COLORS[sym.kind] ?? KIND_COLORS.variable;
                const isSelected = selectedSymbol === `${sym.name}-${sym.scope}`;
                return (
                  <tr
                    key={i}
                    onClick={() => handleSymbolClick(sym)}
                    className={`cursor-pointer border-b border-slate-100 transition-colors ${
                      isSelected ? "bg-amber-50" : "hover:bg-slate-50"
                    }`}
                  >
                    <td className="px-3 py-1.5 font-mono font-medium text-slate-800">{sym.name}</td>
                    <td className="px-3 py-1.5">
                      <span className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${colors.bg} ${colors.text}`}>
                        {sym.kind}
                      </span>
                    </td>
                    <td className="px-3 py-1.5 text-slate-600">{sym.scope}</td>
                    <td className="px-3 py-1.5 text-slate-400">{sym.declarationLine}</td>
                    {symbols.some((s) => s.type) && (
                      <td className="px-3 py-1.5 font-mono text-slate-500">{sym.type ?? "—"}</td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-3 flex gap-3">
        {Object.entries(KIND_COLORS).map(([kind, colors]) => (
          <span key={kind} className="flex items-center gap-1">
            <span className={`inline-block h-2.5 w-2.5 rounded ${colors.bg}`} />
            <span className="text-[10px] text-slate-500">{kind}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

function getDepth(
  scopeName: string,
  scopes: { name: string; parent: string | null }[],
): number {
  let depth = 0;
  let current = scopes.find((s) => s.name === scopeName);
  while (current?.parent) {
    depth++;
    current = scopes.find((s) => s.name === current!.parent);
  }
  return depth;
}
