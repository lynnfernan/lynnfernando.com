import Link from "next/link";
import ResourceCard from "@/components/ResourceCard";
import { resources } from "@/lib/resources";

export default function HomePage() {
  const featuredResources = resources.slice(0, 3);

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20 sm:py-28">
          <p className="text-blue-200 text-sm font-semibold uppercase tracking-widest mb-4">
            Generative AI Consultant · Advisor · Speaker
          </p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight max-w-3xl mb-6">
            Helping Organizations Navigate the Age of Generative AI
          </h1>
          <p className="text-blue-100 text-lg sm:text-xl max-w-2xl mb-10">
            I partner with executives and teams to build practical AI strategies,
            evaluate the right tools, and create lasting capability — not just hype.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/resources"
              className="bg-white text-blue-700 font-semibold px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors"
            >
              Free AI Resources
            </Link>
            <Link
              href="mailto:lynn@revglobalinc.com"
              className="border border-blue-300 text-white font-semibold px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Work With Me →
            </Link>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="bg-white py-16 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-10 text-center">
            How I Can Help
          </h2>
          <div className="grid sm:grid-cols-3 gap-8">
            {[
              {
                icon: "🎯",
                title: "AI Strategy & Advisory",
                desc: "Build a clear, actionable GenAI roadmap tailored to your organization's goals, data, and risk tolerance.",
              },
              {
                icon: "🎤",
                title: "Speaking & Keynotes",
                desc: "Keynotes and workshops that make AI tangible and actionable — for executive teams, conferences, and company all-hands.",
              },
              {
                icon: "⚡",
                title: "Implementation Consulting",
                desc: "Hands-on support selecting tools, designing workflows, and building internal AI capability.",
              },
            ].map((s) => (
              <div key={s.title} className="bg-slate-50 rounded-xl p-6">
                <div className="text-3xl mb-3">{s.icon}</div>
                <h3 className="font-bold text-slate-900 text-lg mb-2">{s.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Resources */}
      <section className="bg-slate-50 py-16 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Free AI Resources
            </h2>
            <Link
              href="/resources"
              className="text-blue-600 font-medium text-sm hover:underline"
            >
              View all →
            </Link>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {featuredResources.map((r) => (
              <ResourceCard key={r.slug} resource={r} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-blue-600 text-white py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">
            Ready to Build Your AI Strategy?
          </h2>
          <p className="text-blue-100 mb-8 text-lg">
            Whether you need a keynote speaker, an advisory engagement, or hands-on implementation support — let&apos;s talk.
          </p>
          <Link
            href="mailto:lynn@revglobalinc.com"
            className="bg-white text-blue-700 font-semibold px-8 py-3 rounded-lg hover:bg-blue-50 transition-colors inline-block"
          >
            Get in Touch
          </Link>
        </div>
      </section>
    </>
  );
}
