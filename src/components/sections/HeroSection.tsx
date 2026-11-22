"use client";

import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import Image from "next/image";
import { PERSONAL_INFO, NAV_LINKS } from "@/data/content";
import { MagneticButton } from "../ui/MagneticButton";
import { ArrowUpRight, Download, ChevronUp } from "lucide-react";
import { soundManager } from "@/lib/audioSynthesizer";
import { usePortfolioScroll } from "@/context/ScrollContext";

/* ─────────────────────────── TYPES ─────────────────────────── */
interface TimeState {
  time: string;
  date: string;
}

/* ─────────────────────────── CONSTANTS ─────────────────────── */
const FLIP_ROLES = [
  "Computer Engineer",
  "ML Builder",
  "Data & BI Builder",
  "App Developer",
  "Product Thinker",
];
const FLIP_INTERVAL_MS = 2400;
const MASK_FEATHER = 72;
const MASK_RADIUS_ACTIVE = 130;
const MASK_RADIUS_INACTIVE = 0;
const LERP_FACTOR = 0.14;

/* ─────────────────────────── LIVE CLOCK ────────────────────── */
function useLiveClock(): TimeState {
  const fmt = useCallback((): TimeState => {
    const now = new Date();
    return {
      time: now.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
      date: now.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      }),
    };
  }, []);

  const [state, setState] = useState<TimeState>(fmt);

  useEffect(() => {
    const id = setInterval(() => setState(fmt()), 10000);
    return () => clearInterval(id);
  }, [fmt]);

  return state;
}

/* ─────────────────────────── NOTEPAD FLIP CARD ─────────────── */
interface NotepadFlipCardProps {
  roles: string[];
  intervalMs: number;
  isReducedMotion: boolean;
}

