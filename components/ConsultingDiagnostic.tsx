"use client";

import { useState } from "react";

type ArchetypeKey = "brand" | "revenue" | "launch" | "transform";

type Question = {
  id: number;
  text: string;
  options: { label: string; archetype: ArchetypeKey }[];
};

const questions: Question[] = [
  {
    id: 1,
    text: "When you've done your best work, what was the actual outcome that made it matter?",
    options: [
      { label: "I made brands culturally relevant and visible at scale", archetype: "brand" },
      { label: "I built revenue engines: partnerships, channels, distribution", archetype: "revenue" },
      { label: "I took something from zero to market and made it commercially viable", archetype: "launch" },
      { label: "I transformed how a company thought about and executed growth", archetype: "transform" },
    ],
  },
  {
    id: 2,
    text: "When an ideal consulting client hires you and it goes perfectly, what do they say you did?",
    options: [
      { label: "You made us look and sound like a real brand", archetype: "brand" },
      { label: "You built the system that scaled our revenue", archetype: "revenue" },
      { label: "You opened doors and relationships we couldn't access", archetype: "launch" },
      { label: "You figured out what we were actually selling and to whom", archetype: "transform" },
    ],
  },
  {
    id: 3,
    text: "Where do you want to spend most of your consulting hours?",
    options: [
      { label: "On the brand: positioning, messaging, creative direction", archetype: "brand" },
      { label: "In the room: pitching, negotiating, building partnerships", archetype: "revenue" },
      { label: "Embedded in the business: building and running the system", archetype: "launch" },
      { label: "In the strategy: diagnosing, architecting, advising", archetype: "transform" },
    ],
  },
];

type Archetype = {
  key: ArchetypeKey;
  name: string;
  tagline: string;
  description: string;
  offers: string[];
};

const archetypes: Record<ArchetypeKey, Archetype> = {
  brand: {
    key: "brand",
    name: "The Brand Architect",
    tagline: "You make brands impossible to ignore.",
    description:
      "Your edge is cultural fluency. You understand how brands earn attention, build loyalty, and command premium positioning. Where others see a logo and a tagline, you see a system — voice, story, identity, and presence working together. Clients hire you when they need to stop being invisible and start meaning something.",
    offers: [
      "Brand strategy & positioning engagements",
      "Messaging architecture and narrative development",
      "Go-to-market identity and launch creative direction",
      "Brand refresh and repositioning advisory",
      "Cultural relevance and audience strategy",
    ],
  },
  revenue: {
    key: "revenue",
    name: "The Revenue Engineer",
    tagline: "You build the systems that make money move.",
    description:
      "You're the person who makes the commercial side actually work. You know how to structure partnerships, build channels, and design distribution systems that compound over time. You don't just open doors — you build the infrastructure behind them. Clients hire you when they have a product but no engine to sell it.",
    offers: [
      "Partnership strategy and business development",
      "Channel development and distribution architecture",
      "Revenue operations and pipeline advisory",
      "BD playbook design and implementation",
      "Licensing, co-marketing, and alliance structuring",
    ],
  },
  launch: {
    key: "launch",
    name: "The Market Launcher",
    tagline: "You take things from zero to real.",
    description:
      "You have a rare skill: turning an idea into a commercially viable product or service. You understand product-market fit, pricing, customer discovery, and what it takes to survive the early stages. You're most valuable when the path doesn't exist yet and someone needs to build it. Clients hire you when they're staring at a blank page and need someone to write the first chapter.",
    offers: [
      "Go-to-market strategy and launch planning",
      "Commercialization roadmaps and pricing strategy",
      "Product-market fit workshops",
      "New market entry and expansion advisory",
      "Early-stage fractional CMO or CGO",
    ],
  },
  transform: {
    key: "transform",
    name: "The Growth Transformer",
    tagline: "You change how companies think about growth.",
    description:
      "You operate at the level of clarity and diagnosis. You see the real problem before anyone else does, and you know how to restructure the thinking around it. Your consulting isn't about deliverables — it's about unlocking how a leadership team sees and pursues opportunity. Clients hire you when they're stuck and don't fully know why.",
    offers: [
      "Growth strategy advisory and organizational diagnosis",
      "Fractional Chief Marketing or Growth Officer",
      "Executive team strategy workshops and facilitation",
      "Strategic planning and annual growth roadmapping",
      "Board-level advisory and investor narrative development",
    ],
  },
};

function getResult(answers: Record<number, ArchetypeKey>): ArchetypeKey[] {
  const counts: Record<ArchetypeKey, number> = { brand: 0, revenue: 0, launch: 0, transform: 0 };
  Object.values(answers).forEach((a) => counts[a]++);
  const max = Math.max(...Object.values(counts));
  return (Object.keys(counts) as ArchetypeKey[]).filter((k) => counts[k] === max);
}

