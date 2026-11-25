# BSA AI Tutor

An AI tutor for **Business Systems Analysis (BSA)** students. Get explanations, practice quizzes and business case studies, powered by the Groq API and built with Next.js for Vercel.

## Features
- Landing page, responsive navbar, dark-mode aware design
- Chat tutor with three modes: Explain, Quiz me, Case study
- Topic shortcuts (requirements, BPMN, UML, user stories, SWOT, ERDs, Agile)
- Markdown answers, loading, empty and error states with Retry
- Secure server-side Groq calls, input validation, rate limiting, timeouts

## Stack
Next.js 14 (App Router, JavaScript) · React 18 · react-markdown · Groq API (`llama-3.3-70b-versatile`) · Vercel

Next.js was chosen because API routes deploy to Vercel as serverless functions with zero configuration, which keeps the API key on the server.

## Structure
```
app/            pages, layout, styles, api/chat/route.js (server)
components/     Navbar, Chat
lib/            config.js (topics, prompts), groq.js (Groq client)
.env.example    environment template
```

## Local development
```bash
npm install
cp .env.example .env.local   # then paste your key
npm run dev                  # http://localhost:3000
```

## Groq API key
1. Sign up at https://console.groq.com
2. Open **API Keys** → **Create API Key** and copy it
3. Put it in `.env.local` as `GROQ_API_KEY=...` (never commit it)

## GitHub
```bash
git init
git add .
git commit -m "Initial commit: BSA AI Tutor"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/bsa-ai-tutor.git
git push -u origin main
```

## Deploy on Vercel
1. Go to https://vercel.com/new and import the GitHub repository
2. Framework Preset: **Next.js** (auto-detected); leave build settings default
3. Under **Environment Variables** add `GROQ_API_KEY` with your key
4. Click **Deploy**
5. To redeploy after changes: `git push` (auto-deploys). If you change env vars, open Deployments → ⋯ → **Redeploy**

## Troubleshooting
| Problem | Fix |
|---|---|
| "missing its GROQ_API_KEY" | Add the variable in `.env.local` or Vercel settings, then restart/redeploy |
| "API key is invalid" | Create a new key at console.groq.com and update it |
| Rate limit message | Wait a minute; Groq free tier has limits |
| Model unavailable | Set `GROQ_MODEL` to a model listed at console.groq.com/docs/models |
| Timeout | Retry; shorten the question |

## Future improvements
Streaming replies, saved history, accounts, uploading course notes, progress tracking, durable rate limiting (e.g. Upstash).
