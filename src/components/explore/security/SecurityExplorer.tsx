"use client";

import { useState, useCallback } from "react";
import { Panel, Group, Separator } from "react-resizable-panels";
import { SECURITY_PROGRAMS } from "@/lib/security-explorer-data";
import SnippetSelector from "../SnippetSelector";
import HighlightableEditor from "../HighlightableEditor";
import TaintLatticeTab from "./TaintLatticeTab";
import TaintFlowTab from "./TaintFlowTab";
import VulnerabilityTab from "./VulnerabilityTab";

type TabId = "lattice" | "flow" | "vuln";

const TABS: { id: TabId; label: string }[] = [
  { id: "lattice", label: "Taint Lattice" },
  { id: "flow", label: "Taint Flow" },
  { id: "vuln", label: "Vulnerabilities" },
];

export default function SecurityExplorer() {
  const [activeProgramId, setActiveProgramId] = useState(SECURITY_PROGRAMS[0].id);
  const [activeTab, setActiveTab] = useState<TabId>("lattice");
  const [highlightedLines, setHighlightedLines] = useState<number[]>([]);

  const program = SECURITY_PROGRAMS.find((p) => p.id === activeProgramId) ?? SECURITY_PROGRAMS[0];

  const handleProgramChange = useCallback((id: string) => {
    setActiveProgramId(id);
    setHighlightedLines([]);
    setActiveTab("lattice");
  }, []);

  const highlightColor = "rgba(96, 165, 250, 0.25)";

  const tabContent = (
    <>
      {activeTab === "lattice" && <TaintLatticeTab />}
      {activeTab === "flow" && <TaintFlowTab program={program} />}
      {activeTab === "vuln" && <VulnerabilityTab program={program} />}
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
        <h1 className="text-2xl font-bold text-navy">Security Analysis Explorer</h1>
        <p className="mt-1 text-sm text-slate-600">
          Trace taint propagation through code, explore the taint lattice, and discover vulnerabilities.
          Select a program to see how tainted data flows from sources to sinks — and how sanitizers break the chain.
        </p>
      </div>

      {/* Program selector */}
      <div className="mb-4">
        <SnippetSelector
          activeId={activeProgramId}
          onSelect={handleProgramChange}
          snippets={SECURITY_PROGRAMS}
        />
      </div>

      {/* Program title */}
      <div className="mb-3 rounded-lg border border-slate-200 bg-white px-4 py-2">
        <span className="text-sm font-medium text-navy">{program.name}</span>
        <span className="ml-2 text-xs text-slate-500">{program.description}</span>
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
                    code={program.code}
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
              code={program.code}
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
