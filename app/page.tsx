import Image from "next/image";
import Link from "next/link";
import CountdownTimer from "@/components/CountdownTimer";
import EmailSignup from "@/components/EmailSignup";
import { getProducts } from "@/lib/products-store";

export default async function HomePage() {
  const products = await getProducts();
  const previewProducts = products.slice(0, 4);

  return (
    <>
      {/* ── Hero / Coming Soon ── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1534430480872-3498386e7856?w=1920&h=1080&fit=crop&q=80"
          alt=""
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/80" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#FF0080]/5 pointer-events-none" />

        <div className="relative z-10 text-center px-4 pt-16 w-full max-w-5xl mx-auto">
          <p className="inline-block border border-[#FF0080] text-[#FF0080] text-[10px] uppercase tracking-[0.45em] px-4 py-2 mb-10">
            Coming Soon · Drop 001
          </p>

          <Image
            src="/hYPED.png"
            alt="hyped."
            width={2000}
            height={2000}
            className="w-[clamp(10.8rem,36vw,30rem)] h-auto mx-auto mb-4"
            priority
          />

          <p className="text-white/50 text-xs sm:text-sm uppercase tracking-[0.45em] mb-14">
            Street Culture · Limited Drops · All Ages
          </p>

          <div className="mb-14">
            <p className="text-[10px] text-gray-600 uppercase tracking-[0.35em] mb-6">
              First drop in
            </p>
            <CountdownTimer />
          </div>

          <div id="signup" className="mb-4">
            <p className="text-[10px] text-gray-500 uppercase tracking-[0.3em] mb-5">
              Get first access to Drop 001
            </p>
            <EmailSignup />
          </div>

          <div className="mt-20 flex flex-col items-center gap-2 opacity-40">
            <p className="text-[10px] uppercase tracking-[0.35em] text-gray-500">Scroll</p>
            <div className="w-px h-8 bg-white/30" />
          </div>
        </div>
      </section>

      {/* ── Product Teaser ── */}
      <section className="bg-[#0a0a0a] py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
            <div>
              <p className="text-[#FF0080] text-[10px] uppercase tracking-[0.35em] mb-3">
                Drop 001 · May 15, 2026
              </p>
              <h2
                className="text-6xl sm:text-8xl text-white leading-none"
                style={{ fontFamily: "var(--font-bebas), 'Bebas Neue', sans-serif" }}
              >
                The Lineup
              </h2>
            </div>
            <Link
              href="/products"
              className="text-[10px] text-gray-500 hover:text-white uppercase tracking-[0.25em] underline underline-offset-4 transition-colors"
            >
              View All 8 Pieces →
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {previewProducts.map((product) => (
              <Link
                key={product.slug}
                href={`/products/${product.slug}`}
                className="group relative overflow-hidden bg-[#111] aspect-[4/5] block"
              >
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover opacity-55 transition-all duration-700 group-hover:scale-105 group-hover:opacity-65"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                <div className="absolute top-3 right-3">
                  <span className="bg-black/70 text-gray-400 text-[9px] uppercase tracking-[0.15em] px-2 py-1">
                    Coming Soon
                  </span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <p className="text-[#FF0080] text-[9px] uppercase tracking-[0.3em] mb-1">
                    {product.badge}
                  </p>
                  <p
                    className="text-white text-xl leading-tight"
                    style={{ fontFamily: "var(--font-bebas), 'Bebas Neue', sans-serif" }}
                  >
                    {product.name}
                  </p>
                  <p className="text-gray-600 text-[9px] uppercase tracking-widest mt-1">
                    {product.category}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              href="/products"
              className="inline-block border border-white/20 text-white text-[10px] uppercase tracking-[0.3em] px-8 py-4 hover:bg-white hover:text-black transition-colors"
            >
              View Full Lineup
            </Link>
          </div>
        </div>
      </section>

      {/* ── Brand Manifesto ── */}
      <section className="bg-black py-28 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2
            className="text-6xl sm:text-8xl lg:text-[9rem] text-white mb-8 leading-none"
            style={{ fontFamily: "var(--font-bebas), 'Bebas Neue', sans-serif" }}
          >
            Wear the
            <br />
            <span className="text-[#FF0080]">Culture.</span>
          </h2>
          <p className="text-gray-500 text-sm sm:text-base max-w-lg mx-auto leading-relaxed">
            hyped. is a new breed of lifestyle brand. We curate limited drops of
            streetwear and modern trends — for everyone who moves through the world
            with style. All ages. No gatekeeping. If you know, you know.
          </p>
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section className="bg-[#FF0080] py-20 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2
            className="text-5xl sm:text-7xl text-white mb-2 leading-none"
            style={{ fontFamily: "var(--font-bebas), 'Bebas Neue', sans-serif" }}
          >
            Don&apos;t Miss Drop 001
          </h2>
          <p className="text-white/75 text-[10px] uppercase tracking-[0.35em] mb-8">
            Limited pieces · First come, first served · May 15, 2026
          </p>
          <EmailSignup light />
        </div>
      </section>
    </>
  );
}
