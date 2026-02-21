"use client";

import SectionNav, { Section } from "../SectionNav";
import WhyOCamlSection from "./WhyOCamlSection";
import PatternMatchingSection from "./PatternMatchingSection";
import ADTSection from "./ADTSection";
import FunctorsSection from "./FunctorsSection";
import TryItSectionOCaml from "./TryItSectionOCaml";

const SECTIONS: Section[] = [
  { id: "why-ocaml", label: "Why OCaml?" },
  { id: "pattern-matching", label: "Pattern Matching" },
  { id: "adt", label: "Algebraic Types" },
  { id: "functors", label: "Functors" },
  { id: "try-it", label: "Try It Yourself" },
];

interface BeforeYouCodeOCamlProps {
  moduleSlug: string;
}

export default function BeforeYouCodeOCaml({ moduleSlug }: BeforeYouCodeOCamlProps) {
  return (
    <div className="relative">
      <SectionNav sections={SECTIONS} />

      {/* Header */}
      <div className="mb-8">
        <div className="mb-1 text-sm font-medium text-amber-600">Before You Code</div>
        <h1 className="text-3xl font-bold text-navy">
          OCaml Crash Course
        </h1>
        <p className="mt-2 text-slate-600">
          This course uses OCaml for all exercises and labs. Before diving into the warm-up exercises,
          let&apos;s build intuition for the key OCaml features you&apos;ll use throughout: <em>pattern
          matching</em> for deconstructing data, <em>algebraic types</em> for modeling domains, and{" "}
          <em>functors</em> for writing generic analysis frameworks.
        </p>
      </div>

      {/* Sections */}
      <div className="space-y-12 xl:mr-56">
        <WhyOCamlSection />
        <PatternMatchingSection />
        <ADTSection />
        <FunctorsSection />
        <TryItSectionOCaml moduleSlug={moduleSlug} />
      </div>
    </div>
  );
}
