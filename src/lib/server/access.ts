import type { Sql } from "@/lib/db";

function notFound(): never {
  const err = new Error("Not found");
  (err as { status?: number }).status = 404;
  throw err;
}

export async function requireOwnedProject(sql: Sql, userId: string, projectId: number) {
  const rows = await sql<{ id: number }>`
    select id from projects where id = ${projectId} and owner_id = ${userId}
  `;
  if (!rows[0]) notFound();
}

export async function requireProjectAccess(
  sql: Sql,
  userId: string,
  projectId: number,
): Promise<"owner" | "hired" | "admin"> {
  const owned = await sql<{ id: number }>`
    select id from projects where id = ${projectId} and owner_id = ${userId}
  `;
  if (owned[0]) return "owner";

  const [profile] = await sql<{ role: string }>`
    select role from profiles where user_id = ${userId}
  `;
  if (profile?.role === "admin") return "admin";

  const hired = await sql<{ id: number }>`
    select h.id
    from hires h
    join professionals p on p.id = h.professional_id
    where h.project_id = ${projectId} and p.user_id = ${userId}
  `;
  if (hired[0]) return "hired";

  notFound();
}
