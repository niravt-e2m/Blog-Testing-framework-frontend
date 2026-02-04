
import React from 'react';
import { BrowserRouter, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import ResultsPage from './pages/ResultsPage';
import PricingPage from './pages/PricingPage';
import AboutPage from './pages/AboutPage';
import Background3D from './components/Background3D';
import InputWizard from './components/InputWizard';
import { EvaluationProvider, useEvaluation } from './EvaluationContext';

const AppLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { reset } = useEvaluation();
  const [isZooming, setIsZooming] = React.useState(false);

  const showBackground = location.pathname === '/';

  const handleStart = () => {
    setIsZooming(true);
    // Delay navigation to allow zoom animation to play
    setTimeout(() => {
      reset();
      navigate('/wizard');
      setIsZooming(false); // Reset for next time
    }, 800); // Match animation duration
  };

  return (
    <div className="h-screen w-full flex flex-col bg-white overflow-hidden relative">
      {showBackground && <Background3D isTransitioning={isZooming} />}

      {/* Fade overlay for smooth transition */}
      <div
        className={`
          fixed inset-0 bg-white pointer-events-none z-50
          transition-opacity duration-700 ease-in-out
          ${isZooming ? 'opacity-100' : 'opacity-0'}
        `}
      />

      <Navbar />

      <div className="flex-1 flex overflow-hidden relative z-10">
        <Routes>
          <Route
            path="/"
            element={
              <div className="flex-1 overflow-y-auto">
                <LandingPage onStart={handleStart} />
              </div>
            }
          />
          <Route
            path="/wizard"
            element={
              <div className="flex-1 overflow-y-auto">
                <InputWizard />
              </div>
            }
          />
          <Route
            path="/results"
            element={
              <div className="flex-1 overflow-y-auto">
                <ResultsPage />
              </div>
            }
          />
          <Route
            path="/pricing"
            element={
              <div className="flex-1 overflow-y-auto">
                <PricingPage />
              </div>
            }
          />
          <Route
            path="/about"
            element={
              <div className="flex-1 overflow-y-auto">
                <AboutPage />
              </div>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  );
};

const App: React.FC = () => (
  <EvaluationProvider>
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  </EvaluationProvider>
);

export default App;
