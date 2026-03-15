"use client";

import { useMemo } from "react";

const WIN_COLORS = [
  "#ff6b6b", "#ffd93d", "#6bcb77", "#4d96ff",
  "#ff922b", "#cc5de8", "#20c997", "#ff6b9d",
];

const TIE_COLORS = [
  "#fbbf24", "#f59e0b", "#d97706", "#fcd34d",
];

interface ConfettiProps {
  type: "win" | "tie";
  teamColor?: string;
}

interface Particle {
  id: number;
  left: number;
  size: number;
  color: string;
  delay: number;
  duration: number;
  shape: "circle" | "rect";
}

export default function Confetti({ type, teamColor }: ConfettiProps) {
  const particles = useMemo<Particle[]>(() => {
    const colors = type === "win" ? WIN_COLORS : TIE_COLORS;
    const count = type === "win" ? 50 : 24;
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      size: 5 + Math.random() * 7,
      color: colors[i % colors.length],
      delay: Math.random() * 0.6,
      duration: 1.8 + Math.random() * 1.4,
      shape: Math.random() > 0.5 ? "circle" : "rect",
    }));
  }, [type]);

  if (type === "tie") {
    return (
      <div className="absolute inset-0 pointer-events-none z-40 overflow-hidden">
        {/* Shimmer wave */}
        <div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-400/20 to-transparent"
          style={{ animation: "shimmer-pulse 2s ease-in-out infinite" }}
        />
        {/* Floating particles */}
        {particles.map((p) => (
          <div
            key={p.id}
            className="absolute"
            style={{
              left: `${p.left}%`,
              top: "-12px",
              width: p.size,
              height: p.size,
              backgroundColor: p.color,
              borderRadius: p.shape === "circle" ? "50%" : "2px",
              animation: `confetti-fall ${p.duration}s ease-out ${p.delay}s forwards`,
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="absolute inset-0 pointer-events-none z-40 overflow-hidden">
      {/* Glow burst */}
      {teamColor && (
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full"
          style={{
            backgroundColor: teamColor,
            animation: "glow-burst 1.5s ease-out forwards",
          }}
        />
      )}
      {/* Confetti pieces */}
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute"
          style={{
            left: `${p.left}%`,
            top: "-12px",
            width: p.size,
            height: p.shape === "rect" ? p.size * 0.6 : p.size,
            backgroundColor: p.color,
            borderRadius: p.shape === "circle" ? "50%" : "2px",
            animation: `confetti-fall ${p.duration}s ease-out ${p.delay}s forwards`,
          }}
        />
      ))}
    </div>
  );
}
