import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "GATITA VEVE VIP",
  openGraph: {
    title: "GATITA VEVE VIP",
    images: ["/images/gatitaveve-bg.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "GATITA VEVE VIP",
    images: ["/images/gatitaveve-bg.png"],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
