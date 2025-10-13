import "./globals.css";
import { ReactNode } from "react";
import { Toaster } from "sonner";
import { sans, display, inter, script } from "@/lib/fonts";
import { Metadata } from "next";
import { ErrorBoundary } from "@/components/system/ErrorBoundary";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://cabanamgmt.vercel.app'),
  title: "CABANA",
  description: "Premium creator management platform",
  openGraph: {
    title: "CABANA",
    description: "Premium creator management platform",
    images: [
      {
        url: "/cabana-Business-Card.jpg",
        width: 1200,
        height: 630,
        alt: "CABANA - Premium creator management platform",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CABANA",
    description: "Premium creator management platform",
    images: ["/cabana-Business-Card.jpg"],
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`${sans.variable} ${display.variable} ${inter.variable} ${script.variable}`}
    >
      <body
        className="min-h-screen bg-bg text-ink antialiased"
        style={{
          backgroundImage: "url('/td-studios-black-marble.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      >
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-ink focus:text-bg focus:rounded-md focus:outline-none focus:ring-2 focus:ring-ink/50"
        >
          Skip to main content
        </a>
        <div id="main-content" className="mx-auto max-w-5xl p-6">
          <ErrorBoundary>{children}</ErrorBoundary>
        </div>
        <Toaster richColors />
      </body>
    </html>
  );
}
