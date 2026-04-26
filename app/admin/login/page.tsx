"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      router.push("/admin");
      router.refresh();
    } else {
      setError("Wrong password.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <p
          className="text-5xl text-white text-center mb-2"
          style={{ fontFamily: "var(--font-bebas), 'Bebas Neue', sans-serif" }}
        >
          hyped<span className="text-[#FF0080]">.</span>
        </p>
        <p className="text-center text-gray-500 text-xs uppercase tracking-[0.3em] mb-10">
          Admin Access
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            autoFocus
            className="bg-white/5 border border-white/20 text-white placeholder-gray-600 px-4 py-3 text-sm focus:outline-none focus:border-[#FF0080] transition-colors"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-[#FF0080] text-white text-sm font-bold py-3 uppercase tracking-[0.2em] hover:bg-[#cc0066] transition-colors disabled:opacity-50"
          >
            {loading ? "..." : "Enter"}
          </button>
          {error && (
            <p className="text-red-400 text-xs text-center">{error}</p>
          )}
        </form>
      </div>
    </div>
  );
}
