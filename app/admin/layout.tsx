import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("hyped_admin");
  const expected = Buffer.from(process.env.ADMIN_PASSWORD ?? "").toString("base64");

  if (!token || token.value !== expected) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <header className="bg-black border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <p
          className="text-2xl text-white"
          style={{ fontFamily: "var(--font-bebas), 'Bebas Neue', sans-serif" }}
        >
          hyped<span className="text-[#FF0080]">.</span>{" "}
          <span className="text-gray-500 text-lg">admin</span>
        </p>
        <div className="flex items-center gap-4">
          <a
            href="/"
            target="_blank"
            className="text-xs text-gray-500 hover:text-white uppercase tracking-widest transition-colors"
          >
            View Site →
          </a>
          <form action="/api/admin/logout" method="POST">
            <button
              type="submit"
              className="text-xs text-gray-500 hover:text-red-400 uppercase tracking-widest transition-colors"
            >
              Logout
            </button>
          </form>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-6 py-10">{children}</main>
    </div>
  );
}
