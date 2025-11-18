export interface UserData {
  name: string;
  birthDate: string;
  birthTime: string;
  birthPlace: string;
}

export enum PlanetName {
  Mercury = 'Mercury',
  Venus = 'Venus',
  Earth = 'Earth',
  Mars = 'Mars',
  Jupiter = 'Jupiter',
  Saturn = 'Saturn',
  Uranus = 'Uranus',
  Neptune = 'Neptune'
}

export interface PlanetPosition {
  name: PlanetName;
  x: number;
  y: number;
  angle: number; // in degrees
  distance: number; // relative AU scaled
  color: string;
  speed: number;
}

export enum PredictionType {
  General = 'General',
  Career = 'Career',
  Love = 'Love',
  Finance = 'Finance'
}

export interface PredictionResult {
  astronomyContext: string;
  astrologyInsight: string;
  prediction: string;
  powerDates: string[];
  luckyElement: string;
}
