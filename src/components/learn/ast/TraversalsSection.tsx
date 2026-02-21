"use client";

import { useState, useEffect, useRef } from "react";

type Order = "pre-order" | "post-order" | "bfs";

//    +
//   / \
//  3   *
//     / \
//    4   2
const TREE_DISPLAY = `      +
     / \\
    3   *
       / \\
      4   2`;

interface NodeInfo {
  id: string;
  label: string;
  row: number;
  col: number;
}

const NODES: NodeInfo[] = [
  { id: "plus", label: "+", row: 0, col: 6 },
  { id: "three", label: "3", row: 2, col: 4 },
  { id: "times", label: "*", row: 2, col: 8 },
  { id: "four", label: "4", row: 4, col: 6 },
  { id: "two", label: "2", row: 4, col: 10 },
];

const TRAVERSAL_ORDERS: Record<Order, string[]> = {
  "pre-order": ["plus", "three", "times", "four", "two"],
  "post-order": ["three", "four", "two", "times", "plus"],
  "bfs": ["plus", "three", "times", "four", "two"],
};

const DESCRIPTIONS: Record<Order, string> = {
  "pre-order": "Visit the node BEFORE its children. Root first, then recurse left, then right. Used for: copying trees, prefix notation, serialization.",
  "post-order": "Visit the node AFTER its children. Leaves first, working up to root. Used for: evaluation (compute children before parent), deletion, code generation.",
  "bfs": "Visit level by level, left to right. Uses a queue instead of recursion. Used for: finding shortest paths, level-order printing.",
};

export default function TraversalsSection() {
  const [order, setOrder] = useState<Order>("pre-order");
  const [step, setStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const sequence = TRAVERSAL_ORDERS[order];
  const visitedSet = new Set(sequence.slice(0, step + 1));
  const currentNodeId = sequence[step];

  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setStep((prev) => {
          if (prev >= sequence.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, sequence.length]);

  const handleOrderChange = (newOrder: Order) => {
    setOrder(newOrder);
    setStep(0);
    setIsPlaying(false);
  };

  const orders: { id: Order; label: string }[] = [
    { id: "pre-order", label: "Pre-order (NLR)" },
    { id: "post-order", label: "Post-order (LRN)" },
    { id: "bfs", label: "BFS (level-order)" },
  ];

  return (
    <section id="traversals" className="scroll-mt-20">
      <h2 className="mb-4 text-2xl font-bold text-navy">Tree Traversals</h2>
      <p className="mb-4 text-slate-600">
        Once you have an AST, you need to <em>walk</em> it. The order you visit nodes determines what you
        can compute. Step through three traversal orders on the expression tree for <code>3 + 4 * 2</code>.
      </p>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 bg-slate-50 px-4 py-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium text-slate-500">Order:</span>
            {orders.map((o) => (
              <button
                key={o.id}
                onClick={() => handleOrderChange(o.id)}
                className={`rounded-full px-2.5 py-1 text-xs font-medium transition-colors ${
                  order === o.id
                    ? "bg-navy text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {o.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Tree visualization */}
          <div className="border-b border-slate-200 p-6 md:border-b-0 md:border-r">
            <div className="relative font-mono text-lg leading-relaxed">
              {TREE_DISPLAY.split("\n").map((row, ri) => (
                <div key={ri} className="whitespace-pre">
                  {row.split("").map((char, ci) => {
                    const node = NODES.find((n) => n.row === ri && n.col === ci);
                    if (node) {
                      const isCurrent = node.id === currentNodeId;
                      const isVisited = visitedSet.has(node.id) && !isCurrent;
                      return (
                        <span
                          key={ci}
                          className={`inline-block w-[0.6em] text-center font-bold transition-all ${
                            isCurrent
                              ? "rounded bg-amber-300 text-amber-900"
                              : isVisited
                                ? "text-emerald-600"
                                : "text-slate-400"
                          }`}
                        >
                          {char}
                        </span>
                      );
                    }
                    return <span key={ci} className="inline-block w-[0.6em] text-slate-300">{char}</span>;
                  })}
                </div>
              ))}
            </div>

            {/* Step controls */}
            <div className="mt-4 flex items-center gap-2">
              <button
                onClick={() => { setStep(Math.max(0, step - 1)); setIsPlaying(false); }}
                disabled={step === 0}
                className="rounded px-2 py-1 text-xs font-medium text-slate-500 hover:bg-slate-200 disabled:opacity-30"
              >
                Prev
              </button>
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="rounded bg-navy px-3 py-1 text-xs font-medium text-white hover:bg-navy-dark"
              >
                {isPlaying ? "Pause" : "Play"}
              </button>
              <button
                onClick={() => { setStep(Math.min(sequence.length - 1, step + 1)); setIsPlaying(false); }}
                disabled={step === sequence.length - 1}
                className="rounded px-2 py-1 text-xs font-medium text-slate-500 hover:bg-slate-200 disabled:opacity-30"
              >
                Next
              </button>
              <span className="ml-2 text-xs text-slate-400">
                {step + 1}/{sequence.length}
              </span>
            </div>
          </div>

          {/* Info panel */}
          <div className="p-6">
            <h3 className="mb-2 text-sm font-semibold text-navy capitalize">{order}</h3>
            <p className="mb-4 text-sm text-slate-600">{DESCRIPTIONS[order]}</p>

            {/* Visit sequence */}
            <p className="mb-1 text-[10px] font-medium uppercase tracking-wider text-slate-400">Visit order</p>
            <div className="flex gap-1.5">
              {sequence.map((nodeId, i) => {
                const node = NODES.find((n) => n.id === nodeId);
                const isCurrent = i === step;
                const isVisited = i < step;
                return (
                  <button
                    key={`${nodeId}-${i}`}
                    onClick={() => { setStep(i); setIsPlaying(false); }}
                    className={`flex h-8 w-8 items-center justify-center rounded-lg font-mono text-sm font-bold transition-all ${
                      isCurrent
                        ? "bg-amber-100 text-amber-800 ring-2 ring-amber-400"
                        : isVisited
                          ? "bg-emerald-50 text-emerald-600"
                          : "bg-slate-100 text-slate-400"
                    }`}
                  >
                    {node?.label}
                  </button>
                );
              })}
            </div>

            {step === sequence.length - 1 && (
              <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3">
                <p className="text-xs font-medium text-amber-800">Key Insight</p>
                <p className="mt-1 text-xs text-amber-700">
                  {order === "pre-order" && "Pre-order visits the root first, making it ideal for top-down operations like printing or copying a tree."}
                  {order === "post-order" && "Post-order visits children before parents. This is exactly what you need for evaluation: compute 4*2=8 before 3+8=11."}
                  {order === "bfs" && "BFS visits by depth level, useful when you care about tree height or need to process all nodes at the same depth together."}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
