"use client";

import React, { useEffect, useState } from "react";
import {
  Server,
  Cpu,
  ShieldCheck,
  CheckCircle2,
  Database,
  Sliders,
  Info,
} from "lucide-react";
import axios from "axios";

export default function SettingsPage() {
  const [apiHealth, setApiHealth] = useState<string>("Checking...");

  useEffect(() => {
    axios
      .get("/api/health")
      .then((res) => {
        if (res.data?.status === "healthy") {
          setApiHealth("ONLINE (200 OK)");
        } else {
          setApiHealth("CONNECTED");
        }
      })
      .catch(() => {
        setApiHealth("OFFLINE (Connection refused)");
      });
  }, []);

  return (
    <div className="space-y-6 max-w-4xl animate-fadeIn pb-12">
      <div>
        <h1 className="text-3xl font-display font-bold text-indigo-300">
          System & Engine Settings
        </h1>
        <p className="text-sm font-body text-slate-400 mt-1">
          Forensic model thresholds, backend connection status, and platform architecture
        </p>
      </div>

      {/* Diagnostics Card */}
      <div className="card space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-indigo-900/30">
          <Server className="w-4 h-4 text-indigo-400" />
          <span className="text-xs font-mono text-slate-400 uppercase">Subsystem Telemetry</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg bg-void-900/60 border border-indigo-900/30 space-y-1">
            <span className="text-xs font-mono text-slate-500">FastAPI Core</span>
            <div className="text-sm font-mono font-bold text-emerald-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>{apiHealth}</span>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-void-900/60 border border-indigo-900/30 space-y-1">
            <span className="text-xs font-mono text-slate-500">Forensics Database</span>
            <div className="text-sm font-mono font-bold text-indigo-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-400" />
              <span>SQLite Document Store</span>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-void-900/60 border border-indigo-900/30 space-y-1">
            <span className="text-xs font-mono text-slate-500">Ensemble Pipeline</span>
            <div className="text-sm font-mono font-bold text-emerald-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Active (Multi-Modal)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Thresholds & Platt Calibration */}
      <div className="card space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-indigo-900/30">
          <Sliders className="w-4 h-4 text-indigo-400" />
          <span className="text-xs font-mono text-slate-400 uppercase">Risk Calibration Gates</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-3 bg-emerald-950/20 border border-emerald-900/40 rounded-lg">
            <div className="text-xs font-mono text-emerald-400 font-bold">LOW RISK</div>
            <div className="text-xl font-display font-bold text-white mt-1">0% – 30%</div>
            <p className="text-[10px] font-mono text-slate-500 mt-1">No significant anomalies</p>
          </div>

          <div className="p-3 bg-yellow-950/20 border border-yellow-900/40 rounded-lg">
            <div className="text-xs font-mono text-yellow-400 font-bold">MEDIUM RISK</div>
            <div className="text-xl font-display font-bold text-white mt-1">31% – 60%</div>
            <p className="text-[10px] font-mono text-slate-500 mt-1">Human audit required</p>
          </div>

          <div className="p-3 bg-orange-950/20 border border-orange-900/40 rounded-lg">
            <div className="text-xs font-mono text-orange-400 font-bold">HIGH RISK</div>
            <div className="text-xl font-display font-bold text-white mt-1">61% – 85%</div>
            <p className="text-[10px] font-mono text-slate-500 mt-1">Strong deepfake indicators</p>
          </div>

          <div className="p-3 bg-red-950/20 border border-red-900/40 rounded-lg">
            <div className="text-xs font-mono text-red-400 font-bold">CRITICAL THREAT</div>
            <div className="text-xl font-display font-bold text-white mt-1">86% – 100%</div>
            <p className="text-[10px] font-mono text-slate-500 mt-1">Confirmed synthetic fraud</p>
          </div>
        </div>
      </div>

      {/* System Specifications */}
      <div className="card space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-indigo-900/30">
          <Info className="w-4 h-4 text-indigo-400" />
          <span className="text-xs font-mono text-slate-400 uppercase">Architecture & Platform</span>
        </div>

        <div className="space-y-2 text-xs font-mono">
          {[
            ["Platform", "DeepShield Forensics Platform"],
            ["Version", "1.0.0 (Production Release)"],
            ["Visual Engine", "EfficientNet-B4 + Error Level Analysis (ELA Q90)"],
            ["Audio Engine", "ResNet-18 Mel Spectrogram Vocoder CNN"],
            ["Document Engine", "PyMuPDF High-Res Rasterizer + Variance Noise Matrix"],
            ["Scoring Core", "Calibrated Platt Scaling Sigmoid Ensemble"],
            ["Track", "Cybersecurity + Generative AI Track"],
          ].map(([k, v]) => (
            <div
              key={k}
              className="flex justify-between py-2 border-b border-indigo-900/20 last:border-0"
            >
              <span className="text-slate-500">{k}</span>
              <span className="text-indigo-300 font-medium">{v}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
