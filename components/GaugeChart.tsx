import React from 'react';

interface GaugeChartProps {
  value: number; // 0-100
  label: string;
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;
}

const GaugeChart: React.FC<GaugeChartProps> = ({
  value,
  label,
  size = 'md',
  showValue = true
}) => {
  const clampedValue = Math.min(100, Math.max(0, value));
  // Unique animation name based on label to avoid conflicts
  const safeLabel = (label || 'gauge').replace(/[^a-zA-Z0-9]/g, '_');
  const animationName = `fillGauge_${safeLabel}_${Math.round(clampedValue)}`;

  // Calculate the arc path
  const radius = size === 'sm' ? 40 : size === 'md' ? 60 : 80;
  const strokeWidth = size === 'sm' ? 8 : size === 'md' ? 10 : 12;
  const circumference = Math.PI * radius;
  const offset = circumference - (clampedValue / 100) * circumference;

  const dimensions = {
    sm: { width: 100, height: 60, fontSize: 'text-xl', labelSize: 'text-xs' },
    md: { width: 140, height: 80, fontSize: 'text-3xl', labelSize: 'text-sm' },
    lg: { width: 180, height: 100, fontSize: 'text-4xl', labelSize: 'text-base' },
  };

  const dim = dimensions[size];

  // Color based on value
  const getColor = () => {
    if (clampedValue >= 80) return '#10B981'; // green
    if (clampedValue >= 60) return '#F59E0B'; // amber
    if (clampedValue >= 40) return '#F97316'; // orange
    return '#EF4444'; // red
  };

  return (
    <div className="flex flex-col items-center">
      <svg
        width={dim.width}
        height={dim.height}
        viewBox={`0 0 ${dim.width} ${dim.height + 10}`}
      >
        {/* Background arc */}
        <path
          d={`M ${strokeWidth} ${dim.height} A ${radius} ${radius} 0 0 1 ${dim.width - strokeWidth} ${dim.height}`}
          fill="none"
          stroke="#E5E7EB"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />

        <style>
          {`
            @keyframes ${animationName} {
              from { stroke-dashoffset: ${circumference}; }
              to { stroke-dashoffset: ${offset}; }
            }
            .${animationName}_class {
              animation: ${animationName} 1.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
            }
          `}
        </style>

        {/* Value arc */}
        <path
          d={`M ${strokeWidth} ${dim.height} A ${radius} ${radius} 0 0 1 ${dim.width - strokeWidth} ${dim.height}`}
          fill="none"
          stroke={getColor()}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          className={`${animationName}_class`}
          style={{
            transition: 'stroke 0.3s ease',
          }}
        />

        {/* Value text */}
        {showValue && (
          <text
            x={dim.width / 2}
            y={dim.height - 5}
            textAnchor="middle"
            className={`${dim.fontSize} font-bold`}
            fill="#1F2937"
          >
            {Math.round(clampedValue)}
          </text>
        )}
      </svg>
      <p className={`${dim.labelSize} text-gray-600 font-medium mt-1 text-center`}>
        {label}
      </p>
    </div>
  );
};

export default GaugeChart;
