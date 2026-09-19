import os

pages = {
    'app/page.tsx': '''import { redirect } from 'next/navigation';
export default function Home() { redirect('/dashboard'); }
''',

    'app/dashboard/page.tsx': '''export default function Dashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-display font-bold text-indigo-400">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card-hover">
          <div className="section-label">Total Analyses</div>
          <div className="text-4xl font-mono text-white">1,245</div>
        </div>
        <div className="card-hover">
          <div className="section-label">Deepfakes Detected</div>
          <div className="text-4xl font-mono text-red-400">89</div>
        </div>
        <div className="card-hover">
          <div className="section-label">System Health</div>
          <div className="text-4xl font-mono text-green-400">99.9%</div>
        </div>
      </div>
      <div className="card h-64 flex items-center justify-center border-indigo-700/50">
        <span className="text-indigo-400 font-mono">Chart Placeholder - Traffic Overview</span>
      </div>
    </div>
  );
}
''',

    'app/upload/page.tsx': '''export default function UploadPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-6 mt-12">
      <h1 className="text-3xl font-display font-bold text-indigo-400 text-center">New Analysis</h1>
      <div className="card p-12 border-dashed border-2 border-indigo-600/50 hover:border-indigo-400/80 transition-colors cursor-pointer text-center group">
        <div className="w-16 h-16 rounded-full bg-indigo-900/50 mx-auto flex items-center justify-center group-hover:scale-110 transition-transform">
          <svg className="w-8 h-8 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
        </div>
        <h3 className="mt-4 text-xl font-body font-semibold text-white">Drag & Drop Media</h3>
        <p className="text-slate-400 font-mono text-sm mt-2">Supports MP4, JPG, PNG, MP3 up to 50MB</p>
      </div>
      <div className="flex justify-center">
        <button className="btn-primary">Select Files to Analyze</button>
      </div>
    </div>
  );
}
''',

    'app/reports/page.tsx': '''export default function Reports() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-display font-bold text-indigo-400">Analysis Reports</h1>
      <div className="card overflow-hidden">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Filename</th>
              <th>Date</th>
              <th>Status</th>
              <th>Risk Level</th>
            </tr>
          </thead>
          <tbody>
            {[1, 2, 3, 4, 5].map((i) => (
              <tr key={i} className="hover:bg-indigo-900/20 cursor-pointer">
                <td className="font-mono text-indigo-400">#DS-{4900+i}</td>
                <td>sample_video_0{i}.mp4</td>
                <td>2026-09-17 10:0{i} AM</td>
                <td><span className="text-green-400 font-mono text-xs">COMPLETE</span></td>
                <td><span className="badge-low">LOW</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
''',

    'app/report/[jobId]/page.tsx': '''export default function ReportDetails({ params }: { params: { jobId: string } }) {
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
''',

    'app/activity/page.tsx': '''export default function Activity() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-display font-bold text-indigo-400">Live Feed</h1>
      <div className="card min-h-[500px]">
        <div className="space-y-4">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="flex gap-4 p-3 border-b border-indigo-900/30 last:border-0 hover:bg-indigo-900/10 transition-colors">
              <div className="w-2 h-2 mt-2 rounded-full bg-indigo-500 animate-pulse"></div>
              <div>
                <div className="text-sm font-body text-slate-200">System scan initialized on endpoint #{100+i}</div>
                <div className="text-xs font-mono text-slate-500">{i} minutes ago</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
''',

    'app/settings/page.tsx': '''export default function Settings() {
  return (
    <div className="space-y-6 max-w-3xl">
      <h1 className="text-3xl font-display font-bold text-indigo-400">System Settings</h1>
      
      <div className="card">
        <div className="section-label mb-3">API Configuration</div>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-indigo-400 mb-1">Backend URL</label>
            <input type="text" defaultValue="http://localhost:8000" className="w-full bg-void-700/50 border border-indigo-700/30 rounded-lg px-4 py-2 focus:outline-none focus:border-indigo-500/60 font-mono text-sm text-slate-300" />
          </div>
        </div>
      </div>

      <div className="card">
        <div className="section-label mb-3">About</div>
        <div className="space-y-2">
          {[
            ["Project",  "Deep Shield"],
            ["Version",  "2.0.0 (Revamped)"],
            ["Track",    "Cybersecurity + Generative AI"],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between py-2 border-b border-indigo-900/20 last:border-0">
              <span className="font-mono text-xs text-slate-500">{k}</span>
              <span className="font-mono text-xs text-indigo-400">{v}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
'''
}

for k, v in pages.items():
    with open(k, 'w', encoding='utf-8') as f:
        f.write(v)
