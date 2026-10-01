export default function DocumentPreview({ text, detections = [] }) {
  if (!text) {
    return (
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm text-center text-slate-400">
        Document preview not available
      </div>
    );
  }

  // Build highlighted text
  const renderHighlightedText = () => {
    if (!detections.length) {
      return <span>{text}</span>;
    }

    // Sort detections by position
    const sorted = [...detections]
      .filter(d => d.position && d.value)
      .sort((a, b) => a.position.start - b.position.start);

    const parts = [];
    let lastEnd = 0;

    sorted.forEach((det, i) => {
      const start = text.indexOf(det.value, lastEnd);
      if (start === -1) return;
      
      const end = start + det.value.length;

      // Add text before this detection
      if (start > lastEnd) {
        parts.push(
          <span key={`text-${i}`}>{text.slice(lastEnd, start)}</span>
        );
      }

      // Add highlighted detection
      const isRedact = det.redaction_default;
      parts.push(
        <span
          key={`det-${i}`}
          className={`px-1 rounded ${
            isRedact 
              ? 'bg-red-100 border border-red-300 text-red-800' 
              : 'bg-yellow-100 border border-yellow-300 text-yellow-800'
          }`}
          title={`${det.type} — ${isRedact ? 'REDACT' : 'KEEP'}`}
        >
          {det.value}
          <span className={`ml-1 text-[10px] font-bold ${isRedact ? 'text-red-600' : 'text-green-600'}`}>
            {isRedact ? '🔴' : '🟡'}
          </span>
        </span>
      );

      lastEnd = end;
    });

    // Add remaining text
    if (lastEnd < text.length) {
      parts.push(<span key="text-end">{text.slice(lastEnd)}</span>);
    }

    return parts.length > 0 ? parts : <span>{text}</span>;
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm max-h-[600px] overflow-y-auto">
      <div className="flex items-center gap-4 mb-4 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-1.5 text-xs">
          <span className="w-3 h-3 bg-red-200 border border-red-400 rounded"></span>
          <span className="text-slate-600">Redact</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs">
          <span className="w-3 h-3 bg-yellow-200 border border-yellow-400 rounded"></span>
          <span className="text-slate-600">Keep visible</span>
        </div>
      </div>
      <pre className="text-sm font-serif leading-relaxed whitespace-pre-wrap text-slate-800">
        {renderHighlightedText()}
      </pre>
    </div>
  );
}
