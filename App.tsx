import React, { useState, useEffect, useMemo } from 'react';
import { Compass, Loader2, User, MapPin, Calendar } from 'lucide-react';
import StarField from './components/StarField';
import SolarSystem from './components/SolarSystem';
import ResultCard from './components/ResultCard';
import { UserData, PredictionType, PredictionResult, PlanetPosition } from './types';
import { calculatePlanets } from './services/astronomyUtils';
import { generateHoroscope } from './services/geminiService';

function App() {
  // State
  const [step, setStep] = useState<'input' | 'processing' | 'result'>('input');
  const [userData, setUserData] = useState<UserData>({
    name: '',
    birthDate: '',
    birthTime: '12:00',
    birthPlace: ''
  });
  const [predictionType, setPredictionType] = useState<PredictionType>(PredictionType.General);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentPlanets, setCurrentPlanets] = useState<PlanetPosition[]>([]);

  // Initial Astronomy Calculation
  useEffect(() => {
    const now = new Date();
    const planets = calculatePlanets(now);
    setCurrentPlanets(planets);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userData.name || !userData.birthDate || !userData.birthPlace) {
        setError("Please fill in all cosmic coordinates.");
        return;
    }
    
    setStep('processing');
    setError(null);

    try {
      const prediction = await generateHoroscope(userData, predictionType, currentPlanets);
      setResult(prediction);
      setStep('result');
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown cosmic disturbance occurred.");
      setStep('input');
    }
  };

  return (
    <div className="min-h-screen text-white font-sans selection:bg-space-accent selection:text-space-900">
      <StarField />

      <header className="fixed top-0 left-0 w-full p-6 z-50 flex items-center justify-between bg-gradient-to-b from-space-900 to-transparent pointer-events-none">
        <div className="flex items-center gap-3 pointer-events-auto">
          <div className="w-10 h-10 border-2 border-space-accent rounded-full flex items-center justify-center animate-spin-slow">
            <Compass className="text-space-accent" size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-display font-bold tracking-wider text-white">ASTRO<span className="text-space-accent">QUANTUM</span></h1>
            <p className="text-xs font-mono text-gray-400 tracking-[0.2em] uppercase">Future Predictor System</p>
          </div>
        </div>
      </header>

      <main className="relative z-10 container mx-auto px-4 pt-32 pb-12 min-h-screen flex flex-col items-center justify-center">
        
        {step === 'input' && (
          <div className="w-full max-w-6xl flex flex-col lg:flex-row items-center gap-12 animate-fade-in">
            
            {/* Left: Solar System Visualizer */}
            <div className="w-full lg:w-1/2 flex flex-col items-center">
              <div className="w-full aspect-square relative">
                <div className="absolute inset-0 bg-space-accent/5 blur-[100px] rounded-full" />
                <SolarSystem planets={currentPlanets} />
              </div>
              <p className="mt-4 font-mono text-xs text-space-accent/70 uppercase tracking-widest">
                Real-time Planetary Positions Detected
              </p>
            </div>

            {/* Right: Input Form */}
            <div className="w-full lg:w-1/2">
              <div className="bg-white/5 backdrop-blur-lg border border-white/10 p-8 rounded-2xl shadow-2xl">
                <h2 className="text-3xl font-display mb-6">Initialize Reading</h2>
                
                {error && (
                  <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 text-red-200 text-sm rounded font-mono">
                    ! SYSTEM ALERT: {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-mono uppercase text-gray-400 flex items-center gap-2">
                      <User size={14} /> Subject Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={userData.name}
                      onChange={handleInputChange}
                      className="w-full bg-space-900/50 border border-white/20 rounded-lg p-3 text-white focus:border-space-accent focus:ring-1 focus:ring-space-accent outline-none transition-all font-sans"
                      placeholder="Enter full name"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-mono uppercase text-gray-400 flex items-center gap-2">
                        <Calendar size={14} /> Birth Date
                      </label>
                      <input
                        type="date"
                        name="birthDate"
                        value={userData.birthDate}
                        onChange={handleInputChange}
                        className="w-full bg-space-900/50 border border-white/20 rounded-lg p-3 text-white focus:border-space-accent outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-mono uppercase text-gray-400 flex items-center gap-2">
                         Time
                      </label>
                      <input
                        type="time"
                        name="birthTime"
                        value={userData.birthTime}
                        onChange={handleInputChange}
                        className="w-full bg-space-900/50 border border-white/20 rounded-lg p-3 text-white focus:border-space-accent outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-mono uppercase text-gray-400 flex items-center gap-2">
                      <MapPin size={14} /> Birth Place
                    </label>
                    <input
                      type="text"
                      name="birthPlace"
                      value={userData.birthPlace}
                      onChange={handleInputChange}
                      className="w-full bg-space-900/50 border border-white/20 rounded-lg p-3 text-white focus:border-space-accent outline-none transition-all placeholder:text-gray-600"
                      placeholder="City, Country"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-mono uppercase text-gray-400">Focus Area</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {Object.values(PredictionType).map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setPredictionType(type)}
                          className={`p-2 text-sm border rounded-lg transition-all ${
                            predictionType === type 
                              ? 'bg-space-accent/20 border-space-accent text-space-accent' 
                              : 'bg-transparent border-white/10 text-gray-400 hover:border-white/30'
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 mt-4 bg-space-accent text-space-900 font-bold uppercase tracking-widest hover:bg-white hover:shadow-[0_0_20px_rgba(255,255,255,0.5)] transition-all duration-300 clip-path-polygon font-display"
                    style={{ clipPath: 'polygon(5% 0, 100% 0, 100% 70%, 95% 100%, 0 100%, 0 30%)' }}
                  >
                    Generate Prediction
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {step === 'processing' && (
          <div className="flex flex-col items-center justify-center gap-6 animate-pulse-glow">
            <div className="relative">
              <div className="absolute inset-0 bg-space-accent/20 blur-xl rounded-full"></div>
              <Loader2 size={64} className="text-space-accent animate-spin relative z-10" />
            </div>
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-display">Reading the Stars</h2>
              <p className="font-mono text-sm text-gray-400">Analyzing planetary positions for you...</p>
            </div>
          </div>
        )}

        {step === 'result' && result && (
          <ResultCard result={result} onReset={() => setStep('input')} />
        )}

      </main>
    </div>
  );
}

export default App;