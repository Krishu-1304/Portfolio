"use client";

import React, { useRef, useMemo, useEffect, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { scrollStore } from "@/context/ScrollContext";

interface LivingBackgroundProps {
  cursor: { normalizedX: number; normalizedY: number };
  isReducedMotion: boolean;
  isMobile: boolean;
}

interface FloatingObjectData {
  type: "icosahedron" | "torus" | "box" | "octahedron";
  position: [number, number, number];
  rotation: [number, number, number];
  rotSpeed: [number, number, number];
  scale: number;
  color: string;
  opacity: number;
}

export const AtmosphericBackground: React.FC<LivingBackgroundProps> = ({
  cursor,
  isReducedMotion,
  isMobile,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const [isTabVisible, setIsTabVisible] = useState(true);

  // Pause rendering when tab is hidden
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsTabVisible(document.visibilityState === "visible");
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  // Generate lightweight low-poly objects in Champagne Gold, Cream, and Walnut Brown
  const objects = useMemo<FloatingObjectData[]>(() => {
    const count = isMobile ? 8 : 22;
    const types: FloatingObjectData["type"][] = [
      "icosahedron",
      "torus",
      "box",
      "octahedron",
    ];
    // Warm luxury editorial tones: Champagne Gold, Light Gold, Cream, Walnut
    const colors = ["#B8935A", "#CDAA73", "#F1E9DF", "#B8935A", "#5E361E"];

    const items: FloatingObjectData[] = [];
    for (let i = 0; i < count; i++) {
      const type = types[i % types.length];
      const color = colors[i % colors.length];
      const z = -2 - (i % 5) * 2.2; // Layered depths from -2 to -13
      const x = (Math.random() - 0.5) * 18;
      const y = (Math.random() - 0.5) * 14;
      const scale = 0.25 + Math.random() * 0.45;
      const opacity = 0.22 + Math.random() * 0.3;

      items.push({
        type,
        position: [x, y, z],
        rotation: [Math.random() * Math.PI, Math.random() * Math.PI, 0],
        rotSpeed: [
          (Math.random() - 0.5) * 0.012,
          (Math.random() - 0.5) * 0.012,
          (Math.random() - 0.5) * 0.008,
        ],
        scale,
        color,
        opacity,
      });
    }
    return items;
  }, [isMobile]);

  useFrame((state) => {
    if (!groupRef.current || isReducedMotion || !isTabVisible) return;

    // React to cursor with smooth parallax
    const targetRotX = -cursor.normalizedY * 0.1;
    const targetRotY = cursor.normalizedX * 0.12;
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      targetRotX,
      0.05
    );
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      targetRotY,
      0.05
    );

    // Subtle drift and scroll reactivity
    const scrollSpeedMultiplier = 1.0 + Math.abs(scrollStore.progress) * 0.6;

    groupRef.current.children.forEach((child, i) => {
      const objData = objects[i];
      if (!objData) return;

      // Slow drift & rotation
      child.rotation.x += objData.rotSpeed[0] * scrollSpeedMultiplier;
      child.rotation.y += objData.rotSpeed[1] * scrollSpeedMultiplier;
      child.rotation.z += objData.rotSpeed[2] * scrollSpeedMultiplier;

      // Gentle vertical floating oscillation
      const t = state.clock.getElapsedTime();
      child.position.y = objData.position[1] + Math.sin(t * 0.5 + i) * 0.25;
    });
  });

  if (isReducedMotion) return null;

  return (
    <group ref={groupRef}>
      {objects.map((obj, idx) => (
        <mesh
          key={idx}
          position={obj.position}
          rotation={obj.rotation}
          scale={obj.scale}
        >
          {obj.type === "icosahedron" && <icosahedronGeometry args={[1, 0]} />}
          {obj.type === "torus" && <torusGeometry args={[0.8, 0.25, 8, 16]} />}
          {obj.type === "box" && <boxGeometry args={[1, 1, 1]} />}
          {obj.type === "octahedron" && <octahedronGeometry args={[1, 0]} />}

          <meshStandardMaterial
            color={obj.color}
            roughness={0.4}
            metalness={0.5}
            transparent
            opacity={obj.opacity}
            wireframe={idx % 3 === 0}
          />
        </mesh>
      ))}

      {/* Floating Plus Glyphs in Champagne Gold and Cream */}
      {!isMobile && (
        <group position={[0, 0, -6]}>
          <FloatingGlyph position={[-6, 4, 0]} color="#B8935A" />
          <FloatingGlyph position={[6, -3, -2]} color="#F1E9DF" />
          <FloatingGlyph position={[-5, -4, -1]} color="#CDAA73" />
          <FloatingGlyph position={[5, 3, -3]} color="#B8935A" />
        </group>
      )}
    </group>
  );
};

// 3D Plus Mark Glyph
const FloatingGlyph: React.FC<{ position: [number, number, number]; color: string }> = ({
  position,
  color,
}) => {
  return (
    <group position={position}>
      {/* Horizontal Bar */}
      <mesh>
        <boxGeometry args={[0.8, 0.16, 0.1]} />
        <meshBasicMaterial color={color} transparent opacity={0.35} />
      </mesh>
      {/* Vertical Bar */}
      <mesh>
        <boxGeometry args={[0.16, 0.8, 0.1]} />
        <meshBasicMaterial color={color} transparent opacity={0.35} />
      </mesh>
    </group>
  );
};
