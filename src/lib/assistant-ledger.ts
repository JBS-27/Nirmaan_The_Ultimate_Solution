import { money, qty } from "@/lib/format";

export type LedgerFacts = {
  name: string;
  city: string;
  budget: number;
  spent: number;
  remaining: number;
  progress: number;
  phases: { name: string; progress: number; status: string; estimatedCost: number }[];
  materials: { name: string; category: string; unit: string; qtyNeeded: number; qtyReceived: number; qtyUsed: number; unitPrice: number }[];
  workers: { name: string; skill: string; dailyRate: number; daysPresent: number; pending: number }[];
  bills: { vendor: string; amount: number; paid: boolean; category: string }[];
  presentToday: number;
};

function leftover(m: LedgerFacts["materials"][number]) {
  return Math.max(0, m.qtyNeeded - m.qtyUsed);
}

function matchMaterials(facts: LedgerFacts, needle: string) {
  const n = needle.toLowerCase();
  return facts.materials.filter((m) =>
    `${m.name} ${m.category}`.toLowerCase().includes(n),
  );
}

/** Answers site questions from the project ledger when the model is unavailable. */
export function answerFromLedger(prompt: string, facts: LedgerFacts): string {
  const q = prompt.toLowerCase();
  const lines: string[] = [];

  const cement = matchMaterials(facts, "cement");
  const steel = matchMaterials(facts, "steel").concat(matchMaterials(facts, "tmt"));
  const brick = matchMaterials(facts, "brick");

  if (/cement|opc|ppc/.test(q) && cement.length) {
    for (const m of cement) {
      lines.push(
        `${m.name}: ${qty(leftover(m), m.unit)} still needed after use, ${qty(m.qtyReceived, m.unit)} received of ${qty(m.qtyNeeded, m.unit)} @ ${money(m.unitPrice)}.`,
      );
    }
  }
  if (/steel|tmt|rebar|bar/.test(q) && steel.length) {
    for (const m of steel) {
      lines.push(
        `${m.name}: ${qty(leftover(m), m.unit)} left to use, ${qty(m.qtyReceived, m.unit)} received of ${qty(m.qtyNeeded, m.unit)}.`,
      );
    }
  }
  if (/brick|block|masonry/.test(q) && brick.length) {
    for (const m of brick) {
      lines.push(
        `${m.name}: ${qty(leftover(m), m.unit)} remaining of ${qty(m.qtyNeeded, m.unit)} needed.`,
      );
    }
  }
  if (/budget|envelope|spent|overrun|money|cash|rupee|₹/.test(q)) {
    const used = facts.budget > 0 ? Math.round((facts.spent / facts.budget) * 100) : 0;
    lines.push(
      `${facts.name} envelope is ${money(facts.budget)}. Spent ${money(facts.spent)} (${used}%). Remaining ${money(facts.remaining)}${facts.remaining < 0 ? " — over envelope." : "."}`,
    );
    const unpaid = facts.bills.filter((b) => !b.paid);
    if (unpaid.length) {
      const sum = unpaid.reduce((s, b) => s + b.amount, 0);
      lines.push(`${unpaid.length} unpaid bill${unpaid.length > 1 ? "s" : ""} totalling ${money(sum)}.`);
    }
  }
  if (/progress|phase|complete|behind|schedule|handover/.test(q)) {
    lines.push(`Overall progress ${facts.progress}%.`);
    const behind = facts.phases.filter((p) => p.status !== "done" && p.progress < 100);
    for (const p of facts.phases) {
      lines.push(`• ${p.name}: ${p.progress}% (${p.status}, est ${money(p.estimatedCost)})`);
    }
    if (behind[0]) lines.push(`Next focus: ${behind[0].name}.`);
  }
  if (/crew|worker|attendance|present|wage|payout|mason|labour|labor/.test(q)) {
    if (!facts.workers.length) {
      lines.push("No crew on the books yet. Add workers on the Crew tab.");
    } else {
      lines.push(`${facts.presentToday} marked present today. ${facts.workers.length} people on the books.`);
      for (const w of facts.workers) {
        lines.push(
          `• ${w.name} (${w.skill}): ${w.daysPresent} days @ ${money(w.dailyRate)}, pending ${money(w.pending)}.`,
        );
      }
    }
  }
  if (/bill|invoice|vendor|receipt/.test(q) && facts.bills.length) {
    for (const b of facts.bills.slice(0, 6)) {
      lines.push(`• ${b.vendor} ${money(b.amount)} — ${b.paid ? "paid" : "unpaid"} (${b.category})`);
    }
  }
  if (/left|remaining|need|how much|summary|today|status/.test(q) && lines.length === 0) {
    const top = facts.materials
      .map((m) => ({ m, left: leftover(m) }))
      .filter((x) => x.left > 0)
      .slice(0, 6);
    lines.push(`${facts.name} in ${facts.city} is ${facts.progress}% complete. Envelope left ${money(facts.remaining)}.`);
    if (top.length) {
      lines.push("Materials still needed:");
      for (const { m, left } of top) lines.push(`• ${m.name}: ${qty(left, m.unit)}`);
    }
  }

  if (!lines.length) {
    return [
      `${facts.name} (${facts.city}): ${facts.progress}% complete.`,
      `Budget ${money(facts.budget)} · spent ${money(facts.spent)} · left ${money(facts.remaining)}.`,
      `Crew: ${facts.workers.length} · present today ${facts.presentToday}.`,
      `Ask about cement, steel, budget, a phase, or who is on site.`,
    ].join("\n");
  }
  return lines.join("\n");
}
