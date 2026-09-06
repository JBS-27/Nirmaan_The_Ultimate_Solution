import { createFileRoute } from "@tanstack/react-router";
import { Mic, Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { PageHeader } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { NativeSelect } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { askAssistant, listAiMessages } from "@/lib/server/ai";
import { listProjects } from "@/lib/server/projects";
import { useAsync } from "@/lib/use-async";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/assistant")({
  validateSearch: (s: Record<string, unknown>): { projectId?: string } =>
    typeof s.projectId === "string" ? { projectId: s.projectId } : {},
  component: Assistant,
});

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
    setLocal([]);
  }, [projectId]);

  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight, behavior: "smooth" });
  }, [local, history.data, busy]);

  const messages = [...(history.data ?? []), ...local];

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || busy) return;
    setPrompt("");
    setLocal((m) => [...m, { role: "user", content: trimmed }]);
    setBusy(true);
    try {
      const res = await askAssistant({ data: { projectId, prompt: trimmed } });
      const text = res.ok ? res.text : "Could not answer.";
      setLocal((m) => [...m, { role: "assistant", content: text }]);
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
        description="Questions are answered from this project’s BOQ, bills, crew and schedule — not from generic advice."
        action={
          <NativeSelect
            className="w-48"
            value={projectId ?? ""}
            onChange={(e) => setProjectId(e.target.value ? Number(e.target.value) : undefined)}
          >
            <option value="">No project</option>
            {(projects.data ?? []).map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </NativeSelect>
        }
      />

      <Card className="flex min-h-[60dvh] flex-col p-0">
        <div ref={scroller} className="flex-1 space-y-3 overflow-y-auto p-4">
          {messages.length === 0 ? (
            <div className="grid gap-2 sm:grid-cols-2">
              {[
                "How much cement do I still need?",
                "Which phase is most over budget?",
                "Who should I hire next in my city?",
                "Summarise site progress for today",
              ].map((q) => (
                <button
                  key={q}
                  type="button"
                  className="rounded-lg border border-line bg-bg px-3 py-3 text-left text-sm hover:bg-bg-sunken"
                  onClick={() => void send(q)}
                >
                  {q}
                </button>
              ))}
            </div>
          ) : (
            messages.map((m, i) => (
              <div
                key={`${m.role}-${i}-${m.content.slice(0, 12)}`}
                className={cn(
                  "max-w-[42rem] rounded-xl px-3 py-2 text-sm whitespace-pre-wrap",
                  m.role === "user" ? "ml-auto bg-forest text-cream" : "bg-bg-sunken text-ink",
                )}
              >
                {m.content}
              </div>
            ))
          )}
          {busy ? <p className="text-sm text-muted">Checking the ledger…</p> : null}
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
    </div>
  );
}

type SpeechRec = {
  lang: string;
  start: () => void;
  onresult: ((ev: { results: { 0: { 0: { transcript: string } } } }) => void) | null;
};
