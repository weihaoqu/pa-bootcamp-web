"use client";

import { useState, useEffect, useRef } from "react";
import WatchOutCallout from "../WatchOutCallout";

interface LoopIteration {
  iteration: number;
  interval: string;
  explanation: string;
}

const WITHOUT_WIDENING: LoopIteration[] = [
  { iteration: 0, interval: "[0, 0]", explanation: "Initial: i = 0" },
  { iteration: 1, interval: "[0, 1]", explanation: "After i = i+1: join([0,0], [1,1]) = [0, 1]" },
  { iteration: 2, interval: "[0, 2]", explanation: "Upper bound grows: join([0,1], [1,2]) = [0, 2]" },
  { iteration: 3, interval: "[0, 3]", explanation: "Still growing: [0, 3]" },
  { iteration: 4, interval: "[0, 4]", explanation: "Still growing: [0, 4]" },
  { iteration: 5, interval: "[0, 5]", explanation: "Will never stop..." },
  { iteration: 6, interval: "[0, 6]", explanation: "Infinite ascending chain!" },
  { iteration: 7, interval: "[0, ...]", explanation: "Diverges — no fixpoint!" },
];

const WITH_WIDENING: LoopIteration[] = [
  { iteration: 0, interval: "[0, 0]", explanation: "Initial: i = 0" },
  { iteration: 1, interval: "[0, 1]", explanation: "First iteration: join([0,0], [1,1]) = [0, 1]" },
  { iteration: 2, interval: "[0, +Inf]", explanation: "WIDEN: upper bound increased (0→1), widen to +Inf. Result: [0, +Inf]" },
  { iteration: 3, interval: "[0, +Inf]", explanation: "Stable! [0,+Inf] + [1,1] = [1,+Inf] ⊆ [0,+Inf]. Fixpoint reached!" },
];

