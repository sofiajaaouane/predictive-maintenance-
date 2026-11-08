import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Alert } from '../../types';
import { ComponentBadge, StatusBadge } from '../common/Badge';
import { ChevronRight } from 'lucide-react';

interface MachineRiskRowProps {
  alert: Alert;
}

export const MachineRiskRow: React.FC<MachineRiskRowProps> = ({ alert }) => {
  const navigate = useNavigate();
  const probPercent = Math.round(alert.probability * 100);
  const isCritical = alert.status === 'CRITICAL' || probPercent >= 80;

  return (
    <div
      onClick={() => navigate(`/machines/${alert.machineId}`)}
      className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#131b2e] border border-slate-200 dark:border-slate-800/90 hover:border-blue-400 dark:hover:border-blue-500/50 cursor-pointer transition-all flex items-center justify-between gap-4 group"
    >
      {/* Machine Identifier & Specs */}
      <div className="flex items-center gap-3 min-w-[150px]">
        <span
          className={`w-2 h-2 rounded-full shrink-0 ${
            isCritical ? 'bg-rose-500 animate-ping' : 'bg-amber-500'
          }`}
        />
        <div>
          <div className="font-mono font-bold text-sm text-slate-900 dark:text-white group-hover:text-blue-500 transition-colors">
            {alert.machineIdentifier}
          </div>
          <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
            {alert.model} · <span className="font-sans">{alert.age} ans</span>
          </div>
        </div>
      </div>

      {/* Component Badge */}
      <div className="hidden sm:block">
        <ComponentBadge component={alert.predictedComponent} />
      </div>

      {/* Visual Probability Bar */}
      <div className="flex-1 max-w-[180px] hidden md:block">
        <div className="flex items-center justify-between text-[11px] font-mono mb-1">
          <span className="text-slate-400">Risque Panne</span>
          <span className={`font-bold ${isCritical ? 'text-rose-500 dark:text-rose-400' : 'text-amber-500 dark:text-amber-400'}`}>
            {probPercent}%
          </span>
        </div>
        <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              isCritical ? 'bg-rose-500' : 'bg-amber-500'
            }`}
            style={{ width: `${probPercent}%` }}
          />
        </div>
      </div>

      {/* Status Badge & Action */}
      <div className="flex items-center gap-3 shrink-0">
        <StatusBadge status={alert.status} />
        <ChevronRight size={16} className="text-slate-400 group-hover:text-blue-500 transition-colors" />
      </div>
    </div>
  );
};
