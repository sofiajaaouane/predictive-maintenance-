import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Factory,
  Sparkles,
  Bell,
  Activity,
  Cpu,
  Sun,
  Moon,
  User,
  LogOut,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface SidebarProps {
  atRiskCount?: number;
  totalAlerts?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({ atRiskCount = 0, totalAlerts = 0 }) => {
  const { isDark, toggleTheme } = useTheme();

  const navItems = [
    { to: '/dashboard', label: 'Vue Globale', icon: LayoutDashboard },
    { to: '/machines', label: 'Parc Machines', icon: Factory, badge: atRiskCount > 0 ? `${atRiskCount} risq.` : undefined },
    { to: '/predictions', label: 'Prédictions ML', icon: Sparkles },
    { to: '/alerts', label: 'Alertes Actives', icon: Bell, badge: totalAlerts > 0 ? `${totalAlerts}` : undefined, badgeColor: 'bg-rose-100 text-rose-700 dark:bg-rose-950/80 dark:text-rose-300' },
    { to: '/ml-pipeline', label: 'Pipeline & Modèle', icon: Activity },
  ];

  return (
    <aside className="w-64 bg-[#f0f4f9] dark:bg-[#090d16] border-r border-slate-300/80 dark:border-[#1a2333] flex flex-col h-screen shrink-0 sticky top-0 transition-colors duration-200 z-40 shadow-xs">
      {/* Brand Header */}
      <div className="h-16 flex items-center px-5 gap-3 border-b border-slate-300/80 dark:border-[#1a2333] bg-white/60 dark:bg-transparent">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 flex items-center justify-center shadow-md shadow-blue-500/20 text-white shrink-0">
          <Cpu size={20} />
        </div>
        <div className="min-w-0">
          <div className="text-xs font-mono font-extrabold tracking-tight text-slate-950 dark:text-white truncate">
            predictive-maintenance
          </div>
          <span className="block text-[9px] font-mono font-bold text-blue-700 dark:text-blue-400 uppercase tracking-widest">
            Control Center
          </span>
        </div>
      </div>

      {/* User Profile Card (Top of Sidebar) */}
      <div className="px-4 py-3 mx-3 mt-3.5 rounded-2xl bg-white dark:bg-[#0e1524] border border-slate-300/90 dark:border-[#1c2842] flex items-center gap-3 shadow-xs">
        <div className="relative">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-mono font-bold text-sm shadow-xs">
            <User size={18} />
          </div>
          <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white dark:border-[#0e1524]" title="En ligne" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-xs font-mono font-extrabold text-slate-950 dark:text-white truncate">
            Admin
          </div>
          <div className="text-[10px] text-slate-600 dark:text-slate-400 font-sans truncate flex items-center gap-1 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block shrink-0" />
            Session active
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-mono font-extrabold text-slate-700 dark:text-slate-400 uppercase tracking-wider">
          Supervision Industrielle
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm border border-blue-700 dark:bg-blue-600/15 dark:text-blue-400 dark:border-blue-500/30'
                    : 'text-slate-800 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-slate-200/90 dark:hover:bg-slate-800/40'
                }`
              }
            >
              <div className="flex items-center gap-3">
                <Icon size={16} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold border ${item.badgeColor || 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-950/80 dark:text-blue-300 dark:border-blue-800/50'}`}>
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer Theme Toggle & Logout */}
      <div className="p-3 border-t border-slate-300/80 dark:border-[#1a2333] bg-[#e5ebf3] dark:bg-[#070a12] space-y-2">
        {/* Dark / Light Mode Switch */}
        <button
          onClick={toggleTheme}
          className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900/60 border border-slate-300 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-2xs"
        >
          <div className="flex items-center gap-2">
            {isDark ? <Moon size={14} className="text-indigo-400" /> : <Sun size={14} className="text-amber-500" />}
            <span>{isDark ? 'Mode Sombre' : 'Mode Clair'}</span>
          </div>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-400 font-bold">
            {isDark ? 'DARK' : 'LIGHT'}
          </span>
        </button>

        {/* Logout Button */}
        <button
          type="button"
          onClick={() => {
            window.location.href = '/dashboard';
          }}
          className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-white dark:bg-slate-900/40 border border-slate-300 dark:border-slate-800/80 hover:border-rose-400 dark:hover:border-rose-800/60 text-xs font-bold text-slate-800 dark:text-slate-300 hover:text-rose-700 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-all shadow-2xs group"
        >
          <LogOut size={14} className="group-hover:-translate-x-0.5 transition-transform text-slate-500 group-hover:text-rose-600" />
          <span>Se déconnecter</span>
        </button>
      </div>
    </aside>
  );
};

