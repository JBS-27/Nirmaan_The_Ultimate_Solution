import { createServerFn } from "@tanstack/react-start";
import { answerFromLedger, type LedgerFacts } from "@/lib/assistant-ledger";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql } from "@/lib/db";
import { requireProjectAccess } from "./access";
import { money, qty } from "@/lib/format";
import { num, todayISO } from "@/lib/utils";

type ChatTurn = { role: "system" | "user" | "assistant"; content: unknown };

async function postChat(
  url: string,
  apiKey: string,
  body: Record<string, unknown>,
): Promise<{ ok: true; text: string } | { ok: false; error: string }> {
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) return { ok: false, error: `LLM error ${res.status}` };
  const json = (await res.json()) as { choices?: { message?: { content?: string } }[] };
  const text = json.choices?.[0]?.message?.content ?? "";
  return text ? { ok: true, text } : { ok: false, error: "Empty model reply" };
}

async function grokChat(
  messages: ChatTurn[],
  maxTokens = 700,
): Promise<{ ok: true; text: string } | { ok: false; error: string }> {
  const xai = process.env.XAI_API_KEY?.trim();
  const openai = process.env.OPENAI_API_KEY?.trim();
  const gemini = process.env.GEMINI_API_KEY?.trim() || process.env.GOOGLE_GENERATIVE_AI_API_KEY?.trim();

  if (xai) {
    const r = await postChat("https://api.x.ai/v1/chat/completions", xai, {
      model: "grok-4.5",
      messages,
      max_tokens: maxTokens,
      temperature: 0.4,
    });
    if (r.ok) return r;
  }
  if (openai) {
    const r = await postChat("https://api.openai.com/v1/chat/completions", openai, {
      model: "gpt-4o-mini",
      messages,
      max_tokens: maxTokens,
      temperature: 0.4,
    });
    if (r.ok) return r;
  }
  if (gemini) {
    const r = await postChat(
      "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions",
      gemini,
      {
        model: "gemini-2.0-flash",
        messages,
        max_tokens: maxTokens,
        temperature: 0.4,
      },
    );
    if (r.ok) return r;
  }
  return { ok: false, error: "AI is not available in this environment" };
}

async function loadLedger(projectId: number, userId: string): Promise<{ brief: string; facts: LedgerFacts }> {
  const sql = await getSql();
  await requireProjectAccess(sql, userId, projectId);
  const [p] = await sql`
    select name, city, project_type, plot_sqft, floors, budget, start_date, target_date, status
    from projects where id = ${projectId}
  `;
  const phases = await sql`select name, status, progress, estimated_cost, end_date from phases where project_id = ${projectId} order by sort_order`;
  const mats = await sql`select name, category, unit, qty_needed, qty_received, qty_used, unit_price from materials where project_id = ${projectId}`;
  const bills = await sql`select vendor, amount, paid, category from bills where project_id = ${projectId}`;
  const workers = await sql`select id, name, skill, daily_rate from workers where project_id = ${projectId}`;
  const attendance = await sql`select worker_id, present, work_date from attendance where project_id = ${projectId}`;
  const payouts = await sql`select worker_id, amount from payouts where project_id = ${projectId}`;
  const pays = await sql<{ s: number }>`select coalesce(sum(amount),0)::float8 as s from payments where project_id = ${projectId}`;
  const spentBills = bills.filter((b) => b.paid).reduce((s, b) => s + num(b.amount), 0);
  const payoutSum = payouts.reduce((s, x) => s + num(x.amount), 0);
  const spent = spentBills + num(pays[0]?.s) + payoutSum;
  const budget = num(p?.budget);
  const today = todayISO();
  const presentToday = attendance.filter((a) => String(a.work_date).slice(0, 10) === today && a.present).length;
  const workerFacts = workers.map((w) => {
    const days = attendance.filter((a) => num(a.worker_id) === num(w.id) && a.present).length;
    const paid = payouts.filter((x) => num(x.worker_id) === num(w.id)).reduce((s, x) => s + num(x.amount), 0);
    return {
      name: String(w.name),
      skill: String(w.skill),
      dailyRate: num(w.daily_rate),
      daysPresent: days,
      pending: Math.max(0, days * num(w.daily_rate) - paid),
    };
  });
  const phaseFacts = phases.map((ph) => ({
    name: String(ph.name),
    progress: num(ph.progress),
    status: String(ph.status),
    estimatedCost: num(ph.estimated_cost),
  }));
  const w = phaseFacts.reduce((s, x) => s + x.estimatedCost, 0) || 1;
  const progress = Math.round(phaseFacts.reduce((s, x) => s + x.progress * x.estimatedCost, 0) / w);
  const remainingMats = mats.map((m) => {
    const left = Math.max(0, num(m.qty_needed) - num(m.qty_used));
    return `${m.name}: ${qty(left, String(m.unit))} left (need ${qty(num(m.qty_needed), String(m.unit))}, received ${qty(num(m.qty_received), String(m.unit))}, @ ${money(num(m.unit_price))})`;
  });
  const facts: LedgerFacts = {
    name: String(p?.name ?? "Project"),
    city: String(p?.city ?? ""),
    budget,
    spent,
    remaining: budget - spent,
    progress,
    phases: phaseFacts,
    materials: mats.map((m) => ({
      name: String(m.name),
      category: String(m.category),
      unit: String(m.unit),
      qtyNeeded: num(m.qty_needed),
      qtyReceived: num(m.qty_received),
      qtyUsed: num(m.qty_used),
      unitPrice: num(m.unit_price),
    })),
    workers: workerFacts,
    bills: bills.map((b) => ({
      vendor: String(b.vendor),
      amount: num(b.amount),
      paid: Boolean(b.paid),
      category: String(b.category),
    })),
    presentToday,
  };
  const brief = [
    `Project ${p?.name} in ${p?.city}, type ${p?.project_type}, ${p?.plot_sqft} sqft plot, ${p?.floors} floors.`,
    `Budget ${money(budget)}. Spent ${money(spent)}. Remaining ${money(budget - spent)}. Window ${p?.start_date} → ${p?.target_date}. Status ${p?.status}.`,
    "Phases: " + phases.map((ph) => `${ph.name} ${ph.progress}% (${ph.status}, est ${money(num(ph.estimated_cost))}, due ${ph.end_date})`).join("; "),
    "Materials: " + remainingMats.join(" | "),
    "Crew: " + workerFacts.map((wkr) => `${wkr.name} ${wkr.skill} ${money(wkr.dailyRate)}/day, ${wkr.daysPresent} days, pending ${money(wkr.pending)}`).join("; "),
    "Bills: " + bills.map((b) => `${b.vendor} ${money(num(b.amount))} ${b.paid ? "paid" : "unpaid"} (${b.category})`).join("; "),
  ].join("\n");
  return { brief, facts };
}

