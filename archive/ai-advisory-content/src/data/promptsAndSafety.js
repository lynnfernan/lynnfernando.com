// ═══════════════════════════════════════════════════
// SAFETY CARD DATA
// "Safe AI for Business" best practice cards
// ═══════════════════════════════════════════════════

export const safetyCards = [
  {
    id: "what-not-to-share",
    eyebrow: "AI Safety Briefing",
    title: "What NOT To Share",
    titleHighlight: "With Any AI Tool",
    audience: "both",
    rows: [
      {
        icon: "🚫",
        iconStyle: "danger",
        title: "Never share login credentials or passwords",
        body: "Even 'just to help me log in' — no AI tool needs your passwords. Ever. Full stop.",
      },
      {
        icon: "🚫",
        iconStyle: "danger",
        title: "Client names + deal specifics together",
        body: "Use initials or 'Client A.' Combine a real name with a dollar amount and you've created a data liability.",
      },
      {
        icon: "⚠️",
        iconStyle: "warning",
        title: "Social Security or EIN numbers",
        body: "Never input these into a free AI interface. Use enterprise tiers with signed data privacy agreements.",
      },
      {
        icon: "⚠️",
        iconStyle: "warning",
        title: "Wire instructions or banking details",
        body: "AI tools can be accessed through shared networks. No financial routing info, ever.",
      },
      {
        icon: "✅",
        iconStyle: "success",
        title: "Safe: anonymized data + context",
        body: "Remove names, swap real numbers for ranges, describe deals in general terms. You get 95% of the value.",
      },
    ],
    ruleOfThumb: "Would you be comfortable if this appeared in a press release? If no — anonymize it first.",
    footer: {
      brand: "lynn fernando · AI advisory",
      link: "lynnfernando.com/ai",
    },
  },

  {
    id: "token-limits",
    eyebrow: "AI Basics — No Jargon",
    title: "Claude's Token Limit",
    titleHighlight: "Explained in Plain English",
    audience: "lynn-advisory",
    rows: [
      {
        icon: "📄",
        iconStyle: "success",
        title: "A 'token' is basically a word chunk",
        body: "Think of tokens like puzzle pieces. Claude can only hold so many pieces in its head at once.",
      },
      {
        icon: "⚠️",
        iconStyle: "warning",
        title: "Why your response gets cut off mid-sentence",
        body: "You hit the limit. Claude didn't forget you — it ran out of working memory for that conversation.",
      },
      {
        icon: "✅",
        iconStyle: "success",
        title: "Fix it: start a new chat and paste key context",
        body: "Open a new conversation. Paste: 'Here's what we've covered so far:' then 2-3 bullet points. Claude reorients instantly.",
      },
      {
        icon: "✅",
        iconStyle: "success",
        title: "Pro upgrade gives you 5x more tokens",
        body: "Claude Pro ($20/mo) handles 200,000 tokens — roughly a full book. Worth it if you're using AI for client work.",
      },
    ],
    ruleOfThumb: "If Claude starts giving shorter, vaguer answers — the context window is filling up. Start fresh.",
    footer: {
      brand: "lynn fernando · AI advisory",
      link: "lynnfernando.com/ai",
    },
  },
];


// ═══════════════════════════════════════════════════
// PROMPT OF THE WEEK DATA
// Weekly plug-and-play prompts for subscribers
// ═══════════════════════════════════════════════════

export const weeklyPrompts = [
  {
    id: "boardroom-voice",
    week: "Week 1",
    title: "The Boardroom Voice Prompt",
    description: "Instantly elevate any writing to executive-level clarity and authority.",
    audience: "rev-global",
    prompt: `Rewrite the following text in a boardroom-ready executive voice. Requirements: confident but not arrogant, specific not vague, active verbs, no corporate jargon, no filler phrases like 'it's important to note.' Strip any hedging language. Make every sentence earn its place.

[PASTE YOUR TEXT HERE]`,
    useWith: "Claude (recommended) or ChatGPT",
    proTip: "Use this after you've drafted anything — emails, proposals, investor updates. It's your final polish layer.",
    tags: ["Writing", "Executive", "Brand Voice"],
  },

  {
    id: "deal-summary",
    week: "Week 2",
    title: "The Deal Summary Prompt",
    description: "Turn messy deal notes into a clean 1-page executive summary in seconds.",
    audience: "rev-global",
    prompt: `You are an M&A analyst. Turn the following deal notes into a structured 1-page executive summary with these sections: (1) Deal Overview, (2) Key Financials, (3) Strategic Rationale, (4) Risks & Mitigants, (5) Recommended Next Step. Use bullet points under each section. Be concise — max 3 bullets per section. Tone: professional and direct.

[PASTE YOUR DEAL NOTES HERE]`,
    useWith: "Claude (best for financial docs)",
    proTip: "Anonymize client names before pasting. Use 'Target Co.' and 'Acquirer Co.' instead of real names.",
    tags: ["M&A", "Finance", "Deal Flow"],
  },

  {
    id: "content-repurpose",
    week: "Week 3",
    title: "The Content Repurpose Prompt",
    description: "Turn one piece of content into 5 formats for 5 different channels.",
    audience: "both",
    prompt: `Take the content below and repurpose it into 5 formats:
1. LinkedIn post (under 200 words, hook first, end with question)
2. Instagram caption (punchy, 3 lines max, 3 relevant hashtags)
3. Email newsletter intro paragraph (warm, personal, 3 sentences)
4. Twitter/X thread (5 tweets, numbered, last tweet = CTA)
5. One-liner for a slide deck

Keep my voice: bold, empathetic, action-oriented. I'm a woman founder and PE advisor.

[PASTE YOUR ORIGINAL CONTENT HERE]`,
    useWith: "Claude or ChatGPT",
    proTip: "Feed it your best newsletter issue and you'll have a month of social content in 5 minutes.",
    tags: ["Content", "Social", "Repurpose"],
  },

  {
    id: "investor-email",
    week: "Week 4",
    title: "The Investor Outreach Prompt",
    description: "Cold outreach that doesn't feel cold — personalized, specific, and easy to say yes to.",
    audience: "rev-global",
    prompt: `Write a cold outreach email to a potential LP investor for my Qualified Opportunity Zone fund. Details:
- Fund name: AWP Overwatch QOZ Fund
- Target raise: $150M
- Focus: U.S. defense manufacturing, supply chain, renewable infrastructure
- Tax benefit: Capital gains deferral and potential elimination through QOZ
- My background: [YOUR 2-LINE BIO]
- Why I'm reaching out to them specifically: [THEIR BACKGROUND/CONNECTION]

Requirements: Under 200 words. Subject line included. One specific ask at the end (a 20-minute call). No hype language. No attachments mentioned. Professional but human.`,
    useWith: "Claude (best for financial/legal tone)",
    proTip: "Customize the 'why I'm reaching out' line for every single send. Personalization is the difference between ignored and replied to.",
    tags: ["Investor", "Fundraising", "Cold Outreach"],
  },
];
