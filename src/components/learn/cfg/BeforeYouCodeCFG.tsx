"use client";

import SectionNav, { Section } from "../SectionNav";
import WhyCFGSection from "./WhyCFGSection";
import BuildingBlocksSection from "./BuildingBlocksSection";
import DataflowFrameworkSection from "./DataflowFrameworkSection";
import ReachingDefsSection from "./ReachingDefsSection";
import LiveVarsSection from "./LiveVarsSection";
import TryItSectionCFG from "./TryItSectionCFG";

const SECTIONS: Section[] = [
  { id: "why-cfg", label: "Why CFGs?" },
  { id: "building-blocks", label: "Building Blocks" },
  { id: "dataflow-framework", label: "Dataflow Framework" },
  { id: "reaching-defs", label: "Reaching Defs" },
  { id: "live-vars", label: "Live Variables" },
  { id: "try-it", label: "Try It Yourself" },
];

interface BeforeYouCodeCFGProps {
  moduleSlug: string;
}

export default function BeforeYouCodeCFG({ moduleSlug }: BeforeYouCodeCFGProps) {
  return (
    <div className="relative">
      <SectionNav sections={SECTIONS} />

      {/* Header */}
      <div className="mb-8">
        <div className="mb-1 text-sm font-medium text-amber-600">Before You Code</div>
        <h1 className="text-3xl font-bold text-navy">
          Understanding Static Analysis
        </h1>
        <p className="mt-2 text-slate-600">
          Before building static analyzers in OCaml, let&apos;s develop intuition for <em>how</em> control
          flow graphs represent program execution, <em>why</em> the dataflow framework works, and the
          key analyses (reaching definitions, live variables) you&apos;ll implement in the exercises.
        </p>
      </div>

      {/* Sections */}
      <div className="space-y-12 xl:mr-56">
        <WhyCFGSection />
        <BuildingBlocksSection />
        <DataflowFrameworkSection />
        <ReachingDefsSection />
        <LiveVarsSection />
        <TryItSectionCFG moduleSlug={moduleSlug} />
      </div>
    </div>
  );
}
