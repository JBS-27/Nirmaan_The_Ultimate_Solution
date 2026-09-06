import type { Sql } from "@/lib/db";
import { CATALOG_PROS, CATALOG_SUPPLIERS } from "@/lib/catalog";

export async function ensureCatalog(sql: Sql) {
  const rows = await sql<{ n: number }>`select count(*)::int as n from professionals`;
  if ((rows[0]?.n ?? 0) > 0) return;

  for (const p of CATALOG_PROS) {
    await sql`
      insert into professionals (
        role, name, city, specializations, rate_min, rate_max, rate_unit,
        rating, reviews, bio, licenses, languages, verified, response_hours, availability
      ) values (
        ${p.role}, ${p.name}, ${p.city}, ${p.specializations}, ${p.rateMin}, ${p.rateMax}, ${p.rateUnit},
        ${p.rating}, ${p.reviews}, ${p.bio}, ${p.licenses}, ${p.languages}, true, ${p.responseHours}, ${p.availability}
      )
    `;
  }

  for (const s of CATALOG_SUPPLIERS) {
    const inserted = await sql<{ id: number }>`
      insert into suppliers (name, city, categories, rating, reviews, delivery_days, phone, verified, address)
      values (${s.name}, ${s.city}, ${s.categories}, ${s.rating}, ${s.reviews}, ${s.deliveryDays}, ${s.phone}, true, ${s.address})
      returning id
    `;
    const sid = inserted[0]?.id;
    if (!sid) continue;
    for (const pr of s.products) {
      await sql`
        insert into products (supplier_id, name, category, unit, price, stock)
        values (${sid}, ${pr.name}, ${pr.category}, ${pr.unit}, ${pr.price}, ${pr.stock})
      `;
    }
  }
}
