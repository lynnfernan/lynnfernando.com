import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Lynn Fernan | Generative AI Consultant & Advisor",
  description:
    "Lynn Fernan helps organizations navigate Generative AI strategy, adoption, and implementation. Consulting, advisory, and speaking services.",
  openGraph: {
    title: "Lynn Fernan | Generative AI Consultant & Advisor",
    description:
      "Helping organizations navigate Generative AI strategy, adoption, and implementation.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
