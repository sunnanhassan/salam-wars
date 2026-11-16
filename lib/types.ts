export interface Competitor {
  id: "sunnan" | "alina";
  name: string;
  role: string;
  badge: string;
  score: number;
  colorTheme: "blue" | "pink";
  quote: string;
}

export interface ScoreState {
  sunnan: number;
  alina: number;
  lastUpdated?: string;
  soundEnabled: boolean;
}

