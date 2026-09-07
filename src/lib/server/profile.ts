import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql, type Sql } from "@/lib/db";
import { mapProfile } from "./map";
import { ensureCatalog } from "./seed";
import type { Profile } from "@/lib/types";

export const getMyProfile = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .handler(async ({ context }): Promise<Profile> => {
    const sql = await getSql();
    await ensureCatalog(sql);
    const rows = await sql`select * from profiles where user_id = ${context.userId}`;
    let email: string | null = null;
    try {
      const { getSessionUser } = await import("@/lib/auth/verify.server");
      const u = await getSessionUser();
      email = u?.email ?? null;
    } catch {
      /* ignore */
    }

    if (rows[0]) {
      if (email && !rows[0].email) {
        const updated = await sql`
          update profiles set email = ${email} where user_id = ${context.userId} returning *
        `;
        return mapProfile(updated[0]!);
      }
      return mapProfile(rows[0]);
    }

    const name = email?.split("@")[0] || "Builder";
    return {
      userId: context.userId,
      role: "owner",
      displayName: name,
      email,
      photoUrl: null,
      phone: null,
      city: null,
      bio: null,
      languages: "English, Hindi",
      onboarded: false,
    };
  });

export const saveProfile = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: {
    role: string;
    displayName: string;
    phone?: string;
    city?: string;
    bio?: string;
    languages?: string;
    photoUrl?: string;
  }) => input)
  .handler(async ({ context, data }): Promise<Profile> => {
    const sql = await getSql();
    const name = (data.displayName ?? "").trim() || "Builder";
    let email: string | null = null;
    try {
      const { getSessionUser } = await import("@/lib/auth/verify.server");
      const u = await getSessionUser();
      email = u?.email ?? null;
    } catch {
      /* ignore */
    }
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
    const profile = mapProfile(rows[0]!);
    try {
      await syncMarketplaceListing(sql, context.userId, profile);
    } catch {
      /* profile is saved; marketplace listing can catch up later */
    }
    return profile;
  });

async function syncMarketplaceListing(sql: Sql, userId: string, profile: Profile) {
  if (["architect", "engineer", "contractor", "worker"].includes(profile.role)) {
    const existing = await sql`select id from professionals where user_id = ${userId}`;
    if (existing[0]) {
      await sql`
        update professionals set
          name = ${profile.displayName},
          city = ${profile.city ?? "Bengaluru"},
          bio = ${profile.bio ?? profile.displayName},
          languages = ${profile.languages},
          role = ${profile.role}
        where user_id = ${userId}
      `;
    } else {
      await sql`
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
  }
  if (profile.role === "supplier") {
    const existing = await sql`select id from suppliers where user_id = ${userId}`;
    if (existing[0]) {
      await sql`
        update suppliers set name = ${profile.displayName}, city = ${profile.city ?? "Bengaluru"}
        where user_id = ${userId}
      `;
    } else {
      await sql`
        insert into suppliers (user_id, name, city, categories, rating, reviews, delivery_days, phone, verified, address)
        values (
          ${userId}, ${profile.displayName}, ${profile.city ?? "Bengaluru"},
          'General materials', 4.6, 0, 3, ${profile.phone}, false, null
        )
      `;
    }
  }
}

export const listNotifications = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    const rows = await sql`
      select id, title, body, href, read, created_at
      from notifications where user_id = ${context.userId}
      order by created_at desc limit 20
    `;
    return rows.map((r) => ({
      id: Number(r.id),
      title: String(r.title),
      body: String(r.body),
      href: r.href ? String(r.href) : null,
      read: Boolean(r.read),
      createdAt: String(r.created_at),
    }));
  });

export const markNotificationsRead = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    await sql`update notifications set read = true where user_id = ${context.userId}`;
    return { ok: true as const };
  });
