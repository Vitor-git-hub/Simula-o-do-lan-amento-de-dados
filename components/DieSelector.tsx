import React from 'react';
import { PLATONIC_DICE } from '../constants';
import { DieConfig } from '../types';
import { DieIcon } from './DieIcon';

interface DieSelectorProps {
  selectedDie: DieConfig;
  onSelect: (die: DieConfig) => void;
}

export const DieSelector: React.FC<DieSelectorProps> = ({ selectedDie, onSelect }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
      {PLATONIC_DICE.map((die) => {
        const isSelected = selectedDie.type === die.type;
        return (
          <button
            key={die.type}
            onClick={() => onSelect(die)}
            className={`
              relative flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-200
              ${isSelected 
                ? 'border-indigo-600 bg-indigo-50 shadow-md transform scale-105' 
                : 'border-slate-200 bg-white hover:border-indigo-300 hover:shadow-sm'
              }
            `}
          >
            <div className={`mb-3 ${isSelected ? 'text-indigo-600' : 'text-slate-400'}`}>
              <DieIcon shape={die.iconShape} className="w-8 h-8 fill-current opacity-20" />
            </div>
            <span className={`font-bold text-lg ${isSelected ? 'text-indigo-900' : 'text-slate-700'}`}>
              {die.name}
            </span>
            <span className="text-xs text-slate-500 mt-1">D{die.sides}</span>
            
            {isSelected && (
              <div className="absolute top-2 right-2 w-3 h-3 bg-indigo-600 rounded-full animate-pulse" />
            )}
          </button>
        );
      })}
    </div>
  );
};