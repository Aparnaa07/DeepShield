"use client";

import React, { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useDropzone } from "react-dropzone";
import {
  UploadCloud,
  FileCheck,
  AlertCircle,
  Loader2,
  Image as ImageIcon,
  Music,
  FileText,
  ShieldCheck,
  Cpu,
  Fingerprint,
  FileCode2,
  CheckCircle2,
} from "lucide-react";
import { uploadFile, pollUntilComplete, JobStatus } from "../lib/api";

const ACCEPTED_TYPES = {
  "image/*": [".jpg", ".jpeg", ".png", ".webp"],
  "audio/*": [".mp3", ".wav", ".m4a"],
  "application/pdf": [".pdf"],
};

export default function UploadPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [notes, setNotes] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [jobStatus, setJobStatus] = useState<JobStatus | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const selected = acceptedFiles[0];
      setFile(selected);
      setErrorMessage(null);

      if (selected.type.startsWith("image/")) {
        const url = URL.createObjectURL(selected);
        setPreviewUrl(url);
      } else {
        setPreviewUrl(null);
      }
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED_TYPES,
    maxFiles: 1,
    maxSize: 50 * 1024 * 1024,
    onDropRejected: (rejections) => {
      const err = rejections[0]?.errors[0]?.message || "Invalid file selection";
      setErrorMessage(err);
    },
  });

  const handleStartAnalysis = async () => {
    if (!file) return;

    setIsUploading(true);
    setErrorMessage(null);

    try {
      // 1. Upload file
      const uploadRes = await uploadFile(file, notes);
      const jobId = uploadRes.job_id;

      // 2. Poll until completed
      await pollUntilComplete(jobId, (status) => {
        setJobStatus(status);
      });

      // 3. Completed! Redirect to report
      router.push(`/report/${jobId}`);
    } catch (err: any) {
      console.error("Upload error:", err);
      setErrorMessage(err?.response?.data?.detail || err.message || "Analysis failed");
      setIsUploading(false);
    }
  };

  const getFileIcon = () => {
    if (!file) return <UploadCloud className="w-10 h-10 text-indigo-400" />;
    if (file.type.startsWith("image/")) return <ImageIcon className="w-10 h-10 text-indigo-400" />;
    if (file.type.startsWith("audio/")) return <Music className="w-10 h-10 text-emerald-400" />;
    return <FileText className="w-10 h-10 text-amber-400" />;
  };

  const stepsList = [
    { key: "upload", label: "Media Intake & Verification", icon: FileCheck },
    { key: "preprocessing", label: "EXIF & Frame Preprocessing", icon: Fingerprint },
    { key: "ai_analysis", label: "Neural Forensic Inference", icon: Cpu },
    { key: "scoring", label: "ELA & Platt Ensemble Scoring", icon: FileCode2 },
    { key: "report", label: "Evidence Dossier Generation", icon: ShieldCheck },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-8 py-4">
      <div>
        <h1 className="text-3xl font-display font-bold text-indigo-300">New Media Forensic Intake</h1>
        <p className="text-slate-400 text-sm font-body mt-1">
          Upload synthetic media candidates (Deepfake images, cloned audio, altered KYC documents) for multi-layer inspection.
        </p>
      </div>

      {/* Main Upload Box */}
      {!isUploading ? (
        <div className="space-y-6">
          <div
            {...getRootProps()}
            className={`
              card p-10 border-2 border-dashed rounded-xl cursor-pointer text-center transition-all duration-300
              ${
                isDragActive
                  ? "border-indigo-400 bg-indigo-950/40 shadow-indigo-glow"
                  : file
                  ? "border-indigo-600/60 bg-void-800"
                  : "border-indigo-800/50 hover:border-indigo-500/80 bg-void-900/60"
              }
            `}
          >
            <input {...getInputProps()} />

            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="w-20 h-20 rounded-2xl bg-indigo-950/80 border border-indigo-700/40 flex items-center justify-center shadow-inner">
                {getFileIcon()}
              </div>

              {file ? (
                <div className="space-y-2">
                  <div className="font-display font-bold text-lg text-white">{file.name}</div>
                  <div className="text-xs font-mono text-indigo-400">
                    {(file.size / (1024 * 1024)).toFixed(2)} MB · {file.type || "binary"}
                  </div>
                  {previewUrl && (
                    <div className="mt-4 flex justify-center">
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="max-h-48 rounded-lg border border-indigo-700/40 shadow-lg object-contain"
                      />
                    </div>
                  )}
                  <p className="text-xs font-mono text-slate-500 mt-2">
                    Click or drag another file to replace
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="font-display font-semibold text-lg text-slate-200">
                    {isDragActive ? "Drop the file here..." : "Drag & drop file here, or click to browse"}
                  </div>
                  <p className="text-slate-500 font-mono text-xs max-w-sm mx-auto">
                    Supports JPEG, PNG, WEBP, MP3, WAV, M4A, PDF (up to 50MB)
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Optional Investigation Notes */}
          <div className="card space-y-2">
            <label className="section-label block">Investigation Notes / Case ID</label>
            <input
              type="text"
              placeholder="e.g. KYC Onboarding verification for Applicant #98234"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-void-900 border border-indigo-800/40 rounded-lg px-4 py-2.5 text-sm font-body text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          {errorMessage && (
            <div className="p-4 rounded-lg bg-red-950/50 border border-red-700/50 flex items-center gap-3 text-red-300 text-sm font-body">
              <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="flex justify-end">
            <button
              onClick={handleStartAnalysis}
              disabled={!file}
              className="btn-primary px-8 py-3.5 text-base shadow-indigo-glow disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Cpu className="w-5 h-5" />
              Run Deep Forensic Scan
            </button>
          </div>
        </div>
      ) : (
        /* Live Inspection Progress Screen */
        <div className="card p-8 space-y-8 animate-fadeIn">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-900/50 border border-indigo-600/50 text-indigo-300 text-xs font-mono">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-400" />
              <span>SCAN IN PROGRESS · JOB #{jobStatus?.job_id || "INITIALIZING"}</span>
            </div>
            <h2 className="text-2xl font-display font-bold text-white">
              Forensic Analysis Pipeline Active
            </h2>
            <p className="text-xs font-mono text-slate-400">
              Examining pixel-level anomalies, vocoder harmonics, and metadata integrity.
            </p>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-400">Pipeline Status</span>
              <span className="text-indigo-400 font-bold">{jobStatus?.progress || 10}%</span>
            </div>
            <div className="w-full h-3 bg-void-900 rounded-full overflow-hidden border border-indigo-800/40 p-0.5">
              <div
                className="h-full bg-gradient-to-r from-indigo-600 via-indigo-500 to-indigo-400 rounded-full transition-all duration-500 shadow-indigo-glow"
                style={{ width: `${Math.max(jobStatus?.progress || 10, 8)}%` }}
              />
            </div>
          </div>

          {/* Step-by-Step Execution Feed */}
          <div className="space-y-3 pt-2">
            {stepsList.map(({ key, label, icon: Icon }, idx) => {
              const stepVal = jobStatus?.steps?.[key as keyof typeof jobStatus.steps];
              const isCompleted = stepVal === "completed" || (jobStatus?.progress || 0) > (idx + 1) * 20;
              const isCurrent = !isCompleted && (stepVal === "processing" || (jobStatus?.progress || 0) >= idx * 20);

              return (
                <div
                  key={key}
                  className={`flex items-center gap-4 p-3.5 rounded-lg border transition-all ${
                    isCompleted
                      ? "bg-emerald-950/20 border-emerald-800/40 text-emerald-300"
                      : isCurrent
                      ? "bg-indigo-950/50 border-indigo-600/60 text-indigo-200 shadow-indigo-glow"
                      : "bg-void-900/40 border-void-700/30 text-slate-600"
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      isCompleted
                        ? "bg-emerald-900/50 text-emerald-400"
                        : isCurrent
                        ? "bg-indigo-900/70 text-indigo-300 animate-pulse"
                        : "bg-void-800 text-slate-600"
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : isCurrent ? (
                      <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
                    ) : (
                      <Icon className="w-4 h-4" />
                    )}
                  </div>

                  <div className="flex-1 font-body text-sm font-medium">{label}</div>

                  <div className="text-xs font-mono">
                    {isCompleted ? (
                      <span className="text-emerald-400">PASSED</span>
                    ) : isCurrent ? (
                      <span className="text-indigo-400 animate-pulse">PROCESSING...</span>
                    ) : (
                      <span className="text-slate-600">QUEUED</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {errorMessage && (
            <div className="p-4 rounded-lg bg-red-950/50 border border-red-700/50 text-red-300 text-sm font-body">
              {errorMessage}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
