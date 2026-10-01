import FileUploader from '../components/upload/FileUploader';
import DemoButton from '../components/upload/DemoButton';
import { Lock } from 'lucide-react';

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-slate-900 mb-4">Document Scanner</h1>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Upload a document to scan for sensitive personal information. 
            Supported formats include PDF, Word, Excel, CSV, images, and text files.
          </p>
        </div>
        
        <div className="bg-white p-8 sm:p-12 rounded-2xl shadow-sm border border-slate-200 mb-8">
          <FileUploader />
        </div>
        
        <div className="flex flex-col sm:flex-row items-center justify-between bg-emerald-50 rounded-xl p-6 border border-emerald-100">
          <div className="mb-4 sm:mb-0">
            <h3 className="font-semibold text-emerald-900 mb-1">Want to see how it works first?</h3>
            <p className="text-sm text-emerald-700">Try our sample document pre-loaded with simulated PII.</p>
          </div>
          <DemoButton variant="secondary" />
        </div>
        
        <div className="mt-12 text-center text-sm text-slate-500 flex items-center justify-center">
          <Lock className="h-4 w-4 mr-2" />
          🔒 Documents are processed temporarily and are not permanently stored.
        </div>
      </div>
    </div>
  );
}