export default function ConsultingDiagnostic() {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<number, ArchetypeKey>>({});
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [showResults, setShowResults] = useState(false);

  const q = questions[current];
  const progress = (current / questions.length) * 100;
  const allAnswered = Object.keys(answers).length === questions.length;

  function selectAnswer(archetype: ArchetypeKey) {
    const next = { ...answers, [q.id]: archetype };
    setAnswers(next);
    if (current < questions.length - 1) {
      setTimeout(() => setCurrent((c) => c + 1), 300);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !email) {
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

  if (showResults) {
    const topKeys = getResult(answers);
    const primary = archetypes[topKeys[0]];
    const secondary = topKeys.length > 1 ? archetypes[topKeys[1]] : null;

    return (
      <div className="space-y-5">
        <div className="rounded-xl border border-[#FF0080]/30 bg-[#FF0080]/5 p-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#FF0080] mb-1">
            Your Consulting Archetype
          </p>
          <h2 className="text-2xl font-bold text-slate-900 mb-1">{primary.name}</h2>
          <p className="text-sm font-medium text-slate-500 italic mb-3">{primary.tagline}</p>
          <p className="text-sm text-slate-700 leading-relaxed">{primary.description}</p>
        </div>

        {secondary && (
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-1">
              Strong Secondary Archetype
            </p>
            <p className="text-sm font-semibold text-slate-700">{secondary.name}</p>
            <p className="text-xs text-slate-500 italic">{secondary.tagline}</p>
          </div>
        )}

        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <h3 className="font-bold text-slate-900 mb-3 text-sm uppercase tracking-wider">
            Offers You Should Be Selling
          </h3>
          <ul className="space-y-2">
            {primary.offers.map((offer, i) => (
              <li key={i} className="flex gap-3 text-sm text-slate-700">
                <span className="text-[#FF0080] font-bold mt-0.5 shrink-0">→</span>
                {offer}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-xl bg-slate-900 text-white p-6 text-center">
          <h3 className="font-bold text-lg mb-2">Want to build your consulting offer?</h3>
          <p className="text-slate-400 text-sm mb-4">
            Let's turn your archetype into a real consulting practice — positioning, pricing, and pipeline.
          </p>
          <a
            href={`mailto:lynn@revglobalinc.com?subject=Consulting Diagnostic — ${primary.name}&body=Hi Lynn, I completed the diagnostic and I'm a ${primary.name}. I'd love to talk about building out my consulting practice.`}
            className="inline-block bg-[#FF0080] text-white font-semibold px-6 py-2.5 rounded-lg hover:bg-[#cc0066] transition-colors text-sm"
          >
            Let's Talk →
          </a>
        </div>
      </div>
    );
  }

  // Email gate after all questions answered
  if (allAnswered && answers[q.id]) {
    return (
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-6">
        <h3 className="font-bold text-slate-900 text-xl mb-2">Your archetype is ready.</h3>
        <p className="text-slate-600 text-sm mb-5">
          Enter your details to see your consulting identity and the offers you should be selling.
        </p>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">First Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Alex"
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF0080]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF0080]"
            />
          </div>
          {emailError && <p className="text-red-600 text-xs">{emailError}</p>}
          <button
            type="submit"
            className="w-full bg-[#FF0080] text-white font-semibold py-2.5 rounded-lg hover:bg-[#cc0066] transition-colors text-sm"
          >
            See My Archetype →
          </button>
          <p className="text-xs text-slate-400 text-center">No spam. Unsubscribe anytime.</p>
        </form>
      </div>
    );
  }

  // Question UI
  return (
    <div className="space-y-6">
      <div>
        <div className="flex justify-between text-xs text-slate-500 mb-1">
          <span>Question {current + 1} of {questions.length}</span>
          <span>{Math.round(progress)}% complete</span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-1.5">
          <div
            className="bg-[#FF0080] h-1.5 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div>
        <h3 className="text-base font-semibold text-slate-900 mb-4 leading-snug">{q.text}</h3>
        <div className="space-y-3">
          {q.options.map((opt) => (
            <button
              key={opt.archetype}
              onClick={() => selectAnswer(opt.archetype)}
              className={`w-full text-left border rounded-lg px-4 py-3 text-sm transition-all ${
                answers[q.id] === opt.archetype
                  ? "border-[#FF0080] bg-[#FF0080]/5 text-slate-900 font-medium"
                  : "border-slate-200 hover:border-[#FF0080]/40 hover:bg-[#FF0080]/5 text-slate-700"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

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
            className="text-sm text-[#FF0080] font-medium hover:underline"
          >
            Next →
          </button>
        )}
      </div>
    </div>
  );
}
