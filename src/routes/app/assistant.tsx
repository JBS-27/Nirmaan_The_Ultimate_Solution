import { createFileRoute, Link } from "@tanstack/react-router";
import { Mic, Send, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { PageHeader } from "@/components/app-shell";
import { SitePhoto } from "@/components/site-photo";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { NativeSelect } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { askAssistant, listAiMessages } from "@/lib/server/ai";
import { listProjects } from "@/lib/server/projects";
import { SITE_PHOTOS } from "@/lib/site-media";
import { useAsync } from "@/lib/use-async";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/assistant")({
  validateSearch: (s: Record<string, unknown>): { projectId?: string } =>
    typeof s.projectId === "string" ? { projectId: s.projectId } : {},
  component: Assistant,
});

const SUGGESTIONS = [
  "How much cement is left?",
  "What is my remaining budget?",
  "Who is working today?",
  "Give me a summary of this project",
  "What should I do next?",
];

function Assistant() {
  const search = Route.useSearch();
  const projects = useAsync(() => listProjects(), []);
  const [projectId, setProjectId] = useState<number | undefined>(
    search.projectId ? Number(search.projectId) : undefined,
  );
  const history = useAsync(() => listAiMessages({ data: { projectId } }), [projectId]);
  const [prompt, setPrompt] = useState("");
  const [busy, setBusy] = useState(false);
  const [local, setLocal] = useState<{ role: "user" | "assistant"; content: string }[]>([]);
  const scroller = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (projectId || !projects.data?.length) return;
    setProjectId(projects.data[0]!.id);
  }, [projects.data, projectId]);

  useEffect(() => {
    setLocal([]);
  }, [projectId]);

  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight, behavior: "smooth" });
  }, [local, history.data, busy]);

  const messages = [...(history.data ?? []), ...local];
  const site = projects.data?.find((p) => p.id === projectId);

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || busy) return;
    setPrompt("");
    setLocal((m) => [...m, { role: "user", content: trimmed }]);
    setBusy(true);
    try {
      const res = await askAssistant({ data: { projectId, prompt: trimmed } });
      const reply = res.ok ? res.text : "Could not answer.";
      setLocal((m) => [...m, { role: "assistant", content: reply }]);
    } catch (err) {
      setLocal((m) => [
        ...m,
        { role: "assistant", content: err instanceof Error ? err.message : "Could not answer." },
      ]);
    } finally {
      setBusy(false);
    }
  }

  function listen() {
    const SR = (window as unknown as { webkitSpeechRecognition?: new () => SpeechRec }).webkitSpeechRecognition;
    if (!SR) return;
    const rec = new SR();
    rec.lang = "en-IN";
    rec.onresult = (ev: { results: { 0: { 0: { transcript: string } } } }) => {
      setPrompt(ev.results[0][0].transcript);
    };
    rec.start();
  }

  return (
    <div className="flex flex-col">
      <PageHeader
        kicker="Assistant"
        title="Ask the twin"
        description="Answers come from this project’s BOQ, bills, crew and schedule — not generic advice."
        action={
          <NativeSelect
            className="w-52"
            value={projectId ?? ""}
            onChange={(e) => setProjectId(e.target.value ? Number(e.target.value) : undefined)}
          >
            <option value="">Pick a project</option>
            {(projects.data ?? []).map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </NativeSelect>
        }
      />

      {!projects.loading && !(projects.data ?? []).length ? (
        <Card className="overflow-hidden p-0">
          <SitePhoto src={SITE_PHOTOS.plans} alt="" className="h-40">
            <p className="font-display text-2xl tracking-tight">Load a site first</p>
          </SitePhoto>
          <div className="p-5">
            <p className="text-sm text-muted">The twin reads a live ledger. Plant the Koramangala demo, then ask about cement.</p>
            <Button asChild className="mt-4">
              <Link to="/dashboard">Go to dashboard</Link>
            </Button>
          </div>
        </Card>
      ) : (
        <Card className="flex min-h-[64dvh] flex-col overflow-hidden p-0">
          {site ? (
            <div className="flex items-center justify-between gap-3 border-b border-line bg-bg px-4 py-3">
              <div>
                <p className="text-sm font-medium">{site.name}</p>
                <p className="text-xs text-muted">
                  {site.city} · {site.progress}% · ledger-aware
                </p>
              </div>
              <Sparkles className="size-4 text-forest" />
            </div>
          ) : null}
          <div ref={scroller} className="flex-1 space-y-3 overflow-y-auto p-4">
            {messages.length === 0 ? (
              <div>
                <p className="mb-3 text-sm text-muted">Try one of these — the twin will read the site book.</p>
                <div className="grid gap-2 sm:grid-cols-2">
                  {SUGGESTIONS.map((q) => (
                    <button
                      key={q}
                      type="button"
                      className="rounded-xl border border-line bg-bg px-4 py-3 text-left text-sm transition-colors duration-150 hover:border-forest/40 hover:bg-forest-soft"
                      onClick={() => void send(q)}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((m, i) => (
                <div
                  key={`${m.role}-${i}-${m.content.slice(0, 12)}`}
                  className={cn(
                    "max-w-[42rem] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap",
                    m.role === "user" ? "ml-auto bg-forest text-cream" : "bg-bg-sunken text-ink",
                  )}
                >
                  {m.content}
                </div>
              ))
            )}
            {busy ? (
              <p className="text-sm text-muted">Checking the ledger…</p>
            ) : null}
          </div>
          <form
            className="flex items-end gap-2 border-t border-line p-3"
            onSubmit={(e) => {
              e.preventDefault();
              void send(prompt);
            }}
          >
            <Textarea
              rows={2}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="How much TMT is left for the first slab?"
              className="min-h-14"
            />
            <Button type="button" variant="outline" size="icon" onClick={listen} aria-label="Voice">
              <Mic className="size-4" />
            </Button>
            <Button type="submit" size="icon" disabled={busy} aria-label="Send">
              <Send className="size-4" />
            </Button>
          </form>
        </Card>
      )}
    </div>
  );
}

type SpeechRec = {
  lang: string;
  start: () => void;
  onresult: ((ev: { results: { 0: { 0: { transcript: string } } } }) => void) | null;
};
