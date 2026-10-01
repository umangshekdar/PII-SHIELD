import { createContext, useState, useContext } from 'react';

const ScanContext = createContext();

export const useScanContext = () => useContext(ScanContext);

export const ScanProvider = ({ children }) => {
  const [scanData, setScanData] = useState(null);
  const [redactionData, setRedactionData] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState(null);

  const resetScan = () => {
    setScanData(null);
    setRedactionData(null);
    setSelectedFile(null);
    setError(null);
  };

  return (
    <ScanContext.Provider value={{
      scanData, setScanData,
      redactionData, setRedactionData,
      selectedFile, setSelectedFile,
      error, setError,
      resetScan
    }}>
      {children}
    </ScanContext.Provider>
  );
};
