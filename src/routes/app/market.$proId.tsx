import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { NativeSelect } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { money } from "@/lib/format";
import { getProfessional, hireProfessional, requestQuote } from "@/lib/server/market";
import { listProjects } from "@/lib/server/projects";
import { useAsync } from "@/lib/use-async";

export const Route = createFileRoute("/app/market/$proId")({ component: ProProfile });

function ProProfile() {
  const { proId } = Route.useParams();
  const id = Number(proId);
  const pro = useAsync(() => getProfessional({ data: id }), [id]);
  const projects = useAsync(() => listProjects(), []);
  const [projectId, setProjectId] = useState<number | "">("");
  const [message, setMessage] = useState("Need a quote for my residential project. Drawings available.");
  const [busy, setBusy] = useState(false);
  const p = pro.data;

  if (pro.loading && !p) return <Skeleton className="h-64 rounded-xl" />;
  if (!p) {
    return (
      <Card className="p-8">
        <p>Professional not found.</p>
        <Button asChild variant="outline" className="mt-4">
          <Link to="/app/market" search={{}}>
            Back
          </Link>
        </Button>
      </Card>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      <div>
        <p className="text-xs tracking-wide text-forest uppercase">{p.role}</p>
        <h1 className="mt-2 font-display text-4xl tracking-tight">{p.name}</h1>
        <p className="mt-2 text-muted">
          {p.city} · responds in {p.responseHours}h · {p.availability}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {p.verified ? <Badge tone="forest">Verified</Badge> : null}
          <Badge>
            {p.rating.toFixed(1)} · {p.reviews} reviews
          </Badge>
          <Badge>{p.languages}</Badge>
        </div>
        <p className="mt-6 max-w-xl text-ink-soft">{p.bio}</p>
        <p className="mt-4 text-sm">
          <span className="text-muted">Specialisations · </span>
          {p.specializations}
        </p>
        {p.licenses ? (
          <p className="mt-2 text-sm">
            <span className="text-muted">Licences · </span>
            {p.licenses}
          </p>
        ) : null}
        <p className="mt-6 font-display text-3xl tracking-tight tabular-nums">
          {money(p.rateMin)}–{money(p.rateMax)}
          <span className="text-base text-muted"> / {p.rateUnit}</span>
        </p>
      </div>

      <Card className="h-fit p-5">
        <h2 className="font-display text-xl tracking-tight">Request a quote</h2>
        <p className="mt-1 text-sm text-muted">Attach this professional to one of your sites.</p>
        <div className="mt-4 space-y-3">
          <NativeSelect value={projectId} onChange={(e) => setProjectId(e.target.value ? Number(e.target.value) : "")}>
            <option value="">Select project</option>
            {(projects.data ?? []).map((pr) => (
              <option key={pr.id} value={pr.id}>
                {pr.name}
              </option>
            ))}
          </NativeSelect>
          <Textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={4} />
          <Button
            className="w-full"
            disabled={!projectId || busy}
            onClick={async () => {
              if (!projectId) return;
              setBusy(true);
              try {
                const res = await requestQuote({
                  data: { projectId: Number(projectId), professionalId: p.id, message },
                });
                toast.success(`Quote from ${res.name}: ${money(res.amount)}`);
              } catch (err) {
                toast.error(err instanceof Error ? err.message : "Could not request quote");
              } finally {
                setBusy(false);
              }
            }}
          >
            Request quote
          </Button>
          <Button
            variant="outline"
            className="w-full"
            disabled={!projectId || busy}
            onClick={async () => {
              if (!projectId) return;
              setBusy(true);
              try {
                await hireProfessional({
                  data: { projectId: Number(projectId), professionalId: p.id },
                });
                toast.success(`Hired ${p.name}`);
              } finally {
                setBusy(false);
              }
            }}
          >
            Hire directly
          </Button>
        </div>
      </Card>
    </div>
  );
}
