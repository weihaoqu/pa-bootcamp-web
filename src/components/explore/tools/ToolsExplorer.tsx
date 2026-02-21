"use client";

import { useState, useCallback } from "react";
import { Panel, Group, Separator } from "react-resizable-panels";
import { PIPELINE_SCENARIOS } from "@/lib/tools-explorer-data";
import SnippetSelector from "../SnippetSelector";
import HighlightableEditor from "../HighlightableEditor";
import PipelineVisualizerTab from "./PipelineVisualizerTab";
import FindingsTab from "./FindingsTab";
import PassComparisonTab from "./PassComparisonTab";

type TabId = "pipeline" | "findings" | "comparison";

const TABS: { id: TabId; label: string }[] = [
  { id: "pipeline", label: "Pipeline" },
  { id: "findings", label: "Findings" },
  { id: "comparison", label: "Pass Comparison" },
];

export default function ToolsExplorer() {
  const [activeScenarioId, setActiveScenarioId] = useState(PIPELINE_SCENARIOS[0].id);
  const [activeTab, setActiveTab] = useState<TabId>("pipeline");
  const [highlightedLines, setHighlightedLines] = useState<number[]>([]);

  const scenario = PIPELINE_SCENARIOS.find((s) => s.id === activeScenarioId) ?? PIPELINE_SCENARIOS[0];

  const handleScenarioChange = useCallback((id: string) => {
    setActiveScenarioId(id);
    setHighlightedLines([]);
    setActiveTab("pipeline");
  }, []);

  const highlightColor = "rgba(96, 165, 250, 0.25)";

  const tabContent = (
    <>
      {activeTab === "pipeline" && <PipelineVisualizerTab scenario={scenario} />}
      {activeTab === "findings" && <FindingsTab scenario={scenario} />}
      {activeTab === "comparison" && <PassComparisonTab scenario={scenario} />}
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
        <h1 className="text-2xl font-bold text-navy">Pipeline Explorer</h1>
        <p className="mt-1 text-sm text-slate-600">
          Configure multi-pass analysis pipelines, run them on code, and inspect findings.
          See how different analysis passes combine into a complete tool — and how pipeline configuration affects results.
        </p>
      </div>

      {/* Scenario selector */}
      <div className="mb-4">
        <SnippetSelector
          activeId={activeScenarioId}
          onSelect={handleScenarioChange}
          snippets={PIPELINE_SCENARIOS}
        />
      </div>

      {/* Scenario title */}
      <div className="mb-3 rounded-lg border border-slate-200 bg-white px-4 py-2">
        <span className="text-sm font-medium text-navy">{scenario.name}</span>
        <span className="ml-2 text-xs text-slate-500">{scenario.description}</span>
      </div>

      {/* Desktop split pane */}
      <div className="hidden md:block">
        <div
          className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
          style={{ height: "600px" }}
        >
          <Group orientation="horizontal">
            <Panel defaultSize={35} minSize={25}>
              <div className="flex h-full flex-col">
                <div className="border-b border-slate-200 bg-slate-50 px-3 py-2">
                  <span className="text-xs font-medium text-slate-500">Source Code</span>
                </div>
                <div className="flex-1 overflow-hidden">
                  <HighlightableEditor
                    code={scenario.code}
                    highlightedLines={highlightedLines}
                    highlightColor={highlightColor}
                  />
                </div>
              </div>
            </Panel>
            <Separator className="w-1.5 bg-slate-100 transition-colors hover:bg-slate-300" />
            <Panel defaultSize={65} minSize={35}>
              <div className="flex h-full flex-col">
                {tabBar()}
                <div className="flex-1 overflow-y-auto">{tabContent}</div>
              </div>
            </Panel>
          </Group>
        </div>
      </div>

      {/* Mobile stacked */}
      <div className="md:hidden space-y-4">
        <div
          className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
          style={{ height: "200px" }}
        >
          <div className="border-b border-slate-200 bg-slate-50 px-3 py-2">
            <span className="text-xs font-medium text-slate-500">Source Code</span>
          </div>
          <div style={{ height: "calc(100% - 33px)" }}>
            <HighlightableEditor
              code={scenario.code}
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
