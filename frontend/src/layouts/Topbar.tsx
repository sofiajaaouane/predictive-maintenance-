import React from 'react';
import { RefreshCw, Activity } from 'lucide-react';

interface TopbarProps {
  title: string;
  subtitle?: string;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export const Topbar: React.FC<TopbarProps> = ({
  title,
  subtitle,
  onRefresh,
  isRefreshing = false,
}) => {
  return (
    <header className="h-16 bg-[#090d16]/80 backdrop-blur-md border-b border-[#1a2333] px-8 flex items-center justify-between sticky top-0 z-30">
      <div>
        <h1 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
          {title}
        </h1>
        {subtitle && <p className="text-xs text-slate-400">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-3">
        {onRefresh && (
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-900 border border-slate-700 hover:bg-slate-800 text-slate-200 transition-all disabled:opacity-50"
            title="Recharger les données depuis l'API Spring Boot"
          >
            <RefreshCw size={13} className={isRefreshing ? 'animate-spin text-blue-400' : 'text-slate-400'} />
            <span>Actualiser</span>
          </button>
        )}

        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950/60 border border-blue-800/40 text-[11px] font-medium text-blue-300">
          <Activity size={12} className="text-blue-400" />
          <span>Azure PM Dataset</span>
        </div>
      </div>
    </header>
  );
};
