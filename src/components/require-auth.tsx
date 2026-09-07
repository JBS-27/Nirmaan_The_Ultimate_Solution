import { Navigate } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { AFTER_LOGIN } from "@/lib/paths";
import { Skeleton } from "./ui/skeleton";

const SESSION_WAIT_MS = 8000;

export function SessionPending() {
  return (
    <div className="flex min-h-dvh flex-col bg-bg">
      <header className="flex h-14 items-center justify-between border-b border-line px-4">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="size-8 rounded-full" />
      </header>
      <div className="p-4">
        <Skeleton className="h-40 w-full rounded-xl" />
      </div>
    </div>
  );
}

/**
 * Wait for the session to resolve, then render children or send the visitor
 * to sign-in. Times out so a hung /get-session cannot spin forever.
 */
export function RequireAuth({
  children,
  redirectTo = AFTER_LOGIN,
}: {
  children: ReactNode;
  redirectTo?: string;
}) {
  const { user, isPending } = useCurrentUserState();
  const [timedOut, setTimedOut] = useState(false);

  useEffect(() => {
    const t = window.setTimeout(() => setTimedOut(true), SESSION_WAIT_MS);
    return () => window.clearTimeout(t);
  }, []);

  if (isPending && !timedOut) return <SessionPending />;
  if (!user) return <Navigate to="/login" search={{ redirect: redirectTo }} replace />;
  return <>{children}</>;
}

export function RedirectIfSignedIn({ to = AFTER_LOGIN }: { to?: string }) {
  const { user, isPending } = useCurrentUserState();
  const [timedOut, setTimedOut] = useState(false);

  useEffect(() => {
    const t = window.setTimeout(() => setTimedOut(true), SESSION_WAIT_MS);
    return () => window.clearTimeout(t);
  }, []);

  if (isPending && !timedOut) return null;
  if (user) return <Navigate to={to} replace />;
  return null;
}
