"use client";

import SectionNav, { Section } from "../SectionNav";
import WhyTaintSection from "./WhyTaintSection";
import TaintLatticeSection from "./TaintLatticeSection";
import TaintPropagationSection from "./TaintPropagationSection";
import SecurityConfigSection from "./SecurityConfigSection";
import InfoFlowSection from "./InfoFlowSection";
import TryItSectionSecurity from "./TryItSectionSecurity";

const SECTIONS: Section[] = [
  { id: "why-taint", label: "Why Taint Analysis?" },
  { id: "taint-lattice", label: "Taint Lattice" },
  { id: "taint-propagation", label: "Propagation" },
  { id: "security-config", label: "Security Config" },
  { id: "info-flow", label: "Information Flow" },
  { id: "try-it", label: "Try It Yourself" },
];

interface BeforeYouCodeSecurityProps {
  moduleSlug: string;
}

export default function BeforeYouCodeSecurity({ moduleSlug }: BeforeYouCodeSecurityProps) {
  return (
    <div className="relative">
      <SectionNav sections={SECTIONS} />

      {/* Header */}
      <div className="mb-8">
        <div className="mb-1 text-sm font-medium text-amber-600">Before You Code</div>
        <h1 className="text-3xl font-bold text-navy">
          Understanding Security Analysis
        </h1>
        <p className="mt-2 text-slate-600">
          Before building taint analyzers in OCaml, let&apos;s develop intuition for <em>how</em> taint
          tracks untrusted data, <em>why</em> sources/sinks/sanitizers matter, and the subtle difference
          between explicit and implicit information flows that make security analysis challenging.
        </p>
      </div>

      {/* Sections */}
      <div className="space-y-12 xl:mr-56">
        <WhyTaintSection />
        <TaintLatticeSection />
        <TaintPropagationSection />
        <SecurityConfigSection />
        <InfoFlowSection />
        <TryItSectionSecurity moduleSlug={moduleSlug} />
      </div>
    </div>
  );
}
