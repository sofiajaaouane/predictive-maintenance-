import React from 'react';
import { AlertTriangle, AlertOctagon, ShieldCheck } from 'lucide-react';

interface RiskDistributionBarProps {
  criticalCount: number;
  warningCount: number;
  normalCount: number;
  total: number;
}

export const RiskDistributionBar: React.FC<RiskDistributionBarProps> = ({
  criticalCount,
  warningCount,
  normalCount,
  total,
}) => {
  const safeTotal = total > 0 ? total : 1;
  const criticalPct = Math.round((criticalCount / safeTotal) * 100);
  const warningPct = Math.round((warningCount / safeTotal) * 100);
  const normalPct = Math.round((normalCount / safeTotal) * 100);

  return (
    <div className="flex flex-col justify-between h-full p-1 space-y-3">
      <div className="flex items-center justify-between pb-2 border-b border-slate-200/80 dark:border-slate-800/80">
        <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-900 dark:text-slate-400">
          FAILURE / RISK DISTRIBUTION
        </span>
        <span className="text-[10px] font-mono text-slate-600 dark:text-slate-400 font-bold">
          {total} Machines
        </span>
      </div>

      <div className="space-y-3 flex-1 flex flex-col justify-center">
        {/* Critical Bar */}
        <div>
          <div className="flex items-center justify-between text-xs font-mono mb-1">
            <span className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400 font-bold">
              <AlertOctagon size={13} />
              CRITIQUE
            </span>
            <span className="text-slate-700 dark:text-slate-300 font-bold">
              {criticalCount} <span className="text-[10px] font-normal text-slate-400">({criticalPct}%)</span>
            </span>
          </div>
          <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-rose-500 rounded-full transition-all duration-700 glow-critical"
              style={{ width: `${criticalPct}%` }}
            />
          </div>
        </div>

        {/* Warning Bar */}
        <div>
          <div className="flex items-center justify-between text-xs font-mono mb-1">
            <span className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-bold">
              <AlertTriangle size={13} />
              ATTENTION
            </span>
            <span className="text-slate-700 dark:text-slate-300 font-bold">
              {warningCount} <span className="text-[10px] font-normal text-slate-400">({warningPct}%)</span>
            </span>
          </div>
          <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-amber-500 rounded-full transition-all duration-700 glow-warning"
              style={{ width: `${warningPct}%` }}
            />
          </div>
        </div>

        {/* Normal Bar */}
        <div>
          <div className="flex items-center justify-between text-xs font-mono mb-1">
            <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold">
              <ShieldCheck size={13} />
              NORMAL
            </span>
            <span className="text-slate-700 dark:text-slate-300 font-bold">
              {normalCount} <span className="text-[10px] font-normal text-slate-400">({normalPct}%)</span>
            </span>
          </div>
          <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-700 glow-normal"
              style={{ width: `${normalPct}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
