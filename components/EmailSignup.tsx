"use client";

import { useState } from "react";

interface Props {
  light?: boolean;
}

export default function EmailSignup({ light }: Props) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error();
      setStatus("success");
      setEmail("");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <p
        className={`font-bold uppercase tracking-widest text-sm ${
          light ? "text-black" : "text-[#FF0080]"
        }`}
      >
        You&apos;re on the list. Drop alerts incoming.
      </p>
    );
  }

  return (
    <div className="w-full max-w-lg mx-auto">
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
          className={`flex-1 border text-sm px-4 py-3 focus:outline-none transition-colors ${
            light
              ? "bg-white text-black placeholder-gray-400 border-white/60 focus:border-black"
              : "bg-white/5 text-white placeholder-gray-600 border-white/20 focus:border-[#FF0080]"
          }`}
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className={`text-sm font-bold px-6 py-3 uppercase tracking-[0.15em] transition-colors disabled:opacity-50 whitespace-nowrap ${
            light
              ? "bg-black text-white hover:bg-gray-900"
              : "bg-[#FF0080] text-white hover:bg-[#cc0066]"
          }`}
        >
          {status === "loading" ? "..." : "Notify Me"}
        </button>
      </form>
      {status === "error" && (
        <p className={`text-xs mt-2 ${light ? "text-red-700" : "text-red-400"}`}>
          Something went wrong. Try again.
        </p>
      )}
    </div>
  );
}
