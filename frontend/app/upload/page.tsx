export default function UploadPage() {
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
