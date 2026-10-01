import { Link } from 'react-router-dom';
import Shield from '../common/Shield';

export default function Footer() {
  return (
    <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <Shield className="h-6 w-6 text-emerald-500" />
              <span className="font-bold text-lg text-white tracking-tight">PII Shield</span>
            </Link>
            <p className="text-sm max-w-md">
              Protecting sensitive data before it is shared. PII Shield is a privacy inspection layer that identifies and redacts government IDs, financial information, and other high-risk personal data.
            </p>
          </div>
          <div>
            <h3 className="text-white font-medium mb-4">Product</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/dashboard" className="hover:text-emerald-400 transition">Scanner</Link></li>
              <li><Link to="/how-it-works" className="hover:text-emerald-400 transition">How it Works</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-medium mb-4">Company</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about" className="hover:text-emerald-400 transition">About</Link></li>
              <li><Link to="/privacy" className="hover:text-emerald-400 transition">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-xs">
          <p>&copy; {new Date().getFullYear()} PII Shield. All rights reserved.</p>
          <p className="mt-2 md:mt-0">🔒 Documents are processed temporarily.</p>
        </div>
      </div>
    </footer>
  );
}
