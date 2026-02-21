"use client";

import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

export default function PageVisitTracker() {
  const pathname = usePathname();
  const { data: session } = useSession();

  useEffect(() => {
    const body: { path: string; userId?: string } = { path: pathname };
    if (session?.user?.id && session.user.id !== "admin") {
      body.userId = session.user.id;
    }
    fetch("/api/visits", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }).catch(() => {});
  }, [pathname, session]);

  return null;
}
