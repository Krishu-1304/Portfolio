"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { PROJECTS, Project } from "@/data/content";
import { soundManager } from "@/lib/audioSynthesizer";
import {
  ArrowUpRight,
  Waves,
  Activity,
  Lock,
  Unlock,
  X,
  Sparkles,
  CheckCircle2,
  Cpu,
  Smartphone,
  Brain,
  Sliders,
  FileCode2,
} from "lucide-react";
import { GithubIcon } from "../ui/Icons";
import { usePortfolioScroll } from "@/context/ScrollContext";

export const WorkSection: React.FC = () => {
  const { isReducedMotion } = usePortfolioScroll();
  const [openBoxId, setOpenBoxId] = useState<string | null>(null);

  // Close on Escape or click outside
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && openBoxId) {
        setOpenBoxId(null);
      }
    };
    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, [openBoxId]);

  // Handle Lenis pause / resume when detailed view opens
  useEffect(() => {
    const win = window as unknown as { lenis?: { stop: () => void; start: () => void } };
    if (openBoxId) {
      win.lenis?.stop();
      document.body.style.overflow = "hidden";
    } else {
      win.lenis?.start();
      document.body.style.overflow = "";
    }
    return () => {
      win.lenis?.start();
      document.body.style.overflow = "";
    };
  }, [openBoxId]);

  const handleToggleBox = (id: string) => {
    soundManager.playClick();
    setOpenBoxId((prev) => (prev === id ? null : id));
  };

  const enabledProjects = PROJECTS.filter((p) => p.enabled);

  return (
    <section
      id="projects"
      className="relative w-full px-5 sm:px-8 md:px-14 pt-28 pb-32 bg-softblack text-cream border-t border-border-dark overflow-hidden"
      aria-label="Projects as 3D Physical Objects"
    >
      {/* Background Ghost Text */}
      <div
        className="absolute top-10 left-0 right-0 flex justify-center pointer-events-none select-none opacity-20 overflow-hidden"
        aria-hidden="true"
      >
        <span className="font-serif text-[clamp(4.5rem,15vw,13rem)] text-outline-light tracking-tight font-bold whitespace-nowrap">
          PROJECT CASES
        </span>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-softblack-raised border border-border-dark text-xs font-mono text-gold font-medium">
            <Sparkles className="w-3.5 h-3.5 text-gold" />
            <span>02 / 3D PHYSICAL ARTIFACTS</span>
          </div>

          <h2 className="font-serif text-4xl sm:text-6xl md:text-7xl text-cream tracking-tight font-bold">
            PROJECT CASES IN 3D
          </h2>

          <p className="font-sans text-sm sm:text-base text-cream-muted font-normal max-w-xl mx-auto">
            Physical lidded cases sculpted in warm matte black with champagne gold clasps. Click or press Enter to swing the lid open in 3D and inspect project architecture and repositories.
          </p>

          <p className="font-mono text-[11px] uppercase tracking-widest text-gold font-medium">
            Click / Enter to Open · Press Esc to Close
          </p>
        </div>

        {/* ─── 3D HINGED PROJECT CASES GRID (Side-by-side on desktop, stacked on mobile) ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-stretch">
          {enabledProjects.map((project, idx) => {
            const isOpen = openBoxId === project.id;
            const isInfant = project.id === "infant-monitoring";

            return (
              <ProjectBoxItem
                key={project.id}
                project={project}
                index={idx + 1}
                isOpen={isOpen}
                isInfant={isInfant}
                isReducedMotion={isReducedMotion}
                onToggle={() => handleToggleBox(project.id)}
              />
            );
          })}
        </div>
      </div>

      {/* ─── DETAILED PROJECT OPENED VIEW MODAL (When Lid is Open) ─── */}
      {openBoxId && (
        <DetailedProjectView
          project={enabledProjects.find((p) => p.id === openBoxId)!}
          isInfant={openBoxId === "infant-monitoring"}
          onClose={() => setOpenBoxId(null)}
        />
      )}
    </section>
  );
};

