import type { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  ),
  title: {
    default: "Evervora Market GH — Everyday finds",
    template: "%s | Evervora Market GH",
  },
  description:
    "Discover fashion, electronics, phone accessories and everyday essentials. Browse Evervora Market GH and order directly on WhatsApp.",
  icons: { icon: "/icon.svg" },
  openGraph: {
    title: "Evervora Market GH",
    description: "Everything you need, every day.",
    images: ["/brand-flyer.jpg"],
  },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      data-scroll-behavior="smooth"
      lang="en"
      className={cn("font-sans", geist.variable)}
    >
      <body className="antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-white focus:p-3"
        >
          Skip to content
        </a>
        {children}
        <Toaster richColors />
      </body>
    </html>
  );
}
