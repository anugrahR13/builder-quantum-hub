# Career Path & Skill Gap Analyzer

A full-stack AI web app that parses resumes, analyzes job descriptions, identifies skill gaps, and recommends a personalized learning path with a Job Fit Score.

Tech: React + Tailwind + Recharts (frontend), Express + TypeScript (backend), optional MongoDB, optional OpenAI embeddings.

## Features
- Upload PDF/DOCX or paste resume text; add manual skills.
- Parse job descriptions; extract skills with NLP heuristics.
- AI matching: cosine similarity (binary skill vectors). Optional semantic score via OpenAI embeddings.
- Dashboard: charts for coverage, missing skills, and recommendations (courses/projects/certs).
- Saves recent analyses (MongoDB if `MONGODB_URI` is set; in-memory fallback otherwise).

## Getting Started
- Dev: `pnpm dev`
- Typecheck: `pnpm typecheck`; Build: `pnpm build`; Start prod: `pnpm start`

### Environment
- `MONGODB_URI` (optional) – connection string to a MongoDB database.
- `OPENAI_API_KEY` (optional) – enables semantic score via embeddings API.

## API
- `POST /api/analyze` (multipart/form-data)
  - Fields: `resume` (file), `resumeText` (string), `jobTitle` (string), `jobDescription` (string, required), `manualSkills` (JSON array or comma list)
  - Returns: `fitScore`, `missingSkills`, `matchedSkills`, `candidateSkills`, `requiredSkills`, `recommendations`, `vectors`, `universe`, optional `semanticScore`.
- `GET /api/reports` – latest saved analyses.

## Notes on Python requirement
This starter runs on Node/Express. If you need a Python (Flask/FastAPI) backend, connect a repo or use our VS Code extension/CLI:
- GitHub projects: https://www.builder.io/c/docs/projects-github
- Local repos: https://www.builder.io/c/docs/projects-local-repo
- VS Code extension: https://www.builder.io/c/docs/projects-vscode

## Deployment
Use Netlify or Vercel MCP:
- Netlify: [Connect Netlify MCP](#open-mcp-popover) and deploy.
- Vercel: [Connect Vercel MCP](#open-mcp-popover) and deploy.

