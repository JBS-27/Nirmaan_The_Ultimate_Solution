import { cn } from "@/lib/utils";
import { type HTMLAttributes } from "react";

export function TabBar({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex gap-1 overflow-x-auto rounded-lg bg-bg-sunken p-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
        className,
      )}
      {...props}
    />
  );
}

export function Tab({
  active,
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement> & { active?: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 rounded-md px-3 py-2 text-sm font-medium transition-colors",
        active ? "bg-bg-elevated text-ink shadow-[var(--shadow-card)]" : "text-muted hover:text-ink",
        className,
      )}
      {...props}
    />
  );
}
