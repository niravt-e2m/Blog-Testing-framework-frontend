import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface AILikelihoodCardProps {
    score: number;
    classification: string;
    summary: string;
    strongAreasCount: number;
    needsImprovementCount: number;
}

const COLORS = ['#1F2937', '#E5E7EB'];

const AILikelihoodCard: React.FC<AILikelihoodCardProps> = ({
    score,
    classification,
    summary,
    strongAreasCount,
    needsImprovementCount,
}) => {
    const pieData = [
        { name: 'Score', value: score },
        { name: 'Remaining', value: 100 - score },
    ];

    return (
        <div className="
      bg-white
      border border-gray-200
      shadow-[0_4px_20px_rgba(0,0,0,0.1),_0_8px_40px_rgba(0,0,0,0.06)]
      rounded-[32px]
      p-8
      h-full
      flex flex-col
    ">
            <div className="flex gap-8 items-start h-full">
                {/* Chart Side */}
                <div className="relative w-[160px] h-[160px] flex-shrink-0">
                    <ResponsiveContainer width="100%" height="100%">
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
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="text-center">
                            <span className="text-3xl font-bold text-gray-900">{score}%</span>
                            <span className="block text-xs text-gray-500 uppercase tracking-wider mt-1">Likelihood</span>
                        </div>
                    </div>
                </div>

                {/* Content Side */}
                <div className="flex-1 flex flex-col justify-center h-full">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-10 h-10 rounded-lg bg-black flex items-center justify-center text-white">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-900 leading-tight">AI Likelihood</h3>
                            <p className="text-gray-500 text-xs">Detailed Scoring Analysis</p>
                        </div>
                    </div>

                    <h4 className="font-bold text-gray-900 mb-2 text-sm">Analysis Summary</h4>
                    <p className="text-gray-600 leading-relaxed text-sm mb-4">
                        {summary}
                    </p>

                    <div className="flex flex-col gap-2 mt-auto pb-1">
                        <div className="flex items-center gap-2 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100 w-fit">
                            <div className="w-2 h-2 rounded-full bg-emerald-500" />
                            <span className="text-sm font-medium text-emerald-800">{strongAreasCount} Strong areas</span>
                        </div>
                        <div className="flex items-center gap-2 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-100 w-fit">
                            <div className="w-2 h-2 rounded-full bg-amber-500" />
                            <span className="text-sm font-medium text-amber-800">{needsImprovementCount} Improvements</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AILikelihoodCard;
