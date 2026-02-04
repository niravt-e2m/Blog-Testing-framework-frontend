import React from 'react';
import { RiskLevel } from '../types';

interface RiskMeterProps {
  level: RiskLevel;
  label?: string;
  showDescription?: boolean;
}

const RiskMeter: React.FC<RiskMeterProps> = ({ 
  level, 
  label = 'Risk Level',
  showDescription = true 
}) => {
  const config = {
    [RiskLevel.LOW]: {
      color: '#10B981',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200',
      textColor: 'text-emerald-700',
      segments: 1,
      label: 'Low Risk',
      description: 'Content appears well-sourced and factual',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    [RiskLevel.MEDIUM]: {
      color: '#F59E0B',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200',
      textColor: 'text-amber-700',
      segments: 2,
      label: 'Medium Risk',
      description: 'Some claims may need verification',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
    },
    [RiskLevel.HIGH]: {
      color: '#EF4444',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      textColor: 'text-red-700',
      segments: 3,
      label: 'High Risk',
      description: 'Multiple potential hallucinations detected',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  };

  const current = config[level];

  return (
    <div className={`
      p-5 rounded-2xl
      ${current.bgColor}
      border ${current.borderColor}
      transition-all duration-300
    `}>
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-bold uppercase tracking-widest text-gray-500">
          {label}
        </span>
        <div className={`flex items-center gap-1.5 ${current.textColor}`}>
          {current.icon}
          <span className="font-semibold text-sm">{current.label}</span>
        </div>
      </div>

      {/* Risk Meter Bar */}
      <div className="flex gap-1.5 mb-3">
        {[1, 2, 3].map((segment) => (
          <div
            key={segment}
            className={`
              h-3 flex-1 rounded-full
              transition-all duration-500 ease-out
              ${segment <= current.segments 
                ? '' 
                : 'bg-gray-200'
              }
            `}
            style={{
              backgroundColor: segment <= current.segments ? current.color : undefined,
            }}
          />
        ))}
      </div>

      {showDescription && (
        <p className="text-sm text-gray-600">
          {current.description}
        </p>
      )}
    </div>
  );
};

export default RiskMeter;
