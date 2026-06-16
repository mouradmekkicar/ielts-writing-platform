// ============================================================================
// IELTSwithMOURAD · Academic Writing — Supabase Edge Function: writing-feedback
// ----------------------------------------------------------------------------
// Returns examiner-style feedback for a Task 1 / Task 2 response, produced by a
// Groq-hosted model. The deterministic metrics (word count, paragraphs, linkers,
// overview/thesis signals) are computed HERE so they are always accurate; the
// model is asked only for the qualitative judgement. The function then assembles
// the SAME object shape the in-app heuristic (buildLocalDiagnostic) returns, so
// the client's renderFeedback() needs no changes and can swap one for the other.
//
// PRIVACY (UAE PDPL / MoE): the student's essay text is processed in memory and
// sent to Groq solely to generate feedback. It is NEVER logged, persisted, or
// returned to any third party beyond the model call. No student name is received.
//
// SECRETS (set with: supabase secrets set NAME=value):
//   GROQ_API_KEY    (required)
//   GROQ_MODEL      (optional; default below — set to your working Listening model)
//   ALLOWED_ORIGIN  (optional; default "*"; set to your site origin to lock CORS)
// ============================================================================

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const DEFAULT_MODEL = "llama-3.3-70b-versatile";

const LINKERS = [
  "however", "moreover", "furthermore", "therefore", "in addition", "for example",
  "for instance", "on the other hand", "as a result", "in contrast", "whereas",
  "while", "although", "because", "consequently", "nevertheless", "overall",
  "in conclusion", "firstly", "secondly", "finally", "in particular", "such as", "by contrast",
];

function corsHeaders(origin: string) {
  const allow = Deno.env.get("ALLOWED_ORIGIN") || "*";
  return {
    "Access-Control-Allow-Origin": allow === "*" ? (origin || "*") : allow,
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Vary": "Origin",
  };
}

function json(body: unknown, status: number, origin: string) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...corsHeaders(origin) },
  });
}

function countWords(t: string) { return (t.trim().match(/\S+/g) || []).length; }
function clampBand(b: number) { return Math.max(4, Math.min(8.5, Math.round(b * 2) / 2)); }

// Deterministic metrics — mirror the client heuristic so the two sources agree.
function computeMetrics(text: string, kind: string, minWords: number) {
  const words = countWords(text);
  const sentences = (text.match(/[^.!?]+[.!?]+/g) || (text.trim() ? [text.trim()] : []))
    .map((s) => s.trim()).filter(Boolean);
  const paras = text.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
  const lower = " " + text.toLowerCase() + " ";
  const linkers = LINKERS.filter((l) => lower.indexOf(" " + l + " ") !== -1 || lower.indexOf(" " + l + ",") !== -1);
  const lens = sentences.map((s) => countWords(s));
  const avg = lens.length ? lens.reduce((a, b) => a + b, 0) / lens.length : 0;
  return {
    wordCount: words,
    minWords,
    paragraphs: paras.length,
    sentences: sentences.length,
    linkers: linkers.length,
    avgSentence: Math.round(avg),
    overviewPresent: /\b(overall|in general|in summary|broadly speaking)\b/i.test(text),
    thesisPresent: /\b(i believe|i think|in my (view|opinion)|i (agree|disagree)|i would argue|my view is)\b/i.test(text),
  };
}

function arr(x: unknown): unknown[] { return Array.isArray(x) ? x : []; }
function str(x: unknown): string { return typeof x === "string" ? x : ""; }

// Force the model's loose JSON into the exact shape renderFeedback expects.
function assemble(model: Record<string, unknown>, kind: string, metrics: ReturnType<typeof computeMetrics>) {
  const t1 = kind === "task1";
  const c = (model.criteria || {}) as Record<string, { band?: number }>;
  const ta = clampBand(Number(c.taskAchievement?.band ?? c.taskResponse?.band ?? 6));
  const cc = clampBand(Number(c.coherenceCohesion?.band ?? 6));
  const lr = clampBand(Number(c.lexicalResource?.band ?? 6));
  const gr = clampBand(Number(c.grammaticalRange?.band ?? 6));
  const est = clampBand(Number(model.estimatedBand ?? (ta + cc + lr + gr) / 4));

  const errors = arr(model.errors).slice(0, 6).map((e) => {
    const o = e as Record<string, unknown>;
    return { type: str(o.type) || "Note", detail: str(o.detail) };
  }).filter((e) => e.detail);

  const sentenceCorrections = arr(model.sentenceCorrections).slice(0, 3).map((s) => {
    const o = s as Record<string, unknown>;
    return { original: str(o.original), improved: str(o.improved), reason: str(o.reason) };
  }).filter((s) => s.original && s.improved);

  const vocabUpgrades = arr(model.vocabUpgrades).slice(0, 4).map((v) => {
    const o = v as Record<string, unknown>;
    return { from: str(o.from), to: str(o.to) };
  }).filter((v) => v.from && v.to);
  if (!vocabUpgrades.length) {
    vocabUpgrades.push({ from: "(general)", to: "Introduce one or two precise academic phrases per paragraph — e.g. 'a marked increase', 'a negligible proportion'." });
  }

  const grammarUpgrades = arr(model.grammarUpgrades).slice(0, 3).map(str).filter(Boolean);

  const strengths = arr(model.strengths).slice(0, 3).map(str).filter(Boolean);
  const weaknesses = arr(model.weaknesses).slice(0, 3).map(str).filter(Boolean);

  return {
    kind: "ai",
    source: "groq",
    label: "AI examiner-style feedback (Groq) — guidance only; your teacher's review is the authoritative score",
    generatedAt: new Date().toISOString(),
    estimatedBand: est,
    criteria: {
      taskAchievement: { band: ta, label: t1 ? "Task Achievement" : "Task Response" },
      coherenceCohesion: { band: cc, label: "Coherence & Cohesion" },
      lexicalResource: { band: lr, label: "Lexical Resource" },
      grammaticalRange: { band: gr, label: "Grammatical Range & Accuracy" },
    },
    metrics,
    strengths: strengths.length ? strengths : ["You produced a complete attempt — the starting point for every improvement."],
    weaknesses: weaknesses.length ? weaknesses : ["Focus next on precision of vocabulary and complex grammar."],
    errors,
    sentenceCorrections,
    vocabUpgrades,
    grammarUpgrades,
    nextRecommendation: str(model.nextRecommendation) || "Rewrite one paragraph applying the single highest-priority fix above, then resubmit.",
    teacherSummary: str(model.teacherSummary) || `AI band ~${est.toFixed(1)} (TA/TR ${ta.toFixed(1)}, CC ${cc.toFixed(1)}, LR ${lr.toFixed(1)}, GRA ${gr.toFixed(1)}). ${metrics.wordCount} words, ${metrics.paragraphs} paragraphs.`,
    studentSummary: str(model.studentSummary) || "Use the priorities above to guide your next revision.",
  };
}

