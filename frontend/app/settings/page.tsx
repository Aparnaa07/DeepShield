export default function Settings() {
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
