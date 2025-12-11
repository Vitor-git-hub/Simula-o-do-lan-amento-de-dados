export enum DieType {
  Tetrahedron = 4,
  Cube = 6,
  Octahedron = 8,
  Dodecahedron = 12,
  Icosahedron = 20,
}

export interface DieConfig {
  type: DieType;
  name: string;
  sides: number;
  description: string;
  iconShape: 'triangle' | 'square' | 'diamond' | 'pentagon' | 'hexagon';
}

export interface SimulationResult {
  face: number;
  count: number;
  frequency: number; // 0 to 1
}

export interface SimulationSummary {
  totalRolls: number;
  results: SimulationResult[];
  timestamp: number;
}