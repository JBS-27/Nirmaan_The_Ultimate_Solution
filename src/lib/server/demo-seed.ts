import type { Sql } from "@/lib/db";
import { SITE_PHOTOS } from "@/lib/site-media";
import { addDays, todayISO } from "@/lib/utils";

/** Fills a freshly created project with a client-demo ledger. */
export async function seedRichSample(
  sql: Sql,
  projectId: number,
  userId: string,
  startDate: string,
) {
  const today = todayISO();
  await sql`update phases set progress = 88, status = 'done' where project_id = ${projectId} and sort_order = 0`;
  await sql`update phases set progress = 62, status = 'active' where project_id = ${projectId} and sort_order = 1`;
  await sql`update phases set progress = 28, status = 'active' where project_id = ${projectId} and sort_order = 2`;
  await sql`update phases set progress = 8, status = 'upcoming' where project_id = ${projectId} and sort_order = 3`;

  await sql`
    update materials set
      qty_ordered = qty_needed * 0.85,
      qty_received = qty_needed * 0.72,
      qty_used = qty_needed * 0.48,
      status = 'partial'
    where project_id = ${projectId} and category in ('Cement','Steel','Aggregates','Bricks')
  `;
  await sql`
    update materials set
      qty_ordered = qty_needed * 0.4,
      qty_received = qty_needed * 0.25,
      qty_used = qty_needed * 0.05,
      status = 'partial'
    where project_id = ${projectId} and category in ('Tiles','Wood','Electrical','Plumbing')
  `;

  await sql`
    insert into bills (project_id, vendor, amount, bill_date, category, notes, paid)
    values
      (${projectId}, 'Annapurna Cement Depot', 186400, ${startDate}, 'materials', 'OPC 53 — first two lots', true),
      (${projectId}, 'Steel Mart Jayanagar', 312800, ${addDays(startDate, 6)}, 'materials', 'TMT 12mm + 16mm', true),
      (${projectId}, 'Red Earth Bricks', 94800, ${addDays(startDate, 18)}, 'materials', 'Wire-cut clay, 18,000 nos', true),
      (${projectId}, 'M-sand Yard Hosur Rd', 41200, ${addDays(startDate, 21)}, 'materials', 'Washed M-sand', false),
      (${projectId}, 'Rao Electricals', 28600, ${addDays(startDate, 40)}, 'other', 'Temporary site board + lights', true),
      (${projectId}, 'Lakshmi Hardware', 17450, ${addDays(today, -3)}, 'materials', 'Cover blocks, binding wire', false)
  `;

  await sql`
    insert into payments (project_id, payee, amount, method, category, paid_at, notes)
    values
      (${projectId}, 'Annapurna Cement Depot', 186400, 'UPI', 'materials', ${addDays(startDate, 1)}, 'Paid against first lot'),
      (${projectId}, 'Steel Mart Jayanagar', 312800, 'NEFT', 'materials', ${addDays(startDate, 8)}, null)
  `;

  await sql`
    insert into workers (project_id, name, skill, daily_rate, phone, status) values
      (${projectId}, 'Nagesh', 'Mason', 1250, '98450 11001', 'active'),
      (${projectId}, 'Sita', 'Helper', 700, '98450 11002', 'active'),
      (${projectId}, 'Imran', 'Bar bender', 1150, '98450 11003', 'active'),
      (${projectId}, 'Ravi', 'Carpenter', 1100, '98450 11004', 'active'),
      (${projectId}, 'Lakshmi', 'Painter', 950, '98450 11005', 'active'),
      (${projectId}, 'Yusuf', 'Electrician', 1300, '98450 11006', 'active')
  `;

  const workers = await sql<{ id: number; name: string }>`select id, name from workers where project_id = ${projectId}`;
  for (let d = 0; d < 6; d++) {
    const day = addDays(today, -d);
    for (const w of workers) {
      const off = w.name === "Lakshmi" && d % 3 === 0;
      const sundaySkip = d === 1 && w.name === "Yusuf";
      const present = !off && !sundaySkip;
      await sql`
        insert into attendance (worker_id, project_id, work_date, present, hours, method)
        values (${w.id}, ${projectId}, ${day}, ${present}, ${present ? 8 : 0}, 'manual')
        on conflict (worker_id, work_date) do nothing
      `;
    }
  }

  const nagesh = workers.find((w) => w.name === "Nagesh");
  const sita = workers.find((w) => w.name === "Sita");
  if (nagesh) {
    await sql`
      insert into payouts (worker_id, project_id, amount, period_label, paid_at)
      values (${nagesh.id}, ${projectId}, 6250, 'Week 1', ${addDays(today, -7)})
    `;
  }
  if (sita) {
    await sql`
      insert into payouts (worker_id, project_id, amount, period_label, paid_at)
      values (${sita.id}, ${projectId}, 2800, 'Week 1', ${addDays(today, -7)})
    `;
  }

  const phases = await sql<{ id: number; sort_order: number }>`
    select id, sort_order from phases where project_id = ${projectId} order by sort_order
  `;
  const p0 = phases[0]?.id ?? null;
  const p1 = phases[1]?.id ?? null;
  const p2 = phases[2]?.id ?? null;

  await sql`
    insert into photos (project_id, phase_id, caption, image_url, annotation)
    values
      (${projectId}, ${p0}, 'Site after setting-out — Koramangala 4th Block', ${SITE_PHOTOS.hero},
        'Foundation line is clean. Keep cover blocks dry before the next pour.'),
      (${projectId}, ${p1}, 'RCC frame — first floor columns', ${SITE_PHOTOS.frame},
        'Column cages look plumb. Check lap lengths on the 16mm bars.'),
      (${projectId}, ${p1}, 'Slab pour last Thursday', ${SITE_PHOTOS.pour},
        'Concrete placed before noon. Curing ponding started the next morning.'),
      (${projectId}, ${p2}, 'Brickwork on the east wall', ${SITE_PHOTOS.brick},
        'Course height is even. Hold the west wall until the plumber marks shafts.'),
      (${projectId}, ${p0}, 'Material yard — cement and steel', ${SITE_PHOTOS.yard},
        'Cement is off the ground. Steel still needs a tarpaulin before the next rain.')
  `;

  await sql`
    insert into messages (project_id, author_id, author_name, body)
    values
      (${projectId}, ${userId}, 'You', 'Demo site is live. Walk the BOQ, mark attendance, then ask the twin how much cement is left.'),
      (${projectId}, 'engineer', 'Arjun (site)', 'Soil report attached on WhatsApp. Safe bearing is 180 kN/m² — no raft needed.')
  `;

  await sql`
    insert into change_orders (project_id, title, detail, cost_delta, days_delta, status)
    values
      (${projectId}, 'Add terrace waterproofing layer', 'After first rains, extra coat recommended on the mumty slab.', 42000, 4, 'proposed'),
      (${projectId}, 'Kitchen window shift 600mm', 'Vastu note from the family — west wall opening.', 18500, 2, 'approved')
  `;

  await sql`
    insert into daily_logs (project_id, log_date, weather, workers_count, notes, issues)
    values
      (${projectId}, ${addDays(today, -2)}, 'Clear', 6, 'Column steel for first floor complete. Cement 42 bags used.', null),
      (${projectId}, ${addDays(today, -1)}, 'Overcast', 5, 'Brickwork east wall to lintel. Electrician marked shaft.', 'Yusuf off — delayed DB box.'),
      (${projectId}, ${today}, 'Clear', 5, 'Curing ongoing. M-sand delivery expected after lunch.', null)
    on conflict (project_id, log_date) do nothing
  `;
}
