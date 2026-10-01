import { getRiskColor } from '../../utils/helpers';
import { AlertTriangle, ShieldCheck, AlertCircle, ShieldAlert } from 'lucide-react';

export default function RiskBadge({ level, score }) {
  const colorClass = getRiskColor(level);
  
  const getIcon = () => {
    switch (level?.toUpperCase()) {
      case 'LOW': return <ShieldCheck className="h-6 w-6 mr-2" />;
      case 'MEDIUM': return <AlertCircle className="h-6 w-6 mr-2" />;
      case 'HIGH': return <ShieldAlert className="h-6 w-6 mr-2" />;
      case 'CRITICAL': return <AlertTriangle className="h-6 w-6 mr-2" />;
      default: return <AlertCircle className="h-6 w-6 mr-2" />;
    }
  };

  return (
    <div className={`inline-flex flex-col items-center px-6 py-3 rounded-xl border-2 ${colorClass}`}>
      <div className="flex items-center font-bold text-lg uppercase tracking-wider">
        {getIcon()}
        {level || 'UNKNOWN'} RISK
      </div>
      {score !== undefined && (
        <span className="text-xs mt-1 opacity-75">Score: {score}</span>
      )}
    </div>
  );
}
