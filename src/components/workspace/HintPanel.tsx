"use client";

import { useState } from "react";

interface HintPanelProps {
  hints: string[];
}

export default function HintPanel({ hints }: HintPanelProps) {
  const [revealedCount, setRevealedCount] = useState(0);

  if (hints.length === 0) return null;

  return (
    <div className="rounded-lg border border-amber-200 bg-amber-50">
      <button
        onClick={() =>
          setRevealedCount(revealedCount === 0 ? 1 : revealedCount)
        }
        className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm font-semibold text-amber-800 transition-colors hover:bg-amber-100"
      >
        <svg
          className="h-4 w-4 flex-shrink-0 text-amber-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
          />
        </svg>
        Hints ({hints.length} available)
        {revealedCount === 0 && (
          <span className="ml-auto text-xs font-normal text-amber-500">
            Click to reveal
          </span>
        )}
      </button>

      {revealedCount > 0 && (
        <div className="border-t border-amber-200 px-4 pb-3 pt-2">
          <ol className="space-y-2">
            {hints.map((hint, i) => (
              <li key={i}>
                {i < revealedCount ? (
                  <div className="flex gap-2 text-sm">
                    <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-amber-200 text-xs font-bold text-amber-700">
                      {i + 1}
                    </span>
                    <span className="text-amber-900">{hint}</span>
                  </div>
                ) : (
                  <button
                    onClick={() => setRevealedCount(i + 1)}
                    className="flex items-center gap-2 text-sm text-amber-500 transition-colors hover:text-amber-700"
                  >
                    <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border border-dashed border-amber-300 text-xs font-bold">
                      {i + 1}
                    </span>
                    <span className="italic">Reveal hint {i + 1}...</span>
                  </button>
                )}
              </li>
            ))}
          </ol>

          {revealedCount < hints.length && (
            <button
              onClick={() => setRevealedCount(hints.length)}
              className="mt-2 text-xs text-amber-500 underline hover:text-amber-700"
            >
              Reveal all hints
            </button>
          )}
        </div>
      )}
    </div>
  );
}
