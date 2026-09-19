/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cyan: {
          400: "#22d3ee",
          500: "#06b6d4",
          600: "#0891b2",
          700: "#0e7490",
          900: "#164e63",
        },
        fuchsia: {
          400: "#e879f9",
          500: "#d946ef",
          600: "#c026d3",
        },
        obsidian: {
          950: "#09090b",
          900: "#18181b",
          800: "#27272a",
          700: "#3f3f46",
        },
      },
      fontFamily: {
        mono:    ["'Space Mono'", "monospace"],
        display: ["'Orbitron'", "sans-serif"],
        body:    ["'IBM Plex Sans'", "sans-serif"],
      },
      animation: {
        "pulse-cyan":   "pulse-cyan 2s ease-in-out infinite",
        "scan":         "scan 3s linear infinite",
        "glow":         "glow 2s ease-in-out infinite alternate",
        "flicker":      "flicker 0.15s infinite",
        "spin-slow":    "spin 4s linear infinite",
      },
      keyframes: {
        "pulse-cyan": {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(6,182,212,0.4)" },
          "50%":       { boxShadow: "0 0 0 12px rgba(6,182,212,0)" },
        },
        scan: {
          "0%":   { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100vh)" },
        },
        glow: {
          from: { textShadow: "0 0 8px #0891b2, 0 0 16px #0891b2" },
          to:   { textShadow: "0 0 16px #22d3ee, 0 0 32px #22d3ee, 0 0 48px #06b6d4" },
        },
        flicker: {
          "0%, 100%": { opacity: 1 },
          "50%":       { opacity: 0.85 },
        },
      },
      boxShadow: {
        "cyan-glow":     "0 0 20px rgba(6,182,212,0.4), 0 0 40px rgba(6,182,212,0.2)",
        "cyan-glow-lg":  "0 0 40px rgba(6,182,212,0.5), 0 0 80px rgba(6,182,212,0.25)",
        "card":          "0 4px 24px rgba(0,0,0,0.6)",
      },
    },
  },
  plugins: [],
};
