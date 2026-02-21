"use client";

import { useState, useCallback } from "react";
import { Panel, Group, Separator } from "react-resizable-panels";
import { AST_SNIPPETS } from "@/lib/ast-explorer-data";
import SnippetSelector from "../SnippetSelector";
import HighlightableEditor from "../HighlightableEditor";
import ASTTreeTab from "./ASTTreeTab";
import TraversalTab from "./TraversalTab";
import SymbolTableTab from "./SymbolTableTab";
import TransformTab from "./TransformTab";

type TabId = "tree" | "traversal" | "symbols" | "transforms";

const TABS: { id: TabId; label: string }[] = [
  { id: "tree", label: "AST Tree" },
  { id: "traversal", label: "Traversals" },
  { id: "symbols", label: "Symbol Table" },
  { id: "transforms", label: "Transforms" },
];

export default function ASTExplorer() {
  const [activeSnippetId, setActiveSnippetId] = useState(AST_SNIPPETS[0].id);
  const [activeTab, setActiveTab] = useState<TabId>("tree");
  const [highlightedLines, setHighlightedLines] = useState<number[]>([]);

  const snippet = AST_SNIPPETS.find((s) => s.id === activeSnippetId) ?? AST_SNIPPETS[0];

  const handleSnippetChange = useCallback((id: string) => {
    setActiveSnippetId(id);
    setHighlightedLines([]);
    setActiveTab("tree");
  }, []);

  const handleHighlightLine = useCallback((lines: number[]) => {
    setHighlightedLines(lines);
  }, []);

  const highlightColor = "rgba(254, 202, 87, 0.3)";

  const tabContent = (
    <>
      {activeTab === "tree" && (
        <ASTTreeTab ast={snippet.ast} onHighlightLine={handleHighlightLine} />
      )}
      {activeTab === "traversal" && (
        <TraversalTab
          ast={snippet.ast}
          traversals={snippet.traversals}
          onHighlightLine={handleHighlightLine}
        />
      )}
      {activeTab === "symbols" && (
        <SymbolTableTab
          symbols={snippet.symbols}
          scopes={snippet.scopes}
          onHighlightLine={handleHighlightLine}
        />
      )}
      {activeTab === "transforms" && (
        <TransformTab transforms={snippet.transforms} />
      )}
    </>
  );

  const tabBar = (tabClassName?: string) => (
    <div className="flex border-b border-slate-200 bg-slate-50">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          onClick={() => {
            setActiveTab(tab.id);
            setHighlightedLines([]);
          }}
          className={`px-4 py-2 text-xs font-medium transition-colors ${
            activeTab === tab.id
              ? "border-b-2 border-navy bg-white text-navy"
              : "text-slate-500 hover:text-navy"
          } ${tabClassName ?? ""}`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );

  return (
    <div>
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-navy">AST Explorer</h1>
        <p className="mt-1 text-sm text-slate-600">
          Explore how code becomes trees. Select a snippet, then use the tabs to inspect its AST, traversals, symbol table, and transformations.
        </p>
      </div>

      {/* Snippet selector */}
      <div className="mb-4">
        <SnippetSelector
          activeId={activeSnippetId}
          onSelect={handleSnippetChange}
          snippets={AST_SNIPPETS}
        />
      </div>

      {/* Snippet title */}
      <div className="mb-3 rounded-lg border border-slate-200 bg-white px-4 py-2">
        <span className="text-sm font-medium text-navy">{snippet.name}</span>
      </div>

      {/* Desktop split pane */}
      <div className="hidden md:block">
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm" style={{ height: "600px" }}>
          <Group orientation="horizontal">
            <Panel defaultSize={40} minSize={25}>
              <div className="flex h-full flex-col">
                <div className="border-b border-slate-200 bg-slate-50 px-3 py-2">
                  <span className="text-xs font-medium text-slate-500">Source Code</span>
                </div>
                <div className="flex-1 overflow-hidden">
                  <HighlightableEditor
                    code={snippet.code}
                    highlightedLines={highlightedLines}
                    highlightColor={highlightColor}
                  />
                </div>
              </div>
            </Panel>
            <Separator className="w-1.5 bg-slate-100 transition-colors hover:bg-slate-300" />
            <Panel defaultSize={60} minSize={35}>
              <div className="flex h-full flex-col">
                {tabBar()}
                <div className="flex-1 overflow-y-auto">
                  {tabContent}
                </div>
              </div>
            </Panel>
          </Group>
        </div>
      </div>

      {/* Mobile stacked */}
      <div className="md:hidden space-y-4">
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm" style={{ height: "250px" }}>
          <div className="border-b border-slate-200 bg-slate-50 px-3 py-2">
            <span className="text-xs font-medium text-slate-500">Source Code</span>
          </div>
          <div style={{ height: "calc(100% - 33px)" }}>
            <HighlightableEditor
              code={snippet.code}
              highlightedLines={highlightedLines}
              highlightColor={highlightColor}
            />
          </div>
        </div>
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          {tabBar("flex-1")}
          <div>{tabContent}</div>
        </div>
      </div>
    </div>
  );
}
