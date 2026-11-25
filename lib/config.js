// Single source of truth for the tutor's subject area, modes and prompts.
export const TOPICS = [
  "Requirements elicitation",
  "User stories & acceptance criteria",
  "Process modeling (BPMN)",
  "UML & use cases",
  "Stakeholder analysis",
  "SWOT & gap analysis",
  "Data modeling & ERDs",
  "SDLC, Agile & Scrum",
];

export const MODES = {
  explain: { label: "Explain", hint: "Clear explanations with examples", instruction: "Explain the concept step by step in plain language, with one concrete business example and a short summary at the end." },
  quiz: { label: "Quiz me", hint: "Practice questions with feedback", instruction: "Ask ONE practice question at a time on the topic. Wait for the student's answer, then give feedback and the next question. If the student has just sent a topic, start with the first question." },
  case: { label: "Case study", hint: "Apply skills to a scenario", instruction: "Present a short realistic business scenario (about 120 words) and ask the student to analyse it. Give guided feedback on their answer." },
};

export const STARTERS = [
  "What is the difference between functional and non-functional requirements?",
  "Write a user story for an online grocery checkout, with acceptance criteria.",
  "How do I read a BPMN diagram with swimlanes?",
  "Give me a SWOT analysis example for a small bakery.",
];

export const SYSTEM_PROMPT = `You are BSA Tutor, a patient and encouraging tutor for students of Business Systems Analysis (BSA).
You cover requirements gathering, business process modeling, UML, stakeholder analysis, data modeling, SDLC/Agile and related business-analysis skills.
Rules: be accurate and concise; use Markdown (short headings, bullet lists, tables when useful); use practical business examples; if a question is outside business systems analysis, briefly say so and steer back to the subject; if unsure, say so rather than guessing.`;
