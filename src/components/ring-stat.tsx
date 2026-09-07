import { cn } from "@/lib/utils";

export function RingStat({
  value,
  label,
  hint,
  size = 112,
}: {
  value: number;
  label: string;
  hint?: string;
  size?: number;
}) {
  const clamped = Math.max(0, Math.min(100, Math.round(value)));
  return (
    <div className="flex items-center gap-4">
      <div
        className="relative grid place-items-center rounded-full"
        style={{
          width: size,
          height: size,
          background: `conic-gradient(var(--color-forest) ${clamped * 3.6}deg, var(--color-bg-sunken) 0deg)`,
        }}
      >
        <div
          className="grid place-items-center rounded-full bg-bg-elevated"
          style={{ width: size - 18, height: size - 18 }}
        >
          <span className="font-display text-2xl tracking-tight tabular-nums">{clamped}%</span>
        </div>
      </div>
      <div>
        <p className="text-xs tracking-wide text-muted uppercase">{label}</p>
        {hint ? <p className={cn("mt-1 text-sm text-ink-soft")}>{hint}</p> : null}
      </div>
    </div>
  );
}
