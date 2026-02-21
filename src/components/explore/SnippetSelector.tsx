"use client";

import { SNIPPETS } from "@/lib/explorer-data";

interface SnippetItem {
  id: string;
  shortName: string;
}

interface SnippetSelectorProps {
  activeId: string;
  onSelect: (id: string) => void;
  /** Optional custom snippets — defaults to Module 1 SNIPPETS */
  snippets?: SnippetItem[];
}

export default function SnippetSelector({ activeId, onSelect, snippets }: SnippetSelectorProps) {
  const items = snippets ?? SNIPPETS;
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((snippet) => (
        <button
          key={snippet.id}
          onClick={() => onSelect(snippet.id)}
          className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
            activeId === snippet.id
              ? "bg-navy text-white shadow-sm"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          {snippet.shortName}
        </button>
      ))}
    </div>
  );
}
