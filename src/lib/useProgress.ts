"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";

const STORAGE_KEY = "pa-bootcamp-progress";

type ProgressMap = Record<string, boolean>;

function readLocalProgress(): ProgressMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function writeLocalProgress(map: ProgressMap) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
  } catch {
    // localStorage might be full or disabled
  }
}

/** Key format: "moduleSlug/exerciseSlug" or "lab/labSlug" */
function makeKey(moduleSlug: string, exerciseSlug: string) {
  return `${moduleSlug}/${exerciseSlug}`;
}

export function useProgress() {
  const { data: session } = useSession();
  const isLoggedIn = !!session?.user?.id && session.user.id !== "admin" && session.user.role === "student";
  const [progress, setProgress] = useState<ProgressMap>({});

  // Load progress: from server if logged in, otherwise localStorage
  useEffect(() => {
    if (isLoggedIn) {
      fetch("/api/progress")
        .then((r) => r.json())
        .then((data) => {
          const map: ProgressMap = {};
          for (const key of data.keys || []) {
            map[key] = true;
          }
          setProgress(map);
          // Also sync to localStorage as backup
          writeLocalProgress(map);
        })
        .catch(() => {
          setProgress(readLocalProgress());
        });
    } else {
      setProgress(readLocalProgress());
    }
  }, [isLoggedIn]);

  const isComplete = useCallback(
    (moduleSlug: string, exerciseSlug: string) =>
      !!progress[makeKey(moduleSlug, exerciseSlug)],
    [progress]
  );

  const toggle = useCallback(
    (moduleSlug: string, exerciseSlug: string) => {
      const key = makeKey(moduleSlug, exerciseSlug);
      const next = { ...progress, [key]: !progress[key] };
      if (!next[key]) delete next[key];
      setProgress(next);
      writeLocalProgress(next);

      // Sync to server if logged in
      if (isLoggedIn) {
        fetch("/api/progress", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ exercise_key: key }),
        }).catch(() => {});
      }
    },
    [progress, isLoggedIn]
  );

  const countComplete = useCallback(
    (moduleSlug: string, exerciseSlugs: string[]) =>
      exerciseSlugs.filter((s) => !!progress[makeKey(moduleSlug, s)]).length,
    [progress]
  );

  return { isComplete, toggle, countComplete };
}
