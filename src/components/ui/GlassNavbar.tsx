"use client";

import React, { useState, useEffect } from "react";
import { Volume2, VolumeX, ArrowUpRight } from "lucide-react";
import { usePortfolioScroll } from "@/context/ScrollContext";
import { soundManager } from "@/lib/audioSynthesizer";
import { NAV_LINKS } from "@/data/content";

export const GlassNavbar: React.FC = () => {
  const { isMenuOpen, setIsMenuOpen } = usePortfolioScroll();
  const [isMuted, setIsMuted] = useState(true);
  // Hide while hero is in view — pill slides in after user scrolls past it
  const [pastHero, setPastHero] = useState(false);

  useEffect(() => {
    const check = () => {
      const heroEl = document.getElementById("hero");
      if (!heroEl) { setPastHero(true); return; }
      const { bottom } = heroEl.getBoundingClientRect();
      setPastHero(bottom <= 60);
    };
    check();
    window.addEventListener("scroll", check, { passive: true });
    return () => window.removeEventListener("scroll", check);
  }, []);

  const toggleSound = () => {
    const next = !isMuted;
    setIsMuted(next);
    soundManager.setMuted(next);
  };

  return (
    <header
      className="fixed top-5 left-1/2 z-40 w-[calc(100%-2rem)] max-w-4xl pointer-events-none transition-all duration-500"
      role="banner"
      style={{
        opacity: pastHero ? 1 : 0,
        pointerEvents: pastHero ? "auto" : "none",
        transform: `translateX(-50%) translateY(${pastHero ? "0px" : "-14px"})`,
      }}
    >
      <nav
        className="flex items-center justify-between px-5 py-2.5 sm:px-6 sm:py-3 rounded-full pointer-events-auto bg-[#171513]/85 backdrop-blur-xl border border-gold/30 shadow-2xl text-cream"
        aria-label="Primary navigation"
      >
        {/* Left: Brand */}
        <a
          href="#hero"
          onClick={() => soundManager.playClick()}
          className="flex items-center gap-2 group"
          aria-label="Krish Prajapati — Home"
        >
          <span className="font-serif text-lg tracking-wider font-bold text-cream group-hover:text-gold transition-colors">
            KRISH
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
        </a>

        {/* Center: Nav Links */}
        <ul className="hidden md:flex items-center gap-6" role="list">
          {NAV_LINKS.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                onClick={() => soundManager.playClick()}
                onMouseEnter={() => soundManager.playHover()}
                className="font-mono text-xs uppercase tracking-wider text-cream/70 hover:text-gold transition-colors duration-200"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Right: Audio + CTA + Hamburger */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleSound}
            aria-label={isMuted ? "Unmute audio" : "Mute audio"}
            className="w-7 h-7 rounded-full bg-softblack border border-border-dark flex items-center justify-center text-cream/70 hover:text-gold transition-colors"
          >
            {isMuted ? (
              <VolumeX className="w-3.5 h-3.5" />
            ) : (
              <Volume2 className="w-3.5 h-3.5 text-gold" />
            )}
          </button>

          <a
            href="#contact"
            onClick={() => soundManager.playClick()}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gold hover:bg-gold-light text-softblack font-sans text-xs font-semibold transition-all shadow-md shadow-gold/25"
          >
            <span>Let&apos;s talk</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>

          {/* Hamburger for mobile */}
          <button
            onClick={() => {
              setIsMenuOpen(!isMenuOpen);
              soundManager.playClick();
            }}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
            className="md:hidden flex flex-col gap-1 p-1.5 text-cream"
          >
            <span
              className={`block w-4 h-0.5 bg-cream transition-all duration-300 ${
                isMenuOpen ? "rotate-45 translate-y-1 bg-gold" : ""
              }`}
            />
            <span
              className={`block w-4 h-0.5 bg-cream transition-all duration-300 ${
                isMenuOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`block w-4 h-0.5 bg-cream transition-all duration-300 ${
                isMenuOpen ? "-rotate-45 -translate-y-1 bg-gold" : ""
              }`}
            />
          </button>
        </div>
      </nav>
    </header>
  );
};
