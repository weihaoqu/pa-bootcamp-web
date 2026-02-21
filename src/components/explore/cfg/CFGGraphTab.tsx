"use client";

import { useCallback } from "react";
import type { CFGBlock, CFGEdge } from "@/lib/cfg-explorer-data";

// Layout constants
const BLOCK_W = 140;
const BLOCK_H = 56;
const GAP_X = 60;
const GAP_Y = 70;

const KIND_COLORS: Record<string, { bg: string; border: string; text: string }> = {
  entry: { bg: "#f0fdf4", border: "#86efac", text: "#166534" },
  exit: { bg: "#fef2f2", border: "#fca5a5", text: "#991b1b" },
  stmt: { bg: "#f8fafc", border: "#94a3b8", text: "#1e293b" },
  cond: { bg: "#fefce8", border: "#fde047", text: "#854d0e" },
  call: { bg: "#eff6ff", border: "#93c5fd", text: "#1e40af" },
};

interface LayoutNode {
  id: string;
  x: number;
  y: number;
  block: CFGBlock;
}

/** Compute simple layered positions from edges */
function layoutBlocks(blocks: CFGBlock[], edges: CFGEdge[]): LayoutNode[] {
  // BFS from ENTRY-like nodes to compute layers
  const adj = new Map<string, string[]>();
  const inDeg = new Map<string, number>();
  for (const b of blocks) {
    adj.set(b.id, []);
    inDeg.set(b.id, 0);
  }
  // Filter back-edges for layering
  for (const e of edges) {
    if (e.label !== "back") {
      adj.get(e.from)?.push(e.to);
      inDeg.set(e.to, (inDeg.get(e.to) ?? 0) + 1);
    }
  }
  // Topological sort by BFS (Kahn's)
  const layers = new Map<string, number>();
  const queue: string[] = [];
  for (const b of blocks) {
    if ((inDeg.get(b.id) ?? 0) === 0) {
      queue.push(b.id);
      layers.set(b.id, 0);
    }
  }
  let idx = 0;
  while (idx < queue.length) {
    const cur = queue[idx++];
    const layer = layers.get(cur) ?? 0;
    for (const next of adj.get(cur) ?? []) {
      const newLayer = Math.max(layers.get(next) ?? 0, layer + 1);
      layers.set(next, newLayer);
      inDeg.set(next, (inDeg.get(next) ?? 0) - 1);
      if ((inDeg.get(next) ?? 0) === 0) queue.push(next);
    }
  }
  // Assign unvisited nodes (in cycles) a layer
  for (const b of blocks) {
    if (!layers.has(b.id)) layers.set(b.id, (layers.get(b.id) ?? 0) + 1);
  }
  // Group by layer
  const byLayer = new Map<number, string[]>();
  for (const [id, layer] of layers.entries()) {
    if (!byLayer.has(layer)) byLayer.set(layer, []);
    byLayer.get(layer)!.push(id);
  }
  const blockMap = new Map(blocks.map((b) => [b.id, b]));
  const result: LayoutNode[] = [];
  for (const [layer, ids] of byLayer.entries()) {
    const totalWidth = ids.length * BLOCK_W + (ids.length - 1) * GAP_X;
    const startX = -totalWidth / 2 + BLOCK_W / 2;
    ids.forEach((id, i) => {
      result.push({
        id,
        x: startX + i * (BLOCK_W + GAP_X),
        y: layer * (BLOCK_H + GAP_Y),
        block: blockMap.get(id)!,
      });
    });
  }
  return result;
}

/** Build SVG path for a directed edge */
function edgePath(fromNode: LayoutNode, toNode: LayoutNode, isBack: boolean): string {
  const x1 = fromNode.x;
  const y1 = fromNode.y + BLOCK_H / 2;
  const x2 = toNode.x;
  const y2 = toNode.y - BLOCK_H / 2;
  if (isBack) {
    // Draw around the right side for back edges
    const midX = Math.max(x1, x2) + BLOCK_W / 2 + 30;
    return `M ${x1} ${y1} C ${midX} ${y1}, ${midX} ${y2}, ${x2} ${y2}`;
  }
  // Normal downward edge
  const midY = (y1 + y2) / 2;
  return `M ${x1} ${y1} C ${x1} ${midY}, ${x2} ${midY}, ${x2} ${y2}`;
}

interface CFGGraphTabProps {
  blocks: CFGBlock[];
  edges: CFGEdge[];
  onHighlightLine: (lines: number[]) => void;
  selectedBlockId: string | null;
  onSelectBlock: (id: string | null) => void;
}

