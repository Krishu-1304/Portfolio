"use client";

import React, { useEffect } from "react";
import { usePortfolioScroll } from "@/context/ScrollContext";
import { soundManager } from "@/lib/audioSynthesizer";
import { X, ExternalLink, Code2, Calendar } from "lucide-react";
import { GithubIcon } from "./Icons";
import { MagneticButton } from "./MagneticButton";

export const ProjectModal: React.FC = () => {
  const { selectedProject, setSelectedProject } = usePortfolioScroll();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && selectedProject) {
        setSelectedProject(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedProject, setSelectedProject]);

  if (!selectedProject) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={selectedProject.title}
      className="fixed inset-0 z-50 backdrop-blur-2xl flex items-center justify-center p-4 md:p-12 overflow-y-auto animate-in fade-in zoom-in-95 duration-200"
      style={{ backgroundColor: "rgba(14, 13, 12, 0.94)" }}
    >
      <div
        className="relative w-full max-w-3xl rounded-3xl p-6 sm:p-10 shadow-2xl text-cream"
        style={{
          backgroundColor: "#171513",
          border: "1px solid rgba(184, 147, 90, 0.35)",
        }}
      >
        {/* Header */}
        <div
          className="flex justify-between items-center pb-6 border-b"
          style={{ borderColor: "rgba(184, 147, 90, 0.25)" }}
        >
          <div className="flex items-center gap-3">
            <span
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: selectedProject.accent || "#B8935A" }}
            />
            <span
              className="font-mono uppercase text-gold tracking-wider"
              style={{ fontSize: "0.68rem" }}
            >
              Project Specification
            </span>
          </div>
          <MagneticButton
            onClick={() => {
              soundManager.playClick();
              setSelectedProject(null);
            }}
            className="p-2 rounded-full transition-colors border"
            style={
              {
                backgroundColor: "rgba(184, 147, 90, 0.08)",
                borderColor: "rgba(184, 147, 90, 0.3)",
              } as React.CSSProperties
            }
            aria-label="Close project modal"
          >
            <X className="w-5 h-5 text-cream/70" />
          </MagneticButton>
        </div>

        {/* Content */}
        <div className="mt-8 space-y-6">
          <div>
            <div
              className="flex items-center gap-2 mb-2 font-mono"
              style={{ fontSize: "0.68rem", color: "#B8935A" }}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>{selectedProject.year}</span>
              <span className="text-cream/40">·</span>
              <span>{selectedProject.subtitle}</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-serif font-bold tracking-tight text-cream">
              {selectedProject.title}
            </h2>
          </div>

          <p className="text-base sm:text-lg text-cream/85 leading-relaxed font-normal">
            {selectedProject.description}
          </p>

          {/* Tech Stack Pills */}
          <div>
            <h4
              className="uppercase font-mono tracking-wider text-gold mb-3 flex items-center gap-2"
              style={{ fontSize: "0.68rem" }}
            >
              <Code2 className="w-4 h-4 text-gold" />
              Core Technologies &amp; Architecture
            </h4>
            <div className="flex flex-wrap gap-2">
              {selectedProject.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3.5 py-1.5 rounded-full font-mono text-cream/90"
                  style={{
                    fontSize: "0.68rem",
                    backgroundColor: "rgba(241, 233, 223, 0.06)",
                    border: "1px solid rgba(184, 147, 90, 0.25)",
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Action CTAs */}
          <div
            className="pt-6 border-t flex flex-wrap gap-4"
            style={{ borderColor: "rgba(184, 147, 90, 0.25)" }}
          >
            <a
              href={selectedProject.github}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => soundManager.playClick()}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm transition-all shadow-lg"
              style={{
                backgroundColor: "#B8935A",
                color: "#0E0D0C",
                boxShadow: "0 4px 20px rgba(184,147,90,0.3)",
              }}
            >
              <GithubIcon className="w-4 h-4" />
              <span>View Repository on GitHub</span>
            </a>
            {selectedProject.demoUrl && (
              <a
                href={selectedProject.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => soundManager.playClick()}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-cream font-medium text-sm transition-all"
                style={{
                  backgroundColor: "rgba(241, 233, 223, 0.08)",
                  border: "1px solid rgba(184, 147, 90, 0.35)",
                }}
              >
                <ExternalLink className="w-4 h-4" />
                <span>Live Interactive Demo</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
