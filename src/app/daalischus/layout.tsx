import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "DAALISCHUS",
  description: "Daalischus - Exclusive Content & Socials",
  openGraph: {
    title: "DAALISCHUS",
    description: "Daalischus - Exclusive Content & Socials",
    images: ["/images/daalischus-social.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "DAALISCHUS",
    description: "Daalischus - Exclusive Content & Socials",
    images: ["/images/daalischus-social.jpg"],
  },
};

export default function DaalischusLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
