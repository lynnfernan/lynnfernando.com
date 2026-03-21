"use client";

import { useState } from "react";

type Question = {
  id: number;
  dimension: string;
  text: string;
  options: { label: string; value: number }[];
};

const questions: Question[] = [
  // Data Readiness
  {
    id: 1,
    dimension: "Data Readiness",
    text: "How would you describe your organization's data quality and availability?",
    options: [
      { label: "Data is siloed, inconsistent, or hard to access", value: 1 },
      { label: "Some data is organized but gaps exist", value: 2 },
      { label: "Data is largely available and reasonably clean", value: 3 },
      { label: "Data is well-governed, accessible, and documented", value: 4 },
    ],
  },
  {
    id: 2,
    dimension: "Data Readiness",
    text: "Does your organization have a data governance policy?",
    options: [
      { label: "No formal policy exists", value: 1 },
      { label: "Informal practices, nothing documented", value: 2 },
      { label: "Policy exists but not consistently followed", value: 3 },
      { label: "Formal policy in place and actively enforced", value: 4 },
    ],
  },
  {
    id: 3,
    dimension: "Data Readiness",
    text: "How does your organization handle sensitive or regulated data (PII, HIPAA, GDPR, etc.)?",
    options: [
      { label: "We haven't assessed this yet", value: 1 },
      { label: "We're aware of requirements but compliance is inconsistent", value: 2 },
      { label: "We have processes but they need updating for AI", value: 3 },
      { label: "We have clear data handling controls aligned with AI use", value: 4 },
    ],
  },
  {
    id: 4,
    dimension: "Data Readiness",
    text: "How accessible is your organization's data for analysis or automation?",
    options: [
      { label: "Mostly locked in spreadsheets or legacy systems", value: 1 },
      { label: "Partially accessible via manual exports", value: 2 },
      { label: "Accessible via APIs or data warehouses for some teams", value: 3 },
      { label: "Centralized and accessible across the organization", value: 4 },
    ],
  },
  {
    id: 5,
    dimension: "Data Readiness",
    text: "Has your organization assessed what data would be needed for your top AI use cases?",
    options: [
      { label: "No — we haven't identified AI use cases yet", value: 1 },
      { label: "We have use cases in mind but haven't assessed data needs", value: 2 },
      { label: "Partially — for some use cases only", value: 3 },
      { label: "Yes — data needs are mapped for our priority use cases", value: 4 },
    ],
  },
  // Talent & Culture
  {
    id: 6,
    dimension: "Talent & Culture",
    text: "How would you describe your team's general AI literacy?",
    options: [
      { label: "Most employees are unfamiliar with AI tools", value: 1 },
      { label: "A few individuals are exploring AI independently", value: 2 },
      { label: "Several teams are actively using AI tools", value: 3 },
      { label: "AI fluency is growing organization-wide", value: 4 },
    ],
  },
  {
    id: 7,
    dimension: "Talent & Culture",
    text: "Does your organization have dedicated AI or data science talent?",
    options: [
      { label: "No AI-specific roles exist", value: 1 },
      { label: "Some technical staff have AI exposure", value: 2 },
      { label: "We have 1-2 people with AI expertise", value: 3 },
      { label: "We have a dedicated AI/data team or clear hiring plan", value: 4 },
    ],
  },
  {
    id: 8,
    dimension: "Talent & Culture",
    text: "How does leadership view AI investment?",
    options: [
      { label: "Skeptical or unaware — not a current priority", value: 1 },
      { label: "Curious but no clear mandate", value: 2 },
      { label: "Supportive — some budget allocated", value: 3 },
      { label: "Fully committed — AI is a strategic priority", value: 4 },
    ],
  },
  {
    id: 9,
    dimension: "Talent & Culture",
    text: "Is there organizational support for employees learning new AI tools?",
    options: [
      { label: "No training or upskilling programs exist", value: 1 },
      { label: "Employees are encouraged to learn on their own", value: 2 },
      { label: "Some training resources are available", value: 3 },
      { label: "Formal AI upskilling program is in place", value: 4 },
    ],
  },
  {
    id: 10,
    dimension: "Talent & Culture",
    text: "How does your culture respond to experimentation and failure?",
    options: [
      { label: "Risk-averse — mistakes are not tolerated", value: 1 },
      { label: "Cautious — experimentation requires heavy approval", value: 2 },
      { label: "Moderately open to pilots and testing", value: 3 },
      { label: "Innovation-friendly — fast iteration is encouraged", value: 4 },
    ],
  },
  // Governance & Risk
  {
    id: 11,
    dimension: "Governance & Risk",
    text: "Does your organization have an AI policy or guidelines for responsible AI use?",
    options: [
      { label: "No policy exists", value: 1 },
      { label: "Informal guidance only", value: 2 },
      { label: "Policy is in development", value: 3 },
      { label: "Formal AI policy is in place and communicated", value: 4 },
    ],
  },
  {
    id: 12,
    dimension: "Governance & Risk",
    text: "How does your organization evaluate risk when adopting new technology?",
    options: [
      { label: "We adopt quickly and address issues as they arise", value: 1 },
      { label: "Some informal risk review happens", value: 2 },
      { label: "Formal IT/legal review for significant tools", value: 3 },
      { label: "Structured risk framework applied to all new tools", value: 4 },
    ],
  },
  {
    id: 13,
    dimension: "Governance & Risk",
    text: "Are employees using AI tools (e.g., ChatGPT, Copilot) without organizational oversight?",
    options: [
      { label: "Yes — widespread unsanctioned AI use is likely", value: 1 },
      { label: "Probably — we haven't assessed usage", value: 2 },
      { label: "We've communicated guidelines but enforcement is inconsistent", value: 3 },
      { label: "Monitored and managed within a clear AI governance framework", value: 4 },
    ],
  },
  {
    id: 14,
    dimension: "Governance & Risk",
    text: "Has your organization assessed AI-related risks (bias, hallucination, IP, compliance)?",
    options: [
      { label: "No formal risk assessment has been done", value: 1 },
      { label: "We're aware of risks but haven't documented them", value: 2 },
      { label: "Some risks have been identified for key use cases", value: 3 },
      { label: "Comprehensive AI risk register exists and is maintained", value: 4 },
    ],
  },
  {
    id: 15,
    dimension: "Governance & Risk",
    text: "Is there a designated owner or committee for AI governance decisions?",
    options: [
      { label: "No — AI decisions are ad hoc", value: 1 },
      { label: "It falls to IT or legal informally", value: 2 },
      { label: "One person oversees AI decisions informally", value: 3 },
      { label: "Formal AI governance committee or role exists", value: 4 },
    ],
  },
  // Use Case Maturity
  {
    id: 16,
    dimension: "Use Case Maturity",
    text: "Has your organization identified specific GenAI use cases it wants to pursue?",
    options: [
      { label: "No — we're still at the awareness stage", value: 1 },
      { label: "Some informal ideas have been discussed", value: 2 },
      { label: "A short list of use cases has been identified", value: 3 },
      { label: "Prioritized use cases with business cases are defined", value: 4 },
    ],
  },
  {
    id: 17,
    dimension: "Use Case Maturity",
    text: "Has your organization piloted or deployed any GenAI solutions?",
    options: [
      { label: "No pilots or deployments yet", value: 1 },
      { label: "Individual experiments by a few employees", value: 2 },
      { label: "One or more formal pilots have been run", value: 3 },
      { label: "Multiple GenAI solutions are in active use", value: 4 },
    ],
  },
  {
    id: 18,
    dimension: "Use Case Maturity",
    text: "How does your organization evaluate success of technology initiatives?",
    options: [
      { label: "No formal KPIs or metrics used", value: 1 },
      { label: "Success is assessed informally", value: 2 },
      { label: "KPIs exist for some initiatives", value: 3 },
      { label: "Robust measurement framework applied to all tech initiatives", value: 4 },
    ],
  },
  {
    id: 19,
    dimension: "Use Case Maturity",
    text: "How connected are your AI ambitions to broader business strategy?",
    options: [
      { label: "AI is not part of our strategic plan", value: 1 },
      { label: "Mentioned in strategy but not actionable", value: 2 },
      { label: "AI initiatives are linked to 1-2 strategic goals", value: 3 },
      { label: "AI is deeply embedded in our multi-year strategic roadmap", value: 4 },
    ],
  },
  {
    id: 20,
    dimension: "Use Case Maturity",
    text: "Does your organization have a budget allocated for AI exploration or implementation?",
    options: [
      { label: "No budget — we're in awareness mode", value: 1 },
      { label: "Small discretionary budget for tools", value: 2 },
      { label: "Defined budget for AI pilots", value: 3 },
      { label: "Dedicated AI budget with multi-year commitment", value: 4 },
    ],
  },
];

