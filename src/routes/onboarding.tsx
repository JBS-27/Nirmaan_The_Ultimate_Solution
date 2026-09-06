import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, NativeSelect } from "@/components/ui/field";
import { CITIES, ROLES } from "@/lib/constants";
import { saveProfile } from "@/lib/server/profile";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/onboarding")({ component: Onboarding });

function Onboarding() {
  const { user, isPending } = useCurrentUserState();
  const navigate = useNavigate();
  const [role, setRole] = useState("owner");
  const [displayName, setDisplayName] = useState(user?.displayName ?? "");
  const [city, setCity] = useState("Bengaluru");
  const [phone, setPhone] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (isPending) return null;
  if (!user) return <RedirectToSignIn />;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await saveProfile({
        data: {
          role,
          displayName: displayName.trim() || user?.displayName || "Builder",
          city,
          phone: phone || undefined,
        },
      });
      navigate({ to: "/app" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save profile");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="bg-grid min-h-dvh px-4 py-10">
      <div className="mx-auto max-w-lg">
        <Logo />
        <h1 className="mt-8 font-display text-3xl font-medium tracking-tight">How do you show up on site?</h1>
        <p className="mt-2 text-muted">This sets your home screen. You can still create and run projects from any role.</p>

        <form className="mt-8 space-y-6" onSubmit={submit}>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {ROLES.map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => setRole(r.id)}
                className={cn(
                  "rounded-xl border px-4 py-3 text-left transition-colors",
                  role === r.id
                    ? "border-forest bg-forest-soft"
                    : "border-line bg-bg-elevated hover:border-ink/20",
                )}
              >
                <p className="text-sm font-medium">{r.label}</p>
                <p className="mt-1 text-xs text-muted">{r.blurb}</p>
              </button>
            ))}
          </div>

          <Field label="Your name">
            <Input value={displayName} onChange={(e) => setDisplayName(e.target.value)} required />
          </Field>
          <Field label="Home city">
            <NativeSelect value={city} onChange={(e) => setCity(e.target.value)}>
              {CITIES.map((c) => (
                <option key={c.name} value={c.name}>
                  {c.name}, {c.state}
                </option>
              ))}
            </NativeSelect>
          </Field>
          <Field label="Phone (optional)" hint="Used only for crew payouts and supplier calls.">
            <Input value={phone} onChange={(e) => setPhone(e.target.value)} inputMode="tel" />
          </Field>
          {error ? <p className="text-sm text-danger">{error}</p> : null}
          <Button type="submit" className="w-full" disabled={busy}>
            {busy ? "Saving…" : "Enter Nirmaan"}
          </Button>
        </form>
      </div>
    </main>
  );
}
