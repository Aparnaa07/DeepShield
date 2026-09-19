export default function Reports() {
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
