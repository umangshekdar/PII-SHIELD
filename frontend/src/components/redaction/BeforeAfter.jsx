export default function BeforeAfter({ beforeText, afterText }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm flex flex-col h-[500px]">
        <div className="bg-slate-100 p-3 border-b border-slate-200 font-medium text-slate-700 flex justify-between items-center">
          <span>Original Document</span>
          <span className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded">Unsafe</span>
        </div>
        <div className="p-6 overflow-y-auto flex-grow text-sm font-serif leading-relaxed text-slate-800 whitespace-pre-wrap">
          {beforeText || "Original document content goes here..."}
        </div>
      </div>
      
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm flex flex-col h-[500px]">
        <div className="bg-emerald-50 p-3 border-b border-emerald-100 font-medium text-emerald-800 flex justify-between items-center">
          <span>Protected Document</span>
          <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-1 rounded flex items-center">
            <span className="w-2 h-2 rounded-full bg-emerald-500 mr-1.5 animate-pulse"></span>
            Safe
          </span>
        </div>
        <div className="p-6 overflow-y-auto flex-grow text-sm font-serif leading-relaxed text-slate-800 whitespace-pre-wrap">
          {afterText || "Redacted document content goes here..."}
        </div>
      </div>
    </div>
  );
}
