"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function PrincessEmilyLinkBio() {
  const links = [
    {
      label: "Twitter / X",
      url: "https://x.com/princessemilyle",
    },
    {
      label: "Only Fans",
      url: "https://onlyfans.com/princessemily?fbclid=PAQ0xDSwKcBBRleHRuA2FlbQIxMAABp-lJzsRwGG-5kxXubxNAEUzpAJ8BXIZAtizBYxJWuXinaGxCuHhAwg4yK7Mv_aem_pmv8vMQc1htB-m_9Wj82fw",
    },
    {
      label: "CashApp",
      url: "https://cash.app/$Princessemilyle?fbclid=PAQ0xDSwKcBFxleHRuA2FlbQIxMAABp5dIXWtyafNYoMClB80EeRmLx9fmDBi5RmfWtj2r1psFn8KtZEBILnDtynyU_aem_yOxbGiIrzs9t-dG_oeySfg",
    },
    {
      label: "Many Vids",
      url: "https://www.manyvids.com/Profile/1002861189/princessemily/Store/Videos",
    },
    {
      label: "Amazon Wishlist",
      url: "https://www.amazon.com/hz/wishlist/ls/CU6AYPB3DNTC?ref_=wl_share",
    },
    {
      label: "Contact",
      url: "https://x.com/princessemilyle",
    },
  ];

  return (
    <main className="relative flex min-h-screen items-center justify-center py-12">
      {/* Background Image */}
      <div className="fixed inset-0 -z-20">
        <Image
          src="/images/princess-emily-bg.png"
          alt="Background"
          fill
          className="object-cover"
          quality={100}
          priority
        />
        {/* Optional overlay to ensure text readability if needed, though user didn't explicitly ask I will add a very light one just in case the image is bright,
            but actually the glass card handles contrast mostly. I'll add a slight dark tint for safety consistent with 'nightlife' vibe */}
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative w-full max-w-md"
      >
        <div className="absolute inset-0 -z-10 rounded-[32px] bg-black/40 blur-3xl" />
        <div className="relative overflow-hidden rounded-[32px] border-2 border-white/20 bg-black/30 px-10 py-12 shadow-[0_0_45px_rgba(0,0,0,0.65)] backdrop-blur-lg">
          <div className="pointer-events-none absolute inset-0 rounded-[32px] border border-white/10" />
          <div className="pointer-events-none absolute inset-x-10 top-0 h-48 rounded-b-full bg-white/15 opacity-60 blur-3xl" />

          <div className="relative flex flex-col items-center gap-6 text-center text-white">
            {/* Profile Picture */}
            <div className="relative h-32 w-32 overflow-hidden rounded-full border-2 border-white/20 shadow-2xl">
              <Image
                src="/images/princess-emily-profile.jpg"
                alt="Princess Emily"
                fill
                className="object-cover"
              />
            </div>

            {/* Title & Subtitle */}
            <div className="space-y-1">
              <div className="whitespace-nowrap font-[family-name:var(--font-script)] text-5xl leading-tight tracking-wide">
                Princess Emily
              </div>
              <div className="font-[family-name:var(--font-display)] text-sm uppercase tracking-[0.45em] text-white/85">
                @urhighnessemily
              </div>
            </div>

            {/* Links */}
            <div className="w-full space-y-4 pt-4">
              {links.map((link, i) => (
                <a
                  key={i}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative flex h-14 w-full items-center justify-center rounded-full border border-white/30 bg-gradient-to-b from-white via-white to-gray-200 text-xl font-bebas tracking-[0.1em] text-black shadow-[inset_0_2px_10px_rgba(255,255,255,0.9),inset_0_-6px_12px_rgba(0,0,0,0.3),0_12px_24px_rgba(0,0,0,0.45)] transition-all duration-200 hover:scale-[1.02] hover:shadow-[inset_0_2px_12px_rgba(255,255,255,1),inset_0_-6px_14px_rgba(0,0,0,0.35),0_14px_28px_rgba(0,0,0,0.5)] active:scale-[0.98]"
                >
                  <span className="relative z-10">{link.label}</span>
                  <span className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-b from-white/90 via-white/40 to-transparent" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </main>
  );
}
