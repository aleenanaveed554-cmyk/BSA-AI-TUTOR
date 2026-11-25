import { NextResponse } from "next/server";
import { chatCompletion, AppError } from "../../../lib/groq";
import { MODES, SYSTEM_PROMPT } from "../../../lib/config";

export const runtime = "nodejs";
export const maxDuration = 30;

const MAX_MESSAGES = 20;
const MAX_CHARS = 2000;
const WINDOW_MS = 60_000;
const MAX_REQUESTS = 15;
const hits = new Map(); // best-effort per-instance limiter

function isLimited(ip) {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > MAX_REQUESTS;
}

function validate(body) {
  if (!body || typeof body !== "object") return "Invalid request.";
  const { messages, mode } = body;
  if (!(mode in MODES)) return "Unknown tutoring mode.";
  if (!Array.isArray(messages) || messages.length === 0) return "Type a question first.";
  if (messages.length > MAX_MESSAGES) return "This conversation is too long. Start a new chat.";
  for (const m of messages) {
    if (!m || !["user", "assistant"].includes(m.role) || typeof m.content !== "string") return "Invalid message format.";
    if (m.content.length > MAX_CHARS) return `Messages are limited to ${MAX_CHARS} characters.`;
  }
  const last = messages[messages.length - 1];
  if (last.role !== "user" || !last.content.trim()) return "Type a question first.";
  return null;
}

export async function POST(request) {
  try {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    if (isLimited(ip)) throw new AppError("You're sending messages too quickly. Wait a minute.", 429, "rate_limited");

    let body;
    try { body = await request.json(); } catch { throw new AppError("Invalid request.", 400, "invalid_json"); }

    const problem = validate(body);
    if (problem) throw new AppError(problem, 400, "invalid_input");

    const system = `${SYSTEM_PROMPT}\n\nCurrent mode: ${MODES[body.mode].instruction}`;
    const reply = await chatCompletion([
      { role: "system", content: system },
      ...body.messages.map(({ role, content }) => ({ role, content })),
    ]);
    return NextResponse.json({ reply });
  } catch (err) {
    const e = err instanceof AppError ? err : new AppError("Something went wrong.", 500);
    if (!(err instanceof AppError)) console.error(err);
    return NextResponse.json({ error: e.message, code: e.code }, { status: e.status });
  }
}
