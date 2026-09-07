import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/app-shell";
import { Kpi, OwnerHome } from "@/components/workspace-home";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { money } from "@/lib/format";
import { listMyDesk, updateOrderStatus } from "@/lib/server/ops";
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

