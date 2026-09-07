import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function SitePhoto({
  src,
  alt,
  className,
  children,
}: {
  src: string;
  alt: string;
  className?: string;
  children?: ReactNode;
}) {
  return (
    <div className={cn("relative overflow-hidden bg-bg-sunken", className)}>
      <img
        src={src}
        alt={alt}
        className="size-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03]"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/15 to-transparent" />
      {children ? <div className="absolute inset-x-0 bottom-0 p-4 text-cream">{children}</div> : null}
    </div>
  );
}
