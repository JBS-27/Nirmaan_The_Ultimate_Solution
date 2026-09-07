import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useCurrentUserState } from "@/lib/auth/use-current-user";

export const Route = createFileRoute("/projects")({ component: ProjectsAlias });

function ProjectsAlias() {
  const { user, isPending } = useCurrentUserState();
  if (isPending) return null;
  if (!user) return <Navigate to="/login" search={{ redirect: "/app" }} />;
  return <Navigate to="/app" />;
}
