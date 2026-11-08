import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Maintenance } from '../../types';
import { formatDate } from '../../utils/dateUtils';
import { Wrench, Calendar, ChevronRight } from 'lucide-react';

interface MaintenanceTimelineProps {
  maintenanceList: Maintenance[];
}

export const MaintenanceTimeline: React.FC<MaintenanceTimelineProps> = ({ maintenanceList }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-[#f8fafc] dark:bg-[#0e1524] border border-slate-300/80 dark:border-[#1c2842] rounded-2xl p-5 shadow-xs flex flex-col h-full">
      <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 dark:border-slate-800/80 mb-3">
        <div className="flex items-center gap-2">
          <Wrench size={16} className="text-indigo-500" />
          <h3 className="text-xs font-mono font-bold tracking-wider uppercase text-slate-900 dark:text-slate-200">
            MAINTENANCE HISTORY
          </h3>
        </div>
        <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 font-semibold">
          Derniers Services
        </span>
      </div>

      <div className="space-y-3 flex-1 overflow-y-auto max-h-[340px] pr-1">
        {maintenanceList && maintenanceList.length > 0 ? (
          maintenanceList.map((m) => (
            <div
              key={m.id}
              onClick={() => m.machineId && navigate(`/machines/${m.machineId}`)}
              className="p-3 rounded-xl bg-white dark:bg-[#131b2e] border border-slate-200/90 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500/50 cursor-pointer transition-all flex items-start justify-between gap-3 shadow-2xs group"
            >
              <div className="flex items-start gap-2.5 min-w-0">
                <div className="mt-0.5 w-2 h-2 rounded-full bg-indigo-500 shrink-0" />
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-xs font-mono font-bold text-slate-900 dark:text-white">
                      {m.machineIdentifier}
                    </span>
                    <span className="text-[10px] font-mono uppercase font-bold px-1.5 py-0.2 rounded bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/50">
                      {m.component.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-1 font-medium">
                    {m.description || 'Inspection et remplacement préventif'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 text-right">
                <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                  <Calendar size={11} />
                  {formatDate(m.maintenanceDate).split(' ')[0]}
                </span>
                <ChevronRight size={14} className="text-slate-400 group-hover:text-indigo-500 transition-colors" />
              </div>
            </div>
          ))
        ) : (
          <p className="text-xs text-slate-400 py-8 text-center">Aucune intervention enregistrée.</p>
        )}
      </div>
    </div>
  );
};
