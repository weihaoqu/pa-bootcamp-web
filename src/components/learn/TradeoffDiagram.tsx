"use client";

import { useState } from "react";
import Image from "next/image";

interface Quadrant {
  id: string;
  title: string;
  color: string;
  bgColor: string;
  borderColor: string;
  description: string;
  tools: string[];
  tradeoff: string;
}

const QUADRANTS: Quadrant[] = [
  {
    id: "sound-complete",
    title: "Sound + Complete",
    color: "text-purple-700",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-300",
    description: "Finds ALL bugs and reports ZERO false positives. The holy grail — but Rice's theorem says this is impossible for non-trivial program properties.",
    tools: ["Doesn't exist for general programs!", "Only possible for very restricted languages or properties"],
    tradeoff: "Impossible in the general case (undecidable). This is why all real tools must compromise.",
  },
  {
    id: "sound-incomplete",
    title: "Sound but Incomplete",
    color: "text-indigo-700",
    bgColor: "bg-indigo-50",
    borderColor: "border-indigo-300",
    description: "Finds ALL bugs (no false negatives) but may report false positives — warnings about code that's actually fine.",
    tools: ["Astrée (used on Airbus flight control)", "Facebook Infer", "Polyspace"],
    tradeoff: "You never miss a real bug, but you waste time investigating false alarms. Good for safety-critical code where missing a bug = disaster.",
  },
  {
    id: "unsound-complete",
    title: "Unsound but Complete",
    color: "text-emerald-700",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-300",
    description: "Every reported bug is real (no false positives) but may miss some bugs (false negatives).",
    tools: ["Testing / fuzzing", "ESLint (most rules)", "TypeScript strict mode"],
    tradeoff: "Every warning is actionable, but you might have bugs you don't know about. Good for dev productivity — no false alarm fatigue.",
  },
  {
    id: "unsound-incomplete",
    title: "Unsound + Incomplete",
    color: "text-slate-700",
    bgColor: "bg-slate-50",
    borderColor: "border-slate-300",
    description: "Can both miss bugs AND report false positives. Sounds bad, but these tools are fast and practical for catching common patterns.",
    tools: ["grep-based linters", "Simple pattern matchers", "Many CI security scanners"],
    tradeoff: "Fast and easy to run. Catches low-hanging fruit. Often 'good enough' for common bug patterns.",
  },
];

export default function TradeoffDiagram() {
  const [activeQuadrant, setActiveQuadrant] = useState<string | null>(null);
  const active = QUADRANTS.find((q) => q.id === activeQuadrant);

  return (
    <section id="tradeoffs" className="scroll-mt-20">
      <h2 className="mb-4 text-2xl font-bold text-navy">The Fundamental Tradeoff</h2>
      <p className="mb-4 text-slate-600">
        Every program analysis tool must choose where it sits on the soundness/completeness spectrum.
        Click each quadrant to learn more.
      </p>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        {/* 2x2 Diagram image with clickable quadrant overlays */}
        <div className="relative mx-auto max-w-2xl">
          <Image
            src="/images/tradeoff-diagram.png"
            alt="Soundness vs Completeness 2x2 tradeoff grid: Sound+Complete is impossible (Rice's theorem), Sound+Incomplete includes Astrée and Infer, Unsound+Complete includes Testing and ESLint, Unsound+Incomplete includes pattern matchers"
            width={2752}
            height={1536}
            className="w-full rounded-lg"
            priority
          />
          {/* Invisible click targets over each quadrant */}
          <button
            onClick={() => setActiveQuadrant(activeQuadrant === "sound-complete" ? null : "sound-complete")}
            className={`absolute cursor-pointer rounded transition-all ${activeQuadrant === "sound-complete" ? "ring-3 ring-purple-400 ring-offset-1" : "hover:ring-2 hover:ring-purple-300"}`}
            style={{ top: "10%", left: "20%", width: "30%", height: "40%" }}
            aria-label="Sound + Complete quadrant"
          />
          <button
            onClick={() => setActiveQuadrant(activeQuadrant === "sound-incomplete" ? null : "sound-incomplete")}
            className={`absolute cursor-pointer rounded transition-all ${activeQuadrant === "sound-incomplete" ? "ring-3 ring-indigo-400 ring-offset-1" : "hover:ring-2 hover:ring-indigo-300"}`}
            style={{ top: "10%", left: "50%", width: "30%", height: "40%" }}
            aria-label="Sound but Incomplete quadrant"
          />
          <button
            onClick={() => setActiveQuadrant(activeQuadrant === "unsound-complete" ? null : "unsound-complete")}
            className={`absolute cursor-pointer rounded transition-all ${activeQuadrant === "unsound-complete" ? "ring-3 ring-emerald-400 ring-offset-1" : "hover:ring-2 hover:ring-emerald-300"}`}
            style={{ top: "50%", left: "20%", width: "30%", height: "40%" }}
            aria-label="Unsound but Complete quadrant"
          />
          <button
            onClick={() => setActiveQuadrant(activeQuadrant === "unsound-incomplete" ? null : "unsound-incomplete")}
            className={`absolute cursor-pointer rounded transition-all ${activeQuadrant === "unsound-incomplete" ? "ring-3 ring-slate-400 ring-offset-1" : "hover:ring-2 hover:ring-slate-300"}`}
            style={{ top: "50%", left: "50%", width: "30%", height: "40%" }}
            aria-label="Unsound + Incomplete quadrant"
          />
        </div>

        {/* Detail panel */}
        {active && (
          <div className={`mt-4 rounded-lg border ${active.borderColor} ${active.bgColor} p-4 transition-all`}>
            <h3 className={`text-sm font-semibold ${active.color}`}>{active.title}</h3>
            <p className="mt-1 text-sm text-slate-600">{active.description}</p>
            <div className="mt-3">
              <span className="text-xs font-medium text-slate-500">Real tools:</span>
              <ul className="mt-1 space-y-0.5">
                {active.tools.map((tool, i) => (
                  <li key={i} className="text-xs text-slate-600">&#8226; {tool}</li>
                ))}
              </ul>
            </div>
            <p className="mt-3 text-xs italic text-slate-500">{active.tradeoff}</p>
          </div>
        )}

        <p className="mt-4 text-xs text-slate-400">
          *Rice&apos;s theorem: For any non-trivial property of programs, no analyzer can be both sound and complete.
          This is a fundamental result in computability theory.
        </p>
      </div>
    </section>
  );
}
