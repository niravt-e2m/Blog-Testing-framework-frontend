import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GaugeChart from './GaugeChart';
import { Improvement } from '../types';

interface MetricCardProps {
  title: string;
  score: number; // 0-100
  description: string;
  icon?: React.ReactNode;
  variant?: 'default' | 'gauge' | 'progress';
  subScores?: { label: string; score: number }[];
  onClick?: () => void;
  isExpanded?: boolean;
  isSuppressed?: boolean;
  improvements?: Improvement[];
  onClose?: () => void;
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  score,
  description,
  icon,
  variant = 'default',
  subScores,
  onClick,
  isExpanded = false,
  isSuppressed = false,
  improvements = [],
  onClose,
}) => {
  const clampedScore = Math.min(100, Math.max(0, score));
  const isInteractive = !!onClick && !isExpanded;

  const safeTitle = title.replace(/[^a-zA-Z0-9]/g, '_');
  const animationName = `fillWidth_${safeTitle}_${Math.round(clampedScore)}`;

  const getScoreColorHex = (value: number) => {
    if (value >= 80) return '#059669'; // emerald-600
    if (value >= 60) return '#D97706'; // amber-600
    if (value >= 40) return '#EA580C'; // orange-600
    return '#DC2626'; // red-600
  };

  const getBarColorHex = (value: number) => {
    if (value >= 80) return '#10B981'; // emerald-500
    if (value >= 60) return '#F59E0B'; // amber-500
    if (value >= 40) return '#F97316'; // orange-500
    return '#EF4444'; // red-500
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toUpperCase()) {
      case 'HIGH': return 'border-l-red-500 bg-red-50/50';
      case 'MEDIUM': return 'border-l-amber-500 bg-amber-50/50';
      case 'LOW': return 'border-l-emerald-500 bg-emerald-50/50';
      default: return 'border-l-gray-500 bg-gray-50/50';
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority.toUpperCase()) {
      case 'HIGH': return 'bg-red-100 text-red-700';
      case 'MEDIUM': return 'bg-amber-100 text-amber-700';
      case 'LOW': return 'bg-emerald-100 text-emerald-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <motion.div
      layout
      onClick={isInteractive ? onClick : undefined}
      initial={{ opacity: 0, scale: 0.9, y: 0 }}
      animate={{
        opacity: isSuppressed ? 0 : 1,
        scale: isSuppressed ? 0.95 : 1,
        zIndex: isExpanded ? 50 : 0,
      }}
      transition={{
        layout: { duration: 0.6, ease: [0.23, 1, 0.32, 1] },
        opacity: { duration: 0.4 },
        scale: { duration: 0.4 }
      }}
      className={`
        bg-white 
        border border-gray-200 
        shadow-[0_4px_20px_rgba(0,0,0,0.06),_0_8px_40px_rgba(0,0,0,0.04)]
        p-8
        flex flex-col
        overflow-hidden
        ${isInteractive ? 'cursor-pointer hover:shadow-[0_10px_30px_rgba(0,0,0,0.08)] transition-shadow' : ''}
        ${isExpanded ? 'rounded-[40px]' : 'rounded-[32px]'}
        ${isExpanded ? 'h-full' : ''}
      `}
      style={{
        borderRadius: isExpanded ? '40px' : '32px',
      }}
    >
      {/* Close Button Header (Only when expanded) */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex justify-end mb-4 absolute top-8 right-8 z-20"
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClose?.();
              }}
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className={`flex ${isExpanded ? 'flex-col lg:flex-row' : 'flex-col'} gap-10 ${isExpanded ? 'h-full' : ''} relative`}>
        {/* Left Side / Main Card Content */}
        <motion.div layout className={`${isExpanded ? 'lg:w-1/3' : 'w-full'} flex flex-col relative z-10 bg-white`}>
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              {icon && (
                <motion.div
                  layout="position"
                  className={`${isExpanded ? 'w-10 h-10' : 'w-8 h-8'} rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 transition-all border border-gray-100/50`}
                >
                  <div className={isExpanded ? 'w-5 h-5' : 'w-4 h-4'}>
                    {icon}
                  </div>
                </motion.div>
              )}
              <motion.h3 layout="position" className={`${isExpanded ? 'text-[26px]' : 'text-[17px]'} font-bold text-gray-900 leading-tight`}>
                {title}
              </motion.h3>
            </div>
          </div>

          <motion.div layout="position" className={`flex-grow flex flex-col justify-center ${isExpanded ? 'min-h-[160px]' : 'min-h-[100px]'} mb-4`}>
            {variant === 'gauge' && (
              <div className="flex justify-center">
                <GaugeChart value={clampedScore} label="" size={isExpanded ? 'lg' : 'sm'} />
              </div>
            )}

            {variant === 'progress' && (
              <div className="w-full mb-4">
                <div className="flex justify-between text-sm mb-1.5 font-medium text-gray-500">
                  <span>Efficiency Score</span>
                  <span className="font-bold text-sm" style={{ color: getScoreColorHex(clampedScore) }}>
                    {Math.round(clampedScore)}%
                  </span>
                </div>
                <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden w-full">
                  <motion.div
                    className="h-full rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${clampedScore}%` }}
                    transition={{ duration: 1.2, ease: [0.34, 1.56, 0.64, 1] }}
                    style={{
                      backgroundColor: getBarColorHex(clampedScore),
                    }}
                  />
                </div>
              </div>
            )}

            {variant === 'default' && (
              <div className="w-full">
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden w-full">
                  <motion.div
                    className="h-full rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${clampedScore}%` }}
                    transition={{ duration: 1.2, ease: [0.34, 1.56, 0.64, 1] }}
                    style={{
                      backgroundColor: getBarColorHex(clampedScore),
                    }}
                  />
                </div>
              </div>
            )}
          </motion.div>

          <motion.p layout="position" className={`${isExpanded ? 'text-[18px] text-gray-500' : 'text-[13px] text-gray-400'} leading-relaxed`}>
            {description}
          </motion.p>
        </motion.div>

        {/* Right Side / Expanded Details */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{
                opacity: 0,
                x: 20,
                position: 'absolute',
                top: 0,
                right: 0,
                width: '1000px', // Prevent wrapping
                height: 'auto',
                pointerEvents: 'none',
                zIndex: -1
              }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="lg:w-2/3 flex flex-col min-w-[600px]"
            >
              <div className="h-full bg-gray-50/50 rounded-[32px] p-8 border border-gray-100 self-stretch">
                <h4 className="text-sm font-bold text-gray-400 uppercase tracking-[0.2em] mb-8">Detailed Analysis & Recommendations</h4>

                {improvements.length > 0 ? (
                  <div className="space-y-6">
                    {improvements.map((imp, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 + (idx * 0.1) }}
                        className={`bg-white rounded-[24px] p-6 shadow-sm border-l-4 ${getPriorityColor(imp.priority)}`}
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getPriorityBadge(imp.priority)}`}>
                            {imp.priority}
                          </span>
                          <span className="text-xs font-semibold text-gray-400 italic">Impact: {imp.impact}</span>
                        </div>
                        <p className="text-gray-900 font-semibold text-lg mb-4">{imp.suggestion}</p>

                        {imp.action_items && imp.action_items.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {imp.action_items.map((item, j) => (
                              <div key={j} className="bg-gray-100 text-gray-600 px-3 py-1.5 rounded-xl text-xs font-medium border border-gray-200">
                                {item}
                              </div>
                            ))}
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full py-12 text-center">
                    <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-6 shadow-inner">
                      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h5 className="text-xl font-bold text-gray-900 mb-2">Excellent Standing</h5>
                    <p className="text-gray-500 max-w-xs mx-auto">This metric exceeds our quality benchmark. No immediate improvements required.</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div >
  );
};

export default MetricCard;
