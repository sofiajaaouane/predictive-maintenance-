import React from 'react';
import { TrendingUp, Activity } from 'lucide-react';

interface ConditionTrendChartProps {
  dataPoints: { time: string; value: number }[];
  period: '6h' | '24h' | '7d';
  onPeriodChange?: (period: '6h' | '24h' | '7d') => void;
  title?: string;
  subtitle?: string;
}

export const ConditionTrendChart: React.FC<ConditionTrendChartProps> = ({
  dataPoints,
  period,
  onPeriodChange,
  title = 'Condition Trend',
  subtitle = 'Évolution de la dégradation et indice de stabilité au cours du temps',
}) => {
  if (!dataPoints || dataPoints.length === 0) {
    return (
      <div className="h-56 flex flex-col items-center justify-center bg-slate-50 dark:bg-[#080c14] rounded-xl border border-slate-200 dark:border-slate-800 text-slate-400">
        <Activity size={24} className="mb-1 opacity-30" />
        <span className="text-xs font-mono">Données de tendance en cours de calcul...</span>
      </div>
    );
  }

  const values = dataPoints.map((d) => d.value);
  const min = Math.min(...values) * 0.95;
  const max = Math.max(...values) * 1.05 || min + 1;
  const range = max - min;

  const points = values
    .map((val, idx) => {
      const x = values.length > 1 ? (idx / (values.length - 1)) * 100 : 50;
      const y = 100 - ((val - min) / range) * 75 - 15;
      return `${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(' ');

  const latestVal = values[values.length - 1];

  return (
    <div className="bg-[#f8fafc] dark:bg-[#0e1524] border border-slate-300/80 dark:border-[#1c2842] rounded-2xl p-5 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-3 border-b border-slate-200/80 dark:border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <TrendingUp size={16} className="text-indigo-500" />
            <h3 className="text-xs font-mono font-bold tracking-wider uppercase text-slate-950 dark:text-slate-200">
              {title}
            </h3>
          </div>
          <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5 font-medium">{subtitle}</p>
        </div>

        {onPeriodChange && (
          <div className="flex items-center bg-slate-100 dark:bg-[#080c14] p-1 rounded-xl border border-slate-200 dark:border-slate-800 self-start sm:self-auto">
            {(['6h', '24h', '7d'] as const).map((p) => (
              <button
                key={p}
                onClick={() => onPeriodChange(p)}
                className={`px-2.5 py-1 text-xs font-mono font-semibold rounded-lg transition-all ${
                  period === p
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {p.toUpperCase()}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="relative w-full h-44 bg-slate-50/50 dark:bg-[#080c14]/90 rounded-xl p-3 border border-slate-200 dark:border-slate-800/80 industrial-grid">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full overflow-visible">
          <defs>
            <linearGradient id="trend-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6366f1" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Fill Area */}
          <polygon points={`0,100 ${points} 100,100`} fill="url(#trend-fill)" />

          {/* Trend Line */}
          <polyline
            fill="none"
            stroke="#6366f1"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={points}
            vectorEffect="non-scaling-stroke"
          />

          {/* Points */}
          {values.map((val, idx) => {
            const x = values.length > 1 ? (idx / (values.length - 1)) * 100 : 50;
            const y = 100 - ((val - min) / range) * 75 - 15;
            const isLast = idx === values.length - 1;
            return (
              <circle
                key={idx}
                cx={x}
                cy={y}
                r={isLast ? '4' : '2.5'}
                fill={isLast ? '#818cf8' : '#6366f1'}
                className={isLast ? 'animate-pulse' : ''}
              >
                <title>{`${val.toFixed(1)} (${dataPoints[idx]?.time || ''})`}</title>
              </circle>
            );
          })}
        </svg>

        <div className="flex justify-between text-[10px] font-mono text-slate-400 mt-2">
          <span>{dataPoints[0]?.time || 'Passé'}</span>
          <span className="text-indigo-500 font-bold">Actuel : {latestVal?.toFixed(1)}</span>
          <span>Maintenant</span>
        </div>
      </div>
    </div>
  );
};
