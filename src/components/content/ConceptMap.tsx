"use client";

const NODES = [
  { id: 0, label: "M0: OCaml\nWarm-up", x: 300, y: 30, color: "#94a3b8" },
  { id: 1, label: "M1: Foundations", x: 300, y: 110, color: "#60a5fa" },
  { id: 2, label: "M2: ASTs", x: 120, y: 200, color: "#a78bfa" },
  { id: 3, label: "M3: Static\nAnalysis", x: 300, y: 200, color: "#34d399" },
  { id: 4, label: "M4: Abstract\nInterpretation", x: 480, y: 200, color: "#fbbf24" },
  { id: 5, label: "M5: Security\nAnalysis", x: 300, y: 300, color: "#f87171" },
  { id: 6, label: "M6: Tools\nIntegration", x: 300, y: 390, color: "#e94560" },
];

const EDGES: [number, number][] = [
  [0, 1],
  [1, 2], [1, 3], [1, 4],
  [2, 5], [3, 5], [4, 5],
  [5, 6],
];

export default function ConceptMap() {
  return (
    <div className="mb-10 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-lg font-bold text-navy">Module Dependency Map</h2>
      <p className="mb-4 text-sm text-slate-500">
        Modules build on each other. M0 teaches OCaml, M1 sets the conceptual foundation, M2-M4
        develop independent analysis skills, M5 combines them for security, and M6 integrates
        everything into a complete tool.
      </p>
      <div className="flex justify-center">
        <svg viewBox="0 0 600 430" className="w-full max-w-lg" role="img" aria-label="Module dependency graph">
          <defs>
            <marker id="arrow" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#94a3b8" />
            </marker>
          </defs>

          {/* Edges */}
          {EDGES.map(([from, to]) => {
            const a = NODES[from];
            const b = NODES[to];
            return (
              <line
                key={`${from}-${to}`}
                x1={a.x} y1={a.y + 20}
                x2={b.x} y2={b.y - 20}
                stroke="#cbd5e1"
                strokeWidth={2}
                markerEnd="url(#arrow)"
              />
            );
          })}

          {/* Nodes */}
          {NODES.map((n) => (
            <g key={n.id}>
              <rect
                x={n.x - 70} y={n.y - 18}
                width={140} height={36}
                rx={8}
                fill={n.color}
                fillOpacity={0.15}
                stroke={n.color}
                strokeWidth={2}
              />
              {n.label.split("\n").map((line, i, arr) => (
                <text
                  key={i}
                  x={n.x}
                  y={n.y + (i - (arr.length - 1) / 2) * 13}
                  textAnchor="middle"
                  dominantBaseline="central"
                  className="text-[11px] font-semibold"
                  fill="#1e293b"
                >
                  {line}
                </text>
              ))}
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}
