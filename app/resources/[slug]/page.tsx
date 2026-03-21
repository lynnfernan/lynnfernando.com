import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getResourceBySlug, resources } from "@/lib/resources";
import LeadCaptureForm from "@/components/LeadCaptureForm";
import AssessmentTool from "@/components/AssessmentTool";
import Link from "next/link";

// Import all MDX content
import ExecutiveGuide from "@/content/resources/executive-guide-to-genai.mdx";
import GenAIReadiness from "@/content/resources/genai-readiness-assessment.mdx";
import PromptPlaybook from "@/content/resources/prompt-engineering-playbook.mdx";
import UseCaseFramework from "@/content/resources/use-case-prioritization-framework.mdx";
import VendorChecklist from "@/content/resources/vendor-evaluation-checklist.mdx";
import ROITemplate from "@/content/resources/genai-roi-business-case.mdx";
import SpeakingMenu from "@/content/resources/speaking-workshop-menu.mdx";
import AngelInvesting from "@/content/resources/beginners-guide-to-angel-investing.mdx";

const contentMap: Record<string, React.ComponentType> = {
  "executive-guide-to-genai": ExecutiveGuide,
  "genai-readiness-assessment": GenAIReadiness,
  "prompt-engineering-playbook": PromptPlaybook,
  "use-case-prioritization-framework": UseCaseFramework,
  "vendor-evaluation-checklist": VendorChecklist,
  "genai-roi-business-case": ROITemplate,
  "speaking-workshop-menu": SpeakingMenu,
  "beginners-guide-to-angel-investing": AngelInvesting,
};

export async function generateStaticParams() {
  return resources.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const resource = getResourceBySlug(slug);
  if (!resource) return {};
  return {
    title: `${resource.title} | Lynn Fernan`,
    description: resource.description,
  };
}

export default async function ResourcePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const resource = getResourceBySlug(slug);
  if (!resource) notFound();

  const Content = contentMap[slug];
  if (!Content) notFound();

  const isAssessment = slug === "genai-readiness-assessment";
  const isDownload =
    (resource.format === "Download" || resource.format === "Template") &&
    resource.downloadPath;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <div className="mb-6">
        <Link
          href="/resources"
          className="text-sm text-blue-600 hover:underline"
        >
          ← All Resources
        </Link>
      </div>

      <div
        className={`grid gap-10 ${
          isAssessment || isDownload ? "lg:grid-cols-[1fr_380px]" : "max-w-3xl"
        }`}
      >
        {/* Main content */}
        <article className="prose prose-slate max-w-none prose-headings:font-bold prose-a:text-blue-600">
          <Content />
        </article>

        {/* Sidebar: assessment tool or download form */}
        {isAssessment && (
          <aside className="lg:sticky lg:top-24 h-fit">
            <AssessmentTool />
          </aside>
        )}
        {!isAssessment && isDownload && resource.downloadPath && (
          <aside className="lg:sticky lg:top-24 h-fit">
            {resource.gated ? (
              <LeadCaptureForm
                downloadPath={resource.downloadPath}
                resourceTitle={resource.title}
              />
            ) : (
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 text-center">
                <h3 className="font-bold text-slate-900 mb-2">
                  Free Download — No Email Required
                </h3>
                <p className="text-slate-600 text-sm mb-4">
                  This resource is free to download and share.
                </p>
                <a
                  href={resource.downloadPath}
                  download
                  className="inline-block bg-blue-600 text-white font-semibold px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  Download PDF →
                </a>
              </div>
            )}

            {/* Follow-up CTA */}
            <div className="mt-4 bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
              <p className="text-sm text-slate-700 font-medium mb-2">
                Need hands-on help?
              </p>
              <a
                href={`mailto:lynn@revglobalinc.com?subject=${encodeURIComponent(
                  resource.title + " — Consulting Inquiry"
                )}`}
                className="text-blue-600 text-sm font-medium hover:underline"
              >
                Contact Lynn →
              </a>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
