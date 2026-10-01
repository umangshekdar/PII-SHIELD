import { Upload, FileSearch, Fingerprint, ShieldAlert, CheckSquare, ShieldCheck, Download } from 'lucide-react';

const steps = [
  { icon: Upload, title: "1. Upload", desc: "Upload your document securely." },
  { icon: FileSearch, title: "2. Extract", desc: "Text is extracted from the document." },
  { icon: Fingerprint, title: "3. Detect", desc: "PII patterns are identified using regex and NLP." },
  { icon: ShieldAlert, title: "4. Assess", desc: "Privacy risk score is calculated based on findings." },
  { icon: CheckSquare, title: "5. Review", desc: "You review the findings and choose what to redact." },
  { icon: ShieldCheck, title: "6. Redact", desc: "Selected sensitive info is permanently masked." },
  { icon: Download, title: "7. Download", desc: "Get your safe, protected document." }
];

export default function HowItWorks() {
  return (
    <div className="min-h-screen bg-slate-50 py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-slate-900 mb-16">How PII Shield Works</h1>
        
        <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isEven = idx % 2 === 0;
            return (
              <div key={idx} className={`relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active`}>
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-emerald-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10`}>
                  <Icon className="h-4 w-4 text-white" />
                </div>
                
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-slate-200 bg-white shadow-sm">
                  <div className="flex items-center justify-between space-x-2 mb-1">
                    <div className="font-bold text-slate-900">{step.title}</div>
                  </div>
                  <div className="text-slate-600 text-sm">{step.desc}</div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-24 bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
          <h2 className="text-2xl font-bold mb-4 text-slate-800">Not a Document Wallet</h2>
          <p className="text-slate-600 leading-relaxed mb-4">
            Unlike DigiLocker or other document storage solutions, PII Shield is an <strong>inspection layer</strong>. We do not store your documents, we only clean them.
          </p>
          <p className="text-slate-600 leading-relaxed">
            Use PII Shield <em>before</em> you upload a document to a portal, send it via email, or share it with a third party that doesn't need to see your highly sensitive identifiers.
          </p>
        </div>
      </div>
    </div>
  );
}
