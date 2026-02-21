"use client";

import { useState, useCallback } from "react";
import { Panel, Group, Separator } from "react-resizable-panels";
import { CFG_SNIPPETS } from "@/lib/cfg-explorer-data";
import SnippetSelector from "../SnippetSelector";
import HighlightableEditor from "../HighlightableEditor";
import CFGGraphTab from "./CFGGraphTab";
import ReachingDefsTab from "./ReachingDefsTab";
import LiveVarsTab from "./LiveVarsTab";
import CallGraphTab from "./CallGraphTab";

type TabId = "cfg" | "reaching" | "live" | "callgraph";

const TABS: { id: TabId; label: string }[] = [
  { id: "cfg", label: "CFG" },
  { id: "reaching", label: "Reaching Defs" },
  { id: "live", label: "Live Vars" },
  { id: "callgraph", label: "Call Graph" },
];

export default function CFGExplorer() {
  const [activeSnippetId, setActiveSnippetId] = useState(CFG_SNIPPETS[0].id);
  const [activeTab, setActiveTab] = useState<TabId>("cfg");
  const [highlightedLines, setHighlightedLines] = useState<number[]>([]);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);

  const snippet = CFG_SNIPPETS.find((s) => s.id === activeSnippetId) ?? CFG_SNIPPETS[0];

  const handleSnippetChange = useCallback((id: string) => {
    setActiveSnippetId(id);
    setHighlightedLines([]);
    setSelectedBlockId(null);
    setActiveTab("cfg");
  }, []);

  const handleHighlightLine = useCallback((lines: number[]) => {
    setHighlightedLines(lines);
  }, []);

  const handleHighlightBlock = useCallback(
    (blockId: string | null) => {
      if (blockId) {
        const block = snippet.blocks.find((b) => b.id === blockId);
        if (block) {
          setHighlightedLines(block.sourceLines);
          setSelectedBlockId(blockId);
        }
      } else {
        setHighlightedLines([]);
        setSelectedBlockId(null);
      }
    },
    [snippet.blocks],
  );

  const highlightColor = "rgba(96, 165, 250, 0.25)";

  const tabContent = (
    <>
      {activeTab === "cfg" && (
        <CFGGraphTab
          blocks={snippet.blocks}
          edges={snippet.edges}
          onHighlightLine={handleHighlightLine}
          selectedBlockId={selectedBlockId}
          onSelectBlock={setSelectedBlockId}
        />
      )}
      {activeTab === "reaching" && (
        <ReachingDefsTab
          reachingDefs={snippet.reachingDefs}
          onHighlightBlock={handleHighlightBlock}
        />
      )}
      {activeTab === "live" && (
        <LiveVarsTab
          liveVars={snippet.liveVars}
          onHighlightBlock={handleHighlightBlock}
        />
      )}
      {activeTab === "callgraph" && <CallGraphTab snippet={snippet} />}
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
            setSelectedBlockId(null);
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
        <h1 className="text-2xl font-bold text-navy">CFG Explorer</h1>
        <p className="mt-1 text-sm text-slate-600">
          Visualize control flow graphs, step through reaching definition and live variable iterations,
          and explore call graphs. Select a snippet, then use the tabs to inspect its analysis.
        </p>
      </div>

      {/* Snippet selector */}
      <div className="mb-4">
        <SnippetSelector
          activeId={activeSnippetId}
          onSelect={handleSnippetChange}
          snippets={CFG_SNIPPETS}
        />
      </div>

      {/* Snippet title */}
      <div className="mb-3 rounded-lg border border-slate-200 bg-white px-4 py-2">
        <span className="text-sm font-medium text-navy">{snippet.name}</span>
        <span className="ml-2 text-xs text-slate-500">{snippet.description}</span>
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
                    code={snippet.code}
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
          style={{ height: "250px" }}
        >
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
