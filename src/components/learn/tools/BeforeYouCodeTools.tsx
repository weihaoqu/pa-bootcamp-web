"use client";

import SectionNav, { Section } from "../SectionNav";
import WhyIntegrateSection from "./WhyIntegrateSection";
import FindingsSection from "./FindingsSection";
import DeadCodeSection from "./DeadCodeSection";
import PipelineSection from "./PipelineSection";
import ReportingSection from "./ReportingSection";
import TryItSectionTools from "./TryItSectionTools";

const SECTIONS: Section[] = [
  { id: "why-integrate", label: "Why Integrate?" },
  { id: "findings", label: "Findings" },
  { id: "dead-code", label: "Dead Code" },
  { id: "pipeline", label: "Pipelines" },
  { id: "reporting", label: "Reporting" },
  { id: "try-it", label: "Try It Yourself" },
];

interface BeforeYouCodeToolsProps {
  moduleSlug: string;
}

export default function BeforeYouCodeTools({ moduleSlug }: BeforeYouCodeToolsProps) {
  return (
    <div className="relative">
      <SectionNav sections={SECTIONS} />

      {/* Header */}
      <div className="mb-8">
        <div className="mb-1 text-sm font-medium text-amber-600">Before You Code</div>
        <h1 className="text-3xl font-bold text-navy">
          Understanding Tools Integration
        </h1>
        <p className="mt-2 text-slate-600">
          Before building the capstone analyzer in OCaml, let&apos;s understand how real-world tools
          combine <em>multiple analysis passes</em> into a unified pipeline, aggregate findings into a
          common format, and produce <em>actionable reports</em> for developers and CI/CD systems.
        </p>
      </div>

      {/* Sections */}
      <div className="space-y-12 xl:mr-56">
        <WhyIntegrateSection />
        <FindingsSection />
        <DeadCodeSection />
        <PipelineSection />
        <ReportingSection />
        <TryItSectionTools moduleSlug={moduleSlug} />
      </div>
    </div>
  );
}
