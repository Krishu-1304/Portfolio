"use client";

import React from "react";
import { EDUCATION } from "@/data/content";
import { GraduationCap, MapPin, Award, Calendar } from "lucide-react";

export const EducationSection: React.FC = () => {
  return (
    <section
      id="education"
      className="relative w-full px-6 sm:px-10 md:px-16 py-32 bg-softblack text-cream border-t border-border-dark overflow-hidden"
      aria-label="Education — Krish Prajapati"
    >
      {/* Background Ghost Heading */}
      <div className="absolute top-8 left-0 right-0 flex justify-center pointer-events-none select-none opacity-20 overflow-hidden">
        <span className="font-serif text-[clamp(4.5rem,18vw,14rem)] text-outline-light tracking-tight font-bold whitespace-nowrap">
          EDUCATION
        </span>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-softblack-raised border border-border-dark text-xs font-mono text-gold font-medium">
            <GraduationCap className="w-3.5 h-3.5 text-gold" />
            <span>04 / ACADEMIC FOUNDATION</span>
          </div>

          <h2 className="font-serif text-4xl sm:text-6xl md:text-7xl text-cream tracking-tight font-bold">
            EDUCATION
          </h2>

          <p className="font-sans text-sm sm:text-base text-cream-muted font-normal">
            Core engineering foundation, algorithmic thinking, and academic coursework.
          </p>
        </div>

        {/* ─── ONE EDITORIAL CARD ────────────────────────────────────────── */}
        <div className="max-w-3xl mx-auto p-8 sm:p-12 md:p-14 rounded-[2.5rem] bg-softblack-raised border border-border-dark shadow-2xl relative overflow-hidden">
          
          {/* Subtle Ambient Champagne Gold Glow */}
          <div
            className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl pointer-events-none opacity-15 bg-gold"
            aria-hidden="true"
          />

          <div className="relative z-10 space-y-6">
            
            {/* Degree & Badge Row */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-border-dark">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-softblack border border-border-dark text-xs font-mono text-gold font-medium">
                <GraduationCap className="w-4 h-4 text-gold" />
                <span>Undergraduate Degree</span>
              </div>

              {/* CGPA Shown Once */}
              <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold/15 border border-gold/30 text-gold font-mono text-xs font-bold">
                <Award className="w-3.5 h-3.5 text-gold" />
                <span>CGPA {EDUCATION.cgpa}</span>
              </div>
            </div>

            {/* Institution & Field */}
            <div className="space-y-2">
              <h3 className="font-serif font-bold text-3xl sm:text-4xl text-cream tracking-wide">
                {EDUCATION.degree} in {EDUCATION.field}
              </h3>
              <p className="font-sans text-lg text-cream/90 font-normal">
                {EDUCATION.institution}
              </p>
              <p className="font-serif italic text-base text-gold">
                {EDUCATION.university}
              </p>
            </div>

            {/* Timeline & Location */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-border-dark font-mono text-xs text-cream-muted">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gold" />
                <span>{EDUCATION.period}</span>
              </div>

              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gold" />
                <span>{EDUCATION.location}</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
