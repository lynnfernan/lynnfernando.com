"use client";

import { useState } from "react";

interface Props {
  light?: boolean;
}

export default function EmailSignup({ light }: Props) {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, phone: phone || undefined }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      setStatus("success");
      setEmail("");
      setPhone("");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong");
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

  const inputClass = `w-full border text-sm px-4 py-3 focus:outline-none transition-colors ${
    light
      ? "bg-white text-black placeholder-gray-400 border-white/60 focus:border-black"
      : "bg-white/5 text-white placeholder-gray-600 border-white/20 focus:border-[#FF0080]"
  }`;

  const btnClass = `w-full text-sm font-bold px-6 py-3 uppercase tracking-[0.15em] transition-colors disabled:opacity-50 ${
    light
      ? "bg-black text-white hover:bg-gray-900"
      : "bg-[#FF0080] text-white hover:bg-[#cc0066]"
  }`;

  return (
    <div className="w-full max-w-lg mx-auto">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
          className={inputClass}
        />
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Phone number for SMS alerts (optional)"
          className={inputClass}
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className={btnClass}
        >
          {status === "loading" ? "..." : "Notify Me"}
        </button>
      </form>
      {status === "error" && (
        <p className={`text-xs mt-2 ${light ? "text-red-700" : "text-red-400"}`}>
          {errorMsg || "Something went wrong. Try again."}
        </p>
      )}
      <p className={`text-[10px] mt-3 uppercase tracking-[0.2em] ${light ? "text-black/40" : "text-gray-700"}`}>
        SMS alerts are optional. No spam, ever.
      </p>
    </div>
  );
}
