"use client";

import { useEffect, useRef, useState } from "react";

interface HighlightableEditorProps {
  code: string;
  highlightedLines: number[];
  highlightColor?: string;
}

export default function HighlightableEditor({
  code,
  highlightedLines,
  highlightColor = "rgba(254, 202, 87, 0.25)",
}: HighlightableEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const viewRef = useRef<any>(null);
  const [loaded, setLoaded] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const cmRef = useRef<any>(null);

  useEffect(() => {
    async function load() {
      const viewMod = await import("@codemirror/view");
      const stateMod = await import("@codemirror/state");
      const jsMod = await import("@codemirror/lang-javascript");
      cmRef.current = { view: viewMod, state: stateMod, js: jsMod };
      setLoaded(true);
    }
    load();
  }, []);

  useEffect(() => {
    if (!loaded || !editorRef.current || !cmRef.current) return;

    const { view: viewMod, state: stateMod, js: jsMod } = cmRef.current;
    const { EditorView, lineNumbers, drawSelection, Decoration } = viewMod;
    const { EditorState, StateField, RangeSet } = stateMod;

    if (viewRef.current) {
      viewRef.current.destroy();
      viewRef.current = null;
    }

    const highlightDecoration = Decoration.line({
      attributes: { style: `background-color: ${highlightColor}` },
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const highlightField = StateField.define({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      create(state: any) {
        return buildDecorations(state);
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      update(value: any, tr: any) {
        if (tr.docChanged) return buildDecorations(tr.state);
        return value;
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      provide(field: any) {
        return EditorView.decorations.from(field);
      },
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function buildDecorations(state: any) {
      const decorations = [];
      for (const lineNum of highlightedLines) {
        if (lineNum >= 1 && lineNum <= state.doc.lines) {
          const line = state.doc.line(lineNum);
          decorations.push(highlightDecoration.range(line.from));
        }
      }
      return RangeSet.of(decorations, true);
    }

    const extensions = [
      lineNumbers(),
      drawSelection(),
      EditorView.editable.of(false),
      jsMod.javascript(),
      highlightField,
      EditorView.theme({
        "&": { fontSize: "13px", height: "100%" },
        ".cm-content": {
          fontFamily: "'JetBrains Mono', 'Fira Code', 'SF Mono', monospace",
          padding: "8px 0",
        },
        ".cm-gutters": {
          background: "#f8f9fb",
          borderRight: "1px solid #e2e8f0",
          color: "#94a3b8",
        },
        ".cm-scroller": { overflow: "auto" },
      }),
    ];

    const state = EditorState.create({ doc: code, extensions });
    viewRef.current = new EditorView({ state, parent: editorRef.current });

    return () => {
      if (viewRef.current) {
        viewRef.current.destroy();
        viewRef.current = null;
      }
    };
  }, [loaded, code, highlightedLines, highlightColor]);

  return (
    <div className="relative h-full">
      <div ref={editorRef} className="h-full overflow-hidden" />
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80">
          <div className="text-sm text-slate-400">Loading editor...</div>
        </div>
      )}
    </div>
  );
}
