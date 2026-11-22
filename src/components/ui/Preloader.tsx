"use client";

import React, { useEffect, useState } from "react";
import { usePortfolioScroll } from "@/context/ScrollContext";
import { PERSONAL_INFO } from "@/data/content";

export const Preloader: React.FC = () => {
  const { isLoaded, setIsLoaded } = usePortfolioScroll();
  const [count, setCount] = useState(0);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    let current = 0;
    const interval = setInterval(() => {
      current += Math.floor(Math.random() * 9) + 4;
      if (current >= 100) {
        current = 100;
        setCount(100);
        clearInterval(interval);
        setTimeout(() => {
          setIsDone(true);
          setTimeout(() => {
            setIsLoaded(true);
          }, 650);
        }, 250);
      } else {
        setCount(current);
      }
    }, 35);

    return () => clearInterval(interval);
  }, [setIsLoaded]);

  if (isLoaded) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col justify-between p-8 md:p-14 bg-softblack text-cream transition-transform duration-700 ease-[cubic-bezier(0.77,0,0.175,1)] ${
        isDone ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      {/* Top Bar Metadata */}
      <div className="flex justify-between items-center font-mono text-xs uppercase tracking-widest text-cream-muted">
        <span>{PERSONAL_INFO.name}</span>
        <span className="text-gold">Portfolio © 2026</span>
      </div>

      {/* Center Rolling 0-100 Counter */}
      <div className="flex flex-col items-center justify-center my-auto">
        <div className="flex items-baseline">
          <span className="font-serif font-bold text-8xl sm:text-9xl md:text-[11rem] tracking-tight text-cream leading-none">
            {count.toString().padStart(2, "0")}
          </span>
          <span className="font-mono text-3xl sm:text-5xl text-gold ml-2 font-bold">
            %
          </span>
        </div>
        <p className="mt-4 font-mono text-xs tracking-widest uppercase text-cream-muted font-medium">
          Loading Editorial Experience
        </p>
      </div>

      {/* Bottom Status */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 font-mono text-xs text-cream-muted">
        <span>Dwarkadas J. Sanghvi College of Engineering</span>
        <div className="w-48 h-1 rounded-full bg-softblack-raised overflow-hidden border border-border-dark">
          <div
            className="h-full bg-gold transition-all duration-100 ease-out shadow-sm shadow-gold"
            style={{ width: `${count}%` }}
          />
        </div>
        <span>Mumbai, IN · GMT +5:30</span>
      </div>
    </div>
  );
};
