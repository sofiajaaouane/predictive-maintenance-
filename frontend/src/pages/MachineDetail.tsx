import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { machineApi } from '../api/machineApi';
import { telemetryApi } from '../api/telemetryApi';
import { predictionApi } from '../api/predictionApi';
import { maintenanceApi } from '../api/maintenanceApi';
import { errorApi } from '../api/errorApi';
import { Machine, Telemetry, Prediction, Maintenance, MachineError } from '../types';
import { Topbar } from '../layouts/Topbar';
import { ComponentBadge, StatusBadge } from '../components/common/Badge';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { IndustrialSensorChart } from '../components/charts/IndustrialSensorChart';
import { FailureProbabilityGauge } from '../components/charts/FailureProbabilityGauge';
import { ConditionTrendChart } from '../components/charts/ConditionTrendChart';
import { PartsStatusCard } from '../components/dashboard/PartsStatusCard';
import { formatDate } from '../utils/dateUtils';
import {
  ArrowLeft,
  Factory,
  Wrench,
  AlertCircle,
  Clock,
  History,
  ShieldCheck,
  HeartPulse,
} from 'lucide-react';

export const MachineDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const machineId = Number(id);
  const navigate = useNavigate();

  const [machine, setMachine] = useState<Machine | null>(null);
  const [telemetry, setTelemetry] = useState<Telemetry[]>([]);
  const [period, setPeriod] = useState<'6h' | '24h' | '7d'>('24h');
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [maintenanceList, setMaintenanceList] = useState<Maintenance[]>([]);
  const [errorList, setErrorList] = useState<MachineError[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isTelemetryLoading, setIsTelemetryLoading] = useState(false);

  const loadMachineData = async () => {
    if (!machineId || isNaN(machineId)) return;
    try {
      setIsRefreshing(true);
      const [m, p, maint, errs] = await Promise.all([
        machineApi.getById(machineId),
        predictionApi.getByMachineId(machineId),
        maintenanceApi.getByMachineId(machineId),
        errorApi.getByMachineId(machineId),
      ]);
      setMachine(m);
      setPredictions(p);
      setMaintenanceList(maint);
      setErrorList(errs);
    } catch (error) {
      console.error('Erreur chargement détail machine:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const loadTelemetry = async (selectedPeriod: '6h' | '24h' | '7d') => {
    if (!machineId || isNaN(machineId)) return;
    try {
      setIsTelemetryLoading(true);
      const data = await telemetryApi.getHistory(machineId, selectedPeriod);
      setTelemetry(data);
    } catch (error) {
      console.error('Erreur chargement télémétrie:', error);
    } finally {
      setIsTelemetryLoading(false);
    }
  };

  useEffect(() => {
    loadMachineData();
    loadTelemetry(period);
  }, [machineId]);

  const handlePeriodChange = (newPeriod: '6h' | '24h' | '7d') => {
    setPeriod(newPeriod);
    loadTelemetry(newPeriod);
  };

  const latestPrediction = machine?.lastPrediction;
  const isCritical = latestPrediction?.status === 'CRITICAL';
  const isWarning = latestPrediction?.status === 'WARNING';
  const healthScore = isCritical ? 42 : isWarning ? 68 : 96;

  // Condition trend points based on telemetry or prediction history
  const trendPoints = telemetry.map((t) => ({
    time: new Date(t.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    value: 100 - (t.vibration * 0.8 + (t.pressure - 100) * 0.5),
  }));

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-slate-50 dark:bg-[#080c14] transition-colors duration-200">
      <Topbar
        title={`Cockpit Machine : ${machine?.machineIdentifier || '...'}`}
        subtitle="Supervision télémétrique, prédictions ML, historique maintenance & erreurs"
        onRefresh={() => {
          loadMachineData();
          loadTelemetry(period);
        }}
        isRefreshing={isRefreshing}
      />

      <main className="flex-1 p-5 sm:p-8 max-w-[1600px] w-full mx-auto space-y-6">
        {/* Back Button */}
        <button
          onClick={() => navigate('/machines')}
          className="flex items-center gap-2 text-xs font-mono font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft size={15} />
          <span>Retour au parc machines</span>
        </button>

        {isLoading ? (
          <LoadingSpinner text="Chargement du cockpit machine..." />
        ) : !machine ? (
          <div className="p-12 text-center text-slate-400 font-mono text-xs">Machine introuvable.</div>
        ) : (
          <>
            {/* 1. MACHINE HEADER COCKPIT */}
            <div className="bg-[#f8fafc] dark:bg-[#0e1524] border border-slate-300/80 dark:border-[#1c2842] rounded-2xl p-6 shadow-xs">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800/50 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
                    <Factory size={28} />
                  </div>
                  <div>
                    <div className="flex items-center gap-3">
                      <h2 className="text-2xl font-mono font-extrabold text-slate-950 dark:text-white tracking-tight">
                        {machine.machineIdentifier}
                      </h2>
                      <StatusBadge status={machine.riskLevel} />
                    </div>
                    <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-slate-600 dark:text-slate-400 font-mono">
                      <span>Modèle : <strong className="text-slate-950 dark:text-slate-200">{machine.model}</strong></span>
                      <span>•</span>
                      <span>Âge natif : <strong className="text-slate-950 dark:text-slate-200">{machine.age} ans</strong></span>
                      <span>•</span>
                      <span>Enregistrée : <strong className="text-slate-800 dark:text-slate-300 font-sans font-medium">{formatDate(machine.createdAt)}</strong></span>
                    </div>
                  </div>
                </div>

                {/* 3 Quick Cockpit KPI cards */}
                <div className="grid grid-cols-3 gap-3 w-full md:w-auto">
                  {/* Health Score */}
                  <div className="p-3.5 rounded-xl bg-white dark:bg-[#131b2e] border border-slate-200/90 dark:border-slate-800 text-center min-w-[105px] shadow-2xs">
                    <span className="text-[10px] font-mono uppercase text-slate-500 dark:text-slate-400 block mb-0.5 font-bold">HEALTH SCORE</span>
                    <span className={`text-xl font-mono font-extrabold ${isCritical ? 'text-rose-600' : isWarning ? 'text-amber-600' : 'text-emerald-600'}`}>
                      {healthScore}%
                    </span>
                  </div>

                  {/* Failure Probability */}
                  <div className="p-3.5 rounded-xl bg-white dark:bg-[#131b2e] border border-slate-200/90 dark:border-slate-800 text-center min-w-[105px] shadow-2xs">
                    <span className="text-[10px] font-mono uppercase text-slate-500 dark:text-slate-400 block mb-0.5 font-bold">FAILURE PROB.</span>
                    <span className={`text-xl font-mono font-extrabold ${isCritical ? 'text-rose-600' : isWarning ? 'text-amber-600' : 'text-emerald-600'}`}>
                      {Math.round((latestPrediction?.probability || 0.05) * 100)}%
                    </span>
                  </div>

                  {/* Component at Risk */}
                  <div className="p-3.5 rounded-xl bg-white dark:bg-[#131b2e] border border-slate-200/90 dark:border-slate-800 text-center min-w-[105px] shadow-2xs">
                    <span className="text-[10px] font-mono uppercase text-slate-500 dark:text-slate-400 block mb-0.5 font-bold">RISK COMPONENT</span>
                    <span className="text-sm font-mono font-extrabold text-indigo-600 dark:text-indigo-400 uppercase">
                      {latestPrediction?.predictedComponent || 'NONE'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. SENSOR ANALYSIS & FAILURE PROBABILITY GAUGE ROW */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* SENSOR & VIBRATION ANALYSIS — MCH-XXX (8 cols) */}
              <div className="lg:col-span-8">
                <IndustrialSensorChart
                  telemetryData={telemetry}
                  period={period}
                  onPeriodChange={handlePeriodChange}
                  isLoading={isTelemetryLoading}
                  title={`SENSOR & VIBRATION ANALYSIS — ${machine.machineIdentifier}`}
                  subtitle="Signaux temps réel des 4 capteurs (Tension, Rotation, Pression, Vibration)"
                />
              </div>

              {/* FAILURE PROBABILITY GAUGE (4 cols) */}
              <div className="lg:col-span-4 bg-[#f8fafc] dark:bg-[#0e1524] border border-slate-300/80 dark:border-[#1c2842] rounded-2xl p-5 shadow-xs flex flex-col justify-between">
                <FailureProbabilityGauge
                  machineIdentifier={machine.machineIdentifier}
                  predictedComponent={latestPrediction?.predictedComponent || 'none'}
                  probability={latestPrediction?.probability || 0.05}
                  status={latestPrediction?.status || 'NORMAL'}
                  title="FAILURE PROBABILITY"
                  subtitle="Probabilité calculée pour les prochaines 24 heures"
                />
              </div>
            </div>

            {/* 3. CONDITION TREND & PARTS STATUS ROW */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* Condition Trend (6 cols) */}
              <div className="lg:col-span-6">
                <ConditionTrendChart
                  dataPoints={trendPoints}
                  period={period}
                  onPeriodChange={handlePeriodChange}
                />
              </div>

              {/* Parts / Component Status (6 cols) */}
              <div className="lg:col-span-6">
                <PartsStatusCard
                  predictedComponent={latestPrediction?.predictedComponent}
                  status={latestPrediction?.status}
                  probability={latestPrediction?.probability}
                />
              </div>
            </div>

            {/* 4. PREDICTIONS, MAINTENANCE & ERRORS 3-COLUMN STACK */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              {/* Predictions History */}
              <div className="bg-white dark:bg-[#0e1524] border border-slate-200 dark:border-[#1c2842] rounded-2xl p-5 shadow-sm flex flex-col">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/80 mb-3">
                  <div className="flex items-center gap-2">
                    <History size={16} className="text-indigo-500" />
                    <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                      HISTORIQUE PRÉDICTIONS
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">{predictions.length} Inférences</span>
                </div>

                <div className="space-y-2.5 flex-1 overflow-y-auto max-h-72 pr-1">
                  {predictions.length > 0 ? (
                    predictions.map((p) => (
                      <div
                        key={p.id}
                        className="p-3 rounded-xl bg-slate-50 dark:bg-[#131b2e] border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2"
                      >
                        <div>
                          <ComponentBadge component={p.predictedComponent} />
                          <div className="text-[10px] font-mono text-slate-400 mt-1 flex items-center gap-1">
                            <Clock size={10} /> {formatDate(p.timestamp)}
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-mono font-bold text-slate-900 dark:text-white">
                            {Math.round(p.probability * 100)}%
                          </span>
                          <div className="mt-0.5">
                            <StatusBadge status={p.status} />
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-400 py-6 text-center">Aucune prédiction enregistrée.</p>
                  )}
                </div>
              </div>

              {/* Maintenance History */}
              <div className="bg-white dark:bg-[#0e1524] border border-slate-200 dark:border-[#1c2842] rounded-2xl p-5 shadow-sm flex flex-col">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/80 mb-3">
                  <div className="flex items-center gap-2">
                    <Wrench size={16} className="text-amber-500" />
                    <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                      HISTORIQUE MAINTENANCE
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">{maintenanceList.length} Interventions</span>
                </div>

                <div className="space-y-2.5 flex-1 overflow-y-auto max-h-72 pr-1">
                  {maintenanceList.length > 0 ? (
                    maintenanceList.map((m) => (
                      <div
                        key={m.id}
                        className="p-3 rounded-xl bg-slate-50 dark:bg-[#131b2e] border border-slate-200 dark:border-slate-800"
                      >
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="font-mono font-bold text-blue-700 dark:text-blue-300 uppercase px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950/80 border border-blue-200 dark:border-blue-800/50 text-[10px]">
                            {m.component}
                          </span>
                          <span className="text-[10px] font-mono text-slate-400">
                            {formatDate(m.maintenanceDate).split(' ')[0]}
                          </span>
                        </div>
                        <p className="text-xs text-slate-700 dark:text-slate-300 mt-1 font-medium">
                          {m.description || 'Intervention documentée'}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-400 py-6 text-center">Aucune intervention passée.</p>
                  )}
                </div>
              </div>

              {/* Error Stack */}
              <div className="bg-white dark:bg-[#0e1524] border border-slate-200 dark:border-[#1c2842] rounded-2xl p-5 shadow-sm flex flex-col">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/80 mb-3">
                  <div className="flex items-center gap-2">
                    <AlertCircle size={16} className="text-rose-500" />
                    <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                      JOURNAL DES ERREURS
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">{errorList.length} Erreurs</span>
                </div>

                <div className="space-y-2.5 flex-1 overflow-y-auto max-h-72 pr-1">
                  {errorList.length > 0 ? (
                    errorList.map((err) => (
                      <div
                        key={err.id}
                        className="p-3 rounded-xl bg-slate-50 dark:bg-[#131b2e] border border-slate-200 dark:border-slate-800"
                      >
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="font-mono font-bold text-rose-700 dark:text-rose-300 px-2 py-0.5 rounded bg-rose-100 dark:bg-rose-950/80 border border-rose-200 dark:border-rose-800/50 text-[10px]">
                            {err.errorCode}
                          </span>
                          <span className="text-[10px] font-mono text-slate-400">
                            {formatDate(err.timestamp)}
                          </span>
                        </div>
                        <p className="text-xs text-slate-700 dark:text-slate-300 mt-1 font-medium">
                          {err.description}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-400 py-6 text-center">Aucune erreur signalée.</p>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};
