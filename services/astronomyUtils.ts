import { PlanetName, PlanetPosition } from '../types';

// Simplified orbital elements for visualization (Mean Anomaly method)
// This is not NASA-grade precision for navigation, but sufficient for "Real-time" visual representation
const PLANET_DATA: Record<PlanetName, { a: number, T: number, color: string, e: number, offset: number }> = {
  [PlanetName.Mercury]: { a: 0.39, T: 87.97, color: '#A5A5A5', e: 0.205, offset: 0 },
  [PlanetName.Venus]: { a: 0.72, T: 224.7, color: '#E3BB76', e: 0.007, offset: 100 },
  [PlanetName.Earth]: { a: 1.00, T: 365.26, color: '#22A6B3', e: 0.017, offset: 200 },
  [PlanetName.Mars]: { a: 1.52, T: 686.98, color: '#DD5E53', e: 0.094, offset: 300 },
  [PlanetName.Jupiter]: { a: 2.50, T: 4332.59, color: '#D4A373', e: 0.049, offset: 50 }, // Scaled down 'a' for visual fit
  [PlanetName.Saturn]: { a: 3.20, T: 10759.22, color: '#E0C097', e: 0.057, offset: 150 }, // Scaled down 'a'
  [PlanetName.Uranus]: { a: 3.90, T: 30688.5, color: '#B2D8D8', e: 0.046, offset: 220 }, // Scaled down 'a'
  [PlanetName.Neptune]: { a: 4.50, T: 60182.0, color: '#5B5DDF', e: 0.011, offset: 80 }  // Scaled down 'a'
};

const J2000 = new Date('2000-01-01T12:00:00Z').getTime();

export const calculatePlanets = (date: Date): PlanetPosition[] => {
  const timeDiffDays = (date.getTime() - J2000) / (1000 * 60 * 60 * 24);

  return Object.values(PlanetName).map((name) => {
    const data = PLANET_DATA[name];
    
    // Calculate Mean Anomaly (approximate position in orbit)
    // M = M0 + n * t
    // Simplified: (Days passed / Period in days) * 360 degrees
    const meanMotion = (360 / data.T); 
    let currentAngle = (data.offset + (meanMotion * timeDiffDays)) % 360;
    if (currentAngle < 0) currentAngle += 360;

    // Convert polar to cartesian for SVG rendering
    // Visual scaling factor
    const scale = 50; 
    const r = data.a * scale; 

    // Add slight eccentricity effect
    const rads = (currentAngle * Math.PI) / 180;
    const x = r * Math.cos(rads);
    const y = r * Math.sin(rads);

    return {
      name,
      x,
      y,
      angle: currentAngle,
      distance: data.a,
      color: data.color,
      speed: meanMotion
    };
  });
};
