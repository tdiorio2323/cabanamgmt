
"use client";

import React, { useState, useRef } from "react";
import { supabaseBrowser } from "@/lib/supabaseBrowser";
import { toast } from "sonner";

export default function LinkBuilderPage() {
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profilePreview, setProfilePreview] = useState<string | null>(null);

  const [backgroundImage, setBackgroundImage] = useState<File | null>(null);
  const [backgroundPreview, setBackgroundPreview] = useState<string>("https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1000&auto=format&fit=crop");

  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");

  const [links, setLinks] = useState<string[]>(["", "", "", ""]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const profileInputRef = useRef<HTMLInputElement>(null);
  const backgroundInputRef = useRef<HTMLInputElement>(null);

  const handleProfileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) setProfilePreview(ev.target.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBackgroundUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setBackgroundImage(file);
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) setBackgroundPreview(ev.target.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const addLinkInput = () => {
    if (links.length < 10) {
      setLinks([...links, ""]);
    }
  };

  const updateLink = (index: number, value: string) => {
    const newLinks = [...links];
    newLinks[index] = value;
    setLinks(newLinks);
  };

  // Modified to upload via server-side API to bypass RLS policies
  const uploadFile = async (file: File, path: string) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `${path}/${fileName}`;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('path', filePath);

    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || "Failed to upload image via server");
    }

    const data = await res.json();
    return data.url;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileImage || !backgroundImage || !title) {
      toast.error("Please fill in all required fields (Profile, Background, Title)");
      return;
    }

    setIsSubmitting(true);
    toast.loading("Uploading images...");

    try {
      // 1. Upload Images
      const profileUrl = await uploadFile(profileImage, 'builder/profiles');
      const backgroundUrl = await uploadFile(backgroundImage, 'builder/backgrounds');

      // 2. Submit Data
      const payload = {
        profileImageUrl: profileUrl,
        backgroundImageUrl: backgroundUrl,
        title,
        subtitle,
        links: links.filter(l => l.trim().length > 0)
      };

      const res = await fetch('/api/submit-builder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error("Failed to submit data");

      toast.dismiss();
      toast.success("Page request submitted successfully!");

      // Reset form optionally
      setTitle("");
      setSubtitle("");
      setLinks(["", "", "", ""]);
      setProfileImage(null);
      setProfilePreview(null);
      setBackgroundImage(null);
      setBackgroundPreview("https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1000&auto=format&fit=crop");

    } catch (error: any) {
      console.error(error);
      toast.dismiss();
      toast.error(error.message || "Something went wrong");
    } finally { // Changed from 'else' to 'finally' to ensure setIsSubmitting(false) always runs
      setIsSubmitting(false);
    }
  };

  return (
    // Viewport Container - matches functionality
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-auto bg-cover bg-center p-5 transition-all duration-300"
      style={{ backgroundImage: `url('${backgroundPreview}')` }}
    >
      <form
        onSubmit={handleSubmit}
        className="relative flex w-full max-w-[400px] flex-col items-center rounded-[24px] border border-white/25 bg-white/10 px-[25px] py-[40px] shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] backdrop-blur-[15px]"
      >

        {/* Profile Image Uploader */}
        <div className="relative mb-5 h-[120px] w-[120px]">
          <input
            type="file"
            ref={profileInputRef}
            onChange={handleProfileUpload}
            className="hidden"
            accept="image/*"
          />
          <div
            onClick={() => profileInputRef.current?.click()}
            className="flex h-full w-full cursor-pointer items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-white/50 bg-white/20 transition-all hover:bg-white/30"
          >
            {profilePreview ? (
              <img src={profilePreview} alt="Profile Preview" className="h-full w-full object-cover" />
            ) : (
              <span className="text-4xl text-white opacity-80">+</span>
            )}
          </div>
        </div>

        {/* Text Inputs (Title & Subtitle) */}
        <div className="mb-[30px] w-full text-center text-white">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mx-0 my-[5px] w-[90%] border-0 border-b border-white/50 bg-transparent p-[10px] text-center text-[1.1rem] text-white placeholder-white/60 focus:border-white focus:outline-none"
            placeholder="Enter Title Text"
            required
          />
          <input
            type="text"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            className="mx-0 my-[5px] w-[90%] border-0 border-b border-white/50 bg-transparent p-[10px] text-center text-[0.9rem] text-white opacity-80 placeholder-white/60 focus:border-white focus:outline-none"
            placeholder="@handle (optional)"
          />
        </div>

        {/* Link Input Buttons */}
        <div className="mb-5 flex w-full flex-col gap-[15px]">
          {links.map((link, index) => (
            <input
              key={index}
              type="url"
              value={link}
              onChange={(e) => updateLink(index, e.target.value)}
              className="w-full rounded-[30px] border-none bg-white/90 p-[15px] text-center text-[1rem] font-semibold text-[#333] shadow-sm transition-transform placeholder-[#999] placeholder:font-normal focus:scale-[1.02] focus:outline-none"
              placeholder={`Paste Link #${index + 1} Here`}
              required={index === 0}
            />
          ))}
        </div>

        {/* Add More Button */}
        {links.length < 10 && (
          <button
            type="button"
            onClick={addLinkInput}
            className="mb-[30px] flex h-[40px] w-[40px] cursor-pointer items-center justify-center rounded-full border-none bg-white/80 text-2xl text-[#333] transition-colors hover:bg-white"
            title="Add another link"
          >
            +
          </button>
        )}

        {/* Background Uploader & Submit Section */}
        <div className="flex w-full flex-col gap-[15px]">
          <input
            type="file"
            ref={backgroundInputRef}
            onChange={handleBackgroundUpload}
            className="hidden"
            accept="image/*"
          // required - handled by state check
          />
          <div
            onClick={() => backgroundInputRef.current?.click()}
            className="block cursor-pointer rounded-[15px] bg-black/30 p-[12px] text-center text-[0.9rem] text-white"
          >
            {backgroundImage ? "✅ Background Selected" : "📷 Upload Background Image"}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full cursor-pointer rounded-[30px] border-none bg-black p-[15px] text-[1.1rem] font-bold text-white shadow-lg disabled:opacity-50"
          >
            {isSubmitting ? "Submitting..." : "SUBMIT PAGE DATA"}
          </button>
        </div>

        <a
          href="mailto:info@cabanagrp.com?subject=Custom Request"
          className="mt-5 text-[0.9rem] text-white underline opacity-80"
        >
          CUSTOM REQUEST
        </a>
      </form>
    </div>
  );
}