const NotepadFlipCard: React.FC<NotepadFlipCardProps> = ({
  roles,
  intervalMs,
  isReducedMotion,
}) => {
  const [current, setCurrent] = useState(0);
  const [next, setNext] = useState(1);
  const [phase, setPhase] = useState<"idle" | "exit" | "enter">("idle");
  const hoveredRef = useRef(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startInterval = useCallback(() => {
    // Delay first flip by one full interval so card is visible on load
    const firstFlipTimer = setTimeout(() => {
      intervalRef.current = setInterval(() => {
        if (hoveredRef.current) return;
        setPhase("exit");
        setTimeout(() => {
          setCurrent((c) => {
            const n = (c + 1) % roles.length;
            setNext((n + 1) % roles.length);
            return n;
          });
          setPhase("enter");
          setTimeout(() => setPhase("idle"), 420);
        }, 310);
      }, intervalMs);
    }, intervalMs);
    return firstFlipTimer;
  }, [roles.length, intervalMs]);

  useEffect(() => {
    const timer = startInterval();
    return () => {
      clearTimeout(timer);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [startInterval]);

  // Reduced motion: simple fade
  if (isReducedMotion) {
    return (
      <div className="relative notepad-card rounded-lg overflow-hidden select-none"
        style={{ minWidth: 260, maxWidth: 400 }}>
        <NotepadRings />
        <div className="notepad-face px-6 py-4 pt-3">
          <span className="font-serif font-bold text-[#14110F] text-3xl sm:text-4xl leading-tight block whitespace-nowrap transition-opacity duration-500">
            {roles[current]}
          </span>
          <div className="flex justify-between items-center mt-2">
            <span className="font-mono text-[10px] text-[#14110F]/40 uppercase tracking-widest">Role</span>
            <span className="font-mono text-[10px] text-[#14110F]/40">
              {String(current + 1).padStart(2, "0")}/{String(roles.length).padStart(2, "0")}
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative notepad-card rounded-lg overflow-hidden select-none cursor-default"
      style={{ minWidth: 260, maxWidth: 400, perspective: 600 }}
      onMouseEnter={() => { hoveredRef.current = true; }}
      onMouseLeave={() => { hoveredRef.current = false; }}
    >
      <NotepadRings />
      {/* Stacked paper edges */}
      <div className="absolute inset-x-0 bottom-0 h-[6px] bg-[#E8D9C4] rounded-b-lg" style={{ zIndex: 0 }} />
      <div className="absolute inset-x-0 bottom-[6px] h-[4px] bg-[#EFE3CE] rounded-b-lg" style={{ zIndex: 0 }} />

      {/* Card face with 3D flip */}
      <div
        className="notepad-face px-6 py-4 pt-3 relative"
        style={{
          transformOrigin: "top center",
          transform:
            phase === "exit"
              ? "rotateX(-85deg)"
              : phase === "enter"
              ? "rotateX(85deg)"
              : "rotateX(0deg)",
          transition: phase !== "idle"
            ? "transform 0.28s cubic-bezier(0.4, 0, 0.2, 1)"
            : "transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)",
          backfaceVisibility: "hidden",
        }}
      >
        <span
          className="font-serif font-bold text-[#14110F] text-3xl sm:text-4xl leading-tight block whitespace-nowrap"
          style={{ textShadow: "0 1px 0 rgba(20,17,15,0.08)" }}
        >
          {roles[current]}
        </span>
        <div className="flex justify-between items-center mt-2.5">
          <span className="font-mono text-[10px] text-[#14110F]/38 uppercase tracking-widest">What I do</span>
          <span className="font-mono text-[10px] text-[#14110F]/38">
            {String(current + 1).padStart(2, "0")}/{String(roles.length).padStart(2, "0")}
          </span>
        </div>
      </div>
    </div>
  );
};

/* Spiral rings at top of card */
const NotepadRings: React.FC = () => (
  <div
    className="relative flex items-center gap-[7px] px-4 py-1.5"
    style={{ background: "#1C1915", borderRadius: "8px 8px 0 0" }}
    aria-hidden="true"
  >
    {Array.from({ length: 11 }).map((_, i) => (
      <div
        key={i}
        className="rounded-full border-2"
        style={{
          width: 11,
          height: 11,
          borderColor: "#3A342C",
          background: "#0E0D0C",
          boxShadow: "inset 0 1px 2px rgba(0,0,0,0.5)",
        }}
      />
    ))}
  </div>
);

/* ─────────────────────────── PHOTO with CURSOR REVEAL ──────── */
interface PhotoRevealProps {
  isReducedMotion: boolean;
}

const PhotoReveal: React.FC<PhotoRevealProps> = ({ isReducedMotion }) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const colorLayerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const cursorPosRef = useRef({ x: 0.5, y: 0.5 }); // normalized 0-1
  const lerpPosRef = useRef({ x: 0.5, y: 0.5 });
  const radiusRef = useRef(MASK_RADIUS_INACTIVE);
  const targetRadiusRef = useRef(MASK_RADIUS_INACTIVE);
  const isInsideRef = useRef(false);

  // 3D tilt
  const tiltRef = useRef({ x: 0, y: 0 });
  const tiltLerpRef = useRef({ x: 0, y: 0 });
  const photoWrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isReducedMotion) return;

    const raf = () => {
      // Lerp cursor position
      lerpPosRef.current.x += (cursorPosRef.current.x - lerpPosRef.current.x) * LERP_FACTOR;
      lerpPosRef.current.y += (cursorPosRef.current.y - lerpPosRef.current.y) * LERP_FACTOR;

      // Lerp radius
      radiusRef.current += (targetRadiusRef.current - radiusRef.current) * 0.07;

      // Apply to color layer
      if (colorLayerRef.current && wrapperRef.current) {
        const rect = wrapperRef.current.getBoundingClientRect();
        const px = lerpPosRef.current.x * rect.width;
        const py = lerpPosRef.current.y * rect.height;
        const r = Math.round(radiusRef.current);
        const f = MASK_FEATHER;
        colorLayerRef.current.style.webkitMaskImage =
          `radial-gradient(circle ${r}px at ${px}px ${py}px, black 0%, black ${Math.max(0, r - f)}px, transparent ${r}px)`;
        colorLayerRef.current.style.maskImage =
          `radial-gradient(circle ${r}px at ${px}px ${py}px, black 0%, black ${Math.max(0, r - f)}px, transparent ${r}px)`;
      }

      // Lerp tilt
      tiltLerpRef.current.x += (tiltRef.current.x - tiltLerpRef.current.x) * 0.08;
      tiltLerpRef.current.y += (tiltRef.current.y - tiltLerpRef.current.y) * 0.08;

      if (photoWrapRef.current) {
        const rx = tiltLerpRef.current.x;
        const ry = tiltLerpRef.current.y;
        photoWrapRef.current.style.transform =
          `perspective(900px) rotateY(${ry}deg) rotateX(${-rx}deg)`;
      }

      rafRef.current = requestAnimationFrame(raf);
    };

    rafRef.current = requestAnimationFrame(raf);
    return () => cancelAnimationFrame(rafRef.current);
  }, [isReducedMotion]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!wrapperRef.current) return;
    const rect = wrapperRef.current.getBoundingClientRect();
    cursorPosRef.current = {
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    };
    tiltRef.current = {
      x: ((e.clientY - rect.top) / rect.height - 0.5) * 6,
      y: ((e.clientX - rect.left) / rect.width - 0.5) * 6,
    };
    if (!isInsideRef.current) {
      isInsideRef.current = true;
      targetRadiusRef.current = MASK_RADIUS_ACTIVE;
    }
  };

  const handleMouseLeave = () => {
    isInsideRef.current = false;
    targetRadiusRef.current = MASK_RADIUS_INACTIVE;
    tiltRef.current = { x: 0, y: 0 };
  };

  return (
    <div
      ref={wrapperRef}
      className="relative h-full w-full"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div
        ref={photoWrapRef}
        className="relative h-full w-full will-change-transform"
        style={{ transformOrigin: "center center" }}
      >
        {/* CROPPED WRAPPER: Waist-up crop at hand level (76.5%) with soft bottom fade */}
        <div
          className="absolute inset-x-0 top-0 h-[76.5%] overflow-hidden pointer-events-none select-none"
          style={{
            maskImage: "linear-gradient(to bottom, black 86%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(to bottom, black 86%, transparent 100%)",
          }}
        >
          {/* Inner container scaled so head stays at identical position */}
          <div className="relative w-full h-[130.7%]">
            {/* BASE: BW warm layer */}
            <div className="absolute inset-0 select-none pointer-events-none">
              <Image
                src="/images/krish-color.webp"
                alt="Krish Prajapati"
                fill
                priority
                sizes="(max-width: 768px) 70vw, 42vw"
                className="object-contain object-bottom"
                style={{
                  filter: "grayscale(1) sepia(0.22) contrast(1.08) brightness(0.92)",
                }}
              />
            </div>

            {/* TOP: Color reveal layer, masked by cursor circle */}
            <div
              ref={colorLayerRef}
              className="absolute inset-0 select-none pointer-events-none"
              style={{
                WebkitMaskImage: "radial-gradient(circle 0px at 50% 50%, black 0%, transparent 0px)",
                maskImage: "radial-gradient(circle 0px at 50% 50%, black 0%, transparent 0px)",
              }}
            >
              <Image
                src="/images/krish-color.webp"
                alt=""
                fill
                priority
                sizes="(max-width: 768px) 70vw, 42vw"
                className="object-contain object-bottom"
                aria-hidden="true"
              />
            </div>
          </div>
        </div>

        {/* Contact shadow right under the cropped hand/blazer edge */}
        <div
          className="absolute top-[75%] inset-x-6 h-8 rounded-full pointer-events-none z-10"
          style={{ background: "radial-gradient(ellipse, rgba(20,17,15,0.28) 0%, transparent 72%)" }}
          aria-hidden="true"
        />

        {/* Warm champagne glow */}
        <div
          className="absolute top-[12%] left-[10%] w-[80%] aspect-square rounded-full pointer-events-none z-0"
          style={{
            background: "radial-gradient(circle, rgba(184,147,90,0.18) 0%, transparent 68%)",
            filter: "blur(32px)",
          }}
          aria-hidden="true"
        />
      </div>

      {/* Idle breathing (CSS animation) */}
      <style>{`
        [data-breathe] {
          animation: breath 4.2s ease-in-out infinite;
        }
        @keyframes breath {
          0%, 100% { transform: perspective(900px) scale(1); }
          50% { transform: perspective(900px) scale(1.009); }
        }
      `}</style>
    </div>
  );
};

