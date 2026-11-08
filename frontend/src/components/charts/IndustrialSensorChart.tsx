import React, { useState } from 'react';
import { Telemetry } from '../../types';
import { Activity, Waves, Gauge, Zap, RotateCw } from 'lucide-react';

interface IndustrialSensorChartProps {
  telemetryData: Telemetry[];
  period: '6h' | '24h' | '7d';
  onPeriodChange: (period: '6h' | '24h' | '7d') => void;
  isLoading?: boolean;
  title?: string;
  subtitle?: string;
}

type Channel = 'vibration' | 'pressure' | 'voltage' | 'rotation' | 'all';

export const IndustrialSensorChart: React.FC<IndustrialSensorChartProps> = ({
  telemetryData,
  period,
  onPeriodChange,
  isLoading = false,
  title = 'SENSOR & VIBRATION ANALYSIS',
  subtitle = 'Évolution des grandeurs physiques de télémétrie',
}) => {
  const [activeChannel, setActiveChannel] = useState<Channel>('vibration');

  if (isLoading) {
    return (
      <div className="h-72 flex items-center justify-center bg-slate-50 dark:bg-[#0e1524] rounded-2xl border border-slate-200 dark:border-[#1c2842]">
        <span className="text-xs text-slate-400 font-mono">Chargement des signaux de télémétrie...</span>
      </div>
    );
  }

  if (!telemetryData || telemetryData.length === 0) {
    return (
      <div className="h-72 flex flex-col items-center justify-center bg-slate-50 dark:bg-[#0e1524] rounded-2xl border border-slate-200 dark:border-[#1c2842] text-slate-400">
        <Activity size={28} className="mb-2 opacity-30" />
        <p className="text-xs font-mono">Aucun flux de capteur pour cette période.</p>
      </div>
    );
  }

  const latest = telemetryData[telemetryData.length - 1];

  const channelsConfig = {
    vibration: { label: 'Vibration', unit: 'mm/s', color: '#f43f5e', icon: Waves, values: telemetryData.map((d) => d.vibration), latest: latest?.vibration },
    pressure: { label: 'Pression', unit: 'psi', color: '#f59e0b', icon: Gauge, values: telemetryData.map((d) => d.pressure), latest: latest?.pressure },
    voltage: { label: 'Tension', unit: 'V', color: '#0ea5e9', icon: Zap, values: telemetryData.map((d) => d.voltage), latest: latest?.voltage },
    rotation: { label: 'Rotation', unit: 'RPM', color: '#6366f1', icon: RotateCw, values: telemetryData.map((d) => d.rotation), latest: latest?.rotation },
  };

  const renderPath = (values: number[], color: string, id: string) => {
    if (!values || values.length === 0) return null;
    const min = Math.min(...values) * 0.95;
    const max = Math.max(...values) * 1.05 || min + 1;
    const range = max - min;

    const points = values.map((val, idx) => {
      const x = values.length > 1 ? (idx / (values.length - 1)) * 100 : 50;
      const y = 100 - ((val - min) / range) * 80 - 10;
      return `${x.toFixed(2)},${y.toFixed(2)}`;
    }).join(' ');

    const firstX = 0;
    const lastX = 100;
    const areaPoints = `${firstX},100 ${points} ${lastX},100`;

    return (
      <g key={id}>
        <defs>
          <linearGradient id={`grad-${id}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.25" />
            <stop offset="100%" stopColor={color} stopOpacity="0.0" />
          </linearGradient>
        </defs>
        <polygon points={areaPoints} fill={`url(#grad-${id})`} />
        <polyline
          fill="none"
          stroke={color}
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
          vectorEffect="non-scaling-stroke"
        />
        {values.map((val, idx) => {
          const x = values.length > 1 ? (idx / (values.length - 1)) * 100 : 50;
          const y = 100 - ((val - min) / range) * 80 - 10;
          return (
            <circle
              key={idx}
              cx={x}
              cy={y}
              r="3"
              fill={color}
              className="transition-all cursor-pointer hover:r-4"
            >
              <title>{`${val.toFixed(1)} ${channelsConfig[activeChannel === 'all' ? 'vibration' : activeChannel]?.unit || ''}`}</title>
            </circle>
          );
        })}
      </g>
    );
  };

  return (
    <div className="bg-[#f8fafc] dark:bg-[#0e1524] border border-slate-300/80 dark:border-[#1c2842] rounded-2xl p-5 shadow-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-3 border-b border-slate-200/80 dark:border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <Activity size={16} className="text-rose-500" />
            <h3 className="text-xs font-mono font-bold tracking-wider uppercase text-slate-950 dark:text-slate-200">
              {title}
            </h3>
          </div>
          <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5 font-medium">{subtitle}</p>
        </div>

        {/* Period Selector Buttons */}
        <div className="flex items-center bg-slate-100 dark:bg-[#080c14] p-1 rounded-xl border border-slate-200 dark:border-slate-800 self-start sm:self-auto">
          {(['6h', '24h', '7d'] as const).map((p) => (
            <button
              key={p}
              onClick={() => onPeriodChange(p)}
              className={`px-2.5 py-1 text-xs font-mono font-semibold rounded-lg transition-all ${
                period === p
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {p.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Sensor Channel Switchers */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-4">
        {(['vibration', 'pressure', 'voltage', 'rotation'] as const).map((ch) => {
          const cfg = channelsConfig[ch];
          const Icon = cfg.icon;
          const isSelected = activeChannel === ch || activeChannel === 'all';
          return (
            <button
              key={ch}
              onClick={() => setActiveChannel(activeChannel === ch ? 'all' : ch)}
              className={`p-2.5 rounded-xl border text-left transition-all ${
                isSelected
                  ? 'bg-slate-50 dark:bg-[#131b2e] border-slate-300 dark:border-slate-700 shadow-sm'
                  : 'bg-transparent border-slate-200 dark:border-slate-800/60 opacity-50 hover:opacity-80'
              }`}
            >
              <div className="flex items-center justify-between text-[11px] mb-1 font-mono">
                <span className="flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-300">
                  <Icon size={13} style={{ color: cfg.color }} />
                  {cfg.label}
                </span>
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cfg.color }} />
              </div>
              <div className="text-base font-mono font-extrabold text-slate-900 dark:text-white">
                {cfg.latest?.toFixed(1)}{' '}
                <span className="text-[10px] font-sans font-normal text-slate-400">{cfg.unit}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* SVG Canvas */}
      <div className="relative w-full h-52 bg-slate-50/50 dark:bg-[#080c14]/90 rounded-xl p-3 border border-slate-200 dark:border-slate-800/80 industrial-grid">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full overflow-visible">
          {(activeChannel === 'all' || activeChannel === 'vibration') &&
            renderPath(channelsConfig.vibration.values, channelsConfig.vibration.color, 'vib')}
          {(activeChannel === 'all' || activeChannel === 'pressure') &&
            renderPath(channelsConfig.pressure.values, channelsConfig.pressure.color, 'press')}
          {(activeChannel === 'all' || activeChannel === 'voltage') &&
            renderPath(channelsConfig.voltage.values, channelsConfig.voltage.color, 'volt')}
          {(activeChannel === 'all' || activeChannel === 'rotation') &&
            renderPath(channelsConfig.rotation.values, channelsConfig.rotation.color, 'rot')}
        </svg>

        {/* X Axis Time Labels */}
        <div className="flex justify-between text-[10px] font-mono text-slate-400 mt-2">
          <span>{new Date(telemetryData[0]?.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          <span>{period === '6h' ? '−3h' : period === '24h' ? '−12h' : '−3j'}</span>
          <span>Maintenant ({new Date(latest?.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})</span>
        </div>
      </div>
    </div>
  );
};
