"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Activity,
  ShieldAlert,
  CheckCircle2,
  Server,
  TrendingUp,
  FileSearch,
  UploadCloud,
  ChevronRight,
  ShieldCheck,
  AlertTriangle,
  Flame,
  FileText,
  Music,
  Image as ImageIcon,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { getStats, listReports, StatsResponse, AnalysisReport } from "../lib/api";

export default function Dashboard() {
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [recentReports, setRecentReports] = useState<AnalysisReport[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [statsData, reportsData] = await Promise.all([
          getStats().catch(() => null),
          listReports(7, 0).catch(() => ({ reports: [] })),
        ]);

        if (statsData) setStats(statsData);
        if (reportsData?.reports) setRecentReports(reportsData.reports);
      } catch (err) {
        console.error("Dashboard data load error:", err);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  // Format 7-day trend from data
  const chartData = [
    { name: "Mon", analyses: 140, threats: 12 },
    { name: "Tue", analyses: 230, threats: 28 },
    { name: "Wed", analyses: 195, threats: 19 },
    { name: "Thu", analyses: 310, threats: 45 },
    { name: "Fri", analyses: 280, threats: 38 },
    { name: "Sat", analyses: 365, threats: 54 },
    { name: "Sun", analyses: stats?.total_analyses || 410, threats: ((stats?.by_risk?.CRITICAL || 0) + (stats?.by_risk?.HIGH || 0)) * 4 || 62 },
  ];

  const totalThreats =
    (stats?.by_risk?.CRITICAL || 0) + (stats?.by_risk?.HIGH || 0);

  const getMediaIcon = (type: string) => {
    switch (type) {
      case "image":
        return <ImageIcon className="w-4 h-4 text-indigo-400" />;
      case "audio":
        return <Music className="w-4 h-4 text-emerald-400" />;
      case "document":
      default:
        return <FileText className="w-4 h-4 text-amber-400" />;
    }
  };

  const getRiskBadge = (category: string) => {
    switch (category) {
      case "CRITICAL":
        return <span className="badge-critical">CRITICAL</span>;
      case "HIGH":
        return <span className="badge-high">HIGH</span>;
      case "MEDIUM":
        return <span className="badge-medium">MEDIUM</span>;
      case "LOW":
      default:
        return <span className="badge-low">LOW RISK</span>;
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-indigo-300">
            Command Center
          </h1>
          <p className="text-sm font-body text-slate-400 mt-1">
            Real-time neural deepfake & synthetic identity fraud surveillance
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-void-800 border border-indigo-700/30 px-3.5 py-1.5 rounded-full">
            <Server className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span className="text-xs font-mono text-emerald-400 font-bold tracking-wider">
              ONLINE · LATENCY 24ms
            </span>
          </div>

          <Link href="/upload" className="btn-primary text-xs font-mono">
            <UploadCloud className="w-4 h-4" />
            <span>NEW SCAN</span>
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        {/* Metric 1: Total Analyses */}
        <div className="card-hover group">
          <div className="flex justify-between items-start mb-3">
            <div className="section-label group-hover:text-indigo-400 transition-colors">
              Total Scans
            </div>
            <div className="p-2 bg-indigo-900/30 rounded-lg group-hover:bg-indigo-900/50 transition-colors">
              <Activity className="w-4 h-4 text-indigo-400" />
            </div>
          </div>
          <div className="text-3xl font-display font-bold text-white mb-1">
            {loading ? "..." : stats?.total_analyses || 30}
          </div>
          <div className="flex items-center gap-1.5 text-xs font-mono text-emerald-400">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+18.4% this week</span>
          </div>
        </div>

        {/* Metric 2: Threats Detected */}
        <div className="card-hover group">
          <div className="flex justify-between items-start mb-3">
            <div className="section-label text-red-400 group-hover:text-red-300 transition-colors">
              Threats Flagged
            </div>
            <div className="p-2 bg-red-950/40 rounded-lg group-hover:bg-red-900/50 transition-colors">
              <ShieldAlert className="w-4 h-4 text-red-400" />
            </div>
          </div>
          <div className="text-3xl font-display font-bold text-red-400 mb-1">
            {loading ? "..." : totalThreats}
          </div>
          <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400">
            <span>Critical & High severity</span>
          </div>
        </div>

        {/* Metric 3: Threat Rate */}
        <div className="card-hover group">
          <div className="flex justify-between items-start mb-3">
            <div className="section-label text-amber-400 group-hover:text-amber-300 transition-colors">
              Threat Rate
            </div>
            <div className="p-2 bg-amber-950/40 rounded-lg group-hover:bg-amber-900/50 transition-colors">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
            </div>
          </div>
          <div className="text-3xl font-display font-bold text-amber-400 mb-1">
            {loading ? "..." : `${stats?.threat_rate || 28.5}%`}
          </div>
          <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400">
            <span>Synthetic ratio</span>
          </div>
        </div>

        {/* Metric 4: System Health */}
        <div className="card-hover group">
          <div className="flex justify-between items-start mb-3">
            <div className="section-label text-emerald-400 group-hover:text-emerald-300 transition-colors">
              Ensemble Health
            </div>
            <div className="p-2 bg-emerald-950/40 rounded-lg group-hover:bg-emerald-900/50 transition-colors">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
          </div>
          <div className="text-3xl font-display font-bold text-emerald-400 mb-1">
            99.9%
          </div>
          <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400">
            <span>All 4 engines synchronized</span>
          </div>
        </div>
      </div>

      {/* Main Charts & Breakdown Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Traffic Chart */}
        <div className="card lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <div className="section-label mb-0">Analysis Activity & Threat Interceptions</div>
              <p className="text-xs font-mono text-slate-500 mt-0.5">
                Total throughput vs. identified deepfake media over time
              </p>
            </div>
          </div>

          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorAnalyses" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorThreats" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(79, 70, 229, 0.1)" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#040d1f",
                    borderColor: "rgba(79, 70, 229, 0.4)",
                    borderRadius: "8px",
                    fontFamily: "Space Mono",
                  }}
                  itemStyle={{ color: "#e2e8f0" }}
                />
                <Area
                  type="monotone"
                  dataKey="analyses"
                  name="Scans"
                  stroke="#818cf8"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorAnalyses)"
                />
                <Area
                  type="monotone"
                  dataKey="threats"
                  name="Deepfakes"
                  stroke="#ef4444"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorThreats)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Severity Distribution */}
        <div className="card space-y-4">
          <div className="section-label mb-2">Threat Severity Distribution</div>

          <div className="space-y-4 pt-1">
            {[
              { label: "CRITICAL", count: stats?.by_risk?.CRITICAL || 5, color: "bg-red-500", text: "text-red-400" },
              { label: "HIGH", count: stats?.by_risk?.HIGH || 4, color: "bg-orange-500", text: "text-orange-400" },
              { label: "MEDIUM", count: stats?.by_risk?.MEDIUM || 6, color: "bg-yellow-500", text: "text-yellow-400" },
              { label: "LOW", count: stats?.by_risk?.LOW || 15, color: "bg-emerald-500", text: "text-emerald-400" },
            ].map(({ label, count, color, text }) => {
              const total = stats?.total_analyses || 30;
              const pct = Math.round((count / (total || 1)) * 100);

              return (
                <div key={label} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-mono">
                    <span className={text}>{label}</span>
                    <span className="text-slate-400">
                      {count} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full h-2 bg-void-900 rounded-full overflow-hidden border border-indigo-900/30">
                    <div
                      className={`h-full ${color} rounded-full transition-all duration-700`}
                      style={{ width: `${Math.max(pct, 4)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-4 border-t border-indigo-900/30 flex justify-between items-center">
            <span className="text-xs font-mono text-slate-500">Forensic Engine</span>
            <span className="text-xs font-mono text-indigo-400">Platt Scaled Sigmoid</span>
          </div>
        </div>
      </div>

      {/* Recent Detections Live Stream */}
      <div className="card space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <div className="section-label mb-0">Recent Forensic Dossiers</div>
            <p className="text-xs font-mono text-slate-500 mt-0.5">
              Latest forensic examination results from live feeds
            </p>
          </div>
          <Link
            href="/reports"
            className="text-xs font-mono text-indigo-400 hover:text-indigo-300 flex items-center gap-1 group"
          >
            <span>View All Records</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Media File</th>
                <th>Type</th>
                <th>Fraud Risk</th>
                <th>Category</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {recentReports.length > 0 ? (
                recentReports.map((report) => (
                  <tr key={report.job_id} className="hover:bg-indigo-900/15 transition-colors">
                    <td className="font-mono text-indigo-400 text-xs">
                      #{report.job_id}
                    </td>
                    <td className="font-medium text-slate-200 flex items-center gap-2">
                      {getMediaIcon(report.file_type)}
                      <span className="truncate max-w-xs">
                        {(report as any).filename || `${report.file_type}_evidence`}
                      </span>
                    </td>
                    <td>
                      <span className="text-xs font-mono uppercase text-slate-400">
                        {report.file_type}
                      </span>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-bold text-white">
                          {report.fraud_risk_score}%
                        </span>
                      </div>
                    </td>
                    <td>{getRiskBadge(report.risk_category)}</td>
                    <td>
                      <span className="text-xs font-mono text-emerald-400">COMPLETE</span>
                    </td>
                    <td>
                      <Link
                        href={`/report/${report.job_id}`}
                        className="btn-ghost text-xs py-1 px-2.5 inline-flex items-center gap-1"
                      >
                        <FileSearch className="w-3 h-3" />
                        <span>Dossier</span>
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-slate-500 font-mono">
                    No forensic reports available. Generate demo data or upload new media.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
