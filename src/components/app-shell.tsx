import { Link, Navigate, Outlet, useRouterState } from "@tanstack/react-router";
import {
  Bell,
  Hammer,
  Home,
  MessageSquare,
  Plus,
  Store,
  UserRound,
} from "lucide-react";
import { useEffect, useState } from "react";
import { RedirectToSignIn, UserButton } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { getMyProfile, listNotifications, markNotificationsRead } from "@/lib/server/profile";
import { Logo } from "./logo";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/app" as const, label: "Home", icon: Home, primary: false },
  { to: "/app/market" as const, label: "Market", icon: Store, primary: false },
  { to: "/app/new" as const, label: "New", icon: Plus, primary: true },
  { to: "/app/assistant" as const, label: "Assistant", icon: MessageSquare, primary: false },
  { to: "/app/account" as const, label: "You", icon: UserRound, primary: false },
];

export function AppShell() {
  const { user, isPending } = useCurrentUserState();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [onboarded, setOnboarded] = useState<boolean | null>(null);
  const [role, setRole] = useState<string>("owner");
  const [unread, setUnread] = useState(0);
  const [openNotes, setOpenNotes] = useState(false);
  const [notes, setNotes] = useState<{ id: number; title: string; body: string; href: string | null }[]>([]);

  useEffect(() => {
    if (!user) return;
    getMyProfile()
      .then((p) => {
        setOnboarded(p.onboarded);
        setRole(p.role);
      })
      .catch(() => setOnboarded(false));
    listNotifications()
      .then((n) => {
        setNotes(n);
        setUnread(n.filter((x) => !x.read).length);
      })
      .catch(() => undefined);
  }, [user, pathname]);

  if (isPending) {
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

  if (!user) return <RedirectToSignIn to="/login" />;
  if (onboarded === null) {
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
  if (!onboarded) return <Navigate to="/onboarding" />;

  return (
    <div className="min-h-dvh bg-bg">
      <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-line bg-bg/90 px-4 backdrop-blur-md">
        <Link to="/app" className="flex items-center gap-2">
          <Logo />
        </Link>
        <nav className="ml-6 hidden items-center gap-1 md:flex">
          {role === "admin" ? (
            <Link
              to="/app/admin"
              className={cn(
                "rounded-md px-3 py-2 text-sm font-medium",
                pathname === "/app/admin" ? "bg-bg-sunken text-ink" : "text-muted hover:text-ink",
              )}
            >
              Admin
            </Link>
          ) : null}
          {NAV.filter((n) => n.to !== "/app/new").map((item) => (
            <Link
              key={item.to}
              to={item.to}
              search={{}}
              className={cn(
                "rounded-md px-3 py-2 text-sm font-medium",
                pathname === item.to || (item.to !== "/app" && pathname.startsWith(item.to))
                  ? "bg-bg-sunken text-ink"
                  : "text-muted hover:text-ink",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <Button asChild size="sm" className="hidden md:inline-flex">
            <Link to="/app/new" search={{}}>
              <Hammer className="size-4" />
              New project
            </Link>
          </Button>
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={async () => {
                setOpenNotes((v) => !v);
                if (!openNotes) {
                  const n = await listNotifications().catch(() => []);
                  setNotes(n);
                  setUnread(n.filter((x) => !x.read).length);
                }
              }}
              aria-label="Notifications"
            >
              <Bell className="size-4" />
              {unread > 0 ? (
                <span className="absolute top-2 right-2 size-1.5 rounded-full bg-forest" />
              ) : null}
            </Button>
            {openNotes ? (
              <div className="absolute top-12 right-0 z-40 w-80 rounded-xl bg-bg-elevated p-2 shadow-[var(--shadow-card)]">
                <div className="flex items-center justify-between px-2 py-1">
                  <p className="text-sm font-medium">Alerts</p>
                  <button
                    type="button"
                    className="text-xs text-muted"
                    onClick={async () => {
                      await markNotificationsRead();
                      setUnread(0);
                    }}
                  >
                    Mark read
                  </button>
                </div>
                {notes.length === 0 ? (
                  <p className="px-2 py-6 text-center text-sm text-muted">Quiet site — no alerts yet.</p>
                ) : (
                  <ul className="max-h-80 overflow-auto">
                    {notes.map((n) => (
                      <li key={n.id} className="rounded-md px-2 py-2 hover:bg-bg-sunken">
                        {n.href ? (
                          <a href={n.href} onClick={() => setOpenNotes(false)}>
                            <p className="text-sm font-medium">{n.title}</p>
                            <p className="text-xs text-muted">{n.body}</p>
                          </a>
                        ) : (
                          <>
                            <p className="text-sm font-medium">{n.title}</p>
                            <p className="text-xs text-muted">{n.body}</p>
                          </>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ) : null}
          </div>
          <UserButton />
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-4 pt-6 pb-24 md:pb-10">
        <Outlet />
      </main>

      <nav className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-5 border-t border-line bg-bg/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md md:hidden">
        {NAV.map((item) => {
          const Icon = item.icon;
          const active =
            pathname === item.to || (item.to !== "/app" && pathname.startsWith(item.to));
          return (
            <Link
              key={item.to}
              to={item.to}
              search={{}}
              className={cn(
                "flex flex-col items-center gap-1 py-2 text-[11px] font-medium",
                item.primary ? "text-forest" : active ? "text-ink" : "text-muted",
              )}
            >
              <span
                className={cn(
                  "flex size-10 items-center justify-center rounded-full",
                  item.primary && "bg-forest text-cream",
                  !item.primary && active && "bg-bg-sunken",
                )}
              >
                <Icon className="size-4" />
              </span>
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

export function PageHeader({
  kicker,
  title,
  description,
  action,
}: {
  kicker?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {kicker ? (
          <Badge tone="forest" className="mb-2">
            {kicker}
          </Badge>
        ) : null}
        <h1 className="font-display text-3xl font-medium tracking-tight md:text-4xl">{title}</h1>
        {description ? <p className="mt-1 max-w-xl text-muted">{description}</p> : null}
      </div>
      {action}
    </div>
  );
}
