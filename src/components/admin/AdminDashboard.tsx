"use client";

import { useState, useEffect } from "react";

interface Student {
  id: number;
  name: string;
  email: string;
  repo_url: string;
  notes: string;
  created_at: string;
  last_login: string;
  exercises_completed: number;
  pages_visited: number;
}

interface PageVisitSummary {
  path: string;
  visit_count: number;
  last_visited: string;
}

type Tab = "students" | "analytics";

export default function AdminDashboard() {
  const [tab, setTab] = useState<Tab>("students");
  const [students, setStudents] = useState<Student[]>([]);
  const [visits, setVisits] = useState<PageVisitSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [visitsLoading, setVisitsLoading] = useState(false);
  const [editingNotes, setEditingNotes] = useState<number | null>(null);
  const [notesValue, setNotesValue] = useState("");

  useEffect(() => {
    fetch("/api/admin/students")
      .then((r) => r.json())
      .then((data) => setStudents(data.students || []))
      .finally(() => setLoading(false));
  }, []);

  function loadVisits() {
    setVisitsLoading(true);
    fetch("/api/admin/analytics")
      .then((r) => r.json())
      .then((data) => setVisits(data.visits || []))
      .finally(() => setVisitsLoading(false));
  }

  function switchTab(t: Tab) {
    setTab(t);
    if (t === "analytics" && visits.length === 0) loadVisits();
  }

  async function removeStudent(id: number) {
    if (!confirm("Remove this student and all their data?")) return;
    await fetch(`/api/admin/students/${id}`, { method: "DELETE" });
    setStudents((prev) => prev.filter((s) => s.id !== id));
  }

  async function saveNotes(id: number) {
    await fetch(`/api/admin/students/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ notes: notesValue }),
    });
    setStudents((prev) => prev.map((s) => (s.id === id ? { ...s, notes: notesValue } : s)));
    setEditingNotes(null);
  }

  function formatDate(d: string) {
    if (!d) return "—";
    return new Date(d + "Z").toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  }

  const tabBar = (
    <div className="mb-6 flex gap-1 rounded-lg bg-slate-100 p-1">
      {(["students", "analytics"] as Tab[]).map((t) => (
        <button
          key={t}
          onClick={() => switchTab(t)}
          className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
            tab === t ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
          }`}
        >
          {t === "students" ? "Students" : "Page Analytics"}
        </button>
      ))}
    </div>
  );

  if (loading) return <p className="text-slate-500">Loading...</p>;

  // --- Analytics tab ---
  if (tab === "analytics") {
    return (
      <div>
        {tabBar}
        {visitsLoading ? (
          <p className="text-slate-500">Loading analytics...</p>
        ) : visits.length === 0 ? (
          <p className="text-slate-400">No page visits recorded yet.</p>
        ) : (
          <>
            <p className="mb-4 text-sm text-slate-500">
              {visits.length} page{visits.length !== 1 && "s"} visited
            </p>
            <div className="overflow-x-auto rounded-lg border border-slate-200">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-4 py-3">Page</th>
                    <th className="px-4 py-3">Visits</th>
                    <th className="px-4 py-3">Last Visited</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {visits.map((v) => (
                    <tr key={v.path} className="hover:bg-slate-50">
                      <td className="px-4 py-3"><code className="text-slate-700">{v.path}</code></td>
                      <td className="px-4 py-3 text-slate-600">{v.visit_count}</td>
                      <td className="px-4 py-3 text-slate-500">{formatDate(v.last_visited)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    );
  }

  // --- Students tab (default) ---
  return (
    <div>
      {tabBar}

      <p className="mb-4 text-sm text-slate-500">
        {students.length} registered student{students.length !== 1 && "s"}
      </p>

      {students.length === 0 ? (
        <p className="text-slate-400">No students have joined yet. Share the enrollment code so students can register at <code>/join</code>.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-slate-200">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Repo</th>
                <th className="px-4 py-3 text-center">Exercises</th>
                <th className="px-4 py-3 text-center">Pages</th>
                <th className="px-4 py-3">Last Active</th>
                <th className="px-4 py-3">Notes</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {students.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-800">{s.name}</td>
                  <td className="px-4 py-3 text-slate-600">{s.email}</td>
                  <td className="px-4 py-3">
                    {s.repo_url ? (
                      <a
                        href={s.repo_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        View Repo
                      </a>
                    ) : (
                      <span className="text-slate-300 italic">not set</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-block min-w-[2rem] rounded-full px-2 py-0.5 text-xs font-medium ${
                      s.exercises_completed > 0 ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-400"
                    }`}>
                      {s.exercises_completed}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="text-slate-600">{s.pages_visited}</span>
                  </td>
                  <td className="px-4 py-3 text-slate-500 whitespace-nowrap">
                    {formatDate(s.last_login)}
                  </td>
                  <td className="px-4 py-3">
                    {editingNotes === s.id ? (
                      <div className="flex gap-1">
                        <input
                          type="text"
                          value={notesValue}
                          onChange={(e) => setNotesValue(e.target.value)}
                          className="w-full rounded border border-slate-300 px-2 py-1 text-sm focus:border-blue-500 focus:outline-none"
                          onKeyDown={(e) => { if (e.key === "Enter") saveNotes(s.id); if (e.key === "Escape") setEditingNotes(null); }}
                          autoFocus
                        />
                        <button onClick={() => saveNotes(s.id)} className="text-blue-600 hover:underline text-xs">Save</button>
                      </div>
                    ) : (
                      <span
                        onClick={() => { setEditingNotes(s.id); setNotesValue(s.notes || ""); }}
                        className="cursor-pointer text-slate-500 hover:text-slate-700"
                        title="Click to edit"
                      >
                        {s.notes || <span className="text-slate-300 italic">add notes</span>}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => removeStudent(s.id)}
                      className="text-red-500 hover:text-red-700 text-xs"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