type Tier = {
  label: string;
  color: string;
  bgColor: string;
  description: string;
  recommendations: string[];
};

const tiers: Tier[] = [
  {
    label: "Exploring",
    color: "text-amber-700",
    bgColor: "bg-amber-50 border-amber-200",
    description:
      "Your organization is at the start of its AI journey. This is actually a great position — you can build the right foundations without legacy baggage.",
    recommendations: [
      "Start with AI literacy: run an executive briefing and team workshops",
      "Identify 2-3 low-risk, high-value use cases to pilot",
      "Establish basic AI governance guidelines before scaling",
      "Audit your data quality in one key business domain",
      "Assign an internal AI champion to drive momentum",
    ],
  },
  {
    label: "Building",
    color: "text-blue-700",
    bgColor: "bg-blue-50 border-blue-200",
    description:
      "You have promising foundations and early momentum. Now is the time to formalize your approach and accelerate strategically.",
    recommendations: [
      "Formalize your AI governance and risk framework",
      "Build a prioritized GenAI use case roadmap with ROI estimates",
      "Invest in targeted upskilling for key roles",
      "Move from informal pilots to tracked, measured experiments",
      "Develop a vendor evaluation process for GenAI tools",
    ],
  },
  {
    label: "Scaling",
    color: "text-green-700",
    bgColor: "bg-green-50 border-green-200",
    description:
      "You're ahead of most organizations. You have real deployments, growing AI capability, and leadership support. Focus now on scaling responsibly and driving measurable business impact.",
    recommendations: [
      "Establish a Center of Excellence or AI guild to share learnings",
      "Deepen your data infrastructure to support more advanced AI",
      "Expand AI upskilling organization-wide, not just technical staff",
      "Implement robust measurement and feedback loops for AI initiatives",
      "Explore advanced use cases: agentic workflows, custom fine-tuning, etc.",
    ],
  },
];