function buildPrompt(text: string, kind: string, taskType: string, metrics: ReturnType<typeof computeMetrics>) {
  const t1 = kind === "task1";
  const taName = t1 ? "Task Achievement" : "Task Response";
  const system = [
    "You are an experienced IELTS Academic Writing examiner.",
    "Assess the candidate response against the four official criteria and return STRICT JSON only — no markdown, no prose outside the JSON.",
    "Be honest and calibrated: do NOT inflate bands. Use the 4.0–8.5 range in 0.5 steps. A typical mid-level response is around band 6.0.",
    "Keep every comment specific to THIS response. Do not invent content that is not in the text.",
    "JSON shape (use exactly these keys):",
    "{",
    `  "estimatedBand": number,`,
    `  "criteria": { "taskAchievement": {"band": number}, "coherenceCohesion": {"band": number}, "lexicalResource": {"band": number}, "grammaticalRange": {"band": number} },`,
    `  "strengths": [up to 3 short strings],`,
    `  "weaknesses": [up to 3 short strings, each an actionable priority],`,
    `  "errors": [up to 6 {"type": "Grammar|Lexical|Register|Cohesion|Task", "detail": "string"}],`,
    `  "sentenceCorrections": [up to 3 {"original": "a sentence from the text", "improved": "rewrite", "reason": "why"}],`,
    `  "vocabUpgrades": [up to 4 {"from": "weak word/phrase used", "to": "stronger academic alternative(s)"}],`,
    `  "grammarUpgrades": [up to 3 short strings of concrete grammar advice],`,
    `  "nextRecommendation": "one concrete next step",`,
    `  "teacherSummary": "one-line summary for the teacher",`,
    `  "studentSummary": "two-sentence encouraging-but-honest summary for the student"`,
    "}",
    `Here "taskAchievement" represents ${taName}.`,
  ].join("\n");

  const user = [
    `Task: IELTS Academic Writing ${t1 ? "Task 1" : "Task 2"}${taskType ? " (" + taskType + ")" : ""}.`,
    `Minimum words: ${metrics.minWords}. This response: ${metrics.wordCount} words, ${metrics.paragraphs} paragraphs, ${metrics.sentences} sentences, ${metrics.linkers} linking devices.`,
    t1
      ? "Task 1 must select and report key features objectively, with a clear overview and no opinions."
      : "Task 2 must answer the question fully with a clear position, developed ideas, and a logical structure.",
    "",
    "CANDIDATE RESPONSE:",
    text,
  ].join("\n");

  return { system, user };
}

Deno.serve(async (req: Request) => {
  const origin = req.headers.get("origin") || "*";
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders(origin) });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405, origin);

  const key = Deno.env.get("GROQ_API_KEY");
  if (!key) return json({ error: "Server not configured" }, 500, origin);

  let body: Record<string, unknown>;
  try { body = await req.json(); } catch { return json({ error: "Invalid JSON" }, 400, origin); }

  const text = typeof body.text === "string" ? body.text : "";
  const kind = body.kind === "task1" ? "task1" : "task2";
  const taskType = typeof body.taskType === "string" ? body.taskType : "";
  const minWords = Number(body.minWords) > 0 ? Number(body.minWords) : (kind === "task1" ? 150 : 250);
  if (text.trim().length < 40) return json({ error: "Response too short to assess" }, 422, origin);

  const metrics = computeMetrics(text, kind, minWords);
  const { system, user } = buildPrompt(text, kind, taskType, metrics);

  let modelJson: Record<string, unknown>;
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 25000);
    const res = await fetch(GROQ_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${key}` },
      body: JSON.stringify({
        model: Deno.env.get("GROQ_MODEL") || DEFAULT_MODEL,
        temperature: 0.3,
        max_tokens: 1400,
        response_format: { type: "json_object" },
        messages: [{ role: "system", content: system }, { role: "user", content: user }],
      }),
      signal: ctrl.signal,
    });
    clearTimeout(timer);
    if (!res.ok) return json({ error: "Upstream model error" }, 502, origin);
    const data = await res.json();
    const content = data?.choices?.[0]?.message?.content ?? "{}";
    modelJson = JSON.parse(content);
  } catch (_e) {
    // Never surface raw errors or essay text; the client falls back to its local heuristic.
    return json({ error: "Feedback generation failed" }, 502, origin);
  }

  return json(assemble(modelJson, kind, metrics), 200, origin);
});
