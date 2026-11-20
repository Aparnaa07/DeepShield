"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  FileText,
  Search,
  Filter,
  Trash2,
  FileSearch,
  Image as ImageIcon,
  Music,
  FileCode,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  AlertTriangle,
} from "lucide-react";
import { listReports, deleteReport, AnalysisReport } from "../lib/api";

const CATEGORIES = ["ALL", "CRITICAL", "HIGH", "MEDIUM", "LOW"];

export default function ReportsPage() {
  const [reports, setReports] = useState<AnalysisReport[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(12);
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const skip = (page - 1) * limit;
      const riskCat = selectedCategory === "ALL" ? undefined : selectedCategory;
      const data = await listReports(limit, skip);

      let list = data.reports || [];
      if (riskCat) {
        list = list.filter((r: AnalysisReport) => r.risk_category === riskCat);
      }
      setReports(list);
      setTotal(data.total || list.length);
    } catch (err) {
      console.error("Failed to fetch reports:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [page, selectedCategory]);

  const handleDelete = async (jobId: string, e: React.MouseEvent) => {
    e.preventDefault();
    if (!confirm(`Are you sure you want to delete forensic report #${jobId}?`)) return;

    try {
      await deleteReport(jobId);
      setReports((prev) => prev.filter((r) => r.job_id !== jobId));
      setTotal((prev) => Math.max(prev - 1, 0));
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete report.");
    }
  };

  const filteredReports = reports.filter((r) => {
    const query = searchQuery.toLowerCase();
    const fname = ((r as any).filename || "").toLowerCase();
    const id = (r.job_id || "").toLowerCase();
    return fname.includes(query) || id.includes(query);
  });

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

  const totalPages = Math.ceil(total / limit) || 1;

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-indigo-300">
            Forensic Evidence Registry
          </h1>
          <p className="text-sm font-body text-slate-400 mt-1">
            Archived multi-modal forensic inspection dossiers and investigation logs
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/upload" className="btn-primary text-xs font-mono">
            <span>+ NEW ANALYSIS</span>
          </Link>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="card p-4 flex flex-col md:flex-row gap-4 justify-between items-center">
        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setPage(1);
              }}
              className={`
                px-3 py-1.5 rounded-lg text-xs font-mono transition-all
                ${
                  selectedCategory === cat
                    ? "bg-indigo-600 text-white shadow-indigo-glow"
                    : "bg-void-900 text-slate-400 hover:text-indigo-300 border border-indigo-900/30"
                }
              `}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3 pointer-events-none" />
          <input
            type="text"
            placeholder="Search Job ID or filename..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-void-900 border border-indigo-800/40 rounded-lg pl-9 pr-4 py-2 text-xs font-mono text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Reports Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Job ID</th>
                <th>Evidence File</th>
                <th>Type</th>
                <th>Timestamp</th>
                <th>Fraud Risk</th>
                <th>Risk Classification</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-500 font-mono">
                    Querying forensic registry...
                  </td>
                </tr>
              ) : filteredReports.length > 0 ? (
                filteredReports.map((report) => (
                  <tr
                    key={report.job_id}
                    className="hover:bg-indigo-900/15 transition-colors group"
                  >
                    <td className="font-mono text-indigo-400 text-xs font-bold">
                      #{report.job_id}
                    </td>
                    <td className="font-medium text-slate-200">
                      <div className="flex items-center gap-2">
                        {getMediaIcon(report.file_type)}
                        <span className="truncate max-w-xs font-mono text-xs text-slate-300">
                          {(report as any).filename || `${report.file_type}_file`}
                        </span>
                      </div>
                    </td>
                    <td>
                      <span className="text-xs font-mono uppercase text-slate-400">
                        {report.file_type}
                      </span>
                    </td>
                    <td className="font-mono text-xs text-slate-500">
                      {report.timestamp ? report.timestamp.split("T")[0] : "—"}
                    </td>
                    <td>
                      <span className="font-mono text-sm font-bold text-white">
                        {report.fraud_risk_score}%
                      </span>
                    </td>
                    <td>{getRiskBadge(report.risk_category)}</td>
                    <td className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/report/${report.job_id}`}
                          className="btn-ghost text-xs py-1 px-3 inline-flex items-center gap-1.5"
                        >
                          <FileSearch className="w-3.5 h-3.5" />
                          <span>Inspect</span>
                        </Link>
                        <button
                          onClick={(e) => handleDelete(report.job_id, e)}
                          title="Delete Dossier"
                          className="p-1.5 rounded hover:bg-red-950/40 text-slate-500 hover:text-red-400 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-500 font-mono">
                    No matching forensic records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-4 border-t border-indigo-900/40 flex justify-between items-center text-xs font-mono">
          <span className="text-slate-500">
            Showing {filteredReports.length} of {total} records
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page <= 1}
              className="btn-ghost px-2.5 py-1 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <span className="text-slate-400">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              disabled={page >= totalPages}
              className="btn-ghost px-2.5 py-1 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