export default function IntervalWideningSection() {
  const [mode, setMode] = useState<"without" | "with">("without");
  const [step, setStep] = useState(0);
  const [animating, setAnimating] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const steps = mode === "without" ? WITHOUT_WIDENING : WITH_WIDENING;
  const maxStep = steps.length - 1;
  const current = steps[step];

  const startAnimation = () => {
    setStep(0);
    setAnimating(true);
  };

  useEffect(() => {
    if (animating) {
      intervalRef.current = setInterval(() => {
        setStep((prev) => {
          if (prev >= maxStep) {
            setAnimating(false);
            return prev;
          }
          return prev + 1;
        });
      }, 800);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [animating, maxStep]);

  const handleModeSwitch = (m: "without" | "with") => {
    setMode(m);
    setStep(0);
    setAnimating(false);
  };

  return (
    <section id="interval-widening" className="scroll-mt-20">
      <h2 className="mb-4 text-2xl font-bold text-navy">Interval Domain &amp; Widening</h2>
      <p className="mb-4 text-slate-600">
        The interval domain tracks ranges [lo, hi]. It&apos;s more precise than sign or constant at merge points —
        but has <strong>infinite height</strong>. Without a special operator called <strong>widening</strong>,
        loop analysis can diverge forever.
      </p>

      <div className="mb-6 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 bg-slate-50 px-4 py-3">
          <span className="text-sm font-medium text-navy">Loop Analysis: i = 0; while i &lt; 10: i = i + 1</span>
        </div>
        <div className="p-6">
          {/* Mode toggle */}
          <div className="mb-4 flex items-center gap-2">
            <button
              onClick={() => handleModeSwitch("without")}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                mode === "without" ? "bg-red-100 text-red-700 ring-1 ring-red-300" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              Without Widening
            </button>
            <button
              onClick={() => handleModeSwitch("with")}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                mode === "with" ? "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-300" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              With Widening
            </button>
            <button
              onClick={startAnimation}
              className="ml-2 rounded-full bg-navy px-3 py-1.5 text-xs font-medium text-white hover:bg-navy/90"
            >
              {animating ? "Replaying..." : "Animate"}
            </button>
          </div>

          {/* Visual timeline */}
          <div className="mb-4 flex items-end gap-1">
            {steps.map((s, i) => {
              const isActive = i <= step;
              const isCurrent = i === step;
              const isDiverging = mode === "without" && i >= 5;
              return (
                <button
                  key={i}
                  onClick={() => { setStep(i); setAnimating(false); }}
                  className={`flex flex-col items-center transition-all ${isCurrent ? "scale-110" : ""}`}
                >
                  <span className={`mb-1 text-[9px] font-mono ${isCurrent ? "font-bold text-navy" : "text-slate-400"}`}>
                    {s.interval}
                  </span>
                  <div
                    className={`w-8 rounded-t transition-all ${
                      isDiverging
                        ? "bg-red-300"
                        : isActive
                          ? mode === "with" && i >= 2
                            ? "bg-emerald-400"
                            : "bg-blue-400"
                          : "bg-slate-200"
                    }`}
                    style={{ height: `${Math.min(20 + i * 12, 100)}px` }}
                  />
                  <span className="mt-1 text-[9px] text-slate-400">#{i}</span>
                </button>
              );
            })}
          </div>

          {/* Current step detail */}
          <div className={`rounded-lg border p-3 ${
            mode === "without" && step >= 5
              ? "border-red-200 bg-red-50"
              : current.interval.includes("+Inf")
                ? "border-amber-200 bg-amber-50"
                : step === maxStep && mode === "with"
                  ? "border-emerald-200 bg-emerald-50"
                  : "border-slate-200 bg-slate-50"
          }`}>
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-slate-500">Iteration {current.iteration}:</span>
              <span className="font-mono text-sm font-bold text-navy">{current.interval}</span>
              {mode === "with" && step === 2 && (
                <span className="rounded-full bg-amber-200 px-2 py-0.5 text-[10px] font-bold text-amber-800">WIDEN</span>
              )}
              {mode === "with" && step === maxStep && (
                <span className="rounded-full bg-emerald-200 px-2 py-0.5 text-[10px] font-bold text-emerald-800">FIXPOINT</span>
              )}
            </div>
            <p className="mt-1 text-xs text-slate-600">{current.explanation}</p>
          </div>

          {/* Manual stepper */}
          <div className="mt-3 flex items-center gap-2">
            <button
              onClick={() => { setStep(Math.max(0, step - 1)); setAnimating(false); }}
              disabled={step === 0}
              className="rounded px-2 py-0.5 text-xs font-medium bg-slate-100 text-slate-600 hover:bg-slate-200 disabled:opacity-40"
            >
              &larr; Prev
            </button>
            <button
              onClick={() => { setStep(Math.min(maxStep, step + 1)); setAnimating(false); }}
              disabled={step >= maxStep}
              className="rounded px-2 py-0.5 text-xs font-medium bg-slate-100 text-slate-600 hover:bg-slate-200 disabled:opacity-40"
            >
              Next &rarr;
            </button>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
        <h3 className="text-sm font-semibold text-blue-800">How Widening Works</h3>
        <p className="mt-1 text-xs text-blue-700">
          Widening (&nabla;) is an operator that <em>forces convergence</em>. When the upper bound of an interval increases
          between iterations, widening jumps it to +&infin;. When the lower bound decreases, it jumps to -&infin;.
          This guarantees the chain stabilizes in finite steps — at the cost of some over-approximation.
        </p>
        <div className="mt-2 rounded bg-blue-100 p-2 font-mono text-xs text-blue-800">
          [a, b] &nabla; [c, d] = [ (c &lt; a ? -&infin; : a), (d &gt; b ? +&infin; : b) ]
        </div>
      </div>

      <WatchOutCallout items={[
        "The most common widening bug is applying widen on EVERY iteration instead of only when the value increases. If old = new, just keep old — no widening needed.",
        "Widening is NOT the same as join. Join is the least upper bound; widening deliberately overshoots to force convergence. Using join where widen is needed causes non-termination.",
        "For the sign domain, widen = join (because it has finite height). Don't add special widening logic for finite-height domains — it's unnecessary complexity.",
        "When implementing interval arithmetic, watch out for Bot propagation: any operation involving Bot should return Bot, not some arbitrary interval.",
      ]} />
    </section>
  );
}
