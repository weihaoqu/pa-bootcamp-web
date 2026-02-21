"use client";

import SectionNav, { Section } from "./SectionNav";
import Ariane5Section from "./Ariane5Section";
import FirstStaticAnalysis from "./FirstStaticAnalysis";
import FirstDynamicAnalysis from "./FirstDynamicAnalysis";
import TradeoffDiagram from "./TradeoffDiagram";
import RealToolsSection from "./RealToolsSection";
import TryItSection from "./TryItSection";

const SECTIONS: Section[] = [
  { id: "ariane5", label: "Why It Matters" },
  { id: "first-static", label: "First Static Analysis" },
  { id: "first-dynamic", label: "First Dynamic Analysis" },
  { id: "tradeoffs", label: "The Tradeoff" },
  { id: "real-tools", label: "Real Tools" },
  { id: "try-it", label: "Try It Yourself" },
];

interface BeforeYouCodeProps {
  moduleSlug: string;
}

export default function BeforeYouCode({ moduleSlug }: BeforeYouCodeProps) {
  return (
    <div className="relative">
      <SectionNav sections={SECTIONS} />

      {/* Header */}
      <div className="mb-8">
        <div className="mb-1 text-sm font-medium text-amber-600">Before You Code</div>
        <h1 className="text-3xl font-bold text-navy">
          A Gentle Introduction to Program Analysis
        </h1>
        <p className="mt-2 text-slate-600">
          Before diving into OCaml exercises, let&apos;s build intuition for <em>what</em> program analysis does,
          <em>why</em> it matters, and the fundamental tradeoffs every analyzer faces. No coding required — just reading,
          clicking, and thinking.
        </p>
      </div>

      {/* Sections */}
      <div className="space-y-12 xl:mr-56">
        <Ariane5Section />
        <FirstStaticAnalysis />
        <FirstDynamicAnalysis />
        <TradeoffDiagram />
        <RealToolsSection />
        <TryItSection moduleSlug={moduleSlug} />
      </div>
    </div>
  );
}
