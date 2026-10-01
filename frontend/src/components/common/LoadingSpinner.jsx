import { Loader2 } from 'lucide-react';

export default function LoadingSpinner({ text = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4">
      <Loader2 className="h-12 w-12 text-emerald-500 animate-spin" />
      <p className="text-slate-600 font-medium">{text}</p>
    </div>
  );
}
