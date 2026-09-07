import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { OwnerHome } from "@/components/workspace-home";

export const Route = createFileRoute("/projects")({
  validateSearch: (): Record<string, never> => ({}),
  component: Projects,
});

function Projects() {
  return (
    <AppShell>
      <OwnerHome title="Projects" />
    </AppShell>
  );
}
