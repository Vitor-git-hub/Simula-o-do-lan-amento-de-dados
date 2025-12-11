import React from 'react';
import { Triangle, Square, Diamond, Hexagon, Circle } from 'lucide-react';

interface DieIconProps {
  shape: string;
  className?: string;
}

export const DieIcon: React.FC<DieIconProps> = ({ shape, className = "" }) => {
  switch (shape) {
    case 'triangle': return <Triangle className={className} />;
    case 'square': return <Square className={className} />;
    case 'diamond': return <Diamond className={className} />;
    case 'pentagon': return <Circle className={className} />; // Circle as proxy for complex shapes
    case 'hexagon': return <Hexagon className={className} />;
    default: return <Square className={className} />;
  }
};