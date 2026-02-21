import Database from "better-sqlite3";
import path from "path";
import { randomBytes, scryptSync } from "crypto";

const DB_PATH = process.env.DB_PATH || path.join(process.cwd(), "pa-bootcamp.db");

let _db: Database.Database | null = null;

function getDb(): Database.Database {
  if (!_db) {
    _db = new Database(DB_PATH);
    _db.pragma("journal_mode = WAL");
    _db.pragma("foreign_keys = ON");
    _db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        role TEXT DEFAULT 'student',
        repo_url TEXT DEFAULT '',
        notes TEXT DEFAULT '',
        created_at TEXT DEFAULT (datetime('now')),
        last_login TEXT DEFAULT (datetime('now'))
      );

      CREATE TABLE IF NOT EXISTS page_visits (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER REFERENCES users(id),
        path TEXT NOT NULL,
        visited_at TEXT DEFAULT (datetime('now'))
      );

      CREATE TABLE IF NOT EXISTS progress (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL REFERENCES users(id),
        exercise_key TEXT NOT NULL,
        completed_at TEXT DEFAULT (datetime('now')),
        UNIQUE(user_id, exercise_key)
      );
    `);
  }
  return _db;
}

// --- Password hashing ---

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const attempt = scryptSync(password, salt, 64).toString("hex");
  return hash === attempt;
}

// --- User management ---

export interface User {
  id: number;
  name: string;
  email: string;
  password_hash: string;
  role: string;
  repo_url: string;
  notes: string;
  created_at: string;
  last_login: string;
}

export function createUser(name: string, email: string, passwordHash: string): User {
  const db = getDb();
  db.prepare("INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)").run(name, email, passwordHash);
  return db.prepare("SELECT * FROM users WHERE email = ?").get(email) as User;
}

export function getUserByEmail(email: string): User | undefined {
  return getDb().prepare("SELECT * FROM users WHERE email = ?").get(email) as User | undefined;
}

export function updateLastLogin(userId: number): void {
  getDb().prepare("UPDATE users SET last_login = datetime('now') WHERE id = ?").run(userId);
}

export function updateRepoUrl(userId: number, repoUrl: string): void {
  getDb().prepare("UPDATE users SET repo_url = ? WHERE id = ?").run(repoUrl, userId);
}

export function updateUserNotes(userId: number, notes: string): void {
  getDb().prepare("UPDATE users SET notes = ? WHERE id = ?").run(notes, userId);
}

export function deleteUser(userId: number): void {
  const db = getDb();
  db.prepare("DELETE FROM progress WHERE user_id = ?").run(userId);
  db.prepare("DELETE FROM page_visits WHERE user_id = ?").run(userId);
  db.prepare("DELETE FROM users WHERE id = ?").run(userId);
}

// --- Student queries (for admin) ---

export interface StudentSummary {
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

export function getAllStudents(): StudentSummary[] {
  return getDb().prepare(`
    SELECT u.id, u.name, u.email, u.repo_url, u.notes, u.created_at, u.last_login,
           (SELECT COUNT(*) FROM progress p WHERE p.user_id = u.id) AS exercises_completed,
           (SELECT COUNT(DISTINCT path) FROM page_visits v WHERE v.user_id = u.id) AS pages_visited
    FROM users u
    WHERE u.role = 'student'
    ORDER BY u.name ASC
  `).all() as StudentSummary[];
}

export interface StudentDetail {
  user: User;
  visits: { path: string; visit_count: number; last_visited: string }[];
  progress: { exercise_key: string; completed_at: string }[];
}

export function getStudentDetail(userId: number): StudentDetail | null {
  const db = getDb();
  const user = db.prepare("SELECT * FROM users WHERE id = ?").get(userId) as User | undefined;
  if (!user) return null;

  const visits = db.prepare(`
    SELECT path, COUNT(*) AS visit_count, MAX(visited_at) AS last_visited
    FROM page_visits WHERE user_id = ? GROUP BY path ORDER BY visit_count DESC
  `).all(userId) as { path: string; visit_count: number; last_visited: string }[];

  const progress = db.prepare(
    "SELECT exercise_key, completed_at FROM progress WHERE user_id = ? ORDER BY completed_at DESC"
  ).all(userId) as { exercise_key: string; completed_at: string }[];

  return { user, visits, progress };
}

// --- Page visit tracking ---

export function recordVisit(pagePath: string, userId?: number): void {
  if (userId) {
    getDb().prepare("INSERT INTO page_visits (path, user_id) VALUES (?, ?)").run(pagePath, userId);
  } else {
    getDb().prepare("INSERT INTO page_visits (path) VALUES (?)").run(pagePath);
  }
}

export interface PageVisitSummary {
  path: string;
  visit_count: number;
  last_visited: string;
}

export function getPageVisitSummary(): PageVisitSummary[] {
  return getDb().prepare(`
    SELECT path, COUNT(*) AS visit_count, MAX(visited_at) AS last_visited
    FROM page_visits
    GROUP BY path
    ORDER BY visit_count DESC
  `).all() as PageVisitSummary[];
}

// --- Progress tracking ---

export function getProgress(userId: number): string[] {
  const rows = getDb().prepare(
    "SELECT exercise_key FROM progress WHERE user_id = ?"
  ).all(userId) as { exercise_key: string }[];
  return rows.map((r) => r.exercise_key);
}

export function toggleProgress(userId: number, exerciseKey: string): boolean {
  const db = getDb();
  const existing = db.prepare(
    "SELECT id FROM progress WHERE user_id = ? AND exercise_key = ?"
  ).get(userId, exerciseKey);
  if (existing) {
    db.prepare("DELETE FROM progress WHERE user_id = ? AND exercise_key = ?").run(userId, exerciseKey);
    return false;
  } else {
    db.prepare("INSERT INTO progress (user_id, exercise_key) VALUES (?, ?)").run(userId, exerciseKey);
    return true;
  }
}
