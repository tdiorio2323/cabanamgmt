import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PRINCESS EMILY VIP",
  openGraph: {
    title: "PRINCESS EMILY VIP",
    images: ["/images/princess-emily-bg.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "PRINCESS EMILY VIP",
    images: ["/images/princess-emily-bg.png"],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
