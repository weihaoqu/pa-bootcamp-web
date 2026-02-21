"use client";

import { useState } from "react";

interface WatchOutCalloutProps {
  items: string[];
}

export default function WatchOutCallout({ items }: WatchOutCalloutProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="mt-4 rounded-lg border border-rose-200 bg-rose-50">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-xs font-semibold text-rose-800"
      >
        <span className={`transition-transform ${open ? "rotate-90" : ""}`}>&#9654;</span>
        Watch Out — Common Mistakes ({items.length})
      </button>
      {open && (
        <ul className="border-t border-rose-200 px-4 pb-3 pt-2 space-y-1.5">
          {items.map((item, i) => (
            <li key={i} className="flex gap-2 text-xs text-rose-700">
              <span className="mt-0.5 shrink-0 text-rose-400">&#9888;</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
