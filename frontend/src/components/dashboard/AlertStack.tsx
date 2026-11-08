import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MachineError } from '../../types';
import { formatTimeAgo } from '../../utils/dateUtils';
import { AlertCircle, ChevronRight } from 'lucide-react';

interface AlertStackProps {
  errors: MachineError[];
}

export const AlertStack: React.FC<AlertStackProps> = ({ errors }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-[#f8fafc] dark:bg-[#0e1524] border border-slate-300/80 dark:border-[#1c2842] rounded-2xl p-5 shadow-xs flex flex-col h-full">
      <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 dark:border-slate-800/80 mb-3">
        <div className="flex items-center gap-2">
          <AlertCircle size={16} className="text-amber-500" />
          <h3 className="text-xs font-mono font-bold tracking-wider uppercase text-slate-900 dark:text-slate-200">
            ALERT STACK
          </h3>
        </div>
        <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 font-semibold">
          {errors.length} Événements
        </span>
      </div>

      <div className="space-y-2.5 flex-1 overflow-y-auto max-h-[340px] pr-1">
        {errors && errors.length > 0 ? (
          errors.map((err, idx) => {
            const isCritical = err.errorCode === 'error3' || err.errorCode === 'error4' || idx === 0;
            return (
              <div
                key={err.id}
                onClick={() => err.machineId && navigate(`/machines/${err.machineId}`)}
                className="p-3 rounded-xl bg-white dark:bg-[#131b2e] border border-slate-200/90 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-500/50 cursor-pointer transition-all flex items-start justify-between gap-3 shadow-2xs group"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold tracking-tight ${
                        isCritical
                          ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/80 dark:text-rose-300 border border-rose-200 dark:border-rose-800/50'
                          : 'bg-amber-100 text-amber-700 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-200 dark:border-amber-800/50'
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                      {isCritical ? 'CRITICAL' : 'WARNING'}
                    </span>

                    <span className="text-xs font-mono font-bold text-slate-900 dark:text-blue-300">
                      {err.machineIdentifier}
                    </span>

                    <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                      · {err.errorCode}
                    </span>
                  </div>

                  <p className="text-xs text-slate-700 dark:text-slate-300 line-clamp-1 font-medium">
                    {err.description}
                  </p>
                </div>

                <div className="flex flex-col items-end shrink-0">
                  <span className="text-[10px] font-mono text-slate-400">
                    {formatTimeAgo(err.timestamp)}
                  </span>
                  <ChevronRight size={14} className="text-slate-400 group-hover:text-blue-500 mt-1 transition-colors" />
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-xs text-slate-400 py-8 text-center">Aucune alerte récente dans la pile.</p>
        )}
      </div>
    </div>
  );
};
