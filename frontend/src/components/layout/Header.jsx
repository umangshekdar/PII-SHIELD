import { Link } from 'react-router-dom';
import Shield from '../common/Shield';

export default function Header() {
  return (
    <header className="bg-slate-900 text-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-emerald-500" />
            <span className="font-bold text-xl tracking-tight">PII Shield</span>
          </Link>
          <nav className="hidden md:flex space-x-8">
            <Link to="/how-it-works" className="text-slate-300 hover:text-white transition">How it Works</Link>
            <Link to="/privacy" className="text-slate-300 hover:text-white transition">Privacy</Link>
            <Link to="/about" className="text-slate-300 hover:text-white transition">About</Link>
          </nav>
          <div className="flex items-center space-x-4">
            <Link to="/dashboard" className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-md font-medium transition shadow-sm">
              Scan Document
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
