"use client";

import { useEffect, useRef, useState } from "react";
import { FileEntry } from "@/lib/types";

interface CodeEditorPanelProps {
  files: FileEntry[];
  activeFilePath: string | null;
}

export default function CodeEditorPanel({
  files,
  activeFilePath,
}: CodeEditorPanelProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const viewRef = useRef<any>(null);
  const [loaded, setLoaded] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const cmRef = useRef<any>(null);

  const activeFile = files.find((f) => f.path === activeFilePath);

  useEffect(() => {
    async function load() {
      const view = await import("@codemirror/view");
      const state = await import("@codemirror/state");
      cmRef.current = { EditorView: view.EditorView, EditorState: state.EditorState, view };
      setLoaded(true);
    }
    load();
  }, []);

  useEffect(() => {
    if (!loaded || !editorRef.current || !activeFile || !cmRef.current) return;

    const { EditorView, EditorState, view } = cmRef.current;

    // Destroy previous editor
    if (viewRef.current) {
      viewRef.current.destroy();
      viewRef.current = null;
    }

    const extensions = [
      view.lineNumbers(),
      view.drawSelection(),
      view.highlightActiveLine(),
      EditorView.editable.of(false),
      EditorView.theme({
        "&": {
          fontSize: "14px",
          height: "100%",
        },
        ".cm-content": {
          fontFamily: "'JetBrains Mono', 'Fira Code', 'SF Mono', monospace",
          padding: "12px 0",
        },
        ".cm-gutters": {
          background: "#f8f9fb",
          borderRight: "1px solid #e2e8f0",
          color: "#94a3b8",
        },
        ".cm-activeLine": {
          background: "#f1f5f9",
        },
        ".cm-activeLineGutter": {
          background: "#e2e8f0",
        },
      }),
    ];

    const state = EditorState.create({
      doc: activeFile.content,
      extensions,
    });

    viewRef.current = new EditorView({
      state,
      parent: editorRef.current,
    });

    return () => {
      if (viewRef.current) {
        viewRef.current.destroy();
        viewRef.current = null;
      }
    };
  }, [loaded, activeFile]);

  if (!activeFile) {
    return (
      <div className="flex h-full items-center justify-center bg-slate-50 text-slate-400">
        Select a file to view its source code
      </div>
    );
  }

  return (
    <div className="relative flex h-full flex-col">
      {/* File tab bar */}
      <div className="flex items-center border-b border-slate-200 bg-slate-50 px-2">
        <div className="flex items-center gap-1 rounded-t-md border border-b-0 border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-navy">
          <svg className="h-3.5 w-3.5 text-accent-red" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          {activeFile.path}
        </div>
        <div className="ml-auto text-xs text-slate-400">Read-only</div>
      </div>

      {/* Editor */}
      <div ref={editorRef} className="flex-1 overflow-hidden" />

      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80">
          <div className="text-sm text-slate-400">Loading editor...</div>
        </div>
      )}
    </div>
  );
}
