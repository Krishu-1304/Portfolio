"use client";

import React, { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { HeroSection } from "@/components/sections/HeroSection";
import { WorkSection } from "@/components/sections/WorkSection";
import { DoorsSection } from "@/components/sections/DoorsSection";
import { EducationSection } from "@/components/sections/EducationSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { usePortfolioScroll, scrollStore } from "@/context/ScrollContext";
import { MOTION } from "@/lib/motion";

// Lazy-load Living 3D Background with SSR disabled
const SceneCanvas = dynamic(
  () => import("@/components/3d/SceneCanvas").then((mod) => mod.SceneCanvas),
  { ssr: false }
);

export default function Home() {
  const { isReducedMotion } = usePortfolioScroll();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);

    let lenis: Lenis | null = null;
    let tickerCallback: ((time: number) => void) | null = null;

    if (!isReducedMotion) {
      lenis = new Lenis({
        duration: MOTION.scroll.lenisDuration || 1.1,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: "vertical",
        smoothWheel: true,
      });

      // Expose to window for modal/card scroll pause & resume
      (window as unknown as { lenis: Lenis | null }).lenis = lenis;

      // Synchronize Lenis scroll event with GSAP ScrollTrigger
      lenis.on("scroll", () => {
        ScrollTrigger.update();
      });

      // Drive Lenis directly from GSAP ticker for single unified clock
      tickerCallback = (time: number) => {
        lenis?.raf(time * 1000);
      };
      gsap.ticker.add(tickerCallback);
      gsap.ticker.lagSmoothing(0);
    }

    // Wrap GSAP ScrollTriggers in gsap.context() for safe cleanup
    const ctx = gsap.context(() => {
      // Global scroll progress tracker
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: MOTION.scroll.scrubSmoothness || 0.6,
        onUpdate: (self) => {
          scrollStore.set(self.progress);
          const glow = document.getElementById("ambient-glow");
          if (glow) {
            glow.style.top = `${20 + self.progress * 60}%`;
          }
        },
      });
    }, containerRef);

    // Prevent layout shift: refresh ScrollTrigger after fonts and assets load
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        ScrollTrigger.refresh();
      });
    }

    const handleWindowLoad = () => {
      ScrollTrigger.refresh();
    };
    window.addEventListener("load", handleWindowLoad);

    return () => {
      window.removeEventListener("load", handleWindowLoad);
      ctx.revert();
      if (tickerCallback) {
        gsap.ticker.remove(tickerCallback);
      }
      if (lenis) {
        lenis.destroy();
      }
    };
  }, [isReducedMotion]);

  return (
    <div ref={containerRef} className="relative w-full overflow-x-hidden bg-ivory text-charcoal">
      {/* Living 3D Background with Floating Low-Poly Objects (Champagne Gold, Cream, Walnut) */}
      <SceneCanvas />

      {/* ─── BAND 1: IVORY HERO ─────────────────────────────────────────── */}
      <HeroSection />

      {/* ─── BAND 2: BLACK PROJECTS BAND ───────────────────────────────── */}
      <WorkSection />

      {/* ─── BAND 3: IVORY ABOUT / DOORS / SKILLS BAND ──────────────────── */}
      <DoorsSection />

      {/* ─── BAND 4: BLACK EDUCATION + CONTACT & FOOTER ─────────────────── */}
      <div className="bg-softblack text-cream">
        <EducationSection />
        <ContactSection />
      </div>
    </div>
  );
}
