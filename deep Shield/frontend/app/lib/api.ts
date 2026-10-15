



import axios from "axios";


const API_BASE = "";


export const api = axios.create({
  baseURL: API_BASE,
  timeout: 60000, 
});




export interface UploadResponse {
  job_id: string;
  filename: string;
  file_type: string;
  status: string;
  message: string;
}

export interface JobStatus {
  job_id: string;
  status: "queued" | "processing" | "completed" | "failed";
  progress: number;    
  created_at: string;
  error?: string;
  steps: {
    upload: string;
    preprocessing: string;
    ai_analysis: string;
    scoring: string;
    report: string;
  };
}

export interface AnalysisReport {
  job_id: string;
  timestamp: string;
  file_type: "image" | "audio" | "document";
  fraud_risk_score: number;       
  risk_category: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  recommendation: string;
  processing_time_ms: number;
  modules: Record<string, any>;   
}

export interface StatsResponse {
  total_analyses: number;
  by_risk: Record<string, number>;
  threat_rate: number;
}




export async function uploadFile(file: File, notes = ""): Promise<UploadResponse> {
  
  const formData = new FormData();
  formData.append("file", file);
  formData.append("notes", notes);

  const response = await api.post<UploadResponse>("/api/upload/", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
}


export async function getJobStatus(jobId: string): Promise<JobStatus> {
  const response = await api.get<JobStatus>(`/api/analyze/status/${jobId}`);
  return response.data;
}


export async function getAnalysisResult(jobId: string): Promise<AnalysisReport> {
  const response = await api.get<AnalysisReport>(`/api/analyze/result/${jobId}`);
  return response.data;
}


export async function listReports(limit = 20, skip = 0) {
  const response = await api.get("/api/report/list", { params: { limit, skip } });
  return response.data;
}


export async function getReport(jobId: string): Promise<AnalysisReport> {
  const response = await api.get<AnalysisReport>(`/api/report/${jobId}`);
  return response.data;
}


export async function getStats(): Promise<StatsResponse> {
  const response = await api.get<StatsResponse>("/api/report/stats/summary");
  return response.data;
}


export async function deleteReport(jobId: string) {
  await api.delete(`/api/report/${jobId}`);
}




export async function pollUntilComplete(
  jobId: string,
  onProgress?: (status: JobStatus) => void,
  intervalMs = 2000,
  maxAttempts = 60
): Promise<JobStatus> {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const status = await getJobStatus(jobId);
    onProgress?.(status);

    if (status.status === "completed" || status.status === "failed") {
      return status;
    }

    
    await new Promise((resolve) => setTimeout(resolve, intervalMs));
  }
  throw new Error("Analysis timed out after 2 minutes");
}


export function getRiskColor(category: string): string {
  const colors: Record<string, string> = {
    LOW:      "#22c55e",
    MEDIUM:   "#eab308",
    HIGH:     "#f97316",
    CRITICAL: "#ef4444",
  };
  return colors[category] || "#6b7280";
}
