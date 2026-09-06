import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql } from "@/lib/db";
import { num } from "@/lib/utils";
import { mapPro, mapSupplier } from "./map";
import { ensureCatalog } from "./seed";
import { requireOwnedProject } from "./access";
import type { Product, Professional, Supplier } from "@/lib/types";

export const listProfessionals = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((input: { city?: string; role?: string; q?: string } = {}) => input)
  .handler(async ({ data }): Promise<Professional[]> => {
    const sql = await getSql();
    await ensureCatalog(sql);
    let rows = await sql`select * from professionals order by rating desc, reviews desc`;
    if (data.city) rows = rows.filter((r) => String(r.city) === data.city);
    if (data.role) rows = rows.filter((r) => String(r.role) === data.role);
    if (data.q) {
      const q = data.q.toLowerCase();
      rows = rows.filter((r) =>
        `${r.name} ${r.specializations} ${r.bio} ${r.city}`.toLowerCase().includes(q),
      );
    }
    return rows.map(mapPro);
  });

export const getProfessional = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((id: number) => id)
  .handler(async ({ data: id }): Promise<Professional | null> => {
    const sql = await getSql();
    await ensureCatalog(sql);
    const [row] = await sql`select * from professionals where id = ${id}`;
    return row ? mapPro(row) : null;
  });

export const listSuppliers = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((input: { city?: string; q?: string } = {}) => input)
  .handler(async ({ data }): Promise<(Supplier & { products: Product[] })[]> => {
    const sql = await getSql();
    await ensureCatalog(sql);
    let rows = await sql`select * from suppliers order by rating desc`;
    if (data.city) rows = rows.filter((r) => String(r.city) === data.city);
    if (data.q) {
      const q = data.q.toLowerCase();
      rows = rows.filter((r) => `${r.name} ${r.categories} ${r.city}`.toLowerCase().includes(q));
    }
    const products = await sql`select * from products`;
    return rows.map((s) => {
      const supplier = mapSupplier(s);
      return {
        ...supplier,
        products: products
          .filter((p) => num(p.supplier_id) === supplier.id)
          .map((p) => ({
            id: num(p.id),
            supplierId: num(p.supplier_id),
            name: String(p.name),
            category: String(p.category),
            unit: String(p.unit),
            price: num(p.price),
            stock: String(p.stock),
          })),
      };
    });
  });

export const requestQuote = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { projectId: number; professionalId: number; message?: string }) => input)
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    await requireOwnedProject(sql, context.userId, data.projectId);
    const [pro] = await sql<{ rate_min: number; rate_max: number; name: string }>`
      select rate_min, rate_max, name from professionals where id = ${data.professionalId}
    `;
    const [proj] = await sql<{ budget: number; plot_sqft: number; name: string }>`
      select budget, plot_sqft, name from projects where id = ${data.projectId}
    `;
    if (!pro || !proj) throw new Error("Not found");
    const amount = Math.round((num(pro.rate_min) + num(pro.rate_max)) / 2);
    await sql`
      insert into quotes (project_id, owner_id, professional_id, amount, message, status)
      values (${data.projectId}, ${context.userId}, ${data.professionalId}, ${amount}, ${data.message ?? null}, 'quoted')
    `;
    await sql`
      insert into notifications (user_id, title, body, href)
      values (
        ${context.userId},
        ${"Quote in from " + pro.name},
        ${"Indicative " + amount + " — review and hire from the project."},
        ${"/app/projects/" + data.projectId + "?tab=team"}
      )
    `;
    return { amount, name: String(pro.name) };
  });

