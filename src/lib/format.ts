export function money(n: number, currency = "INR"): string {
  try {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(Math.round(n));
  } catch {
    return `₹${Math.round(n).toLocaleString("en-IN")}`;
  }
}

export function moneyExact(n: number, currency = "INR"): string {
  try {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    }).format(n);
  } catch {
    return `₹${n.toLocaleString("en-IN")}`;
  }
}

export function compactMoney(n: number): string {
  const abs = Math.abs(n);
  if (abs >= 1_00_00_000) return `₹${(n / 1_00_00_000).toFixed(2)} Cr`;
  if (abs >= 1_00_000) return `₹${(n / 1_00_000).toFixed(1)} L`;
  if (abs >= 1_000) return `₹${(n / 1_000).toFixed(1)}k`;
  return money(n);
}

export function qty(n: number, unit?: string): string {
  const rounded = Math.abs(n - Math.round(n)) < 0.05 ? Math.round(n) : Number(n.toFixed(1));
  return unit ? `${rounded.toLocaleString("en-IN")} ${unit}` : rounded.toLocaleString("en-IN");
}

export function formatDate(iso: string): string {
  if (!iso) return "—";
  const d = new Date(iso.slice(0, 10) + "T00:00:00");
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export function formatShort(iso: string): string {
  if (!iso) return "—";
  const d = new Date(iso.slice(0, 10) + "T00:00:00");
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

export function pct(n: number): string {
  return `${Math.round(n)}%`;
}
