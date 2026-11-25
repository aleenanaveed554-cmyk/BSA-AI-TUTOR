import Link from "next/link";
import { TOPICS, MODES } from "../lib/config";

const STEPS = [
  { title: "Pick a topic", text: "Choose from core BSA areas, or ask anything in your own words." },
  { title: "Choose how to learn", text: "Get an explanation, a practice quiz, or a business case to solve." },
  { title: "Get feedback", text: "The tutor corrects your answers and builds on what you already know." },
];

export default function Home() {
  return (
    <main>
      <section className="hero">
        <div className="container hero-grid">
          <div>
            <h1>Understand business systems, one question at a time.</h1>
            <p className="lead">
              BSA Tutor explains requirements, process models and user stories like a patient mentor,
              then tests you with practice questions and real-world cases.
            </p>
            <div className="row">
              <Link href="/tutor" className="btn btn-primary">Ask the tutor</Link>
              <Link href="/#how" className="btn btn-ghost">See how it works</Link>
            </div>
          </div>
          <div className="preview" aria-hidden="true">
            <div className="bubble bubble-user">Write a user story for a library app.</div>
            <div className="bubble bubble-ai">
              <strong>As a</strong> library member, <strong>I want to</strong> renew books online,
              <strong> so that</strong> I avoid late fees.
              <div className="chip-row"><span className="chip">Given I have a loan</span><span className="chip">When I tap Renew</span><span className="chip">Then the due date extends</span></div>
            </div>
          </div>
        </div>
      </section>

      <section id="how" className="section">
        <div className="container">
          <h2>How it works</h2>
          <div className="grid-3">
            {STEPS.map((s, i) => (
              <div className="card" key={s.title}>
                <span className="step">{i + 1}</span>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="topics" className="section section-alt">
        <div className="container">
          <h2>Topics you can study</h2>
          <div className="chip-row big">
            {TOPICS.map((t) => (
              <Link key={t} className="chip chip-link" href={`/tutor?topic=${encodeURIComponent(t)}`}>{t}</Link>
            ))}
          </div>
          <div className="grid-3 mt">
            {Object.values(MODES).map((m) => (
              <div className="card" key={m.label}><h3>{m.label}</h3><p>{m.hint}</p></div>
            ))}
          </div>
        </div>
      </section>

      <footer className="footer"><div className="container">BSA AI Tutor · Powered by Groq</div></footer>
    </main>
  );
}
