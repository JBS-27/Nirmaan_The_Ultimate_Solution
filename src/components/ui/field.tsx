import { type ReactNode } from "react";
import { Label } from "./label";
import { cn } from "@/lib/utils";

export function Field({
  label,
  hint,
  className,
  children,
}: {
  label: string;
  hint?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <label className={cn("flex flex-col gap-1.5", className)}>
      <Label>{label}</Label>
      {children}
      {hint ? <span className="text-xs text-faint">{hint}</span> : null}
    </label>
  );
}

export function NativeSelect({
  className,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        "flex h-11 w-full rounded-md border border-line bg-bg-elevated px-3 text-sm text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest/40",
        className,
      )}
      {...props}
    />
  );
}
