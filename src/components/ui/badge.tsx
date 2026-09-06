import { cn } from "@/lib/utils";
import { type HTMLAttributes } from "react";

export function Badge({
  className,
  tone = "neutral",
  ...props
}: HTMLAttributes<HTMLSpanElement> & {
  tone?: "neutral" | "forest" | "warn" | "danger" | "ok";
}) {
  const tones = {
    neutral: "bg-bg-sunken text-ink-soft",
    forest: "bg-forest-soft text-forest-deep",
    warn: "bg-[#f3e6c8] text-warn",
    danger: "bg-[#f3d8d4] text-danger",
    ok: "bg-forest-soft text-ok",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        tones[tone],
        className,
      )}
      {...props}
    />
  );
}
