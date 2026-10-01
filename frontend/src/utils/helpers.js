export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const getRiskColor = (level) => {
  switch (level?.toUpperCase()) {
    case 'LOW': return 'text-green-500 bg-green-50 border-green-200';
    case 'MEDIUM': return 'text-amber-500 bg-amber-50 border-amber-200';
    case 'HIGH': return 'text-orange-500 bg-orange-50 border-orange-200';
    case 'CRITICAL': return 'text-red-600 bg-red-50 border-red-200 animate-pulse';
    default: return 'text-slate-500 bg-slate-50 border-slate-200';
  }
};
