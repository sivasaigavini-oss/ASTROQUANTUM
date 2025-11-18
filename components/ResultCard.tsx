import React from 'react';
import { PredictionResult } from '../types';
import { Sparkles, Atom, Calendar, Telescope } from 'lucide-react';

interface ResultCardProps {
  result: PredictionResult;
  onReset: () => void;
}

const ResultCard: React.FC<ResultCardProps> = ({ result, onReset }) => {
  return (
    <div className="w-full max-w-4xl mx-auto animate-fade-in-up">
      <div className="bg-space-800/50 backdrop-blur-xl border border-space-accent/30 rounded-3xl p-8 shadow-[0_0_50px_rgba(112,0,255,0.1)] overflow-hidden relative">
        
        {/* Decorative header line */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-space-accent to-transparent opacity-50" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Left Column: Context */}
          <div className="space-y-6">
            <div className="bg-space-900/40 p-6 rounded-2xl border border-white/5">
              <div className="flex items-center gap-3 mb-3 text-space-accent">
                <Telescope size={20} />
                <h3 className="font-display font-bold uppercase tracking-wider">The Stars Today</h3>
              </div>
              <p className="text-gray-300 text-base leading-relaxed font-light">
                {result.astronomyContext}
              </p>
            </div>

            <div className="bg-space-900/40 p-6 rounded-2xl border border-white/5">
               <div className="flex items-center gap-3 mb-3 text-space-purple">
                <Sparkles size={20} />
                <h3 className="font-display font-bold uppercase tracking-wider">What It Means</h3>
              </div>
              <p className="text-gray-300 text-base leading-relaxed font-light">
                {result.astrologyInsight}
              </p>
            </div>
          </div>

          {/* Right Column: Prediction */}
          <div className="flex flex-col justify-between h-full space-y-6">
            <div className="space-y-4">
              <h2 className="text-3xl font-display text-white font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                Your Forecast
              </h2>
              <p className="text-lg text-white/90 font-light leading-relaxed">
                {result.prediction}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                <div className="flex items-center gap-2 text-emerald-400 mb-2">
                  <Calendar size={16} />
                  <span className="text-xs font-mono uppercase">Key Dates</span>
                </div>
                <ul className="text-sm text-white font-mono">
                  {result.powerDates.map((d, i) => (
                    <li key={i}>{d}</li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                 <div className="flex items-center gap-2 text-pink-400 mb-2">
                  <Atom size={16} />
                  <span className="text-xs font-mono uppercase">Lucky Symbol</span>
                </div>
                <div className="text-xl font-display text-white">
                  {result.luckyElement}
                </div>
              </div>
            </div>
          </div>

        </div>

        <div className="mt-10 flex justify-center">
          <button
            onClick={onReset}
            className="px-8 py-3 bg-transparent border border-space-accent text-space-accent font-mono uppercase tracking-widest hover:bg-space-accent hover:text-space-900 transition-all duration-300 rounded-none clip-path-polygon"
            style={{ clipPath: 'polygon(10% 0, 100% 0, 100% 70%, 90% 100%, 0 100%, 0 30%)' }}
          >
            Start New Reading
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultCard;