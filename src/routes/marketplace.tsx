import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PublicFooter, PublicHeader } from "@/components/public-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/field";
import { Tab, TabBar } from "@/components/ui/tabs";
import { MarketActions } from "@/components/market-actions";
import { CATALOG_PROS, CATALOG_SUPPLIERS } from "@/lib/catalog";
import { CITIES } from "@/lib/constants";
import { money } from "@/lib/format";
import { portraitFor } from "@/lib/site-media";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { listPublicProfessionals } from "@/lib/server/market";
import { useAsync } from "@/lib/use-async";

export const Route = createFileRoute("/marketplace")({
  validateSearch: (s: Record<string, unknown>): { tab?: "pros" | "suppliers"; city?: string } => ({
    tab: s.tab === "suppliers" ? "suppliers" : "pros",
    city: typeof s.city === "string" ? s.city : undefined,
  }),
  component: PublicMarket,
});

const ROLE_LABEL: Record<string, string> = {
  architect: "Architect",
  engineer: "Civil engineer",
  contractor: "Contractor",
  worker: "Skilled worker",
};

function PublicMarket() {
  const { tab, city: cityParam } = Route.useSearch();
  const { user } = useCurrentUserState();
  const [city, setCity] = useState(cityParam ?? "Bengaluru");
  const [role, setRole] = useState("");
  const [q, setQ] = useState("");
  const signedIn = Boolean(user);
  const livePros = useAsync(() => listPublicProfessionals(), []);

  const catalogFallback = useMemo(() => {
    return CATALOG_PROS.filter((p) => {
      if (city && p.city !== city) return false;
      if (role && p.role !== role) return false;
      if (q) {
        const hay = `${p.name} ${p.specializations} ${p.bio} ${p.city}`.toLowerCase();
        if (!hay.includes(q.toLowerCase())) return false;
      }
      return true;
    });
  }, [city, role, q]);

  const pros = useMemo(() => {
    const source = livePros.data ?? [];
    if (source.length === 0) return catalogFallback.map((p, i) => ({ ...p, id: -(i + 1) }));
    return source.filter((p) => {
      if (city && p.city !== city) return false;
      if (role && p.role !== role) return false;
      if (q) {
        const hay = `${p.name} ${p.specializations} ${p.bio} ${p.city}`.toLowerCase();
        if (!hay.includes(q.toLowerCase())) return false;
      }
      return true;
    });
  }, [livePros.data, catalogFallback, city, role, q]);

  const shops = useMemo(() => {
    return CATALOG_SUPPLIERS.filter((s) => {
      if (city && s.city !== city) return false;
      if (q) {
        const hay = `${s.name} ${s.categories} ${s.city}`.toLowerCase();
        if (!hay.includes(q.toLowerCase())) return false;
      }
      return true;
    });
  }, [city, q]);

  return (
    <div className="min-h-dvh bg-bg text-ink">
      <PublicHeader active="market" />
      <main className="mx-auto max-w-6xl px-4 py-10 md:px-8 md:py-14">
        <p className="text-xs font-medium tracking-[0.18em] text-forest uppercase">Marketplace</p>
        <h1 className="mt-3 max-w-2xl font-display text-4xl font-medium tracking-tight md:text-5xl">
          Verified locals, not a directory dump.
        </h1>
        <p className="mt-3 max-w-xl text-muted">
          Bengaluru-first architects, engineers, contractors, mistry and registered shops. Browse freely —
          request a quote or hire after you sign in.
        </p>

        <TabBar className="mt-8 w-fit">
          <Link to="/marketplace" search={{ tab: "pros", city }}>
            <Tab active={tab !== "suppliers"}>Professionals</Tab>
          </Link>
          <Link to="/marketplace" search={{ tab: "suppliers", city }}>
            <Tab active={tab === "suppliers"}>Material shops</Tab>
          </Link>
        </TabBar>

        <div className="mt-5 grid gap-2 sm:grid-cols-3">
          <Input placeholder="Search name, skill, shop…" value={q} onChange={(e) => setQ(e.target.value)} />
          <NativeSelect value={city} onChange={(e) => setCity(e.target.value)}>
            <option value="">All cities</option>
            {CITIES.map((c) => (
              <option key={c.name} value={c.name}>
                {c.name}
              </option>
            ))}
          </NativeSelect>
          {tab !== "suppliers" ? (
            <NativeSelect value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="">All roles</option>
              <option value="architect">Architect</option>
              <option value="engineer">Civil engineer</option>
              <option value="contractor">Contractor</option>
              <option value="worker">Skilled worker</option>
            </NativeSelect>
          ) : (
            <div />
          )}
        </div>

        {tab === "suppliers" ? (
          <div className="mt-8 space-y-4">
            {shops.length === 0 ? (
              <Card className="p-6 text-sm text-muted">No shops match that filter.</Card>
            ) : (
              shops.map((s) => (
                <Card key={s.name} className="p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h2 className="font-display text-xl tracking-tight">{s.name}</h2>
                      <p className="text-sm text-muted">
                        {s.city} · {s.categories} · {s.deliveryDays}d delivery
                      </p>
                    </div>
                    <Badge tone="forest">
                      {s.rating.toFixed(1)} · {s.reviews}
                    </Badge>
                  </div>
                  <ul className="mt-4 divide-y divide-line">
                    {s.products.map((pr) => (
                      <li key={pr.name} className="flex items-center justify-between gap-3 py-2 text-sm">
                        <div>
                          <p className="font-medium">{pr.name}</p>
                          <p className="text-xs text-muted">
                            {pr.category} · {pr.stock}
                          </p>
                        </div>
                        <span className="tabular-nums">
                          {money(pr.price)}
                          <span className="text-muted"> / {pr.unit}</span>
                        </span>
                      </li>
                    ))}
                  </ul>
                  <Button asChild className="mt-4" variant="outline">
                    {signedIn ? (
                      <Link to="/app/market" search={{ tab: "suppliers" }}>
                        Order from a site book
                      </Link>
                    ) : (
                      <Link to="/login" search={{ redirect: "/app/market" }}>
                        Order from a site book
                      </Link>
                    )}
                  </Button>
                </Card>
              ))
            )}
          </div>
        ) : (
          <div className="mt-8 grid gap-3 md:grid-cols-2">
            {pros.length === 0 ? (
              <Card className="p-6 text-sm text-muted">No professionals match that filter.</Card>
            ) : (
              pros.map((p) => (
                <Card key={p.id || `${p.role}-${p.name}`} className="flex h-full flex-col p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <img
                        src={portraitFor(p.name)}
                        alt=""
                        className="size-12 rounded-full object-cover outline outline-1 -outline-offset-1 outline-line"
                      />
                      <div>
                        <p className="text-xs tracking-wide text-forest uppercase">{ROLE_LABEL[p.role] ?? p.role}</p>
                        <h2 className="mt-1 font-display text-xl tracking-tight">{p.name}</h2>
                        <p className="text-sm text-muted">{p.city}</p>
                      </div>
                    </div>
                    <Badge tone="forest">Verified</Badge>
                  </div>
                  <p className="mt-3 line-clamp-3 flex-1 text-sm text-ink-soft">{p.bio}</p>
                  <div className="mt-4 flex items-center justify-between text-sm">
                    <span className="tabular-nums">
                      {money(p.rateMin)}–{money(p.rateMax)}
                      <span className="text-muted"> / {p.rateUnit}</span>
                    </span>
                    <span className="text-muted tabular-nums">
                      {p.rating.toFixed(1)} · {p.reviews} reviews
                    </span>
                  </div>
                  <MarketActions
                    professionalId={p.id}
                    name={p.name}
                    signedIn={signedIn && p.id > 0}
                  />
                </Card>
              ))
            )}
          </div>
        )}
      </main>
      <PublicFooter />
    </div>
  );
}
