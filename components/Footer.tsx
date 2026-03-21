import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50 mt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500">
        <div>
          <span className="font-semibold text-slate-700">Lynn Fernan</span> — REV Global Inc.
        </div>
        <nav className="flex gap-6">
          <Link href="/resources" className="hover:text-slate-800 transition-colors">
            AI Resources
          </Link>
          <Link href="/resources/speaking-workshop-menu" className="hover:text-slate-800 transition-colors">
            Speaking
          </Link>
          <Link href="mailto:lynn@revglobalinc.com" className="hover:text-slate-800 transition-colors">
            Contact
          </Link>
        </nav>
        <div>© {new Date().getFullYear()} REV Global Inc.</div>
      </div>
    </footer>
  );
}
