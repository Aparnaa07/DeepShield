"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Activity,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Radio,
  FileSearch,
  Clock,
  Terminal,
} from "lucide-react";
import { listReports, AnalysisReport } from "../lib/api";

export default function ActivityPage() {
  const [reports, setReports] = useState<AnalysisReport[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFeed() {
      try {
        const data = await listReports(20, 0);
        setReports(data.reports || []);
      } catch (err) {
        console.error("Failed to fetch activity:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchFeed();
  }, []);

  const getEventIcon = (category: string) => {
    switch (category) {
      case "CRITICAL":
        return <ShieldAlert className="w-4 h-4 text-red-400" />;
      case "HIGH":
        return <AlertTriangle className="w-4 h-4 text-orange-400" />;
      case "MEDIUM":
        return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
      case "LOW":
      default:
        return <ShieldCheck className="w-4 h-4 text-emerald-400" />;
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-display font-bold text-indigo-300">
            Forensic Surveillance Live Feed
          </h1>
          <p className="text-sm font-body text-slate-400 mt-1">
            Real-time audit log of forensic scans, deepfake interceptions, and sensor diagnostics
          </p>
        </div>

        <div className="flex items-center gap-2 bg-void-800 border border-indigo-700/30 px-3.5 py-1.5 rounded-full">
          <Radio className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
          <span className="text-xs font-mono text-indigo-400 font-bold tracking-wider">
            STREAM ACTIVE
          </span>
        </div>
      </div>

      <div className="card space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-indigo-900/30">
          <Terminal className="w-4 h-4 text-indigo-400" />
          <span className="text-xs font-mono text-slate-400">SECURITY AUDIT TIMELINE</span>
        </div>

        <div className="space-y-3">
          {loading ? (
            <div className="py-12 text-center text-xs font-mono text-slate-500">
              Connecting to telemetry feed...
            </div>
          ) : reports.length > 0 ? (
            reports.map((report, idx) => {
              const fname = (report as any).filename || `${report.file_type}_artifact`;
              const isHigh = report.risk_category === "CRITICAL" || report.risk_category === "HIGH";

              return (
                <div
                  key={report.job_id || idx}
                  className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-lg border transition-all ${
                    isHigh
                      ? "bg-red-950/20 border-red-900/40 hover:bg-red-950/30"
                      : "bg-void-900/40 border-void-700/30 hover:bg-indigo-900/10"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-void-800 border border-indigo-800/40 mt-0.5">
                      {getEventIcon(report.risk_category)}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-white">
                          #{report.job_id}
                        </span>
                        <span className="text-xs font-body text-slate-300">
                          Forensic scan executed on{" "}
                          <span className="text-indigo-400 font-medium">{fname}</span>
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-xs font-mono text-slate-500">
                        <span>Classification: {report.risk_category}</span>
                        <span>·</span>
                        <span>Score: {report.fraud_risk_score}%</span>
                        <span>·</span>
                        <span>Time: {report.timestamp ? report.timestamp.split("T")[1]?.slice(0, 5) : "LIVE"}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <Link
                      href={`/report/${report.job_id}`}
                      className="btn-ghost text-xs py-1 px-3 inline-flex items-center gap-1"
                    >
                      <FileSearch className="w-3.5 h-3.5" />
                      <span>Review</span>
                    </Link>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="py-12 text-center text-xs font-mono text-slate-500">
              No live telemetry recorded yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
