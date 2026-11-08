import React, { useState } from 'react';
import { Telemetry } from '../../types';
import { Activity, Zap, RotateCw, Gauge, Waves } from 'lucide-react';

interface TelemetryChartProps {
  telemetryData: Telemetry[];
  period: '6h' | '24h' | '7d';
  onPeriodChange: (period: '6h' | '24h' | '7d') => void;
  isLoading?: boolean;
}

type MetricType = 'all' | 'voltage' | 'rotation' | 'pressure' | 'vibration';

export const TelemetryChart: React.FC<TelemetryChartProps> = ({
  telemetryData,
  period,
  onPeriodChange,
  isLoading,
}) => {
  const [selectedMetric, setSelectedMetric] = useState<MetricType>('all');

  if (isLoading) {
    return (
      <div className="h-64 flex items-center justify-center bg-slate-900/40 rounded-xl border border-slate-800/60">
        <span className="text-sm text-slate-400">Chargement de la télémétrie...</span>
      </div>
    );
  }

  if (!telemetryData || telemetryData.length === 0) {
    return (
      <div className="h-64 flex flex-col items-center justify-center bg-slate-900/40 rounded-xl border border-slate-800/60 text-slate-500">
        <Activity size={32} className="mb-2 opacity-40" />
        <p className="text-sm">Aucune mesure de télémétrie enregistrée pour cette période.</p>
      </div>
    );
  }

  // Calculate stats
  const latest = telemetryData[telemetryData.length - 1];

  // Helper to normalize values to 0-100 for SVG path plotting
  const renderSvgLine = (values: number[], color: string, id: string) => {
    if (values.length === 0) return null;
    const min = Math.min(...values) * 0.95;
    const max = Math.max(...values) * 1.05 || min + 1;
    const range = max - min;

    const points = values.map((val, idx) => {
      const x = values.length > 1 ? (idx / (values.length - 1)) * 100 : 50;
      const y = 100 - ((val - min) / range) * 80 - 10; // keep within 10-90% height
      return `${x},${y}`;
    }).join(' ');

    return (
      <g key={id}>
        <polyline
          fill="none"
          stroke={color}
          strokeWidth="2.5"
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
              r="3.5"
              fill={color}
              className="hover:r-5 transition-all cursor-pointer"
            >
              <title>{`${val.toFixed(1)} (${new Date(telemetryData[idx]?.timestamp).toLocaleTimeString()})`}</title>
            </circle>
          );
        })}
      </g>
    );
  };

  const voltages = telemetryData.map((d) => d.voltage);
  const rotations = telemetryData.map((d) => d.rotation);
  const pressures = telemetryData.map((d) => d.pressure);
  const vibrations = telemetryData.map((d) => d.vibration);

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
      {/* Header with period selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <Activity size={18} className="text-blue-400" />
            Signaux de Télémétrie Capteurs
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Évolution temporelle des 4 grandeurs physiques de la machine
          </p>
        </div>

        {/* Period Buttons */}
        <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 self-start sm:self-auto">
          {(['6h', '24h', '7d'] as const).map((p) => (
            <button
              key={p}
              onClick={() => onPeriodChange(p)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                period === p
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {p === '6h' ? '6 Heures' : p === '24h' ? '24 Heures' : '7 Jours'}
            </button>
          ))}
        </div>
      </div>

      {/* Metric summary pills */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <button
          onClick={() => setSelectedMetric(selectedMetric === 'voltage' ? 'all' : 'voltage')}
          className={`p-3 rounded-xl border text-left transition-all ${
            selectedMetric === 'voltage' || selectedMetric === 'all'
              ? 'bg-blue-950/40 border-blue-800/80 text-blue-300'
              : 'bg-slate-900/30 border-slate-800/40 text-slate-400 opacity-60'
          }`}
        >
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="flex items-center gap-1 font-medium"><Zap size={13} className="text-blue-400" /> Tension</span>
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
          </div>
          <div className="text-lg font-mono font-bold text-slate-100">{latest?.voltage?.toFixed(1)} <small className="text-xs font-sans text-slate-400">V</small></div>
        </button>

        <button
          onClick={() => setSelectedMetric(selectedMetric === 'rotation' ? 'all' : 'rotation')}
          className={`p-3 rounded-xl border text-left transition-all ${
            selectedMetric === 'rotation' || selectedMetric === 'all'
              ? 'bg-indigo-950/40 border-indigo-800/80 text-indigo-300'
              : 'bg-slate-900/30 border-slate-800/40 text-slate-400 opacity-60'
          }`}
        >
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="flex items-center gap-1 font-medium"><RotateCw size={13} className="text-indigo-400" /> Rotation</span>
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span>
          </div>
          <div className="text-lg font-mono font-bold text-slate-100">{latest?.rotation?.toFixed(1)} <small className="text-xs font-sans text-slate-400">RPM</small></div>
        </button>

        <button
          onClick={() => setSelectedMetric(selectedMetric === 'pressure' ? 'all' : 'pressure')}
          className={`p-3 rounded-xl border text-left transition-all ${
            selectedMetric === 'pressure' || selectedMetric === 'all'
              ? 'bg-amber-950/40 border-amber-800/80 text-amber-300'
              : 'bg-slate-900/30 border-slate-800/40 text-slate-400 opacity-60'
          }`}
        >
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="flex items-center gap-1 font-medium"><Gauge size={13} className="text-amber-400" /> Pression</span>
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
          </div>
          <div className="text-lg font-mono font-bold text-slate-100">{latest?.pressure?.toFixed(1)} <small className="text-xs font-sans text-slate-400">psi</small></div>
        </button>

        <button
          onClick={() => setSelectedMetric(selectedMetric === 'vibration' ? 'all' : 'vibration')}
          className={`p-3 rounded-xl border text-left transition-all ${
            selectedMetric === 'vibration' || selectedMetric === 'all'
              ? 'bg-rose-950/40 border-rose-800/80 text-rose-300'
              : 'bg-slate-900/30 border-slate-800/40 text-slate-400 opacity-60'
          }`}
        >
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="flex items-center gap-1 font-medium"><Waves size={13} className="text-rose-400" /> Vibration</span>
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
          </div>
          <div className="text-lg font-mono font-bold text-slate-100">{latest?.vibration?.toFixed(1)} <small className="text-xs font-sans text-slate-400">mm/s</small></div>
        </button>
      </div>

      {/* SVG Chart Area */}
      <div className="relative w-full h-56 bg-slate-950/80 rounded-xl p-4 border border-slate-800/80">
        {/* Horizontal grid lines */}
        <div className="absolute inset-x-4 inset-y-4 flex flex-col justify-between pointer-events-none opacity-20">
          <div className="border-b border-slate-600 w-full"></div>
          <div className="border-b border-slate-600 w-full"></div>
          <div className="border-b border-slate-600 w-full"></div>
          <div className="border-b border-slate-600 w-full"></div>
        </div>

        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full overflow-visible">
          {(selectedMetric === 'all' || selectedMetric === 'voltage') &&
            renderSvgLine(voltages, '#3b82f6', 'v')}
          {(selectedMetric === 'all' || selectedMetric === 'rotation') &&
            renderSvgLine(rotations, '#6366f1', 'r')}
          {(selectedMetric === 'all' || selectedMetric === 'pressure') &&
            renderSvgLine(pressures, '#f59e0b', 'p')}
          {(selectedMetric === 'all' || selectedMetric === 'vibration') &&
            renderSvgLine(vibrations, '#f43f5e', 'vib')}
        </svg>

        {/* X Axis labels */}
        <div className="flex justify-between text-[11px] text-slate-500 mt-2 font-mono">
          <span>{new Date(telemetryData[0]?.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          <span>{period === '6h' ? '−3h' : period === '24h' ? '−12h' : '−3j'}</span>
          <span>Maintenant ({new Date(latest?.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})</span>
        </div>
      </div>
    </div>
  );
};
