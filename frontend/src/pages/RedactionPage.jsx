import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useScanContext } from '../context/ScanContext';
import { useScan } from '../hooks/useScan';
import BeforeAfter from '../components/redaction/BeforeAfter';
import { CheckCircle2, Download, FileText, RefreshCw, FileDown } from 'lucide-react';

export default function RedactionPage() {
  const { redactionData, scanData, selectedFile } = useScanContext();
  const { handleDownload, loading } = useScan();
  const navigate = useNavigate();
  const [showReport, setShowReport] = useState(false);

  if (!redactionData || !scanData) {
    return <Navigate to="/dashboard" replace />;
  }

  const { scan_id } = scanData;
  const originalName = scanData.filename || selectedFile?.name || 'document';
  const newName = originalName.includes('.') 
    ? `${originalName.substring(0, originalName.lastIndexOf('.'))}_PIISafe${originalName.substring(originalName.lastIndexOf('.'))}`
    : `${originalName}_PIISafe`;

  const onDownload = () => {
    handleDownload(scan_id, redactionData.output_filename);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Success Header */}
        <div className="flex flex-col items-center text-center mb-10">
          <div className="h-16 w-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle2 className="h-10 w-10 text-emerald-600" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Document Protected</h1>
          <p className="text-slate-600 max-w-2xl">
            Successfully redacted <span className="font-semibold text-emerald-700">{redactionData.redacted_count}</span> sensitive items 
            while keeping <span className="font-semibold text-blue-600">{redactionData.kept_count}</span> items visible. 
            Your document is now safer to share.
          </p>
        </div>

        {/* Before / After Comparison */}
        <div className="mb-10">
          <BeforeAfter 
            beforeText={redactionData.before_text || scanData.extracted_text} 
            afterText={redactionData.after_text} 
          />
        </div>

        {/* Download Card */}
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="font-semibold text-lg text-slate-800 mb-1">Ready for Download</h3>
            <p className="text-slate-500 text-sm">Temporary files will be deleted after download.</p>
            <div className="flex items-center mt-2 bg-slate-100 px-3 py-1.5 rounded-md">
              <FileDown className="h-4 w-4 text-emerald-600 mr-2" />
              <p className="text-slate-700 font-mono text-sm font-medium">{redactionData.output_filename || newName}</p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <button
              onClick={onDownload}
              disabled={loading}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-medium shadow-sm transition flex items-center justify-center disabled:opacity-50"
            >
              <Download className="h-5 w-5 mr-2" />
              {loading ? 'Downloading...' : 'Download Safe Document'}
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-8">
          <button onClick={() => { navigate('/dashboard'); }} className="text-slate-600 hover:text-slate-900 font-medium flex items-center">
            <RefreshCw className="h-4 w-4 mr-2" />
            Scan Another Document
          </button>
          <button 
            onClick={() => setShowReport(!showReport)} 
            className="text-blue-600 hover:text-blue-800 font-medium flex items-center"
          >
            <FileText className="h-4 w-4 mr-2" />
            {showReport ? 'Hide' : 'Generate'} Privacy Report
          </button>
        </div>

        {/* Privacy Report */}
        {showReport && (
          <div className="mt-8 bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center">
              <FileText className="h-5 w-5 mr-2 text-blue-600" />
              Privacy Scan Report
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-500">File Name</span>
                  <span className="font-medium text-slate-800">{scanData.filename}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-500">File Type</span>
                  <span className="font-medium text-slate-800 uppercase">{scanData.file_type}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-500">Scan Date</span>
                  <span className="font-medium text-slate-800">{new Date().toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-500">Total Detections</span>
                  <span className="font-medium text-slate-800">{scanData.total_detections}</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-500">Sensitive Detections</span>
                  <span className="font-medium text-red-600">{scanData.sensitive_detections}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-500">Risk Score</span>
                  <span className="font-medium text-slate-800">{scanData.risk_score}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-500">Risk Level</span>
                  <span className={`font-bold ${scanData.risk_level === 'CRITICAL' ? 'text-red-600' : scanData.risk_level === 'HIGH' ? 'text-orange-600' : 'text-amber-600'}`}>{scanData.risk_level}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-500">Items Redacted</span>
                  <span className="font-medium text-emerald-600">{redactionData.redacted_count}</span>
                </div>
              </div>
            </div>
            <div className="mt-4 p-3 bg-emerald-50 rounded-lg text-sm text-emerald-800 border border-emerald-100">
              <strong>Recommendation:</strong> {scanData.sensitive_detections} high-risk PII items were identified and {redactionData.redacted_count} were selected for redaction. The protected document is safer to share.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
