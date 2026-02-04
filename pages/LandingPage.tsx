
import React from 'react';
import AnimatedButton from '../components/AnimatedButton';

interface LandingPageProps {
  onStart: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  return (
    <div className="w-full bg-transparent">
      <div className="pt-48 pb-24 px-6 max-w-6xl mx-auto text-center">
        <h1 className="text-6xl md:text-8xl font-bold tracking-tight text-[#37352F] mb-6 leading-[1.1]">
          Editorial quality, <br /><span className="text-gray-600">automated.</span>
        </h1>
        <p className="text-xl text-gray-700 max-w-2xl mx-auto mb-10 leading-relaxed">
          Evaluate content against custom brand rubrics and journalistic benchmarks. 
          Audit your blogs, PR drafts, and AI-generated copy in seconds.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <AnimatedButton 
            onClick={onStart}
            className="w-full sm:w-auto px-10 py-4 rounded-2xl text-lg font-bold"
          >
            Start Analyzing Blog
          </AnimatedButton>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mb-32">
        <div className="grid md:grid-cols-3 gap-8 relative z-10">
          
          {/* Tone Alignment Box */}
          <div className="bg-[#dee2e6] backdrop-blur-xl rounded-[32px] p-10 border border-gray-300 shadow-[0_4px_20px_rgba(0,0,0,0.05),_inset_0_2px_10px_rgba(0,0,0,0.05)] transition-all duration-200 hover:shadow-xl hover:-translate-y-1 flex flex-col items-start text-left group">
            <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center mb-8 transition-colors group-hover:bg-gray-50">
              <svg className="w-5 h-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-[#37352F] mb-4">Tone Alignment</h3>
            <p className="text-gray-700 leading-relaxed text-[15px]">
              Ensure every piece of content matches your brand's unique stylistic fingerprint perfectly.
            </p>
          </div>

          {/* Rubric Scoring Box */}
          <div className="bg-[#dee2e6] backdrop-blur-xl rounded-[32px] p-10 border border-gray-300 shadow-[0_4px_20px_rgba(0,0,0,0.05),_inset_0_2px_10px_rgba(0,0,0,0.05)] transition-all duration-200 hover:shadow-xl hover:-translate-y-1 flex flex-col items-start text-left group">
            <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center mb-8 transition-colors group-hover:bg-gray-50">
              <svg className="w-5 h-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-[#37352F] mb-4">Rubric Scoring</h3>
            <p className="text-gray-700 leading-relaxed text-[15px]">
              Objective metrics for clarity, engagement, and structural integrity based on journalistic standards.
            </p>
          </div>

          {/* AI Flagging Box */}
          <div className="bg-[#dee2e6] backdrop-blur-xl rounded-[32px] p-10 border border-gray-300 shadow-[0_4px_20px_rgba(0,0,0,0.05),_inset_0_2px_10px_rgba(0,0,0,0.05)] transition-all duration-200 hover:shadow-xl hover:-translate-y-1 flex flex-col items-start text-left group">
            <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center mb-8 transition-colors group-hover:bg-gray-50">
              <svg className="w-5 h-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-[#37352F] mb-4">AI Flagging</h3>
            <p className="text-gray-700 leading-relaxed text-[15px]">
              Instant detection of repetitive patterns, hallucinated tones, and robotic syntax in your copy.
            </p>
          </div>

        </div>
      </div>
      
      <footer className="border-t border-gray-100 py-12 text-center text-sm text-gray-400">
        
      </footer>
    </div>
  );
};

export default LandingPage;