function getTier(score: number, max: number): Tier {
  const pct = score / max;
  if (pct < 0.45) return tiers[0];
  if (pct < 0.72) return tiers[1];
  return tiers[2];
}

type DimensionScore = {
  name: string;
  score: number;
  max: number;
};

export default function AssessmentTool() {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [emailError, setEmailError] = useState("");

  const q = questions[current];
  const progress = ((current) / questions.length) * 100;
  const totalAnswered = Object.keys(answers).length;
  const allAnswered = totalAnswered === questions.length;

  function selectAnswer(value: number) {
    setAnswers((prev) => ({ ...prev, [q.id]: value }));
    if (current < questions.length - 1) {
      setTimeout(() => setCurrent((c) => c + 1), 300);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !name) {
      setEmailError("Please fill in both fields.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError("Please enter a valid email address.");
      return;
    }
    setEmailError("");
    setShowResults(true);
  }

  function getResults() {
    const totalScore = Object.values(answers).reduce((a, b) => a + b, 0);
    const maxScore = questions.length * 4;
    const tier = getTier(totalScore, maxScore);

    const dimensions: DimensionScore[] = [
      "Data Readiness",
      "Talent & Culture",
      "Governance & Risk",
      "Use Case Maturity",
    ].map((dim) => {
      const dimQuestions = questions.filter((q) => q.dimension === dim);
      const dimScore = dimQuestions.reduce((sum, q) => sum + (answers[q.id] ?? 0), 0);
      return { name: dim, score: dimScore, max: dimQuestions.length * 4 };
    });

    return { totalScore, maxScore, tier, dimensions };
  }

  if (showResults) {
    const { totalScore, maxScore, tier, dimensions } = getResults();
    const pct = Math.round((totalScore / maxScore) * 100);

    return (
      <div className="space-y-6">
        <div className={`border rounded-xl p-6 ${tier.bgColor}`}>
          <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">
            Your Readiness Level
          </p>
          <h2 className={`text-3xl font-bold mb-2 ${tier.color}`}>{tier.label}</h2>
          <p className="text-slate-600 mb-2">{tier.description}</p>
          <p className="text-sm text-slate-500">
            Score: {totalScore} / {maxScore} ({pct}%)
          </p>
        </div>

        {/* Dimension breakdown */}
        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <h3 className="font-bold text-slate-900 mb-4">Dimension Breakdown</h3>
          <div className="space-y-4">
            {dimensions.map((d) => {
              const dimPct = Math.round((d.score / d.max) * 100);
              return (
                <div key={d.name}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-slate-700">{d.name}</span>
                    <span className="text-slate-500">
                      {d.score}/{d.max}
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all"
                      style={{ width: `${dimPct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recommendations */}
        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <h3 className="font-bold text-slate-900 mb-4">Top Recommendations</h3>
          <ul className="space-y-2">
            {tier.recommendations.map((rec, i) => (
              <li key={i} className="flex gap-3 text-sm text-slate-700">
                <span className="text-blue-500 font-bold mt-0.5">✓</span>
                {rec}
              </li>
            ))}
          </ul>
        </div>

        {/* CTA */}
        <div className="bg-blue-600 text-white rounded-xl p-6 text-center">
          <h3 className="font-bold text-lg mb-2">Want a Full Readiness Report?</h3>
          <p className="text-blue-100 text-sm mb-4">
            I can provide a detailed readiness analysis with a custom action plan tailored to your organization.
          </p>
          <a
            href={`mailto:lynn@revglobalinc.com?subject=AI Readiness Assessment Follow-up&body=Hi Lynn, I just completed the GenAI Readiness Assessment and received a ${tier.label} score (${pct}%). I'd love to discuss a full readiness report.`}
            className="inline-block bg-white text-blue-700 font-semibold px-6 py-2.5 rounded-lg hover:bg-blue-50 transition-colors text-sm"
          >
            Request a Full Report →
          </a>
        </div>
      </div>
    );
  }

  // Email gate (shown after answering all questions)
  if (allAnswered && current === questions.length - 1 && answers[q.id]) {
    return (
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
        <h3 className="font-bold text-slate-900 text-xl mb-2">
          Almost there! Your results are ready.
        </h3>
        <p className="text-slate-600 text-sm mb-5">
          Enter your details to see your GenAI Readiness Score and personalized action plan.
        </p>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              First Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Jane"
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Work Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="jane@company.com"
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {emailError && <p className="text-red-600 text-xs">{emailError}</p>}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-2.5 rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            See My Results →
          </button>
          <p className="text-xs text-slate-400 text-center">No spam. Unsubscribe anytime.</p>
        </form>
      </div>
    );
  }

  // Question UI
  return (
    <div className="space-y-6">
      {/* Progress */}
      <div>
        <div className="flex justify-between text-xs text-slate-500 mb-1">
          <span>
            Question {current + 1} of {questions.length}
          </span>
          <span>{q.dimension}</span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-2">
          <div
            className="bg-blue-500 h-2 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div>
        <h3 className="text-lg font-semibold text-slate-900 mb-4">{q.text}</h3>
        <div className="space-y-3">
          {q.options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => selectAnswer(opt.value)}
              className={`w-full text-left border rounded-lg px-4 py-3 text-sm transition-all ${
                answers[q.id] === opt.value
                  ? "border-blue-500 bg-blue-50 text-blue-800 font-medium"
                  : "border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 text-slate-700"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={() => setCurrent((c) => Math.max(0, c - 1))}
          disabled={current === 0}
          className="text-sm text-slate-500 hover:text-slate-800 disabled:opacity-30"
        >
          ← Back
        </button>
        {answers[q.id] && current < questions.length - 1 && (
          <button
            onClick={() => setCurrent((c) => c + 1)}
            className="text-sm text-blue-600 font-medium hover:underline"
          >
            Next →
          </button>
        )}
        {answers[q.id] && current === questions.length - 1 && (
          <button
            onClick={() =>
              setCurrent(questions.length - 1)
            }
            className="text-sm text-blue-600 font-medium hover:underline"
          >
            View Results →
          </button>
        )}
      </div>
    </div>
  );
}
