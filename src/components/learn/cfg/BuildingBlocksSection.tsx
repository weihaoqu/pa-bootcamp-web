"use client";

import { useState } from "react";

interface Pattern {
  name: string;
  code: string;
  cfg: string;
  description: string;
}

const PATTERNS: Pattern[] = [
  {
    name: "Sequential",
    code: `x = 1
y = 2
z = x + y`,
    cfg: `ENTRY
  |
 [B1]
  x=1
  y=2
  z=x+y
  |
 EXIT`,
    description:
      "Consecutive statements with no branches form a single basic block. Control flows straight through.",
  },
  {
    name: "If-Else (Diamond)",
    code: `if x > 0 then
  y = 1
else
  y = 2
z = y`,
    cfg: `    ENTRY
      |
   [B1: if x>0]
    /        \\
  true      false
  /            \\
[B2: y=1]  [B3: y=2]
  \\            /
   \\          /
   [B4: z=y]
      |
    EXIT`,
    description:
      'The classic "diamond" pattern. The condition node has two outgoing edges. Both branches merge at a join point.',
  },
  {
    name: "While Loop",
    code: `while x < 10 do
  x = x + 1
y = x`,
    cfg: `  ENTRY
    |
    v
  [B1: while x<10] <--+
   /          \\        |
 true        false     |
 /              \\      |
[B2: x=x+1] ----+  [B3: y=x]
                       |
                     EXIT`,
    description:
      "Loops create a back edge — an edge that points to an earlier block. This back edge is what makes fixpoint iteration necessary.",
  },
];

const BLOCK_BOUNDARY_CODE = `let x = 5          // line 1
let y = x + 1      // line 2
if y > 3 then      // line 3
  let z = y * 2    // line 4
  print(z)         // line 5
else
  print(y)         // line 7
let w = 0           // line 8`;

const CORRECT_BOUNDARIES = [
  { lines: [1, 2], label: "B1: lines 1-2 (sequential before branch)" },
  { lines: [3], label: "B2: line 3 (condition — branch point)" },
  { lines: [4, 5], label: "B3: lines 4-5 (then-branch body)" },
  { lines: [7], label: "B4: line 7 (else-branch body)" },
  { lines: [8], label: "B5: line 8 (join point after if-else)" },
];

export default function BuildingBlocksSection() {
  const [activePattern, setActivePattern] = useState(0);
  const [selectedLines, setSelectedLines] = useState<Set<number>>(new Set());
  const [showBoundaries, setShowBoundaries] = useState(false);

  const pattern = PATTERNS[activePattern];

  const toggleLine = (line: number) => {
    setSelectedLines((prev) => {
      const next = new Set(prev);
      if (next.has(line)) next.delete(line);
      else next.add(line);
      return next;
    });
  };

  return (
    <section id="building-blocks" className="scroll-mt-20">
      <h2 className="mb-4 text-2xl font-bold text-navy">Building Blocks of CFGs</h2>
      <p className="mb-4 text-slate-600">
        A <strong>basic block</strong> is a maximal sequence of consecutive statements with one entry and one exit —
        no branches in or out except at the beginning and end.
      </p>

      {/* CFG Pattern viewer */}
      <div className="mb-6 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 bg-slate-50 px-4 py-3">
          <span className="text-sm font-medium text-navy">CFG Patterns</span>
        </div>
        <div className="p-4">
          <div className="mb-4 flex gap-2">
            {PATTERNS.map((p, i) => (
              <button
                key={p.name}
                onClick={() => setActivePattern(i)}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                  activePattern === i
                    ? "bg-navy text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {p.name}
              </button>
            ))}
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="mb-2 text-xs font-medium text-slate-500">Code</p>
              <div className="rounded-lg bg-slate-900 p-3 font-mono text-sm text-slate-300">
                <pre>{pattern.code}</pre>
              </div>
            </div>
            <div>
              <p className="mb-2 text-xs font-medium text-slate-500">CFG</p>
              <div className="rounded-lg bg-slate-900 p-3 font-mono text-sm text-emerald-300">
                <pre>{pattern.cfg}</pre>
              </div>
            </div>
          </div>
          <p className="mt-3 text-xs text-slate-600">{pattern.description}</p>
        </div>
      </div>

      {/* Interactive block boundary identification */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 bg-slate-50 px-4 py-3">
          <span className="text-sm font-medium text-navy">Try It: Identify Block Boundaries</span>
        </div>
        <div className="p-4">
          <p className="mb-3 text-xs text-slate-600">
            Click lines that start a <em>new</em> basic block. A new block starts at: the first statement,
            branch targets, join points, and statements after branches.
          </p>
          <div className="mb-4 rounded-lg bg-slate-900 p-3 font-mono text-sm">
            {BLOCK_BOUNDARY_CODE.split("\n").map((line, i) => {
              const lineNum = i + 1;
              const isSelected = selectedLines.has(lineNum);
              return (
                <div
                  key={i}
                  onClick={() => toggleLine(lineNum)}
                  className={`cursor-pointer rounded px-2 py-0.5 transition-colors ${
                    isSelected
                      ? "bg-blue-500/30 text-blue-200"
                      : "text-slate-300 hover:bg-slate-800"
                  }`}
                >
                  <span className="mr-3 inline-block w-4 text-right text-slate-500 select-none">
                    {lineNum}
                  </span>
                  {line}
                </div>
              );
            })}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowBoundaries(!showBoundaries)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                showBoundaries
                  ? "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-300"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {showBoundaries ? "Hide answer" : "Show answer"}
            </button>
            <button
              onClick={() => {
                setSelectedLines(new Set());
                setShowBoundaries(false);
              }}
              className="rounded-full px-3 py-1.5 text-xs font-medium bg-slate-100 text-slate-600 hover:bg-slate-200"
            >
              Reset
            </button>
          </div>
          {showBoundaries && (
            <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3">
              <p className="mb-2 text-xs font-medium text-emerald-800">5 basic blocks:</p>
              <ul className="space-y-1 text-xs text-emerald-700">
                {CORRECT_BOUNDARIES.map((b) => (
                  <li key={b.label}>
                    <strong>{b.label}</strong>
                  </li>
                ))}
              </ul>
              <p className="mt-2 text-xs text-emerald-600">
                Block boundaries occur at: the start (line 1), the branch condition (line 3),
                each branch target (lines 4, 7), and the join point (line 8).
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
