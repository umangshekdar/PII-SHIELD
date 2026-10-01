import { AlertCircle } from 'lucide-react';

export default function ErrorMessage({ message }) {
  if (!message) return null;
  return (
    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start space-x-3">
      <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
      <p>{message}</p>
    </div>
  );
}
