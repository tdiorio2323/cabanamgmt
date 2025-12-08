"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function HannahMarieRoyalLinkBio() {
  const [showWarning, setShowWarning] = useState(false);
  const [pendingUrl, setPendingUrl] = useState("");

  const links = [
    {
      label: "MY BF DOESN'T KNOW",
      url: "https://onlyfans.com/mybfdoesntknowxxx",
      is18Plus: true,
    },
    {
      label: "VIP SUBSCRIPTION",
      url: "https://onlyfans.com/hannahmarieraw",
      is18Plus: true,
    },
    {
      label: "TWITTER / X",
      url: "https://x.com/mybfd0esntkn0w?s=21",
      is18Plus: true,
    },
    {
      label: "INSTAGRAM",
      url: "https://www.instagram.com/hannahmarieroyal?",
      is18Plus: false,
    },
    {
      label: "TIKTOK",
      url: "https://www.tiktok.com/@hannahmarieroyal?",
      is18Plus: false,
    },
    {
      label: "YOUTUBE",
      url: "https://youtube.com/@hannahmarieroyal?",
      is18Plus: false,
    },
    {
      label: "KICK",
      url: "https://kick.com/eldondolla",
      is18Plus: false,
    },
  ];

  const handleLinkClick = (e: React.MouseEvent, url: string, is18Plus: boolean) => {
    e.preventDefault();
    if (is18Plus) {
      setPendingUrl(url);
      setShowWarning(true);
    } else {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  const confirmAge = () => {
    window.open(pendingUrl, "_blank", "noopener,noreferrer");
    setShowWarning(false);
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center py-12">
      {/* Background Image */}
      <div className="fixed inset-0 -z-20 overflow-hidden">
        <Image
          src="/images/hannah-bg-new.png"
          alt="Background"
          fill
          className="object-cover"
          quality={100}
          priority
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative w-full max-w-md"
      >
        <div className="absolute inset-0 -z-10 rounded-[32px] bg-black/10 blur-3xl" />
        <div className="relative overflow-hidden rounded-[32px] border-2 border-white/20 bg-black/10 px-6 py-10 md:px-10 md:py-12 shadow-[0_0_45px_rgba(0,0,0,0.4)] backdrop-blur-xl">
          <div className="pointer-events-none absolute inset-0 rounded-[32px] border border-white/10" />
          <div className="pointer-events-none absolute inset-x-10 top-0 h-48 rounded-b-full bg-white/15 opacity-60 blur-3xl" />

          <div className="relative flex flex-col items-center gap-6 text-center text-white">
            {/* Profile Picture */}
            <div className="relative h-32 w-32 overflow-hidden rounded-full border-2 border-white/20 shadow-[0_0_25px_rgba(255,255,255,0.3)]">
              <Image
                src="/images/hannah-profile-final.jpg"
                alt="Hannah Marie Royal"
                fill
                className="object-cover"
              />
            </div>

            {/* Title & Subtitle */}
            <div className="w-full space-y-2">
              <div className="w-full whitespace-nowrap text-center font-[family-name:var(--font-script)] text-2xl sm:text-3xl md:text-3xl leading-tight tracking-wide px-4 drop-shadow-md">
                Hannah Marie Royal
              </div>
              <div className="font-[family-name:var(--font-display)] text-[10px] uppercase tracking-[0.45em] text-white/85">
                @hannahmarieroyal
              </div>
            </div>

            {/* Links */}
            <div className="w-full space-y-4 pt-4">
              {links.map((link, i) => (
                <a
                  key={i}
                  href={link.url}
                  onClick={(e) => handleLinkClick(e, link.url, link.is18Plus)}
                  style={{ fontFamily: 'var(--font-bebas)' }}
                  className="relative flex h-14 w-full items-center justify-center rounded-full border border-white/30 bg-gradient-to-b from-white via-white to-gray-200 text-2xl font-bebas tracking-wide text-black uppercase shadow-[inset_0_2px_10px_rgba(255,255,255,0.9),inset_0_-6px_12px_rgba(0,0,0,0.3),0_12px_24px_rgba(0,0,0,0.45)] transition-all duration-200 hover:scale-[1.02] hover:shadow-[inset_0_2px_12px_rgba(255,255,255,1),inset_0_-6px_14px_rgba(0,0,0,0.35),0_14px_28px_rgba(0,0,0,0.5)] active:scale-[0.98] cursor-pointer"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    {link.label}
                    {link.is18Plus && (
                      <span className="text-xs font-bold text-red-600 border border-red-500 rounded px-1 bg-red-50">18+</span>
                    )}
                  </span>
                  <span className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-b from-white/90 via-white/40 to-transparent" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      <Dialog open={showWarning} onOpenChange={setShowWarning}>
        <DialogContent className="border-none bg-zinc-900/95 text-white backdrop-blur-xl sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-red-500">
              Age Restricted Content
            </DialogTitle>
            <DialogDescription className="text-zinc-400 text-lg">
              The content you are about to view is intended for adults only (18+).
              <br />
              <br />
              By proceeding, you confirm that you are at least 18 years of age.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-6 flex-col gap-2 sm:flex-row">
            <Button
              variant="outline"
              onClick={() => setShowWarning(false)}
              className="border-zinc-700 bg-transparent text-white hover:bg-zinc-800 hover:text-white"
            >
              Go Back
            </Button>
            <Button
              onClick={confirmAge}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              I am 18+ - Enter
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}
