import React from 'react';
import { AlertTriangle, AlertOctagon, ShieldCheck } from 'lucide-react';
import { PredictedComponent, PredictionStatus } from '../../types';
import { ComponentBadge } from '../common/Badge';

interface FailureProbabilityGaugeProps {
  machineIdentifier?: string;
  predictedComponent?: PredictedComponent | string;
  probability: number;
  status?: PredictionStatus | string;
  title?: string;
  subtitle?: string;
}

export const FailureProbabilityGauge: React.FC<FailureProbabilityGaugeProps> = ({
  machineIdentifier = 'MCH-007',
  predictedComponent = 'comp3',
  probability = 0.91,
  status = 'CRITICAL',
  title = 'FAILURE PROBABILITY',
  subtitle = 'Risque de défaillance maximal détecté',
}) => {
  const probPercent = Math.round(probability * 100);
  const radius = 56;
  const strokeWidth = 10;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (probability) * circumference;

  const isCritical = status?.toUpperCase() === 'CRITICAL' || probPercent >= 80;
  const isWarning = status?.toUpperCase() === 'WARNING' || (probPercent >= 50 && probPercent < 80);

  const strokeColor = isCritical ? '#ef4444' : isWarning ? '#f59e0b' : '#10b981';
  const glowClass = isCritical ? 'glow-critical' : isWarning ? 'glow-warning' : 'glow-normal';

  return (
    <div className="flex flex-col items-center justify-between h-full p-2">
      <div className="text-center w-full mb-2">
        <span className="text-[11px] font-mono uppercase font-bold tracking-wider text-slate-700 dark:text-slate-400">
          {title}
        </span>
        {machineIdentifier && (
          <div className="text-xs font-mono font-bold text-slate-950 dark:text-white mt-0.5">
            {machineIdentifier}
          </div>
        )}
      </div>

      {/* Radial Gauge */}
      <div className="relative w-36 h-36 flex items-center justify-center my-1">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 134 134">
          <circle
            cx="67"
            cy="67"
            r={radius}
            className="stroke-slate-200 dark:stroke-slate-800/80 fill-none"
            strokeWidth={strokeWidth}
          />
          <circle
            cx="67"
            cy="67"
            r={radius}
            stroke={strokeColor}
            className={`fill-none transition-all duration-1000 ease-out ${glowClass}`}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-3xl font-extrabold font-mono tracking-tight text-slate-900 dark:text-white">
            {probPercent}<span className="text-base font-sans" style={{ color: strokeColor }}>%</span>
          </span>
          <span
            className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full mt-0.5"
            style={{
              backgroundColor: isCritical ? 'rgba(239,68,68,0.15)' : isWarning ? 'rgba(245,158,11,0.15)' : 'rgba(16,185,129,0.15)',
              color: strokeColor,
            }}
          >
            {isCritical ? 'CRITIQUE' : isWarning ? 'ATTENTION' : 'NOMINAL'}
          </span>
        </div>
      </div>

      {/* Component & Status Details */}
      <div className="w-full pt-3 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between text-xs">
        <span className="text-slate-500 dark:text-slate-400">Composant :</span>
        <ComponentBadge component={predictedComponent} showIcon={false} />
      </div>
    </div>
  );
};
