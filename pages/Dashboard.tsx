
import React, { useState } from 'react';
import { AnalysisSession, Severity, EvaluationInput } from '../types';
import MetricChart from '../components/MetricChart';
import { evaluateContent } from '../services/backendService';

interface DashboardProps {
  sessions: AnalysisSession[];
  activeSessionId?: string;
  onSessionCreated: (session: AnalysisSession) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ sessions, activeSessionId, onSessionCreated }) => {
  const [content, setContent] = useState('');
  const [reference, setReference] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const activeSession = sessions.find(s => s.id === activeSessionId);

  const handleAnalyze = async () => {
    if (!content.trim()) return;
    setIsAnalyzing(true);
    setError(null);
    try {
      const input: EvaluationInput = {
        blogTitle: content.slice(0, 80) || 'Untitled',
        blogText: content,
        blogOutline: '',
        toneOfVoice: {
          type: 'text',
          content: reference.trim() || 'No specific tone guidelines provided.',
        },
        references: [],
        targetAudience: 'General audience',
      };
      const result = await evaluateContent(input);
      const newSession: AnalysisSession = {
        id: Date.now().toString(),
        timestamp: Date.now(),
        title: content.slice(0, 30) + (content.length > 30 ? '...' : ''),
        content,
        reference,
        result
      };
      onSessionCreated(newSession);
      setContent('');
      setReference('');
    } catch (err: any) {
      setError(err.message || "Failed to analyze content. Please check your API key.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getSeverityColor = (sev: Severity) => {
    switch (sev) {
      case Severity.HIGH: return 'text-red-600 bg-red-50/80 border-red-100';
      case Severity.MEDIUM: return 'text-orange-600 bg-orange-50/80 border-orange-100';
      case Severity.LOW: return 'text-blue-600 bg-blue-50/80 border-blue-100';
    }
  };

  if (activeSession) {
    const res = activeSession.result;
    return (
      <div className="h-full overflow-y-auto pt-24 pb-20 px-4 md:px-12 max-w-6xl mx-auto scroll-smooth">
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex-1">
            <h1 className="text-4xl font-bold text-[#37352F] mb-4 leading-tight">Analysis Report</h1>
            <p className="text-gray-500 mb-6 italic border-l-2 border-gray-200 pl-4">
              {new Date(activeSession.timestamp).toLocaleString()}
            </p>
          </div>
          <div className="flex gap-4">
             <div className="bg-[#dee2e6] backdrop-blur-md shadow-md p-6 rounded-2xl border border-gray-300 flex flex-col items-center transition-all duration-200 hover:shadow-lg">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Score</span>
                <span className="text-4xl font-black text-black">{res.overallScore}</span>
             </div>
             <div className="bg-[#dee2e6] backdrop-blur-md shadow-md p-6 rounded-2xl border border-gray-300 flex flex-col items-center transition-all duration-200 hover:shadow-lg">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Style & Tone</span>
                <span className="text-4xl font-black text-black">{res.writingStyleTone}</span>
             </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <section className="bg-white/90 backdrop-blur-md border border-gray-200 rounded-2xl p-8 shadow-sm transition-shadow duration-200 hover:shadow-md">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-[#37352F]">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" /></svg>
                Executive Summary
              </h3>
              <p className="text-gray-600 leading-relaxed text-lg whitespace-pre-wrap">{res.summary}</p>
            </section>

            <section className="bg-white/90 backdrop-blur-md border border-gray-200 rounded-2xl p-8 shadow-sm transition-shadow duration-200 hover:shadow-md">
              <h3 className="text-lg font-bold mb-6 text-[#37352F]">Editorial Flags</h3>
              <div className="space-y-4">
                {res.flags.map((flag, idx) => (
                  <div key={idx} className={`p-4 rounded-xl border flex gap-4 backdrop-blur-sm shadow-sm transition-all duration-200 hover:shadow-md ${getSeverityColor(flag.severity as Severity)}`}>
                    <div className="shrink-0 mt-0.5">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                    </div>
                    <div>
                      <div className="font-bold text-sm uppercase tracking-tight mb-1">{flag.type}</div>
                      <p className="text-sm opacity-90">{flag.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="bg-white/90 backdrop-blur-md border border-gray-200 rounded-2xl p-8 shadow-sm transition-shadow duration-200 hover:shadow-md">
               <h3 className="text-lg font-bold mb-6 text-[#37352F]">Suggested Improvements</h3>
               <ul className="space-y-3">
                 {res.suggestedChanges.map((suggestion, idx) => (
                   <li key={idx} className="flex gap-3 text-gray-600 text-sm transition-transform duration-200 hover:translate-x-1">
                     <span className="text-gray-300 font-mono">{(idx + 1).toString().padStart(2, '0')}</span>
                     {suggestion}
                   </li>
                 ))}
               </ul>
            </section>
          </div>

          <div className="space-y-8 pb-10">
            <section className="bg-white/90 backdrop-blur-md border border-gray-200 rounded-2xl p-6 shadow-sm transition-shadow duration-200 hover:shadow-md">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6">Rubric Breakdown</h3>
              <MetricChart metrics={res.metrics} />
              <div className="mt-6 space-y-4">
                {res.metrics.map((m, idx) => (
                  <div key={idx} className="group/metric">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-semibold text-gray-700 group-hover/metric:text-black transition-colors">{m.label}</span>
                      <span className="text-xs font-bold">{m.score}/100</span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-black rounded-full transition-all duration-1000 ease-out" 
                        style={{ width: `${m.score}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="bg-black text-white rounded-2xl p-6 shadow-xl relative group cursor-default transition-all duration-300 hover:shadow-2xl">
              <div className="relative z-10">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">AI Likelihood</h3>
                <div className="text-5xl font-black mb-2">{res.aiLikelihood}%</div>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Calculated based on burstiness, perplexity, and common LLM phrasing patterns.
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto pt-32 pb-20 px-6 max-w-4xl mx-auto w-full bg-transparent scroll-smooth">
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-[#37352F] mb-3">Audit Content</h1>
        <p className="text-gray-500">Input your draft and an optional brand reference to start evaluation.</p>
      </div>

      <div className="space-y-8 pb-10">
        <div className="group">
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Draft Content</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Paste your blog post or article here..."
            className="w-full h-80 p-6 bg-[#dee2e6] backdrop-blur-lg border border-gray-300 focus:border-gray-400 focus:bg-white rounded-2xl outline-none transition-all duration-200 resize-none text-lg leading-relaxed shadow-sm hover:shadow-md hover:-translate-y-0.5"
          />
        </div>

        <div className="group">
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Brand Reference (Optional)</label>
          <textarea
            value={reference}
            onChange={(e) => setReference(e.target.value)}
            placeholder="Paste a piece of content that represents your ideal brand voice..."
            className="w-full h-40 p-6 bg-[#dee2e6] backdrop-blur-lg border border-gray-300 focus:border-gray-400 focus:bg-white rounded-2xl outline-none transition-all duration-200 resize-none text-sm leading-relaxed shadow-sm hover:shadow-md hover:-translate-y-0.5"
          />
        </div>

        {error && (
          <div className="p-4 bg-red-50/80 backdrop-blur-sm border border-red-100 text-red-600 rounded-xl text-sm font-medium animate-shake">
            {error}
          </div>
        )}

        <button
          onClick={handleAnalyze}
          disabled={isAnalyzing || !content.trim()}
          className={`w-full py-4 rounded-2xl text-lg font-bold transition-all duration-200 flex items-center justify-center gap-3 ${
            isAnalyzing 
            ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
            : 'bg-black text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0'
          }`}
        >
          {isAnalyzing ? (
            <>
              <svg className="animate-spin h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Directing Analysis...
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
              Run Editorial Audit
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
