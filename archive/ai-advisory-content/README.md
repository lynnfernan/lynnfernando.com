# Lynn Fernando — AI Advisory Content System
## REV Global × LynnFernando.com

A reusable component library for generating branded AI advisory newsletter content and infographics.

---

## Project Structure

```
ai-advisory-content/
├── src/
│   ├── components/
│   │   ├── ComparisonCard.jsx       ← "Which AI for X?" infographics
│   │   ├── AutomationCard.jsx       ← Step-by-step quick win cards
│   │   ├── SafetyCard.jsx           ← AI safety best practices cards
│   │   ├── PromptCard.jsx           ← Prompt of the Week cards
│   │   ├── NewsletterIssue.jsx      ← Full newsletter layout wrapper
│   │   └── NewsletterHeader.jsx     ← Branded header component
│   ├── data/
│   │   ├── comparisons.js           ← All comparison card content
│   │   ├── automations.js           ← Automation card content
│   │   ├── safety.js                ← Safety card content
│   │   └── prompts.js               ← Prompt of the week content
│   └── styles/
│       └── tokens.css               ← Brand design tokens
├── newsletters/
│   ├── issue-01.md                  ← Foundation: Which AI for Your Business?
│   ├── issue-02.md                  ← Quick Win: 8-Minute Proposal
│   ├── issue-03.md                  ← ROI Proof: My AI Workflow
│   └── issue-04.md                  ← Convert: Book Your AI Audit
└── README.md
```

## Quick Start

1. Open folder in VS Code
2. Install deps: `npm install`
3. Run dev server: `npm run dev`
4. Edit content in `/src/data/` — components auto-update
5. Export infographic as PNG using browser screenshot or Puppeteer

## Content Agent Instructions

Each data file exports an array of objects. To add new content:
1. Open the relevant data file (e.g., `comparisons.js`)
2. Copy an existing object and modify the fields
3. The component renders automatically from the data

## Brand Tokens
- Primary: `#C9A84C` (Gold)
- Dark: `#0A1628` (Navy)
- Accent: `#2D5BE3` (Blue)
- Background Light: `#FAF6EE` (Cream)
