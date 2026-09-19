import os

files = {
    'tailwind.config.js': """/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        indigo: {
          400: "#818cf8",
          500: "#6366f1",
          600: "#4f46e5",
          700: "#4338ca",
          900: "#312e81",
        },
        void: {
          900: "#020818",
          800: "#040d1f",
          700: "#071428",
          600: "#0a1a30",
        },
      },
      fontFamily: {
        mono:    ["'Space Mono'", "monospace"],
        display: ["'Orbitron'", "sans-serif"],
        body:    ["'IBM Plex Sans'", "sans-serif"],
      },
      animation: {
        "pulse-indigo":   "pulse-indigo 2s ease-in-out infinite",
        "scan":         "scan 3s linear infinite",
        "glow":         "glow 2s ease-in-out infinite alternate",
        "flicker":      "flicker 0.15s infinite",
        "spin-slow":    "spin 4s linear infinite",
      },
      keyframes: {
        "pulse-indigo": {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(79,70,229,0.4)" },
          "50%":       { boxShadow: "0 0 0 12px rgba(79,70,229,0)" },
        },
        scan: {
          "0%":   { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100vh)" },
        },
        glow: {
          from: { textShadow: "0 0 8px #4f46e5, 0 0 16px #4f46e5" },
          to:   { textShadow: "0 0 16px #818cf8, 0 0 32px #818cf8, 0 0 48px #4f46e5" },
        },
        flicker: {
          "0%, 100%": { opacity: 1 },
          "50%":       { opacity: 0.85 },
        },
      },
      boxShadow: {
        "indigo-glow":     "0 0 20px rgba(79,70,229,0.4), 0 0 40px rgba(79,70,229,0.2)",
        "indigo-glow-lg":  "0 0 40px rgba(79,70,229,0.5), 0 0 80px rgba(79,70,229,0.25)",
        "card":          "0 4px 24px rgba(0,0,0,0.4)",
      },
    },
  },
  plugins: [],
};
""",
    'app/globals.css': """@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Space+Mono:ital,wght@0,400;0,700;1,400&family=IBM+Plex+Sans:wght@300;400;500;600;700&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --bg-deep:       #020818;
  --bg-card:       #040d1f;
  --bg-card-hover: #071428;
  --border:        rgba(79, 70, 229, 0.2);
  --border-bright: rgba(79, 70, 229, 0.5);
  --indigo:          #4f46e5;
  --indigo-bright:   #818cf8;
  --text-primary:  #e2e8f0;
  --text-muted:    #64748b;
  --danger:        #ef4444;
  --warning:       #f97316;
  --caution:       #eab308;
  --safe:          #22c55e;
}

* { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; }
body {
  background-color: var(--bg-deep);
  color: var(--text-primary);
  font-family: 'IBM Plex Sans', sans-serif;
  min-height: 100vh;
  background-image: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 0, 0, 0.03) 2px, rgba(0, 0, 0, 0.03) 4px);
}

::-webkit-scrollbar { width: 6px; height: 6px; }
::-webkit-scrollbar-track { background: var(--bg-deep); }
::-webkit-scrollbar-thumb { background: var(--indigo); border-radius: 3px; }
::-webkit-scrollbar-thumb:hover { background: var(--indigo-bright); }

@layer components {
  .card {
    @apply bg-void-800 border border-indigo-700/30 rounded-lg p-6;
    box-shadow: 0 4px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(79,70,229,0.1);
  }
  .card-hover {
    @apply card transition-all duration-300 cursor-pointer;
  }
  .card-hover:hover {
    @apply border-indigo-600/60;
    box-shadow: 0 8px 32px rgba(0,0,0,0.5), 0 0 24px rgba(79,70,229,0.15);
    transform: translateY(-2px);
  }
  .btn-primary {
    @apply px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-body font-semibold rounded-md transition-all duration-200 flex items-center gap-2;
    box-shadow: 0 0 20px rgba(79,70,229,0.3);
  }
  .btn-primary:hover {
    box-shadow: 0 0 30px rgba(79,70,229,0.5);
    transform: translateY(-1px);
  }
  .btn-primary:active { transform: translateY(0); }
  .btn-primary:disabled {
    @apply opacity-50 cursor-not-allowed;
    transform: none;
    box-shadow: none;
  }
  .btn-ghost {
    @apply px-4 py-2 border border-indigo-700/40 hover:border-indigo-500 text-indigo-400 hover:text-indigo-300 font-body rounded-md transition-all duration-200;
  }
  .text-glow {
    color: var(--indigo-bright);
    text-shadow: 0 0 10px rgba(79,70,229,0.8), 0 0 20px rgba(79,70,229,0.4);
  }
  .badge-low      { @apply px-3 py-1 rounded-full text-xs font-mono font-bold bg-green-900/40 text-green-400 border border-green-700/40; }
  .badge-medium   { @apply px-3 py-1 rounded-full text-xs font-mono font-bold bg-yellow-900/40 text-yellow-400 border border-yellow-700/40; }
  .badge-high     { @apply px-3 py-1 rounded-full text-xs font-mono font-bold bg-orange-900/40 text-orange-400 border border-orange-700/40; }
  .badge-critical { @apply px-3 py-1 rounded-full text-xs font-mono font-bold bg-red-900/40 text-red-400 border border-red-700/40; }
  .section-label { @apply text-xs font-mono text-indigo-500 tracking-widest uppercase mb-2; }
  .divider { @apply border-t border-indigo-900/50 my-6; }
  .data-table { @apply w-full text-sm; }
  .data-table th { @apply text-left text-xs font-mono text-indigo-500 uppercase tracking-wider pb-3 border-b border-indigo-900/40; }
  .data-table td { @apply py-3 border-b border-void-700/50 text-slate-300; }
  .data-table tr:last-child td { @apply border-0; }
}

@layer utilities {
  .font-display { font-family: 'Orbitron', sans-serif; }
  .font-mono    { font-family: 'Space Mono', monospace; }
  .font-body    { font-family: 'IBM Plex Sans', sans-serif; }
  .bg-grid {
    background-image: linear-gradient(rgba(79,70,229,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(79,70,229,0.05) 1px, transparent 1px);
    background-size: 40px 40px;
  }
  .glass {
    background: rgba(4, 13, 31, 0.8);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: 1px solid rgba(79, 70, 229, 0.2);
  }
}
""",
    'app/layout.tsx': """import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "./components/Sidebar";

export const metadata: Metadata = {
  title: "Deep Shield — AI Fraud Detection",
  description: "AI-Powered Deepfake & Identity Fraud Detection Platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="fixed inset-0 bg-grid opacity-30 pointer-events-none z-0" />
        <div className="fixed top-0 left-0 w-32 h-32 pointer-events-none z-0"
          style={{ background: "radial-gradient(circle at top left, rgba(79, 70, 229, 0.15) 0%, transparent 70%)" }}
        />
        <div className="fixed bottom-0 right-0 w-48 h-48 pointer-events-none z-0"
          style={{ background: "radial-gradient(circle at bottom right, rgba(79, 70, 229, 0.1) 0%, transparent 70%)" }}
        />
        <div className="relative z-10 flex min-h-screen">
          <Sidebar />
          <main className="flex-1 ml-64 p-8 overflow-y-auto min-h-screen">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
""",
    'app/components/Sidebar.tsx': """"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Shield, UploadCloud, LayoutDashboard,
  FileText, Settings, Activity, ChevronRight
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard",   icon: LayoutDashboard },
  { href: "/upload",    label: "New Analysis", icon: UploadCloud },
  { href: "/reports",   label: "Reports",      icon: FileText },
  { href: "/activity",  label: "Live Feed",    icon: Activity },
  { href: "/settings",  label: "Settings",     icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-full w-64 glass border-r border-indigo-700/20 flex flex-col z-50">
      <div className="p-6 border-b border-indigo-700/20">
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <div className="relative">
            <div className="w-10 h-10 rounded-lg bg-indigo-900/50 border border-indigo-600/50
                            flex items-center justify-center group-hover:border-indigo-400/70
                            transition-all duration-300">
              <Shield className="w-5 h-5 text-indigo-400" />
            </div>
            <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-indigo-400
                            border-2 border-void-800 animate-pulse" />
          </div>
          <div>
            <div className="font-display text-sm font-bold text-indigo-300 tracking-wider">
              DEEP SHIELD
            </div>
            <div className="text-xs font-mono text-slate-500">
              v1.0 · ACTIVE
            </div>
          </div>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        <div className="section-label pl-2 mb-4">Navigation</div>
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-md text-sm font-body
                transition-all duration-200 group relative
                ${isActive
                  ? "bg-indigo-900/40 text-indigo-300 border border-indigo-700/40"
                  : "text-slate-400 hover:text-indigo-300 hover:bg-indigo-900/20"
                }
              `}
            >
              {isActive && (
                <div className="absolute left-0 top-2 bottom-2 w-0.5 bg-indigo-400 rounded-full" />
              )}
              <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? "text-indigo-400" : "text-slate-500 group-hover:text-indigo-400"}`} />
              <span>{label}</span>
              {isActive && (
                <ChevronRight className="w-3 h-3 ml-auto text-indigo-500" />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-indigo-700/20">
        <div className="card p-3">
          <div className="section-label mb-2">System Status</div>
          {[
            { name: "API Server",  status: "online" },
            { name: "AI Models",   status: "online" },
            { name: "Task Queue",  status: "online" },
          ].map(({ name, status }) => (
            <div key={name} className="flex items-center justify-between py-1">
              <span className="text-xs font-mono text-slate-500">{name}</span>
              <div className="flex items-center gap-1.5">
                <div className={`w-1.5 h-1.5 rounded-full ${
                  status === "online" ? "bg-indigo-400 animate-pulse" : "bg-red-400"
                }`} />
                <span className={`text-xs font-mono ${
                  status === "online" ? "text-indigo-400" : "text-red-400"
                }`}>
                  {status.toUpperCase()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
"""
}

for k, v in files.items():
    with open(k, 'w', encoding='utf-8') as f:
        f.write(v)
