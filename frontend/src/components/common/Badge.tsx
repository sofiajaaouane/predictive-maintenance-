import React from 'react';
import { ShieldCheck, AlertTriangle, AlertOctagon } from 'lucide-react';
import { PredictedComponent, PredictionStatus, RiskLevel } from '../../types';

interface ComponentBadgeProps {
  component: PredictedComponent | string;
  probability?: number;
  showIcon?: boolean;
}

export const ComponentBadge: React.FC<ComponentBadgeProps> = ({ component, probability, showIcon = true }) => {
  const normComp = component?.toLowerCase() || 'none';

  if (normComp === 'none') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-950/70 text-emerald-400 border border-emerald-800/50">
        {showIcon && <ShieldCheck size={13} className="text-emerald-400" />}
        <span>Aucun risque</span>
      </span>
    );
  }

  const colorMap: Record<string, string> = {
    comp1: 'bg-indigo-950/70 text-indigo-300 border-indigo-700/50',
    comp2: 'bg-amber-950/70 text-amber-300 border-amber-700/50',
    comp3: 'bg-rose-950/70 text-rose-300 border-rose-700/50',
    comp4: 'bg-purple-950/70 text-purple-300 border-purple-700/50',
  };

  const badgeClass = colorMap[normComp] || 'bg-slate-800 text-slate-300 border-slate-700';

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${badgeClass}`}>
      {showIcon && <AlertTriangle size={13} />}
      <span>{normComp.toUpperCase()}</span>
      {probability !== undefined && (
        <span className="opacity-80 font-mono">({Math.round(probability * 100)}%)</span>
      )}
    </span>
  );
};

interface StatusBadgeProps {
  status: PredictionStatus | RiskLevel | string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const normStatus = status?.toUpperCase() || 'NORMAL';

  if (normStatus === 'NORMAL') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-950/60 text-emerald-400 border border-emerald-800/40">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
        NORMAL
      </span>
    );
  }

  if (normStatus === 'WARNING') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-950/60 text-amber-400 border border-amber-800/40">
        <AlertTriangle size={12} />
        ATTENTION
      </span>
    );
  }

  if (normStatus === 'CRITICAL' || normStatus === 'AT_RISK') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-rose-950/70 text-rose-400 border border-rose-800/50 animate-pulse">
        <AlertOctagon size={12} />
        {normStatus === 'CRITICAL' ? 'CRITIQUE' : 'À RISQUE'}
      </span>
    );
  }

  return (
    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">
      {status}
    </span>
  );
};
