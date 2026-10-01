import { motion } from 'framer-motion';
import Shield from '../common/Shield';

export default function ScanAnimation() {
  return (
    <div className="relative flex items-center justify-center h-48 w-48 mx-auto">
      {/* Pulse rings */}
      <motion.div 
        animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0, 0.3] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute inset-0 bg-emerald-200 rounded-full"
      />
      <motion.div 
        animate={{ scale: [1, 1.8, 1], opacity: [0.2, 0, 0.2] }}
        transition={{ repeat: Infinity, duration: 2, delay: 0.3 }}
        className="absolute inset-0 bg-emerald-100 rounded-full"
      />
      
      {/* Scanner line */}
      <div className="absolute inset-0 overflow-hidden rounded-full">
        <motion.div
          animate={{ top: ['-20%', '120%'] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
          className="absolute left-0 right-0 h-1 bg-emerald-500 shadow-[0_0_8px_2px_rgba(16,185,129,0.5)] z-10"
        />
      </div>

      <div className="bg-slate-900 rounded-full p-8 z-20 shadow-xl border-4 border-slate-800">
        <Shield className="h-16 w-16 text-emerald-400" />
      </div>
    </div>
  );
}
