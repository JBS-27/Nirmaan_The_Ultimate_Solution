import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  ClipboardList,
  Eye,
  Layers3,
  ShieldCheck,
  Wallet,
} from "lucide-react";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { money } from "@/lib/format";

export const Route = createFileRoute("/")({ component: Home });

function AuthSlot() {
  const { user, isPending } = useCurrentUserState();
  if (isPending) return <div className="h-11 w-24 animate-pulse rounded-md bg-bg-sunken" />;
  if (user) {
    return (
      <Button asChild>
        <Link to="/app">Open workspace</Link>
      </Button>
    );
  }
  return (
    <div className="flex items-center gap-2">
      <Button asChild variant="ghost">
        <Link to="/login">Sign in</Link>
      </Button>
      <Button asChild>
        <Link to="/login">Start a project</Link>
      </Button>
    </div>
  );
}

function Home() {
  return (
    <div className="bg-bg text-ink">
      <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-line/70 bg-bg/85 px-4 backdrop-blur-md md:px-8">
        <Logo />
        <nav className="hidden items-center gap-6 text-sm text-muted md:flex">
          <a href="#how" className="hover:text-ink">
            How it works
          </a>
          <a href="#twin" className="hover:text-ink">
            Digital twin
          </a>
          <a href="#market" className="hover:text-ink">
            Marketplace
          </a>
        </nav>
        <AuthSlot />
      </header>

      <section className="relative overflow-hidden">
        <img
          src="/images/hero-site.svg"
          alt="Residential house under construction at golden hour"
          className="absolute inset-0 size-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/80 via-ink/55 to-ink/25" />
        <div className="relative mx-auto grid max-w-6xl gap-10 px-4 py-16 md:grid-cols-2 md:items-end md:px-8 md:py-24">
          <div className="text-cream">
            <p className="text-xs font-medium tracking-[0.18em] text-cream/70 uppercase">
              Construction OS · India first
            </p>
            <h1 className="mt-4 font-display text-4xl leading-[1.05] font-medium tracking-tight text-balance md:text-6xl">
              Build the house. See every brick.
            </h1>
            <p className="mt-5 max-w-md text-base text-cream/80 md:text-lg">
              Most homes overrun by 15–25%. Nirmaan is the digital twin of your site — materials, bills, crew and
              schedule — so homeowners are never the last to know.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <SignedOut>
                <Button asChild size="lg" className="bg-cream text-ink hover:bg-bg">
                  <Link to="/login">
                    Create your site book
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
              </SignedOut>
              <SignedIn>
                <Button asChild size="lg" className="bg-cream text-ink hover:bg-bg">
                  <Link to="/app">
                    Continue to projects
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
              </SignedIn>
              <Button asChild size="lg" variant="outline" className="border-cream/30 bg-transparent text-cream hover:bg-cream/10">
                <a href="#twin">See the twin</a>
              </Button>
            </div>
          </div>
          <DashboardPreview />
        </div>
      </section>

      <section className="border-y border-line bg-bg-elevated">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-4 py-8 md:grid-cols-4 md:px-8">
          {[
            { k: "15–25%", v: "Typical overrun Nirmaan is built to cut" },
            { k: "8 phases", v: "From site prep to handover, templated" },
            { k: "Live BOQ", v: "Needed, ordered, received, used" },
            { k: "Crew wages", v: "Attendance in, payout out" },
          ].map((s) => (
            <div key={s.k}>
              <p className="font-display text-2xl tracking-tight md:text-3xl">{s.k}</p>
              <p className="mt-1 text-sm text-muted">{s.v}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="how" className="bg-grid mx-auto max-w-6xl px-4 py-16 md:px-8 md:py-24">
        <p className="text-xs font-medium tracking-[0.18em] text-forest uppercase">Four moves</p>
        <h2 className="mt-3 max-w-xl font-display text-3xl tracking-tight md:text-5xl">
          A site book a non-engineer can actually run.
        </h2>
        <div className="mt-10 grid gap-4 md:grid-cols-4">
          {[
            { n: "01", t: "Plant the project", d: "Plot, floors, city, budget. Nirmaan drafts phases, a BOQ and a cash envelope." },
            { n: "02", t: "Hire the circle", d: "Verified architects, engineers, contractors and mistry — quote and hire in-app." },
            { n: "03", t: "Log the truth", d: "Bills (photo + OCR), attendance, deliveries, photos. Everyone sees the same numbers." },
            { n: "04", t: "Ask the twin", d: "“How much cement is left for the first floor?” The assistant answers from your ledger." },
          ].map((step) => (
            <article key={step.n} className="rounded-xl bg-bg-elevated p-5 shadow-[var(--shadow-card)]">
              <p className="font-mono text-xs text-faint">{step.n}</p>
              <h3 className="mt-3 font-display text-xl tracking-tight">{step.t}</h3>
              <p className="mt-2 text-sm text-muted">{step.d}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="twin" className="bg-forest text-cream">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 md:grid-cols-2 md:px-8 md:py-24">
          <div>
            <p className="text-xs font-medium tracking-[0.18em] text-cream/60 uppercase">The twin</p>
            <h2 className="mt-3 font-display text-3xl tracking-tight md:text-5xl">
              One ledger for stuff, people, and money.
            </h2>
            <ul className="mt-8 space-y-4 text-sm text-cream/80">
              {[
                { icon: Layers3, t: "Materials that move", d: "Needed / ordered / received / used — with waste factors and local rates." },
                { icon: Wallet, t: "Cash that doesn't vanish", d: "Bills, UPI payouts, remaining envelope, overrun flags before the plaster goes up." },
                { icon: ClipboardList, t: "A crew you can pay fairly", d: "Daily rates, GPS or tap attendance, pending wages calculated — not argued." },
                { icon: Eye, t: "Photos with a timestamp", d: "Progress log with AI notes. “Foundation complete — 85% of planned concrete used.”" },
              ].map((row) => (
                <li key={row.t} className="flex gap-3">
                  <row.icon className="mt-0.5 size-4 shrink-0" />
                  <div>
                    <p className="font-medium text-cream">{row.t}</p>
                    <p>{row.d}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="grid gap-3">
            <img
                src="/images/materials.svg"
              alt="Cement, steel and bricks in a material yard"
              className="h-56 w-full rounded-xl object-cover outline outline-1 -outline-offset-1 outline-cream/15 md:h-64"
            />
            <div className="grid grid-cols-2 gap-3">
              <img
                src="/images/finishing.svg"
                alt="Interior finishing of a home"
                className="h-40 w-full rounded-xl object-cover outline outline-1 -outline-offset-1 outline-cream/15"
              />
              <img
                src="/images/plans.svg"
                alt="Floor plan on a desk"
                className="h-40 w-full rounded-xl object-cover outline outline-1 -outline-offset-1 outline-cream/15"
              />
            </div>
          </div>
        </div>
      </section>

      <section id="market" className="mx-auto max-w-6xl px-4 py-16 md:px-8 md:py-24">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-medium tracking-[0.18em] text-forest uppercase">Marketplace</p>
            <h2 className="mt-3 max-w-lg font-display text-3xl tracking-tight md:text-5xl">
              Verified locals, not a directory dump.
            </h2>
          </div>
          <p className="max-w-sm text-sm text-muted">
            Architects, civil engineers, contractors, mistry and registered shops — filter by city, rates, and what they actually built.
          </p>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {[
            { role: "Architect", name: "Meera Rao Studio", city: "Bengaluru", rate: "₹180–320 / sqft" },
            { role: "Civil engineer", name: "Arjun Structural Lab", city: "Bengaluru", rate: "₹45k–1.2L / project" },
            { role: "Contractor", name: "Red Earth Builders", city: "Bengaluru", rate: "₹1,950–2,800 / sqft" },
          ].map((card) => (
            <article key={card.name} className="rounded-xl bg-bg-elevated p-5 shadow-[var(--shadow-card)]">
              <p className="text-xs tracking-wide text-forest uppercase">{card.role}</p>
              <h3 className="mt-2 font-display text-xl tracking-tight">{card.name}</h3>
              <p className="mt-1 text-sm text-muted">{card.city}</p>
              <p className="mt-4 font-medium tabular-nums">{card.rate}</p>
            </article>
          ))}
        </div>
        <div className="mt-8">
          <Button asChild variant="outline">
            <Link to="/login">Browse the market</Link>
          </Button>
        </div>
      </section>

      <section className="border-t border-line bg-bg-sunken">
        <div className="mx-auto flex max-w-6xl flex-col items-start gap-6 px-4 py-16 md:flex-row md:items-center md:justify-between md:px-8">
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-1 size-5 text-forest" />
            <div>
              <h2 className="font-display text-2xl tracking-tight md:text-3xl">Start with a sample 3BHK.</h2>
              <p className="mt-2 max-w-lg text-sm text-muted">
                Sign in, plant a Bengaluru home, and walk a live BOQ, crew sheet and cash envelope — no spreadsheet required.
              </p>
            </div>
          </div>
          <Button asChild size="lg">
            <Link to="/login">
              Open Nirmaan
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </section>

      <footer className="border-t border-line px-4 py-8 text-sm text-muted md:px-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <Logo />
          <p>Built for the people who pay for the house — and the people who raise it.</p>
        </div>
      </footer>
    </div>
  );
}

function DashboardPreview() {
  return (
    <div className="rounded-2xl bg-bg-elevated p-3 text-ink shadow-[var(--shadow-card)]">
      <div className="rounded-xl bg-bg p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs tracking-wide text-muted uppercase">Koramangala 3BHK</p>
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
        <div className="mt-5 space-y-2">
          {[
            { n: "Foundation", p: 80 },
            { n: "RCC structure", p: 45 },
            { n: "Brickwork", p: 12 },
          ].map((p) => (
            <div key={p.n} className="flex items-center gap-3">
              <span className="w-28 truncate text-xs text-muted">{p.n}</span>
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-bg-sunken">
                <div className="h-full rounded-full bg-ink/80" style={{ width: `${p.p}%` }} />
              </div>
              <span className="w-8 text-right font-mono text-xs tabular-nums">{p.p}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
