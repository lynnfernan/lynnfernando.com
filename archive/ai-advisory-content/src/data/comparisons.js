// ═══════════════════════════════════════════════════
// COMPARISON CARD DATA
// "Which AI Tool For X?" infographic content
// Add new comparisons here — components auto-render
// ═══════════════════════════════════════════════════

export const comparisons = [
  {
    id: "llm-for-business",
    eyebrow: "REV Global AI Briefing",
    title: "Which AI Tool",
    titleHighlight: "For Your Business?",
    subtitle: "Executive breakdown of the dominant AI platforms",
    audience: "rev-global", // "rev-global" | "lynn-advisory" | "both"
    tools: [
      {
        name: "Claude",
        role: "The Strategist",
        icon: "✦",
        iconBg: "#1A3050",
        iconColor: "#4A9EFF",
        nameColor: "#1B3A6B",
        useCase: "Long-form writing, investor memos, legal summaries, brand voice docs",
        edge: "Nuance + Safety",
        edgeStyle: "gold",
        tags: ["Writing", "Strategy", "Safety"],
      },
      {
        name: "ChatGPT",
        role: "The Assistant",
        icon: "⬡",
        iconBg: "#F0F8F0",
        iconColor: "#3A8A3A",
        nameColor: "#2D7A2D",
        useCase: "Daily tasks, email drafts, customer FAQs, quick research",
        edge: "Speed + Scale",
        edgeStyle: "blue",
        tags: ["Logic", "Voice", "Agents"],
      },
      {
        name: "Gemini",
        role: "The Researcher",
        icon: "✧",
        iconBg: "#F0F4FF",
        iconColor: "#4168D4",
        nameColor: "#4168D4",
        useCase: "Large doc analysis, Google Workspace integration, data synthesis",
        edge: "Deep Context",
        edgeStyle: "green",
        tags: ["Video", "Images", "Context"],
      },
      {
        name: "Perplexity",
        role: "The Scout",
        icon: "◎",
        iconBg: "#FFF4F0",
        iconColor: "#D44141",
        nameColor: "#C0392B",
        useCase: "Real-time market intel, competitor research, live citations",
        edge: "Live Web",
        edgeStyle: "red",
        tags: ["Search", "Citations", "Live"],
      },
    ],
    footer: {
      brand: "lynn fernando · AI advisory",
      link: "lynnfernando.com/ai",
    },
  },

  {
    id: "llm-for-founders",
    eyebrow: "LynnFernando.com AI Advisory",
    title: "Which AI Tool",
    titleHighlight: "For Women Founders?",
    subtitle: "Plain-English breakdown for non-technical entrepreneurs",
    audience: "lynn-advisory",
    tools: [
      {
        name: "Claude",
        role: "Your Writer",
        icon: "✦",
        iconBg: "#1A3050",
        iconColor: "#4A9EFF",
        nameColor: "#1B3A6B",
        useCase: "Pitch decks, grant writing, investor emails, brand storytelling",
        edge: "Best Writing",
        edgeStyle: "gold",
        tags: ["Writing", "Brand", "Pitch"],
      },
      {
        name: "ChatGPT",
        role: "Your Daily Helper",
        icon: "⬡",
        iconBg: "#F0F8F0",
        iconColor: "#3A8A3A",
        nameColor: "#2D7A2D",
        useCase: "Social captions, customer replies, scheduling, task checklists",
        edge: "Most Popular",
        edgeStyle: "blue",
        tags: ["Tasks", "Social", "Chat"],
      },
      {
        name: "Gemini",
        role: "Your Google BFF",
        icon: "✧",
        iconBg: "#F0F4FF",
        iconColor: "#4168D4",
        nameColor: "#4168D4",
        useCase: "Works directly in Gmail, Docs, Sheets — zero learning curve",
        edge: "No New Apps",
        edgeStyle: "green",
        tags: ["Gmail", "Sheets", "Docs"],
      },
      {
        name: "Canva AI",
        role: "Your Designer",
        icon: "◈",
        iconBg: "#FFF0F8",
        iconColor: "#D441A1",
        nameColor: "#A03080",
        useCase: "Social graphics, pitch deck slides, brand assets — no design skills needed",
        edge: "Visual Power",
        edgeStyle: "purple",
        tags: ["Design", "Brand", "Social"],
      },
    ],
    footer: {
      brand: "lynn fernando · for women founders",
      link: "lynnfernando.com/ai",
    },
  },

  // ── ADD NEW COMPARISONS BELOW ──
  // Copy the object above, change the id and content
];
