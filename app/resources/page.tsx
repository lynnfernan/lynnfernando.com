import { Metadata } from "next";
import ResourceCard from "@/components/ResourceCard";
import { resources } from "@/lib/resources";

export const metadata: Metadata = {
  title: "Free AI Resources | Lynn Fernan",
  description:
    "Practical Generative AI tools, guides, templates, and assessments — free from Lynn Fernan to help your organization navigate AI with confidence.",
};

export default function ResourcesPage() {
  const articles = resources.filter((r) => r.format === "Article");
  const tools = resources.filter((r) => r.format === "Tool");
  const downloads = resources.filter((r) => r.format === "Download" || r.format === "Template");

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3">
          Free AI Resources
        </h1>
        <p className="text-slate-600 text-lg max-w-2xl">
          Practical tools, guides, and frameworks to help your organization navigate
          Generative AI — from exploration to implementation. All free, no fluff.
        </p>
      </div>

      {/* Format legend */}
      <div className="flex flex-wrap gap-3 mb-10 text-xs font-semibold">
        {[
          { label: "Article", color: "bg-purple-100 text-purple-700" },
          { label: "Tool", color: "bg-green-100 text-green-700" },
          { label: "Download", color: "bg-blue-100 text-blue-700" },
          { label: "Template", color: "bg-orange-100 text-orange-700" },
        ].map((f) => (
          <span key={f.label} className={`px-3 py-1 rounded-full ${f.color}`}>
            {f.label}
          </span>
        ))}
      </div>

      {/* Interactive Tools */}
      {tools.length > 0 && (
        <section className="mb-12">
          <h2 className="text-xl font-bold text-slate-900 mb-5 border-b border-slate-200 pb-2">
            Interactive Tools
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools.map((r) => (
              <ResourceCard key={r.slug} resource={r} />
            ))}
          </div>
        </section>
      )}

      {/* Downloadable Resources */}
      {downloads.length > 0 && (
        <section className="mb-12">
          <h2 className="text-xl font-bold text-slate-900 mb-5 border-b border-slate-200 pb-2">
            Guides, Templates & Checklists
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {downloads.map((r) => (
              <ResourceCard key={r.slug} resource={r} />
            ))}
          </div>
        </section>
      )}

      {/* Articles */}
      {articles.length > 0 && (
        <section className="mb-12">
          <h2 className="text-xl font-bold text-slate-900 mb-5 border-b border-slate-200 pb-2">
            Articles & Guides
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((r) => (
              <ResourceCard key={r.slug} resource={r} />
            ))}
          </div>
        </section>
      )}

      {/* Bottom CTA */}
      <div className="mt-10 bg-blue-50 border border-blue-200 rounded-xl p-8 text-center">
        <h3 className="font-bold text-slate-900 text-xl mb-2">
          Want a Custom AI Workshop for Your Team?
        </h3>
        <p className="text-slate-600 mb-5 text-sm max-w-xl mx-auto">
          These resources are a starting point. For hands-on workshops, advisory engagements,
          or a tailored AI strategy — let&apos;s talk.
        </p>
        <a
          href="mailto:lynn@revglobalinc.com?subject=Consulting Inquiry"
          className="inline-block bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Contact Lynn
        </a>
      </div>
    </div>
  );
}
