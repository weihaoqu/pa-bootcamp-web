"use client";

import { useState } from "react";
import type { PipelineScenario } from "@/lib/tools-explorer-data";
import { PASS_COLORS } from "@/lib/tools-explorer-data";

interface PipelineVisualizerTabProps {
  scenario: PipelineScenario;
}

export default function PipelineVisualizerTab({ scenario }: PipelineVisualizerTabProps) {
  const [running, setRunning] = useState(false);
  const [completedPasses, setCompletedPasses] = useState<string[]>([]);
  const [activePipeConfig, setActivePipeConfig] = useState(scenario.defaultConfig);

  const runPipeline = () => {
    setRunning(true);
    setCompletedPasses([]);
    const passes = activePipeConfig.passes;
    let i = 0;
    const interval = setInterval(() => {
      if (i < passes.length) {
        const passId = passes[i];
        // Check stop-on-critical: if previous pass had Critical finding
        if (activePipeConfig.stopOnCritical && i > 0) {
          const prevPassId = passes[i - 1];
          const prevPass = scenario.passes.find((p) => p.id === prevPassId);
          if (prevPass?.findings.some((f) => f.severity === "Critical")) {
            clearInterval(interval);
            setRunning(false);
            return;
          }
        }
        setCompletedPasses((prev) => [...prev, passId]);
        i++;
      } else {
        clearInterval(interval);
        setRunning(false);
      }
    }, 600);
  };

  const togglePass = (passId: string) => {
    setActivePipeConfig((prev) => ({
      ...prev,
      passes: prev.passes.includes(passId)
        ? prev.passes.filter((p) => p !== passId)
        : [...prev.passes, passId],
    }));
    setCompletedPasses([]);
  };

  return (
    <div className="p-4">
      <h3 className="mb-1 text-sm font-semibold text-navy">Pipeline Visualizer</h3>
      <p className="mb-4 text-xs text-slate-500">
        Configure which passes to run and watch the pipeline execute. Toggle passes on/off and see how findings change.
      </p>

      {/* Pipeline config */}
      <div className="mb-4 rounded-xl border border-slate-200 bg-slate-50 p-3">
        <div className="mb-2 text-[10px] font-medium text-slate-400">Pipeline Configuration</div>
        <div className="mb-3 flex flex-wrap gap-2">
          {scenario.passes.map((pass) => {
            const enabled = activePipeConfig.passes.includes(pass.id);
            const colorClass = PASS_COLORS[pass.kind] ?? "text-slate-700 bg-slate-50 border-slate-200";
            return (
              <button
                key={pass.id}
                onClick={() => togglePass(pass.id)}
                className={`rounded-full border px-2.5 py-1 text-[10px] font-medium transition-all ${
                  enabled ? colorClass : "border-slate-300 bg-white text-slate-400 line-through"
                }`}
              >
                {pass.name}
              </button>
            );
          })}
        </div>
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-1.5 text-[10px] text-slate-600">
            <input
              type="checkbox"
              checked={activePipeConfig.parallel}
              onChange={(e) => setActivePipeConfig((p) => ({ ...p, parallel: e.target.checked }))}
              className="rounded"
            />
            Parallel execution
          </label>
          <label className="flex items-center gap-1.5 text-[10px] text-slate-600">
            <input
              type="checkbox"
              checked={activePipeConfig.stopOnCritical}
              onChange={(e) => setActivePipeConfig((p) => ({ ...p, stopOnCritical: e.target.checked }))}
              className="rounded"
            />
            Stop on Critical
          </label>
          <button
            onClick={runPipeline}
            disabled={running || activePipeConfig.passes.length === 0}
            className="ml-auto rounded-full bg-navy px-3 py-1 text-[10px] font-medium text-white hover:bg-navy/90 disabled:opacity-40"
          >
            {running ? "Running..." : "Run Pipeline"}
          </button>
        </div>
      </div>

      {/* Pipeline flow visualization */}
      <div className="mb-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          <div className="shrink-0 rounded-lg border border-slate-300 bg-slate-100 px-3 py-2 text-[10px] font-medium text-slate-600">
            Source Code
          </div>
          {activePipeConfig.passes.map((passId, i) => {
            const pass = scenario.passes.find((p) => p.id === passId);
            if (!pass) return null;
            const isCompleted = completedPasses.includes(passId);
            const isActive = running && completedPasses.length === i;
            const colorClass = PASS_COLORS[pass.kind] ?? "text-slate-700 bg-slate-50 border-slate-200";
            return (
              <div key={passId} className="flex items-center gap-2">
                <svg className="h-4 w-4 shrink-0 text-slate-300" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M6 3l5 5-5 5V3z" />
                </svg>
                <div className={`shrink-0 rounded-lg border px-3 py-2 transition-all ${
                  isActive
                    ? "ring-2 ring-navy ring-offset-1 " + colorClass
                    : isCompleted
                      ? colorClass
                      : "border-slate-200 bg-white text-slate-400"
                }`}>
                  <div className="text-[10px] font-medium">{pass.name}</div>
                  <div className="text-[9px] opacity-75">{pass.timeMs}ms</div>
                  {isCompleted && (
                    <div className="mt-0.5 text-[9px] font-bold">
                      {pass.findings.length} finding{pass.findings.length !== 1 ? "s" : ""}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          <svg className="h-4 w-4 shrink-0 text-slate-300" viewBox="0 0 16 16" fill="currentColor">
            <path d="M6 3l5 5-5 5V3z" />
          </svg>
          <div className="shrink-0 rounded-lg border border-slate-300 bg-slate-100 px-3 py-2 text-[10px] font-medium text-slate-600">
            Report
          </div>
        </div>
      </div>

      {/* Completed findings */}
      {completedPasses.length > 0 && (
        <div className="rounded-xl border border-slate-200 bg-white p-3">
          <div className="mb-2 text-xs font-medium text-navy">
            Findings ({completedPasses.length}/{activePipeConfig.passes.length} passes complete)
          </div>
          {completedPasses.map((passId) => {
            const pass = scenario.passes.find((p) => p.id === passId);
            if (!pass) return null;
            return pass.findings.map((f) => (
              <div key={f.id} className="mb-1.5 flex items-start gap-2 rounded border border-slate-100 bg-slate-50 p-2">
                <span className={`shrink-0 rounded-full px-1.5 py-0.5 text-[9px] font-bold ${
                  f.severity === "Critical" ? "bg-red-100 text-red-800"
                    : f.severity === "High" ? "bg-orange-100 text-orange-800"
                    : f.severity === "Medium" ? "bg-amber-100 text-amber-800"
                    : f.severity === "Low" ? "bg-blue-100 text-blue-800"
                    : "bg-slate-100 text-slate-600"
                }`}>{f.severity}</span>
                <div className="text-xs">
                  <span className="font-medium text-navy">L{f.line}</span>
                  <span className="ml-1 text-slate-600">{f.message}</span>
                  <span className="ml-1 text-[10px] text-slate-400">({f.pass})</span>
                </div>
              </div>
            ));
          })}
          {completedPasses.every((id) => {
            const pass = scenario.passes.find((p) => p.id === id);
            return pass && pass.findings.length === 0;
          }) && (
            <div className="rounded border border-emerald-200 bg-emerald-50 p-2 text-xs text-emerald-700">
              No findings from completed passes.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
