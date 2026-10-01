import { Shield, EyeOff, Trash2, SlidersHorizontal } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-slate-900 mb-6">Privacy by Design</h1>
        <p className="text-xl text-slate-600 mb-12">We built PII Shield with the core philosophy that your data belongs to you, and less data shared is always better.</p>
        
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <Trash2 className="h-8 w-8 text-emerald-600 mb-4" />
            <h3 className="text-lg font-bold text-slate-800 mb-2">Temporary Processing</h3>
            <p className="text-slate-600 text-sm leading-relaxed">Documents are only held in memory or temporary storage for the duration of the scan and redaction process. They are securely deleted immediately after.</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <EyeOff className="h-8 w-8 text-emerald-600 mb-4" />
            <h3 className="text-lg font-bold text-slate-800 mb-2">No Permanent Storage</h3>
            <p className="text-slate-600 text-sm leading-relaxed">We do not maintain a database of your documents, the extracted text, or the PII we detect. Once your session ends, the data is gone.</p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <SlidersHorizontal className="h-8 w-8 text-emerald-600 mb-4" />
            <h3 className="text-lg font-bold text-slate-800 mb-2">User Control</h3>
            <p className="text-slate-600 text-sm leading-relaxed">We suggest what to redact based on risk levels, but you have the final say. You can uncheck items that need to remain visible for a specific use case.</p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <Shield className="h-8 w-8 text-emerald-600 mb-4" />
            <h3 className="text-lg font-bold text-slate-800 mb-2">Data Minimization</h3>
            <p className="text-slate-600 text-sm leading-relaxed">By helping you redact unneeded sensitive information before sharing, we help enforce the privacy principle of data minimization across the internet.</p>
          </div>
        </div>

        <div className="bg-slate-900 text-white p-8 rounded-2xl">
          <h2 className="text-2xl font-bold mb-4">Our Commitment</h2>
          <p className="text-slate-300 leading-relaxed">
            PII Shield is designed to be a tool that protects you, not a service that productizes you. 
            We do not sell data, we do not train models on your personal documents, and we do not track the 
            specific sensitive identifiers that pass through our system.
          </p>
        </div>
      </div>
    </div>
  );
}