export const hireProfessional = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { projectId: number; professionalId: number }) => input)
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    await requireOwnedProject(sql, context.userId, data.projectId);
    const existing = await sql`
      select id from hires where project_id = ${data.projectId} and professional_id = ${data.professionalId}
    `;
    if (!existing[0]) {
      await sql`
        insert into hires (project_id, professional_id, status)
        values (${data.projectId}, ${data.professionalId}, 'active')
      `;
    }
    await sql`
      update quotes set status = 'accepted'
      where project_id = ${data.projectId} and professional_id = ${data.professionalId} and owner_id = ${context.userId}
    `;
    const [pro] = await sql<{ name: string; role: string }>`
      select name, role from professionals where id = ${data.professionalId}
    `;
    await sql`
      insert into messages (project_id, author_id, author_name, body)
      values (
        ${data.projectId}, ${context.userId}, 'You',
        ${"Hired " + (pro?.name ?? "professional") + " as " + (pro?.role ?? "consultant") + "."}
      )
    `;
    if (pro?.role === "worker") {
      const [exists] = await sql<{ id: number }>`
        select id from workers where project_id = ${data.projectId} and name = ${pro.name ?? ""}
      `;
      if (!exists) {
        await sql`
          insert into workers (project_id, name, skill, daily_rate, status)
          values (${data.projectId}, ${pro.name ?? "Worker"}, 'Mason', 1100, 'active')
        `;
      }
    }
    return { ok: true as const };
  });

export const matchProfessionals = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { projectId: number; role?: string }) => input)
  .handler(async ({ context, data }): Promise<(Professional & { matchScore: number; reason: string })[]> => {
    const sql = await getSql();
    await requireOwnedProject(sql, context.userId, data.projectId);
    await ensureCatalog(sql);
    const [proj] = await sql`
      select city, project_type, floors, budget, plot_sqft from projects where id = ${data.projectId}
    `;
    if (!proj) throw new Error("Not found");
    let rows = await sql`select * from professionals order by rating desc`;
    if (data.role) rows = rows.filter((r) => String(r.role) === data.role);
    const floors = num(proj.floors);
    const budget = num(proj.budget);
    const scored = rows.map((r) => {
      const pro = mapPro(r);
      let score = pro.rating * 12 + Math.min(20, pro.reviews / 4);
      const reasons: string[] = [];
      if (pro.city === String(proj.city)) {
        score += 28;
        reasons.push(`Same city (${pro.city})`);
      } else {
        score -= 8;
        reasons.push(`Travels from ${pro.city}`);
      }
      if (floors >= 3 && /RCC|structural|storey|3|4/i.test(`${pro.specializations} ${pro.bio}`)) {
        score += 16;
        reasons.push("Fits multi-storey RCC work");
      }
      if (budget > 0 && pro.rateUnit === "project" && pro.rateMax < budget * 0.12) {
        score += 10;
        reasons.push("Fee sits inside the envelope");
      }
      if (pro.availability.toLowerCase().includes("available")) {
        score += 8;
        reasons.push(pro.availability);
      }
      if (pro.verified) score += 6;
      return {
        ...pro,
        matchScore: Math.round(score),
        reason: reasons.slice(0, 3).join(" · ") || pro.specializations,
      };
    });
    return scored.sort((a, b) => b.matchScore - a.matchScore).slice(0, 5);
  });

export const placeOrder = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: {
    projectId: number;
    supplierId: number;
    productId?: number;
    itemName: string;
    qty: number;
    unitPrice: number;
  }) => input)
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    await requireOwnedProject(sql, context.userId, data.projectId);
    await sql`
      insert into orders (project_id, owner_id, supplier_id, product_id, item_name, qty, unit_price, status)
      values (
        ${data.projectId}, ${context.userId}, ${data.supplierId}, ${data.productId ?? null},
        ${data.itemName}, ${data.qty}, ${data.unitPrice}, 'placed'
      )
    `;
    await sql`
      update materials set
        qty_ordered = qty_ordered + ${data.qty},
        supplier_name = (select name from suppliers where id = ${data.supplierId}),
        status = 'partial'
      where project_id = ${data.projectId} and lower(name) like ${"%" + data.itemName.toLowerCase().split(" ")[0] + "%"}
    `;
    return { ok: true as const };
  });
