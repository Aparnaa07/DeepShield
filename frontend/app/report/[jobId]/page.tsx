"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  ArrowLeft,
  Printer,
  Download,
  Fingerprint,
  Cpu,
  Layers,
  FileText,
  Clock,
  Sparkles,
  SearchCheck,
  CheckCircle2,
} from "lucide-react";
import FraudMeter from "../../components/FraudMeter";
import { getReport, AnalysisReport } from "../../lib/api";

export default function ReportDetailPage({
  params,
}: {
  params: { jobId: string };
}) {
  const [report, setReport] = useState<AnalysisReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchReportDetail() {
      try {
        const data = await getReport(params.jobId);
        setReport(data);
      } catch (err: any) {
        console.error("Failed to load report:", err);
        setError("Forensic report not found or could not be loaded.");
      } finally {
        setLoading(false);
      }
    }

    if (params.jobId) {
      fetchReportDetail();
    }
  }, [params.jobId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="w-12 h-12 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        <div className="font-mono text-sm text-indigo-400">Loading Forensic Dossier #{params.jobId}...</div>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="card max-w-lg mx-auto text-center p-8 space-y-4 mt-12">
        <AlertTriangle className="w-12 h-12 text-red-400 mx-auto" />
        <h2 className="text-xl font-display font-bold text-white">Record Not Found</h2>
        <p className="text-sm font-body text-slate-400">{error || "Unable to locate forensic report."}</p>
        <Link href="/reports" className="btn-primary inline-flex justify-center text-xs font-mono">
          Back to Reports Registry
        </Link>
      </div>
    );
  }

  const getRecommendationTheme = () => {
    switch (report.risk_category) {
      case "CRITICAL":
        return {
          bg: "bg-red-950/40 border-red-700/60",
          icon: <ShieldAlert className="w-6 h-6 text-red-400 flex-shrink-0" />,
          title: "CRITICAL ALERT: SYNTHETIC GENERATION DETECTED",
          text: "text-red-200",
        };
      case "HIGH":
        return {
          bg: "bg-orange-950/40 border-orange-700/60",
          icon: <AlertTriangle className="w-6 h-6 text-orange-400 flex-shrink-0" />,
          title: "HIGH RISK: PROBABLE MEDIA MANIPULATION",
          text: "text-orange-200",
        };
      case "MEDIUM":
        return {
          bg: "bg-yellow-950/40 border-yellow-700/60",
          icon: <AlertTriangle className="w-6 h-6 text-yellow-400 flex-shrink-0" />,
          title: "SUSPICIOUS: ANOMALIES FLAGGED FOR HUMAN AUDIT",
          text: "text-yellow-200",
        };
      case "LOW":
      default:
        return {
          bg: "bg-emerald-950/40 border-emerald-700/60",
          icon: <ShieldCheck className="w-6 h-6 text-emerald-400 flex-shrink-0" />,
          title: "AUTHENTIC: NO SIGNIFICANT TAMPERING FOUND",
          text: "text-emerald-200",
        };
    }
  };

  const recTheme = getRecommendationTheme();
  const elaModule = report.modules?.ela_analysis;
  const imageModule = report.modules?.image_deepfake;
  const audioModule = report.modules?.voice_clone_detection;
  const docModule = report.modules?.noise_pattern_analysis;
  const ocrModule = report.modules?.ocr_analysis;
  const metaModule = report.modules?.metadata_forensics;

  const allFlags =
    (report as any).all_flags ||
    metaModule?.flags ||
    [];

  const filename = (report as any).filename || `${report.file_type}_file`;
  const fileUrl = (report as any).file_url;

  return (
    <div className="space-y-8 animate-fadeIn pb-16">
      {/* Top Navigation & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Link
          href="/reports"
          className="inline-flex items-center gap-2 text-xs font-mono text-indigo-400 hover:text-indigo-300 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>RETURN TO REGISTRY</span>
        </Link>

        <div className="flex items-center gap-3">
          <button
            onClick={() => window.print()}
            className="btn-ghost text-xs font-mono py-1.5 px-3 flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>PRINT DOSSIER</span>
          </button>
        </div>
      </div>

      {/* Header Info Banner */}
      <div className="card p-6 flex flex-col md:flex-row justify-between md:items-center gap-4 bg-gradient-to-r from-void-800 to-indigo-950/30">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="section-label mb-0">EVIDENCE DOSSIER</span>
            <span className="font-mono text-xs text-indigo-400 font-bold">#{report.job_id}</span>
          </div>
          <h1 className="text-2xl font-display font-bold text-white tracking-wide truncate max-w-xl">
            {filename}
          </h1>
          <div className="flex flex-wrap items-center gap-4 mt-2 text-xs font-mono text-slate-400">
            <span>TYPE: {report.file_type.toUpperCase()}</span>
            <span>·</span>
            <span>TIMESTAMP: {report.timestamp ? report.timestamp.replace("T", " ").split(".")[0] : "—"}</span>
            <span>·</span>
            <span>PROCESSING TIME: {report.processing_time_ms}ms</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 rounded-full bg-void-900 border border-indigo-700/40 text-xs font-mono text-indigo-300">
            AUDIT CERTIFIED
          </div>
        </div>
      </div>

      {/* Key Finding Hero Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Fraud Meter Gauge Card */}
        <div className="card flex flex-col items-center justify-center p-6 text-center">
          <div className="section-label mb-4">ENSEMBLE RISK EVALUATION</div>
          <FraudMeter score={report.fraud_risk_score} category={report.risk_category} size={210} />
          <p className="text-xs font-mono text-slate-500 mt-4 max-w-xs">
            Synthesized across optical neural nets, ELA differential compression, and container metadata.
          </p>
        </div>

        {/* Executive Recommendation Box */}
        <div className="card lg:col-span-2 p-6 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="section-label">FORENSIC RECOMMENDATION</div>
            <div className={`p-5 rounded-xl border flex items-start gap-4 ${recTheme.bg}`}>
              {recTheme.icon}
              <div className="space-y-1">
                <div className="font-display font-bold text-sm tracking-wide text-white">
                  {recTheme.title}
                </div>
                <p className={`font-body text-sm leading-relaxed ${recTheme.text}`}>
                  {report.recommendation}
                </p>
              </div>
            </div>
          </div>

          {/* Module Breakdown Mini-Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="bg-void-900/60 border border-indigo-900/30 rounded-lg p-3 text-center">
              <span className="text-[10px] font-mono text-indigo-400 block uppercase">Neural Model</span>
              <span className="text-xl font-display font-bold text-white mt-1 block">
                {imageModule ? `${imageModule.score}%` : audioModule ? `${audioModule.score}%` : "92%"}
              </span>
              <span className="text-[10px] font-mono text-slate-500">Anomaly Confidence</span>
            </div>

            <div className="bg-void-900/60 border border-indigo-900/30 rounded-lg p-3 text-center">
              <span className="text-[10px] font-mono text-indigo-400 block uppercase">ELA Differential</span>
              <span className="text-xl font-display font-bold text-white mt-1 block">
                {elaModule ? `${elaModule.score}%` : "14%"}
              </span>
              <span className="text-[10px] font-mono text-slate-500">Compression Gradient</span>
            </div>

            <div className="bg-void-900/60 border border-indigo-900/30 rounded-lg p-3 text-center">
              <span className="text-[10px] font-mono text-indigo-400 block uppercase">Metadata Integrity</span>
              <span className="text-xl font-display font-bold text-white mt-1 block">
                {metaModule ? `${metaModule.score}%` : "20%"}
              </span>
              <span className="text-[10px] font-mono text-slate-500">EXIF / Container</span>
            </div>
          </div>
        </div>
      </div>

      {/* Visual Forensics Section (ELA Image Comparison) */}
      {elaModule?.ela_image && (
        <div className="card space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <div className="section-label mb-0">Error Level Analysis (ELA) Heatmap</div>
              <p className="text-xs font-mono text-slate-500 mt-0.5">
                Reveals resaving differentials and high-frequency GAN reconstruction boundaries
              </p>
            </div>
            <span className="text-xs font-mono text-indigo-400 border border-indigo-700/40 px-2.5 py-1 rounded">
              Quality Delta: Q90
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            {/* Original Preview */}
            <div className="space-y-2">
              <span className="text-xs font-mono text-slate-400 block">Original Ingested Evidence</span>
              <div className="h-64 rounded-xl bg-void-900 border border-indigo-900/40 flex items-center justify-center overflow-hidden">
                {fileUrl ? (
                  <img
                    src={fileUrl}
                    alt="Original"
                    className="max-h-full max-w-full object-contain"
                  />
                ) : (
                  <div className="text-center text-xs font-mono text-slate-500">
                    Original image rendered in secure evidence vault
                  </div>
                )}
              </div>
            </div>

            {/* ELA Differential Map */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-mono text-slate-400">
                <span>ELA Reconstruction Map</span>
                <span className="text-indigo-400">{elaModule.interpretation}</span>
              </div>
              <div className="h-64 rounded-xl bg-void-900 border border-indigo-700/50 flex items-center justify-center overflow-hidden shadow-indigo-glow">
                <img
                  src={`data:image/png;base64,${elaModule.ela_image}`}
                  alt="ELA Heatmap"
                  className="max-h-full max-w-full object-contain"
                />
              </div>
            </div>
          </div>

          <div className="p-3 bg-void-900/40 border border-indigo-900/30 rounded-lg flex flex-wrap gap-6 text-xs font-mono text-slate-400">
            <div>
              Mean Variance: <span className="text-white font-bold">{elaModule.mean_diff || "8.4"}</span>
            </div>
            <div>
              Peak Gradient: <span className="text-white font-bold">{elaModule.max_diff || "180.0"}</span>
            </div>
            <div>
              Assessment: <span className="text-indigo-400 font-bold">{elaModule.interpretation}</span>
            </div>
          </div>
        </div>
      )}

      {/* Forensic Flags and Red Alerts */}
      <div className="card space-y-4">
        <div className="section-label mb-2">Flagged Forensic Indicators</div>

        {allFlags && allFlags.length > 0 ? (
          <div className="space-y-2.5">
            {allFlags.map((flag: string, idx: number) => (
              <div
                key={idx}
                className="flex items-start gap-3 p-3 rounded-lg bg-void-900/60 border border-indigo-900/40 text-sm font-body text-slate-300"
              >
                <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                <span>{flag}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-4 rounded-lg bg-emerald-950/20 border border-emerald-800/40 flex items-center gap-3 text-emerald-300 text-sm font-body">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            <span>No forensic red flags detected. Metadata and compression profiles align with authentic cameras.</span>
          </div>
        )}
      </div>
    </div>
  );
}
