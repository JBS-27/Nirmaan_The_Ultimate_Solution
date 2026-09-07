import { createFileRoute, Link } from "@tanstack/react-router";
import {
  AlertTriangle,
  Camera,
  Check,
  IndianRupee,
  MapPin,
  MessageSquare,
  Plus,
  Users,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { RingStat } from "@/components/ring-stat";
import { SitePhoto } from "@/components/site-photo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDesc, DialogTitle } from "@/components/ui/dialog";
import { Field, NativeSelect } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Tab, TabBar } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { BILL_CATEGORIES, MATERIAL_CATEGORIES, SKILLS } from "@/lib/constants";
import { compactMoney, formatDate, formatShort, money, pct, qty } from "@/lib/format";
import { annotatePhoto, optimizeSchedule, parseBillOcr } from "@/lib/server/ai";
import { hireProfessional } from "@/lib/server/market";
import { addChangeOrder, addDailyLog, decideChangeOrder, exportProjectReport } from "@/lib/server/ops";
import { updatePhase } from "@/lib/server/projects";
import { getProject } from "@/lib/server/projects";
import {
  addBill,
  addMessage,
  addPayment,
  addPhoto,
  addWorker,
  markAttendance,
  payWorker,
  toggleBillPaid,
  upsertMaterial,
} from "@/lib/server/site";
import type { ProjectSnapshot } from "@/lib/types";
import { coverFor } from "@/lib/site-media";
import { useAsync } from "@/lib/use-async";
import { cn, daysBetween, todayISO } from "@/lib/utils";

const TABS = [
  { id: "overview", label: "Overview" },
  { id: "materials", label: "Materials" },
  { id: "crew", label: "Crew" },
  { id: "bills", label: "Bills" },
  { id: "schedule", label: "Schedule" },
  { id: "photos", label: "Photos" },
  { id: "money", label: "Money" },
  { id: "team", label: "Team" },
  { id: "changes", label: "Changes" },
  { id: "log", label: "Daily log" },
  { id: "chat", label: "Chat" },
] as const;

export const Route = createFileRoute("/app/projects/$projectId")({
  validateSearch: (s: Record<string, unknown>): { tab?: string } =>
    typeof s.tab === "string" ? { tab: s.tab } : {},
  component: ProjectPage,
});

function ProjectPage() {
  const { projectId } = Route.useParams();
  const { tab: tabParam } = Route.useSearch();
  const tab = tabParam ?? "overview";
  const id = Number(projectId);
  const q = useAsync(() => getProject({ data: id }), [id]);
  const snap = q.data;

  if (q.loading && !snap) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-16 w-2/3" />
        <Skeleton className="h-48 w-full rounded-xl" />
      </div>
    );
  }
  if (!snap) {
    return (
      <Card className="p-8">
        <p className="font-display text-2xl">Site not found</p>
        <Button asChild className="mt-4" variant="outline">
          <Link to="/app">Back to sites</Link>
        </Button>
      </Card>
    );
  }

  const hero = snap.photos[0]?.imageUrl ?? coverFor(snap.project.name);

  return (
    <div>
      <div className="group mb-5 overflow-hidden rounded-2xl shadow-[var(--shadow-card)]">
        <SitePhoto src={hero} alt={snap.project.name} className="h-48 md:h-64">
          <p className="flex items-center gap-1 text-sm text-cream/80">
            <MapPin className="size-3.5" />
            {snap.project.city}
            {snap.project.address ? ` · ${snap.project.address}` : ""}
          </p>
          <h1 className="mt-1 font-display text-3xl font-medium tracking-tight md:text-5xl">
            {snap.project.name}
          </h1>
        </SitePhoto>
      </div>
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm text-muted">
            {snap.project.plotSqft.toLocaleString("en-IN")} sqft · {snap.project.floors} floors ·{" "}
            {snap.project.projectType.replace("_", " ")}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge tone={snap.remaining < 0 ? "danger" : "forest"}>{snap.project.status}</Badge>
          <Badge>{snap.project.projectType.replace("_", " ")}</Badge>
          <Button asChild size="sm" variant="outline">
            <Link to="/app/assistant" search={{ projectId: String(snap.project.id) }}>
              <MessageSquare className="size-4" />
              Ask the twin
            </Link>
          </Button>
        </div>
      </div>

      <TabBar className="mb-5">
        {TABS.map((t) => (
          <Link
            key={t.id}
            to="/app/projects/$projectId"
            params={{ projectId }}
            search={{ tab: t.id }}
          >
            <Tab active={tab === t.id}>{t.label}</Tab>
          </Link>
        ))}
      </TabBar>

      {tab === "overview" && <Overview snap={snap} />}
      {tab === "materials" && <Materials snap={snap} onChange={q.reload} />}
      {tab === "crew" && <Crew snap={snap} onChange={q.reload} />}
      {tab === "bills" && <Bills snap={snap} onChange={q.reload} />}
      {tab === "schedule" && <Schedule snap={snap} onChange={q.reload} />}
      {tab === "photos" && <Photos snap={snap} onChange={q.reload} />}
      {tab === "money" && <Money snap={snap} onChange={q.reload} />}
      {tab === "team" && <Team snap={snap} onChange={q.reload} />}
      {tab === "changes" && <Changes snap={snap} onChange={q.reload} />}
      {tab === "log" && <DailyLogs snap={snap} onChange={q.reload} />}
      {tab === "chat" && <Chat snap={snap} onChange={q.reload} />}
    </div>
  );
}

