import { useState, useEffect } from 'react';
import { Shield, Eye, EyeOff } from 'lucide-react';

export default function RedactionSelector({ detections, onSelectionChange }) {
  const [selected, setSelected] = useState({});

  useEffect(() => {
    // Initialize default selections based on backend's redaction_default
    const initial = {};
    detections.forEach(d => {
      initial[d.id] = d.redaction_default;
    });
    setSelected(initial);
    onSelectionChange(initial);
  }, [detections]);

  const handleToggle = (id) => {
    const next = { ...selected, [id]: !selected[id] };
    setSelected(next);
    onSelectionChange(next);
  };

  const handleSelectAll = (val) => {
    const next = {};
    detections.forEach(d => next[d.id] = val);
    setSelected(next);
    onSelectionChange(next);
  };

  const sensitiveItems = detections.filter(d => d.redaction_default);
  const contactItems = detections.filter(d => !d.redaction_default);

  return (
    <div>
      {/* Sensitive items section */}
      {sensitiveItems.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-slate-800 flex items-center text-sm">
              <Shield className="h-4 w-4 mr-2 text-red-500" />
              Sensitive Information — Selected for Redaction
            </h4>
            <div className="space-x-3 text-xs">
              <button onClick={() => handleSelectAll(true)} className="text-emerald-600 hover:underline font-medium">Select All</button>
              <span className="text-slate-300">|</span>
              <button onClick={() => handleSelectAll(false)} className="text-slate-500 hover:underline font-medium">Deselect All</button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {sensitiveItems.map(d => (
              <label key={d.id} className={`flex items-start p-3 rounded-lg border cursor-pointer transition ${
                selected[d.id] ? 'bg-red-50 border-red-200' : 'bg-white border-slate-200 hover:bg-slate-50'
              }`}>
                <input 
                  type="checkbox" 
                  className="mt-1 h-4 w-4 text-red-600 rounded border-slate-300 focus:ring-red-500 accent-red-600"
                  checked={!!selected[d.id]}
                  onChange={() => handleToggle(d.id)}
                />
                <div className="ml-3 flex-1">
                  <div className="flex justify-between items-center">
                    <span className={`text-sm font-medium ${selected[d.id] ? 'text-red-800' : 'text-slate-700'}`}>
                      {d.type}
                    </span>
                    <span className="text-[10px] uppercase text-red-500 bg-red-50 px-1.5 py-0.5 rounded font-medium">
                      {selected[d.id] ? 'Will Redact' : 'Unselected'}
                    </span>
                  </div>
                  <p className="text-xs font-mono mt-1 text-slate-500">{d.masked_value || '••••••••'}</p>
                </div>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Contact/Personal items section */}
      {contactItems.length > 0 && (
        <div>
          <h4 className="font-semibold text-slate-800 flex items-center text-sm mb-3">
            <Eye className="h-4 w-4 mr-2 text-blue-500" />
            Contact Information — Kept Visible by Default
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {contactItems.map(d => (
              <label key={d.id} className={`flex items-start p-3 rounded-lg border cursor-pointer transition ${
                selected[d.id] ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200 hover:bg-green-100'
              }`}>
                <input 
                  type="checkbox" 
                  className="mt-1 h-4 w-4 text-red-600 rounded border-slate-300 focus:ring-red-500 accent-red-600"
                  checked={!!selected[d.id]}
                  onChange={() => handleToggle(d.id)}
                />
                <div className="ml-3 flex-1">
                  <div className="flex justify-between items-center">
                    <span className={`text-sm font-medium ${selected[d.id] ? 'text-red-800' : 'text-green-800'}`}>
                      {d.type}
                    </span>
                    <span className={`text-[10px] uppercase px-1.5 py-0.5 rounded font-medium ${
                      selected[d.id] 
                        ? 'text-red-500 bg-red-50' 
                        : 'text-green-600 bg-green-100'
                    }`}>
                      {selected[d.id] ? 'Will Redact' : 'Kept visible'}
                    </span>
                  </div>
                  <p className="text-xs font-mono mt-1 text-slate-500">{d.value}</p>
                </div>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
