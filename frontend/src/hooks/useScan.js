import { useState } from 'react';
import { scanDocument, scanDemo, redactDocument, downloadDocument } from '../services/api';
import { useScanContext } from '../context/ScanContext';

export const useScan = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { setScanData, setRedactionData, setSelectedFile, setError: setContextError } = useScanContext();

  const handleScan = async (file) => {
    setLoading(true);
    setError(null);
    try {
      setSelectedFile(file);
      const data = await scanDocument(file);
      setScanData(data);
      return data;
    } catch (err) {
      const msg = err.response?.data?.detail || err.message || 'Error scanning document';
      setError(msg);
      setContextError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleDemo = async () => {
    setLoading(true);
    setError(null);
    try {
      setSelectedFile({ name: 'demo_employee_kyc.txt' });
      const data = await scanDemo();
      setScanData(data);
      return data;
    } catch (err) {
      const msg = err.response?.data?.detail || err.message || 'Error running demo';
      setError(msg);
      setContextError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleRedact = async (scanId, redactionIds) => {
    setLoading(true);
    setError(null);
    try {
      const data = await redactDocument(scanId, redactionIds);
      setRedactionData(data);
      return data;
    } catch (err) {
      const msg = err.response?.data?.detail || err.message || 'Error redacting document';
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (scanId, outputFilename) => {
    setLoading(true);
    setError(null);
    try {
      const response = await downloadDocument(scanId, outputFilename);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', outputFilename || 'PIISafe_document');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(err.message || 'Error downloading document');
    } finally {
      setLoading(false);
    }
  };

  return { handleScan, handleDemo, handleRedact, handleDownload, loading, error };
};
