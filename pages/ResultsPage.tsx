import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Severity, EvaluationResult } from '../types';
import { useEvaluation } from '../EvaluationContext';
import MetricCard from '../components/MetricCard';
import GaugeChart from '../components/GaugeChart';
import { motion, AnimatePresence } from 'framer-motion';
import AILikelihoodCard from '../components/AILikelihoodCard';

const ResultsPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  // Context provides the evaluation result
  const { result, input, reset } = useEvaluation();

  const [expandedSuggestion, setExpandedSuggestion] = React.useState<string | null>(null);
  const [isDownloading, setIsDownloading] = React.useState(false);
  const [showFullReport, setShowFullReport] = React.useState(false);
  const [focusedMetric, setFocusedMetric] = React.useState<string | null>(null);
  const [highZMetric, setHighZMetric] = React.useState<string | null>(null);
  const reportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!result || !input) {
      navigate('/wizard', { replace: true });
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleMetricClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [input, navigate, result]);

  const handleMetricClick = (name: string) => {
    setHighZMetric(name);
    setFocusedMetric(focusedMetric === name ? null : name);
  };

  const handleMetricClose = () => {
    setFocusedMetric(null);
    // Keep z-index high during the closing animation (600ms)
    setTimeout(() => {
      setHighZMetric(null);
    }, 600);
  };

  if (!result || !input) {
    return null;
  }

  const handleDownloadReport = async () => {
    if (!reportRef.current) return;

    setIsDownloading(true);

    try {
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [canvas.width, canvas.height],
      });

      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save('blog-evaluation-report.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  const radarData = [
    { metric: 'Instructions', value: result.instructionFollowing, fullMark: 100 },
    { metric: 'Accuracy', value: result.factualAccuracy, fullMark: 100 },
    { metric: 'Relevance', value: result.relevance, fullMark: 100 },
    { metric: 'Completeness', value: result.completeness, fullMark: 100 },
    { metric: 'Style & Tone', value: result.writingStyleTone, fullMark: 100 },
    { metric: 'Clarity', value: result.clarity, fullMark: 100 },
    { metric: 'Context', value: result.contextAwareness, fullMark: 100 },
    { metric: 'Safety', value: result.safety, fullMark: 100 },
  ];

  // Compute strong areas and needs improvement from the 8 scores
  const allScores = [
    { name: 'Instruction Following', score: result.instructionFollowing },
    { name: 'Factual Accuracy', score: result.factualAccuracy },
    { name: 'Relevance', score: result.relevance },
    { name: 'Completeness', score: result.completeness },
    { name: 'Writing Style & Tone', score: result.writingStyleTone },
    { name: 'Clarity', score: result.clarity },
    { name: 'Context Awareness', score: result.contextAwareness },
    { name: 'Safety', score: result.safety },
  ];
  const strongAreas = allScores.filter(s => s.score >= 80);
  const needsImprovement = allScores.filter(s => s.score < 70);

  const pieData = [
    { name: 'Score', value: result.overallScore },
    { name: 'Remaining', value: 100 - result.overallScore },
  ];

  const COLORS = ['#1F2937', '#E5E7EB'];

  // Metric to category mapping
  const METRIC_CATEGORIES: Record<string, string> = {
    "Instruction Following": "instruction_following",
    "Factual Accuracy": "factual_accuracy",
    "Relevance": "relevance",
    "Completeness": "completeness",
    "Writing Style & Tone": "style_tone",
    "Clarity": "clarity",
    "Context Awareness": "context_awareness",
    "Safety": "safety"
  };



  const getPriorityColor = (priority: Severity | string) => {
    const p = typeof priority === 'string' ? priority.toUpperCase() : priority;
    switch (p) {
      case Severity.HIGH:
      case 'HIGH':
        return 'border-l-red-500 bg-red-50/50';
      case Severity.MEDIUM:
      case 'MEDIUM':
        return 'border-l-amber-500 bg-amber-50/50';
      case Severity.LOW:
      case 'LOW':
        return 'border-l-emerald-500 bg-emerald-50/50';
      default:
        return 'border-l-gray-500 bg-gray-50/50';
    }
  };

  const getPriorityBadge = (priority: Severity | string) => {
    const p = typeof priority === 'string' ? priority.toUpperCase() : priority;
    switch (p) {
      case Severity.HIGH:
      case 'HIGH':
        return 'bg-red-100 text-red-700';
      case Severity.MEDIUM:
      case 'MEDIUM':
        return 'bg-amber-100 text-amber-700';
      case Severity.LOW:
      case 'LOW':
        return 'bg-emerald-100 text-emerald-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-12 px-6 bg-gradient-to-b from-gray-50 to-white">
      <div ref={reportRef} className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Evaluation Results
            </h1>
            <p className="text-gray-600">
              Analysis completed for your content
            </p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={handleDownloadReport}
              disabled={isDownloading}
              className="
                px-6 py-3 rounded-2xl
                bg-white text-black font-semibold
                border border-gray-200
                hover:bg-gray-50
                shadow-lg hover:shadow-xl
                transition-all duration-200
                hover:-translate-y-0.5
                disabled:opacity-50 disabled:cursor-not-allowed
                flex items-center gap-2
              "
            >
              {isDownloading ? (
                <>
                  <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Generating...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Download Report
                </>
              )}
            </button>
            <button
              onClick={() => {
                reset();
                navigate('/wizard');
              }}
              className="
                px-6 py-3 rounded-2xl
                bg-black text-white font-semibold
                shadow-lg hover:shadow-xl
                transition-all duration-200
                hover:-translate-y-0.5 active:translate-y-0
              "
            >
              New Analysis
            </button>
          </div>
        </div>

        {/* Overall Score Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Main Score Card */}
          <div className="
            bg-white 
            border border-gray-200 
            shadow-[0_4px_20px_rgba(0,0,0,0.1),_0_8px_40px_rgba(0,0,0,0.06)]
            rounded-3xl
            p-8
          ">
            <div className="flex items-start gap-8 h-full">
              {/* Score Circle */}
              <div className="flex-shrink-0">
                <div className="relative">
                  <ResponsiveContainer width={160} height={160}>
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={75}
                        startAngle={90}
                        endAngle={-270}
                        dataKey="value"
                        strokeWidth={0}
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index]} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <span className="text-4xl font-bold text-gray-900">{result.overallScore}</span>
                      <span className="block text-sm text-gray-500">Overall</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Summary */}
              <div className="flex-1 flex flex-col justify-center">
                <h2 className="text-xl font-bold text-gray-900 mb-2">Summary</h2>
                <p className="text-gray-600 leading-relaxed mb-4 text-sm">
                  {result.summary}
                </p>
                <div className="flex flex-wrap gap-3 mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <span className="text-sm text-gray-600">Strong areas: {strongAreas.length}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                    <span className="text-sm text-gray-600">Needs improvement: {needsImprovement.length}</span>
                  </div>
                </div>
                <button
                  onClick={() => setShowFullReport(true)}
                  className="
                    px-4 py-2 rounded-xl
                    bg-gray-100 text-gray-700 font-medium text-sm
                    hover:bg-gray-200
                    transition-all duration-200
                    flex items-center gap-2
                    w-fit
                  "
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  View Full Report
                </button>
              </div>
            </div>
          </div>

          {/* AI Likelihood Card (Takes 2nd column) */}
          <div className="h-full">
            <AILikelihoodCard
              score={result.aiLikelihood}
              classification={
                result.aiDetectionDetails?.classification ||
                (result.aiLikelihood <= 20 ? 'Definitely AI' :
                  result.aiLikelihood <= 40 ? 'Likely AI' :
                    result.aiLikelihood <= 70 ? 'Likely human-written' : 'Definitely human')
              }
              summary={"Analysis of content patterns indicates likelihood of AI generation."}
              strongAreasCount={result.improvements.filter(i => i.priority === 'low').length}
              needsImprovementCount={result.improvements.length}
            />
          </div>
        </div>

        {/* Metrics Grid Area */}
        <div className="mb-20 relative">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Evaluation Metrics</h2>
          </div>

          <div className="relative">
            {/* The Unified Grid/Takeover Container */}
            <motion.div
              className={`
              grid items-start content-start gap-8
              ${focusedMetric ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'}
            `}>
              {allScores.map((metric, idx) => {
                const isFocused = focusedMetric === metric.name;
                const isSuppressed = focusedMetric && !isFocused;

                if (isSuppressed) return null;

                return (
                  <motion.div
                    layout
                    key={metric.name}
                    className={`relative w-full ${isFocused || highZMetric === metric.name ? 'z-50' : 'z-0'}`}
                  >
                    <MetricCard
                      title={metric.name}
                      score={metric.score}
                      description={
                        metric.name === "Instruction Following" ? "How well the content follows the given instructions and criteria." :
                          metric.name === "Factual Accuracy" ? "Measures how well claims are supported by verifiable facts and data." :
                            metric.name === "Relevance" ? "How relevant the content is to the given topic and context." :
                              metric.name === "Completeness" ? "Whether all required topics and aspects are adequately covered." :
                                metric.name === "Writing Style & Tone" ? "Alignment with the intended voice, style, and tone guidelines." :
                                  metric.name === "Clarity" ? "Overall readability, organization, and logical flow of content." :
                                    metric.name === "Context Awareness" ? "Understanding and appropriate use of contextual information." :
                                      "Content is safe, appropriate, and free from harmful elements."
                      }
                      variant={(metric.name === "Factual Accuracy" || metric.name === "Completeness" || metric.name === "Clarity" || metric.name === "Safety") ? "progress" : "gauge"}
                      onClick={() => handleMetricClick(metric.name)}
                      onClose={handleMetricClose}
                      isExpanded={isFocused}
                      isSuppressed={isSuppressed}
                      improvements={result.improvements?.filter(imp => imp.category === METRIC_CATEGORIES[metric.name])}
                      icon={
                        metric.name === "Instruction Following" ? (
                          <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                          </svg>
                        ) : metric.name === "Factual Accuracy" ? (
                          <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        ) : metric.name === "Relevance" ? (
                          <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                        ) : metric.name === "Completeness" ? (
                          <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                          </svg>
                        ) : metric.name === "Writing Style & Tone" ? (
                          <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                          </svg>
                        ) : metric.name === "Clarity" ? (
                          <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 6h16M4 12h16M4 18h7" />
                          </svg>
                        ) : metric.name === "Context Awareness" ? (
                          <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                          </svg>
                        ) : (
                          <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                          </svg>
                        )
                      }
                    />
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </div>

        {/* Radar Chart */}
        <div className="
          bg-white 
          border border-gray-200 
          shadow-[0_4px_20px_rgba(0,0,0,0.1),_0_8px_40px_rgba(0,0,0,0.06)]
          rounded-3xl
          p-8
          mb-8
        ">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Performance Overview</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="#E5E7EB" />
                <PolarAngleAxis
                  dataKey="metric"
                  tick={{ fill: '#6B7280', fontSize: 12 }}
                />
                <Radar
                  name="Score"
                  dataKey="value"
                  stroke="#1F2937"
                  fill="#1F2937"
                  fillOpacity={0.2}
                  strokeWidth={2}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #E5E7EB',
                    borderRadius: '12px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Suggestions Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Improvement Suggestions</h2>
          <div className="space-y-4">
            {result.suggestions.map((suggestion) => (
              <div
                key={suggestion.id}
                className={`
                  rounded-2xl border-l-4 overflow-hidden
                  transition-all duration-300
                  ${getPriorityColor(suggestion.priority)}
                `}
              >
                <button
                  onClick={() => setExpandedSuggestion(
                    expandedSuggestion === suggestion.id ? null : suggestion.id
                  )}
                  className="w-full p-6 flex items-center justify-between text-left"
                >
                  <div className="flex items-center gap-4">
                    <span className={`
                      px-3 py-1 rounded-full text-xs font-bold uppercase
                      ${getPriorityBadge(suggestion.priority)}
                    `}>
                      {suggestion.priority}
                    </span>
                    <h3 className="font-semibold text-gray-900">{suggestion.title}</h3>
                  </div>
                  <svg
                    className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${expandedSuggestion === suggestion.id ? 'rotate-180' : ''
                      }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {expandedSuggestion === suggestion.id && (
                  <div className="px-6 pb-6">
                    <p className="text-gray-600 mb-4">{suggestion.description}</p>
                    {suggestion.actionItems && suggestion.actionItems.length > 0 && (
                      <div className="bg-white/50 rounded-xl p-4">
                        <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">
                          Action Items
                        </p>
                        <ul className="space-y-2">
                          {suggestion.actionItems.map((item, index) => (
                            <li key={index} className="flex items-start gap-3">
                              <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <span className="text-xs font-semibold text-gray-600">{index + 1}</span>
                              </div>
                              <span className="text-sm text-gray-700">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Input Summary */}
        <div className="
          bg-gray-50 
          rounded-3xl
          p-8
        ">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Analysis Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
                Content Length
              </p>
              <p className="text-gray-900">{input?.blogText?.length?.toLocaleString() || 0} characters</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
                Target Audience
              </p>
              <p className="text-gray-900">{input?.targetAudience || 'Not specified'}</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
                Tone Reference
              </p>
              <p className="text-gray-900">
                {input?.toneOfVoice?.type === 'file'
                  ? input.toneOfVoice.fileName
                  : 'Text input provided'
                }
              </p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
                References
              </p>
              <p className="text-gray-900">
                {input?.references && input.references.length > 0
                  ? `${input.references.length} reference${input.references.length > 1 ? 's' : ''} provided`
                  : 'Not provided'
                }
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Full Report Modal */}
      {
        showFullReport && (
          <div className="fixed inset-0 bg-black/30 z-50 flex items-start justify-center p-4 pt-24 overflow-y-auto backdrop-blur-sm">
            <div className="bg-white rounded-3xl max-w-xl w-full max-h-[85vh] overflow-y-auto shadow-2xl transition-all duration-300 transform scale-100">
              {/* Modal Header */}
              <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Full Evaluation Report</h2>
                <button
                  onClick={() => setShowFullReport(false)}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="p-8 space-y-8">
                {/* Overall Score Summary */}
                <div className="bg-gradient-to-r from-gray-900 to-gray-700 rounded-2xl p-6 text-white">
                  <div className="flex items-center gap-6">
                    <div className="text-6xl font-bold">{result.overallScore}</div>
                    <div>
                      <h3 className="text-xl font-semibold mb-1">Overall Score</h3>
                      <p className="text-gray-300">{result.summary}</p>
                    </div>
                  </div>
                </div>

                {/* Strengths Section */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-emerald-500" />
                    Strong Areas ({strongAreas.length})
                  </h3>
                  {strongAreas.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {strongAreas.map((area, i) => (
                        <div key={i} className="flex items-center justify-between bg-emerald-50 rounded-xl p-4">
                          <span className="font-medium text-emerald-800">{area.name}</span>
                          <span className="text-emerald-600 font-bold">{area.score}%</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 italic">No areas scored 80% or above.</p>
                  )}
                </div>

                {/* Needs Improvement Section */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-amber-500" />
                    Areas Needing Improvement ({needsImprovement.length})
                  </h3>
                  {needsImprovement.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {needsImprovement.map((area, i) => (
                        <div key={i} className="flex items-center justify-between bg-amber-50 rounded-xl p-4">
                          <span className="font-medium text-amber-800">{area.name}</span>
                          <span className="text-amber-600 font-bold">{area.score}%</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 italic">All areas scored 70% or above. Great job!</p>
                  )}
                </div>

                {/* AI Detection Analysis */}
                <div className="bg-gray-900 rounded-2xl p-6 text-white">
                  <h3 className="text-lg font-bold mb-4">AI Detection Analysis</h3>
                  <div className="flex items-center gap-6 mb-4">
                    <div className="text-5xl font-bold">{result.aiLikelihood}%</div>
                    <div>
                      <p className="text-xl font-semibold">
                        {result.aiDetectionDetails?.classification ||
                          (result.aiLikelihood <= 20 ? 'Definitely AI' :
                            result.aiLikelihood <= 40 ? 'Likely AI' :
                              result.aiLikelihood <= 70 ? 'Likely human-written' : 'Definitely human')}
                      </p>
                      <p className="text-gray-400 text-sm">Human-likeness score (higher = more human)</p>
                    </div>
                  </div>
                  {result.aiDetectionDetails?.reasoning && (
                    <div className="bg-gray-800 rounded-xl p-4 mt-4">
                      <p className="text-sm font-medium text-gray-300 mb-2">Analysis Reasoning:</p>
                      <p className="text-gray-100">{result.aiDetectionDetails.reasoning}</p>
                    </div>
                  )}
                  {result.aiDetectionDetails?.linguisticMarkers && result.aiDetectionDetails.linguisticMarkers.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm font-medium text-gray-300 mb-2">Linguistic Markers Detected:</p>
                      <div className="flex flex-wrap gap-2">
                        {result.aiDetectionDetails.linguisticMarkers.map((marker, i) => (
                          <span key={i} className="bg-gray-700 text-gray-200 px-3 py-1 rounded-full text-sm">
                            {marker}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Improvement Suggestions */}
                {result.improvements && result.improvements.length > 0 && (
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Improvement Recommendations</h3>
                    <div className="space-y-3">
                      {result.improvements.map((imp, i) => (
                        <div key={i} className={`rounded-xl p-4 border-l-4 ${getPriorityColor(imp.priority)}`}>
                          <div className="flex items-center gap-2 mb-2">
                            <span className={`px-2 py-0.5 rounded-full text-xs font-bold uppercase ${getPriorityBadge(imp.priority)}`}>
                              {imp.priority}
                            </span>
                            <span className="font-semibold text-gray-900 capitalize">{imp.category.replace(/_/g, ' ')}</span>
                          </div>
                          <p className="text-gray-700 mb-2">{imp.suggestion}</p>
                          <p className="text-sm text-gray-500 italic">{imp.impact}</p>
                          {imp.action_items && imp.action_items.length > 0 && (
                            <ul className="mt-2 space-y-1">
                              {imp.action_items.map((item, j) => (
                                <li key={j} className="text-sm text-gray-600 flex items-start gap-2">
                                  <span className="text-gray-400">•</span>
                                  {item}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Suggested Changes (simple list) */}
                {result.suggestedChanges && result.suggestedChanges.length > 0 && (
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Fixes</h3>
                    <ul className="space-y-2">
                      {result.suggestedChanges.map((change, i) => (
                        <li key={i} className="flex items-start gap-3 bg-blue-50 rounded-xl p-4">
                          <span className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                            <span className="text-xs font-bold text-blue-600">{i + 1}</span>
                          </span>
                          <span className="text-gray-700">{change}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Metadata */}
                {result.metadata && (
                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Evaluation Metadata</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Word Count</p>
                        <p className="font-semibold text-gray-900">{result.metadata.wordCount?.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Reading Time</p>
                        <p className="font-semibold text-gray-900">{result.metadata.estimatedReadingTime}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Processing Time</p>
                        <p className="font-semibold text-gray-900">{result.metadata.processingTime?.toFixed(2)}s</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Paragraphs</p>
                        <p className="font-semibold text-gray-900">{result.metadata.paragraphCount}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="sticky bottom-0 bg-white border-t border-gray-200 px-8 py-4">
                <button
                  onClick={() => setShowFullReport(false)}
                  className="w-full px-6 py-3 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition-colors"
                >
                  Close Report
                </button>
              </div>
            </div>
          </div>
        )
      }
    </div >
  );
};

export default ResultsPage;
