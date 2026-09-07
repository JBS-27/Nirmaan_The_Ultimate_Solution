import { createFileRoute, Link, Navigate } from "@tanstack/react-router";
import { ArrowRight, Eye, EyeOff, Lock, Mail, ShieldCheck, UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import { GROK_PROVIDERS, authClient, authEnabled, signIn } from "@/lib/auth/client";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { Logo, LogoMark } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { APP_NAME } from "@/lib/constants";
import { money } from "@/lib/format";
import { cn } from "@/lib/utils";

const LIVE_SITE = "https://nirmaan-the-ultimate-solution.vercel.app";

function isVercelPreviewHost(hostname: string) {
  return hostname.endsWith(".vercel.app") && hostname !== new URL(LIVE_SITE).hostname;
}

function isGrokSandbox(hostname: string) {
  return hostname.endsWith(".grok-sandbox.com");
}

function friendlyAuthError(message: string) {
  if (/invalid origin/i.test(message)) {
    return "This preview URL cannot sign you in. Open the live site instead.";
  }
  if (/invalid redirect/i.test(message)) {
    return "Google and X are not connected on this site. Create an account with email instead.";
  }
  return message;
}

export const Route = createFileRoute("/login")({
  validateSearch: (s: Record<string, unknown>): { redirect?: string } =>
    typeof s.redirect === "string" && s.redirect.startsWith("/") ? { redirect: s.redirect } : {},
  component: Login,
});

function safeRedirect(path?: string) {
  if (!path || !path.startsWith("/") || path.startsWith("//")) return "/app";
  return path;
}

function Login() {
  const { redirect } = Route.useSearch();
  const next = safeRedirect(redirect);
  const { user, isPending } = useCurrentUserState();
  const [mode, setMode] = useState<"in" | "up">("in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [onPreviewHost, setOnPreviewHost] = useState(false);
  const [showBrokerSignIn, setShowBrokerSignIn] = useState(false);
  const [showNativeGoogle, setShowNativeGoogle] = useState(false);

  useEffect(() => {
    const host = window.location.hostname;
    setOnPreviewHost(isVercelPreviewHost(host));
    setShowBrokerSignIn(isGrokSandbox(host));
    setShowNativeGoogle(!isGrokSandbox(host) && !isVercelPreviewHost(host));
  }, []);

  async function onGoogle() {
    setBusy(true);
    setError(null);
    try {
      const res = await authClient.signIn.social({
        provider: "google",
        callbackURL: next,
        errorCallbackURL: "/login",
      });
      if (res.error) {
        throw new Error(res.error.message || "Google sign-in is not configured yet");
      }
    } catch (err) {
      setError(friendlyAuthError(err instanceof Error ? err.message : "Google sign-in failed"));
      setBusy(false);
    }
  }

  if (!isPending && user) {
    if (next !== "/app" && typeof window !== "undefined") {
      window.location.replace(next);
      return null;
    }
    return <Navigate to="/app" />;
  }

  async function onEmail(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      if (mode === "up") {
        const res = await authClient.signUp.email({ email, password, name: name || email.split("@")[0]! });
        if (res.error) throw new Error(res.error.message || "Could not create account");
      } else {
        const res = await authClient.signIn.email({ email, password });
        if (res.error) throw new Error(res.error.message || "Could not sign in");
      }
      window.location.href = next;
    } catch (err) {
      setError(friendlyAuthError(err instanceof Error ? err.message : "Sign-in failed"));
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="bg-grid min-h-dvh lg:grid lg:grid-cols-[1.15fr_0.85fr]">
      <BrandPanel />

      <section className="relative flex flex-col px-4 py-6 sm:px-8 lg:px-12 lg:py-10">
        <header className="flex items-center justify-between">
          <Link to="/" className="inline-flex lg:hidden">
            <Logo />
          </Link>
          <Link to="/" className="ml-auto hidden text-sm text-muted hover:text-ink lg:inline-flex">
            Back to site
          </Link>
        </header>

        <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-8">
          <Card className="rounded-2xl p-6 sm:p-8">
          <p className="text-xs font-medium tracking-[0.18em] text-forest uppercase">
            {mode === "in" ? "Returning builder" : "New site book"}
          </p>
          <h1 className="mt-3 font-display text-3xl font-medium tracking-tight md:text-4xl">
            {mode === "in" ? "Welcome back" : "Open your ledger"}
          </h1>
          <p className="mt-2 text-sm text-muted">
            {mode === "in"
              ? "Sign in to the sites, crew and cash you already run."
              : `${APP_NAME} is for homeowners and the people who raise the house.`}
          </p>

          <div className="mt-6 grid grid-cols-2 rounded-lg bg-bg p-1">
            <button
              type="button"
              onClick={() => {
                setMode("in");
                setError(null);
              }}
              className={cn(
                "h-10 rounded-md text-sm font-medium transition-colors",
                mode === "in" ? "bg-bg-elevated text-ink shadow-[var(--shadow-card)]" : "text-muted",
              )}
            >
              Sign in
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("up");
                setError(null);
              }}
              className={cn(
                "h-10 rounded-md text-sm font-medium transition-colors",
                mode === "up" ? "bg-bg-elevated text-ink shadow-[var(--shadow-card)]" : "text-muted",
              )}
            >
              Create account
            </button>
          </div>

          {onPreviewHost ? (
            <p className="mt-5 rounded-md bg-danger/10 px-3 py-2 text-sm text-danger" role="status">
              Sign-in does not work on this temporary preview link. Use{" "}
              <a href={`${LIVE_SITE}/login`} className="font-medium underline underline-offset-2">
                the live site
              </a>
              .
            </p>
          ) : null}

          {isPending ? (
            <LoginSkeleton />
          ) : authEnabled ? (
            <div className="mt-6">
              {showBrokerSignIn ? (
                <>
                  <div className="grid gap-2">
                    {GROK_PROVIDERS.map((p) => (
                      <Button
                        key={p.providerId}
                        type="button"
                        variant="outline"
                        className="h-12 w-full justify-between bg-bg px-4"
                        disabled={busy}
                        onClick={() => {
                          setBusy(true);
                          setError(null);
                          void signIn(p.providerId, { callbackURL: next }).catch((err: unknown) => {
                            setError(
                              friendlyAuthError(err instanceof Error ? err.message : "Sign-in failed"),
                            );
                            setBusy(false);
                          });
                        }}
                      >
                        <span className="inline-flex items-center gap-3">
                          <ProviderMark idp={p.idp} />
                          Continue with {p.label}
                        </span>
                        <ArrowRight className="size-4 text-faint" />
                      </Button>
                    ))}
                  </div>
                  <div className="flex items-center gap-3 py-5">
                    <span className="h-px flex-1 bg-line" />
                    <span className="text-[11px] tracking-[0.16em] text-faint uppercase">or with email</span>
                    <span className="h-px flex-1 bg-line" />
                  </div>
                </>
              ) : showNativeGoogle ? (
                <>
                  <Button
                    type="button"
                    variant="outline"
                    className="h-12 w-full justify-between bg-bg px-4"
                    disabled={busy}
                    onClick={() => void onGoogle()}
                  >
                    <span className="inline-flex items-center gap-3">
                      <ProviderMark idp="google" />
                      Continue with Google
                    </span>
                    <ArrowRight className="size-4 text-faint" />
                  </Button>
                  <div className="flex items-center gap-3 py-5">
                    <span className="h-px flex-1 bg-line" />
                    <span className="text-[11px] tracking-[0.16em] text-faint uppercase">or with email</span>
                    <span className="h-px flex-1 bg-line" />
                  </div>
                </>
              ) : (
                <p className="mb-5 text-sm text-muted">
                  Use email and a password on this preview link, or open the live site to use
                  Google.
                </p>
              )}

              <form className="space-y-3" onSubmit={onEmail}>
                {mode === "up" ? (
                  <label className="flex flex-col gap-1.5">
                    <span className="text-sm font-medium">Full name</span>
                    <div className="relative">
                      <UserRound className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-faint" />
                      <Input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        autoComplete="name"
                        placeholder="Meera Rao"
                        className="bg-bg pl-10"
                      />
                    </div>
                  </label>
                ) : null}
                <label className="flex flex-col gap-1.5">
                  <span className="text-sm font-medium">Work email</span>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-faint" />
                    <Input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      autoComplete="email"
                      placeholder="you@studio.in"
                      className="bg-bg pl-10"
                    />
                  </div>
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className="flex items-center justify-between text-sm font-medium">
                    Password
                    {mode === "up" ? <span className="font-normal text-faint">8 characters minimum</span> : null}
                  </span>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-faint" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      required
                      minLength={8}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete={mode === "up" ? "new-password" : "current-password"}
                      placeholder={mode === "up" ? "Create a password" : "Your password"}
                      className="bg-bg pr-11 pl-10"
                    />
                    <button
                      type="button"
                      className="absolute top-1/2 right-2 inline-flex size-8 -translate-y-1/2 items-center justify-center rounded-md text-muted hover:bg-bg-sunken hover:text-ink"
                      onClick={() => setShowPassword((v) => !v)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </div>
                </label>
                {error ? (
                  <p className="rounded-md bg-danger/10 px-3 py-2 text-sm text-danger" role="alert">
                    {error}
                  </p>
                ) : null}
                <Button type="submit" className="mt-1 h-12 w-full" disabled={busy}>
                  {busy ? "Please wait…" : mode === "in" ? "Sign in to workspace" : "Create site book"}
                  {!busy ? <ArrowRight className="size-4" /> : null}
                </Button>
              </form>
            </div>
          ) : (
            <p className="mt-6 text-sm text-muted">Sign-in is disabled.</p>
          )}

          <p className="mt-8 flex items-start gap-2 border-t border-line pt-5 text-xs text-faint">
            <ShieldCheck className="mt-0.5 size-3.5 shrink-0 text-forest" />
            Session stays on this device. Projects you create are scoped to your sign-in — not shared with the
            marketplace until you hire someone.
          </p>
          </Card>
        </div>
      </section>
    </main>
  );
}

function BrandPanel() {
  return (
    <section className="relative hidden overflow-hidden bg-ink lg:flex lg:min-h-dvh lg:flex-col">
      <img src="/images/hero-site.svg" alt="" className="absolute inset-0 size-full object-cover opacity-55" />
      <div className="absolute inset-0 bg-gradient-to-br from-ink via-ink/70 to-forest-deep/40" />
      <div className="relative flex flex-1 flex-col p-10 xl:p-14">
        <Link to="/" className="inline-flex items-center gap-2">
          <LogoMark />
          <span className="font-display text-xl font-medium tracking-tight text-cream">Nirmaan</span>
        </Link>

        <div className="mt-16 max-w-lg">
          <p className="text-xs font-medium tracking-[0.2em] text-cream/50 uppercase">Construction OS</p>
          <h2 className="mt-4 font-display text-4xl leading-[1.08] font-medium tracking-tight text-balance text-cream xl:text-5xl">
            Know what the site spent before the contractor tells you.
          </h2>
          <p className="mt-5 max-w-md text-sm leading-relaxed text-cream/70">
            One ledger for materials, bills, crew and schedule — so a first-time homeowner is never the last to know.
          </p>
        </div>

        <div className="mt-12 max-w-md rounded-2xl bg-cream/10 p-2 backdrop-blur-sm">
          <div className="rounded-xl bg-bg-elevated p-5 text-ink">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[11px] tracking-[0.16em] text-muted uppercase">Koramangala 3BHK</p>
                <p className="mt-1 font-display text-2xl tracking-tight">42% complete</p>
              </div>
              <span className="rounded-full bg-forest-soft px-2.5 py-1 text-[11px] font-medium text-forest-deep">
                On watch
              </span>
            </div>
            <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-bg-sunken">
              <div className="h-full w-[42%] rounded-full bg-forest" />
            </div>
            <div className="mt-5 grid grid-cols-3 gap-3 text-sm">
              <div>
                <p className="text-[11px] text-muted">Spent</p>
                <p className="font-medium tabular-nums">{money(1860000)}</p>
              </div>
              <div>
                <p className="text-[11px] text-muted">Envelope</p>
                <p className="font-medium tabular-nums">{money(4200000)}</p>
              </div>
              <div>
                <p className="text-[11px] text-muted">Cement left</p>
                <p className="font-medium tabular-nums">186 bags</p>
              </div>
            </div>
          </div>
        </div>

        <dl className="mt-auto grid grid-cols-3 gap-6 pt-12 text-cream">
          <div>
            <dt className="text-[11px] tracking-[0.14em] text-cream/45 uppercase">Overrun cut</dt>
            <dd className="mt-1 font-display text-2xl tracking-tight">15–25%</dd>
          </div>
          <div>
            <dt className="text-[11px] tracking-[0.14em] text-cream/45 uppercase">Phases</dt>
            <dd className="mt-1 font-display text-2xl tracking-tight">8</dd>
          </div>
          <div>
            <dt className="text-[11px] tracking-[0.14em] text-cream/45 uppercase">Cities</dt>
            <dd className="mt-1 font-display text-2xl tracking-tight">10</dd>
          </div>
        </dl>
      </div>
    </section>
  );
}

function LoginSkeleton() {
  return (
    <div className="mt-6 space-y-3">
      <Skeleton className="h-12 w-full rounded-md" />
      <Skeleton className="h-12 w-full rounded-md" />
      <div className="flex items-center gap-3 py-2">
        <span className="h-px flex-1 bg-line" />
        <span className="text-[11px] tracking-[0.16em] text-faint uppercase">checking session</span>
        <span className="h-px flex-1 bg-line" />
      </div>
      <Skeleton className="h-11 w-full rounded-md" />
      <Skeleton className="h-11 w-full rounded-md" />
      <Skeleton className="h-12 w-full rounded-md" />
    </div>
  );
}

function ProviderMark({ idp }: { idp: string }) {
  if (idp === "google") {
    return (
      <svg viewBox="0 0 24 24" className="size-4" aria-hidden="true">
        <path
          fill="currentColor"
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          opacity="0.9"
        />
        <path
          fill="currentColor"
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          opacity="0.75"
        />
        <path
          fill="currentColor"
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
          opacity="0.6"
        />
        <path
          fill="currentColor"
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          opacity="0.45"
        />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" className="size-4" aria-hidden="true">
      <path
        fill="currentColor"
        d="M14.23 3h3.18l-6.96 7.95L18.5 21h-3.4l-4.7-6.15L5.6 21H2.4l7.44-8.5L2 3h3.5l4.25 5.64L14.23 3Zm-1.12 16.2h1.76L7.02 4.7H5.14l7.97 14.5Z"
      />
    </svg>
  );
}
