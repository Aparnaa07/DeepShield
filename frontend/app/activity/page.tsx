export default function Activity() {
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
