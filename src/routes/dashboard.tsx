import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { OwnerHome } from "@/components/workspace-home";

export const Route = createFileRoute("/dashboard")({
  validateSearch: (): Record<string, never> => ({}),
  component: Dashboard,
});

function Dashboard() {
  return (
    <AppShell>
      <OwnerHome title="Dashboard" />
    </AppShell>
  );
}
