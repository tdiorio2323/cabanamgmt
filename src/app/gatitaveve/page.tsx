"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Mail } from "lucide-react";

export default function GatitaVeveLinkBio() {
  const links = [
    {
      label: "Twitter / X",
      url: "https://x.com/vevegatita",
    },
    {
      label: "TikTok",
      url: "https://www.tiktok.com/@gatitaveve",
    },
    {
      label: "Fansly",
      url: "https://fansly.com/gatitaveve/posts",
    },
    {
      label: "Telegram (VIP)",
      url: "https://t.me/m/Y_9S-_RZNjUx",
    },
    {
      label: "Telegram Channel",
      url: "https://t.me/gatitaveveoficial",
    },
    {
      label: "Arsmate",
      url: "https://arsmate.com/gatitaveve",
    },
    {
      label: "OnlyFans",
      url: "https://onlyfans.com?return_to=%2Fgatitaveve",
    },
    {
      label: "PayPal",
      url: "https://www.paypal.com/paypalme/aquaboho",
    },
    {
      label: "Kick",
      url: "https://kick.com/gatitaveve",
    },
  ];

  return (
    <main className="relative flex min-h-screen items-center justify-center py-12">
      {/* Background Image */}
      <div className="fixed inset-0 -z-20">
        <Image
          src="/images/gatitaveve-bg.png"
          alt="Background"
          fill
          className="object-cover"
          quality={100}
          priority
        />
        {/* Overlay for readability */}
        <div className="absolute inset-0 bg-black/20" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative w-full max-w-md"
      >
        <div className="absolute inset-0 -z-10 rounded-[32px] bg-black/40 blur-3xl" />
        <div className="relative overflow-hidden rounded-[32px] border-2 border-white/20 bg-black/30 px-6 py-10 md:px-10 md:py-12 shadow-[0_0_45px_rgba(0,0,0,0.65)] backdrop-blur-lg">
          <div className="pointer-events-none absolute inset-0 rounded-[32px] border border-white/10" />
          <div className="pointer-events-none absolute inset-x-10 top-0 h-48 rounded-b-full bg-white/15 opacity-60 blur-3xl" />

          <div className="relative flex flex-col items-center gap-6 text-center text-white">
            {/* Profile Picture */}
            <div className="relative h-32 w-32 overflow-hidden rounded-full border-2 border-white/20 shadow-2xl">
              <Image
                src="/images/gatitaveve-profile.png"
                alt="Gatita Veve"
                fill
                className="object-cover"
              />
            </div>

            {/* Title & Subtitle */}
            <div className="space-y-1">
              <div className="whitespace-nowrap font-[family-name:var(--font-script)] text-3xl sm:text-4xl md:text-5xl leading-tight tracking-wide">
                Gatita Veve
              </div>
              <div className="font-[family-name:var(--font-display)] text-sm uppercase tracking-[0.45em] text-white/85">
                @gatitaveve
              </div>
            </div>

            {/* Social Icons */}
            <div className="flex items-center justify-center gap-5 pt-2">
              <a
                href="https://x.com/vevegatita"
                target="_blank"
                rel="noopener noreferrer"
                className="relative h-10 w-10 transition-transform hover:scale-110 active:scale-95"
              >
                <Image
                  src="/images/socials/x.png"
                  alt="X (Twitter)"
                  fill
                  className="object-contain"
                />
              </a>
              <a
                href="https://www.tiktok.com/@gatitaveve"
                target="_blank"
                rel="noopener noreferrer"
                className="relative h-10 w-10 transition-transform hover:scale-110 active:scale-95"
              >
                <Image
                  src="/images/socials/tiktok.jpg"
                  alt="TikTok"
                  fill
                  className="rounded-full object-cover"
                />
              </a>
              <a
                href="https://t.me/gatitaveveoficial"
                target="_blank"
                rel="noopener noreferrer"
                className="relative h-10 w-10 transition-transform hover:scale-110 active:scale-95"
              >
                <Image
                  src="/images/socials/telegram.png"
                  alt="Telegram"
                  fill
                  className="object-contain"
                />
              </a>
              <a
                href="https://onlyfans.com?return_to=%2Fgatitaveve"
                target="_blank"
                rel="noopener noreferrer"
                className="relative h-10 w-10 transition-transform hover:scale-110 active:scale-95"
              >
                <Image
                  src="/images/socials/onlyfans.png"
                  alt="OnlyFans"
                  fill
                  className="object-contain"
                />
              </a>
              <a
                href="https://wa.me/525654616926"
                target="_blank"
                rel="noopener noreferrer"
                className="relative h-10 w-10 transition-transform hover:scale-110 active:scale-95"
              >
                <Image
                  src="/images/socials/whatsapp.png"
                  alt="WhatsApp"
                  fill
                  className="rounded-full object-cover"
                />
              </a>
              <a
                href="mailto:lagatitaveve@gmail.com"
                className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition-transform hover:scale-110 hover:bg-white/20 active:scale-95"
              >
                <Mail className="h-5 w-5 text-white" />
              </a>
            </div>

            {/* Links */}
            <div className="w-full space-y-4 pt-4">
              {[
                {
                  label: "Fansly",
                  url: "https://fansly.com/gatitaveve/posts",
                },
                {
                  label: "Telegram (VIP)",
                  url: "https://t.me/m/Y_9S-_RZNjUx",
                },
                {
                  label: "Arsmate",
                  url: "https://arsmate.com/gatitaveve",
                },
                {
                  label: "PayPal",
                  url: "https://www.paypal.com/paypalme/aquaboho",
                },
                {
                  label: "Kick",
                  url: "https://kick.com/gatitaveve",
                },
              ].map((link, i) => (
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
