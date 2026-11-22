"use client";

import React, { useEffect } from "react";
import { usePortfolioScroll } from "@/context/ScrollContext";
import { NAV_LINKS, PERSONAL_INFO } from "@/data/content";
import { soundManager } from "@/lib/audioSynthesizer";
import { ArrowUpRight } from "lucide-react";

export const FullscreenMenu: React.FC = () => {
  const { isMenuOpen, setIsMenuOpen } = usePortfolioScroll();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isMenuOpen, setIsMenuOpen]);

  if (!isMenuOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Navigation Menu"
      className="fixed inset-0 z-50 backdrop-blur-2xl flex flex-col justify-between p-8 md:p-16 text-cream animate-in fade-in duration-300"
      style={{ backgroundColor: "rgba(14, 13, 12, 0.98)" }}
    >
      {/* Top bar */}
      <div className="flex justify-between items-center pt-8">
        <span className="font-mono text-xs uppercase tracking-widest text-cream-muted">
          Navigation Index
        </span>
        <button
          onClick={() => {
            soundManager.playClick();
            setIsMenuOpen(false);
          }}
          className="font-mono text-xs text-cream-muted hover:text-gold transition-colors"
        >
          ESC to close
        </button>
      </div>

      {/* Main Navigation Links with Letter Rolling Effect */}
      <nav className="flex flex-col gap-2 md:gap-4 my-auto">
        {NAV_LINKS.map((link, idx) => (
          <a
            key={link.label}
            href={link.href}
            onClick={() => {
              soundManager.playClick();
              setIsMenuOpen(false);
            }}
            onMouseEnter={() => soundManager.playHover()}
            className="group relative flex items-center justify-between text-3xl sm:text-5xl md:text-7xl font-serif font-bold tracking-tight text-cream/60 hover:text-cream transition-colors duration-200 py-1"
          >
            <div className="flex items-baseline gap-4 md:gap-8">
              <span className="font-mono text-xs md:text-sm text-gold font-normal">
                {(idx + 1).toString().padStart(2, "0")}
              </span>
              <div className="relative overflow-hidden inline-block h-[1.15em]">
                <span className="inline-block transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:-translate-y-full">
                  {link.label}
                </span>
                <span className="absolute top-0 left-0 inline-block text-gold transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] translate-y-full group-hover:translate-y-0">
                  {link.label}
                </span>
              </div>
            </div>
            <ArrowUpRight className="w-6 h-6 md:w-10 md:h-10 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-gold" />
          </a>
        ))}
      </nav>

      {/* Footer metadata */}
      <div
        className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t font-mono text-xs text-cream-muted"
        style={{ borderColor: "rgba(184, 147, 90, 0.25)" }}
      >
        <div>
          <p className="text-gold uppercase tracking-wider text-[10px] mb-1 font-semibold">Direct Contact</p>
          <a
            href={`mailto:${PERSONAL_INFO.email}`}
            className="text-cream hover:text-gold transition-colors"
          >
            {PERSONAL_INFO.email}
          </a>
        </div>
        <div>
          <p className="text-gold uppercase tracking-wider text-[10px] mb-1 font-semibold">Social Channels</p>
          <div className="flex gap-4">
            <a
              href={PERSONAL_INFO.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-cream hover:text-gold transition-colors"
            >
              GitHub ↗
            </a>
            <a
              href={PERSONAL_INFO.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-cream hover:text-gold transition-colors"
            >
              LinkedIn ↗
            </a>
          </div>
        </div>
        <div>
          <p className="text-gold uppercase tracking-wider text-[10px] mb-1 font-semibold">Local Base</p>
          <p className="text-cream">
            {PERSONAL_INFO.location} ({PERSONAL_INFO.timeOffset})
          </p>
        </div>
      </div>
    </div>
  );
};
