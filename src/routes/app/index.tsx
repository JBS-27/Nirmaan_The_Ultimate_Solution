import { createFileRoute, Link } from "@tanstack/react-router";
import { Hammer, MapPin, Plus } from "lucide-react";
import { PageHeader } from "@/components/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { money, pct } from "@/lib/format";
import { listMyDesk, updateOrderStatus } from "@/lib/server/ops";
import { listProjects } from "@/lib/server/projects";
import { getMyProfile } from "@/lib/server/profile";
import { useAsync } from "@/lib/use-async";

export const Route = createFileRoute("/app/")({ component: AppHome });

function AppHome() {
  const profile = useAsync(() => getMyProfile(), []);
  const role = profile.data?.role ?? "owner";

  if (profile.loading && !profile.data) {
    return (
      <div className="grid gap-3 md:grid-cols-2">
        <Skeleton className="h-44 rounded-xl" />
        <Skeleton className="h-44 rounded-xl" />
      </div>
    );
  }

  if (role === "admin") return <AdminJump />;
  if (role === "supplier") return <SupplierHome />;
  if (role === "architect" || role === "engineer" || role === "contractor" || role === "worker") {
    return <TradeHome role={role} />;
  }
  return <OwnerHome />;
}

function AdminJump() {
  return (
    <div>
      <PageHeader
        kicker="Admin"
        title="Platform desk"
        description="Verification queue, live sites, and marketplace volume."
        action={
          <Button asChild>
            <Link to="/app/admin">Open admin</Link>
          </Button>
        }
      />
      <OwnerHome compact />
    </div>
  );
}

