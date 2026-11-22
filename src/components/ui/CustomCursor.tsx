"use client";

import React, { useEffect, useState } from "react";
import { usePortfolioScroll } from "@/context/ScrollContext";

export const CustomCursor: React.FC = () => {
  const { cursor } = usePortfolioScroll();
  const [mounted, setMounted] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    setMounted(true);
    if ("ontouchstart" in window || navigator.maxTouchPoints > 0) {
      setIsTouchDevice(true);
    }
  }, []);

  if (!mounted || isTouchDevice) return null;

  const isInteractive = cursor.isPointer || cursor.isHovered;
  const size = cursor.label ? 88 : isInteractive ? 48 : 10;

  return (
    <div
      className="fixed top-0 left-0 pointer-events-none z-50 flex items-center justify-center -translate-x-1/2 -translate-y-1/2"
      style={{
        transform: `translate3d(${cursor.x}px, ${cursor.y}px, 0)`,
        width: `${size}px`,
        height: `${size}px`,
        transition: "width 200ms ease, height 200ms ease",
      }}
    >
      <div
        className="w-full h-full rounded-full flex items-center justify-center transition-all duration-200"
        style={
          cursor.label
            ? {
                backgroundColor: "#B8935A",
                color: "#0E0D0C",
                boxShadow: "0 4px 24px rgba(184,147,90,0.45)",
              }
            : isInteractive
            ? {
                background: "rgba(184,147,90,0.12)",
                border: "1.5px solid rgba(184,147,90,0.6)",
                backdropFilter: "blur(4px)",
              }
            : {
                backgroundColor: "#B8935A",
                boxShadow: "0 2px 8px rgba(184,147,90,0.5)",
              }
        }
      >
        {cursor.label && (
          <span className="px-2 text-center uppercase tracking-wider font-bold font-mono text-[10px]">
            {cursor.label}
          </span>
        )}
      </div>
    </div>
  );
};
