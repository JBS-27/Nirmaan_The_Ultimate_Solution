import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/field";
import { Skeleton } from "@/components/ui/skeleton";
import { Tab, TabBar } from "@/components/ui/tabs";
import { CITIES } from "@/lib/constants";
import { money } from "@/lib/format";
import { listProfessionals, listSuppliers, matchProfessionals, placeOrder } from "@/lib/server/market";
import { listProjects } from "@/lib/server/projects";
import { useAsync } from "@/lib/use-async";

export const Route = createFileRoute("/app/market")({
  validateSearch: (s: Record<string, unknown>): { tab?: "pros" | "suppliers" } =>
    s.tab === "suppliers" ? { tab: "suppliers" } : s.tab === "pros" ? { tab: "pros" } : {},
  component: Market,
});

function Market() {
  const { tab: tabParam } = Route.useSearch();
  const tab = tabParam ?? "pros";
  const [city, setCity] = useState("");
  const [role, setRole] = useState("");
  const [q, setQ] = useState("");
  const filter = useMemo(() => ({ city: city || undefined, role: role || undefined, q: q || undefined }), [city, role, q]);
  const pros = useAsync(() => listProfessionals({ data: filter }), [filter.city, filter.role, filter.q]);
  const suppliers = useAsync(() => listSuppliers({ data: { city: city || undefined, q: q || undefined } }), [city, q]);
  const projects = useAsync(() => listProjects(), []);
  const [matchProject, setMatchProject] = useState<number | "">("");
  const [matches, setMatches] = useState<Awaited<ReturnType<typeof matchProfessionals>> | null>(null);
  const [matching, setMatching] = useState(false);

  return (
    <div>
      <PageHeader
        kicker="Marketplace"
        title={tab === "suppliers" ? "Material shops" : "Verified locals"}
        description="Architects, engineers, contractors, crews and registered suppliers — filtered by city and trade."
      />
      <TabBar className="mb-4 w-fit">
        <Link to="/app/market" search={{ tab: "pros" }}>
          <Tab active={tab === "pros"}>Professionals</Tab>
        </Link>
        <Link to="/app/market" search={{ tab: "suppliers" }}>
          <Tab active={tab === "suppliers"}>Suppliers</Tab>
        </Link>
      </TabBar>
      {tab === "pros" ? (
        <Card className="mb-5 p-4">
          <p className="text-sm font-medium">AI match — top 5 for a site</p>
          <p className="mt-1 text-xs text-muted">City, floors, budget and specialisation, not a generic directory sort.</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <NativeSelect
              className="max-w-xs"
              value={matchProject}
              onChange={(e) => setMatchProject(e.target.value ? Number(e.target.value) : "")}
            >
              <option value="">Choose project</option>
              {(projects.data ?? []).map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </NativeSelect>
            <Button
              size="sm"
              disabled={!matchProject || matching}
              onClick={async () => {
                if (!matchProject) return;
                setMatching(true);
                try {
                  const rows = await matchProfessionals({
                    data: { projectId: Number(matchProject), role: role || undefined },
                  });
                  setMatches(rows);
                } finally {
                  setMatching(false);
                }
              }}
            >
              {matching ? "Matching…" : "Recommend"}
            </Button>
          </div>
          {matches ? (
            <ul className="mt-4 space-y-2">
              {matches.map((m) => (
                <li key={m.id}>
                  <Link to="/app/market/$proId" params={{ proId: String(m.id) }} className="flex justify-between gap-3 text-sm">
                    <span>
                      <span className="font-medium">{m.name}</span>
                      <span className="text-muted"> · {m.reason}</span>
                    </span>
                    <span className="tabular-nums text-muted">{m.matchScore}</span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : null}
        </Card>
      ) : null}

      <div className="mb-5 grid gap-2 sm:grid-cols-3">
        <Input placeholder="Search name, skill, shop…" value={q} onChange={(e) => setQ(e.target.value)} />
        <NativeSelect value={city} onChange={(e) => setCity(e.target.value)}>
          <option value="">All cities</option>
          {CITIES.map((c) => (
            <option key={c.name} value={c.name}>
              {c.name}
            </option>
          ))}
        </NativeSelect>
        {tab === "pros" ? (
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

      {tab === "pros" ? (
        pros.loading ? (
          <div className="grid gap-3 md:grid-cols-2">
            <Skeleton className="h-40 rounded-xl" />
            <Skeleton className="h-40 rounded-xl" />
          </div>
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {(pros.data ?? []).map((p) => (
              <Link key={p.id} to="/app/market/$proId" params={{ proId: String(p.id) }}>
                <Card className="h-full p-5 transition-[box-shadow] hover:shadow-[var(--shadow-card-hover)]">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs tracking-wide text-forest uppercase">{p.role}</p>
                      <h2 className="mt-1 font-display text-xl tracking-tight">{p.name}</h2>
                      <p className="text-sm text-muted">{p.city}</p>
                    </div>
                    {p.verified ? <Badge tone="forest">Verified</Badge> : null}
                  </div>
                  <p className="mt-3 line-clamp-2 text-sm text-ink-soft">{p.bio}</p>
                  <div className="mt-4 flex items-center justify-between text-sm">
                    <span className="tabular-nums">
                      {money(p.rateMin)}–{money(p.rateMax)}
                      <span className="text-muted"> / {p.rateUnit}</span>
                    </span>
                    <span className="text-muted tabular-nums">
                      {p.rating.toFixed(1)} · {p.reviews} reviews
                    </span>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )
      ) : suppliers.loading ? (
        <Skeleton className="h-40 rounded-xl" />
      ) : suppliers.data ? (
        <SupplierList rows={suppliers.data} />
      ) : null}
    </div>
  );
}

function SupplierList({
  rows,
}: {
  rows: Awaited<ReturnType<typeof listSuppliers>>;
}) {
  const projects = useAsync(() => listProjects(), []);
  const [projectId, setProjectId] = useState<number | "">("");

  return (
    <div className="space-y-4">
      <div className="max-w-xs">
        <NativeSelect
          value={projectId}
          onChange={(e) => setProjectId(e.target.value ? Number(e.target.value) : "")}
        >
          <option value="">Ship to project…</option>
          {(projects.data ?? []).map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </NativeSelect>
      </div>
      {rows.map((s) => (
        <Card key={s.id} className="p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="font-display text-xl tracking-tight">{s.name}</h2>
              <p className="text-sm text-muted">
                {s.city} · {s.categories} · {s.deliveryDays}d delivery
              </p>
            </div>
            <Badge tone="forest">{s.rating.toFixed(1)} · {s.reviews}</Badge>
          </div>
          <ul className="mt-4 divide-y divide-line">
            {s.products.map((pr) => (
              <li key={pr.id} className="flex items-center justify-between gap-3 py-2 text-sm">
                <div>
                  <p className="font-medium">{pr.name}</p>
                  <p className="text-xs text-muted">
                    {pr.category} · {pr.stock}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="tabular-nums">
                    {money(pr.price)}
                    <span className="text-muted"> / {pr.unit}</span>
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={!projectId}
                    onClick={async () => {
                      if (!projectId) return;
                      await placeOrder({
                        data: {
                          projectId: Number(projectId),
                          supplierId: s.id,
                          productId: pr.id,
                          itemName: pr.name,
                          qty: 1,
                          unitPrice: pr.price,
                        },
                      });
                      toast.success(`Ordered ${pr.name}`);
                    }}
                  >
                    Order
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      ))}
    </div>
  );
}
