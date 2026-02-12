"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { MODULES } from "@/lib/modules";

export default function Sidebar() {
  const pathname = usePathname();
  const [expandedModule, setExpandedModule] = useState<string | null>(() => {
    // Auto-expand the current module
    const match = pathname.match(/\/modules\/([^/]+)/);
    return match ? match[1] : null;
  });

  return (
    <aside className="fixed left-0 top-14 bottom-0 z-40 w-[280px] overflow-y-auto border-r border-slate-200 bg-white">
      <div className="p-4">
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
          Modules
        </h3>
        <ul className="space-y-0.5">
          {MODULES.map((mod) => {
            const isModuleActive = pathname.includes(mod.slug);
            const isExpanded = expandedModule === mod.slug;

            return (
              <li key={mod.slug}>
                <button
                  onClick={() =>
                    setExpandedModule(isExpanded ? null : mod.slug)
                  }
                  className={`flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm transition-colors ${
                    isModuleActive
                      ? "bg-navy/5 font-medium text-navy"
                      : "text-slate-600 hover:bg-slate-50 hover:text-navy"
                  }`}
                >
                  <span
                    className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded text-xs font-bold ${
                      isModuleActive
                        ? "bg-navy text-white"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {mod.index}
                  </span>
                  <span className="flex-1 truncate">{mod.name}</span>
                  <svg
                    className={`h-4 w-4 flex-shrink-0 transition-transform ${
                      isExpanded ? "rotate-90" : ""
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>

                {isExpanded && (
                  <ul className="ml-7 mt-1 space-y-0.5 border-l-2 border-slate-100 pl-3">
                    <li>
                      <Link
                        href={`/modules/${mod.slug}`}
                        className={`block rounded px-2 py-1 text-xs ${
                          pathname === `/modules/${mod.slug}`
                            ? "font-medium text-accent-red"
                            : "text-slate-500 hover:text-navy"
                        }`}
                      >
                        Student Guide
                      </Link>
                    </li>
                    <li>
                      <Link
                        href={`/modules/${mod.slug}/slides`}
                        className={`block rounded px-2 py-1 text-xs ${
                          pathname === `/modules/${mod.slug}/slides`
                            ? "font-medium text-accent-red"
                            : "text-slate-500 hover:text-navy"
                        }`}
                      >
                        Slides
                      </Link>
                    </li>
                    {mod.exercises.map((ex) => (
                      <li key={ex.slug}>
                        <Link
                          href={`/modules/${mod.slug}/exercises/${ex.slug}`}
                          className={`block rounded px-2 py-1 text-xs ${
                            pathname.includes(ex.slug)
                              ? "font-medium text-accent-red"
                              : "text-slate-500 hover:text-navy"
                          }`}
                        >
                          {ex.name}
                          {ex.testCount > 0 && (
                            <span className="ml-1 text-slate-300">
                              ({ex.testCount})
                            </span>
                          )}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </aside>
  );
}
