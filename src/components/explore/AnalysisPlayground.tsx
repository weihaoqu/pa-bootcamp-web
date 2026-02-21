"use client";

import { useState, useCallback } from "react";
import { Panel, Group, Separator } from "react-resizable-panels";
import { SNIPPETS } from "@/lib/explorer-data";
import SnippetSelector from "./SnippetSelector";
import HighlightableEditor from "./HighlightableEditor";
import StaticAnalysisTab from "./StaticAnalysisTab";
import DynamicAnalysisTab from "./DynamicAnalysisTab";
import ComparisonTab from "./ComparisonTab";

type TabId = "static" | "dynamic" | "comparison";

export default function AnalysisPlayground() {
  const [activeSnippetId, setActiveSnippetId] = useState(SNIPPETS[0].id);
  const [activeTab, setActiveTab] = useState<TabId>("static");
  const [highlightedLines, setHighlightedLines] = useState<number[]>([]);

  const snippet = SNIPPETS.find((s) => s.id === activeSnippetId) ?? SNIPPETS[0];

  const handleSnippetChange = useCallback((id: string) => {
    setActiveSnippetId(id);
    setHighlightedLines([]);
    setActiveTab("static");
  }, []);

  const handleHighlightLine = useCallback((lines: number[]) => {
    setHighlightedLines(lines);
  }, []);

  const tabs: { id: TabId; label: string }[] = [
    { id: "static", label: "Static Analysis" },
    { id: "dynamic", label: "Dynamic Analysis" },
    { id: "comparison", label: "Comparison" },
  ];

  const highlightColor =
    activeTab === "static"
      ? "rgba(254, 202, 87, 0.3)"
      : activeTab === "dynamic"
        ? "rgba(16, 185, 129, 0.2)"
        : "rgba(254, 202, 87, 0.25)";

  return (
    <div>
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-navy">Analysis Playground</h1>
        <p className="mt-1 text-sm text-slate-600">
          Compare what static and dynamic analysis find on the same code. Select a snippet, then explore each tab.
        </p>
      </div>

      {/* Snippet selector */}
      <div className="mb-4">
        <SnippetSelector activeId={activeSnippetId} onSelect={handleSnippetChange} />
      </div>

      {/* Snippet title */}
      <div className="mb-3 rounded-lg border border-slate-200 bg-white px-4 py-2">
        <span className="text-sm font-medium text-navy">{snippet.name}</span>
      </div>

      {/* Main split pane — desktop */}
      <div className="hidden md:block">
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm" style={{ height: "600px" }}>
          <Group orientation="horizontal">
            <Panel defaultSize={45} minSize={30}>
              <div className="flex h-full flex-col">
                <div className="border-b border-slate-200 bg-slate-50 px-3 py-2">
                  <span className="text-xs font-medium text-slate-500">Code</span>
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
            <Panel defaultSize={55} minSize={30}>
              <div className="flex h-full flex-col">
                {/* Tab bar */}
                <div className="flex border-b border-slate-200 bg-slate-50">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => { setActiveTab(tab.id); setHighlightedLines([]); }}
                      className={`px-4 py-2 text-xs font-medium transition-colors ${
                        activeTab === tab.id
                          ? "border-b-2 border-navy bg-white text-navy"
                          : "text-slate-500 hover:text-navy"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
                {/* Tab content */}
                <div className="flex-1 overflow-y-auto">
                  {activeTab === "static" && (
                    <StaticAnalysisTab
                      findings={snippet.staticFindings}
                      onHighlightLine={handleHighlightLine}
                    />
                  )}
                  {activeTab === "dynamic" && (
                    <DynamicAnalysisTab
                      results={snippet.dynamicResults}
                      coveragePercent={snippet.coveragePercent}
                      onHighlightLine={handleHighlightLine}
                    />
                  )}
                  {activeTab === "comparison" && (
                    <ComparisonTab items={snippet.comparison} />
                  )}
                </div>
              </div>
            </Panel>
          </Group>
        </div>
      </div>

      {/* Mobile stacked layout */}
      <div className="md:hidden space-y-4">
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm" style={{ height: "300px" }}>
          <div className="border-b border-slate-200 bg-slate-50 px-3 py-2">
            <span className="text-xs font-medium text-slate-500">Code</span>
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
          <div className="flex border-b border-slate-200 bg-slate-50">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setHighlightedLines([]); }}
                className={`flex-1 px-3 py-2 text-xs font-medium transition-colors ${
                  activeTab === tab.id
                    ? "border-b-2 border-navy bg-white text-navy"
                    : "text-slate-500 hover:text-navy"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div>
            {activeTab === "static" && (
              <StaticAnalysisTab findings={snippet.staticFindings} onHighlightLine={handleHighlightLine} />
            )}
            {activeTab === "dynamic" && (
              <DynamicAnalysisTab results={snippet.dynamicResults} coveragePercent={snippet.coveragePercent} onHighlightLine={handleHighlightLine} />
            )}
            {activeTab === "comparison" && <ComparisonTab items={snippet.comparison} />}
          </div>
        </div>
      </div>
    </div>
  );
}
