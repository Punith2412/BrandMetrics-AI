# BrandMetrics AI

**Business Intelligence Brand Kit & Analytics Platform**  
*Business Intelligence Enterprise*

BrandMetrics AI is a production-ready web application that helps professionals, freelancers, and enterprise teams generate complete personal brand assets powered by AI — with built-in analytics, predictive scoring, and operational export tools.

---

## Product Overview

BrandMetrics AI combines personal branding copy generation with real data analytics:

- AI-generated brand stories (Professional / Friendly / Bold)
- Multi-platform social ad copy (LinkedIn, Instagram, Facebook, X)
- 60-second elevator pitch + 5-slide pitch deck outline
- Predictive CTR scoring on every ad
- Keyword density, readability, tone profiling & domain detection
- A/B divergence analysis (Metrics vs Narrative)
- Cards view + Spreadsheet (Excel-style) grid view
- One-click PDF Brand Kit + CSV Content Calendar export
- Dark mode, fully responsive, clean enterprise UI

---

## Screenshots

### 1. Brand Data Insights Dashboard
![BrandMetrics AI – Insights Dashboard]<img width="1168" height="784" alt="image" src="https://github.com/user-attachments/assets/026d249c-b2fa-4c5c-b421-f75b94e170eb" />



*KPI banner, keyword density, tone profile, platform character fit, and A/B divergence analysis.*

### 2. Multi-Platform Ad Cards with Predictive CTR
![BrandMetrics AI – Ad Cards & CTR]<img width="1168" height="784" alt="MwkX3" src="https://github.com/user-attachments/assets/aa09d527-bc93-4451-a629-98d8314e26a9" />



*Platform-specific ad cards showing Hook, Body, CTA, predicted CTR, and detected CTR drivers.*

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 15 (App Router) + React 19 + TypeScript |
| Styling | Tailwind CSS + next-themes |
| AI | OpenAI / Anthropic Claude / xAI Grok (with high-quality mock fallback) |
| Analytics | Custom client-side engine (`src/lib/analytics.ts`) |
| PDF Export | html2canvas + jsPDF |
| CSV Export | Native Blob download |
| Auth | Lightweight client-side (ready for NextAuth + DB) |

---

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. (Optional) Add AI API key
cp .env.example .env.local
# Then set one of:
# OPENAI_API_KEY=sk-...
# ANTHROPIC_API_KEY=sk-ant-...
# GROK_API_KEY=xai-...
# AI_PROVIDER=openai

# 3. Run
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

> Without an API key the app uses a high-quality offline mock generator so you can demo the full experience immediately.

---

## Core Features

### Content Generation
- Full Brand Profile / Social Ads Focus / Pitch Deck Focus
- 3 voice variants of personal brand story
- LinkedIn Headline + Bio
- 5 content ideas
- Platform-native ad copy (LinkedIn, Instagram, Facebook, X)
- Elevator pitch + 5-slide outline

### Analytics Engine
- SEO Keyword Density Matrix
- Flesch-style Readability Score
- Impact Score (0–100)
- Tone Profiler (Professional / Analytical / Creative / Action-Oriented)
- Domain Profile detection (Business Intelligence, Data Science, Data Engineering, etc.)
- Predictive CTR Index with driver detection
- A/B Divergence (Metrics-weight vs Narrative-weight)
- Platform character budget validation with overrun alerts

### Operational Tools
- Cards View ↔ Spreadsheet Grid View toggle
- One-click Copy on every asset
- Download Complete Brand Kit (PDF)
- Export Content Calendar (CSV) — ready for Notion, Buffer, or Excel

---

## Project Structure

```
brand-story-generator/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── page.tsx            # Landing
│   │   ├── create/             # Questionnaire + generation
│   │   ├── login/
│   │   ├── dashboard/
│   │   └── api/generate/
│   ├── components/
│   │   ├── Questionnaire.tsx
│   │   ├── StoryResults.tsx
│   │   ├── BrandInsights.tsx
│   │   ├── PlatformAdCard.tsx
│   │   ├── SpreadsheetGrid.tsx
│   │   ├── PrintTemplate.tsx
│   │   └── ...
│   ├── lib/
│   │   ├── ai.ts               # AI generation + mock
│   │   ├── analytics.ts        # Full analytics engine
│   │   ├── auth.ts
│   │   └── utils.ts
│   ├── utils/
│   │   ├── pdfExporter.ts
│   │   └── csvExporter.ts
│   └── types/
└── ...
```

---

## Production Notes

- Replace client-side auth with **NextAuth.js / Auth.js** + a real database (Prisma + PostgreSQL or MongoDB).
- Deploy on **Vercel** — connect the repo and set environment variables.
- For Google login, configure OAuth credentials in NextAuth.
- Rate-limit the `/api/generate` endpoint and add usage quotas when moving to production.
- The analytics engine runs entirely in the browser — no extra backend cost.

---

## Scripts

| Command         | Description              |
|-----------------|--------------------------|
| `npm run dev`   | Start development server |
| `npm run build` | Production build         |
| `npm start`     | Start production server  |
| `npm run lint`  | Run ESLint               |

---

## License

MIT — free to use and extend for client or internal enterprise projects.

---

Built for professionals who treat personal branding as a measurable business asset.
