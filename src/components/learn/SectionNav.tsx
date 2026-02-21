"use client";

import { useEffect, useState } from "react";

export interface Section {
  id: string;
  label: string;
}

interface SectionNavProps {
  sections: Section[];
}

export default function SectionNav({ sections }: SectionNavProps) {
  const [activeId, setActiveId] = useState(sections[0]?.id ?? "");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: "-20% 0px -60% 0px", threshold: 0 }
    );

    for (const section of sections) {
      const el = document.getElementById(section.id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [sections]);

  return (
    <nav className="hidden xl:fixed xl:right-8 xl:top-24 xl:block xl:w-48">
      <div className="border-l-2 border-slate-200 pl-3">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
          On this page
        </p>
        <ul className="space-y-1">
          {sections.map((section) => (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                className={`block text-xs transition-colors ${
                  activeId === section.id
                    ? "font-medium text-navy"
                    : "text-slate-400 hover:text-slate-600"
                }`}
              >
                {section.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
