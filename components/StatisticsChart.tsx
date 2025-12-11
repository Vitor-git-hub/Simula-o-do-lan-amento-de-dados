import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { SimulationResult } from '../types.ts';

interface StatisticsChartProps {
  data: SimulationResult[];
  expectedFrequency: number;
}

export const StatisticsChart: React.FC<StatisticsChartProps> = ({ data, expectedFrequency }) => {
  return (
    <div className="h-[400px] w-full mt-6 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
      <h3 className="text-lg font-semibold text-slate-800 mb-4 pl-2">Distribuição de Frequências Relativas (%)</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 40,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
          <XAxis 
            dataKey="face" 
            label={{ value: 'Face do Dado', position: 'bottom', offset: 20 }}
            tick={{ fill: '#64748b' }}
            tickLine={false}
          />
          <YAxis 
            label={{ value: 'Freq. Relativa (%)', angle: -90, position: 'insideLeft', offset: 0 }}
            tickFormatter={(value) => `${value.toFixed(1)}%`}
            tick={{ fill: '#64748b' }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip 
            cursor={{ fill: '#f1f5f9' }}
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload as SimulationResult;
                return (
                  <div className="bg-slate-800 text-white p-3 rounded-lg shadow-xl text-sm">
                    <p className="font-bold mb-1">Face {data.face}</p>
                    <p>Contagem: <span className="text-indigo-300">{data.count}</span></p>
                    <p>Freq. Relativa: <span className="text-emerald-300">{(data.frequency * 100).toFixed(2)}%</span></p>
                    <div className="mt-2 pt-2 border-t border-slate-600 text-xs text-slate-400">
                      Esperado: {(expectedFrequency * 100).toFixed(2)}%
                    </div>
                  </div>
                );
              }
              return null;
            }}
          />
          <Bar dataKey="frequency" name="Frequência" animationDuration={1000}>
             {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.frequency * 100 > (expectedFrequency * 100 * 1.5) ? '#ef4444' : '#6366f1'} 
                  fillOpacity={0.8}
                />
              ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};