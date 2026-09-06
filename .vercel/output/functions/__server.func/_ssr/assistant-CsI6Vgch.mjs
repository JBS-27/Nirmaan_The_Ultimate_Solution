import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { i as cn } from "./utils-Dhq_xXK2.mjs";
import { t as Button } from "./button-BJUb9JTF.mjs";
import { c as Send, u as Mic } from "../_libs/lucide-react.mjs";
import { n as PageHeader } from "./app-shell-D51N6pSh.mjs";
import { t as Card } from "./card-BlHSO0wt.mjs";
import { n as NativeSelect } from "./field-6_OphhBd.mjs";
import { t as Textarea } from "./textarea-CbfET7rk.mjs";
import { t as useAsync } from "./use-async-C1dAHjTM.mjs";
import { r as listProjects } from "./projects-C8H6aJTU.mjs";
import { o as Route$5 } from "./router-Drx5sfKU.mjs";
import { i as listAiMessages, n as askAssistant } from "./ai-DTwm6TF6.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/assistant-CsI6Vgch.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Assistant() {
	const search = Route$5.useSearch();
	const projects = useAsync(() => listProjects(), []);
	const [projectId, setProjectId] = (0, import_react.useState)(search.projectId ? Number(search.projectId) : void 0);
	const history = useAsync(() => listAiMessages({ data: { projectId } }), [projectId]);
	const [prompt, setPrompt] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [local, setLocal] = (0, import_react.useState)([]);
	const scroller = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		setLocal([]);
	}, [projectId]);
	(0, import_react.useEffect)(() => {
		scroller.current?.scrollTo({
			top: scroller.current.scrollHeight,
			behavior: "smooth"
		});
	}, [
		local,
		history.data,
		busy
	]);
	const messages = [...history.data ?? [], ...local];
	async function send(text) {
		const trimmed = text.trim();
		if (!trimmed || busy) return;
		setPrompt("");
		setLocal((m) => [...m, {
			role: "user",
			content: trimmed
		}]);
		setBusy(true);
		try {
			const res = await askAssistant({ data: {
				projectId,
				prompt: trimmed
			} });
			const text = res.ok ? res.text : "Could not answer.";
			setLocal((m) => [...m, {
				role: "assistant",
				content: text
			}]);
		} catch (err) {
			setLocal((m) => [...m, {
				role: "assistant",
				content: err instanceof Error ? err.message : "Could not answer."
			}]);
		} finally {
			setBusy(false);
		}
	}
	function listen() {
		const SR = window.webkitSpeechRecognition;
		if (!SR) return;
		const rec = new SR();
		rec.lang = "en-IN";
		rec.onresult = (ev) => {
			setPrompt(ev.results[0][0].transcript);
		};
		rec.start();
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			kicker: "Assistant",
			title: "Ask the twin",
			description: "Questions are answered from this project’s BOQ, bills, crew and schedule — not from generic advice.",
			action: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(NativeSelect, {
				className: "w-48",
				value: projectId ?? "",
				onChange: (e) => setProjectId(e.target.value ? Number(e.target.value) : void 0),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
					value: "",
					children: "No project"
				}), (projects.data ?? []).map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
					value: p.id,
					children: p.name
				}, p.id))]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "flex min-h-[60dvh] flex-col p-0",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				ref: scroller,
				className: "flex-1 space-y-3 overflow-y-auto p-4",
				children: [messages.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid gap-2 sm:grid-cols-2",
					children: [
						"How much cement do I still need?",
						"Which phase is most over budget?",
						"Who should I hire next in my city?",
						"Summarise site progress for today"
					].map((q) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "rounded-lg border border-line bg-bg px-3 py-3 text-left text-sm hover:bg-bg-sunken",
						onClick: () => void send(q),
						children: q
					}, q))
				}) : messages.map((m, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: cn("max-w-[42rem] rounded-xl px-3 py-2 text-sm whitespace-pre-wrap", m.role === "user" ? "ml-auto bg-forest text-cream" : "bg-bg-sunken text-ink"),
					children: m.content
				}, `${m.role}-${i}-${m.content.slice(0, 12)}`)), busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted",
					children: "Checking the ledger…"
				}) : null]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "flex items-end gap-2 border-t border-line p-3",
				onSubmit: (e) => {
					e.preventDefault();
					send(prompt);
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						rows: 2,
						value: prompt,
						onChange: (e) => setPrompt(e.target.value),
						placeholder: "How much TMT is left for the first slab?",
						className: "min-h-14"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						variant: "outline",
						size: "icon",
						onClick: listen,
						"aria-label": "Voice",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mic, { className: "size-4" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						size: "icon",
						disabled: busy,
						"aria-label": "Send",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "size-4" })
					})
				]
			})]
		})]
	});
}
//#endregion
export { Assistant as component };
