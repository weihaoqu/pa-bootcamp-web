"use client";

import SectionNav, { Section } from "../SectionNav";
import WhyAbstractSection from "./WhyAbstractSection";
import SignDomainSection from "./SignDomainSection";
import ConstantPropSection from "./ConstantPropSection";
import IntervalWideningSection from "./IntervalWideningSection";
import GaloisSection from "./GaloisSection";
import TryItSectionAbsInterp from "./TryItSectionAbsInterp";

const SECTIONS: Section[] = [
  { id: "why-abstract", label: "Why Abstract?" },
  { id: "sign-domain", label: "Sign Domain" },
  { id: "constant-prop", label: "Constant Propagation" },
  { id: "interval-widening", label: "Intervals & Widening" },
  { id: "galois", label: "Galois Connections" },
  { id: "try-it", label: "Try It Yourself" },
];

interface BeforeYouCodeAbsInterpProps {
  moduleSlug: string;
}

export default function BeforeYouCodeAbsInterp({ moduleSlug }: BeforeYouCodeAbsInterpProps) {
  return (
    <div className="relative">
      <SectionNav sections={SECTIONS} />

      {/* Header */}
      <div className="mb-8">
        <div className="mb-1 text-sm font-medium text-amber-600">Before You Code</div>
        <h1 className="text-3xl font-bold text-navy">
          Understanding Abstract Interpretation
        </h1>
        <p className="mt-2 text-slate-600">
          Before building abstract interpreters in OCaml, let&apos;s develop intuition for <em>why</em> we
          abstract concrete values, <em>how</em> different domains trade precision for efficiency, and the
          mathematical foundations (lattices, Galois connections, widening) that make it all sound.
        </p>
      </div>

      {/* Sections */}
      <div className="space-y-12 xl:mr-56">
        <WhyAbstractSection />
        <SignDomainSection />
        <ConstantPropSection />
        <IntervalWideningSection />
        <GaloisSection />
        <TryItSectionAbsInterp moduleSlug={moduleSlug} />
      </div>
    </div>
  );
}
