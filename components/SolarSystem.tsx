import React, { useMemo, useState } from 'react';
import { PlanetPosition } from '../types';

interface SolarSystemProps {
  planets: PlanetPosition[];
}

const SolarSystem: React.FC<SolarSystemProps> = ({ planets }) => {
  const [hoveredPlanet, setHoveredPlanet] = useState<string | null>(null);

  // Viewport settings
  const size = 600;
  const center = size / 2;

  return (
    <div className="relative flex items-center justify-center w-full h-full min-h-[400px] md:min-h-[600px]">
      <svg 
        viewBox={`0 0 ${size} ${size}`} 
        className="w-full h-full max-w-[600px] animate-[spin_120s_linear_infinite] hover:pause"
        style={{ animationPlayState: hoveredPlanet ? 'paused' : 'running' }}
      >
        {/* Sun */}
        <circle cx={center} cy={center} r={15} fill="#FDB813" className="filter drop-shadow-[0_0_15px_rgba(253,184,19,0.8)]" />
        
        {/* Orbits and Planets */}
        {planets.map((planet) => {
          // Use the planet's calculated distance for the orbit radius
          // We need to recreate the radius magnitude from the component logic
          // In `astronomyUtils`, r = planet.distance * 50 (roughly)
          const orbitRadius = Math.sqrt(planet.x * planet.x + planet.y * planet.y);

          return (
            <g key={planet.name} className="group">
              {/* Orbit Track */}
              <circle 
                cx={center} 
                cy={center} 
                r={orbitRadius} 
                fill="none" 
                stroke="rgba(255,255,255,0.1)" 
                strokeWidth="1"
                strokeDasharray="4 4"
              />
              
              {/* Planet Group - Positioned absolutely based on calculated x/y */}
              <g transform={`translate(${center + planet.x}, ${center + planet.y})`}>
                {/* Glow */}
                <circle 
                  r={8} 
                  fill={planet.color} 
                  opacity={0.3}
                  className="animate-pulse"
                />
                {/* Planet Body */}
                <circle 
                  r={4} 
                  fill={planet.color}
                  className="cursor-pointer transition-all duration-300 hover:scale-150"
                  onMouseEnter={() => setHoveredPlanet(planet.name)}
                  onMouseLeave={() => setHoveredPlanet(null)}
                />
                
                {/* Label (visible on hover) */}
                <text
                  y={-10}
                  x={0}
                  textAnchor="middle"
                  fill="white"
                  fontSize="12"
                  fontFamily="Exo 2"
                  className={`transition-opacity duration-300 ${hoveredPlanet === planet.name ? 'opacity-100' : 'opacity-0'}`}
                  style={{ textShadow: '0 0 5px black' }}
                >
                  {planet.name}
                </text>
              </g>
            </g>
          );
        })}
      </svg>
      
      {/* Overlay info if hovering */}
      {hoveredPlanet && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 text-sm text-space-accent font-mono">
          Viewing: {hoveredPlanet}
        </div>
      )}
    </div>
  );
};

export default SolarSystem;
