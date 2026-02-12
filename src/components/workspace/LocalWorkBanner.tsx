"use client";

import { useState } from "react";

interface LocalWorkBannerProps {
  /** e.g. "modules/module2-ast/exercises/traversal-algorithms" */
  exercisePath?: string;
  compact?: boolean;
}

export default function LocalWorkBanner({
  exercisePath,
  compact = false,
}: LocalWorkBannerProps) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  const repoUrl = "https://github.com/weihaoqu/program-analysis-bootcamp-student";

  if (compact) {
    return (
      <div className="flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-sm text-blue-800">
        <svg className="h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>
          This code is <strong>read-only</strong>. Clone the{" "}
          <a href={repoUrl} target="_blank" rel="noopener noreferrer" className="underline font-medium hover:text-blue-900">
            GitHub repo
          </a>{" "}
          and work locally with your editor and <code className="rounded bg-blue-100 px-1 text-xs">dune runtest</code>.
        </span>
        <button
          onClick={() => setDismissed(true)}
          className="ml-auto flex-shrink-0 text-blue-400 hover:text-blue-600"
          aria-label="Dismiss"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-100">
          <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <div className="flex-1">
          <h4 className="mb-1 font-semibold text-blue-900">
            Work on this exercise locally
          </h4>
          <p className="mb-3 text-sm text-blue-800">
            This web app is a <strong>reference guide</strong> — you can read
            instructions, browse starter code, and view tests here. To actually
            complete the exercise, you need to work in your local development
            environment.
          </p>
          <div className="space-y-2 text-sm text-blue-800">
            <div className="flex items-start gap-2">
              <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-blue-200 text-xs font-bold text-blue-700">
                1
              </span>
              <span>
                <strong>Clone the repo:</strong>{" "}
                <code className="rounded bg-blue-100 px-1.5 py-0.5 text-xs">
                  git clone {repoUrl}
                </code>
              </span>
            </div>
            <div className="flex items-start gap-2">
              <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-blue-200 text-xs font-bold text-blue-700">
                2
              </span>
              <span>
                <strong>Edit the starter file</strong> in your editor (VS Code,
                Vim, etc.) — replace{" "}
                <code className="rounded bg-blue-100 px-1.5 py-0.5 text-xs">
                  failwith &quot;TODO&quot;
                </code>{" "}
                with your implementation.
              </span>
            </div>
            <div className="flex items-start gap-2">
              <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-blue-200 text-xs font-bold text-blue-700">
                3
              </span>
              <span>
                <strong>Run the tests:</strong>{" "}
                <code className="rounded bg-blue-100 px-1.5 py-0.5 text-xs">
                  dune runtest{exercisePath ? ` ${exercisePath}` : ""}
                </code>
              </span>
            </div>
          </div>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="flex-shrink-0 text-blue-400 hover:text-blue-600"
          aria-label="Dismiss"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
