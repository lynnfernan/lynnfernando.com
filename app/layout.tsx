import type { Metadata } from "next";
import { Bebas_Neue, Inter } from "next/font/google";
import "./globals.css";
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
        {children}
        <Analytics />
      </body>
    </html>
  );
}
