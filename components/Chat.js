"use client";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { MODES, TOPICS, STARTERS } from "../lib/config";

const MAX_CHARS = 2000;

export default function Chat() {
  const params = useSearchParams();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [mode, setMode] = useState("explain");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const endRef = useRef(null);
  const startedTopic = useRef(false);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" }); }, [messages, loading]);

  async function send(text, history = messages, currentMode = mode) {
    const content = text.trim();
    if (!content) return setError("Type a question first.");
    if (content.length > MAX_CHARS) return setError(`Keep your message under ${MAX_CHARS} characters.`);

    const next = [...history, { role: "user", content }];
    setMessages(next);
    setInput("");
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next.slice(-12), mode: currentMode }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Something went wrong. Please try again.");
      setMessages([...next, { role: "assistant", content: data.reply }]);
    } catch (e) {
      setError(e instanceof TypeError ? "Network error. Check your connection and retry." : e.message);
    } finally {
      setLoading(false);
    }
  }

  // Landing-page topic chips open the tutor with a starting question.
  useEffect(() => {
    const topic = params.get("topic");
    if (topic && !startedTopic.current) {
      startedTopic.current = true;
      send(`Teach me the basics of: ${topic}`, [], "explain");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  const lastUser = [...messages].reverse().find((m) => m.role === "user");
  const retry = () => lastUser && send(lastUser.content, messages.slice(0, messages.lastIndexOf(lastUser)));

  return (
    <div className="chat">
      <div className="toolbar">
        <div className="segmented" role="tablist" aria-label="Learning mode">
          {Object.entries(MODES).map(([key, m]) => (
            <button key={key} role="tab" aria-selected={mode === key} className={mode === key ? "active" : ""} onClick={() => setMode(key)} title={m.hint}>
              {m.label}
            </button>
          ))}
        </div>
        {messages.length > 0 && (
          <button className="btn btn-ghost btn-sm" onClick={() => { setMessages([]); setError(""); }}>New chat</button>
        )}
      </div>

      <div className="messages" aria-live="polite">
        {messages.length === 0 && !loading && (
          <div className="empty">
            <h2>What would you like to learn?</h2>
            <p className="muted">Pick a topic or try one of these questions.</p>
            <div className="chip-row">
              {TOPICS.slice(0, 4).map((t) => (
                <button key={t} className="chip chip-link" onClick={() => send(`Teach me the basics of: ${t}`)}>{t}</button>
              ))}
            </div>
            <div className="starters">
              {STARTERS.map((s) => (<button key={s} className="card starter" onClick={() => send(s)}>{s}</button>))}
            </div>
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`bubble ${m.role === "user" ? "bubble-user" : "bubble-ai"}`}>
            {m.role === "user" ? m.content : <ReactMarkdown>{m.content}</ReactMarkdown>}
          </div>
        ))}
        {loading && <div className="bubble bubble-ai"><span className="dots"><i /><i /><i /></span></div>}
        {error && (
          <div className="alert" role="alert">
            <span>{error}</span>
            {lastUser && !loading && <button className="btn btn-sm btn-ghost" onClick={retry}>Retry</button>}
          </div>
        )}
        <div ref={endRef} />
      </div>

      <form className="composer" onSubmit={(e) => { e.preventDefault(); if (!loading) send(input); }}>
        <textarea
          value={input}
          rows={1}
          maxLength={MAX_CHARS}
          placeholder={mode === "quiz" ? "Name a topic to be quizzed on…" : "Ask about requirements, BPMN, user stories…"}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); if (!loading) send(input); } }}
          aria-label="Your message"
        />
        <button className="btn btn-primary" disabled={loading || !input.trim()}>{loading ? "Thinking…" : "Send"}</button>
      </form>
    </div>
  );
}
