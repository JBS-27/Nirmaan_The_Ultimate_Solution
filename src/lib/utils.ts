import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function num(v: unknown): number {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v === "string") {
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
  }
  return 0;
}

export function asDate(v: unknown): string {
  if (typeof v === "string") return v.slice(0, 10);
  if (v instanceof Date && !Number.isNaN(v.getTime())) {
    return v.toISOString().slice(0, 10);
  }
  return "";
}

export function asIso(v: unknown): string {
  if (typeof v === "string") return v;
  if (v instanceof Date && !Number.isNaN(v.getTime())) return v.toISOString();
  return new Date().toISOString();
}

export function isUnauthorized(err: unknown): boolean {
  return (
    err instanceof Error &&
    (err.message === "Unauthorized" ||
      (err as { status?: number }).status === 401)
  );
}

export function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

export function addDays(iso: string, days: number): string {
  const d = new Date(iso + "T00:00:00");
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

export function daysBetween(a: string, b: string): number {
  const da = new Date(a + "T00:00:00").getTime();
  const db = new Date(b + "T00:00:00").getTime();
  return Math.round((db - da) / 86400000);
}
