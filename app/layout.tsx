import type { Metadata } from "next";
import { Bebas_Neue, Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import Image from "next/image";
import { Analytics } from "@vercel/analytics/next";

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "hyped. | Street Culture. Limited Drops.",
  description:
    "hyped. is a new lifestyle brand curating streetwear and modern trends. Limited drops. All ages. Sign up to get notified about the first drop.",
  openGraph: {
    title: "hyped. | Street Culture. Limited Drops.",
    description: "The first drop is coming. Sign up to get first access.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${bebasNeue.variable} ${inter.variable}`}>
      <body className="min-h-screen bg-[#0a0a0a] text-white">
        <header className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-sm border-b border-white/10">
          <nav className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
            <Link href="/" className="block">
              <Image
                src="/hYPED.png"
                alt="hyped."
                width={120}
                height={120}
                className="h-10 w-auto"
              />
            </Link>
            <div className="flex items-center gap-6">
              <Link
                href="/products"
                className="text-xs text-gray-400 hover:text-white uppercase tracking-[0.2em] transition-colors"
              >
                Products
              </Link>
              <Link
                href="/#signup"
                className="bg-[#FF0080] text-white text-xs font-bold px-4 py-2 uppercase tracking-[0.1em] hover:bg-[#cc0066] transition-colors"
              >
                Get Notified
              </Link>
            </div>
          </nav>
        </header>

        <main>{children}</main>

        <footer className="bg-black border-t border-white/10 py-12 text-center">
          <Image
            src="/hYPED.png"
            alt="hyped."
            width={200}
            height={200}
            className="h-16 w-auto mx-auto mb-2"
          />
          <p className="text-xs text-gray-500 uppercase tracking-[0.3em] mb-6">
            Street Culture · Limited Drops · All Ages
          </p>
          <p className="text-xs text-gray-700">
            © 2026 hyped. All rights reserved. · get-hype.store
          </p>
        </footer>
        <Analytics />
      </body>
    </html>
  );
}
