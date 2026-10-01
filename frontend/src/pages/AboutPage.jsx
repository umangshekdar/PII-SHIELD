export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-16 px-4">
      <div className="max-w-3xl mx-auto bg-white p-10 rounded-2xl border border-slate-200 shadow-sm">
        <h1 className="text-3xl font-bold text-slate-900 mb-6">About PII Shield</h1>
        
        <div className="prose prose-slate max-w-none">
          <p className="text-lg text-slate-600 mb-6">
            PII Shield was created to solve a common but dangerous problem: over-sharing sensitive information.
          </p>

          <h2 className="text-xl font-bold text-slate-800 mt-8 mb-4">The Problem</h2>
          <p className="text-slate-600 mb-4">
            Often, services ask for a document (like a passport or bank statement) to verify one specific piece of information (like your name or address). However, by handing over the complete document, you are also exposing highly sensitive data like your SSN, Aadhaar number, or full account numbers. If that service is breached, your most critical identifiers are compromised.
          </p>

          <h2 className="text-xl font-bold text-slate-800 mt-8 mb-4">The Solution</h2>
          <p className="text-slate-600 mb-4">
            PII Shield acts as a privacy filter. It scans your documents locally, identifies the sensitive information, and allows you to redact the data that isn't strictly necessary for the transaction. 
          </p>

          <h2 className="text-xl font-bold text-slate-800 mt-8 mb-4">Technology Stack</h2>
          <ul className="list-disc pl-5 text-slate-600 space-y-2 mb-6">
            <li><strong>Frontend:</strong> React, Vite, Tailwind CSS, Framer Motion</li>
            <li><strong>Backend:</strong> Python, FastAPI</li>
            <li><strong>Detection:</strong> spaCy NLP, custom Regex patterns, context-aware rules</li>
            <li><strong>Document Processing:</strong> PyMuPDF, python-docx, openpyxl</li>
            <li><strong>OCR:</strong> Tesseract OCR with graceful fallback</li>
          </ul>

          <div className="mt-10 p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-sm font-medium">
            Version 1.0.0 • Open Source Privacy Tool
          </div>
        </div>
      </div>
    </div>
  );
}
