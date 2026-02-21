"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useState, useRef, useEffect } from "react";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/modules", label: "Modules" },
  { href: "/labs", label: "Labs" },
  { href: "/syllabus", label: "Syllabus" },
];

export default function TopNav() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const isInstructor = session?.user?.role === "instructor";
  const isStudent = session?.user && !isInstructor;

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex h-14 items-center border-b border-slate-200 bg-navy px-6 text-white shadow-sm">
      <Link href="/" className="mr-8 text-lg font-bold tracking-tight">
        <span className="text-accent-red">PA</span> Bootcamp
      </Link>
      <div className="flex gap-1">
        {NAV_LINKS.map((link) => {
          const isActive =
            link.href === "/"
              ? pathname === "/"
              : pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-white/20 text-white"
                  : "text-white/70 hover:bg-white/10 hover:text-white"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </div>

      <div className="ml-auto flex items-center gap-3">
        {session?.user ? (
          <>
            {isInstructor && (
              <Link
                href="/admin"
                className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                  pathname.startsWith("/admin")
                    ? "bg-white/20 text-white"
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                }`}
              >
                Admin
              </Link>
            )}
            {isStudent && (
              <Link
                href="/profile"
                className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                  pathname.startsWith("/profile")
                    ? "bg-white/20 text-white"
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                }`}
              >
                My Profile
              </Link>
            )}
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-2 rounded-md px-2 py-1 transition-colors hover:bg-white/10"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20 text-xs font-bold">
                  {(session.user.name || "U")[0].toUpperCase()}
                </div>
                <span className="text-sm text-white/80">
                  {session.user.name || "User"}
                </span>
              </button>
              {menuOpen && (
                <div className="absolute right-0 top-full mt-1 w-40 rounded-md border border-slate-200 bg-white py-1 shadow-lg">
                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-100"
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <Link
            href="/login"
            className="rounded-md bg-white/10 px-3 py-1.5 text-sm font-medium text-white/80 transition-colors hover:bg-white/20 hover:text-white"
          >
            Sign in
          </Link>
        )}
      </div>
    </nav>
  );
}
