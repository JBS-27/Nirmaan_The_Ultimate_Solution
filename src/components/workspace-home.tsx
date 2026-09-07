import { Link } from "@tanstack/react-router";
import { Hammer, MapPin, Plus } from "lucide-react";
import { PageHeader } from "@/components/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { money, pct } from "@/lib/format";
import { listProjects } from "@/lib/server/projects";
import { getMyProfile } from "@/lib/server/profile";
import { useAsync } from "@/lib/use-async";

export function Kpi({ label, value }: { label: string; value: string }) {
  return (
    <Card className="p-4">
      <p className="text-xs tracking-wide text-muted uppercase">{label}</p>
      <p className="mt-1 font-display text-2xl tracking-tight tabular-nums">{value}</p>
    </Card>
  );
}

export function OwnerHome({
  compact,
  title,
}: {
  compact?: boolean;
  title?: string;
}) {
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
            title ??
            (profile.data?.displayName
              ? `Hello, ${profile.data.displayName.split(" ")[0]}`
              : "Your sites")
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

      {projects.error ? (
        <Card className="p-6 text-sm text-danger">{projects.error}</Card>
      ) : projects.loading ? (
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