/* ─────────────────────────── HERO SECTION ──────────────────── */
export const HeroSection: React.FC = () => {
  const { isReducedMotion, isMenuOpen, setIsMenuOpen } = usePortfolioScroll();
  const heroRef = useRef<HTMLElement>(null);
  const { time, date } = useLiveClock();

  // Load animation state
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 80);
    return () => clearTimeout(t);
  }, []);

  // Transition helper
  const appear = useCallback(
    (delay = 0) =>
      ({
        opacity: loaded ? 1 : 0,
        transform: loaded ? "translateY(0)" : "translateY(22px)",
        transition: isReducedMotion
          ? "none"
          : `opacity 0.75s ${delay}s cubic-bezier(0.16,1,0.3,1), transform 0.75s ${delay}s cubic-bezier(0.16,1,0.3,1)`,
      } as React.CSSProperties),
    [loaded, isReducedMotion]
  );

  const slideUp = useCallback(
    (delay = 0) =>
      ({
        clipPath: loaded ? "inset(0 0 0 0)" : "inset(0 0 100% 0)",
        transition: isReducedMotion
          ? "none"
          : `clip-path 0.85s ${delay}s cubic-bezier(0.16,1,0.3,1)`,
      } as React.CSSProperties),
    [loaded, isReducedMotion]
  );

  const roles = useMemo(() => FLIP_ROLES, []);

  return (
    <section
      id="hero"
      ref={heroRef}
      className="relative min-h-screen w-full overflow-x-hidden bg-ivory select-none"
      aria-label="Hero — Krish Prajapati"
    >
      {/* Background layers (from globals.css) */}
      <div className="silk-fold" aria-hidden="true" />
      {/* Faint grid lines & vertical decorators */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
        {[20, 40, 60, 80].map((pct) => (
          <div
            key={pct}
            className="absolute top-0 bottom-0 w-px"
            style={{ left: `${pct}%`, background: "rgba(184,147,90,0.07)" }}
          />
        ))}
        {/* Decorative gold marks */}
        <span className="absolute top-[28%] left-[18%] text-gold/20 text-xl font-mono">+</span>
        <span className="absolute top-[64%] right-[22%] text-gold/20 text-xl font-mono">+</span>
        <span className="absolute top-[72%] left-[36%] w-1.5 h-1.5 rounded-full bg-gold/25 block" />
        <span className="absolute top-[42%] right-[14%] w-1 h-1 rounded-full bg-gold/20 block" />
      </div>

      {/* ─── CHANGE 3: FLOATING BACKGROUND "KP." & ICONS (BEHIND PHOTO & TEXT) ─── */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0 overflow-hidden"
        aria-hidden="true"
      >
        {/* Giant Outlined "KP." (Serif, stroke only, 7% opacity, slow idle float) */}
        <div
          className={
            isReducedMotion
              ? ""
              : "animate-[kpFloat_9s_ease-in-out_infinite_alternate]"
          }
        >
          <span
            className="font-serif font-bold uppercase tracking-tight text-transparent select-none whitespace-nowrap"
            style={{
              fontSize: "clamp(12rem, 30vw, 32vw)",
              WebkitTextStroke: "1.5px rgba(184, 147, 90, 0.28)",
              opacity: 0.07,
              lineHeight: 0.85,
            }}
          >
            KP.
          </span>
        </div>

        {/* 3 Small Subtle Floating Line-Art Icons (Laptop, </>, Chip) in Empty Center Area */}
        <div className="hidden md:block absolute inset-0 pointer-events-none">
          {/* Laptop (top-center) */}
          <div
            className={`absolute top-[28%] left-[45%] text-gold/25 ${
              isReducedMotion ? "" : "animate-[iconFloat1_5s_ease-in-out_infinite_alternate]"
            }`}
          >
            <svg
              className="w-6 h-6"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <rect x="3" y="4" width="18" height="12" rx="2" />
              <path d="M2 20h20" />
            </svg>
          </div>

          {/* Code Bracket (mid-center) */}
          <div
            className={`absolute top-[52%] left-[48%] text-gold/25 font-mono text-sm font-semibold tracking-tighter ${
              isReducedMotion ? "" : "animate-[iconFloat2_7s_ease-in-out_infinite_alternate]"
            }`}
            style={{ animationDelay: "1.5s" }}
          >
            &lt;/&gt;
          </div>

          {/* Microchip / CPU (lower-center) */}
          <div
            className={`absolute top-[70%] left-[44%] text-gold/25 ${
              isReducedMotion ? "" : "animate-[iconFloat3_9s_ease-in-out_infinite_alternate]"
            }`}
            style={{ animationDelay: "3s" }}
          >
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <rect x="5" y="5" width="14" height="14" rx="2" />
              <path d="M9 9h6v6H9z" />
              <path d="M9 1v4M15 1v4M9 19v4M15 19v4M1 9h4M1 15h4M19 9h4M19 15h4" />
            </svg>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════
          TOP ROW — flat (no pill), inside the hero
          ════════════════════════════════════════════ */}
      <div
        className="relative z-30 w-full px-5 sm:px-8 md:px-12 pt-5 flex items-center justify-between"
        style={appear(0)}
      >
        {/* Left: wordmark + flat nav links */}
        <div className="flex items-center gap-6 md:gap-8">
          <a
            href="#hero"
            onClick={() => soundManager.playClick()}
            className="font-serif font-bold text-[#14110F] text-base sm:text-lg tracking-wide hover:text-gold transition-colors shrink-0"
            aria-label="Krish Prajapati — Home"
          >
            Krish Prajapati
          </a>
          <ul className="hidden md:flex items-center gap-5" role="list">
            {NAV_LINKS.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  onClick={() => soundManager.playClick()}
                  onMouseEnter={() => soundManager.playHover()}
                  className="font-mono text-[11px] uppercase tracking-widest text-[#14110F]/55 hover:text-[#14110F] transition-colors duration-200"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Right: live time + date + mobile hamburger */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex flex-col items-end gap-0.5">
            <span className="font-mono text-[11px] text-[#14110F]/55 tracking-wide tabular-nums">
              {time}
            </span>
            <span className="font-mono text-[10px] text-[#14110F]/38 tracking-wide uppercase">
              {date}
            </span>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden flex flex-col gap-[5px] p-1.5"
            onClick={() => {
              setIsMenuOpen(!isMenuOpen);
              soundManager.playClick();
            }}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
          >
            <span className={`block w-5 h-0.5 bg-[#14110F] transition-all duration-300 ${isMenuOpen ? "rotate-45 translate-y-[7px]" : ""}`} />
            <span className={`block w-5 h-0.5 bg-[#14110F] transition-all duration-300 ${isMenuOpen ? "opacity-0" : ""}`} />
            <span className={`block w-5 h-0.5 bg-[#14110F] transition-all duration-300 ${isMenuOpen ? "-rotate-45 -translate-y-[7px]" : ""}`} />
          </button>
        </div>
      </div>

      {/* ══════════════════════════════════════════════
          DESKTOP MAIN CONTENT GRID (md and up)
          Left 48% / Right 52%
          ════════════════════════════════════════════ */}
      <div className="hidden md:grid md:grid-cols-[48%_52%] relative z-10 min-h-[calc(100vh-64px)]">

        {/* ── LEFT COLUMN ── */}
        <div className="flex flex-col justify-center pl-10 lg:pl-14 xl:pl-16 pr-6 py-16 gap-7">

          {/* Gold-dot label */}
          <div className="flex items-center gap-2.5" style={appear(0.1)}>
            <span className="w-2 h-2 rounded-full bg-gold shrink-0" aria-hidden="true" />
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#14110F]/60 font-medium">
              Computer Engineering · Builder
            </span>
          </div>

          {/* Headline */}
          <div className="overflow-hidden" style={slideUp(0.18)}>
            <h1 className="font-serif font-bold text-[#14110F] leading-[0.95] tracking-tight">
              <span
                className="block"
                style={{ fontSize: "clamp(3.8rem, 7.2vw, 6.8rem)" }}
              >
                Hi, I&apos;m Krish.
              </span>
              <span
                className="block font-serif italic font-normal text-[#14110F]/45 mt-1"
                style={{ fontSize: "clamp(2rem, 3.4vw, 3.2rem)" }}
              >
                I am a
              </span>
            </h1>
          </div>

          {/* Notepad Flip Card */}
          <div style={appear(0.3)}>
            <NotepadFlipCard
              roles={roles}
              intervalMs={FLIP_INTERVAL_MS}
              isReducedMotion={isReducedMotion}
            />
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-1" style={appear(0.42)}>
            {/* Primary: Start a project */}
            <a
              href={`mailto:${PERSONAL_INFO.email}`}
              onClick={() => soundManager.playClick()}
            >
              <MagneticButton className="px-5 py-2.5 rounded-full bg-[#14110F] hover:bg-gold text-cream hover:text-[#14110F] font-sans font-semibold text-[13px] transition-all shadow-md flex items-center gap-1.5">
                <span>Start a project</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </MagneticButton>
            </a>

            {/* Secondary: See my work */}
            <a
              href="#projects"
              onClick={() => soundManager.playClick()}
              className="font-sans text-[13px] font-medium text-[#14110F]/70 hover:text-[#14110F] transition-colors underline underline-offset-4 decoration-[#14110F]/20 hover:decoration-[#14110F]/60 py-2"
            >
              See my work
            </a>

            {/* Tertiary: Resume */}
            <a
              href={PERSONAL_INFO.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => soundManager.playClick()}
              className="inline-flex items-center gap-1.5 font-mono text-[11px] text-gold hover:text-gold/80 transition-colors py-2 group"
            >
              <Download className="w-3 h-3 group-hover:translate-y-0.5 transition-transform" />
              <span className="underline underline-offset-4 decoration-gold/50 group-hover:decoration-gold">
                Download resume
              </span>
            </a>
          </div>
        </div>

        {/* ── RIGHT COLUMN: PHOTO ── */}
        <div className="relative overflow-hidden flex items-end justify-center">
          {/* Photo container: enlarged, filling the right area heroically */}
          <div
            className="relative w-[96%] lg:w-[90%] xl:w-[84%] max-w-[680px]"
            style={{ height: "94vh", ...appear(0.22) }}
          >
            <PhotoReveal isReducedMotion={isReducedMotion} />

            {/* "My skills ↗" floating chip */}
            <button
              onClick={() => {
                document.querySelector("#doors")?.scrollIntoView({ behavior: "smooth" });
                soundManager.playClick();
              }}
              className="absolute bottom-[36%] left-[-8%] z-20 flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#14110F] text-cream font-mono text-[11px] tracking-wide shadow-lg hover:scale-105 hover:rotate-1 transition-all duration-200"
              aria-label="Jump to skills section"
            >
              <span>My skills</span>
              <ArrowUpRight className="w-3 h-3 text-gold" />
            </button>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════
          MOBILE LAYOUT (< md)
          ════════════════════════════════════════════ */}
      <div className="flex md:hidden flex-col items-center w-full px-5 pt-6 pb-14 gap-6">

        {/* Gold-dot label */}
        <div className="flex items-center gap-2 self-start" style={appear(0.1)}>
          <span className="w-1.5 h-1.5 rounded-full bg-gold shrink-0" aria-hidden="true" />
          <span className="font-mono text-[10px] uppercase tracking-widest text-[#14110F]/55">
            Computer Engineering · Builder
          </span>
        </div>

        {/* Headline */}
        <div className="self-start overflow-hidden" style={slideUp(0.18)}>
          <h1 className="font-serif font-bold text-[#14110F] leading-[1.08] tracking-tight">
            <span className="block text-5xl sm:text-6xl">Hi, I&apos;m Krish.</span>
            <span className="block font-serif italic font-normal text-[#14110F]/45 text-2xl sm:text-3xl mt-1">
              I am a
            </span>
          </h1>
        </div>

        {/* Flip card */}
        <div className="self-start" style={appear(0.28)}>
          <NotepadFlipCard
            roles={roles}
            intervalMs={FLIP_INTERVAL_MS}
            isReducedMotion={isReducedMotion}
          />
        </div>

        {/* Photo — right-anchored, enlarged */}
        <div
          className="relative w-full h-[58vh] overflow-hidden"
          style={appear(0.22)}
        >
          <div className="absolute right-[-4%] top-0 bottom-0 w-[84%]">
            <PhotoReveal isReducedMotion={isReducedMotion} />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 w-full" style={appear(0.42)}>
          <a href={`mailto:${PERSONAL_INFO.email}`} onClick={() => soundManager.playClick()}>
            <MagneticButton className="px-4 py-2.5 rounded-full bg-[#14110F] text-cream font-sans font-semibold text-xs flex items-center gap-1.5 shadow-sm">
              <span>Start a project</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </MagneticButton>
          </a>
          <a
            href="#projects"
            onClick={() => soundManager.playClick()}
            className="font-sans text-xs font-medium text-[#14110F]/65 hover:text-[#14110F] transition-colors underline underline-offset-4 decoration-[#14110F]/20 py-2"
          >
            See my work
          </a>
          <a
            href={PERSONAL_INFO.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => soundManager.playClick()}
            className="inline-flex items-center gap-1 font-mono text-[11px] text-gold hover:text-gold/80 py-2"
          >
            <Download className="w-3 h-3" />
            <span className="underline underline-offset-4 decoration-gold/50">Resume</span>
          </a>
        </div>
      </div>

      {/* ── SCROLL CTA (bottom center) ── */}
      <div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1.5 pointer-events-none"
        style={appear(0.65)}
        aria-hidden="true"
      >
        <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-[#14110F]/38">
          Scroll to explore
        </span>
        <ChevronUp
          className="w-3.5 h-3.5 text-gold/50 rotate-180"
          style={
            isReducedMotion
              ? {}
              : { animation: "bounceY 1.6s ease-in-out infinite" }
          }
        />
      </div>

      {/* Keyframes */}
      <style jsx global>{`
        .notepad-card {
          background: #FAF4EB;
          box-shadow: 0 4px 16px rgba(20,17,15,0.13), 0 1px 3px rgba(20,17,15,0.08);
        }
        .notepad-face {
          background: linear-gradient(180deg, #FAF4EB 0%, #F4EBD9 100%);
        }
        @keyframes bounceY {
          0%, 100% { transform: translateY(0) rotate(180deg); }
          50% { transform: translateY(5px) rotate(180deg); }
        }
        @keyframes kpFloat {
          0% {
            transform: translateY(-12px) rotate(-1deg);
          }
          100% {
            transform: translateY(12px) rotate(1deg);
          }
        }
        @keyframes iconFloat1 {
          0% {
            transform: translateY(-10px);
          }
          100% {
            transform: translateY(10px);
          }
        }
        @keyframes iconFloat2 {
          0% {
            transform: translateY(-14px);
          }
          100% {
            transform: translateY(14px);
          }
        }
        @keyframes iconFloat3 {
          0% {
            transform: translateY(-16px);
          }
          100% {
            transform: translateY(16px);
          }
        }
      `}</style>
    </section>
  );
};
