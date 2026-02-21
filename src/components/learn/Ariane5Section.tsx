"use client";

export default function Ariane5Section() {
  return (
    <section id="ariane5" className="scroll-mt-20">
      <h2 className="mb-4 text-2xl font-bold text-navy">Why Program Analysis Matters</h2>
      <p className="mb-4 text-slate-600">
        On June 4, 1996, the European Space Agency&apos;s Ariane 5 rocket exploded 37 seconds after launch.
        The cause? A software bug that program analysis could have caught.
      </p>

      {/* Timeline */}
      <div className="mb-6 rounded-xl border border-slate-200 bg-white p-6">
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-400">Timeline of Failure</h3>
        <div className="space-y-4">
          {[
            { time: "T+0s", event: "Liftoff. Inertial Reference System (IRS) running guidance software reused from Ariane 4.", color: "bg-emerald-500" },
            { time: "T+30s", event: "Software converts 64-bit float (horizontal velocity) to 16-bit signed integer. Ariane 5 is faster than Ariane 4 — the value exceeds 32,767.", color: "bg-amber-500" },
            { time: "T+36s", event: "Integer overflow triggers an Ada exception. The backup IRS — running identical code — also crashes.", color: "bg-red-500" },
            { time: "T+37s", event: "Flight computer interprets diagnostic data as navigation data, makes a hard turn. Aerodynamic forces tear the rocket apart. Self-destruct activates.", color: "bg-red-700" },
          ].map((step, i) => (
            <div key={i} className="flex gap-3">
              <div className="flex flex-col items-center">
                <div className={`h-3 w-3 rounded-full ${step.color}`} />
                {i < 3 && <div className="w-0.5 flex-1 bg-slate-200" />}
              </div>
              <div className="pb-2">
                <span className="font-mono text-xs font-bold text-slate-500">{step.time}</span>
                <p className="text-sm text-slate-700">{step.event}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* The bug */}
      <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-6">
        <h3 className="mb-3 text-sm font-semibold text-red-800">The Actual Bug (Ada Code)</h3>
        <pre className="mb-3 overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm text-slate-100">
          <code>{`-- Horizontal velocity: ~32,768+ on Ariane 5
-- (was always < 32,767 on Ariane 4)
L_M_BV_32 := TBD.T_ENTIER_16S(BV_Calc_Horiz);
--           ^^^^^^^^^^^^^^^^^
-- Converts 64-bit float to 16-bit signed integer
-- Max value: 32,767 → OVERFLOW!`}</code>
        </pre>
        <p className="text-sm text-red-700">
          The conversion had no range check. On Ariane 4, the value was always small enough.
          On Ariane 5&apos;s faster trajectory, it wasn&apos;t.
        </p>
      </div>

      {/* What PA would catch */}
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-6">
        <h3 className="mb-3 text-sm font-semibold text-emerald-800">What Program Analysis Would Have Caught</h3>
        <ul className="space-y-2 text-sm text-emerald-700">
          <li className="flex items-start gap-2">
            <span className="mt-1 text-emerald-500">&#x2713;</span>
            <span><strong>Abstract interpretation</strong> (interval analysis) would track that <code className="rounded bg-emerald-100 px-1">BV_Calc_Horiz</code> can exceed 32,767 given Ariane 5&apos;s parameters</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1 text-emerald-500">&#x2713;</span>
            <span><strong>Type range analysis</strong> would flag the unchecked 64→16 bit narrowing conversion</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1 text-emerald-500">&#x2713;</span>
            <span><strong>Astree</strong> (a real static analyzer) was later applied to Ariane code and found this exact class of bug automatically</span>
          </li>
        </ul>
        <p className="mt-3 text-xs text-emerald-600">
          Cost of the bug: $370 million in destroyed rocket + payload. Cost of static analysis: a few hours of compute time.
        </p>
      </div>
    </section>
  );
}
