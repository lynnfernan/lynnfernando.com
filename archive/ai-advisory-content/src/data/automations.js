// ═══════════════════════════════════════════════════
// AUTOMATION CARD DATA
// "X-Minute Quick Win" step-by-step cards
// ═══════════════════════════════════════════════════

export const automations = [
  {
    id: "client-proposal",
    badge: "8-Min Win",
    number: "01",
    title: "Build a Client Proposal",
    titleHighlight: "in 8 Minutes Flat",
    audience: "rev-global",
    steps: [
      {
        title: "Paste your intake notes",
        body: "Drop your client call notes directly into Claude. Don't clean them up — raw is fine.",
      },
      {
        title: "Use this exact prompt",
        body: `"You are my strategic advisor. Turn these notes into a 1-page executive proposal with problem, solution, investment, and timeline."`,
        isPrompt: true,
      },
      {
        title: "Add your brand voice",
        body: `Append: "Write in a bold, empathetic, action-oriented tone. No fluff. No jargon."`,
        isPrompt: true,
      },
      {
        title: "Review + send",
        body: "Edit the numbers — never the structure. Claude nails the logic; you own the relationship.",
      },
    ],
    cta: {
      text: "Get 10 prompts like this every week →",
      label: "REV Global Newsletter",
      link: "#",
    },
  },

  {
    id: "linkedin-from-call",
    badge: "3-Min Win",
    number: "02",
    title: "Turn a Client Call",
    titleHighlight: "Into a LinkedIn Post",
    audience: "both",
    steps: [
      {
        title: "Jot 3 bullet points after the call",
        body: "What was the problem? What did you say that landed? What was the outcome or insight?",
      },
      {
        title: "Drop them into Claude with this prompt",
        body: `"Turn these 3 bullets into a LinkedIn post. Hook first. Conversational tone. End with a question. Under 200 words."`,
        isPrompt: true,
      },
      {
        title: "Run the 'make it more me' edit",
        body: `Paste your draft back and say: "Make this sound bolder and more direct. I'm a woman who runs a PE firm."`,
        isPrompt: true,
      },
      {
        title: "Copy, add one emoji, post",
        body: "Don't overthink it. The best LinkedIn posts are written in under 10 minutes. This is one of them.",
      },
    ],
    cta: {
      text: "More automations inside →",
      label: "Join the Newsletter",
      link: "#",
    },
  },

  {
    id: "investor-update",
    badge: "10-Min Win",
    number: "03",
    title: "Write Your Monthly",
    titleHighlight: "Investor Update Email",
    audience: "rev-global",
    steps: [
      {
        title: "Gather your 4 inputs",
        body: "Progress since last update, one win, one challenge, what you need from investors. Bullet points only.",
      },
      {
        title: "Use the investor update prompt",
        body: `"Write a professional investor update email. Tone: confident and transparent. Include: highlights, challenges, ask, and next milestone. Data provided below:"`,
        isPrompt: true,
      },
      {
        title: "Add the human layer",
        body: "Insert one personal line — a real moment, a lesson, something that shows you're IN it. Investors invest in people.",
      },
      {
        title: "Subject line last",
        body: `Ask Claude: "Give me 5 subject line options for this update. Make them specific, not vague."`,
        isPrompt: true,
      },
    ],
    cta: {
      text: "Templates for every investor touchpoint →",
      label: "REV Global Advisory",
      link: "#",
    },
  },

  // ── ADD NEW AUTOMATIONS BELOW ──
];
