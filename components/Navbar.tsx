"use client";

import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="border-b border-slate-200 bg-white sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        <Link href="/" className="font-bold text-xl text-slate-900 tracking-tight">
          Lynn Fernan
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          <Link href="/resources" className="hover:text-slate-900 transition-colors">
            AI Resources
          </Link>
          <Link href="/resources/speaking-workshop-menu" className="hover:text-slate-900 transition-colors">
            Speaking
          </Link>
          <Link
            href="mailto:lynn@revglobalinc.com"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Work With Me
          </Link>
        </nav>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 text-slate-600"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {open ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 py-4 flex flex-col gap-4 text-sm font-medium">
          <Link href="/resources" onClick={() => setOpen(false)} className="text-slate-700">
            AI Resources
          </Link>
          <Link href="/resources/speaking-workshop-menu" onClick={() => setOpen(false)} className="text-slate-700">
            Speaking
          </Link>
          <Link
            href="mailto:lynn@revglobalinc.com"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-center"
          >
            Work With Me
          </Link>
        </div>
      )}
    </header>
  );
}
