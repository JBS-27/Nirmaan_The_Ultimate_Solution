import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ClipboardList, Eye, Layers3, Wallet } from "lucide-react";
import { PublicFooter, PublicHeader } from "@/components/public-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { PHASE_TEMPLATES } from "@/lib/constants";
import { money, pct } from "@/lib/format";
import { SignedIn, SignedOut } from "@/lib/auth/gates";
import { getProject, listProjects } from "@/lib/server/projects";
import { useAsync } from "@/lib/use-async";
import { useCurrentUserState } from "@/lib/auth/use-current-user";

export const Route = createFileRoute("/twin")({ component: TwinPage });

function TwinPage() {
  return (
    <div className="min-h-dvh bg-bg text-ink">
      <PublicHeader active="twin" />
      <main>
        <section className="bg-forest text-cream">
          <div className="mx-auto grid max-w-6xl items-end gap-10 px-4 py-16 md:grid-cols-2 md:px-8 md:py-24">
            <div>
              <p className="text-xs font-medium tracking-[0.18em] text-cream/60 uppercase">Digital twin</p>
              <h1 className="mt-3 font-display text-4xl font-medium tracking-tight md:text-6xl">
                One ledger for stuff, people, and money.
              </h1>
              <p className="mt-5 max-w-md text-cream/80">
                Plant a project and Nirmaan drafts eight phases, a live BOQ and a cash envelope. The twin is the
                site book — not a slide.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <SignedOut>
                  <Button asChild size="lg" className="bg-cream text-ink hover:bg-bg">
                    <Link to="/login" search={{ redirect: "/app/new" }}>
                      Create your site book
                      <ArrowRight className="size-4" />
                    </Link>
                  </Button>
                </SignedOut>
                <SignedIn>
                  <Button asChild size="lg" className="bg-cream text-ink hover:bg-bg">
                    <Link to="/dashboard">
                      Open your sites
                      <ArrowRight className="size-4" />
                    </Link>
                  </Button>
                </SignedIn>
                <Button asChild size="lg" variant="outline" className="border-cream/30 bg-transparent text-cream hover:bg-cream/10">
                  <Link to="/marketplace">Browse the market</Link>
                </Button>
              </div>
            </div>
            <LiveOrSample />
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-16 md:px-8 md:py-24">
          <p className="text-xs font-medium tracking-[0.18em] text-forest uppercase">Eight phases</p>
          <h2 className="mt-3 max-w-xl font-display text-3xl tracking-tight md:text-5xl">
            Site prep to handover, templated for India.
          </h2>
          <ol className="mt-10 grid gap-3 md:grid-cols-2">
            {PHASE_TEMPLATES.map((p, i) => (
              <li key={p.key} className="flex gap-4 rounded-xl bg-bg-elevated p-5 shadow-[var(--shadow-card)]">
                <span className="font-mono text-xs text-faint">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <p className="font-display text-xl tracking-tight">{p.name}</p>
                  <p className="mt-1 text-sm text-muted">
                    About {Math.round(p.costShare * 100)}% of envelope · {Math.round(p.timeShare * 100)}% of the calendar
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="border-y border-line bg-bg-sunken">
          <div className="mx-auto grid max-w-6xl gap-8 px-4 py-16 md:grid-cols-2 md:px-8">
            {[
              { icon: Layers3, t: "Materials that move", d: "Needed / ordered / received / used — with waste factors and local rates." },
              { icon: Wallet, t: "Cash that doesn't vanish", d: "Bills, UPI payouts, remaining envelope, overrun flags before plaster." },
              { icon: ClipboardList, t: "A crew you can pay fairly", d: "Daily rates, tap attendance, pending wages calculated — not argued." },
              { icon: Eye, t: "Ask the twin", d: "“How much cement is left for the first floor?” answered from your ledger." },
            ].map((row) => (
              <div key={row.t} className="flex gap-3">
                <row.icon className="mt-0.5 size-4 shrink-0 text-forest" />
                <div>
                  <p className="font-medium">{row.t}</p>
                  <p className="mt-1 text-sm text-muted">{row.d}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
      <PublicFooter />
    </div>
  );
}

function LiveOrSample() {
  const { user, isPending } = useCurrentUserState();
  if (isPending || !user) return <SampleTwin />;
  return <LiveTwin />;
}

function LiveTwin() {
  const projects = useAsync(() => listProjects(), []);
  const p = projects.data?.[0];
  const snap = useAsync(() => (p ? getProject({ data: p.id }) : Promise.resolve(null)), [p?.id]);
  if (projects.loading && !p) return <SampleTwin />;
  if (!p) return <SampleTwin />;
  const phases = snap.data?.phases ?? [];
  const leftover = (snap.data?.materials ?? []).filter((m) => /cement/i.test(m.name))[0];
  const cementLeft = leftover ? Math.max(0, leftover.qtyNeeded - leftover.qtyUsed) : null;
  return (
    <Card className="bg-bg-elevated p-3 text-ink">
      <div className="rounded-xl bg-bg p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs tracking-wide text-muted uppercase">{p.city}</p>
            <p className="font-display text-2xl tracking-tight">{p.name}</p>
          </div>
          <span className="rounded-full bg-forest-soft px-2.5 py-1 text-xs font-medium text-forest-deep">
            {pct(p.progress)}
          </span>
        </div>
        <Progress value={p.progress} className="mt-4" />
        <div className="mt-5 grid grid-cols-3 gap-3 text-sm">
          <div>
            <p className="text-xs text-muted">Spent</p>
            <p className="font-medium tabular-nums">{money(p.spent)}</p>
          </div>
          <div>
            <p className="text-xs text-muted">Envelope</p>
            <p className="font-medium tabular-nums">{money(p.budget)}</p>
          </div>
          <div>
            <p className="text-xs text-muted">Cement left</p>
            <p className="font-medium tabular-nums">{cementLeft == null ? "—" : `${Math.round(cementLeft)} bags`}</p>
          </div>
        </div>
        {phases.length ? (
          <div className="mt-4 space-y-2">
            {phases.slice(0, 3).map((ph) => (
              <div key={ph.id} className="flex items-center gap-3">
                <span className="w-28 truncate text-xs text-muted">{ph.name}</span>
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-bg-sunken">
                  <div className="h-full rounded-full bg-ink/80" style={{ width: `${ph.progress}%` }} />
                </div>
                <span className="w-8 text-right font-mono text-xs tabular-nums">{ph.progress}%</span>
              </div>
            ))}
          </div>
        ) : null}
        <Button asChild className="mt-5 w-full">
          <Link to="/app/projects/$projectId" params={{ projectId: String(p.id) }} search={{}}>
            Open this twin
          </Link>
        </Button>
      </div>
    </Card>
  );
}

function SampleTwin() {
  return (
    <Card className="bg-bg-elevated p-3 text-ink">
      <div className="rounded-xl bg-bg p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs tracking-wide text-muted uppercase">Sample · Koramangala 3BHK</p>
            <p className="font-display text-2xl tracking-tight">42% complete</p>
          </div>
          <span className="rounded-full bg-forest-soft px-2.5 py-1 text-xs font-medium text-forest-deep">On watch</span>
        </div>
        <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-bg-sunken">
          <div className="h-full w-[42%] rounded-full bg-forest" />
        </div>
        <div className="mt-5 grid grid-cols-3 gap-3 text-sm">
          <div>
            <p className="text-xs text-muted">Spent</p>
            <p className="font-medium tabular-nums">{money(1860000)}</p>
          </div>
          <div>
            <p className="text-xs text-muted">Envelope</p>
            <p className="font-medium tabular-nums">{money(4200000)}</p>
          </div>
          <div>
            <p className="text-xs text-muted">Cement left</p>
            <p className="font-medium tabular-nums">186 bags</p>
          </div>
        </div>
      </div>
    </Card>
  );
}
