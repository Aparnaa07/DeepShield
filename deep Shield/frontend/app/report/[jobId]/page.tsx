export default function ReportDetails({ params }: { params: { jobId: string } }) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-display font-bold text-indigo-400">Report Details</h1>
        <span className="font-mono text-slate-400">ID: {params.jobId}</span>
      </div>
      <div className="card">
        <div className="section-label mb-4">Analysis Summary</div>
        <p className="text-slate-300 font-body">The Deep Shield core engine completed analysis with a high confidence score. No significant anomalies detected in visual or audio streams.</p>
        <div className="mt-6 p-4 border border-indigo-700/30 rounded-lg bg-indigo-900/10">
          <div className="flex justify-between font-mono text-sm">
            <span className="text-slate-400">Overall Risk Score:</span>
            <span className="text-green-400">12% (SAFE)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
