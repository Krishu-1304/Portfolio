"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  PERSONAL_INFO,
  AREAS_I_EXPLORE,
  BEYOND_THE_SCREEN,
} from "@/data/content";
import { usePortfolioScroll } from "@/context/ScrollContext";
import {
  GraduationCap,
  Sparkles,
  Code2,
  Compass,
  Trophy,
  X,
} from "lucide-react";
import { soundManager } from "@/lib/audioSynthesizer";

export const DoorsSection: React.FC = () => {
  const { isReducedMotion } = usePortfolioScroll();
  const sectionRef = useRef<HTMLElement>(null);
  
  // Track which door is currently open (0 to 3, or -1 for all closed)
  const [activeDoor, setActiveDoor] = useState<number>(0);
  // Whether user is currently interacting, which pauses the auto cycle
  const [isUserInteracting, setIsUserInteracting] = useState<boolean>(false);
  const autoCloseTimerRef = useRef<NodeJS.Timeout | null>(null);
  const idleResumeTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Calm auto-opening cycle: takes turns opening each door (holds ~5s, pauses on user interaction)
  useEffect(() => {
    if (isReducedMotion || isUserInteracting) return;

    const interval = setInterval(() => {
      setActiveDoor((prev) => (prev + 1) % 4);
    }, 5500);

    return () => clearInterval(interval);
  }, [isReducedMotion, isUserInteracting]);

  // Global Escape key and click-outside listeners to close the door
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && activeDoor !== -1) {
        soundManager.playClick();
        setActiveDoor(-1);
        setIsUserInteracting(true);
      }
    };

    const handleGlobalPointerDown = (e: MouseEvent | TouchEvent) => {
      if (!sectionRef.current) return;
      // If click was outside of any door container, close open door
      const target = e.target as HTMLElement;
      if (!target.closest(".door-interactive-item") && activeDoor !== -1) {
        setActiveDoor(-1);
      }
    };

    window.addEventListener("keydown", handleGlobalKeyDown);
    document.addEventListener("pointerdown", handleGlobalPointerDown);

    return () => {
      window.removeEventListener("keydown", handleGlobalKeyDown);
      document.removeEventListener("pointerdown", handleGlobalPointerDown);
    };
  }, [activeDoor]);

  // Set 10s auto-close timer whenever user opens or interacts with a door
  const scheduleAutoClose = () => {
    if (autoCloseTimerRef.current) clearTimeout(autoCloseTimerRef.current);
    autoCloseTimerRef.current = setTimeout(() => {
      setActiveDoor(-1);
      setIsUserInteracting(false);
    }, 10000);
  };

  // Toggle or open door
  const toggleDoor = (index: number) => {
    soundManager.playClick();
    setIsUserInteracting(true);
    scheduleAutoClose();

    setActiveDoor((prev) => (prev === index ? -1 : index));
  };

  // Desktop hover opening
  const handleMouseEnter = (index: number) => {
    if (typeof window !== "undefined" && window.innerWidth > 768) {
      setIsUserInteracting(true);
      scheduleAutoClose();
      setActiveDoor(index);
    }
  };

  const handleMouseLeave = () => {
    if (idleResumeTimerRef.current) clearTimeout(idleResumeTimerRef.current);
    idleResumeTimerRef.current = setTimeout(() => {
      setIsUserInteracting(false);
    }, 4000);
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggleDoor(index);
    }
  };

  return (
    <section
      id="doors"
      ref={sectionRef}
      className="relative w-full px-5 sm:px-8 md:px-14 py-32 bg-ivory text-charcoal border-t border-border-light"
      aria-label="Magic Happens Behind the Doors"
    >
      {/* Soft Silk-Fold Gradient Mesh */}
      <div className="silk-fold" aria-hidden="true" />

      {/* Background Ghost Text */}
      <div className="absolute top-10 left-0 right-0 flex justify-center pointer-events-none select-none opacity-20 overflow-hidden">
        <span className="font-serif text-[clamp(4.5rem,14vw,12rem)] text-outline-dark tracking-tight font-bold whitespace-nowrap">
          BEHIND THE DOORS
        </span>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-ivory-deep border border-border-light text-xs font-mono text-gold font-medium">
            <Sparkles className="w-3.5 h-3.5 text-gold" />
            <span>03 / INTERACTIVE SANCTUM</span>
          </div>

          <h2 className="font-serif text-4xl sm:text-6xl md:text-7xl text-charcoal tracking-tight font-bold">
            MAGIC HAPPENS BEHIND THE DOORS
          </h2>

          <p className="font-sans text-sm sm:text-base text-charcoal-muted font-normal max-w-xl mx-auto">
            Real walnut doors opening in turn to reveal my story, verified technical skills, core exploration areas, and pursuits beyond the screen.
          </p>

          <div className="flex items-center justify-center gap-2 pt-2">
            <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
            <span className="font-mono text-[11px] uppercase tracking-widest text-gold font-medium">
              {isUserInteracting ? "Interactive Mode (Click or Hover • Esc to close)" : "Calm Auto-Cycle Active"}
            </span>
          </div>
        </div>

        {/* ─── 4 REAL WALNUT WOODEN DOORS ROW ──────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          
          {/* ════ DOOR 01: ABOUT (Student. Builder. Full info) ════ */}
          <div
            className="door-interactive-item door-container relative min-h-[580px] rounded-3xl door-frame flex flex-col bg-softblack shadow-2xl"
            onMouseEnter={() => handleMouseEnter(0)}
            onMouseLeave={handleMouseLeave}
          >
            {/* Interior Content Room (Revealed when door swings open) */}
            <div className="p-6 flex-1 flex flex-col justify-between bg-softblack text-cream relative z-10 overflow-y-auto max-h-[580px] custom-scrollbar">
              <div className="space-y-4">
                {/* Header status */}
                <div className="flex items-center justify-between pb-2 border-b border-border-dark text-xs font-mono text-gold">
                  <span className="font-bold">DOOR 01 / STORY</span>
                  {activeDoor === 0 && (
                    <button
                      onClick={() => toggleDoor(0)}
                      aria-label="Close door"
                      className="p-1 rounded-full hover:bg-softblack-raised text-cream/60 hover:text-gold transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Heading */}
                <div>
                  <h3 className="font-serif italic text-3xl text-cream font-normal">
                    Student.&nbsp;<span className="not-italic font-serif font-bold">Builder.</span>
                  </h3>
                </div>

                {/* 3 Short Paragraphs */}
                <div className="space-y-2.5 text-xs sm:text-[12.5px] font-sans text-cream/85 font-normal leading-relaxed">
                  <p>
                    B.Tech student in Computer Engineering at Dwarkadas J. Sanghvi College of Engineering (DJSCE), University of Mumbai.
                  </p>
                  <p>
                    I build practical ML systems, data/BI analytics pipelines, mobile tools, and responsive software.
                  </p>
                  <p>
                    Deeply interested in Artificial Intelligence, product building, business strategy, and entrepreneurship.
                  </p>
                </div>

                {/* Badges: B.Tech CE, DJSCE, CGPA 9.10, 2024-2028 */}
                <div className="pt-2 border-t border-border-dark space-y-2 font-mono text-[10px]">
                  <div className="flex flex-wrap gap-1.5">
                    <span className="px-2 py-0.5 rounded-md bg-softblack-raised border border-border-dark text-gold font-medium">
                      B.TECH · COMPUTER ENGINEERING
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-softblack-raised border border-border-dark text-cream/80">
                      DJSCE · MUMBAI
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-gold pt-0.5">
                    <span className="font-bold">CGPA 9.10</span>
                    <span className="text-cream/50">2024–2028</span>
                  </div>
                </div>

                {/* Skills in Three Groups (Languages, Frameworks, Data & BI) */}
                <div className="pt-2 border-t border-border-dark space-y-2.5 font-mono text-xs">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-gold block mb-1 font-bold">
                      Languages:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {["Python", "Java", "C"].map((s) => (
                        <span key={s} className="px-2 py-0.5 rounded bg-softblack-raised border border-border-dark text-cream text-[11px]">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-gold block mb-1 font-bold">
                      Frameworks:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {["Django", "Flutter"].map((s) => (
                        <span key={s} className="px-2 py-0.5 rounded bg-softblack-raised border border-border-dark text-gold text-[11px]">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-gold block mb-1 font-bold">
                      Data &amp; BI:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {["SQL", "Power BI", "Tableau"].map((s) => (
                        <span key={s} className="px-2 py-0.5 rounded bg-softblack-raised border border-border-dark text-cream text-[11px]">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom footer note */}
              <div className="pt-3 mt-3 border-t border-border-dark font-mono text-[10px] text-cream/40 flex items-center justify-between">
                <span>Verified Credentials</span>
                <span className="text-gold">Click door to toggle</span>
              </div>
            </div>

            {/* Warm Champagne Gold Light Spilling Out From Interior */}
            <div
              className={`absolute inset-0 pointer-events-none transition-opacity duration-700 z-15 ${
                activeDoor === 0 ? "opacity-45" : "opacity-0"
              }`}
              style={{
                background:
                  "radial-gradient(circle at 10% 50%, rgba(184, 147, 90, 0.45) 0%, transparent 70%)",
              }}
              aria-hidden="true"
            />

            {/* REAL WALNUT WOODEN DOOR PANEL (Swings in 3D) */}
            <div
              role="button"
              tabIndex={0}
              aria-label="Door 01: About Me. Press enter or click to swing open."
              aria-expanded={activeDoor === 0}
              onClick={() => toggleDoor(0)}
              onKeyDown={(e) => handleKeyDown(e, 0)}
              className={`door-hinge absolute inset-0 z-20 cursor-pointer p-6 flex flex-col justify-between wood-texture text-cream select-none rounded-3xl ${
                activeDoor === 0 && !isReducedMotion
                  ? "-rotate-y-[112deg] shadow-[25px_0_50px_rgba(0,0,0,0.85)] pointer-events-auto"
                  : activeDoor === 0 && isReducedMotion
                  ? "opacity-0 pointer-events-none"
                  : "rotate-y-0 shadow-[0_16px_36px_rgba(0,0,0,0.4)] pointer-events-auto"
              }`}
              style={{
                transformOrigin: "left center",
              }}
            >
              {/* Door Top Trim & Plaque */}
              <div className="flex items-center justify-between">
                <div className="px-3 py-1 rounded-md bg-[#3B200F] border border-[#7A492C]/40 font-mono text-[10px] text-gold tracking-widest uppercase font-bold">
                  PORTAL 01
                </div>
                <div className="w-2 h-2 rounded-full bg-gold/80 shadow-sm shadow-gold" />
              </div>

              {/* Wooden Inset Panels (Realistic Walnut Architecture) */}
              <div className="my-auto space-y-4 py-4">
                <div className="h-28 rounded-xl wood-panel-inset p-4 flex flex-col items-center justify-center text-center">
                  <div className="w-12 h-12 rounded-xl bg-[#2E180B] border border-[#7A492C]/30 flex items-center justify-center text-gold mb-2 shadow-inner">
                    <GraduationCap className="w-6 h-6" />
                  </div>
                  <span className="font-serif font-bold text-2xl text-cream tracking-wider">
                    ABOUT
                  </span>
                </div>

                <div className="h-28 rounded-xl wood-panel-inset p-4 flex flex-col items-center justify-center text-center">
                  <span className="font-serif italic text-gold text-base">
                    Student. Builder.
                  </span>
                  <span className="font-mono text-[10px] text-cream/70 mt-1 uppercase">
                    DJSCE Mumbai
                  </span>
                </div>
              </div>

              {/* Brass-Gold Door Handle & Bottom Light Gap */}
              <div className="relative pt-4 flex items-center justify-between border-t border-[#7A492C]/30 text-xs font-mono text-cream/80">
                <span>Walnut Wood</span>
                <div
                  className="w-4 h-12 rounded-full brass-handle flex items-center justify-center shadow-lg"
                  title="Brass Handle"
                />
              </div>

              {/* Champagne Gold Light Gap at Bottom */}
              <div className="absolute bottom-0 inset-x-0 h-1 bg-gold door-light-gap opacity-85" />
            </div>

            {/* Manual Toggle Indicator at base */}
            <div className="relative z-30 py-2.5 bg-softblack-deep border-t border-border-dark text-center rounded-b-3xl">
              <button
                onClick={() => toggleDoor(0)}
                className="font-mono text-[11px] text-gold uppercase tracking-widest hover:text-cream transition-colors font-medium"
              >
                {activeDoor === 0 ? "• Click to Close Door 01" : "Click to Open Door 01"}
              </button>
            </div>
          </div>

          {/* ════ DOOR 02: SKILLS ════ */}
          <div
            className="door-interactive-item door-container relative min-h-[580px] rounded-3xl door-frame flex flex-col bg-softblack shadow-2xl"
            onMouseEnter={() => handleMouseEnter(1)}
            onMouseLeave={handleMouseLeave}
          >
            {/* Interior Content Room */}
            <div className="p-6 flex-1 flex flex-col justify-between bg-softblack text-cream relative z-10 overflow-y-auto max-h-[580px] custom-scrollbar">
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-border-dark text-xs font-mono text-gold">
                  <span className="font-bold">DOOR 02 / SKILLS</span>
                  {activeDoor === 1 && (
                    <button
                      onClick={() => toggleDoor(1)}
                      aria-label="Close door"
                      className="p-1 rounded-full hover:bg-softblack-raised text-cream/60 hover:text-gold transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div>
                  <h3 className="font-serif font-bold text-2xl text-cream tracking-wide">
                    TECHNICAL CRAFT
                  </h3>
                  <p className="font-mono text-[11px] text-cream/60 mt-1">
                    Verified tooling &amp; engineering foundation.
                  </p>
                </div>

                <div className="space-y-4 font-mono text-xs pt-1">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-gold block mb-1.5 font-bold">
                      Languages:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {["Python", "Java", "C", "SQL"].map((skill) => (
                        <span key={skill} className="px-2.5 py-1 rounded-md bg-softblack-raised border border-border-dark text-cream text-[11px]">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-gold block mb-1.5 font-bold">
                      Frameworks &amp; Mobile:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {["Django", "Flutter", "FastAPI"].map((skill) => (
                        <span key={skill} className="px-2.5 py-1 rounded-md bg-softblack-raised border border-border-dark text-gold text-[11px]">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-gold block mb-1.5 font-bold">
                      Data &amp; BI Tooling:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {["Power BI", "Tableau", "YAMNet", "BiLSTM"].map((skill) => (
                        <span key={skill} className="px-2.5 py-1 rounded-md bg-softblack-raised border border-border-dark text-cream text-[11px]">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-3 mt-3 border-t border-border-dark font-mono text-[10px] text-cream/40">
                Acoustic ML + Systems + BI Dashboards
              </div>
            </div>

            {/* Champagne Gold Light Spill */}
            <div
              className={`absolute inset-0 pointer-events-none transition-opacity duration-700 z-15 ${
                activeDoor === 1 ? "opacity-45" : "opacity-0"
              }`}
              style={{
                background:
                  "radial-gradient(circle at 10% 50%, rgba(184, 147, 90, 0.45) 0%, transparent 70%)",
              }}
              aria-hidden="true"
            />

            {/* REAL WALNUT WOODEN DOOR PANEL */}
            <div
              role="button"
              tabIndex={0}
              aria-label="Door 02: Technical Skills. Press enter or click to swing open."
              aria-expanded={activeDoor === 1}
              onClick={() => toggleDoor(1)}
              onKeyDown={(e) => handleKeyDown(e, 1)}
              className={`door-hinge absolute inset-0 z-20 cursor-pointer p-6 flex flex-col justify-between wood-texture text-cream select-none rounded-3xl ${
                activeDoor === 1 && !isReducedMotion
                  ? "-rotate-y-[112deg] shadow-[25px_0_50px_rgba(0,0,0,0.85)] pointer-events-auto"
                  : activeDoor === 1 && isReducedMotion
                  ? "opacity-0 pointer-events-none"
                  : "rotate-y-0 shadow-[0_16px_36px_rgba(0,0,0,0.4)] pointer-events-auto"
              }`}
              style={{
                transformOrigin: "left center",
              }}
            >
              <div className="flex items-center justify-between">
                <div className="px-3 py-1 rounded-md bg-[#3B200F] border border-[#7A492C]/40 font-mono text-[10px] text-gold tracking-widest uppercase font-bold">
                  PORTAL 02
                </div>
                <div className="w-2 h-2 rounded-full bg-gold/80 shadow-sm shadow-gold" />
              </div>

              <div className="my-auto space-y-4 py-4">
                <div className="h-28 rounded-xl wood-panel-inset p-4 flex flex-col items-center justify-center text-center">
                  <div className="w-12 h-12 rounded-xl bg-[#2E180B] border border-[#7A492C]/30 flex items-center justify-center text-gold mb-2 shadow-inner">
                    <Code2 className="w-6 h-6" />
                  </div>
                  <span className="font-serif font-bold text-2xl text-cream tracking-wider">
                    SKILLS
                  </span>
                </div>

                <div className="h-28 rounded-xl wood-panel-inset p-4 flex flex-col items-center justify-center text-center">
                  <span className="font-serif italic text-gold text-base">
                    Craft &amp; Code
                  </span>
                  <span className="font-mono text-[10px] text-cream/70 mt-1 uppercase">
                    Languages &amp; ML
                  </span>
                </div>
              </div>

              <div className="relative pt-4 flex items-center justify-between border-t border-[#7A492C]/30 text-xs font-mono text-cream/80">
                <span>Walnut Wood</span>
                <div className="w-4 h-12 rounded-full brass-handle flex items-center justify-center shadow-lg" />
              </div>

              <div className="absolute bottom-0 inset-x-0 h-1 bg-gold door-light-gap opacity-85" />
            </div>

            <div className="relative z-30 py-2.5 bg-softblack-deep border-t border-border-dark text-center rounded-b-3xl">
              <button
                onClick={() => toggleDoor(1)}
                className="font-mono text-[11px] text-gold uppercase tracking-widest hover:text-cream transition-colors font-medium"
              >
                {activeDoor === 1 ? "• Click to Close Door 02" : "Click to Open Door 02"}
              </button>
            </div>
          </div>

          {/* ════ DOOR 03: AREAS I EXPLORE ════ */}
          <div
            className="door-interactive-item door-container relative min-h-[580px] rounded-3xl door-frame flex flex-col bg-softblack shadow-2xl"
            onMouseEnter={() => handleMouseEnter(2)}
            onMouseLeave={handleMouseLeave}
          >
            {/* Interior Content Room */}
            <div className="p-6 flex-1 flex flex-col justify-between bg-softblack text-cream relative z-10 overflow-y-auto max-h-[580px] custom-scrollbar">
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-border-dark text-xs font-mono text-gold">
                  <span className="font-bold">DOOR 03 / DOMAINS</span>
                  {activeDoor === 2 && (
                    <button
                      onClick={() => toggleDoor(2)}
                      aria-label="Close door"
                      className="p-1 rounded-full hover:bg-softblack-raised text-cream/60 hover:text-gold transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div>
                  <h3 className="font-serif font-bold text-2xl text-cream tracking-wide">
                    AREAS I EXPLORE
                  </h3>
                  <p className="font-mono text-[11px] text-cream/60 mt-1">
                    Curiosity-led technology domains.
                  </p>
                </div>

                <div className="space-y-2.5 pt-1">
                  {AREAS_I_EXPLORE.map((area) => (
                    <div
                      key={area.title}
                      className="p-3 rounded-xl bg-softblack-raised border border-border-dark"
                    >
                      <h5 className="font-sans font-semibold text-xs text-cream mb-0.5">
                        {area.title}
                      </h5>
                      <p className="font-sans text-[11px] text-cream/70 font-normal leading-relaxed">
                        {area.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 mt-3 border-t border-border-dark font-mono text-[10px] text-cream/40">
                Bridging algorithms &amp; product value
              </div>
            </div>

            {/* Champagne Gold Light Spill */}
            <div
              className={`absolute inset-0 pointer-events-none transition-opacity duration-700 z-15 ${
                activeDoor === 2 ? "opacity-45" : "opacity-0"
              }`}
              style={{
                background:
                  "radial-gradient(circle at 10% 50%, rgba(184, 147, 90, 0.45) 0%, transparent 70%)",
              }}
              aria-hidden="true"
            />

            {/* REAL WALNUT WOODEN DOOR PANEL */}
            <div
              role="button"
              tabIndex={0}
              aria-label="Door 03: Areas I Explore. Press enter or click to swing open."
              aria-expanded={activeDoor === 2}
              onClick={() => toggleDoor(2)}
              onKeyDown={(e) => handleKeyDown(e, 2)}
              className={`door-hinge absolute inset-0 z-20 cursor-pointer p-6 flex flex-col justify-between wood-texture text-cream select-none rounded-3xl ${
                activeDoor === 2 && !isReducedMotion
                  ? "-rotate-y-[112deg] shadow-[25px_0_50px_rgba(0,0,0,0.85)] pointer-events-auto"
                  : activeDoor === 2 && isReducedMotion
                  ? "opacity-0 pointer-events-none"
                  : "rotate-y-0 shadow-[0_16px_36px_rgba(0,0,0,0.4)] pointer-events-auto"
              }`}
              style={{
                transformOrigin: "left center",
              }}
            >
              <div className="flex items-center justify-between">
                <div className="px-3 py-1 rounded-md bg-[#3B200F] border border-[#7A492C]/40 font-mono text-[10px] text-gold tracking-widest uppercase font-bold">
                  PORTAL 03
                </div>
                <div className="w-2 h-2 rounded-full bg-gold/80 shadow-sm shadow-gold" />
              </div>

              <div className="my-auto space-y-4 py-4">
                <div className="h-28 rounded-xl wood-panel-inset p-4 flex flex-col items-center justify-center text-center">
                  <div className="w-12 h-12 rounded-xl bg-[#2E180B] border border-[#7A492C]/30 flex items-center justify-center text-gold mb-2 shadow-inner">
                    <Compass className="w-6 h-6" />
                  </div>
                  <span className="font-serif font-bold text-2xl text-cream tracking-wider">
                    EXPLORE
                  </span>
                </div>

                <div className="h-28 rounded-xl wood-panel-inset p-4 flex flex-col items-center justify-center text-center">
                  <span className="font-serif italic text-gold text-base">
                    AI &amp; Products
                  </span>
                  <span className="font-mono text-[10px] text-cream/70 mt-1 uppercase">
                    Strategy &amp; Ventures
                  </span>
                </div>
              </div>

              <div className="relative pt-4 flex items-center justify-between border-t border-[#7A492C]/30 text-xs font-mono text-cream/80">
                <span>Walnut Wood</span>
                <div className="w-4 h-12 rounded-full brass-handle flex items-center justify-center shadow-lg" />
              </div>

              <div className="absolute bottom-0 inset-x-0 h-1 bg-gold door-light-gap opacity-85" />
            </div>

            <div className="relative z-30 py-2.5 bg-softblack-deep border-t border-border-dark text-center rounded-b-3xl">
              <button
                onClick={() => toggleDoor(2)}
                className="font-mono text-[11px] text-gold uppercase tracking-widest hover:text-cream transition-colors font-medium"
              >
                {activeDoor === 2 ? "• Click to Close Door 03" : "Click to Open Door 03"}
              </button>
            </div>
          </div>

          {/* ════ DOOR 04: BEYOND THE SCREEN ════ */}
          <div
            className="door-interactive-item door-container relative min-h-[580px] rounded-3xl door-frame flex flex-col bg-softblack shadow-2xl"
            onMouseEnter={() => handleMouseEnter(3)}
            onMouseLeave={handleMouseLeave}
          >
            {/* Interior Content Room */}
            <div className="p-6 flex-1 flex flex-col justify-between bg-softblack text-cream relative z-10 overflow-y-auto max-h-[580px] custom-scrollbar">
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-border-dark text-xs font-mono text-gold">
                  <span className="font-bold">DOOR 04 / HUMAN</span>
                  {activeDoor === 3 && (
                    <button
                      onClick={() => toggleDoor(3)}
                      aria-label="Close door"
                      className="p-1 rounded-full hover:bg-softblack-raised text-cream/60 hover:text-gold transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div>
                  <h3 className="font-serif font-bold text-2xl text-cream tracking-wide">
                    BEYOND THE SCREEN
                  </h3>
                  <p className="font-mono text-[11px] text-cream/60 mt-1">
                    Interests, sport &amp; creative pursuits.
                  </p>
                </div>

                <div className="space-y-2 pt-1">
                  {BEYOND_THE_SCREEN.map((item) => (
                    <div
                      key={item.title}
                      className="p-2.5 rounded-xl bg-softblack-raised border border-border-dark"
                    >
                      <div className="flex items-center justify-between mb-0.5">
                        <h5 className="font-sans font-semibold text-xs text-cream">
                          {item.title}
                        </h5>
                        <span className="font-mono text-[9px] uppercase px-1.5 py-0.5 rounded bg-gold/15 text-gold font-bold">
                          {item.tag}
                        </span>
                      </div>
                      <p className="font-sans text-[11px] text-cream/70 font-normal leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 mt-3 border-t border-border-dark font-mono text-[10px] text-cream/40">
                Grounding technology in life &amp; sport
              </div>
            </div>

            {/* Champagne Gold Light Spill */}
            <div
              className={`absolute inset-0 pointer-events-none transition-opacity duration-700 z-15 ${
                activeDoor === 3 ? "opacity-45" : "opacity-0"
              }`}
              style={{
                background:
                  "radial-gradient(circle at 10% 50%, rgba(184, 147, 90, 0.45) 0%, transparent 70%)",
              }}
              aria-hidden="true"
            />

            {/* REAL WALNUT WOODEN DOOR PANEL */}
            <div
              role="button"
              tabIndex={0}
              aria-label="Door 04: Beyond The Screen. Press enter or click to swing open."
              aria-expanded={activeDoor === 3}
              onClick={() => toggleDoor(3)}
              onKeyDown={(e) => handleKeyDown(e, 3)}
              className={`door-hinge absolute inset-0 z-20 cursor-pointer p-6 flex flex-col justify-between wood-texture text-cream select-none rounded-3xl ${
                activeDoor === 3 && !isReducedMotion
                  ? "-rotate-y-[112deg] shadow-[25px_0_50px_rgba(0,0,0,0.85)] pointer-events-auto"
                  : activeDoor === 3 && isReducedMotion
                  ? "opacity-0 pointer-events-none"
                  : "rotate-y-0 shadow-[0_16px_36px_rgba(0,0,0,0.4)] pointer-events-auto"
              }`}
              style={{
                transformOrigin: "left center",
              }}
            >
              <div className="flex items-center justify-between">
                <div className="px-3 py-1 rounded-md bg-[#3B200F] border border-[#7A492C]/40 font-mono text-[10px] text-gold tracking-widest uppercase font-bold">
                  PORTAL 04
                </div>
                <div className="w-2 h-2 rounded-full bg-gold/80 shadow-sm shadow-gold" />
              </div>

              <div className="my-auto space-y-4 py-4">
                <div className="h-28 rounded-xl wood-panel-inset p-4 flex flex-col items-center justify-center text-center">
                  <div className="w-12 h-12 rounded-xl bg-[#2E180B] border border-[#7A492C]/30 flex items-center justify-center text-gold mb-2 shadow-inner">
                    <Trophy className="w-6 h-6" />
                  </div>
                  <span className="font-serif font-bold text-2xl text-cream tracking-wider">
                    LIFE
                  </span>
                </div>

                <div className="h-28 rounded-xl wood-panel-inset p-4 flex flex-col items-center justify-center text-center">
                  <span className="font-serif italic text-gold text-base">
                    Beyond The Screen
                  </span>
                  <span className="font-mono text-[10px] text-cream/70 mt-1 uppercase">
                    Cricket, Series &amp; Culture
                  </span>
                </div>
              </div>

              <div className="relative pt-4 flex items-center justify-between border-t border-[#7A492C]/30 text-xs font-mono text-cream/80">
                <span>Walnut Wood</span>
                <div className="w-4 h-12 rounded-full brass-handle flex items-center justify-center shadow-lg" />
              </div>

              <div className="absolute bottom-0 inset-x-0 h-1 bg-gold door-light-gap opacity-85" />
            </div>

            <div className="relative z-30 py-2.5 bg-softblack-deep border-t border-border-dark text-center rounded-b-3xl">
              <button
                onClick={() => toggleDoor(3)}
                className="font-mono text-[11px] text-gold uppercase tracking-widest hover:text-cream transition-colors font-medium"
              >
                {activeDoor === 3 ? "• Click to Close Door 04" : "Click to Open Door 04"}
              </button>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
