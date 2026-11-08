import React from 'react';
import { RefreshCw, Activity, Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

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
  const { isDark, toggleTheme } = useTheme();

  return (
    <header className="h-16 bg-white/90 dark:bg-[#080c14]/90 backdrop-blur-md border-b border-slate-200 dark:border-[#1a2333] px-6 sm:px-8 flex items-center justify-between sticky top-0 z-30 transition-colors duration-200">
      <div>
        <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2 font-mono">
          {title}
        </h1>
        {subtitle && (
          <p className="text-[11px] text-slate-500 dark:text-slate-400 font-sans">{subtitle}</p>
        )}
      </div>

      <div className="flex items-center gap-2.5">
        {/* Quick Theme Switcher Button */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-all"
          title={isDark ? 'Passer en mode clair (White mode)' : 'Passer en mode sombre'}
        >
          {isDark ? <Sun size={15} className="text-amber-400" /> : <Moon size={15} className="text-indigo-600" />}
        </button>

        {/* Refresh Button */}
        {onRefresh && (
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-semibold bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition-all disabled:opacity-50"
            title="Recharger les données depuis l'API Spring Boot"
          >
            <RefreshCw size={13} className={isRefreshing ? 'animate-spin text-blue-500' : 'text-slate-400'} />
            <span className="hidden sm:inline">Actualiser</span>
          </button>
        )}

        <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/40 text-[10px] font-mono font-bold text-emerald-700 dark:text-emerald-300">
          <Activity size={12} className="text-emerald-500" />
          <span>Système Actif</span>
        </div>
      </div>
    </header>
  );
};
