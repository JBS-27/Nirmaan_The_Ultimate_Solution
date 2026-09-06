import { type InputHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => (
    <input
      type={type}
      ref={ref}
      className={cn(
        "flex h-11 w-full rounded-md border border-line bg-bg-elevated px-3 text-sm text-ink shadow-[0_0_0_1px_rgba(26,25,22,0.02)] placeholder:text-faint focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest/40 disabled:opacity-50",
        className,
      )}
      {...props}
    />
  ),
);
Input.displayName = "Input";
