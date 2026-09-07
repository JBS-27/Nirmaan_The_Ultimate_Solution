import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { NativeSelect } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { submitMarketRequest } from "@/lib/server/market";
import { listProjects } from "@/lib/server/projects";
import { useAsync } from "@/lib/use-async";

export function MarketActions({
  professionalId,
  name,
  signedIn,
}: {
  professionalId: number;
  name: string;
  signedIn: boolean;
}) {
  const [open, setOpen] = useState<"quote" | "hire" | null>(null);
  const [projectId, setProjectId] = useState<number | "">("");
  const [message, setMessage] = useState(`Need help on my home — reaching out to ${name}.`);
  const [busy, setBusy] = useState(false);
  const projects = useAsync(() => (signedIn ? listProjects() : Promise.resolve([])), [signedIn]);

  if (!signedIn) {
    return (
      <div className="mt-4 flex flex-wrap gap-2">
        <Button asChild size="sm">
          <Link to="/login" search={{ redirect: "/marketplace" }}>
            Request quote
          </Link>
        </Button>
        <Button asChild size="sm" variant="outline">
          <Link to="/login" search={{ redirect: "/marketplace" }}>
            Hire
          </Link>
        </Button>
      </div>
    );
  }

  async function send(kind: "quote" | "hire") {
    setBusy(true);
    try {
      await submitMarketRequest({
        data: {
          professionalId,
          kind,
          projectId: projectId ? Number(projectId) : undefined,
          message,
        },
      });
      toast.success(kind === "hire" ? `Hire request sent to ${name}` : `Quote requested from ${name}`);
      setOpen(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not send request");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mt-4 space-y-3">
      <div className="flex flex-wrap gap-2">
        <Button size="sm" onClick={() => setOpen("quote")}>
          Request quote
        </Button>
        <Button size="sm" variant="outline" onClick={() => setOpen("hire")}>
          Hire
        </Button>
      </div>
      {open ? (
        <div className="space-y-2 rounded-lg bg-bg p-3">
          <p className="text-sm font-medium">{open === "hire" ? `Hire ${name}` : `Quote from ${name}`}</p>
          <NativeSelect value={projectId} onChange={(e) => setProjectId(e.target.value ? Number(e.target.value) : "")}>
            <option value="">No project yet (save the request)</option>
            {(projects.data ?? []).map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </NativeSelect>
          <Textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={3} />
          <div className="flex flex-wrap gap-2">
            <Button size="sm" disabled={busy} onClick={() => void send(open)}>
              {busy ? "Sending…" : "Send"}
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setOpen(null)}>
              Cancel
            </Button>
            {(projects.data ?? []).length === 0 ? (
              <Button asChild size="sm" variant="outline">
                <Link to="/app/new" search={{}}>
                  Create a project
                </Link>
              </Button>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}
