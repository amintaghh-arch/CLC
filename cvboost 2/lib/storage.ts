"use client";

import { CVEntry, HistoryEvent, User } from "./types";

const USERS_KEY = "cvboost_users";
const SESSION_KEY = "cvboost_session";
const CVS_KEY = "cvboost_cvs";
const HISTORY_KEY = "cvboost_history";

const FREE_CREDITS = 5;

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

function uid() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

// ---------- Users / auth (demo only) ----------

export function getUsers(): User[] {
  return read<User[]>(USERS_KEY, []);
}

export function registerUser(email: string, password: string): User {
  const users = getUsers();
  if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
    throw new Error("Un compte existe deja avec cet email.");
  }
  const user: User = {
    id: uid(),
    email,
    password,
    credits: FREE_CREDITS,
    plan: "free",
    createdAt: new Date().toISOString(),
  };
  write(USERS_KEY, [...users, user]);
  setSession(user.id);
  return user;
}

export function loginUser(email: string, password: string): User {
  const users = getUsers();
  const user = users.find(
    (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
  );
  if (!user) throw new Error("Email ou mot de passe incorrect.");
  setSession(user.id);
  return user;
}

export function setSession(userId: string) {
  write(SESSION_KEY, userId);
}

export function logout() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(SESSION_KEY);
}

export function getCurrentUser(): User | null {
  const id = read<string | null>(SESSION_KEY, null);
  if (!id) return null;
  return getUsers().find((u) => u.id === id) ?? null;
}

export function updateUser(userId: string, patch: Partial<User>) {
  const users = getUsers().map((u) => (u.id === userId ? { ...u, ...patch } : u));
  write(USERS_KEY, users);
}

export function spendCredits(userId: string, amount: number): boolean {
  const user = getUsers().find((u) => u.id === userId);
  if (!user) return false;
  if (user.plan === "premium") return true;
  if (user.credits < amount) return false;
  updateUser(userId, { credits: user.credits - amount });
  return true;
}

export function addCredits(userId: string, amount: number) {
  const user = getUsers().find((u) => u.id === userId);
  if (!user) return;
  updateUser(userId, { credits: user.credits + amount });
}

// ---------- CVs ----------

export function getCVs(userId: string): CVEntry[] {
  return read<CVEntry[]>(CVS_KEY, []).filter((c) => c.userId === userId);
}

export function getCV(cvId: string): CVEntry | null {
  return read<CVEntry[]>(CVS_KEY, []).find((c) => c.id === cvId) ?? null;
}

export function saveCV(cv: CVEntry) {
  const all = read<CVEntry[]>(CVS_KEY, []);
  const idx = all.findIndex((c) => c.id === cv.id);
  if (idx === -1) all.push(cv);
  else all[idx] = cv;
  write(CVS_KEY, all);
}

export function createCV(userId: string, title: string, rawText: string): CVEntry {
  const cv: CVEntry = {
    id: uid(),
    userId,
    title,
    rawText,
    createdAt: new Date().toISOString(),
  };
  saveCV(cv);
  return cv;
}

// ---------- History ----------

export function getHistory(userId: string): HistoryEvent[] {
  return read<HistoryEvent[]>(HISTORY_KEY, [])
    .filter((h) => h.userId === userId)
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

export function logHistory(event: Omit<HistoryEvent, "id" | "createdAt">) {
  const all = read<HistoryEvent[]>(HISTORY_KEY, []);
  all.push({ ...event, id: uid(), createdAt: new Date().toISOString() });
  write(HISTORY_KEY, all);
}

// ---------- Admin ----------

export function getAdminStats() {
  const users = getUsers();
  const cvs = read<CVEntry[]>(CVS_KEY, []);
  const history = read<HistoryEvent[]>(HISTORY_KEY, []);
  return {
    totalUsers: users.length,
    premiumUsers: users.filter((u) => u.plan === "premium").length,
    totalCVs: cvs.length,
    totalAnalyses: history.filter((h) => h.type === "analyse").length,
    totalOptimizations: history.filter((h) => h.type === "optimisation").length,
    totalLetters: history.filter((h) => h.type === "lettre").length,
    users,
  };
}
