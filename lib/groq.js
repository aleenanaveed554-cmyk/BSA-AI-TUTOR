const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const DEFAULT_MODEL = "llama-3.3-70b-versatile";
const TIMEOUT_MS = 25000;

export class AppError extends Error {
  constructor(message, status = 500, code = "internal_error") {
    super(message);
    this.status = status;
    this.code = code;
  }
}

/** Calls Groq chat completions and returns the assistant text. Server-side only. */
export async function chatCompletion(messages) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new AppError("The server is missing its GROQ_API_KEY. Add it in your environment variables.", 500, "missing_api_key");
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const res = await fetch(GROQ_URL, {
      method: "POST",
      signal: controller.signal,
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: process.env.GROQ_MODEL || DEFAULT_MODEL,
        messages,
        temperature: 0.5,
        max_tokens: 1200,
      }),
    });

    if (!res.ok) {
      if (res.status === 401) throw new AppError("The Groq API key is invalid. Check GROQ_API_KEY.", 500, "invalid_api_key");
      if (res.status === 429) throw new AppError("Groq is rate limiting requests. Wait a moment and try again.", 429, "rate_limited");
      if (res.status === 400 || res.status === 404) throw new AppError("Groq rejected the request. The model may be unavailable.", 502, "bad_request");
      throw new AppError("Groq is having trouble right now. Try again shortly.", 502, "upstream_error");
    }

    const data = await res.json();
    const text = data?.choices?.[0]?.message?.content;
    if (typeof text !== "string" || !text.trim()) {
      throw new AppError("The AI returned an empty answer. Please try again.", 502, "empty_response");
    }
    return text.trim();
  } catch (err) {
    if (err instanceof AppError) throw err;
    if (err.name === "AbortError") throw new AppError("The AI took too long to respond. Please try again.", 504, "timeout");
    throw new AppError("Could not reach the AI service. Check your connection and retry.", 502, "network_error");
  } finally {
    clearTimeout(timer);
  }
}
