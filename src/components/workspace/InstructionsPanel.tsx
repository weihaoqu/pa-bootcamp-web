"use client";

import MarkdownRenderer from "@/components/content/MarkdownRenderer";
import LocalWorkBanner from "./LocalWorkBanner";
import HintPanel from "./HintPanel";

interface InstructionsPanelProps {
  content: string;
  title?: string;
  exercisePath?: string;
  hints?: string[];
}

export default function InstructionsPanel({
  content,
  title,
  exercisePath,
  hints,
}: InstructionsPanelProps) {
  return (
    <div className="h-full overflow-y-auto bg-white p-6">
      {/* Work Locally banner */}
      <div className="mb-4">
        <LocalWorkBanner exercisePath={exercisePath} />
      </div>

      {title && (
        <h2 className="mb-4 text-lg font-bold text-navy">{title}</h2>
      )}

      {/* Hints */}
      {hints && hints.length > 0 && (
        <div className="mb-4">
          <HintPanel hints={hints} />
        </div>
      )}

      {content ? (
        <MarkdownRenderer content={content} />
      ) : (
        <p className="text-slate-400">
          No instructions available for this exercise.
        </p>
      )}
    </div>
  );
}