function OwnerHome({ compact }: { compact?: boolean }) {
  const projects = useAsync(() => listProjects(), []);
  const profile = useAsync(() => getMyProfile(), []);
  const list = projects.data ?? [];
  const active = list.filter((p) => p.status !== "handed_over");
  const spend = list.reduce((s, p) => s + p.spent, 0);
  const budget = list.reduce((s, p) => s + p.budget, 0);

  return (
    <div>
      {compact ? null : (
        <PageHeader
          kicker={profile.data ? profile.data.role : "Workspace"}
          title={
            profile.data?.displayName
              ? `Hello, ${profile.data.displayName.split(" ")[0]}`
              : "Your sites"
          }
          description="Every live house, renovation and extension you own — progress, envelope, and the next risk."
          action={
            <Button asChild>
              <Link to="/app/new" search={{}}>
                <Plus className="size-4" />
                New project
              </Link>
            </Button>
          }
        />
      )}

      <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4">
        <Kpi label="Active sites" value={String(active.length)} />
        <Kpi label="Envelope" value={budget ? money(budget) : "—"} />
        <Kpi label="Spent" value={spend ? money(spend) : "—"} />
        <Kpi label="City" value={profile.data?.city ?? "—"} />
      </div>

      {projects.loading ? (
        <div className="grid gap-3 md:grid-cols-2">
          <Skeleton className="h-44 rounded-xl" />
          <Skeleton className="h-44 rounded-xl" />
        </div>
      ) : list.length === 0 ? (
        <Card className="flex flex-col items-start gap-4 p-6 md:p-8">
          <span className="flex size-12 items-center justify-center rounded-lg bg-forest-soft text-forest">
            <Hammer className="size-5" />
          </span>
          <div>
            <h2 className="font-display text-2xl tracking-tight">No sites yet</h2>
            <p className="mt-1 max-w-md text-sm text-muted">
              Plant a project and Nirmaan will draft phases, a bill of quantities and a cash envelope from your plot,
              floors and city.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button asChild>
              <Link to="/app/new" search={{}}>
                Create a project
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/app/new" search={{ sample: "1" }}>
                Load a sample 3BHK
              </Link>
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {list.map((p) => (
            <Link key={p.id} to="/app/projects/$projectId" params={{ projectId: String(p.id) }} search={{}}>
              <Card className="h-full transition-[box-shadow] duration-150 hover:shadow-[var(--shadow-card-hover)]">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-display text-xl tracking-tight">{p.name}</p>
                    <p className="mt-1 flex items-center gap-1 text-sm text-muted">
                      <MapPin className="size-3.5" />
                      {p.city}
                      {p.address ? ` · ${p.address}` : ""}
                    </p>
                  </div>
                  <Badge tone={p.status === "active" ? "forest" : "neutral"}>{p.status}</Badge>
                </div>
                <Progress value={p.progress} className="mt-4" />
                <div className="mt-4 flex items-center justify-between text-sm">
                  <span className="text-muted">{pct(p.progress)} complete</span>
                  <span className="tabular-nums">
                    {money(p.spent)}
                    <span className="text-muted"> / {money(p.budget)}</span>
                  </span>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function TradeHome({ role }: { role: string }) {
  const desk = useAsync(() => listMyDesk(), []);
  const jobs = desk.data?.jobs ?? [];
  const quotes = desk.data?.quotes ?? [];

  return (
    <div>
      <PageHeader
        kicker={role}
        title="Your jobs"
        description="Sites that hired you, plus incoming quote requests."
        action={
          <Button asChild variant="outline">
            <Link to="/app/market" search={{}}>
              Marketplace
            </Link>
          </Button>
        }
      />
      <div className="mb-6 grid grid-cols-2 gap-3">
        <Kpi label="Active hires" value={String(jobs.length)} />
        <Kpi label="Open quotes" value={String(quotes.filter((q) => q.status !== "accepted").length)} />
      </div>
      {desk.loading ? (
        <Skeleton className="h-40 rounded-xl" />
      ) : jobs.length === 0 && quotes.length === 0 ? (
        <Card className="p-6">
          <h2 className="font-display text-2xl tracking-tight">Waiting on a hire</h2>
          <p className="mt-2 max-w-md text-sm text-muted">
            Your listing is live. When a homeowner requests a quote or hires you, the site book appears here.
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          {jobs.map((j) => (
            <Link key={j.id} to="/app/projects/$projectId" params={{ projectId: String(j.projectId) }} search={{}}>
              <Card className="flex items-center justify-between p-4">
                <div>
                  <p className="font-medium">{j.projectName}</p>
                  <p className="text-sm text-muted">
                    {j.city} · {j.role}
                  </p>
                </div>
                <Badge tone="ok">{j.status}</Badge>
              </Card>
            </Link>
          ))}
          {quotes.map((q) => (
            <Card key={q.id} className="p-4">
              <p className="font-medium">{q.projectName}</p>
              <p className="mt-1 text-sm text-muted">
                {q.status}
                {q.amount ? ` · ${money(q.amount)}` : ""}
                {q.message ? ` — ${q.message}` : ""}
              </p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function SupplierHome() {
  const desk = useAsync(() => listMyDesk(), []);
  const orders = desk.data?.orders ?? [];

  return (
    <div>
      <PageHeader
        kicker="Supplier"
        title="Incoming orders"
        description="Mark dispatch and delivery. Owners see the same status on the site BOQ."
      />
      {desk.loading ? (
        <Skeleton className="h-40 rounded-xl" />
      ) : orders.length === 0 ? (
        <Card className="p-6 text-sm text-muted">No orders yet. Keep stock and rates current on your listing.</Card>
      ) : (
        <div className="space-y-3">
          {orders.map((o) => (
            <Card key={o.id} className="flex flex-wrap items-center justify-between gap-3 p-4">
              <div>
                <p className="font-medium">{o.itemName}</p>
                <p className="text-sm text-muted">
                  {o.projectName} · {o.qty} @ {money(o.unitPrice)}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge>{o.status}</Badge>
                {o.status === "placed" ? (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={async () => {
                      await updateOrderStatus({ data: { orderId: o.id, status: "dispatched" } });
                      desk.reload();
                    }}
                  >
                    Dispatch
                  </Button>
                ) : null}
                {o.status === "dispatched" ? (
                  <Button
                    size="sm"
                    onClick={async () => {
                      await updateOrderStatus({ data: { orderId: o.id, status: "delivered" } });
                      desk.reload();
                    }}
                  >
                    Mark delivered
                  </Button>
                ) : null}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function Kpi({ label, value }: { label: string; value: string }) {
  return (
    <Card className="p-4">
      <p className="text-xs tracking-wide text-muted uppercase">{label}</p>
      <p className="mt-1 font-display text-2xl tracking-tight tabular-nums">{value}</p>
    </Card>
  );
}
