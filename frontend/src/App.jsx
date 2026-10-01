import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import ScanPage from './pages/ScanPage';
import ResultsPage from './pages/ResultsPage';
import RedactionPage from './pages/RedactionPage';
import HowItWorks from './pages/HowItWorks';
import PrivacyPage from './pages/PrivacyPage';
import AboutPage from './pages/AboutPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<LandingPage />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="scan" element={<ScanPage />} />
          <Route path="results" element={<ResultsPage />} />
          <Route path="redaction" element={<RedactionPage />} />
          <Route path="how-it-works" element={<HowItWorks />} />
          <Route path="privacy" element={<PrivacyPage />} />
          <Route path="about" element={<AboutPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
