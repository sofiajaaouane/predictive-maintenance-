import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Factory,
  Sparkles,
  Bell,
  Activity,
  Zap,
  Server,
} from 'lucide-react';

interface SidebarProps {
  atRiskCount?: number;
  totalAlerts?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({ atRiskCount = 0, totalAlerts = 0 }) => {
  const navItems = [
    { to: '/dashboard', label: 'Vue Globale', icon: LayoutDashboard },
    { to: '/machines', label: 'Parc Machines', icon: Factory, badge: atRiskCount > 0 ? `${atRiskCount} risq.` : undefined },
    { to: '/predictions', label: 'Prédictions ML', icon: Sparkles },
    { to: '/alerts', label: 'Alertes Actives', icon: Bell, badge: totalAlerts > 0 ? `${totalAlerts}` : undefined, badgeColor: 'bg-rose-900/80 text-rose-300' },
    { to: '/ml-pipeline', label: 'Pipeline & Modèle', icon: Activity },
  ];

  return (
    <aside className="w-64 bg-[#0d1322] border-r border-[#1a2333] flex flex-col h-screen shrink-0 sticky top-0">
      {/* Brand Header */}
      <div className="h-16 flex items-center px-6 gap-3 border-b border-[#1a2333]">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
          <Zap size={20} className="text-white fill-white" />
        </div>
        <div>
          <span className="text-base font-extrabold tracking-tight text-white">SENTINEL</span>
          <span className="text-blue-500 text-lg font-extrabold">.</span>
          <span className="block text-[10px] font-medium text-slate-400 uppercase tracking-wider">Predictive Maint.</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto">
        <div className="px-3 pb-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          Supervision Industrielle
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-blue-600/15 text-blue-400 border border-blue-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`
              }
            >
              <div className="flex items-center gap-3">
                <Icon size={18} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className={`text-[11px] px-2 py-0.5 rounded-full font-bold border ${item.badgeColor || 'bg-blue-950/80 text-blue-300 border-blue-800/50'}`}>
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* System Status Footer */}
      <div className="p-4 border-t border-[#1a2333] bg-[#0b0f19]">
        <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/60">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-semibold text-slate-200 truncate flex items-center gap-1.5">
              <Server size={12} className="text-slate-400" />
              API Spring Boot
            </div>
            <div className="text-[11px] text-slate-400">PostgreSQL connecté</div>
          </div>
        </div>
      </div>
    </aside>
  );
};
