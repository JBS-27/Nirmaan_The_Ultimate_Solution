import { r as createServerFn } from "./ssr.mjs";
import { s as num } from "./utils-Dhq_xXK2.mjs";
import { r as getSql } from "./db-D72tsCeV.mjs";
import { t as authMiddleware } from "./middleware-B4AAJXQg.mjs";
import { i as money, o as qty } from "./format-sbvqgmOQ.mjs";
import { t as createServerRpc } from "./createServerRpc-CcvdN_gc.mjs";
import { n as requireProjectAccess } from "./access-DX-qzaPd.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ai-jq-5moeS.js
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
async function projectBrief(projectId, userId) {
	const sql = await getSql();
	await requireProjectAccess(sql, userId, projectId);
	const [p] = await sql`
    select name, city, project_type, plot_sqft, floors, budget, start_date, target_date, status
    from projects where id = ${projectId}
  `;
	const phases = await sql`select name, status, progress, estimated_cost, end_date from phases where project_id = ${projectId} order by sort_order`;
	const mats = await sql`select name, unit, qty_needed, qty_received, qty_used, unit_price from materials where project_id = ${projectId}`;
	const bills = await sql`select vendor, amount, paid, category from bills where project_id = ${projectId}`;
	const workers = await sql`select name, skill, daily_rate from workers where project_id = ${projectId}`;
	const spentBills = bills.filter((b) => b.paid).reduce((s, b) => s + num(b.amount), 0);
	const remainingMats = mats.map((m) => {
		const left = Math.max(0, num(m.qty_needed) - num(m.qty_used));
		return `${m.name}: ${qty(left, String(m.unit))} left (need ${qty(num(m.qty_needed), String(m.unit))}, received ${qty(num(m.qty_received), String(m.unit))}, @ ${money(num(m.unit_price))})`;
	});
	return [
		`Project ${p?.name} in ${p?.city}, type ${p?.project_type}, ${p?.plot_sqft} sqft plot, ${p?.floors} floors.`,
		`Budget ${money(num(p?.budget))}. Paid bills so far ${money(spentBills)}. Window ${p?.start_date} → ${p?.target_date}. Status ${p?.status}.`,
		"Phases: " + phases.map((ph) => `${ph.name} ${ph.progress}% (${ph.status}, est ${money(num(ph.estimated_cost))}, due ${ph.end_date})`).join("; "),
		"Materials: " + remainingMats.join(" | "),
		"Crew: " + workers.map((w) => `${w.name} ${w.skill} ${money(num(w.daily_rate))}/day`).join("; "),
		"Bills: " + bills.map((b) => `${b.vendor} ${money(num(b.amount))} ${b.paid ? "paid" : "unpaid"} (${b.category})`).join("; ")
	].join("\n");
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
	if (data.projectId) try {
		brief = await projectBrief(data.projectId, context.userId);
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
		const fallback = "I can't reach the model right now. Use the BOQ on the project: remaining cement, steel and bricks are listed under Materials, and unpaid bills sit in Money. Re-ask in a moment.";
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
