"use client";

import React, { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { AtmosphericBackground } from "./AtmosphericBackground";
import { usePortfolioScroll } from "@/context/ScrollContext";

export const SceneCanvas: React.FC = () => {
  const { cursor, isReducedMotion } = usePortfolioScroll();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile, { passive: true });
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  if (isReducedMotion) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <Canvas
        shadows={false}
        dpr={isMobile ? [1, 1.2] : [1, 2]}
        gl={{
          antialias: true,
          powerPreference: "high-performance",
          alpha: true,
        }}
        camera={{ position: [0, 0, 5], fov: 45 }}
        className="pointer-events-none"
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.9} />
          <directionalLight position={[4, 8, 5]} intensity={1.1} />
          <pointLight position={[-6, -4, 2]} intensity={0.7} color="#B8935A" />

          {/* Living Background Floating Low-Poly Objects in Champagne Gold, Cream, Walnut */}
          <AtmosphericBackground
            cursor={cursor}
            isReducedMotion={isReducedMotion}
            isMobile={isMobile}
          />
        </Suspense>
      </Canvas>
    </div>
  );
};
