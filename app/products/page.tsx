import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { products } from "@/lib/products";
import EmailSignup from "@/components/EmailSignup";

export const metadata: Metadata = {
  title: "The Lineup | hyped.",
  description: "hyped. Drop 001 — 8 pieces dropping May 1, 2026. Hoodies, sweatpants, shorts, and tees.",
};

export default function ProductsPage() {
  const categories = [...new Set(products.map((p) => p.category))];

  return (
    <>
      {/* ── Header ── */}
      <section className="bg-black pt-28 pb-10 px-4 sm:px-6 border-b border-white/10">
        <div className="max-w-7xl mx-auto">
          <p className="text-[#FF0080] text-[10px] uppercase tracking-[0.45em] mb-3">
            Drop 001 · May 1, 2026
          </p>
          <h1
            className="text-7xl sm:text-9xl text-white leading-none mb-4"
            style={{ fontFamily: "var(--font-bebas), 'Bebas Neue', sans-serif" }}
          >
            The Lineup
          </h1>
          <p className="text-gray-500 text-sm max-w-md leading-relaxed">
            8 pieces. Limited quantities. All dropping May 1.{" "}
            <Link href="/#signup" className="text-[#FF0080] hover:underline">
              Sign up
            </Link>{" "}
            to get first access.
          </p>
        </div>
      </section>

      {/* ── Category bar ── */}
      <section className="bg-[#0a0a0a] border-b border-white/5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center gap-8 py-4 overflow-x-auto scrollbar-hide">
          <span className="text-[#FF0080] text-[10px] uppercase tracking-[0.3em] border-b border-[#FF0080] pb-1 whitespace-nowrap">
            All ({products.length})
          </span>
          {categories.map((cat) => (
            <span
              key={cat}
              className="text-gray-600 text-[10px] uppercase tracking-[0.3em] whitespace-nowrap cursor-default"
            >
              {cat} ({products.filter((p) => p.category === cat).length})
            </span>
          ))}
        </div>
      </section>

      {/* ── Product grid ── */}
      <section className="bg-[#0a0a0a] py-10 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {products.map((product) => (
            <Link
              key={product.slug}
              href={`/products/${product.slug}`}
              className="group relative overflow-hidden bg-[#111] aspect-[4/5] block"
            >
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover opacity-55 transition-all duration-700 group-hover:scale-105 group-hover:opacity-70"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent" />

              <div className="absolute top-3 left-3">
                <span className="bg-[#FF0080] text-white text-[9px] uppercase tracking-[0.2em] px-2 py-1">
                  {product.badge}
                </span>
              </div>
              <div className="absolute top-3 right-3">
                <span className="bg-black/70 text-gray-500 text-[9px] uppercase tracking-[0.15em] px-2 py-1">
                  Soon
                </span>
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-4">
                <p className="text-gray-600 text-[9px] uppercase tracking-[0.25em] mb-1">
                  {product.category}
                </p>
                <p
                  className="text-white text-2xl leading-tight mb-3"
                  style={{ fontFamily: "var(--font-bebas), 'Bebas Neue', sans-serif" }}
                >
                  {product.name}
                </p>
                <span className="text-[9px] uppercase tracking-[0.2em] text-[#FF0080] border border-[#FF0080]/40 px-3 py-1">
                  Notify Me
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Email signup band ── */}
      <section className="bg-black border-t border-white/10 py-20 px-4 text-center">
        <h2
          className="text-5xl text-white mb-2 leading-none"
          style={{ fontFamily: "var(--font-bebas), 'Bebas Neue', sans-serif" }}
        >
          Be First for Drop 001
        </h2>
        <p className="text-gray-600 text-[10px] uppercase tracking-[0.35em] mb-8">
          May 1, 2026 · Limited Pieces · All Ages
        </p>
        <EmailSignup />
      </section>
    </>
  );
}
