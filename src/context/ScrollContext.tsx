"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import type { Project } from "@/data/content";

/**
 * High-performance global mutable scroll store for 60/120fps WebGL synchronization.
 * Completely decouples continuous scroll sampling from React DOM reconciliations.
 */
export const scrollStore = {
  progress: 0,
  targetProgress: 0,
  listeners: new Set<(p: number) => void>(),
  set(val: number) {
    this.targetProgress = val;
    this.progress = val;
    this.listeners.forEach((fn) => fn(val));
  },
  subscribe(fn: (p: number) => void) {
    this.listeners.add(fn);
    return () => {
      this.listeners.delete(fn);
    };
  },
};

interface CursorData {
  x: number;
  y: number;
  normalizedX: number; // -1 to 1 for 3D camera/head look
  normalizedY: number; // -1 to 1
  label?: string;
  isHovered: boolean;
  isPointer: boolean;
}

interface ScrollContextValue {
  isReducedMotion: boolean;
  cursor: CursorData;
  setCursorHover: (isHovered: boolean, label?: string) => void;
  selectedProject: Project | null;
  setSelectedProject: (project: Project | null) => void;
  isMenuOpen: boolean;
  setIsMenuOpen: (open: boolean) => void;
  isLoaded: boolean;
  setIsLoaded: (loaded: boolean) => void;
}

const ScrollContext = createContext<ScrollContextValue | null>(null);

export const ScrollProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const [cursor, setCursor] = useState<CursorData>({
    x: -100,
    y: -100,
    normalizedX: 0,
    normalizedY: 0,
    label: undefined,
    isHovered: false,
    isPointer: false,
  });

  const setCursorHover = (isHovered: boolean, label?: string) => {
    setCursor((prev) => ({
      ...prev,
      isHovered,
      label,
    }));
  };

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setIsReducedMotion(mediaQuery.matches);
    const handleMotionChange = (e: MediaQueryListEvent) => setIsReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handleMotionChange);

    const handleMouseMove = (e: MouseEvent) => {
      const normX = (e.clientX / window.innerWidth) * 2 - 1;
      const normY = -(e.clientY / window.innerHeight) * 2 + 1;
      const target = e.target as HTMLElement | null;
      const isInteractive = Boolean(
        target?.closest("button, a, input, textarea, [data-interactive]")
      );

      setCursor((prev) => ({
        ...prev,
        x: e.clientX,
        y: e.clientY,
        normalizedX: normX,
        normalizedY: normY,
        isPointer: isInteractive,
      }));
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    return () => {
      mediaQuery.removeEventListener("change", handleMotionChange);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <ScrollContext.Provider
      value={{
        isReducedMotion,
        cursor,
        setCursorHover,
        selectedProject,
        setSelectedProject,
        isMenuOpen,
        setIsMenuOpen,
        isLoaded,
        setIsLoaded,
      }}
    >
      {children}
    </ScrollContext.Provider>
  );
};

export function usePortfolioScroll() {
  const ctx = useContext(ScrollContext);
  if (!ctx) {
    throw new Error("usePortfolioScroll must be used within a ScrollProvider");
  }
  return ctx;
}
