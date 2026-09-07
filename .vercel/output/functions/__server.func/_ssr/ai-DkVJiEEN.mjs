import { r as createServerFn } from "./ssr.mjs";
import { r as getSql } from "./db-DTX9xmgp.mjs";
import { t as authMiddleware } from "./middleware-ClXSlXuj.mjs";
import { c as todayISO, s as num } from "./utils-Dhq_xXK2.mjs";
import { i as money, o as qty } from "./format-sbvqgmOQ.mjs";
import { t as createServerRpc } from "./createServerRpc-CcvdN_gc.mjs";
import { n as requireProjectAccess } from "./access-DX-qzaPd.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ai-DkVJiEEN.js
function leftover(m) {
	return Math.max(0, m.qtyNeeded - m.qtyUsed);
}
function matchMaterials(facts, needle) {
	const n = needle.toLowerCase();
	return facts.materials.filter((m) => `${m.name} ${m.category}`.toLowerCase().includes(n));
}
/** Answers site questions from the project ledger when the model is unavailable. */
function answerFromLedger(prompt, facts) {
	const q = prompt.toLowerCase();
	const lines = [];
	const cement = matchMaterials(facts, "cement");
	const steel = matchMaterials(facts, "steel").concat(matchMaterials(facts, "tmt"));
	const brick = matchMaterials(facts, "brick");
	if (/cement|opc|ppc/.test(q) && cement.length) for (const m of cement) lines.push(`${m.name}: ${qty(leftover(m), m.unit)} still needed after use, ${qty(m.qtyReceived, m.unit)} received of ${qty(m.qtyNeeded, m.unit)} @ ${money(m.unitPrice)}.`);
	if (/steel|tmt|rebar|bar/.test(q) && steel.length) for (const m of steel) lines.push(`${m.name}: ${qty(leftover(m), m.unit)} left to use, ${qty(m.qtyReceived, m.unit)} received of ${qty(m.qtyNeeded, m.unit)}.`);
	if (/brick|block|masonry/.test(q) && brick.length) for (const m of brick) lines.push(`${m.name}: ${qty(leftover(m), m.unit)} remaining of ${qty(m.qtyNeeded, m.unit)} needed.`);
	if (/budget|envelope|spent|overrun|money|cash|rupee|₹/.test(q)) {
		const used = facts.budget > 0 ? Math.round(facts.spent / facts.budget * 100) : 0;
		lines.push(`${facts.name} envelope is ${money(facts.budget)}. Spent ${money(facts.spent)} (${used}%). Remaining ${money(facts.remaining)}${facts.remaining < 0 ? " — over envelope." : "."}`);
		const unpaid = facts.bills.filter((b) => !b.paid);
		if (unpaid.length) {
			const sum = unpaid.reduce((s, b) => s + b.amount, 0);
			lines.push(`${unpaid.length} unpaid bill${unpaid.length > 1 ? "s" : ""} totalling ${money(sum)}.`);
		}
	}
	if (/progress|phase|complete|behind|schedule|handover/.test(q)) {
		lines.push(`Overall progress ${facts.progress}%.`);
		const behind = facts.phases.filter((p) => p.status !== "done" && p.progress < 100);
		for (const p of facts.phases) lines.push(`• ${p.name}: ${p.progress}% (${p.status}, est ${money(p.estimatedCost)})`);
		if (behind[0]) lines.push(`Next focus: ${behind[0].name}.`);
	}
	if (/crew|worker|attendance|present|wage|payout|mason|labour|labor/.test(q)) {
		if (!facts.workers.length) lines.push("No crew on the books yet. Add workers on the Crew tab.");
		else {
			lines.push(`${facts.presentToday} marked present today. ${facts.workers.length} people on the books.`);
			for (const w of facts.workers) lines.push(`• ${w.name} (${w.skill}): ${w.daysPresent} days @ ${money(w.dailyRate)}, pending ${money(w.pending)}.`);
		}
	}
	if (/bill|invoice|vendor|receipt/.test(q) && facts.bills.length) for (const b of facts.bills.slice(0, 6)) lines.push(`• ${b.vendor} ${money(b.amount)} — ${b.paid ? "paid" : "unpaid"} (${b.category})`);
	if (/left|remaining|need|how much|summary|today|status/.test(q) && lines.length === 0) {
		const top = facts.materials.map((m) => ({
			m,
			left: leftover(m)
		})).filter((x) => x.left > 0).slice(0, 6);
		lines.push(`${facts.name} in ${facts.city} is ${facts.progress}% complete. Envelope left ${money(facts.remaining)}.`);
		if (top.length) {
			lines.push("Materials still needed:");
			for (const { m, left } of top) lines.push(`• ${m.name}: ${qty(left, m.unit)}`);
		}
	}
	if (!lines.length) return [
		`${facts.name} (${facts.city}): ${facts.progress}% complete.`,
		`Budget ${money(facts.budget)} · spent ${money(facts.spent)} · left ${money(facts.remaining)}.`,
		`Crew: ${facts.workers.length} · present today ${facts.presentToday}.`,
		`Ask about cement, steel, budget, a phase, or who is on site.`
	].join("\n");
	return lines.join("\n");
}
async function grokChat(messages, maxTokens = 700) {
	const apiKey = process.env.XAI_API_KEY;
	if (!apiKey) return {
		ok: false,
		error: "AI is not available in this environment"
	};
	const res = await fetch("https://api.x.ai/v1/chat/completions", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${apiKey}`
		},
		body: JSON.stringify({
			model: "grok-4.5",
			messages,
			max_tokens: maxTokens,
			temperature: .4
		})
	});
	if (!res.ok) return {
		ok: false,
		error: `xAI API error ${res.status}`
	};
	return {
		ok: true,
		text: (await res.json()).choices?.[0]?.message?.content ?? ""
	};
}
async function loadLedger(projectId, userId) {
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
	const pays = await sql`select coalesce(sum(amount),0)::float8 as s from payments where project_id = ${projectId}`;
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
			pending: Math.max(0, days * num(w.daily_rate) - paid)
		};
	});
	const phaseFacts = phases.map((ph) => ({
		name: String(ph.name),
		progress: num(ph.progress),
		status: String(ph.status),
		estimatedCost: num(ph.estimated_cost)
	}));
	const w = phaseFacts.reduce((s, x) => s + x.estimatedCost, 0) || 1;
	const progress = Math.round(phaseFacts.reduce((s, x) => s + x.progress * x.estimatedCost, 0) / w);
	const remainingMats = mats.map((m) => {
		const left = Math.max(0, num(m.qty_needed) - num(m.qty_used));
		return `${m.name}: ${qty(left, String(m.unit))} left (need ${qty(num(m.qty_needed), String(m.unit))}, received ${qty(num(m.qty_received), String(m.unit))}, @ ${money(num(m.unit_price))})`;
	});
	const facts = {
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
			unitPrice: num(m.unit_price)
		})),
		workers: workerFacts,
		bills: bills.map((b) => ({
			vendor: String(b.vendor),
			amount: num(b.amount),
			paid: Boolean(b.paid),
			category: String(b.category)
		})),
		presentToday
	};
	return {
		brief: [
			`Project ${p?.name} in ${p?.city}, type ${p?.project_type}, ${p?.plot_sqft} sqft plot, ${p?.floors} floors.`,
			`Budget ${money(budget)}. Spent ${money(spent)}. Remaining ${money(budget - spent)}. Window ${p?.start_date} → ${p?.target_date}. Status ${p?.status}.`,
			"Phases: " + phases.map((ph) => `${ph.name} ${ph.progress}% (${ph.status}, est ${money(num(ph.estimated_cost))}, due ${ph.end_date})`).join("; "),
			"Materials: " + remainingMats.join(" | "),
			"Crew: " + workerFacts.map((wkr) => `${wkr.name} ${wkr.skill} ${money(wkr.dailyRate)}/day, ${wkr.daysPresent} days, pending ${money(wkr.pending)}`).join("; "),
			"Bills: " + bills.map((b) => `${b.vendor} ${money(num(b.amount))} ${b.paid ? "paid" : "unpaid"} (${b.category})`).join("; ")
		].join("\n"),
		facts
	};
}
async function projectBrief(projectId, userId) {
	const { brief } = await loadLedger(projectId, userId);
	return brief;
}
var askAssistant_createServerFn_handler = createServerRpc({
	id: "8588707f9edacd23d5b70905cf6dfa3e4d91ffbf23f534c51c874f891e550260",
	name: "askAssistant",
	filename: "src/lib/server/ai.ts"
}, (opts) => askAssistant.__executeServer(opts));
var askAssistant = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(askAssistant_createServerFn_handler, async ({ context, data }) => {
	const prompt = data.prompt.trim();
	if (!prompt) return {
		ok: false,
		error: "Ask a question first."
	};
	const sql = await getSql();
	let brief = "The user has not opened a specific project.";
	let facts = null;
	if (data.projectId) try {
		const loaded = await loadLedger(data.projectId, context.userId);
		brief = loaded.brief;
		facts = loaded.facts;
	} catch {
		brief = "Project context unavailable.";
	}
	await sql`
      insert into ai_messages (user_id, project_id, role, content)
      values (${context.userId}, ${data.projectId ?? null}, 'user', ${prompt})
    `;
	const result = await grokChat([{
		role: "system",
		content: "You are Nirmaan, a construction project copilot for homeowners and small builders in India. Be concrete, use INR, cite quantities from the project brief, and never invent invoices. If data is missing, say so and suggest the next site action. Keep answers under 220 words. Prefer bullet points. Units: bags, kg, sqft, tons. Languages: reply in the user's language."
	}, {
		role: "user",
		content: `PROJECT BRIEF\n${brief}\n\nQUESTION\n${prompt}`
	}], 700);
	if (!result.ok) {
		const fallback = facts ? answerFromLedger(prompt, facts) : "I can't reach the model right now. Open a project in the picker so I can read the BOQ, bills and crew — or re-ask in a moment.";
		await sql`
        insert into ai_messages (user_id, project_id, role, content)
        values (${context.userId}, ${data.projectId ?? null}, 'assistant', ${fallback})
      `;
		return {
			ok: true,
			text: fallback,
			degraded: true
		};
	}
	await sql`
      insert into ai_messages (user_id, project_id, role, content)
      values (${context.userId}, ${data.projectId ?? null}, 'assistant', ${result.text})
    `;
	return {
		ok: true,
		text: result.text,
		degraded: false
	};
});
var listAiMessages_createServerFn_handler = createServerRpc({
	id: "96608e3a59ad2ed5b9cc6cb2411efdd4e2385d207d2ee88fbf14cc4a9c6f6ca9",
	name: "listAiMessages",
	filename: "src/lib/server/ai.ts"
}, (opts) => listAiMessages.__executeServer(opts));
var listAiMessages = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((input = {}) => input).handler(listAiMessages_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	return (data.projectId ? await sql`
          select id, role, content, created_at from ai_messages
          where user_id = ${context.userId} and project_id = ${data.projectId}
          order by created_at asc limit 40
        ` : await sql`
          select id, role, content, created_at from ai_messages
          where user_id = ${context.userId} and project_id is null
          order by created_at asc limit 40
        `).map((r) => ({
		id: num(r.id),
		role: String(r.role),
		content: String(r.content),
		createdAt: String(r.created_at)
	}));
});
var parseBillOcr_createServerFn_handler = createServerRpc({
	id: "17e1ada9a07f871faac4a486cd96bd5ea39000843cfb480a6f55a00c054990ff",
	name: "parseBillOcr",
	filename: "src/lib/server/ai.ts"
}, (opts) => parseBillOcr.__executeServer(opts));
var parseBillOcr = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(parseBillOcr_createServerFn_handler, async ({ data }) => {
	const result = await grokChat([{
		role: "system",
		content: "Extract a construction bill/invoice. Return ONLY compact JSON: {\"vendor\":string,\"amount\":number,\"date\":\"YYYY-MM-DD\"|null,\"category\":\"materials\"|\"labor\"|\"professional\"|\"equipment\"|\"permits\"|\"transport\"|\"other\",\"items\":string,\"notes\":string}"
	}, {
		role: "user",
		content: [{
			type: "text",
			text: "Read this bill photo and extract the fields."
		}, {
			type: "image_url",
			image_url: { url: data.imageDataUrl }
		}]
	}], 400);
	if (!result.ok) return {
		ok: false,
		error: result.error
	};
	const match = result.text.match(/\{[\s\S]*\}/);
	if (!match) return {
		ok: false,
		error: "Could not read that bill."
	};
	try {
		const parsed = JSON.parse(match[0]);
		return {
			ok: true,
			vendor: parsed.vendor ?? "Unknown vendor",
			amount: Number(parsed.amount) || 0,
			date: parsed.date ?? null,
			category: parsed.category ?? "materials",
			notes: parsed.items || parsed.notes || result.text
		};
	} catch {
		return {
			ok: false,
			error: "Could not parse the bill."
		};
	}
});
var annotatePhoto_createServerFn_handler = createServerRpc({
	id: "0399bdf8837e81b9c25f16c497ab642f0df4a787e0e5ddb496e440da1838ccc3",
	name: "annotatePhoto",
	filename: "src/lib/server/ai.ts"
}, (opts) => annotatePhoto.__executeServer(opts));
var annotatePhoto = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(annotatePhoto_createServerFn_handler, async ({ data }) => {
	const result = await grokChat([{
		role: "system",
		content: "You are a site engineer writing a one-sentence progress annotation for a homeowner. No fluff."
	}, {
		role: "user",
		content: `Caption: ${data.caption || "Site photo"}. Write one concrete observation and one next action.`
	}], 120);
	if (!result.ok) return {
		ok: true,
		text: data.caption ? `${data.caption}. Log quantities used today against the BOQ.` : "Progress logged. Match this photo to the active phase and update % complete."
	};
	return {
		ok: true,
		text: result.text
	};
});
var extractPlanQuantities_createServerFn_handler = createServerRpc({
	id: "5e27f30e9c9e20d659ffcad35fbee2491cbefdf859a2579a5e3ae9b66da5039c",
	name: "extractPlanQuantities",
	filename: "src/lib/server/ai.ts"
}, (opts) => extractPlanQuantities.__executeServer(opts));
var extractPlanQuantities = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(extractPlanQuantities_createServerFn_handler, async ({ data }) => {
	const result = await grokChat([{
		role: "system",
		content: "Read a residential plan or site photo. Return ONLY JSON: {\"rooms\":[{\"name\":string,\"lengthFt\":number,\"widthFt\":number,\"heightFt\":number}],\"notes\":string}"
	}, {
		role: "user",
		content: [{
			type: "text",
			text: "Extract room names and approximate feet dimensions."
		}, {
			type: "image_url",
			image_url: { url: data.imageDataUrl }
		}]
	}], 500);
	if (!result.ok) return {
		ok: false,
		error: result.error
	};
	const match = result.text.match(/\{[\s\S]*\}/);
	if (!match) return {
		ok: false,
		error: "Could not read that plan."
	};
	try {
		const parsed = JSON.parse(match[0]);
		return {
			ok: true,
			rooms: (parsed.rooms ?? []).map((r) => ({
				name: r.name || "Room",
				lengthFt: Number(r.lengthFt) || 0,
				widthFt: Number(r.widthFt) || 0,
				heightFt: Number(r.heightFt) || 10
			})).filter((r) => r.lengthFt > 0 && r.widthFt > 0),
			notes: parsed.notes ?? ""
		};
	} catch {
		return {
			ok: false,
			error: "Could not parse the plan."
		};
	}
});
var optimizeSchedule_createServerFn_handler = createServerRpc({
	id: "9c9a6f1b154e71ef90596c4ff21b37d4e2304a37d7a7f92ede28578d103b4de3",
	name: "optimizeSchedule",
	filename: "src/lib/server/ai.ts"
}, (opts) => optimizeSchedule.__executeServer(opts));
var optimizeSchedule = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(optimizeSchedule_createServerFn_handler, async ({ context, data }) => {
	let brief = "";
	try {
		brief = await projectBrief(data.projectId, context.userId);
	} catch {
		return {
			ok: false,
			error: "Project not available."
		};
	}
	const result = await grokChat([{
		role: "system",
		content: "You are a site planner for Indian residential builds. Given the brief, list 4 concrete re-sequence or delay-risk actions. Mention monsoon, lead times and labour. Under 160 words. Bullets only."
	}, {
		role: "user",
		content: brief
	}], 400);
	if (!result.ok) return {
		ok: true,
		text: "• Lock cement and steel before the next pour.\n• Do not start plaster until MEP first-fix is signed.\n• If monsoon is inside the window, pull waterproofing forward.\n• Keep one mason gang on brickwork while bar-benders finish the next slab."
	};
	return {
		ok: true,
		text: result.text
	};
});
//#endregion
export { annotatePhoto_createServerFn_handler, askAssistant_createServerFn_handler, extractPlanQuantities_createServerFn_handler, listAiMessages_createServerFn_handler, optimizeSchedule_createServerFn_handler, parseBillOcr_createServerFn_handler };
