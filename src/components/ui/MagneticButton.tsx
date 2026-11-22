"use client";

import React, { useRef, useState } from "react";
import { soundManager } from "@/lib/audioSynthesizer";

interface MagneticButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  strength?: number;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export const MagneticButton: React.FC<MagneticButtonProps> = ({
  children,
  strength = 0.35,
  className = "",
  onClick,
  ...props
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const deltaX = (e.clientX - centerX) * strength;
    const deltaY = (e.clientY - centerY) * strength;
    setPos({ x: deltaX, y: deltaY });
  };

  const handleMouseLeave = () => {
    setPos({ x: 0, y: 0 });
  };

  const handleMouseEnter = () => {
    soundManager.playHover();
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    soundManager.playClick();
    onClick?.(e);
  };

  return (
    <button
      ref={buttonRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      style={{
        transform: `translate3d(${pos.x}px, ${pos.y}px, 0)`,
        transition: pos.x === 0 && pos.y === 0 ? "transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)" : "none",
      }}
      className={`relative inline-flex items-center justify-center font-medium transition-colors ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
