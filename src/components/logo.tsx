import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={cn("size-8", className)}
      fill="none"
      aria-hidden="true"
    >
      <rect width="32" height="32" rx="8" className="fill-forest" />
      <path
        d="M8 22V12.5L16 8l8 4.5V22"
        className="stroke-cream"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="M12 22v-6h8v6" className="stroke-cream" strokeWidth="1.6" />
      <path d="M16 8v4" className="stroke-cream" strokeWidth="1.6" />
    </svg>
  );
}

export function Logo({ className, wordmark = true }: { className?: string; wordmark?: boolean }) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <LogoMark />
      {wordmark ? (
        <span className="font-display text-xl font-medium tracking-tight text-ink">Nirmaan</span>
      ) : null}
    </span>
  );
}
