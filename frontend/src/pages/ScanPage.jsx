import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useScanContext } from '../context/ScanContext';
import ScanAnimation from '../components/scan/ScanAnimation';
import ScanProgress from '../components/scan/ScanProgress';
import ErrorMessage from '../components/common/ErrorMessage';

export default function ScanPage() {
  const { scanData, error } = useScanContext();
  const navigate = useNavigate();
  const navigated = useRef(false);

  useEffect(() => {
    if (scanData && !navigated.current) {
      // Wait for scan animation to complete (min 3s), then navigate
      const timer = setTimeout(() => {
        navigated.current = true;
        navigate('/results');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [scanData, navigate]);

  useEffect(() => {
    if (error && !navigated.current) {
      navigated.current = true;
      navigate('/dashboard');
    }
  }, [error, navigate]);

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center px-4 pt-16 pb-24">
      <div className="max-w-md w-full text-center">
        <h1 className="text-3xl font-bold text-white mb-12">Analyzing Your Document</h1>
        
        <ScanAnimation />
        
        <div className="mt-16 text-left">
          <ScanProgress />
        </div>

        {error && (
          <div className="mt-6">
            <ErrorMessage message={error} />
          </div>
        )}
      </div>
    </div>
  );
}
