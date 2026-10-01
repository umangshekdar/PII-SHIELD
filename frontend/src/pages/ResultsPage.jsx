import { useState, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useScanContext } from '../context/ScanContext';
import { useScan } from '../hooks/useScan';
import RiskBadge from '../components/results/RiskBadge';
import SummaryCards from '../components/results/SummaryCards';
import DetectionTable from '../components/results/DetectionTable';
import RedactionSelector from '../components/redaction/RedactionSelector';
import DocumentPreview from '../components/redaction/DocumentPreview';
import { Shield, FileCheck, AlertTriangle } from 'lucide-react';

export default function ResultsPage() {
  const { scanData, selectedFile } = useScanContext();
  const { handleRedact, loading } = useScan();
  const navigate = useNavigate();
  const [selectedIds, setSelectedIds] = useState({});

  if (!scanData) {
    return <Navigate to="/dashboard" replace />;
  }

  const { scan_id, risk_score, risk_level, detections, sensitive_detections, summary } = scanData;

  const onRedact = async () => {
    const idsToRedact = Object.keys(selectedIds).filter(id => selectedIds[id]);
    if (idsToRedact.length === 0) {
      alert('Please select at least one item to redact.');
      return;
    }
    await handleRedact(scan_id, idsToRedact);
    navigate('/redaction');
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <div className="flex items-center text-emerald-600 mb-2 font-medium">
              <FileCheck className="h-5 w-5 mr-2" />
              <span>{scanData.filename || selectedFile?.name || 'Document'} scanned successfully</span>
            </div>
            <h1 className="text-3xl font-bold text-slate-900">Privacy Scan Complete</h1>
            <p className="text-slate-600 mt-2">
              {sensitive_detections || 0} sensitive items detected
            </p>
          </div>
          <div>
            <RiskBadge level={risk_level} score={risk_score} />
          </div>
        </div>

        <SummaryCards summary={summary} detections={detections} />

        <div className="mb-10">
          <h2 className="text-xl font-bold text-slate-800 mb-4">Detection Details</h2>
          <DetectionTable detections={detections} />
        </div>

        {/* Document Preview with highlighting */}
        {scanData.extracted_text && (
          <div className="mb-10">
            <h2 className="text-xl font-bold text-slate-800 mb-4">Document Preview</h2>
            <DocumentPreview text={scanData.extracted_text} detections={detections} />
          </div>
        )}

        {detections?.length > 0 && (
          <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Protect Your Document</h2>
            <p className="text-slate-600 mb-6">Review the detected information and choose what to redact. High-risk information is selected by default.</p>
            
            <RedactionSelector 
              detections={detections} 
              onSelectionChange={setSelectedIds} 
            />
            
            <div className="mt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
              <p className="text-sm text-slate-500 flex items-center">
                <AlertTriangle className="h-4 w-4 mr-1 text-amber-500" />
                Contact information (Name, Email, Phone) is kept visible by default.
              </p>
              <button
                onClick={onRedact}
                disabled={loading}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-lg font-medium shadow-sm transition flex items-center disabled:opacity-50"
              >
                {loading ? 'Processing...' : (
                  <>
                    <Shield className="h-5 w-5 mr-2" />
                    Redact Selected Information
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        <div className="bg-slate-100 p-6 rounded-xl text-sm text-slate-600">
          <strong>Risk Score Explanation:</strong> The <span className="font-semibold">{risk_level}</span> risk level (score: {risk_score}) indicates {risk_level === 'CRITICAL' || risk_level === 'HIGH' ? 'significant' : 'moderate'} privacy exposure if this document is shared as-is. Redacting the selected information will lower this risk.
          <p className="mt-2 text-xs text-slate-400 italic">This is a project-level risk indicator and is not an official legal or compliance classification.</p>
        </div>
      </div>
    </div>
  );
}
