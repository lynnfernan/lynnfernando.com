"use client";

import { useState } from "react";

type Props = {
  downloadPath: string;
  resourceTitle: string;
};

export default function LeadCaptureForm({ downloadPath, resourceTitle }: Props) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !name) {
      setError("Please fill in all fields.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    setError("");
    setSubmitted(true);
    // In production: send to email service (Mailchimp, ConvertKit, etc.)
    // For now, trigger the download directly
    setTimeout(() => {
      const link = document.createElement("a");
      link.href = downloadPath;
      link.download = "";
      link.click();
    }, 500);
  }

  if (submitted) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
        <div className="text-2xl mb-2">✅</div>
        <h3 className="font-bold text-green-800 mb-1">Your download is on its way!</h3>
        <p className="text-green-700 text-sm mb-4">
          Thanks, {name}! Your copy of <em>{resourceTitle}</em> should start downloading. Check your downloads folder.
        </p>
        <a
          href={downloadPath}
          className="text-blue-600 text-sm font-medium underline"
          download
        >
          Click here if it didn&apos;t start automatically →
        </a>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
      <h3 className="font-bold text-slate-900 text-lg mb-1">
        Get Your Free Copy
      </h3>
      <p className="text-slate-600 text-sm mb-5">
        Enter your details below to download <em>{resourceTitle}</em>.
      </p>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="name">
            First Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Jane"
            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="email">
            Work Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="jane@company.com"
            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        {error && <p className="text-red-600 text-xs">{error}</p>}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-semibold py-2.5 rounded-lg hover:bg-blue-700 transition-colors text-sm"
        >
          Download Now →
        </button>
        <p className="text-xs text-slate-400 text-center">
          No spam, ever. Unsubscribe anytime.
        </p>
      </form>
    </div>
  );
}
