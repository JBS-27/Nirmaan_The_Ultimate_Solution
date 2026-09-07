import { Link, useNavigate } from "@tanstack/react-router";
import { Hammer, MapPin, MessageSquare, Plus, Sparkles } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/app-shell";
import { RingStat } from "@/components/ring-stat";
import { SitePhoto } from "@/components/site-photo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { money, pct } from "@/lib/format";
import { loadDemoProject, listProjects } from "@/lib/server/projects";
import { getMyProfile } from "@/lib/server/profile";
import { coverFor, DEMO_SITE_NAME, SITE_PHOTOS } from "@/lib/site-media";
import { useAsync } from "@/lib/use-async";

export function Kpi({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <Card className="p-4 transition-shadow duration-200 hover:shadow-[var(--shadow-card-hover)]">
      <p className="text-xs tracking-wide text-muted uppercase">{label}</p>
      <p className="mt-1 font-display text-2xl tracking-tight tabular-nums">{value}</p>
      {hint ? <p className="mt-1 text-xs text-muted">{hint}</p> : null}
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
  const navigate = useNavigate();
  const projects = useAsync(() => listProjects(), []);
  const profile = useAsync(() => getMyProfile(), []);
  const [demoBusy, setDemoBusy] = useState(false);
  const list = projects.data ?? [];
  const active = list.filter((p) => p.status !== "handed_over");
  const spend = list.reduce((s, p) => s + p.spent, 0);
  const budget = list.reduce((s, p) => s + p.budget, 0);
  const featured = list[0];
  const firstName = profile.data?.displayName?.split(" ")[0];

  async function loadDemo() {
    setDemoBusy(true);
    try {
      const res = await loadDemoProject();
      toast.success(res.created ? `${DEMO_SITE_NAME} is ready` : `Opening ${DEMO_SITE_NAME}`);
      projects.reload();
      await navigate({
        to: "/app/projects/$projectId",
        params: { projectId: String(res.id) },
        search: {},
      });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not load the demo site");
    } finally {
      setDemoBusy(false);
    }
  }

  return (
    <div>
      {compact ? null : (
        <PageHeader
          kicker={profile.data ? profile.data.role : "Workspace"}
          title={title ?? (firstName ? `Hello, ${firstName}` : "Your sites")}
          description="Every live house, renovation and extension you own — progress, envelope, and the next risk."
          action={
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" disabled={demoBusy} onClick={() => void loadDemo()}>
                <Sparkles className="size-4" />
                {demoBusy ? "Loading demo…" : "Load demo site"}
              </Button>
              <Button asChild>
                <Link to="/app/new" search={{}}>
                  <Plus className="size-4" />
                  New project
                </Link>
              </Button>
            </div>
          }
        />
      )}

      {featured ? (
        <Link
          to="/app/projects/$projectId"
          params={{ projectId: String(featured.id) }}
          search={{}}
          className="group mb-6 block overflow-hidden rounded-2xl shadow-[var(--shadow-card)] transition-shadow duration-200 hover:shadow-[var(--shadow-card-hover)]"
        >
          <SitePhoto src={coverFor(featured.name)} alt={featured.name} className="h-52 md:h-72">
            <p className="text-xs tracking-[0.18em] text-cream/70 uppercase">Live site</p>
            <h2 className="mt-1 font-display text-3xl tracking-tight md:text-4xl">{featured.name}</h2>
            <p className="mt-2 flex items-center gap-1 text-sm text-cream/80">
              <MapPin className="size-3.5" />
              {featured.city}
              {featured.address ? ` · ${featured.address}` : ""}
            </p>
            <div className="mt-4 max-w-md">
              <Progress value={featured.progress} className="bg-cream/20" />
              <div className="mt-2 flex justify-between text-sm text-cream/90">
                <span>{pct(featured.progress)} complete</span>
                <span className="tabular-nums">
                  {money(featured.spent)} / {money(featured.budget)}
                </span>
              </div>
            </div>
          </SitePhoto>
        </Link>
      ) : null}

      <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4">
        <Kpi label="Active sites" value={String(active.length)} />
        <Kpi label="Envelope" value={budget ? money(budget) : "—"} hint={spend ? `${money(spend)} spent` : undefined} />
        <Kpi label="Spent" value={spend ? money(spend) : "—"} />
        <Kpi label="City" value={profile.data?.city ?? "—"} />
      </div>

      {featured && budget > 0 ? (
        <Card className="mb-6 flex flex-col gap-5 p-5 md:flex-row md:items-center md:justify-between">
          <RingStat
            value={budget ? (spend / budget) * 100 : 0}
            label="Cash drawn"
            hint={`${money(Math.max(0, budget - spend))} still in the envelope`}
          />
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="outline">
              <Link to="/app/assistant" search={{ projectId: String(featured.id) }}>
                <MessageSquare className="size-4" />
                Ask the twin
              </Link>
            </Button>
            <Button asChild>
              <Link to="/app/projects/$projectId" params={{ projectId: String(featured.id) }} search={{}}>
                Open site book
              </Link>
            </Button>
          </div>
        </Card>
      ) : null}

      {projects.error ? (
        <Card className="p-6 text-sm text-danger">{projects.error}</Card>
      ) : projects.loading ? (
        <div className="grid gap-3 md:grid-cols-2">
          <Skeleton className="h-56 rounded-xl" />
          <Skeleton className="h-56 rounded-xl" />
        </div>
      ) : list.length === 0 ? (
        <div className="overflow-hidden rounded-2xl bg-bg-elevated shadow-[var(--shadow-card)]">
          <SitePhoto src={SITE_PHOTOS.hero} alt="Residential house under construction" className="h-56 md:h-72">
            <p className="text-xs tracking-[0.18em] text-cream/70 uppercase">Client demo</p>
            <h2 className="mt-1 font-display text-3xl tracking-tight">See a living site book</h2>
          </SitePhoto>
          <div className="flex flex-col items-start gap-4 p-6 md:p-8">
            <span className="flex size-12 items-center justify-center rounded-lg bg-forest-soft text-forest">
              <Hammer className="size-5" />
            </span>
            <div>
              <h2 className="font-display text-2xl tracking-tight">No sites yet</h2>
              <p className="mt-1 max-w-lg text-sm text-muted">
                Load the Koramangala 3BHK demo — phases, cement and steel, six crew, bills and site photos — or plant
                your own plot.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button disabled={demoBusy} onClick={() => void loadDemo()}>
                <Sparkles className="size-4" />
                {demoBusy ? "Planting demo…" : `Load ${DEMO_SITE_NAME}`}
              </Button>
              <Button asChild variant="outline">
                <Link to="/app/new" search={{}}>
                  Create a blank project
                </Link>
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {list.map((p) => (
            <Link
              key={p.id}
              to="/app/projects/$projectId"
              params={{ projectId: String(p.id) }}
              search={{}}
              className="group"
            >
              <Card className="h-full overflow-hidden p-0 transition-shadow duration-200 hover:shadow-[var(--shadow-card-hover)]">
                <SitePhoto src={coverFor(p.name)} alt={p.name} className="h-40">
                  <Badge tone={p.status === "active" ? "forest" : "neutral"}>{p.status}</Badge>
                </SitePhoto>
                <div className="p-5">
                  <p className="font-display text-xl tracking-tight">{p.name}</p>
                  <p className="mt-1 flex items-center gap-1 text-sm text-muted">
                    <MapPin className="size-3.5" />
                    {p.city}
                    {p.address ? ` · ${p.address}` : ""}
                  </p>
                  <Progress value={p.progress} className="mt-4" />
                  <div className="mt-3 flex items-center justify-between text-sm">
                    <span className="text-muted">{pct(p.progress)} complete</span>
                    <span className="tabular-nums">
                      {money(p.spent)}
                      <span className="text-muted"> / {money(p.budget)}</span>
                    </span>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
