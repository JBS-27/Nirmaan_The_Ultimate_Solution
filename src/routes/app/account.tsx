import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { UserButton } from "@/lib/auth/gates";
import { useCurrentUser } from "@/lib/auth/use-current-user";
import { PageHeader } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, NativeSelect } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CITIES, ROLES } from "@/lib/constants";
import { getMyProfile, saveProfile } from "@/lib/server/profile";
import { useAsync } from "@/lib/use-async";

export const Route = createFileRoute("/app/account")({ component: Account });

function Account() {
  const user = useCurrentUser();
  const q = useAsync(() => getMyProfile(), []);
  const p = q.data;
  const [displayName, setDisplayName] = useState("");
  const [role, setRole] = useState("owner");
  const [city, setCity] = useState("Bengaluru");
  const [phone, setPhone] = useState("");
  const [bio, setBio] = useState("");
  const [languages, setLanguages] = useState("English, Hindi");

  useEffect(() => {
    if (!p) return;
    setDisplayName(p.displayName);
    setRole(p.role);
    setCity(p.city ?? "Bengaluru");
    setPhone(p.phone ?? "");
    setBio(p.bio ?? "");
    setLanguages(p.languages);
  }, [p]);

  return (
    <div>
      <PageHeader
        kicker="Account"
        title="Your profile"
        description="Role and city shape marketplace matches. Projects you own stay with this sign-in."
        action={<UserButton />}
      />
      <Card className="max-w-lg p-5">
        <p className="text-sm text-muted">{user?.primaryEmail ?? "Signed in"}</p>
        <form
          className="mt-4 space-y-3"
          onSubmit={async (e) => {
            e.preventDefault();
            await saveProfile({
              data: { displayName, role, city, phone: phone || undefined, bio: bio || undefined, languages },
            });
            toast.success("Profile saved");
            q.reload();
          }}
        >
          <Field label="Name">
            <Input value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
          </Field>
          <Field label="Role">
            <NativeSelect value={role} onChange={(e) => setRole(e.target.value)}>
              {ROLES.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.label}
                </option>
              ))}
            </NativeSelect>
          </Field>
          <Field label="City">
            <NativeSelect value={city} onChange={(e) => setCity(e.target.value)}>
              {CITIES.map((c) => (
                <option key={c.name} value={c.name}>
                  {c.name}
                </option>
              ))}
            </NativeSelect>
          </Field>
          <Field label="Phone">
            <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
          </Field>
          <Field label="Languages">
            <Input value={languages} onChange={(e) => setLanguages(e.target.value)} />
          </Field>
          <Field label="Bio">
            <Textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={3} />
          </Field>
          <Button type="submit">Save</Button>
        </form>
      </Card>
    </div>
  );
}
