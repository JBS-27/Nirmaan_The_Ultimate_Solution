import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { type ComponentProps } from "react";
import { cn } from "@/lib/utils";

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogClose = DialogPrimitive.Close;

export function DialogContent({
  className,
  children,
  ...props
}: ComponentProps<typeof DialogPrimitive.Content>) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-ink/40 data-[state=open]:animate-in" />
      <DialogPrimitive.Content
        className={cn(
          "fixed top-1/2 left-1/2 z-50 w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-xl bg-bg-elevated p-5 text-ink shadow-[var(--shadow-card)] focus:outline-none",
          className,
        )}
        {...props}
      >
        {children}
        <DialogPrimitive.Close className="absolute top-3 right-3 rounded-md p-2 text-muted hover:bg-bg-sunken">
          <X className="size-4" />
          <span className="sr-only">Close</span>
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}

export function DialogTitle({ className, ...props }: ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      className={cn("font-display text-xl font-medium tracking-tight", className)}
      {...props}
    />
  );
}

export function DialogDesc({ className, ...props }: ComponentProps<typeof DialogPrimitive.Description>) {
  return <DialogPrimitive.Description className={cn("mt-1 text-sm text-muted", className)} {...props} />;
}
