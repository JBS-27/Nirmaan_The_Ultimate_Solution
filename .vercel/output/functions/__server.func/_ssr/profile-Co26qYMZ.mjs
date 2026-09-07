import { r as createServerFn } from "./ssr.mjs";
import { r as getSql } from "./db-DTX9xmgp.mjs";
import { t as authMiddleware } from "./middleware-ClXSlXuj.mjs";
import { t as createServerRpc } from "./createServerRpc-CcvdN_gc.mjs";
import { u as mapProfile } from "./map-DKf96XZE.mjs";
import { t as ensureCatalog } from "./seed-Com99K-w.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/profile-Co26qYMZ.js
var getMyProfile_createServerFn_handler = createServerRpc({
	id: "43089abf67b0d2fc04dd8ee11c57f4f4a6f26a675e0ebab772a5634a77d97f36",
	name: "getMyProfile",
	filename: "src/lib/server/profile.ts"
}, (opts) => getMyProfile.__executeServer(opts));
var getMyProfile = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(getMyProfile_createServerFn_handler, async ({ context }) => {
	const sql = await getSql();
	await ensureCatalog(sql);
	const rows = await sql`select * from profiles where user_id = ${context.userId}`;
	let email = null;
	try {
		const { getSessionUser } = await import("./verify.server-Dmukc7D-.mjs");
		email = (await getSessionUser())?.email ?? null;
	} catch {}
	if (rows[0]) {
		if (email && !rows[0].email) {
			const updated = await sql`
          update profiles set email = ${email} where user_id = ${context.userId} returning *
        `;
			return mapProfile(updated[0]);
		}
		return mapProfile(rows[0]);
	}
	const name = email?.split("@")[0] || "Builder";
	const inserted = await sql`
      insert into profiles (user_id, display_name, email) values (${context.userId}, ${name}, ${email})
      returning *
    `;
	return mapProfile(inserted[0]);
});
var saveProfile_createServerFn_handler = createServerRpc({
	id: "854605820778abbe8f2c5b7d50045c49cbdf890eebaf119e66a983bc632fccaa",
	name: "saveProfile",
	filename: "src/lib/server/profile.ts"
}, (opts) => saveProfile.__executeServer(opts));
var saveProfile = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(saveProfile_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	const name = data.displayName.trim() || "Builder";
	let email = null;
	try {
		const { getSessionUser } = await import("./verify.server-Dmukc7D-.mjs");
		email = (await getSessionUser())?.email ?? null;
	} catch {}
	const rows = await sql`
      insert into profiles (user_id, role, display_name, email, photo_url, phone, city, bio, languages, onboarded)
      values (
        ${context.userId}, ${data.role}, ${name}, ${email}, ${data.photoUrl ?? null}, ${data.phone ?? null},
        ${data.city ?? null}, ${data.bio ?? null}, ${data.languages ?? "English, Hindi"}, true
      )
      on conflict (user_id) do update set
        role = excluded.role,
        display_name = excluded.display_name,
        email = coalesce(excluded.email, profiles.email),
        photo_url = coalesce(excluded.photo_url, profiles.photo_url),
        phone = excluded.phone,
        city = excluded.city,
        bio = excluded.bio,
        languages = excluded.languages,
        onboarded = true
      returning *
    `;
	const profile = mapProfile(rows[0]);
	await syncMarketplaceListing(sql, context.userId, profile);
	return profile;
});
async function syncMarketplaceListing(sql, userId, profile) {
	if ([
		"architect",
		"engineer",
		"contractor",
		"worker"
	].includes(profile.role)) {
		if ((await sql`select id from professionals where user_id = ${userId}`)[0]) await sql`
        update professionals set
          name = ${profile.displayName},
          city = ${profile.city ?? "Bengaluru"},
          bio = ${profile.bio ?? profile.displayName},
          languages = ${profile.languages},
          role = ${profile.role}
        where user_id = ${userId}
      `;
		else await sql`
        insert into professionals (
          user_id, role, name, city, specializations, rate_min, rate_max, rate_unit,
          rating, reviews, bio, licenses, languages, verified, response_hours, availability
        ) values (
          ${userId}, ${profile.role}, ${profile.displayName}, ${profile.city ?? "Bengaluru"},
          ${profile.role}, 800, 2500, ${profile.role === "worker" ? "day" : "project"},
          4.8, 0, ${profile.bio ?? "New on Nirmaan."}, null, ${profile.languages},
          false, 8, 'Available'
        )
      `;
	}
	if (profile.role === "supplier") {
		if ((await sql`select id from suppliers where user_id = ${userId}`)[0]) await sql`
        update suppliers set name = ${profile.displayName}, city = ${profile.city ?? "Bengaluru"}
        where user_id = ${userId}
      `;
		else await sql`
        insert into suppliers (user_id, name, city, categories, rating, reviews, delivery_days, phone, verified, address)
        values (
          ${userId}, ${profile.displayName}, ${profile.city ?? "Bengaluru"},
          'General materials', 4.6, 0, 3, ${profile.phone}, false, null
        )
      `;
	}
}
var listNotifications_createServerFn_handler = createServerRpc({
	id: "86f38247329951960eea54954c1f8a433b29652b8b4265d9284835c12dd9e899",
	name: "listNotifications",
	filename: "src/lib/server/profile.ts"
}, (opts) => listNotifications.__executeServer(opts));
var listNotifications = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listNotifications_createServerFn_handler, async ({ context }) => {
	return (await (await getSql())`
      select id, title, body, href, read, created_at
      from notifications where user_id = ${context.userId}
      order by created_at desc limit 20
    `).map((r) => ({
		id: Number(r.id),
		title: String(r.title),
		body: String(r.body),
		href: r.href ? String(r.href) : null,
		read: Boolean(r.read),
		createdAt: String(r.created_at)
	}));
});
var markNotificationsRead_createServerFn_handler = createServerRpc({
	id: "47b55f282af337a8053ad8b7a9a7c43a5a576fb942380dd3ccdfacb45eb3bbc5",
	name: "markNotificationsRead",
	filename: "src/lib/server/profile.ts"
}, (opts) => markNotificationsRead.__executeServer(opts));
var markNotificationsRead = createServerFn({ method: "POST" }).middleware([authMiddleware]).handler(markNotificationsRead_createServerFn_handler, async ({ context }) => {
	await (await getSql())`update notifications set read = true where user_id = ${context.userId}`;
	return { ok: true };
});
//#endregion
export { getMyProfile_createServerFn_handler, listNotifications_createServerFn_handler, markNotificationsRead_createServerFn_handler, saveProfile_createServerFn_handler };
