import "./globals.css";
import { ReactNode } from "react";
import { Toaster } from "sonner";
import { sans, display, inter, script } from "@/lib/fonts";
import { Metadata } from "next";

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
        <div className="mx-auto max-w-5xl p-6">{children}</div>
        <Toaster richColors />
      </body>
    </html>
  );
}
