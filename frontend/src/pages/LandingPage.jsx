import { Link } from 'react-router-dom';
import Shield from '../components/common/Shield';
import DemoButton from '../components/upload/DemoButton';
import { ShieldCheck, Lock, FileSearch, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-slate-900 text-white pt-20 pb-32 px-4 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-[30%] -right-[10%] w-[70%] h-[70%] rounded-full bg-emerald-900/20 blur-3xl" />
          <div className="absolute -bottom-[20%] -left-[10%] w-[60%] h-[60%] rounded-full bg-slate-800/50 blur-3xl" />
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex justify-center mb-6"
          >
            <div className="p-4 bg-slate-800/50 rounded-2xl border border-slate-700 backdrop-blur-sm">
              <Shield className="h-16 w-16 text-emerald-400" />
            </div>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold tracking-tight mb-6 max-w-4xl mx-auto"
          >
            Protect Sensitive Data <br className="hidden md:block"/> Before You Share.
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-slate-300 max-w-2xl mx-auto mb-10"
          >
            Scan documents for sensitive government IDs, financial information and other high-risk PII before sharing them.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4"
          >
            <Link 
              to="/dashboard" 
              className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all shadow-[0_0_15px_rgba(16,185,129,0.4)] hover:shadow-[0_0_25px_rgba(16,185,129,0.6)] flex items-center w-full sm:w-auto justify-center"
            >
              Scan a Document
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <div className="w-full sm:w-auto">
              <DemoButton variant="secondary" />
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="mt-12 flex items-center justify-center text-sm text-slate-400 font-medium"
          >
            <Lock className="h-4 w-4 mr-2 text-emerald-500" />
            🔒 Temporary processing • No permanent document storage
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-slate-50 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Privacy By Design</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">PII Shield acts as an inspection layer, ensuring you never accidentally share highly sensitive information.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition">
              <div className="h-12 w-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-6">
                <FileSearch className="h-6 w-6 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-800">Intelligent Detection</h3>
              <p className="text-slate-600 leading-relaxed">Automatically identifies Aadhaar, PAN, SSN, credit cards, and other sensitive patterns in your documents.</p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition">
              <div className="h-12 w-12 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                <ShieldCheck className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-800">Selective Redaction</h3>
              <p className="text-slate-600 leading-relaxed">You control what gets redacted. Review detected information and choose exactly what to hide before sharing.</p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition">
              <div className="h-12 w-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-6">
                <Lock className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-800">Zero Retention</h3>
              <p className="text-slate-600 leading-relaxed">Documents are processed in memory and immediately deleted. We never store your files or data permanently.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
