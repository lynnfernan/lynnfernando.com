import Link from "next/link";
import type { Resource, ResourceFormat } from "@/lib/resources";

const formatColors: Record<ResourceFormat, string> = {
  Article: "bg-purple-100 text-purple-700",
  Tool: "bg-green-100 text-green-700",
  Download: "bg-blue-100 text-blue-700",
  Template: "bg-orange-100 text-orange-700",
};

export default function ResourceCard({ resource }: { resource: Resource }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col hover:shadow-md transition-shadow">
      <div className="flex items-center gap-2 mb-3">
        <span
          className={`text-xs font-semibold px-2 py-1 rounded-full ${formatColors[resource.format]}`}
        >
          {resource.format}
        </span>
        {resource.gated && (
          <span className="text-xs font-medium text-slate-400 flex items-center gap-1">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                clipRule="evenodd"
              />
            </svg>
            Email required
          </span>
        )}
      </div>
      <h3 className="font-bold text-slate-900 text-base mb-2 leading-snug">
        {resource.title}
      </h3>
      <p className="text-slate-600 text-sm leading-relaxed flex-1 mb-4">
        {resource.description}
      </p>
      <div className="mt-auto">
        <p className="text-xs text-slate-400 mb-3">For: {resource.audience}</p>
        <Link
          href={`/resources/${resource.slug}`}
          className="block text-center bg-blue-600 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          {resource.ctaLabel}
        </Link>
      </div>
    </div>
  );
}
