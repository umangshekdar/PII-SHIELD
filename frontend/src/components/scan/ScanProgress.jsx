import { motion } from 'framer-motion';
import { CheckCircle2, Circle } from 'lucide-react';
import { useEffect, useState } from 'react';

const steps = [
  "File received",
  "Extracting text",
  "Processing document",
  "Detecting sensitive information",
  "Classifying PII",
  "Calculating privacy risk"
];

export default function ScanProgress() {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev < steps.length - 1) return prev + 1;
        clearInterval(interval);
        return prev;
      });
    }, 800); // Fake progress timing
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-md mx-auto mt-8 bg-white p-6 rounded-xl shadow-sm border border-slate-100">
      <div className="space-y-4">
        {steps.map((step, idx) => {
          const isCompleted = idx < currentStep;
          const isActive = idx === currentStep;
          
          return (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.2 }}
              className={`flex items-center space-x-4 ${isActive ? 'text-emerald-600 font-medium' : isCompleted ? 'text-slate-800' : 'text-slate-400'}`}
            >
              {isCompleted ? (
                <CheckCircle2 className="h-6 w-6 text-emerald-500" />
              ) : isActive ? (
                <div className="h-6 w-6 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
              ) : (
                <Circle className="h-6 w-6 text-slate-200" />
              )}
              <span className="text-sm md:text-base">{step}</span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
