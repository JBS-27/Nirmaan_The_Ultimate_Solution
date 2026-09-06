import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { money } from "@/lib/format";
import { getAdminOverview, verifyProfessional } from "@/lib/server/ops";
import { useAsync } from "@/lib/use-async";

export const Route = createFileRoute("/app/admin")({ component: AdminPage });

function AdminPage() {
  const q = useAsync(() => getAdminOverview(), []);
  const d = q.data;

  if (q.error) {
    return (
      <Card className="p-8">
        <p className="font-display text-2xl">Admin only</p>
        <p className="mt-2 text-sm text-muted">Switch your role to Platform admin in Account to open this desk.</p>
        <Button asChild className="mt-4" variant="outline">
          <Link to="/app/account">Account</Link>
        </Button>
      </Card>
    );
  }

  if (!d) return <Skeleton className="h-64 rounded-xl" />;

  return (
    <div>
      <PageHeader
        kicker="Admin"
        title="Nirmaan control"
        description="Users, verification queue, and marketplace volume across the preview city set."
      />
      <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-3">
        <Stat label="Profiles" value={String(d.users)} />
        <Stat label="Projects" value={String(d.projects)} />
        <Stat label="Professionals" value={String(d.professionals)} />
        <Stat label="Unverified" value={String(d.unverified)} />
        <Stat label="Orders" value={String(d.orders)} />
        <Stat label="Recorded payouts" value={money(d.payments)} />
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="p-4">
          <p className="mb-3 text-xs tracking-wide text-muted uppercase">Verification queue</p>
          {d.queue.length === 0 ? (
            <p className="text-sm text-muted">All listings are verified.</p>
          ) : (
            <ul className="space-y-3">
              {d.queue.map((p) => (
                <li key={p.id} className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium">{p.name}</p>
                    <p className="text-xs text-muted">
                      {p.role} · {p.city}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    onClick={async () => {
                      await verifyProfessional({ data: p.id });
                      q.reload();
                    }}
                  >
                    Verify
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </Card>
        <Card className="p-4">
          <p className="mb-3 text-xs tracking-wide text-muted uppercase">Recent sites</p>
          <ul className="space-y-3">
            {d.recent.map((p) => (
              <li key={p.id} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">{p.name}</p>
                  <p className="text-xs text-muted">{p.city}</p>
                </div>
                <Badge>{money(p.budget)}</Badge>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <Card className="p-4">
      <p className="text-xs tracking-wide text-muted uppercase">{label}</p>
      <p className="mt-1 font-display text-2xl tracking-tight tabular-nums">{value}</p>
    </Card>
  );
}
