import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const CATEGORY_LABELS = {
  government_id: 'Government ID',
  financial_information: 'Financial',
  sensitive_personal_information: 'Sensitive Personal',
  contact_information: 'Contact',
  personal_information: 'Personal',
  medical_information: 'Medical',
};

export default function DetectionRow({ detection }) {
  const [showValue, setShowValue] = useState(false);
  
  const isRedactDefault = detection.redaction_default;
  const categoryLabel = CATEGORY_LABELS[detection.category] || detection.category;
  
  return (
    <tr className="hover:bg-slate-50 transition">
      <td className="p-4">
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-slate-800 mb-1">{detection.type}</span>
          <div className="flex items-center space-x-2">
            <span className="font-mono text-xs bg-slate-100 px-2 py-1 rounded text-slate-600">
              {showValue ? detection.value : (detection.masked_value || '••••••••')}
            </span>
            <button 
              onClick={() => setShowValue(!showValue)}
              className="text-slate-400 hover:text-slate-600 focus:outline-none p-1"
              title={showValue ? "Hide value" : "Show value"}
            >
              {showValue ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
            </button>
          </div>
        </div>
      </td>
      <td className="p-4">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          isRedactDefault 
            ? 'bg-red-50 text-red-700 border border-red-200' 
            : 'bg-blue-50 text-blue-700 border border-blue-200'
        }`}>
          {categoryLabel}
        </span>
      </td>
      <td className="p-4">
        <div className="flex items-center space-x-2">
          <div className="w-16 h-2 bg-slate-200 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full ${detection.confidence > 0.8 ? 'bg-emerald-500' : 'bg-amber-500'}`}
              style={{ width: `${detection.confidence * 100}%` }}
            />
          </div>
          <span className="text-xs text-slate-500">{Math.round(detection.confidence * 100)}%</span>
        </div>
      </td>
      <td className="p-4">
        {isRedactDefault ? (
          <span className="inline-flex items-center px-2.5 py-1 rounded text-xs font-semibold bg-red-100 text-red-700 border border-red-200">
            🔴 REDACT
          </span>
        ) : (
          <span className="inline-flex items-center px-2.5 py-1 rounded text-xs font-semibold bg-green-100 text-green-700 border border-green-200">
            🟢 KEEP
          </span>
        )}
      </td>
    </tr>
  );
}
