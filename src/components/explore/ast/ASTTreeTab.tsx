"use client";

import { useState, useCallback } from "react";
import type { ASTNode } from "@/lib/ast-explorer-data";

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

function getBadgeColor(type: string): string {
  return NODE_COLORS[type] ?? "bg-slate-400";
}

interface TreeNodeProps {
  node: ASTNode;
  depth: number;
  expanded: Set<string>;
  onToggle: (id: string) => void;
  onSelectNode: (node: ASTNode) => void;
  selectedNodeId: string | null;
}

function TreeNode({ node, depth, expanded, onToggle, onSelectNode, selectedNodeId }: TreeNodeProps) {
  const hasChildren = node.children.length > 0;
  const isExpanded = expanded.has(node.id);
  const isSelected = node.id === selectedNodeId;

  return (
    <div>
      <div
        className={`flex cursor-pointer items-center gap-1.5 rounded px-2 py-1 transition-colors hover:bg-slate-100 ${
          isSelected ? "bg-amber-50 ring-1 ring-amber-300" : ""
        }`}
        style={{ paddingLeft: `${depth * 20 + 8}px` }}
        onClick={() => {
          onSelectNode(node);
          if (hasChildren) onToggle(node.id);
        }}
      >
        {hasChildren ? (
          <span className="flex h-4 w-4 items-center justify-center text-xs text-slate-400">
            {isExpanded ? "\u25BE" : "\u25B8"}
          </span>
        ) : (
          <span className="h-4 w-4" />
        )}
        <span className={`inline-block rounded px-1.5 py-0.5 text-[10px] font-medium text-white ${getBadgeColor(node.type)}`}>
          {node.type}
        </span>
        <span className="text-xs text-slate-700">{node.label}</span>
        {node.detail && (
          <span className="text-[10px] text-slate-400">({node.detail})</span>
        )}
        {node.sourceLine && (
          <span className="ml-auto text-[10px] text-slate-300">L{node.sourceLine}</span>
        )}
      </div>
      {hasChildren && isExpanded && (
        <div>
          {node.children.map((child) => (
            <TreeNode
              key={child.id}
              node={child}
              depth={depth + 1}
              expanded={expanded}
              onToggle={onToggle}
              onSelectNode={onSelectNode}
              selectedNodeId={selectedNodeId}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function collectAllIds(node: ASTNode): string[] {
  return [node.id, ...node.children.flatMap(collectAllIds)];
}

interface ASTTreeTabProps {
  ast: ASTNode;
  onHighlightLine: (lines: number[]) => void;
}

export default function ASTTreeTab({ ast, onHighlightLine }: ASTTreeTabProps) {
  const [expanded, setExpanded] = useState<Set<string>>(() => new Set(collectAllIds(ast)));
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  const handleToggle = useCallback((id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const handleSelectNode = useCallback((node: ASTNode) => {
    setSelectedNodeId(node.id);
    if (node.sourceLine) {
      onHighlightLine([node.sourceLine]);
    }
  }, [onHighlightLine]);

  const expandAll = useCallback(() => {
    setExpanded(new Set(collectAllIds(ast)));
  }, [ast]);

  const collapseAll = useCallback(() => {
    setExpanded(new Set([ast.id]));
  }, [ast]);

  return (
    <div className="p-3">
      <div className="mb-2 flex items-center justify-between">
        <p className="text-xs text-slate-500">Click a node to highlight its source line</p>
        <div className="flex gap-1">
          <button onClick={expandAll} className="rounded px-2 py-0.5 text-[10px] font-medium text-slate-500 hover:bg-slate-100">
            Expand All
          </button>
          <button onClick={collapseAll} className="rounded px-2 py-0.5 text-[10px] font-medium text-slate-500 hover:bg-slate-100">
            Collapse
          </button>
        </div>
      </div>
      <div className="rounded-lg border border-slate-200 bg-white py-1">
        <TreeNode
          node={ast}
          depth={0}
          expanded={expanded}
          onToggle={handleToggle}
          onSelectNode={handleSelectNode}
          selectedNodeId={selectedNodeId}
        />
      </div>
      {/* Legend */}
      <div className="mt-3 flex flex-wrap gap-2">
        {Object.entries(NODE_COLORS).map(([type, color]) => (
          <span key={type} className="flex items-center gap-1">
            <span className={`inline-block h-2.5 w-2.5 rounded ${color}`} />
            <span className="text-[10px] text-slate-500">{type}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
