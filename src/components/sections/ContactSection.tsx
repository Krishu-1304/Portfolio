"use client";

import React, { useState, useEffect } from "react";
import { PERSONAL_INFO, NAV_LINKS } from "@/data/content";
import { soundManager } from "@/lib/audioSynthesizer";
import { MagneticButton } from "../ui/MagneticButton";
import {
  ArrowUp,
  Mail,
  Clock,
  Copy,
  Check,
  MapPin,
  ArrowUpRight,
} from "lucide-react";
import { GithubIcon, LinkedinIcon } from "../ui/Icons";

export const ContactSection: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [mumbaiTime, setMumbaiTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      try {
        const timeStr = new Intl.DateTimeFormat("en-US", {
          timeZone: "Asia/Kolkata",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        }).format(new Date());
        setMumbaiTime(timeStr);
      } catch {
        setMumbaiTime("13:30:00");
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleCopyEmail = () => {
    soundManager.playClick();
    navigator.clipboard.writeText(PERSONAL_INFO.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const scrollToTop = () => {
    soundManager.playClick();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section
      id="contact"
      className="relative min-h-[90vh] w-full px-6 sm:px-10 md:px-16 pt-32 pb-12 flex flex-col justify-between bg-softblack text-cream border-t border-border-dark"
      aria-label="Contact — Krish Prajapati"
    >
      <div className="max-w-7xl mx-auto w-full">
        
        {/* Section Label */}
        <div className="flex items-center gap-3 mb-8">
          <span className="font-mono text-xs uppercase tracking-widest text-gold font-medium">
            05 / FINALE
          </span>
          <div className="h-px flex-1 bg-border-dark" />
        </div>

        {/* ─── FINALE CARD CONTAINER ─────────────────────────────────── */}
        <div className="relative overflow-hidden rounded-[2.5rem] bg-softblack-raised border border-border-dark p-8 sm:p-14 md:p-20 shadow-2xl">
          
          {/* Ambient Champagne Gold Glow */}
          <div
            className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full blur-3xl pointer-events-none opacity-20 bg-gold"
            aria-hidden="true"
          />

          <div className="relative z-10 max-w-3xl space-y-6">
            
            {/* Status Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-softblack border border-border-dark text-xs font-mono text-gold font-medium">
              <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
              <span>Available for Technical Projects &amp; Collaborations</span>
            </div>

            {/* Huge Heading: "Got a project in mind? Let's build it together." */}
            <h2 className="font-serif font-bold text-4xl sm:text-6xl md:text-7xl lg:text-8xl text-cream tracking-tight leading-[0.98]">
              Got a project in mind?
              <br />
              <span className="italic text-gold font-normal">
                Let&apos;s build it together.
              </span>
            </h2>

            <p className="font-sans text-base sm:text-lg text-cream-muted font-normal max-w-xl leading-relaxed">
              Have an idea, an opportunity, or simply want to talk engineering, machine learning, or product ideas? I&apos;d love to connect.
            </p>

            {/* Action Buttons: Email, GitHub, LinkedIn */}
            <div className="pt-4 flex flex-wrap items-center gap-4">
              
              {/* Email Pill Button */}
              <div className="flex items-center rounded-full bg-gold text-softblack shadow-lg shadow-gold/25 overflow-hidden">
                <a
                  href={`mailto:${PERSONAL_INFO.email}`}
                  onClick={() => soundManager.playClick()}
                  className="px-6 py-3.5 font-sans font-semibold text-xs sm:text-sm hover:bg-gold-light transition-all flex items-center gap-2"
                >
                  <Mail className="w-4 h-4" />
                  <span>{PERSONAL_INFO.email}</span>
                </a>
                <button
                  onClick={handleCopyEmail}
                  aria-label="Copy email address"
                  className="px-3.5 py-3.5 border-l border-softblack/20 hover:bg-gold-light transition-all flex items-center justify-center"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-softblack" />
                  ) : (
                    <Copy className="w-4 h-4 text-softblack" />
                  )}
                </button>
              </div>

              {/* GitHub Button */}
              <a
                href={PERSONAL_INFO.github}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => soundManager.playClick()}
                className="px-6 py-3.5 rounded-full bg-softblack hover:bg-softblack-deep text-cream border border-border-dark font-sans font-medium text-xs sm:text-sm transition-all flex items-center gap-2 group"
              >
                <GithubIcon className="w-4 h-4 text-gold" />
                <span>GitHub</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-gold group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>

              {/* LinkedIn Button */}
              <a
                href={PERSONAL_INFO.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => soundManager.playClick()}
                className="px-6 py-3.5 rounded-full bg-softblack hover:bg-softblack-deep text-cream border border-border-dark font-sans font-medium text-xs sm:text-sm transition-all flex items-center gap-2 group"
              >
                <LinkedinIcon className="w-4 h-4 text-gold" />
                <span>LinkedIn</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-gold group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>

            </div>

          </div>

        </div>

        {/* ─── FOOTER: PAGES, SOCIALS, LIVE TIME, BACK TO TOP ──────────── */}
        <footer className="mt-20 pt-12 border-t border-border-dark grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 font-mono text-xs text-cream-muted">
          
          {/* Pages */}
          <div>
            <p className="text-gold uppercase tracking-widest mb-3 font-semibold text-[10px]">
              Pages
            </p>
            <ul className="space-y-2">
              {NAV_LINKS.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    onClick={() => soundManager.playClick()}
                    className="hover:text-cream transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Socials */}
          <div>
            <p className="text-gold uppercase tracking-widest mb-3 font-semibold text-[10px]">
              Socials
            </p>
            <ul className="space-y-2">
              <li>
                <a
                  href={PERSONAL_INFO.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-cream transition-colors flex items-center gap-1.5"
                >
                  <GithubIcon className="w-3.5 h-3.5 text-gold" />
                  GitHub Profile
                </a>
              </li>
              <li>
                <a
                  href={PERSONAL_INFO.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-cream transition-colors flex items-center gap-1.5"
                >
                  <LinkedinIcon className="w-3.5 h-3.5 text-gold" />
                  LinkedIn Network
                </a>
              </li>
            </ul>
          </div>

          {/* Live Mumbai Time & Location */}
          <div>
            <p className="text-gold uppercase tracking-widest mb-3 font-semibold text-[10px] flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-gold" />
              Live Mumbai Time
            </p>
            <p className="text-cream text-base font-bold font-mono tracking-wider">
              {mumbaiTime || "13:30:00"}{" "}
              <span className="text-xs font-normal text-cream-muted">
                ({PERSONAL_INFO.timeOffset})
              </span>
            </p>
            <p className="text-[11px] text-cream/70 mt-1 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-gold" />
              {PERSONAL_INFO.location}
            </p>
          </div>

          {/* Back to Top */}
          <div className="flex flex-col justify-between items-start sm:items-end">
            <MagneticButton
              onClick={scrollToTop}
              className="px-4 py-2.5 rounded-full bg-softblack-raised hover:bg-softblack border border-border-dark text-cream flex items-center gap-2 transition-all"
            >
              <ArrowUp className="w-3.5 h-3.5 text-gold" />
              <span>Back to Top</span>
            </MagneticButton>

            <p className="text-cream/40 text-[10px] mt-6 sm:mt-0">
              © 2026 {PERSONAL_INFO.name}. All rights reserved.
            </p>
          </div>

        </footer>

      </div>
    </section>
  );
};