/* ─────────────────────────── PROJECT BOX ITEM COMPONENT ─────────────────────────── */

interface ProjectBoxItemProps {
  project: Project;
  index: number;
  isOpen: boolean;
  isInfant: boolean;
  isReducedMotion: boolean;
  onToggle: () => void;
}

const ProjectBoxItem: React.FC<ProjectBoxItemProps> = ({
  project,
  index,
  isOpen,
  isInfant,
  isReducedMotion,
  onToggle,
}) => {
  const [mouseTilt, setMouseTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isReducedMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMouseTilt({ x, y });
  };

  const handleMouseLeave = () => {
    setMouseTilt({ x: 0, y: 0 });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onToggle();
    }
  };

  return (
    <div
      className="project-box-container relative w-full h-full flex flex-col"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* 3D FLOATING CASE */}
      <div
        className="project-box relative w-full h-full rounded-[2.5rem] bg-softblack-raised border border-border-dark shadow-2xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 hover:border-gold/50"
        style={{
          transform: isReducedMotion
            ? "none"
            : `perspective(1400px) rotateY(${mouseTilt.x * 8}deg) rotateX(${-mouseTilt.y * 8}deg)`,
          boxShadow: isOpen
            ? "0 25px 60px -10px rgba(0, 0, 0, 0.95), 0 0 50px rgba(184, 147, 90, 0.35)"
            : "0 20px 45px -10px rgba(0, 0, 0, 0.8)",
        }}
      >
        {/* Soft Interior Champagne Gold Glow */}
        <div
          className={`absolute inset-4 rounded-3xl pointer-events-none transition-opacity duration-700 ${
            isOpen ? "opacity-100" : "opacity-0"
          }`}
          style={{
            background:
              "radial-gradient(circle at 50% 20%, rgba(184, 147, 90, 0.35) 0%, transparent 70%)",
          }}
          aria-hidden="true"
        />

        {/* ─── 3D HINGED LID (Immediately visible, filled from top of card) ─── */}
        <div
          role="button"
          tabIndex={0}
          aria-expanded={isOpen}
          aria-label={`${project.title} 3D Box. Press enter or click to swing lid open.`}
          onClick={onToggle}
          onKeyDown={handleKeyDown}
          className={`project-box-lid relative z-20 cursor-pointer rounded-2xl p-6 sm:p-8 bg-gradient-to-b from-[#1C1A17] to-[#12110F] border border-border-dark shadow-xl flex flex-col justify-between flex-1 select-none transition-transform duration-500 ${
            isOpen ? "-rotate-x-[115deg] opacity-25" : "rotate-x-0 opacity-100"
          }`}
          style={{
            transformOrigin: "top center",
          }}
        >
          {/* Lid Top Bevel & Metallic Clasp */}
          <div className="flex items-center justify-between mb-6">
            <span className="font-mono text-[10px] uppercase tracking-widest text-gold font-medium">
              PHYSICAL ARTIFACT #{String(index).padStart(2, "0")}
            </span>

            {/* Champagne Gold Metallic Clasp */}
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold text-softblack font-mono text-[11px] font-bold shadow-md shadow-gold/30">
              {isOpen ? <Unlock className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
              <span>{isOpen ? "UNLOCKED" : "LOCKED"}</span>
            </div>
          </div>

          {/* Project Icon & Name Stamped on Lid */}
          <div className="my-6 text-center space-y-3">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-softblack border border-gold/40 flex items-center justify-center text-gold shadow-inner">
              {isInfant ? <Waves className="w-7 h-7" /> : <Activity className="w-7 h-7" />}
            </div>
            <h3 className="font-serif font-bold text-2xl sm:text-3xl text-cream tracking-wide">
              {project.title}
            </h3>
            <p className="font-serif italic text-gold text-base">
              {project.subtitle}
            </p>
            <p className="font-sans text-xs sm:text-sm text-cream/70 max-w-sm mx-auto line-clamp-2 pt-1">
              {project.description}
            </p>
          </div>

          {/* Lid Bottom Edge with Golden Hinges */}
          <div className="pt-4 border-t border-border-dark flex items-center justify-between font-mono text-xs text-cream/70">
            <span>Matte Soft Black Case</span>
            <span className="text-gold flex items-center gap-1 font-bold">
              {isOpen ? "Click to Shut" : "Click to Open Lid"}
            </span>
          </div>
        </div>

        {/* Case Base Bar with Clasp Catch */}
        <div className="mt-4 pt-3 border-t border-border-dark flex items-center justify-between font-mono text-[10px] text-cream/50">
          <span>Hinged 3D Case</span>
          <button
            onClick={onToggle}
            className="text-gold hover:text-cream transition-colors uppercase tracking-widest font-medium"
          >
            {isOpen ? "Close Box" : "Swing Open Box"}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────── DETAILED OPENED VIEW COMPONENT ─────────────────────────── */

/*
 * ── Cover image config ──
 * Change the extension below if your images are .jpg instead of .png.
 * The file must be placed at: /public/projects/<slug>/cover.<ext>
 */
const COVER_IMAGE_EXT = ".png"; // Change to ".jpg" if needed

interface DetailedProjectViewProps {
  project: Project;
  isInfant: boolean;
  onClose: () => void;
}

const DetailedProjectView: React.FC<DetailedProjectViewProps> = ({
  project,
  isInfant,
  onClose,
}) => {
  const [imgError, setImgError] = useState(false);

  const imageSrc = isInfant
    ? `/projects/infant/cover${COVER_IMAGE_EXT}`
    : `/projects/vocahealth/cover${COVER_IMAGE_EXT}`;

  /* ── Detail-view colour tokens (Hero Warm Beige palette) ── */
  const dv = {
    bg: "linear-gradient(to bottom, #F5EFE6, #F8F2EA)",
    cardBg: "#FCF3E9",
    cardBorder: "rgba(201,154,91,0.30)",
    cardShadow: "0 8px 24px rgba(60,40,20,0.06)",
    text: "#1A1612",
    textMuted: "rgba(26,22,18,0.70)",
    headerBg: "#EDE5DA",
    goldAccent: "#8C5D23", // Deep amber for crisp WCAG AA contrast on beige
    goldMuted: "rgba(140,93,35,0.15)",
    backdropBg: "rgba(20,17,15,0.65)",
  } as const;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${project.title} Detailed Specification`}
      className="fixed inset-0 z-30 backdrop-blur-md flex justify-center items-start pt-[92px] sm:pt-[104px] pb-4 sm:pb-8 px-3 sm:px-6 md:px-8 animate-in fade-in zoom-in-95 duration-200"
      style={{
        backgroundColor: dv.backdropBg,
        ["--detail-bg" as string]: "#F5EFE6",
        ["--detail-card-bg" as string]: "#FCF3E9",
        ["--detail-text" as string]: "#1A1612",
        ["--detail-text-muted" as string]: "rgba(26,22,18,0.70)",
        ["--detail-border" as string]: "rgba(201,154,91,0.30)",
        ["--detail-accent" as string]: "#8C5D23",
      } as React.CSSProperties}
      onClick={(e) => {
        // Close on backdrop click (outside the card)
        if (e.target === e.currentTarget) {
          soundManager.playClick();
          onClose();
        }
      }}
    >
      {/* Modal Dialog Card — positioned below nav with clearance */}
      <div
        className="relative w-full max-w-4xl h-[calc(100dvh-108px)] sm:h-[calc(100dvh-124px)] flex flex-col rounded-3xl border shadow-2xl overflow-hidden"
        style={{
          background: dv.bg,
          borderColor: dv.cardBorder,
          color: dv.text,
          boxShadow: "0 25px 60px -15px rgba(20,17,15,0.25), 0 0 40px rgba(184,147,90,0.15)",
        }}
      >
        {/* Top Sticky Bar — below navbar height */}
        <div
          className="sticky top-0 z-20 flex items-center justify-between px-6 py-3.5 sm:py-4 border-b shrink-0"
          style={{ backgroundColor: dv.headerBg, borderColor: dv.cardBorder }}
        >
          <div className="flex items-center gap-2.5 font-mono text-xs" style={{ color: dv.goldAccent }}>
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: dv.goldAccent }} />
            <span className="font-bold tracking-widest uppercase">
              {isInfant ? "ARTIFACT #01 · FINAL YEAR PROJECT" : "ARTIFACT #02 · RESEARCH & EXPLORATION"}
            </span>
          </div>

          {/* 44x44px circular close button matching hero styling */}
          <button
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            aria-label="Close detailed view"
            className="w-11 h-11 rounded-full flex items-center justify-center shrink-0 transition-all duration-200 shadow-md group border border-[rgba(201,154,91,0.30)] hover:border-[#B8935A] hover:scale-105 active:scale-95"
            style={{
              backgroundColor: "#1A1612",
              color: "#F5EFE6",
            }}
          >
            <X className="w-5 h-5 text-[#F5EFE6] group-hover:text-gold transition-colors" />
          </button>
        </div>

        {/* Scrollable Content Body — data-lenis-prevent keeps Lenis from hijacking wheel */}
        <div
          data-lenis-prevent
          data-lenis-prevent-wheel
          data-lenis-prevent-touch
          className="overflow-y-auto overscroll-contain select-text detail-panel-scroll flex-1"
        >
          <div className="p-6 sm:p-8 md:p-10 space-y-8 pb-12">
            {/* ── 1. Top Section: Image & Header ── */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              {/* Cover Image Container */}
              <div
                className="relative w-full rounded-2xl overflow-hidden shadow-md"
                style={{
                  aspectRatio: "4/3",
                  minHeight: "240px",
                  border: `1px solid ${dv.cardBorder}`,
                  backgroundColor: dv.cardBg,
                }}
              >
                {!imgError ? (
                  <Image
                    src={imageSrc}
                    alt={
                      isInfant
                        ? "Infant Monitoring System Cover"
                        : "VocaHealth Voice Health Tracking Cover"
                    }
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, 450px"
                    className="object-cover"
                    onError={() => setImgError(true)}
                  />
                ) : (
                  /* Fallback: icon + gradient when image file is missing or broken */
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3" style={{ background: dv.cardBg }}>
                    {isInfant ? <Waves className="w-12 h-12 text-[#8C5D23]/60" /> : <Activity className="w-12 h-12 text-[#8C5D23]/60" />}
                    <span className="font-mono text-xs text-[#8C5D23]">Cover image not found</span>
                  </div>
                )}
                {/* Dark gradient overlay for bottom text legibility */}
                <div
                  className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent pointer-events-none"
                  aria-hidden="true"
                />
                <span
                  className="absolute bottom-3 left-3 px-2.5 py-1 rounded-md backdrop-blur-md font-mono text-[10px] text-gold"
                  style={{ backgroundColor: "rgba(20,17,15,0.85)", border: `1px solid ${dv.cardBorder}` }}
                >
                  {isInfant ? "Flutter Client · TFLite" : "Audio DSP · MFCC Analysis"}
                </span>
              </div>

              {/* Title, Subtitle, Summary & Status */}
              <div className="space-y-3">
                <div
                  className="inline-block px-3 py-1 rounded-full font-mono text-[11px] font-bold"
                  style={{
                    backgroundColor: dv.goldMuted,
                    border: `1px solid ${dv.cardBorder}`,
                    color: dv.goldAccent,
                  }}
                >
                  {isInfant ? "Final Year Project" : "Research & Exploration Project"}
                </div>

                <h2 className="font-serif font-bold text-2xl sm:text-3xl tracking-tight" style={{ color: dv.text }}>
                  {project.title}
                </h2>

                <p className="font-serif italic text-base font-medium" style={{ color: dv.goldAccent }}>
                  {project.subtitle}
                </p>

                <p className="font-sans text-sm leading-relaxed" style={{ color: dv.textMuted }}>
                  {project.description}
                </p>
              </div>
            </div>

            {/* ── 2. Overview ── */}
            <div
              className="rounded-2xl p-5 space-y-2"
              style={{
                backgroundColor: dv.cardBg,
                border: `1px solid ${dv.cardBorder}`,
                boxShadow: dv.cardShadow,
              }}
            >
              <h4 className="font-mono text-xs uppercase tracking-widest font-bold flex items-center gap-2" style={{ color: dv.goldAccent }}>
                <Brain className="w-3.5 h-3.5" style={{ color: dv.goldAccent }} />
                Overview
              </h4>
              <p className="font-sans text-sm leading-relaxed" style={{ color: dv.textMuted }}>
                {isInfant
                  ? "An AI-driven infant monitoring system that listens to a baby\u2019s cry and helps parents understand why the baby is crying. It combines cry detection with posture analysis and runs in a Flutter mobile app."
                  : "An exploratory acoustic biomarker analysis system that processes human vocal recordings to detect subtle acoustic anomalies. It evaluates voice stability parameters to understand vocal fold strain and health patterns."}
              </p>
            </div>

            {/* ── 3. The Problem ── */}
            <div
              className="rounded-2xl p-5 space-y-2"
              style={{
                backgroundColor: dv.cardBg,
                border: `1px solid ${dv.cardBorder}`,
                boxShadow: dv.cardShadow,
              }}
            >
              <h4 className="font-mono text-xs uppercase tracking-widest font-bold flex items-center gap-2" style={{ color: dv.goldAccent }}>
                <Sliders className="w-3.5 h-3.5" style={{ color: dv.goldAccent }} />
                The Problem
              </h4>
              <p className="font-sans text-sm leading-relaxed" style={{ color: dv.textMuted }}>
                {isInfant
                  ? "New parents often cannot tell why a baby is crying, especially at night, and constant manual checking is tiring and stressful."
                  : "Subtle variations in acoustic biomarkers (jitter, shimmer, pitch perturbation) frequently precede detectable voice strain, but traditional laboratory acoustic analysis requires specialized clinical equipment and is inaccessible for routine tracking."}
              </p>
            </div>

            {/* ── 4. How It Works (Numbered Steps) ── */}
            <div className="space-y-3">
              <h4 className="font-mono text-xs uppercase tracking-widest font-bold flex items-center gap-2" style={{ color: dv.goldAccent }}>
                <FileCode2 className="w-3.5 h-3.5" style={{ color: dv.goldAccent }} />
                How It Works
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {isInfant ? (
                  <>
                    <div
                      className="p-4 rounded-xl space-y-1.5"
                      style={{
                        backgroundColor: dv.cardBg,
                        border: `1px solid ${dv.cardBorder}`,
                        boxShadow: dv.cardShadow,
                      }}
                    >
                      <span className="font-mono text-xs font-bold" style={{ color: dv.goldAccent }}>01. Recording</span>
                      <p className="font-sans text-xs" style={{ color: dv.textMuted }}>
                        The mobile app records the baby&apos;s audio signal in real-time.
                      </p>
                    </div>
                    <div
                      className="p-4 rounded-xl space-y-1.5"
                      style={{
                        backgroundColor: dv.cardBg,
                        border: `1px solid ${dv.cardBorder}`,
                        boxShadow: dv.cardShadow,
                      }}
                    >
                      <span className="font-mono text-xs font-bold" style={{ color: dv.goldAccent }}>02. YAMNet Embeddings</span>
                      <p className="font-sans text-xs" style={{ color: dv.textMuted }}>
                        YAMNet pretrained audio model converts sound into a 1024-dimensional embedding.
                      </p>
                    </div>
                    <div
                      className="p-4 rounded-xl space-y-1.5"
                      style={{
                        backgroundColor: dv.cardBg,
                        border: `1px solid ${dv.cardBorder}`,
                        boxShadow: dv.cardShadow,
                      }}
                    >
                      <span className="font-mono text-xs font-bold" style={{ color: dv.goldAccent }}>03. MLP Classifier</span>
                      <p className="font-sans text-xs" style={{ color: dv.textMuted }}>
                        A neural network classifier (MLP) predicts the specific cry reason.
                      </p>
                    </div>
                    <div
                      className="p-4 rounded-xl space-y-1.5"
                      style={{
                        backgroundColor: dv.cardBg,
                        border: `1px solid ${dv.cardBorder}`,
                        boxShadow: dv.cardShadow,
                      }}
                    >
                      <span className="font-mono text-xs font-bold" style={{ color: dv.goldAccent }}>04. On-Device TFLite</span>
                      <p className="font-sans text-xs" style={{ color: dv.textMuted }}>
                        The model executes locally on the device using TensorFlow Lite.
                      </p>
                    </div>
                    <div
                      className="p-4 rounded-xl space-y-1.5"
                      style={{
                        backgroundColor: dv.cardBg,
                        border: `1px solid ${dv.cardBorder}`,
                        boxShadow: dv.cardShadow,
                      }}
                    >
                      <span className="font-mono text-xs font-bold" style={{ color: dv.goldAccent }}>05. Flutter Delivery</span>
                      <p className="font-sans text-xs" style={{ color: dv.textMuted }}>
                        The parent receives instantaneous classification results in the Flutter client.
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <div
                      className="p-4 rounded-xl space-y-1.5"
                      style={{
                        backgroundColor: dv.cardBg,
                        border: `1px solid ${dv.cardBorder}`,
                        boxShadow: dv.cardShadow,
                      }}
                    >
                      <span className="font-mono text-xs font-bold" style={{ color: dv.goldAccent }}>01. Voice Capture</span>
                      <p className="font-sans text-xs" style={{ color: dv.textMuted }}>
                        Captures sustained phonation audio sample via high-fidelity microphone input.
                      </p>
                    </div>
                    <div
                      className="p-4 rounded-xl space-y-1.5"
                      style={{
                        backgroundColor: dv.cardBg,
                        border: `1px solid ${dv.cardBorder}`,
                        boxShadow: dv.cardShadow,
                      }}
                    >
                      <span className="font-mono text-xs font-bold" style={{ color: dv.goldAccent }}>02. DSP Extraction</span>
                      <p className="font-sans text-xs" style={{ color: dv.textMuted }}>
                        Digital signal processing extracts fundamental frequency, jitter, and shimmer.
                      </p>
                    </div>
                    <div
                      className="p-4 rounded-xl space-y-1.5"
                      style={{
                        backgroundColor: dv.cardBg,
                        border: `1px solid ${dv.cardBorder}`,
                        boxShadow: dv.cardShadow,
                      }}
                    >
                      <span className="font-mono text-xs font-bold" style={{ color: dv.goldAccent }}>03. MFCC Transformation</span>
                      <p className="font-sans text-xs" style={{ color: dv.textMuted }}>
                        Computes Mel-Frequency Cepstral Coefficients representing vocal tract shape.
                      </p>
                    </div>
                    <div
                      className="p-4 rounded-xl space-y-1.5"
                      style={{
                        backgroundColor: dv.cardBg,
                        border: `1px solid ${dv.cardBorder}`,
                        boxShadow: dv.cardShadow,
                      }}
                    >
                      <span className="font-mono text-xs font-bold" style={{ color: dv.goldAccent }}>04. Feature Analysis</span>
                      <p className="font-sans text-xs" style={{ color: dv.textMuted }}>
                        Machine learning evaluates feature distributions against baseline acoustic profiles.
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* ── 5. Key Features ── */}
            <div
              className="rounded-2xl p-5 space-y-3"
              style={{
                backgroundColor: dv.cardBg,
                border: `1px solid ${dv.cardBorder}`,
                boxShadow: dv.cardShadow,
              }}
            >
              <h4 className="font-mono text-xs uppercase tracking-widest font-bold flex items-center gap-2" style={{ color: dv.goldAccent }}>
                <CheckCircle2 className="w-3.5 h-3.5" style={{ color: dv.goldAccent }} />
                Key Features
              </h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs font-sans" style={{ color: dv.textMuted }}>
                {isInfant ? (
                  <>
                    <li className="flex items-center gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: dv.goldAccent }} />
                      Cry reason classification (hunger, belly pain, burping, tiredness, discomfort)
                    </li>
                    <li className="flex items-center gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: dv.goldAccent }} />
                      Distress classes merged into a physical discomfort category
                    </li>
                    <li className="flex items-center gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: dv.goldAccent }} />
                      On-device TensorFlow Lite inference
                    </li>
                    <li className="flex items-center gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: dv.goldAccent }} />
                      Responsive Flutter mobile client
                    </li>
                    <li className="flex items-center gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: dv.goldAccent }} />
                      Posture analysis integration as part of the wider system
                    </li>
                  </>
                ) : (
                  <>
                    <li className="flex items-center gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: dv.goldAccent }} />
                      Acoustic biomarker parameter extraction (jitter, shimmer, pitch stability)
                    </li>
                    <li className="flex items-center gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: dv.goldAccent }} />
                      Mel-Frequency Cepstral Coefficients (MFCC) spectral analysis
                    </li>
                    <li className="flex items-center gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: dv.goldAccent }} />
                      Python & Audio DSP signal processing pipeline
                    </li>
                    <li className="flex items-center gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: dv.goldAccent }} />
                      Machine learning anomaly evaluation
                    </li>
                  </>
                )}
              </ul>
            </div>

            {/* ── 6. Tech Stack Chips ── */}
            <div className="space-y-2">
              <h4 className="font-mono text-xs uppercase tracking-widest font-bold flex items-center gap-2" style={{ color: dv.goldAccent }}>
                <Cpu className="w-3.5 h-3.5" style={{ color: dv.goldAccent }} />
                Technology Stack
              </h4>
              <div className="flex flex-wrap gap-2">
                {(isInfant
                  ? ["Python", "TensorFlow", "TFLite", "YAMNet", "Flutter"]
                  : ["Python", "Audio DSP", "Machine Learning", "MFCC"]
                ).map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1 rounded-full font-mono text-xs font-medium"
                    style={{
                      backgroundColor: "transparent",
                      border: "1px solid rgba(169,120,58,0.45)",
                      color: dv.text,
                    }}
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* ── 7. My Role ── */}
            <div
              className="rounded-2xl p-5 space-y-2"
              style={{
                backgroundColor: dv.cardBg,
                border: `1px solid ${dv.cardBorder}`,
                boxShadow: dv.cardShadow,
              }}
            >
              <h4 className="font-mono text-xs uppercase tracking-widest font-bold flex items-center gap-2" style={{ color: dv.goldAccent }}>
                <Smartphone className="w-3.5 h-3.5" style={{ color: dv.goldAccent }} />
                My Role
              </h4>
              <p className="font-sans text-sm leading-relaxed" style={{ color: dv.textMuted }}>
                {isInfant
                  ? "Built the ML pipeline (data cleaning, training, evaluation) and the model deployment for the Flutter app."
                  : "Audio feature extraction pipeline, signal processing analysis, and machine learning experiment modeling."}
              </p>
            </div>

            {/* ── 8. Action Buttons ── */}
            <div className="pt-4 flex items-center justify-between" style={{ borderTop: `1px solid ${dv.cardBorder}` }}>
              <a
                href={project.github || "https://github.com/Krishu-1304"}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => soundManager.playClick()}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full font-sans text-xs font-semibold transition-all shadow-md hover:scale-105 active:scale-95"
                style={{
                  backgroundColor: "#1A1612",
                  color: "#F5EFE6",
                  border: "1px solid #1A1612",
                }}
              >
                <GithubIcon className="w-4 h-4" />
                <span>View on GitHub</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-gold" />
              </a>

              <button
                onClick={() => {
                  soundManager.playClick();
                  onClose();
                }}
                className="px-6 py-2.5 rounded-full font-sans text-xs font-medium transition-colors hover:border-[#B8935A]"
                style={{
                  backgroundColor: dv.cardBg,
                  border: `1px solid ${dv.cardBorder}`,
                  color: dv.text,
                }}
              >
                Close Specification
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
