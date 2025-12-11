import React, { useState, useCallback, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { 
  Dices, 
  RotateCcw, 
  BarChart3, 
  List, 
  Download, 
  CheckCircle2,
  Triangle, 
  Square, 
  Diamond, 
  Hexagon, 
  Circle 
} from 'lucide-react';
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

// --- TYPES ---
enum DieType {
  Tetrahedron = 4,
  Cube = 6,
  Octahedron = 8,
  Dodecahedron = 12,
  Icosahedron = 20,
}

interface DieConfig {
  type: DieType;
  name: string;
  sides: number;
  description: string;
  iconShape: 'triangle' | 'square' | 'diamond' | 'pentagon' | 'hexagon';
}

interface SimulationResult {
  face: number;
  count: number;
  frequency: number; // 0 to 1
}

interface SimulationSummary {
  totalRolls: number;
  results: SimulationResult[];
  timestamp: number;
}

// --- CONSTANTS ---
const PLATONIC_DICE: DieConfig[] = [
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

// --- COMPONENTS ---

// 1. Die Icon
const DieIcon: React.FC<{ shape: string; className?: string }> = ({ shape, className = "" }) => {
  switch (shape) {
    case 'triangle': return <Triangle className={className} />;
    case 'square': return <Square className={className} />;
    case 'diamond': return <Diamond className={className} />;
    case 'pentagon': return <Circle className={className} />;
    case 'hexagon': return <Hexagon className={className} />;
    default: return <Square className={className} />;
  }
};

// 2. Die Selector
const DieSelector: React.FC<{ selectedDie: DieConfig; onSelect: (die: DieConfig) => void }> = ({ selectedDie, onSelect }) => {
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

// 3. Chart
const StatisticsChart: React.FC<{ data: SimulationResult[]; expectedFrequency: number }> = ({ data, expectedFrequency }) => {
  return (
    <div className="h-[400px] w-full mt-6 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
      <h3 className="text-lg font-semibold text-slate-800 mb-4 pl-2">Distribuição de Frequências Relativas (%)</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
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

// --- MAIN APP ---
const App: React.FC = () => {
  const [selectedDie, setSelectedDie] = useState<DieConfig>(PLATONIC_DICE[1]); // Default to Cube
  const [numRolls, setNumRolls] = useState<number>(100);
  const [simulationData, setSimulationData] = useState<SimulationSummary | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  
  // PWA Install State
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isOfflineReady, setIsOfflineReady] = useState(false);

  useEffect(() => {
    // Listen for install prompt
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    });

    // Check if SW is active (Offline ready)
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(() => {
        setIsOfflineReady(true);
      });
    }
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsInstallable(false);
    }
    setDeferredPrompt(null);
  };

  const handleRoll = useCallback(() => {
    setIsSimulating(true);
    setSimulationData(null); 
    
    setTimeout(() => {
      const counts: Record<number, number> = {};
      
      // Initialize counts
      for (let i = 1; i <= selectedDie.sides; i++) {
        counts[i] = 0;
      }

      // Perform simulation
      for (let i = 0; i < numRolls; i++) {
        const result = Math.floor(Math.random() * selectedDie.sides) + 1;
        counts[result]++;
      }

      // Format results
      const results: SimulationResult[] = Object.keys(counts).map((face) => {
        const count = counts[parseInt(face)];
        return {
          face: parseInt(face),
          count: count,
          frequency: count / numRolls
        };
      });

      setSimulationData({
        totalRolls: numRolls,
        results,
        timestamp: Date.now()
      });
      setIsSimulating(false);
    }, 1500); 
  }, [selectedDie, numRolls]);

  const chartData = simulationData?.results.map(r => ({
    ...r,
    frequency: parseFloat((r.frequency * 100).toFixed(2)) 
  })) || [];

  const expectedProbability = 1 / selectedDie.sides;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* Header */}
      <header className="bg-indigo-700 text-white shadow-lg sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-6 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-indigo-600 rounded-lg">
              <Dices className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Simulador de Dados</h1>
              <p className="text-indigo-200 text-sm">Sólidos Platónicos</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isInstallable && (
              <button 
                onClick={handleInstallClick}
                className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-indigo-500 hover:bg-indigo-400 rounded-lg text-xs font-semibold transition-colors"
              >
                <Download className="w-4 h-4" />
                Instalar App
              </button>
            )}
            {isOfflineReady && !isInstallable && (
               <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-indigo-800/50 rounded-lg text-xs font-medium text-indigo-200 border border-indigo-600">
                 <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                 Offline Ready
               </div>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        
        {/* Intro Text */}
        <section className="mb-10 text-center max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-800 mb-4">Escolha o seu dado</h2>
          <p className="text-slate-600">
            Selecione um dos cinco sólidos platónicos abaixo e defina o número de lançamentos para simular as frequências relativas.
          </p>
        </section>

        {/* Die Selection */}
        <DieSelector 
          selectedDie={selectedDie} 
          onSelect={(die) => {
            if (!isSimulating) {
              setSelectedDie(die);
              setSimulationData(null); 
            }
          }} 
        />

        {/* Configuration & Action */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 mb-10 transition-all">
          <div className="flex flex-col md:flex-row items-end md:items-center justify-center gap-6">
            
            <div className="w-full md:w-auto flex-1 max-w-md">
              <label htmlFor="rolls" className="block text-sm font-medium text-slate-700 mb-2">
                Número de Lançamentos
              </label>
              <div className="relative">
                <input
                  id="rolls"
                  type="number"
                  min="10"
                  max="100000"
                  value={numRolls}
                  onChange={(e) => setNumRolls(Math.max(1, parseInt(e.target.value) || 0))}
                  disabled={isSimulating}
                  className="block w-full rounded-lg border-slate-300 border p-3 focus:border-indigo-500 focus:ring-indigo-500 sm:text-lg bg-slate-50 disabled:opacity-50"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400">
                  lançamentos
                </div>
              </div>
              <div className="flex gap-2 mt-2 justify-between">
                {[10, 100, 1000, 10000].map(val => (
                  <button 
                    key={val}
                    onClick={() => setNumRolls(val)}
                    disabled={isSimulating}
                    className={`text-xs px-3 py-1 rounded-full border transition-colors ${numRolls === val ? 'bg-indigo-100 border-indigo-300 text-indigo-700' : 'border-slate-200 text-slate-500 hover:bg-slate-100'} disabled:opacity-50`}
                  >
                    {val}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleRoll}
              disabled={isSimulating || numRolls < 1}
              className={`
                w-full md:w-auto px-8 py-4 rounded-xl font-bold text-lg shadow-lg flex items-center justify-center space-x-2 transition-all
                ${isSimulating 
                  ? 'bg-indigo-50 text-indigo-300 cursor-not-allowed shadow-inner' 
                  : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-xl hover:-translate-y-1'
                }
              `}
            >
              {isSimulating ? (
                <>
                  <RotateCcw className="w-5 h-5 animate-spin" />
                  <span>A calcular...</span>
                </>
              ) : (
                <>
                  <Dices className="w-6 h-6" />
                  <span>Lançar Dados</span>
                </>
              )}
            </button>

          </div>
        </div>

        {/* Animation Stage */}
        {isSimulating && (
          <div className="flex flex-col items-center justify-center py-20 animate-fade-in-up">
            <div className="relative">
               {/* Shadow */}
               <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-8 w-24 h-4 bg-black/10 blur-xl rounded-full animate-pulse"></div>
               {/* Die */}
               <div className="text-indigo-600 animate-tumble">
                 <DieIcon shape={selectedDie.iconShape} className="w-32 h-32 fill-current opacity-90" />
               </div>
            </div>
            <p className="mt-12 text-lg font-medium text-slate-500 animate-pulse">
              Simulando {numRolls.toLocaleString()} lançamentos...
            </p>
          </div>
        )}

        {/* Results Section */}
        {simulationData && !isSimulating && (
          <div className="animate-fade-in-up space-y-8">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                  <BarChart3 className="w-6 h-6 text-indigo-600" />
                  Resultados da Simulação
                </h2>
                <p className="text-slate-500 mt-1">
                  Total de lançamentos: <strong className="text-slate-900">{simulationData.totalRolls.toLocaleString()}</strong> | 
                  Dado: <strong className="text-slate-900">{selectedDie.name}</strong>
                </p>
              </div>
              <div className="hidden md:block text-right text-sm text-slate-400">
                Probabilidade Teórica: <span className="font-mono text-slate-600">{(expectedProbability * 100).toFixed(2)}%</span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Chart Column */}
              <div className="lg:col-span-2">
                <StatisticsChart data={chartData} expectedFrequency={expectedProbability} />
              </div>

              {/* Table Column */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center gap-2">
                  <List className="w-5 h-5 text-slate-500" />
                  <h3 className="font-semibold text-slate-700">Tabela de Frequências</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 text-slate-500 font-medium">
                      <tr>
                        <th className="px-6 py-3">Face</th>
                        <th className="px-6 py-3 text-right">Contagem</th>
                        <th className="px-6 py-3 text-right">Fr. Relativa</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {simulationData.results.map((row) => (
                        <tr key={row.face} className="hover:bg-indigo-50/50 transition-colors">
                          <td className="px-6 py-3 font-medium text-slate-900 flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-xs">
                              {row.face}
                            </span>
                          </td>
                          <td className="px-6 py-3 text-right text-slate-600 font-mono">
                            {row.count.toLocaleString()}
                          </td>
                          <td className="px-6 py-3 text-right font-bold text-indigo-600 font-mono">
                            {(row.frequency * 100).toFixed(2)}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-slate-50 font-semibold text-slate-700 border-t border-slate-200">
                      <tr>
                        <td className="px-6 py-3">Total</td>
                        <td className="px-6 py-3 text-right">{simulationData.totalRolls.toLocaleString()}</td>
                        <td className="px-6 py-3 text-right">100.00%</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

// --- MOUNT ---
const rootElement = document.getElementById('root');
if (rootElement) {
  const root = createRoot(rootElement);
  root.render(<App />);
}