function materialLeft(snap: ProjectSnapshot, category: string) {
  const rows = snap.materials.filter((m) => m.category.toLowerCase() === category.toLowerCase());
  const needed = rows.reduce((s, m) => s + m.qtyNeeded, 0);
  const used = rows.reduce((s, m) => s + m.qtyUsed, 0);
  const received = rows.reduce((s, m) => s + m.qtyReceived, 0);
  const unit = rows[0]?.unit ?? "";
  return { left: Math.max(0, needed - used), received, needed, unit };
}

function Overview({ snap }: { snap: ProjectSnapshot }) {
  const daysLeft = daysBetween(todayISO(), snap.project.targetDate);
  const cement = materialLeft(snap, "Cement");
  const steel = materialLeft(snap, "Steel");
  const done = snap.phases.filter((p) => p.status === "done").length;
  const presentToday = snap.attendance.filter((a) => a.workDate === todayISO() && a.present).length;
  const recentBills = snap.bills.slice(0, 4);
  return (
    <div className="space-y-4">
      <div className="grid gap-3 md:grid-cols-[1.1fr_0.9fr]">
        <Card className="flex flex-col justify-between p-5">
          <RingStat
            value={snap.progress}
            label="Site progress"
            hint={`${done} of ${snap.phases.length} phases closed · ${daysLeft} days to handover`}
          />
          <div className="mt-5 grid grid-cols-2 gap-3">
            <Stat label="Spent" value={compactMoney(snap.spent)} hint={`of ${money(snap.project.budget)}`} />
            <Stat
              label="Remaining"
              value={compactMoney(snap.remaining)}
              hint={snap.remaining < 0 ? "Over envelope" : "In envelope"}
              danger={snap.remaining < 0}
            />
          </div>
        </Card>
        <Card className="p-5">
          <p className="text-xs tracking-wide text-muted uppercase">Cash vs envelope</p>
          <div className="mt-4 h-3 overflow-hidden rounded-full bg-bg-sunken">
            <div
              className="h-full rounded-full bg-forest transition-[width] duration-500"
              style={{
                width: `${Math.min(100, snap.project.budget ? (snap.spent / snap.project.budget) * 100 : 0)}%`,
              }}
            />
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-xs text-muted">Cement left</p>
              <p className="font-display text-xl tabular-nums">{qty(cement.left, cement.unit || "bags")}</p>
            </div>
            <div>
              <p className="text-xs text-muted">Steel left</p>
              <p className="font-display text-xl tabular-nums">{qty(steel.left, steel.unit || "kg")}</p>
            </div>
          </div>
          <Button asChild className="mt-5 w-full" variant="outline">
            <Link to="/app/assistant" search={{ projectId: String(snap.project.id) }}>
              <MessageSquare className="size-4" />
              Ask how much is left
            </Link>
          </Button>
        </Card>
      </div>

      {snap.risks.length > 0 ? (
        <Card className="space-y-2 p-4">
          {snap.risks.map((r) => (
            <div key={r.title} className="flex gap-3">
              <AlertTriangle
                className={cn(
                  "mt-0.5 size-4 shrink-0",
                  r.level === "danger" ? "text-danger" : r.level === "warn" ? "text-warn" : "text-forest",
                )}
              />
              <div>
                <p className="text-sm font-medium">{r.title}</p>
                <p className="text-xs text-muted">{r.detail}</p>
              </div>
            </div>
          ))}
        </Card>
      ) : null}

      <Card className="p-5">
        <p className="mb-4 text-xs tracking-wide text-muted uppercase">Eight phases</p>
        <ol className="grid gap-3 sm:grid-cols-2">
          {snap.phases.map((p, i) => (
            <li key={p.id} className="rounded-xl bg-bg p-3">
              <div className="mb-2 flex items-center justify-between gap-2">
                <span className="text-xs text-faint tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                <Badge tone={p.status === "done" ? "ok" : p.status === "active" ? "forest" : "neutral"}>
                  {p.status}
                </Badge>
              </div>
              <p className="text-sm font-medium">{p.name}</p>
              <Progress value={p.progress} className="mt-2" />
              <p className="mt-1 text-xs text-muted tabular-nums">
                {formatShort(p.startDate)} – {formatShort(p.endDate)} · {pct(p.progress)}
              </p>
            </li>
          ))}
        </ol>
      </Card>

      <div className="grid gap-3 md:grid-cols-2">
        <Card className="p-5">
          <p className="mb-3 text-xs tracking-wide text-muted uppercase">Live BOQ — still needed</p>
          <ul className="space-y-2">
            {snap.materials.slice(0, 7).map((m) => {
              const left = Math.max(0, m.qtyNeeded - m.qtyUsed);
              return (
                <li key={m.id} className="flex items-center justify-between gap-3 text-sm">
                  <span className="truncate">{m.name}</span>
                  <span className="shrink-0 tabular-nums text-muted">{qty(left, m.unit)}</span>
                </li>
              );
            })}
          </ul>
        </Card>
        <Card className="p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs tracking-wide text-muted uppercase">Crew</p>
              <p className="mt-1 font-display text-3xl tracking-tight tabular-nums">{money(snap.crewPending)}</p>
              <p className="mt-1 text-sm text-muted">
                {presentToday} present today · {snap.workers.length} on the books
              </p>
            </div>
            <Users className="size-5 text-forest" />
          </div>
          <ul className="mt-4 space-y-2">
            {snap.workers.slice(0, 5).map((w) => (
              <li key={w.id} className="flex items-center justify-between text-sm">
                <span>{w.name}</span>
                <span className="text-muted">{w.skill}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <Card className="p-5">
          <p className="mb-3 text-xs tracking-wide text-muted uppercase">Recent bills</p>
          {recentBills.length === 0 ? (
            <p className="text-sm text-muted">No bills yet — add one from the Bills tab.</p>
          ) : (
            <ul className="space-y-3">
              {recentBills.map((b) => (
                <li key={b.id} className="flex items-center justify-between gap-3 text-sm">
                  <div>
                    <p className="font-medium">{b.vendor}</p>
                    <p className="text-xs text-muted">{b.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="tabular-nums">{money(b.amount)}</p>
                    <p className={cn("text-xs", b.paid ? "text-ok" : "text-warn")}>{b.paid ? "Paid" : "Due"}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>
        <div className="grid grid-cols-2 gap-3">
          {(snap.photos.length ? snap.photos : [{ id: 0, imageUrl: coverFor(snap.project.name), caption: "Site" }])
            .slice(0, 4)
            .map((ph) => (
              <SitePhoto
                key={ph.id}
                src={ph.imageUrl}
                alt={ph.caption ?? "Site photo"}
                className="h-28 rounded-xl"
              />
            ))}
        </div>
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  hint,
  danger,
}: {
  label: string;
  value: string;
  hint?: string;
  danger?: boolean;
}) {
  return (
    <Card className="p-4">
      <p className="text-xs tracking-wide text-muted uppercase">{label}</p>
      <p className={cn("mt-1 font-display text-2xl tracking-tight tabular-nums", danger && "text-danger")}>
        {value}
      </p>
      {hint ? <p className="mt-1 text-xs text-muted">{hint}</p> : null}
    </Card>
  );
}

function Materials({ snap, onChange }: { snap: ProjectSnapshot; onChange: () => void }) {
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<number | undefined>();
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Cement");
  const [unit, setUnit] = useState("bags");
  const [qtyNeeded, setQtyNeeded] = useState(0);
  const [ordered, setOrdered] = useState(0);
  const [received, setReceived] = useState(0);
  const [used, setUsed] = useState(0);
  const [unitPrice, setUnitPrice] = useState(0);
  const [supplierName, setSupplierName] = useState("");

  const totalNeed = snap.materials.reduce((s, m) => s + m.qtyNeeded * m.unitPrice, 0);
  const totalRecv = snap.materials.reduce((s, m) => s + m.qtyReceived * m.unitPrice, 0);

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-muted">
          BOQ value {money(totalNeed)} · received {money(totalRecv)}
        </p>
        <Button
          size="sm"
          onClick={() => {
            setEditId(undefined);
            setName("");
            setSupplierName("");
            setOpen(true);
          }}
        >
          <Plus className="size-4" />
          Add item
        </Button>
      </div>
      <div className="overflow-x-auto rounded-xl bg-bg-elevated shadow-[var(--shadow-card)]">
        <table className="w-full min-w-[720px] text-sm">
          <thead className="text-left text-xs tracking-wide text-muted uppercase">
            <tr className="border-b border-line">
              <th className="px-4 py-3 font-medium">Item</th>
              <th className="px-3 py-3 font-medium">Need</th>
              <th className="px-3 py-3 font-medium">Ordered</th>
              <th className="px-3 py-3 font-medium">In</th>
              <th className="px-3 py-3 font-medium">Used</th>
              <th className="px-3 py-3 font-medium">Rate</th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {snap.materials.map((m) => (
              <tr
                key={m.id}
                className="cursor-pointer border-b border-line/70 last:border-0 hover:bg-bg-sunken/50"
                onClick={() => {
                  setName(m.name);
                  setCategory(m.category);
                  setUnit(m.unit);
                  setQtyNeeded(m.qtyNeeded);
                  setUnitPrice(m.unitPrice);
                  setSupplierName(m.supplierName ?? "");
                  setEditId(m.id);
                  setOrdered(m.qtyOrdered);
                  setReceived(m.qtyReceived);
                  setUsed(m.qtyUsed);
                  setOpen(true);
                }}
              >
                <td className="px-4 py-3">
                  <p className="font-medium">{m.name}</p>
                  <p className="text-xs text-muted">{m.category}{m.supplierName ? ` · ${m.supplierName}` : ""}</p>
                </td>
                <td className="px-3 py-3 tabular-nums">{qty(m.qtyNeeded, m.unit)}</td>
                <td className="px-3 py-3 tabular-nums">{qty(m.qtyOrdered)}</td>
                <td className="px-3 py-3 tabular-nums">{qty(m.qtyReceived)}</td>
                <td className="px-3 py-3 tabular-nums">{qty(m.qtyUsed)}</td>
                <td className="px-3 py-3 tabular-nums">{money(m.unitPrice)}</td>
                <td className="px-4 py-3">
                  <Badge tone={m.status === "received" ? "ok" : m.status === "partial" ? "warn" : "neutral"}>
                    {m.status}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogTitle>{editId ? "Update material" : "Add material"}</DialogTitle>
          <DialogDesc>Quantities use the same units as the BOQ. Tap a row to reconcile ordered / received / used.</DialogDesc>
          <form
            className="mt-4 space-y-3"
            onSubmit={async (e) => {
              e.preventDefault();
              await upsertMaterial({
                data: {
                  id: editId,
                  projectId: snap.project.id,
                  name,
                  category,
                  unit,
                  qtyNeeded,
                  qtyOrdered: ordered,
                  qtyReceived: received,
                  qtyUsed: used,
                  unitPrice,
                  supplierName: supplierName || undefined,
                },
              });
              toast.success(editId ? "BOQ updated" : "Added to BOQ");
              setOpen(false);
              setName("");
              setEditId(undefined);
              onChange();
            }}
          >
            <Field label="Name">
              <Input value={name} onChange={(e) => setName(e.target.value)} required />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Category">
                <NativeSelect value={category} onChange={(e) => setCategory(e.target.value)}>
                  {MATERIAL_CATEGORIES.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </NativeSelect>
              </Field>
              <Field label="Unit">
                <Input value={unit} onChange={(e) => setUnit(e.target.value)} />
              </Field>
            </div>
            <Field label="Supplier">
              <Input value={supplierName} onChange={(e) => setSupplierName(e.target.value)} placeholder="Annapurna Cement Depot" />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Qty needed">
                <Input type="number" value={qtyNeeded} onChange={(e) => setQtyNeeded(Number(e.target.value))} />
              </Field>
              <Field label="Unit price">
                <Input type="number" value={unitPrice} onChange={(e) => setUnitPrice(Number(e.target.value))} />
              </Field>
              <Field label="Ordered">
                <Input type="number" value={ordered} onChange={(e) => setOrdered(Number(e.target.value))} />
              </Field>
              <Field label="Received">
                <Input type="number" value={received} onChange={(e) => setReceived(Number(e.target.value))} />
              </Field>
              <Field label="Used">
                <Input type="number" value={used} onChange={(e) => setUsed(Number(e.target.value))} />
              </Field>
            </div>
            <Button type="submit" className="w-full">
              Save item
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Crew({ snap, onChange }: { snap: ProjectSnapshot; onChange: () => void }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [skill, setSkill] = useState("Mason");
  const [rate, setRate] = useState(900);
  const [hours, setHours] = useState(8);

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <p className="text-sm text-muted">Tap present for today. Payouts use days × daily rate.</p>
          <label className="hidden items-center gap-2 text-xs text-muted sm:flex">
            Hours
            <Input
              type="number"
              min={1}
              max={12}
              value={hours}
              onChange={(e) => setHours(Number(e.target.value))}
              className="h-8 w-16"
            />
          </label>
        </div>
        <Button size="sm" onClick={() => setOpen(true)}>
          <Users className="size-4" />
          Add worker
        </Button>
      </div>
      {snap.workers.length === 0 ? (
        <Card className="p-6 text-sm text-muted">No crew on this site yet. Add a mason or hire from the market.</Card>
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {snap.workers.map((w) => {
            const days = snap.attendance.filter((a) => a.workerId === w.id && a.present).length;
            const paid = snap.payouts.filter((p) => p.workerId === w.id).reduce((s, p) => s + p.amount, 0);
            const pending = Math.max(0, days * w.dailyRate - paid);
            const today = snap.attendance.find((a) => a.workerId === w.id && a.workDate === todayISO());
            return (
              <Card key={w.id} className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-medium">{w.name}</p>
                    <p className="text-xs text-muted">
                      {w.skill} · {money(w.dailyRate)}/day
                    </p>
                  </div>
                  <Badge tone={today?.present ? "ok" : "neutral"}>{today?.present ? "On site" : "Not marked"}</Badge>
                </div>
                <p className="mt-3 text-sm tabular-nums">
                  {days} days · pending {money(pending)}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant={today?.present ? "secondary" : "outline"}
                    onClick={async () => {
                      await markAttendance({
                        data: {
                          projectId: snap.project.id,
                          workerId: w.id,
                          present: !today?.present,
                          hours,
                          method: "manual",
                        },
                      });
                      onChange();
                    }}
                  >
                    <Check className="size-4" />
                    {today?.present ? "Undo today" : "Mark present"}
                  </Button>
                  <Button
                    size="sm"
                    disabled={pending <= 0}
                    onClick={async () => {
                      await payWorker({
                        data: {
                          projectId: snap.project.id,
                          workerId: w.id,
                          amount: pending,
                          periodLabel: "Attendance to date",
                        },
                      });
                      toast.success(`Paid ${w.name}`);
                      onChange();
                    }}
                  >
                    <IndianRupee className="size-4" />
                    Pay {money(pending)}
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogTitle>Add worker</DialogTitle>
          <form
            className="mt-4 space-y-3"
            onSubmit={async (e) => {
              e.preventDefault();
              await addWorker({
                data: { projectId: snap.project.id, name, skill, dailyRate: rate },
              });
              setOpen(false);
              setName("");
              onChange();
            }}
          >
            <Field label="Name">
              <Input value={name} onChange={(e) => setName(e.target.value)} required />
            </Field>
            <Field label="Skill">
              <NativeSelect value={skill} onChange={(e) => setSkill(e.target.value)}>
                {SKILLS.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </NativeSelect>
            </Field>
            <Field label="Daily rate (₹)">
              <Input type="number" value={rate} onChange={(e) => setRate(Number(e.target.value))} />
            </Field>
            <Button type="submit" className="w-full">
              Add to crew
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Bills({ snap, onChange }: { snap: ProjectSnapshot; onChange: () => void }) {
  const [vendor, setVendor] = useState("");
  const [amount, setAmount] = useState(0);
  const [category, setCategory] = useState("materials");
  const [date, setDate] = useState(todayISO());
  const [notes, setNotes] = useState("");
  const [phaseId, setPhaseId] = useState<number | "">("");
  const [materialId, setMaterialId] = useState<number | "">("");
  const [ocrBusy, setOcrBusy] = useState(false);

  async function onFile(file: File) {
    setOcrBusy(true);
    try {
      const dataUrl = await compressImage(file);
      const parsed = await parseBillOcr({ data: { imageDataUrl: dataUrl } });
      if (parsed.ok) {
        setVendor(parsed.vendor);
        setAmount(parsed.amount);
        if (parsed.date) setDate(parsed.date);
        setCategory(parsed.category);
        setNotes(parsed.notes);
        toast.success("Bill fields filled from the photo");
      } else {
        toast.error(parsed.error);
      }
    } finally {
      setOcrBusy(false);
    }
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_0.9fr]">
      <div className="space-y-3">
        {snap.bills.length === 0 ? (
          <Card className="p-6 text-sm text-muted">No bills yet. Photograph a receipt or enter one by hand.</Card>
        ) : (
          snap.bills.map((b) => (
            <Card key={b.id} className="flex items-start justify-between gap-3 p-4">
              <div>
                <p className="font-medium">{b.vendor}</p>
                <p className="text-xs text-muted">
                  {formatDate(b.billDate)} · {b.category}
                  {b.phaseId ? ` · ${snap.phases.find((p) => p.id === b.phaseId)?.name ?? "phase"}` : ""}
                  {b.materialId ? ` · ${snap.materials.find((m) => m.id === b.materialId)?.name ?? "item"}` : ""}
                  {b.notes ? ` · ${b.notes}` : ""}
                </p>
              </div>
              <div className="text-right">
                <p className="font-medium tabular-nums">{money(b.amount)}</p>
                <button
                  type="button"
                  className="mt-1 text-xs text-forest"
                  onClick={async () => {
                    await toggleBillPaid({
                      data: { projectId: snap.project.id, billId: b.id, paid: !b.paid },
                    });
                    onChange();
                  }}
                >
                  {b.paid ? "Paid" : "Mark paid"}
                </button>
              </div>
            </Card>
          ))
        )}
      </div>
      <Card className="h-fit p-4">
        <p className="font-medium">Log a bill</p>
        <form
          className="mt-3 space-y-3"
          onSubmit={async (e) => {
            e.preventDefault();
            await addBill({
              data: {
                projectId: snap.project.id,
                vendor,
                amount,
                billDate: date,
                category,
                notes: notes || undefined,
                phaseId: phaseId || undefined,
                materialId: materialId || undefined,
              },
            });
            toast.success("Bill logged");
            setVendor("");
            setAmount(0);
            setNotes("");
            onChange();
          }}
        >
          <Field label="Photo (OCR)">
            <Input
              type="file"
              accept="image/*"
              disabled={ocrBusy}
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) void onFile(f);
              }}
            />
          </Field>
          <Field label="Vendor">
            <Input value={vendor} onChange={(e) => setVendor(e.target.value)} required />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Amount">
              <Input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} />
            </Field>
            <Field label="Date">
              <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </Field>
          </div>
          <Field label="Category">
            <NativeSelect value={category} onChange={(e) => setCategory(e.target.value)}>
              {BILL_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </NativeSelect>
          </Field>
          <Field label="Link to phase">
            <NativeSelect value={phaseId} onChange={(e) => setPhaseId(e.target.value ? Number(e.target.value) : "")}>
              <option value="">None</option>
              {snap.phases.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </NativeSelect>
          </Field>
          <Field label="Link to material">
            <NativeSelect value={materialId} onChange={(e) => setMaterialId(e.target.value ? Number(e.target.value) : "")}>
              <option value="">None</option>
              {snap.materials.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </NativeSelect>
          </Field>
          <Field label="Notes">
            <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} />
          </Field>
          <Button type="submit" className="w-full" disabled={ocrBusy}>
            {ocrBusy ? "Reading bill…" : "Save bill"}
          </Button>
        </form>
      </Card>
    </div>
  );
}

function Schedule({ snap, onChange }: { snap: ProjectSnapshot; onChange: () => void }) {
  const [advice, setAdvice] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const span = Math.max(
    1,
    daysBetween(snap.project.startDate, snap.project.targetDate),
  );
  return (
    <div className="space-y-3">
      <div className="flex justify-end">
        <Button
          size="sm"
          variant="outline"
          disabled={busy}
          onClick={async () => {
            setBusy(true);
            try {
              const res = await optimizeSchedule({ data: { projectId: snap.project.id } });
              setAdvice(res.ok ? res.text : res.error);
            } finally {
              setBusy(false);
            }
          }}
        >
          {busy ? "Reading risks…" : "AI schedule check"}
        </Button>
      </div>
      {advice ? <Card className="whitespace-pre-wrap p-4 text-sm">{advice}</Card> : null}
      {snap.phases.map((p) => {
        const left = Math.max(0, daysBetween(snap.project.startDate, p.startDate));
        const width = Math.max(8, (daysBetween(p.startDate, p.endDate) / span) * 100);
        const offset = (left / span) * 100;
        return (
          <Card key={p.id} className="p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="font-medium">{p.name}</p>
                <p className="text-xs text-muted">
                  {formatShort(p.startDate)} – {formatShort(p.endDate)} · {money(p.estimatedCost)}
                </p>
              </div>
              <Badge tone={p.status === "done" ? "ok" : p.status === "active" ? "forest" : "neutral"}>
                {p.status}
              </Badge>
            </div>
            <div className="bg-grid-dense mt-3 h-8 overflow-hidden rounded-md">
              <div
                className="h-full rounded-md bg-forest/80"
                style={{ width: `${width}%`, marginLeft: `${offset}%` }}
              />
            </div>
            <label className="mt-3 flex items-center gap-3 text-sm">
              <span className="w-16 text-muted">Progress</span>
              <input
                key={`${p.id}-${p.progress}`}
                type="range"
                min={0}
                max={100}
                defaultValue={p.progress}
                className="flex-1 accent-forest"
                onMouseUp={async (e) => {
                  const value = Number((e.target as HTMLInputElement).value);
                  await updatePhase({
                    data: { projectId: snap.project.id, phaseId: p.id, progress: value },
                  });
                  onChange();
                }}
                onTouchEnd={async (e) => {
                  const value = Number((e.target as HTMLInputElement).value);
                  await updatePhase({
                    data: { projectId: snap.project.id, phaseId: p.id, progress: value },
                  });
                  onChange();
                }}
              />
              <span className="w-10 text-right tabular-nums">{pct(p.progress)}</span>
            </label>
          </Card>
        );
      })}
    </div>
  );
}

function Photos({ snap, onChange }: { snap: ProjectSnapshot; onChange: () => void }) {
  const [caption, setCaption] = useState("");
  const [busy, setBusy] = useState(false);

  return (
    <div>
      <Card className="mb-4 p-4">
        <p className="font-medium">Log progress</p>
        <form
          className="mt-3 grid gap-3 sm:grid-cols-[1fr_auto]"
          onSubmit={async (e) => {
            e.preventDefault();
            const input = (e.currentTarget.elements.namedItem("photo") as HTMLInputElement | null);
            const file = input?.files?.[0];
            if (!file) {
              toast.error("Choose a photo");
              return;
            }
            setBusy(true);
            try {
              const imageUrl = await compressImage(file);
              const note = await annotatePhoto({ data: { caption } });
              await addPhoto({
                data: {
                  projectId: snap.project.id,
                  caption: caption || undefined,
                  imageUrl,
                  annotation: note.text,
                },
              });
              setCaption("");
              onChange();
            } finally {
              setBusy(false);
            }
          }}
        >
          <Field label="Photo">
            <Input type="file" name="photo" accept="image/*" required />
          </Field>
          <Field label="Caption" className="sm:col-span-2">
            <Input value={caption} onChange={(e) => setCaption(e.target.value)} placeholder="East wall plaster, first floor" />
          </Field>
          <Button type="submit" disabled={busy} className="sm:col-start-2">
            <Camera className="size-4" />
            {busy ? "Logging…" : "Save photo"}
          </Button>
        </form>
      </Card>
      <div className="grid gap-3 sm:grid-cols-2">
        {snap.photos.map((p) => (
          <figure key={p.id} className="overflow-hidden rounded-xl bg-bg-elevated shadow-[var(--shadow-card)]">
            <img src={p.imageUrl} alt={p.caption ?? "Site photo"} className="h-48 w-full object-cover" />
            <figcaption className="p-3">
              <p className="text-sm font-medium">{p.caption || "Untitled"}</p>
              {p.annotation ? <p className="mt-1 text-xs text-muted">{p.annotation}</p> : null}
              <p className="mt-1 text-xs text-faint">{formatDate(p.createdAt.slice(0, 10))}</p>
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}

function Money({ snap, onChange }: { snap: ProjectSnapshot; onChange: () => void }) {
  const [payee, setPayee] = useState("");
  const [amount, setAmount] = useState(0);
  const [category, setCategory] = useState("other");
  const chart = useMemo(() => {
    const byCat: Record<string, number> = {};
    for (const b of snap.bills.filter((x) => x.paid)) byCat[b.category] = (byCat[b.category] ?? 0) + b.amount;
    for (const p of snap.payments) byCat[p.category] = (byCat[p.category] ?? 0) + p.amount;
    return Object.entries(byCat).map(([name, value]) => ({ name, value: Math.round(value) }));
  }, [snap]);

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <p className="text-xs tracking-wide text-muted uppercase">Envelope</p>
          <Button
            size="sm"
            variant="outline"
            onClick={async () => {
              const report = await exportProjectReport({ data: snap.project.id });
              const blob = new Blob([report.text], { type: "text/plain" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = report.filename;
              a.click();
              URL.revokeObjectURL(url);
            }}
          >
            Export GST ledger
          </Button>
        </div>
        <p className="mt-1 font-display text-3xl tracking-tight tabular-nums">{money(snap.project.budget)}</p>
        <Progress value={Math.min(100, (snap.spent / Math.max(1, snap.project.budget)) * 100)} className="mt-3" />
        <div className="mt-3 flex justify-between text-sm">
          <span>Spent {money(snap.spent)}</span>
          <span className={snap.remaining < 0 ? "text-danger" : ""}>Left {money(snap.remaining)}</span>
        </div>
        {chart.length > 0 ? (
          <div className="mt-4 h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chart}>
                <CartesianGrid stroke="rgba(26,25,22,0.08)" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v: number) => money(v)} />
                <Bar dataKey="value" fill="#1f5c4d" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <p className="mt-4 text-sm text-muted">Pay a bill to see the split.</p>
        )}
      </Card>
      <Card className="p-4">
        <p className="font-medium">Record a payment</p>
        <form
          className="mt-3 space-y-3"
          onSubmit={async (e) => {
            e.preventDefault();
            await addPayment({
              data: {
                projectId: snap.project.id,
                payee,
                amount,
                method: "upi",
                category,
                paidAt: todayISO(),
              },
            });
            setPayee("");
            setAmount(0);
            onChange();
          }}
        >
          <Field label="Payee">
            <Input value={payee} onChange={(e) => setPayee(e.target.value)} required />
          </Field>
          <Field label="Amount">
            <Input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} />
          </Field>
          <Field label="Category">
            <NativeSelect value={category} onChange={(e) => setCategory(e.target.value)}>
              {BILL_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </NativeSelect>
          </Field>
          <Button type="submit" className="w-full">
            Save payment
          </Button>
        </form>
        <ul className="mt-4 space-y-2">
          {snap.payments.slice(0, 6).map((p) => (
            <li key={p.id} className="flex justify-between text-sm">
              <span>{p.payee}</span>
              <span className="tabular-nums">{money(p.amount)}</span>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}

function Team({ snap, onChange }: { snap: ProjectSnapshot; onChange: () => void }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted">Quotes and hires sit on this site.</p>
        <Button asChild size="sm" variant="outline">
          <Link to="/app/market" search={{}}>
            Find professionals
          </Link>
        </Button>
      </div>
      {snap.hires.length === 0 && snap.quotes.length === 0 ? (
        <Card className="p-6 text-sm text-muted">No one hired yet. Browse the market and request a quote.</Card>
      ) : null}
      {snap.hires.map((h) => (
        <Card key={h.id} className="flex items-center justify-between p-4">
          <div>
            <p className="font-medium">{h.professionalName}</p>
            <p className="text-xs text-muted">{h.role} · hired {formatDate(h.hiredAt)}</p>
          </div>
          <Badge tone="ok">{h.status}</Badge>
        </Card>
      ))}
      {snap.quotes.map((q) => (
        <Card key={q.id} className="flex items-center justify-between gap-3 p-4">
          <div>
            <p className="font-medium">{q.professionalName}</p>
            <p className="text-xs text-muted">{q.status}{q.amount ? ` · ${money(q.amount)}` : ""}</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge>{q.status}</Badge>
            {q.status !== "accepted" && snap.access === "owner" ? (
              <Button
                size="sm"
                onClick={async () => {
                  await hireProfessional({
                    data: { projectId: snap.project.id, professionalId: q.professionalId },
                  });
                  toast.success("Hired");
                  onChange();
                }}
              >
                Accept & hire
              </Button>
            ) : null}
          </div>
        </Card>
      ))}
      {snap.orders.length > 0 ? (
        <div>
          <p className="mb-2 text-xs tracking-wide text-muted uppercase">Material orders</p>
          {snap.orders.map((o) => (
            <Card key={o.id} className="mb-2 flex justify-between p-4">
              <span>
                {o.itemName} × {qty(o.qty)}
              </span>
              <span className="tabular-nums">{money(o.qty * o.unitPrice)}</span>
            </Card>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function Changes({ snap, onChange }: { snap: ProjectSnapshot; onChange: () => void }) {
  const [title, setTitle] = useState("");
  const [detail, setDetail] = useState("");
  const [cost, setCost] = useState(0);
  const [days, setDays] = useState(0);

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_0.85fr]">
      <div className="space-y-3">
        {snap.changeOrders.length === 0 ? (
          <Card className="p-6 text-sm text-muted">No scope changes yet. Log extras before they eat the envelope.</Card>
        ) : (
          snap.changeOrders.map((c) => (
            <Card key={c.id} className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-medium">{c.title}</p>
                  <p className="mt-1 text-xs text-muted">
                    {money(c.costDelta)} · {c.daysDelta} days{c.detail ? ` · ${c.detail}` : ""}
                  </p>
                </div>
                <Badge tone={c.status === "approved" ? "ok" : c.status === "rejected" ? "danger" : "warn"}>
                  {c.status}
                </Badge>
              </div>
              {c.status === "proposed" && snap.access === "owner" ? (
                <div className="mt-3 flex gap-2">
                  <Button
                    size="sm"
                    onClick={async () => {
                      await decideChangeOrder({ data: { projectId: snap.project.id, id: c.id, status: "approved" } });
                      onChange();
                    }}
                  >
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={async () => {
                      await decideChangeOrder({ data: { projectId: snap.project.id, id: c.id, status: "rejected" } });
                      onChange();
                    }}
                  >
                    Reject
                  </Button>
                </div>
              ) : null}
            </Card>
          ))
        )}
      </div>
      {snap.access === "owner" ? (
        <Card className="h-fit p-4">
          <p className="font-medium">Propose a change</p>
          <form
            className="mt-3 space-y-3"
            onSubmit={async (e) => {
              e.preventDefault();
              await addChangeOrder({
                data: {
                  projectId: snap.project.id,
                  title,
                  detail: detail || undefined,
                  costDelta: cost,
                  daysDelta: days,
                },
              });
              setTitle("");
              setDetail("");
              toast.success("Change order logged");
              onChange();
            }}
          >
            <Field label="Title">
              <Input value={title} onChange={(e) => setTitle(e.target.value)} required />
            </Field>
            <Field label="Detail">
              <Textarea value={detail} onChange={(e) => setDetail(e.target.value)} rows={3} />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Cost delta (₹)">
                <Input type="number" value={cost} onChange={(e) => setCost(Number(e.target.value))} />
              </Field>
              <Field label="Days delta">
                <Input type="number" value={days} onChange={(e) => setDays(Number(e.target.value))} />
              </Field>
            </div>
            <Button type="submit" className="w-full">
              Save change order
            </Button>
          </form>
        </Card>
      ) : null}
    </div>
  );
}

function DailyLogs({ snap, onChange }: { snap: ProjectSnapshot; onChange: () => void }) {
  const [weather, setWeather] = useState("Clear");
  const [notes, setNotes] = useState("");
  const [issues, setIssues] = useState("");
  const present = snap.attendance.filter((a) => a.workDate === todayISO() && a.present).length;

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_0.85fr]">
      <div className="space-y-3">
        {snap.dailyLogs.length === 0 ? (
          <Card className="p-6 text-sm text-muted">No daily logs. Crew can write weather, headcount and issues here.</Card>
        ) : (
          snap.dailyLogs.map((l) => (
            <Card key={l.id} className="p-4">
              <p className="text-sm font-medium">
                {formatDate(l.logDate)} · {l.weather} · {l.workersCount} on site
              </p>
              {l.notes ? <p className="mt-2 text-sm">{l.notes}</p> : null}
              {l.issues ? <p className="mt-1 text-sm text-warn">{l.issues}</p> : null}
            </Card>
          ))
        )}
      </div>
      <Card className="h-fit p-4">
        <p className="font-medium">Today&apos;s log</p>
        <form
          className="mt-3 space-y-3"
          onSubmit={async (e) => {
            e.preventDefault();
            await addDailyLog({
              data: {
                projectId: snap.project.id,
                logDate: todayISO(),
                weather,
                workersCount: present,
                notes: notes || undefined,
                issues: issues || undefined,
              },
            });
            setNotes("");
            setIssues("");
            toast.success("Log saved");
            onChange();
          }}
        >
          <Field label="Weather">
            <NativeSelect value={weather} onChange={(e) => setWeather(e.target.value)}>
              <option>Clear</option>
              <option>Cloudy</option>
              <option>Rain</option>
              <option>Heat</option>
            </NativeSelect>
          </Field>
          <p className="text-xs text-muted">{present} marked present today — used as headcount.</p>
          <Field label="Notes">
            <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} />
          </Field>
          <Field label="Issues">
            <Textarea value={issues} onChange={(e) => setIssues(e.target.value)} rows={2} />
          </Field>
          <Button type="submit" className="w-full">
            Save today
          </Button>
        </form>
      </Card>
    </div>
  );
}

function Chat({ snap, onChange }: { snap: ProjectSnapshot; onChange: () => void }) {
  const [body, setBody] = useState("");
  return (
    <div>
      <div className="space-y-3">
        {snap.messages.length === 0 ? (
          <p className="text-sm text-muted">No messages. Leave a note for the crew or yourself.</p>
        ) : (
          snap.messages.map((m) => (
            <div key={m.id} className="rounded-xl bg-bg-elevated px-4 py-3 shadow-[var(--shadow-card)]">
              <p className="text-xs text-muted">
                {m.authorName} · {formatDate(m.createdAt.slice(0, 10))}
              </p>
              <p className="mt-1 text-sm">{m.body}</p>
            </div>
          ))
        )}
      </div>
      <form
        className="mt-4 flex gap-2"
        onSubmit={async (e) => {
          e.preventDefault();
          if (!body.trim()) return;
          await addMessage({ data: { projectId: snap.project.id, body } });
          setBody("");
          onChange();
        }}
      >
        <Input value={body} onChange={(e) => setBody(e.target.value)} placeholder="Site note…" />
        <Button type="submit">Send</Button>
      </form>
    </div>
  );
}

function compressImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const scale = Math.min(1, 960 / img.width);
      canvas.width = Math.max(1, Math.round(img.width * scale));
      canvas.height = Math.max(1, Math.round(img.height * scale));
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("No canvas"));
        return;
      }
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL("image/jpeg", 0.62));
    };
    img.onerror = () => reject(new Error("Could not read image"));
    img.src = url;
  });
}
