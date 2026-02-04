import React from 'react';
import PricingAstronaut from '../components/PricingAstronaut';

const PricingPage: React.FC = () => {
  return (
    <div className="min-h-screen pt-24 pb-16 px-6 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-200 shadow-sm">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span className="text-xs font-bold uppercase tracking-widest text-gray-600">
                Pricing
              </span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
              Absolutely Free
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed">
              No trials. No hidden fees. Everything you see is included, so you can
              evaluate content without limits.
            </p>
            <div className="space-y-3">
              {[
                'Unlimited evaluations',
                'All metrics unlocked',
                'No credit card required',
              ].map((item) => (
                <div key={item} className="flex items-center gap-3 text-gray-700">
                  <div className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center text-xs font-bold">
                    ✓
                  </div>
                  <span className="text-sm font-semibold">{item}</span>
                </div>
              ))}
            </div>
            <div>
              <button className="px-8 py-4 rounded-2xl bg-black hover:bg-gray-800 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0">
                All is Free
              </button>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.08),_0_8px_40px_rgba(0,0,0,0.06)] p-6">
            <PricingAstronaut />
            <p className="mt-4 text-center text-sm text-gray-500">
              Explore everything, no limits.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
