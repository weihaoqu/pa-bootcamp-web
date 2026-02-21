"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import type { ASTNode, TraversalOrder, TraversalStep } from "@/lib/ast-explorer-data";

const NODE_COLORS: Record<string, string> = {
  Program: "bg-slate-500",
  LetStmt: "bg-blue-500",
  IfStmt: "bg-purple-500",
  FuncDef: "bg-indigo-500",
  Block: "bg-slate-400",
  ReturnStmt: "bg-red-400",
  BinOp: "bg-amber-500",
  UnaryOp: "bg-amber-400",
  IntLit: "bg-emerald-500",
  StrLit: "bg-teal-500",
  Var: "bg-sky-500",
  Param: "bg-sky-400",
};

function flattenTree(node: ASTNode): ASTNode[] {
  return [node, ...node.children.flatMap(flattenTree)];
}

interface TraversalTabProps {
  ast: ASTNode;
  traversals: Record<TraversalOrder, TraversalStep[]>;
  onHighlightLine: (lines: number[]) => void;
}

export default function TraversalTab({ ast, traversals, onHighlightLine }: TraversalTabProps) {
  const [order, setOrder] = useState<TraversalOrder>("pre-order");
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const steps = traversals[order];
  const allNodes = flattenTree(ast);
  const nodeMap = new Map(allNodes.map((n) => [n.id, n]));

  const currentNodeId = steps[currentStep]?.nodeId;
  const currentNode = currentNodeId ? nodeMap.get(currentNodeId) : undefined;

  useEffect(() => {
    if (currentNode?.sourceLine) {
      onHighlightLine([currentNode.sourceLine]);
    }
  }, [currentStep, currentNode, onHighlightLine]);

  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 800);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, steps.length]);

  const handleOrderChange = useCallback((newOrder: TraversalOrder) => {
    setOrder(newOrder);
    setCurrentStep(0);
    setIsPlaying(false);
  }, []);

  const orders: { id: TraversalOrder; label: string }[] = [
    { id: "pre-order", label: "Pre-order" },
    { id: "post-order", label: "Post-order" },
    { id: "bfs", label: "BFS" },
  ];

  return (
    <div className="p-3">
      {/* Order selector */}
      <div className="mb-3 flex items-center gap-2">
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

      {/* Step controls */}
      <div className="mb-3 flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
        <span className="text-xs font-medium text-slate-500">
          Step {currentStep + 1}/{steps.length}
        </span>
        <div className="flex gap-1">
          {steps.map((_, i) => (
            <button
              key={i}
              onClick={() => { setCurrentStep(i); setIsPlaying(false); }}
              className={`h-1.5 w-1.5 rounded-full transition-colors ${
                i === currentStep ? "bg-navy" : i < currentStep ? "bg-navy/40" : "bg-slate-200"
              }`}
            />
          ))}
        </div>
        <div className="ml-auto flex gap-1">
          <button
            onClick={() => { setCurrentStep(Math.max(0, currentStep - 1)); setIsPlaying(false); }}
            disabled={currentStep === 0}
            className="rounded px-2 py-0.5 text-xs font-medium text-slate-500 hover:bg-slate-200 disabled:opacity-30"
          >
            Prev
          </button>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="rounded bg-navy px-2 py-0.5 text-xs font-medium text-white hover:bg-navy-dark"
          >
            {isPlaying ? "Pause" : "Play"}
          </button>
          <button
            onClick={() => { setCurrentStep(Math.min(steps.length - 1, currentStep + 1)); setIsPlaying(false); }}
            disabled={currentStep === steps.length - 1}
            className="rounded px-2 py-0.5 text-xs font-medium text-slate-500 hover:bg-slate-200 disabled:opacity-30"
          >
            Next
          </button>
        </div>
      </div>

      {/* Visit sequence */}
      <div className="rounded-lg border border-slate-200 bg-white p-3">
        <p className="mb-2 text-xs font-medium text-slate-500">Visit sequence</p>
        <div className="flex flex-wrap gap-1.5">
          {steps.map((step, i) => {
            const node = nodeMap.get(step.nodeId);
            if (!node) return null;
            const isVisited = i < currentStep;
            const isCurrent = i === currentStep;
            const badgeColor = NODE_COLORS[node.type] ?? "bg-slate-400";
            return (
              <button
                key={`${step.nodeId}-${i}`}
                onClick={() => { setCurrentStep(i); setIsPlaying(false); }}
                className={`flex items-center gap-1 rounded px-2 py-1 text-xs transition-all ${
                  isCurrent
                    ? "ring-2 ring-amber-400 bg-amber-50 font-medium"
                    : isVisited
                      ? "bg-slate-50 text-slate-400"
                      : "bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                <span className="text-[10px] text-slate-400">{i + 1}</span>
                <span className={`inline-block h-2 w-2 rounded-sm ${isCurrent || isVisited ? badgeColor : "bg-slate-200"}`} />
                <span>{node.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Current node info */}
      {currentNode && (
        <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 p-3">
          <p className="text-xs font-medium text-amber-800">
            Visiting: <span className={`inline-block rounded px-1 py-0.5 text-[10px] text-white ${NODE_COLORS[currentNode.type] ?? "bg-slate-400"}`}>{currentNode.type}</span>{" "}
            <span className="text-amber-700">{currentNode.label}</span>
          </p>
          {currentNode.sourceLine && (
            <p className="mt-1 text-[10px] text-amber-600">Source: line {currentNode.sourceLine}</p>
          )}
        </div>
      )}
    </div>
  );
}
