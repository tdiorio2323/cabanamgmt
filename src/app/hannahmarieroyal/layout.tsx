import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "HANNAH MARIE ROYAL",
  description: "Hannah Marie Royal - Exclusive Content & Socials",
  openGraph: {
    title: "HANNAH MARIE ROYAL",
    description: "Hannah Marie Royal - Exclusive Content & Socials",
    images: ["/images/hannah-profile-final.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "HANNAH MARIE ROYAL",
    description: "Hannah Marie Royal - Exclusive Content & Socials",
    images: ["/images/hannah-profile-final.jpg"],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
