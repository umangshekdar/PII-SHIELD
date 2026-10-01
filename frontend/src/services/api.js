import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 60000,
});

export const scanDocument = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await api.post('/scan', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const scanDemo = async () => {
  const response = await api.post('/demo');
  return response.data;
};

export const redactDocument = async (scanId, redactionIds) => {
  const response = await api.post('/redact', {
    scan_id: scanId,
    redaction_ids: redactionIds,
  });
  return response.data;
};

export const downloadDocument = async (scanId, filename) => {
  const response = await api.get(`/download/${scanId}`, {
    params: { filename },
    responseType: 'blob',
  });
  return response;
};

export const healthCheck = async () => {
  const response = await api.get('/health');
  return response.data;
};