async function projectBrief(projectId: number, userId: string): Promise<string> {
  const { brief } = await loadLedger(projectId, userId);
  return brief;
}

export const askAssistant = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { projectId?: number; prompt: string }) => input)
  .handler(async ({ context, data }) => {
    const prompt = data.prompt.trim();
    if (!prompt) return { ok: false as const, error: "Ask a question first." };
    const sql = await getSql();
    let brief = "The user has not opened a specific project.";
    let facts: LedgerFacts | null = null;
    if (data.projectId) {
      try {
        const loaded = await loadLedger(data.projectId, context.userId);
        brief = loaded.brief;
        facts = loaded.facts;
      } catch {
        brief = "Project context unavailable.";
      }
    }
    await sql`
      insert into ai_messages (user_id, project_id, role, content)
      values (${context.userId}, ${data.projectId ?? null}, 'user', ${prompt})
    `;
    const result = await grokChat(
      [
        {
          role: "system",
          content:
            "You are Nirmaan, a construction project copilot for homeowners and small builders in India. Be concrete, use INR, cite quantities from the project brief, and never invent invoices. If data is missing, say so and suggest the next site action. Keep answers under 220 words. Prefer bullet points. Units: bags, kg, sqft, tons. Languages: reply in the user's language.",
        },
        { role: "user", content: `PROJECT BRIEF\n${brief}\n\nQUESTION\n${prompt}` },
      ],
      700,
    );
    if (!result.ok) {
      const fallback = facts
        ? answerFromLedger(prompt, facts)
        : "I can't reach the model right now. Open a project in the picker so I can read the BOQ, bills and crew — or re-ask in a moment.";
      await sql`
        insert into ai_messages (user_id, project_id, role, content)
        values (${context.userId}, ${data.projectId ?? null}, 'assistant', ${fallback})
      `;
      return { ok: true as const, text: fallback, degraded: true as const };
    }
    await sql`
      insert into ai_messages (user_id, project_id, role, content)
      values (${context.userId}, ${data.projectId ?? null}, 'assistant', ${result.text})
    `;
    return { ok: true as const, text: result.text, degraded: false as const };
  });

export const listAiMessages = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { projectId?: number } = {}) => input)
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const rows = data.projectId
      ? await sql`
          select id, role, content, created_at from ai_messages
          where user_id = ${context.userId} and project_id = ${data.projectId}
          order by created_at asc limit 40
        `
      : await sql`
          select id, role, content, created_at from ai_messages
          where user_id = ${context.userId} and project_id is null
          order by created_at asc limit 40
        `;
    return rows.map((r) => ({
      id: num(r.id),
      role: String(r.role) as "user" | "assistant",
      content: String(r.content),
      createdAt: String(r.created_at),
    }));
  });

