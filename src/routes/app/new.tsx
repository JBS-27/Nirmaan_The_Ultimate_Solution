import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, NativeSelect } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CITIES, PROJECT_TYPES, type ProjectType } from "@/lib/constants";
import { money } from "@/lib/format";
import { extractPlanQuantities } from "@/lib/server/ai";
import { createProject, previewEstimate } from "@/lib/server/projects";
import { addDays, todayISO } from "@/lib/utils";
import { estimateRooms, type ProjectEstimate, type RoomInput } from "@/lib/estimator";

export const Route = createFileRoute("/app/new")({
  validateSearch: (s: Record<string, unknown>): { sample?: "1" } =>
    s.sample === "1" || s.sample === true ? { sample: "1" } : {},
  component: NewProject,
});

function NewProject() {
  const { sample } = Route.useSearch();
  const navigate = useNavigate();
  const [name, setName] = useState(sample ? "Koramangala 3BHK" : "");
  const [city, setCity] = useState("Bengaluru");
  const [address, setAddress] = useState(sample ? "4th Block, Koramangala" : "");
  const [projectType, setProjectType] = useState<ProjectType>("new_build");
  const [plotSqft, setPlotSqft] = useState(sample ? 2400 : 1200);
  const [floors, setFloors] = useState(sample ? 2 : 2);
  const [budget, setBudget] = useState(sample ? 4200000 : 2500000);
  const [startDate, setStartDate] = useState(todayISO());
  const [targetDate, setTargetDate] = useState(addDays(todayISO(), 270));
  const [requirements, setRequirements] = useState(
    sample ? "3 BHK independent house, vastu-aware, covered parking, terrace waterproofing." : "",
  );
  const [est, setEst] = useState<ProjectEstimate | null>(null);
  const [busy, setBusy] = useState(false);
  const [rooms, setRooms] = useState<RoomInput[]>([{ name: "Living", lengthFt: 14, widthFt: 12, heightFt: 10 }]);
  const [planBusy, setPlanBusy] = useState(false);
  const roomExtras = useMemo(() => estimateRooms(rooms, city), [rooms, city]);

  const payload = useMemo(
    () => ({ type: projectType, plotSqft, floors, city, startDate, targetDate, budget }),
    [projectType, plotSqft, floors, city, startDate, targetDate, budget],
  );

  useEffect(() => {
    let cancelled = false;
    previewEstimate({ data: payload })
      .then((e) => {
        if (!cancelled) setEst(e);
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [payload]);

  async function submit(asSample = Boolean(sample)) {
    setBusy(true);
    try {
      const res = await createProject({
        data: {
          name: name || "Untitled home",
          city,
          address: address || undefined,
          projectType,
          plotSqft,
          floors,
          budget,
          startDate,
          targetDate,
          requirements: requirements || undefined,
          sample: asSample,
          rooms: rooms.filter((r) => r.lengthFt > 0 && r.widthFt > 0),
        },
      });
      toast.success("Project planted — BOQ and phases are ready.");
      navigate({ to: "/app/projects/$projectId", params: { projectId: String(res.id) }, search: {} });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not create project");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <PageHeader
        kicker="New site"
        title="Plant a project"
        description="Tell Nirmaan the plot and the envelope. It will draft eight phases and a local bill of quantities."
      />

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            void submit(false);
          }}
        >
          <Field label="Project name">
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Whitefield duplex" required />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="City">
              <NativeSelect value={city} onChange={(e) => setCity(e.target.value)}>
                {CITIES.map((c) => (
                  <option key={c.name} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </NativeSelect>
            </Field>
            <Field label="Type">
              <NativeSelect
                value={projectType}
                onChange={(e) => setProjectType(e.target.value as ProjectType)}
              >
                {PROJECT_TYPES.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.label}
                  </option>
                ))}
              </NativeSelect>
            </Field>
          </div>
          <Field label="Site address">
            <Input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Street, area" />
          </Field>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <Field label="Plot (sqft)">
              <Input
                type="number"
                min={200}
                value={plotSqft}
                onChange={(e) => setPlotSqft(Number(e.target.value))}
              />
            </Field>
            <Field label="Floors">
              <Input type="number" min={1} max={8} value={floors} onChange={(e) => setFloors(Number(e.target.value))} />
            </Field>
            <Field label="Budget (₹)">
              <Input type="number" min={100000} step={50000} value={budget} onChange={(e) => setBudget(Number(e.target.value))} />
            </Field>
            <Field label="Start">
              <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            </Field>
          </div>
          <Field label="Target handover">
            <Input type="date" value={targetDate} onChange={(e) => setTargetDate(e.target.value)} />
          </Field>
          <Field label="What are you building?" hint="Rooms, parking, vastu, rental floors — anything the estimator should respect.">
            <Textarea value={requirements} onChange={(e) => setRequirements(e.target.value)} rows={4} />
          </Field>
          <div className="rounded-xl border border-line bg-bg-elevated p-4">
            <p className="text-sm font-medium">Room dimensions</p>
            <p className="mt-1 text-xs text-muted">Adds tile and paint lines to the BOQ. Upload a plan to extract rooms.</p>
            <Field label="Plan photo" className="mt-3">
              <Input
                type="file"
                accept="image/*"
                disabled={planBusy}
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  setPlanBusy(true);
                  try {
                    const dataUrl = await fileToDataUrl(file);
                    const parsed = await extractPlanQuantities({ data: { imageDataUrl: dataUrl, city } });
                    if (parsed.ok && parsed.rooms.length) {
                      setRooms(parsed.rooms);
                      toast.success("Rooms read from the plan");
                    } else {
                      toast.error(parsed.ok ? "No rooms found" : parsed.error);
                    }
                  } finally {
                    setPlanBusy(false);
                  }
                }}
              />
            </Field>
            <div className="mt-3 space-y-2">
              {rooms.map((r, i) => (
                <div key={`${r.name}-${i}`} className="grid grid-cols-2 gap-2 md:grid-cols-4">
                  <Input
                    value={r.name}
                    onChange={(e) =>
                      setRooms((prev) => prev.map((x, idx) => (idx === i ? { ...x, name: e.target.value } : x)))
                    }
                  />
                  <Input
                    type="number"
                    value={r.lengthFt}
                    onChange={(e) =>
                      setRooms((prev) => prev.map((x, idx) => (idx === i ? { ...x, lengthFt: Number(e.target.value) } : x)))
                    }
                  />
                  <Input
                    type="number"
                    value={r.widthFt}
                    onChange={(e) =>
                      setRooms((prev) => prev.map((x, idx) => (idx === i ? { ...x, widthFt: Number(e.target.value) } : x)))
                    }
                  />
                  <Input
                    type="number"
                    value={r.heightFt ?? 10}
                    onChange={(e) =>
                      setRooms((prev) => prev.map((x, idx) => (idx === i ? { ...x, heightFt: Number(e.target.value) } : x)))
                    }
                  />
                </div>
              ))}
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-3"
              onClick={() => setRooms((prev) => [...prev, { name: "Room", lengthFt: 10, widthFt: 10, heightFt: 10 }])}
            >
              Add room
            </Button>
            <p className="mt-2 text-xs text-muted">
              {roomExtras.floorSqft} sqft floor · extra tiles {roomExtras.extras[0]?.qtyNeeded} sqft
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button type="submit" disabled={busy}>
              {busy ? "Planting…" : "Create project"}
            </Button>
            <Button type="button" variant="outline" disabled={busy} onClick={() => void submit(true)}>
              Create with sample site log
            </Button>
          </div>
        </form>

        <Card className="h-fit p-5">
          <p className="text-xs tracking-wide text-muted uppercase">Live estimate</p>
          {est ? (
            <>
              <p className="mt-2 font-display text-3xl tracking-tight tabular-nums">{money(est.estimatedCost)}</p>
              <p className="mt-1 text-sm text-muted">
                {est.builtUpSqft.toLocaleString("en-IN")} sqft built-up · {money(est.costPerSqft)} / sqft in {est.city}
              </p>
              <ul className="mt-5 space-y-2">
                {est.phases.slice(0, 6).map((p) => (
                  <li key={p.key} className="flex items-center justify-between text-sm">
                    <span className="text-ink-soft">{p.name}</span>
                    <span className="tabular-nums">{money(p.estimatedCost)}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-5 text-xs text-muted">{est.notes[0]}</p>
            </>
          ) : (
            <p className="mt-3 text-sm text-muted">Adjust the plot to see quantities.</p>
          )}
        </Card>
      </div>
    </div>
  );
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Could not read file"));
    reader.readAsDataURL(file);
  });
}
