import DetectionRow from './DetectionRow';

export default function DetectionTable({ detections = [] }) {
  if (detections.length === 0) {
    return (
      <div className="text-center py-8 text-slate-500 bg-white rounded-xl border border-slate-200">
        No sensitive information detected.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-sm uppercase tracking-wider text-slate-500">
              <th className="p-4 font-medium">Information</th>
              <th className="p-4 font-medium">Category</th>
              <th className="p-4 font-medium">Confidence</th>
              <th className="p-4 font-medium">Default Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {detections.map((detection) => (
              <DetectionRow key={detection.id} detection={detection} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
