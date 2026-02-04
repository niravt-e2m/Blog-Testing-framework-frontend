import React from 'react';
import ParticleBackground from '../components/ParticleBackground';

const AboutPage: React.FC = () => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-white">
      <ParticleBackground />

      <div className="relative z-10 px-6 pt-32 pb-20">
        <div className="max-w-5xl mx-auto">
          <div className="rounded-3xl bg-white/95 shadow-xl border border-gray-200 p-8 md:p-10">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-gray-500 mb-4">
              About EditorialAI
            </p>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight mb-6">
              We turn editorial standards into actionable signals.
            </h1>
            <p className="text-lg text-gray-700 leading-relaxed mb-6 max-w-3xl">
              EditorialAI evaluates your content across eight rigorous quality metrics,
              giving writers and teams a fast, objective way to improve clarity, accuracy,
              and brand alignment before publishing.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed mb-10 max-w-3xl">
              Our workflow blends expert-grade rubrics with AI reasoning to surface
              strengths, identify gaps, and recommend improvements in minutes.
            </p>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                <p className="text-sm font-semibold text-gray-900 mb-2">1. Submit content</p>
                <p className="text-sm text-gray-600">
                  Paste your blog, references, and tone guide in a guided workflow.
                </p>
              </div>
              <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                <p className="text-sm font-semibold text-gray-900 mb-2">2. AI evaluation</p>
                <p className="text-sm text-gray-600">
                  Specialized agents score clarity, relevance, safety, and more.
                </p>
              </div>
              <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                <p className="text-sm font-semibold text-gray-900 mb-2">3. Insights</p>
                <p className="text-sm text-gray-600">
                  Receive prioritized recommendations and improvement steps.
                </p>
              </div>
              <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                <p className="text-sm font-semibold text-gray-900 mb-2">4. Publish faster</p>
                <p className="text-sm text-gray-600">
                  Ship stronger content with measurable confidence.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
