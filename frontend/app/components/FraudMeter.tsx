"use client";

import React from "react";

interface FraudMeterProps {
  score: number;
  category?: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" | string;
  size?: number;
  showCategory?: boolean;
}

export default function FraudMeter({
  score,
  category,
  size = 200,
  showCategory = true,
}: FraudMeterProps) {
  // Clamp score between 0 and 100
  const normalizedScore = Math.min(Math.max(Math.round(score), 0), 100);

  // Derive category if not provided
  const derivedCategory =
    category ||
    (normalizedScore <= 30
      ? "LOW"
      : normalizedScore <= 60
      ? "MEDIUM"
      : normalizedScore <= 85
      ? "HIGH"
      : "CRITICAL");

  // Visual styling parameters
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  // Use a 270 degree arc gauge
  const arcLength = circumference * 0.75;
  const strokeDashoffset = arcLength - (arcLength * normalizedScore) / 100;

  // Color scheme based on risk
  const getTheme = () => {
    switch (derivedCategory.toUpperCase()) {
      case "CRITICAL":
        return {
          stroke: "#ef4444",
          glow: "rgba(239, 68, 68, 0.4)",
          text: "text-red-400",
          badge: "bg-red-950/60 text-red-400 border-red-700/50",
          label: "CRITICAL THREAT",
        };
      case "HIGH":
        return {
          stroke: "#f97316",
          glow: "rgba(249, 115, 22, 0.4)",
          text: "text-orange-400",
          badge: "bg-orange-950/60 text-orange-400 border-orange-700/50",
          label: "HIGH RISK",
        };
      case "MEDIUM":
        return {
          stroke: "#eab308",
          glow: "rgba(234, 179, 8, 0.4)",
          text: "text-yellow-400",
          badge: "bg-yellow-950/60 text-yellow-400 border-yellow-700/50",
          label: "SUSPICIOUS / MED",
        };
      case "LOW":
      default:
        return {
          stroke: "#10b981",
          glow: "rgba(16, 185, 129, 0.4)",
          text: "text-emerald-400",
          badge: "bg-emerald-950/60 text-emerald-400 border-emerald-700/50",
          label: "AUTHENTIC / LOW",
        };
    }
  };

  const theme = getTheme();

  return (
    <div className="flex flex-col items-center justify-center select-none">
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          className="transform -rotate-135"
          style={{ overflow: "visible" }}
        >
          {/* Background Track Arc */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke="rgba(79, 70, 229, 0.15)"
            strokeWidth={strokeWidth}
            strokeDasharray={`${arcLength} ${circumference}`}
            strokeLinecap="round"
          />

          {/* Glowing Animated Value Arc */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke={theme.stroke}
            strokeWidth={strokeWidth}
            strokeDasharray={`${arcLength} ${circumference}`}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{
              transition: "stroke-dashoffset 1s ease-out, stroke 0.5s ease",
              filter: `drop-shadow(0 0 10px ${theme.glow})`,
            }}
          />
        </svg>

        {/* Center Text Display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-xs font-mono uppercase tracking-widest text-slate-400">
            FRAUD SCORE
          </span>
          <span
            className={`font-display font-black tracking-tight ${theme.text}`}
            style={{ fontSize: size * 0.22 }}
          >
            {normalizedScore}
            <span className="text-sm font-mono text-slate-500 font-normal ml-0.5">%</span>
          </span>
          <span className="text-[10px] font-mono text-slate-500">
            CONFIDENCE CALIBRATED
          </span>
        </div>
      </div>

      {showCategory && (
        <div
          className={`mt-2 px-3 py-1 rounded-full text-xs font-mono font-bold tracking-wider border shadow-sm ${theme.badge}`}
        >
          {theme.label}
        </div>
      )}
    </div>
  );
}
