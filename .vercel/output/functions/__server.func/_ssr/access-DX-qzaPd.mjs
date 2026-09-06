//#region node_modules/.nitro/vite/services/ssr/assets/access-DX-qzaPd.js
function notFound() {
	const err = /* @__PURE__ */ new Error("Not found");
	err.status = 404;
	throw err;
}
async function requireOwnedProject(sql, userId, projectId) {
	if (!(await sql`
    select id from projects where id = ${projectId} and owner_id = ${userId}
  `)[0]) notFound();
}
async function requireProjectAccess(sql, userId, projectId) {
	if ((await sql`
    select id from projects where id = ${projectId} and owner_id = ${userId}
  `)[0]) return "owner";
	const [profile] = await sql`
    select role from profiles where user_id = ${userId}
  `;
	if (profile?.role === "admin") return "admin";
	if ((await sql`
    select h.id
    from hires h
    join professionals p on p.id = h.professional_id
    where h.project_id = ${projectId} and p.user_id = ${userId}
  `)[0]) return "hired";
	notFound();
}
//#endregion
export { requireProjectAccess as n, requireOwnedProject as t };
