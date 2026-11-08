import React from 'react';
import { ShieldCheck, AlertTriangle } from 'lucide-react';

interface EquipmentHealthGaugeProps {
  totalMachines: number;
  normalMachines: number;
  atRiskMachines: number;
}

export const EquipmentHealthGauge: React.FC<EquipmentHealthGaugeProps> = ({
  totalMachines,
  normalMachines,
  atRiskMachines,
}) => {
  const percentage = totalMachines > 0 ? Math.round((normalMachines / totalMachines) * 100) : 100;
  const radius = 54;
  const strokeWidth = 10;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center p-2">
      <div className="relative w-36 h-36 flex items-center justify-center">
        {/* SVG Circular Progress */}
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 130 130">
          {/* Background circle */}
          <circle
            cx="65"
            cy="65"
            r={radius}
            className="stroke-slate-200 dark:stroke-slate-800/80 fill-none"
            strokeWidth={strokeWidth}
          />
          {/* Progress circle */}
          <circle
            cx="65"
            cy="65"
            r={radius}
            className="stroke-emerald-500 fill-none transition-all duration-1000 ease-out"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-3xl font-extrabold font-mono text-slate-900 dark:text-white tracking-tight">
            {percentage}<span className="text-base font-sans text-emerald-500">%</span>
          </span>
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-400">
            Nominal
          </span>
        </div>
      </div>

      {/* Metric Breakdown Badges */}
      <div className="grid grid-cols-2 gap-3 w-full mt-4 pt-3 border-t border-slate-200 dark:border-slate-800/80 text-xs">
        <div className="flex items-center gap-2 p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40">
          <ShieldCheck size={14} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
          <div>
            <div className="font-mono font-bold text-slate-900 dark:text-emerald-400">{normalMachines}</div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400 leading-none">Nominales</div>
          </div>
        </div>

        <div className="flex items-center gap-2 p-2 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/40">
          <AlertTriangle size={14} className="text-rose-600 dark:text-rose-400 shrink-0" />
          <div>
            <div className="font-mono font-bold text-slate-900 dark:text-rose-400">{atRiskMachines}</div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400 leading-none">À Risque</div>
          </div>
        </div>
      </div>
    </div>
  );
};