export const parseBillOcr = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { imageDataUrl: string }) => input)
  .handler(async ({ data }) => {
    const result = await grokChat(
      [
        {
          role: "system",
          content:
            'Extract a construction bill/invoice. Return ONLY compact JSON: {"vendor":string,"amount":number,"date":"YYYY-MM-DD"|null,"category":"materials"|"labor"|"professional"|"equipment"|"permits"|"transport"|"other","items":string,"notes":string}',
        },
        {
          role: "user",
          content: [
            { type: "text", text: "Read this bill photo and extract the fields." },
            { type: "image_url", image_url: { url: data.imageDataUrl } },
          ],
        },
      ],
      400,
    );
    if (!result.ok) return { ok: false as const, error: result.error };
    const match = result.text.match(/\{[\s\S]*\}/);
    if (!match) return { ok: false as const, error: "Could not read that bill." };
    try {
      const parsed = JSON.parse(match[0]) as {
        vendor?: string;
        amount?: number;
        date?: string | null;
        category?: string;
        items?: string;
        notes?: string;
      };
      return {
        ok: true as const,
        vendor: parsed.vendor ?? "Unknown vendor",
        amount: Number(parsed.amount) || 0,
        date: parsed.date ?? null,
        category: parsed.category ?? "materials",
        notes: parsed.items || parsed.notes || result.text,
      };
    } catch {
      return { ok: false as const, error: "Could not parse the bill." };
    }
  });

export const annotatePhoto = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { caption?: string }) => input)
  .handler(async ({ data }) => {
    const result = await grokChat(
      [
        {
          role: "system",
          content:
            "You are a site engineer writing a one-sentence progress annotation for a homeowner. No fluff.",
        },
        {
          role: "user",
          content: `Caption: ${data.caption || "Site photo"}. Write one concrete observation and one next action.`,
        },
      ],
      120,
    );
    if (!result.ok) {
      return {
        ok: true as const,
        text: data.caption
          ? `${data.caption}. Log quantities used today against the BOQ.`
          : "Progress logged. Match this photo to the active phase and update % complete.",
      };
    }
    return { ok: true as const, text: result.text };
  });

export const extractPlanQuantities = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { imageDataUrl: string; city?: string }) => input)
  .handler(async ({ data }) => {
    const result = await grokChat(
      [
        {
          role: "system",
          content:
            'Read a residential plan or site photo. Return ONLY JSON: {"rooms":[{"name":string,"lengthFt":number,"widthFt":number,"heightFt":number}],"notes":string}',
        },
        {
          role: "user",
          content: [
            { type: "text", text: "Extract room names and approximate feet dimensions." },
            { type: "image_url", image_url: { url: data.imageDataUrl } },
          ],
        },
      ],
      500,
    );
    if (!result.ok) return { ok: false as const, error: result.error };
    const match = result.text.match(/\{[\s\S]*\}/);
    if (!match) return { ok: false as const, error: "Could not read that plan." };
    try {
      const parsed = JSON.parse(match[0]) as {
        rooms?: { name?: string; lengthFt?: number; widthFt?: number; heightFt?: number }[];
        notes?: string;
      };
      const rooms = (parsed.rooms ?? [])
        .map((r) => ({
          name: r.name || "Room",
          lengthFt: Number(r.lengthFt) || 0,
          widthFt: Number(r.widthFt) || 0,
          heightFt: Number(r.heightFt) || 10,
        }))
        .filter((r) => r.lengthFt > 0 && r.widthFt > 0);
      return { ok: true as const, rooms, notes: parsed.notes ?? "" };
    } catch {
      return { ok: false as const, error: "Could not parse the plan." };
    }
  });

export const optimizeSchedule = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { projectId: number }) => input)
  .handler(async ({ context, data }) => {
    let brief = "";
    try {
      brief = await projectBrief(data.projectId, context.userId);
    } catch {
      return { ok: false as const, error: "Project not available." };
    }
    const result = await grokChat(
      [
        {
          role: "system",
          content:
            "You are a site planner for Indian residential builds. Given the brief, list 4 concrete re-sequence or delay-risk actions. Mention monsoon, lead times and labour. Under 160 words. Bullets only.",
        },
        { role: "user", content: brief },
      ],
      400,
    );
    if (!result.ok) {
      return {
        ok: true as const,
        text: "• Lock cement and steel before the next pour.\n• Do not start plaster until MEP first-fix is signed.\n• If monsoon is inside the window, pull waterproofing forward.\n• Keep one mason gang on brickwork while bar-benders finish the next slab.",
      };
    }
    return { ok: true as const, text: result.text };
  });
