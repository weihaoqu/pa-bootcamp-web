"use client";

import { FileEntry } from "@/lib/types";

interface FileTreeProps {
  files: FileEntry[];
  activeFile: string | null;
  onSelect: (path: string) => void;
  label?: string;
}

export default function FileTree({
  files,
  activeFile,
  onSelect,
  label = "Files",
}: FileTreeProps) {
  // Group files by directory prefix
  const groups = new Map<string, FileEntry[]>();
  for (const file of files) {
    const dir = file.path.split("/").slice(0, -1).join("/") || ".";
    if (!groups.has(dir)) groups.set(dir, []);
    groups.get(dir)!.push(file);
  }

  return (
    <div className="text-sm">
      <h4 className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
        {label}
      </h4>
      {Array.from(groups.entries()).map(([dir, dirFiles]) => (
        <div key={dir} className="mb-1">
          <div className="flex items-center gap-1.5 px-2 py-1 text-xs font-medium text-slate-500">
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
            {dir}
          </div>
          {dirFiles.map((file) => (
            <button
              key={file.path}
              onClick={() => onSelect(file.path)}
              className={`flex w-full items-center gap-1.5 rounded px-3 py-1 text-left transition-colors ${
                activeFile === file.path
                  ? "bg-accent-red/10 font-medium text-accent-red"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              <svg className="h-3.5 w-3.5 flex-shrink-0 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="truncate">{file.name}</span>
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}
