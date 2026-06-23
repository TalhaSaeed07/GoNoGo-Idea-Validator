# GoNoGo — AI Idea Validator

> Stop guessing. Get a structured go/no-go verdict on your startup or project idea in seconds.


---

## What It Does

GoNoGo is an AI-powered web application that evaluates startup and project ideas by generating structured validation reports. Feed it your idea, and it comes back with a clear breakdown covering feasibility, market challenges, and actionable improvement suggestions — so you can make informed decisions early, not after months of wasted effort.

Built for founders, developers, and anyone who has too many ideas and not enough signal.

---

## Tech Stack

| Layer | Tools |
|---|---|
| Frontend | HTML, Tailwind CSS, JavaScript |
| Workflow Orchestration | n8n |
| AI Models | Google Gemini 2.5 & 2.0 |
| Data Sources | News API, Wikipedia API |
| Deployment | Netlify |

---

## Key Features

- **AI-driven analysis** — Gemini 2.5 & 2.0 power the core validation logic, generating structured insights rather than generic feedback
- **Workflow orchestration with n8n** — repeatable, maintainable validation pipelines that are easy to extend
- **Multi-source context** — pulls in live news and Wikipedia data to ground the analysis in real-world context
- **Structured reports** — every evaluation covers feasibility, key challenges, and concrete improvement suggestions
- **Responsive UI** — clean frontend that works across devices without friction

---

## How It Works

1. User enters their idea via the web interface
2. n8n workflow triggers and orchestrates the validation pipeline
3. News API and Wikipedia API fetch relevant real-world context
4. Gemini processes the idea + context and generates a structured report
5. Report is returned to the frontend and displayed to the user

---

## Running Locally

Clone the repo and open `index.html` directly in your browser for the frontend.

For the full pipeline, you'll need:
- A running n8n instance (self-hosted or cloud)
- API keys for: Google Gemini, News API, Wikipedia API
- The n8n workflow imported and configured with your keys


---

## Why I Built This

Early-stage idea validation is one of the most underserved problems for solo founders and small teams. Most people either skip it entirely or spend weeks on manual research. GoNoGo compresses that process into a repeatable, AI-assisted workflow — and building it let me explore the intersection of LLM integration, automation pipelines, and practical product delivery end to end.

---
