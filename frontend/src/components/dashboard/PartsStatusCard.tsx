import React from 'react';
import { Cpu, CheckCircle2, AlertOctagon, AlertTriangle } from 'lucide-react';
import { PredictedComponent, PredictionStatus } from '../../types';

interface PartsStatusCardProps {
  predictedComponent?: PredictedComponent | string;
  status?: PredictionStatus | string;
  probability?: number;
}

export const PartsStatusCard: React.FC<PartsStatusCardProps> = ({
  predictedComponent = 'none',
  status = 'NORMAL',
  probability = 0,
}) => {
  const normComp = predictedComponent?.toLowerCase();
  const isCritical = status?.toUpperCase() === 'CRITICAL';
  const isWarning = status?.toUpperCase() === 'WARNING';

  const components = [
    { id: 'comp1', name: 'Composant 1 (COMP1)', desc: 'Module d\'alimentation & transmission' },
    { id: 'comp2', name: 'Composant 2 (COMP2)', desc: 'Paliers et roulements rotatifs' },
    { id: 'comp3', name: 'Composant 3 (COMP3)', desc: 'Circuit de compression & hydraulique' },
    { id: 'comp4', name: 'Composant 4 (COMP4)', desc: 'Bloc moteur et variateur de vitesse' },
  ];

  return (
    <div className="bg-[#f8fafc] dark:bg-[#0e1524] border border-slate-300/80 dark:border-[#1c2842] rounded-2xl p-5 shadow-xs">
      <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 dark:border-slate-800/80 mb-4">
        <div className="flex items-center gap-2">
          <Cpu size={16} className="text-blue-500" />
          <h3 className="text-xs font-mono font-bold tracking-wider uppercase text-slate-950 dark:text-slate-200">
            PARTS & COMPONENT STATUS
          </h3>
        </div>
        <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 font-semibold">4 Sous-systèmes</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {components.map((c) => {
          const isTargeted = normComp === c.id;
          return (
            <div
              key={c.id}
              className={`p-3 rounded-xl border transition-all shadow-2xs ${
                isTargeted
                  ? isCritical
                    ? 'bg-rose-50/80 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800/70 glow-critical'
                    : 'bg-amber-50/80 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800/70 glow-warning'
                  : 'bg-white dark:bg-[#131b2e] border-slate-200/90 dark:border-slate-800/80'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-mono font-bold text-xs text-slate-900 dark:text-white uppercase">
                  {c.id.toUpperCase()}
                </span>

                {isTargeted ? (
                  isCritical ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 dark:bg-rose-900/80 dark:text-rose-300 border border-rose-200 dark:border-rose-700/50">
                      <AlertOctagon size={11} />
                      RISQUE ÉLEVÉ ({Math.round(probability * 100)}%)
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/80 dark:text-amber-300 border border-amber-200 dark:border-amber-700/50">
                      <AlertTriangle size={11} />
                      ATTENTION ({Math.round(probability * 100)}%)
                    </span>
                  )
                ) : (
                  <span className="inline-flex items-center gap-1 text-[10px] font-mono font-medium text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 size={12} />
                    NOMINAL
                  </span>
                )}
              </div>

              <p className="text-[11px] text-slate-600 dark:text-slate-400 line-clamp-1">{c.desc}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
