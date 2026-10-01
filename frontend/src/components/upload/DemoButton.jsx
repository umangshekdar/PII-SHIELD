import { useNavigate } from 'react-router-dom';
import { useScan } from '../../hooks/useScan';
import { Play } from 'lucide-react';

export default function DemoButton({ variant = 'primary' }) {
  const navigate = useNavigate();
  const { handleDemo, loading } = useScan();

  const onClick = async () => {
    // Navigate to scan page first to show animation
    navigate('/scan');
    try {
      await handleDemo();
      // ScanPage will auto-navigate to /results when scanData appears
    } catch (err) {
      // ScanPage will auto-navigate back to /dashboard on error
    }
  };

  const baseClasses = "flex items-center justify-center space-x-2 font-medium rounded-lg transition-all shadow-sm cursor-pointer";
  const variants = {
    primary: "bg-slate-900 hover:bg-slate-800 text-white px-6 py-3",
    secondary: "bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-6 py-3 hover:border-slate-300",
    outline: "border-2 border-slate-300 hover:border-emerald-500 text-slate-800 px-6 py-3"
  };

  return (
    <button 
      onClick={onClick} 
      disabled={loading}
      className={`${baseClasses} ${variants[variant]} disabled:opacity-50`}
    >
      <Play className="h-4 w-4" />
      <span>Try Demo Document</span>
    </button>
  );
}
