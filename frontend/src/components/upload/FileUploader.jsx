import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, File, X, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useScan } from '../../hooks/useScan';

export default function FileUploader() {
  const [file, setFile] = useState(null);
  const [uploadError, setUploadError] = useState(null);
  const navigate = useNavigate();
  const { handleScan, loading } = useScan();

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    setUploadError(null);
    if (rejectedFiles?.length > 0) {
      const rejection = rejectedFiles[0];
      if (rejection.errors[0]?.code === 'file-too-large') {
        setUploadError('Maximum file size is 10 MB.');
      } else if (rejection.errors[0]?.code === 'file-invalid-type') {
        setUploadError('This file type is not supported.');
      } else {
        setUploadError(rejection.errors[0]?.message || 'Invalid file.');
      }
      return;
    }
    if (acceptedFiles?.length > 0) {
      setFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
    maxSize: 10485760, // 10MB
    accept: {
      'application/pdf': ['.pdf'],
      'image/png': ['.png'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'text/csv': ['.csv'],
      'text/plain': ['.txt']
    }
  });

  const onScan = async () => {
    if (!file) return;
    setUploadError(null);
    // Navigate to scan page first (shows animation)
    navigate('/scan');
    try {
      await handleScan(file);
      // ScanPage will auto-navigate to /results when scanData appears
    } catch (err) {
      // ScanPage will auto-navigate back to /dashboard on error
    }
  };

  const removeFile = () => {
    setFile(null);
    setUploadError(null);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {uploadError && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start space-x-3">
          <AlertCircle className="h-5 w-5 mt-0.5 shrink-0" />
          <p className="text-sm">{uploadError}</p>
        </div>
      )}
      
      {!file ? (
        <div 
          {...getRootProps()} 
          className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all duration-200 ${
            isDragActive 
              ? 'border-emerald-500 bg-emerald-50' 
              : 'border-slate-300 hover:border-emerald-400 hover:bg-slate-50 bg-white'
          }`}
        >
          <input {...getInputProps()} />
          <UploadCloud className={`h-16 w-16 mx-auto mb-4 ${isDragActive ? 'text-emerald-500' : 'text-slate-400'}`} />
          <h3 className="text-xl font-semibold text-slate-800 mb-2">
            {isDragActive ? 'Drop file here' : 'Drop your document here'}
          </h3>
          <p className="text-slate-500 mb-6">or <span className="text-emerald-600 font-medium cursor-pointer">Browse Files</span></p>
          
          <div className="flex flex-wrap justify-center gap-2 mb-4">
            {['PDF', 'DOCX', 'XLSX', 'CSV', 'JPG', 'PNG', 'TXT'].map(ext => (
              <span key={ext} className="px-2.5 py-1 bg-slate-100 text-slate-600 text-xs rounded-md font-medium">{ext}</span>
            ))}
          </div>
          <p className="text-xs text-slate-400">Maximum 10 MB</p>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6 pb-6 border-b border-slate-100">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-emerald-100 text-emerald-600 rounded-lg">
                <File className="h-8 w-8" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-800 truncate max-w-[200px] sm:max-w-xs">{file.name}</h4>
                <p className="text-sm text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            </div>
            <button 
              onClick={removeFile}
              className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition"
              title="Remove file"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <button
            onClick={onScan}
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 rounded-lg shadow-sm transition flex justify-center items-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Processing...
              </>
            ) : (
              'Scan Document Now'
            )}
          </button>
        </div>
      )}
    </div>
  );
}