export default function CFGGraphTab({
  blocks,
  edges,
  onHighlightLine,
  selectedBlockId,
  onSelectBlock,
}: CFGGraphTabProps) {
  const nodes = layoutBlocks(blocks, edges);
  const nodeMap = new Map(nodes.map((n) => [n.id, n]));

  // Compute SVG viewBox
  const minX = Math.min(...nodes.map((n) => n.x)) - BLOCK_W / 2 - 40;
  const maxX = Math.max(...nodes.map((n) => n.x)) + BLOCK_W / 2 + 40;
  const minY = Math.min(...nodes.map((n) => n.y)) - BLOCK_H / 2 - 20;
  const maxY = Math.max(...nodes.map((n) => n.y)) + BLOCK_H / 2 + 20;
  const viewBox = `${minX} ${minY} ${maxX - minX} ${maxY - minY}`;

  const handleBlockClick = useCallback(
    (block: CFGBlock) => {
      onSelectBlock(block.id === selectedBlockId ? null : block.id);
      onHighlightLine(block.sourceLines);
    },
    [onHighlightLine, onSelectBlock, selectedBlockId],
  );

  return (
    <div className="p-3">
      <div className="mb-3 flex flex-wrap items-center gap-3">
        <span className="text-xs font-medium text-slate-500">Block types:</span>
        {Object.entries(KIND_COLORS).map(([kind, colors]) => (
          <span
            key={kind}
            className="inline-flex items-center gap-1 text-xs"
          >
            <span
              className="inline-block h-3 w-3 rounded"
              style={{ background: colors.bg, border: `1.5px solid ${colors.border}` }}
            />
            <span className="text-slate-600">{kind}</span>
          </span>
        ))}
      </div>
      <svg
        viewBox={viewBox}
        className="w-full"
        style={{ minHeight: 200, maxHeight: 500 }}
      >
        <defs>
          <marker
            id="arrowhead"
            markerWidth="8"
            markerHeight="6"
            refX="7"
            refY="3"
            orient="auto"
          >
            <polygon points="0 0, 8 3, 0 6" fill="#64748b" />
          </marker>
          <marker
            id="arrowhead-back"
            markerWidth="8"
            markerHeight="6"
            refX="7"
            refY="3"
            orient="auto"
          >
            <polygon points="0 0, 8 3, 0 6" fill="#f59e0b" />
          </marker>
        </defs>
        {/* Edges */}
        {edges.map((e, i) => {
          const fromN = nodeMap.get(e.from);
          const toN = nodeMap.get(e.to);
          if (!fromN || !toN) return null;
          const isBack = e.label === "back";
          const d = edgePath(fromN, toN, isBack);
          return (
            <g key={i}>
              <path
                d={d}
                fill="none"
                stroke={isBack ? "#f59e0b" : "#94a3b8"}
                strokeWidth={isBack ? 2 : 1.5}
                strokeDasharray={isBack ? "6 3" : undefined}
                markerEnd={isBack ? "url(#arrowhead-back)" : "url(#arrowhead)"}
              />
              {e.label && e.label !== "back" && (
                <text
                  x={(fromN.x + toN.x) / 2 + (e.label === "true" ? -18 : 18)}
                  y={(fromN.y + BLOCK_H / 2 + toN.y - BLOCK_H / 2) / 2}
                  textAnchor="middle"
                  className="text-[9px] fill-slate-500"
                >
                  {e.label}
                </text>
              )}
            </g>
          );
        })}
        {/* Nodes */}
        {nodes.map((n) => {
          const colors = KIND_COLORS[n.block.kind] ?? KIND_COLORS.stmt;
          const isSelected = n.id === selectedBlockId;
          return (
            <g
              key={n.id}
              onClick={() => handleBlockClick(n.block)}
              className="cursor-pointer"
            >
              <rect
                x={n.x - BLOCK_W / 2}
                y={n.y - BLOCK_H / 2}
                width={BLOCK_W}
                height={BLOCK_H}
                rx={n.block.kind === "cond" ? 4 : 8}
                fill={colors.bg}
                stroke={isSelected ? "#1e293b" : colors.border}
                strokeWidth={isSelected ? 2.5 : 1.5}
              />
              <text
                x={n.x}
                y={n.y - 6}
                textAnchor="middle"
                className="text-[11px] font-semibold"
                fill={colors.text}
              >
                {n.block.label}
              </text>
              {n.block.code.length > 0 && (
                <text
                  x={n.x}
                  y={n.y + 10}
                  textAnchor="middle"
                  className="text-[9px]"
                  fill="#64748b"
                >
                  {n.block.code[0].length > 18
                    ? n.block.code[0].slice(0, 16) + "…"
                    : n.block.code[0]}
                </text>
              )}
            </g>
          );
        })}
      </svg>
      {selectedBlockId && (
        <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50 p-3">
          <p className="mb-1 text-xs font-medium text-slate-500">
            Block: {blocks.find((b) => b.id === selectedBlockId)?.label}
          </p>
          <pre className="text-xs text-slate-700 font-mono">
            {blocks.find((b) => b.id === selectedBlockId)?.code.join("\n") || "(empty)"}
          </pre>
        </div>
      )}
    </div>
  );
}
