export type ResourceFormat = "Article" | "Tool" | "Download" | "Template";

export type Resource = {
  slug: string;
  title: string;
  description: string;
  format: ResourceFormat;
  audience: string;
  gated: boolean;
  downloadPath?: string;
  ctaLabel: string;
  ctaHref: string;
};

export const resources: Resource[] = [
  {
    slug: "executive-guide-to-genai",
    title: "The Executive's Guide to Generative AI",
    description:
      "Cut through the hype. A practical primer for non-technical leaders covering what GenAI actually is, key business capabilities, risk landscape, and 5 questions every leader should be asking.",
    format: "Article",
    audience: "C-Suite & Board Members",
    gated: false,
    ctaLabel: "Book an Executive Briefing",
    ctaHref: "mailto:lynn@revglobalinc.com?subject=Executive Briefing Inquiry",
  },
  {
    slug: "genai-readiness-assessment",
    title: "GenAI Readiness Assessment",
    description:
      "Find out where your organization stands. Answer 20 questions across data, talent, governance, and use-case maturity to get a personalized readiness score and action plan.",
    format: "Tool",
    audience: "Operations & IT Leaders",
    gated: true,
    ctaLabel: "Take the Assessment",
    ctaHref: "/resources/genai-readiness-assessment",
  },
  {
    slug: "prompt-engineering-playbook",
    title: "Prompt Engineering Playbook for Business Teams",
    description:
      "50+ business-use-case prompts organized by function — HR, Finance, Marketing, and Operations — with a repeatable RCOF framework (Role, Context, Output, Format) and real before/after examples.",
    format: "Download",
    audience: "Business Professionals & Teams",
    gated: true,
    downloadPath: "/downloads/prompt-engineering-playbook.pdf",
    ctaLabel: "Download the Playbook",
    ctaHref: "/resources/prompt-engineering-playbook",
  },
  {
    slug: "use-case-prioritization-framework",
    title: "GenAI Use Case Prioritization Framework",
    description:
      "A practical decision framework to help teams identify, score, and prioritize GenAI use cases. Includes a 2x2 impact-vs-effort matrix, 6-criteria scoring rubric, and 10 worked examples.",
    format: "Template",
    audience: "Strategy & Innovation Teams",
    gated: true,
    downloadPath: "/downloads/use-case-prioritization-framework.pdf",
    ctaLabel: "Download the Framework",
    ctaHref: "/resources/use-case-prioritization-framework",
  },
  {
    slug: "vendor-evaluation-checklist",
    title: "AI Vendor Evaluation Checklist",
    description:
      "40 questions across 7 categories to evaluate any GenAI tool or vendor — security, model quality, integration, pricing, support, vendor stability, and data privacy. Includes red flags and demo questions.",
    format: "Download",
    audience: "Procurement, IT & Leadership",
    gated: false,
    downloadPath: "/downloads/vendor-evaluation-checklist.pdf",
    ctaLabel: "Get the Checklist",
    ctaHref: "/resources/vendor-evaluation-checklist",
  },
  {
    slug: "genai-roi-business-case",
    title: "GenAI Business Case & ROI Template",
    description:
      "Build a compelling internal business case for AI investment. Includes templates for baseline cost, productivity gains, risk-adjusted ROI, payback period, and a stakeholder alignment checklist.",
    format: "Template",
    audience: "Managers & Executives",
    gated: true,
    downloadPath: "/downloads/genai-roi-business-case.pdf",
    ctaLabel: "Download the Template",
    ctaHref: "/resources/genai-roi-business-case",
  },
  {
    slug: "beginners-guide-to-angel-investing",
    title: "A Beginner's Guide to Angel Investing in Startups",
    description:
      "Thinking about writing your first angel check? This guide covers how startup funding works, deal structures (SAFEs, convertible notes), what to look for in founders and markets, and how to build a diversified angel portfolio.",
    format: "Article",
    audience: "Executives & Business Professionals",
    gated: false,
    ctaLabel: "Let's Talk Investing",
    ctaHref: "mailto:lynn@revglobalinc.com?subject=Angel Investing Inquiry",
  },
  {
    slug: "speaking-workshop-menu",
    title: "Speaking & Workshop Menu",
    description:
      "Keynotes and workshops designed to make AI real and actionable for your audience. Available for conferences, executive offsites, company all-hands, and leadership programs.",
    format: "Article",
    audience: "Event Organizers & HR/L&D Leaders",
    gated: false,
    ctaLabel: "Book Lynn to Speak",
    ctaHref: "mailto:lynn@revglobalinc.com?subject=Speaking Inquiry",
  },
];

export function getResourceBySlug(slug: string): Resource | undefined {
  return resources.find((r) => r.slug === slug);
}
