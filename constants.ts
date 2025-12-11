import { DieConfig, DieType } from './types';

export const PLATONIC_DICE: DieConfig[] = [
  {
    type: DieType.Tetrahedron,
    name: "Tetraedro",
    sides: 4,
    description: "4 Faces (Pirâmide Triangular)",
    iconShape: 'triangle'
  },
  {
    type: DieType.Cube,
    name: "Cubo",
    sides: 6,
    description: "6 Faces (Cubo Clássico)",
    iconShape: 'square'
  },
  {
    type: DieType.Octahedron,
    name: "Octaedro",
    sides: 8,
    description: "8 Faces (Bipirâmide)",
    iconShape: 'diamond'
  },
  {
    type: DieType.Dodecahedron,
    name: "Dodecaedro",
    sides: 12,
    description: "12 Faces (Pentágonos)",
    iconShape: 'pentagon'
  },
  {
    type: DieType.Icosahedron,
    name: "Icosaedro",
    sides: 20,
    description: "20 Faces (Triângulos)",
    iconShape: 'hexagon'
  }
];