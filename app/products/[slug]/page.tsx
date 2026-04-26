import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { products } from "@/lib/products";
import EmailSignup from "@/components/EmailSignup";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = products.find((p) => p.slug === slug);
  if (!product) return {};
  return {
    title: `${product.name} | hyped.`,
    description: product.description,
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = products.find((p) => p.slug === slug);
  if (!product) notFound();

  const related = products
    .filter((p) => p.slug !== slug)
    .sort((a) => (a.category === product.category ? -1 : 1))
    .slice(0, 3);

  return (
    <>
      {/* ── Breadcrumb ── */}
      <div className="bg-black pt-20 pb-4 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-gray-600">
          <Link href="/" className="hover:text-white transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link href="/products" className="hover:text-white transition-colors">
            Products
          </Link>
          <span>/</span>
          <span className="text-gray-400">{product.name}</span>
        </div>
      </div>

      {/* ── Product detail ── */}
      <section className="bg-[#0a0a0a] px-4 sm:px-6 pb-24">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-8 lg:gap-20">
          {/* Image */}
          <div className="relative aspect-[4/5] bg-[#111] overflow-hidden">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover opacity-70"
              priority
            />
            <div className="absolute top-4 left-4">
              <span className="bg-[#FF0080] text-white text-[9px] uppercase tracking-[0.25em] px-3 py-1">
                {product.badge}
              </span>
            </div>
            <div className="absolute top-4 right-4">
              <span className="bg-black/70 text-gray-400 text-[9px] uppercase tracking-[0.15em] px-3 py-1">
                Coming Soon
              </span>
            </div>
          </div>

          {/* Info */}
          <div className="flex flex-col justify-center py-6 lg:py-0">
            <p className="text-gray-600 text-[10px] uppercase tracking-[0.45em] mb-4">
              {product.category}
            </p>
            <h1
              className="text-6xl sm:text-7xl lg:text-8xl text-white leading-none mb-5"
              style={{ fontFamily: "var(--font-bebas), 'Bebas Neue', sans-serif" }}
            >
              {product.name}
            </h1>
            <div className="w-10 h-[2px] bg-[#FF0080] mb-6" />
            <p className="text-gray-400 text-sm leading-relaxed mb-8 max-w-sm">
              {product.description}
            </p>

            {/* Drop date */}
            <div className="border border-white/10 px-4 py-4 mb-8 inline-flex flex-col gap-1">
              <p className="text-[9px] text-gray-600 uppercase tracking-[0.35em]">
                Drop Date
              </p>
              <p
                className="text-[#FF0080] text-3xl leading-none"
                style={{ fontFamily: "var(--font-bebas), 'Bebas Neue', sans-serif" }}
              >
                May 1, 2026
              </p>
            </div>

            {/* Notify signup */}
            <div className="bg-[#111] border border-white/10 px-6 py-6 mb-6">
              <p className="text-[10px] text-gray-500 uppercase tracking-[0.3em] mb-5">
                Get notified when this drops
              </p>
              <EmailSignup />
            </div>

            <Link
              href="/products"
              className="text-[10px] text-gray-700 hover:text-[#FF0080] uppercase tracking-[0.3em] transition-colors"
            >
              ← Back to Lineup
            </Link>
          </div>
        </div>
      </section>

      {/* ── Related products ── */}
      <section className="bg-black border-t border-white/10 py-16 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <h2
            className="text-4xl text-white mb-8 leading-none"
            style={{ fontFamily: "var(--font-bebas), 'Bebas Neue', sans-serif" }}
          >
            Also in Drop 001
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {related.map((rel) => (
              <Link
                key={rel.slug}
                href={`/products/${rel.slug}`}
                className="group relative overflow-hidden bg-[#111] aspect-[4/5] block"
              >
                <Image
                  src={rel.image}
                  alt={rel.name}
                  fill
                  className="object-cover opacity-55 transition-all duration-700 group-hover:scale-105 group-hover:opacity-70"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <p className="text-gray-600 text-[9px] uppercase tracking-widest mb-1">
                    {rel.category}
                  </p>
                  <p
                    className="text-white text-2xl leading-tight"
                    style={{ fontFamily: "var(--font-bebas), 'Bebas Neue', sans-serif" }}
                  >
                    {rel.name}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
