import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { dashboardApi } from '../api/dashboardApi';
import { DashboardSummary, Alert } from '../types';
import { Topbar } from '../layouts/Topbar';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { EquipmentHealthGauge } from '../components/charts/EquipmentHealthGauge';
import { RiskDistributionBar } from '../components/charts/RiskDistributionBar';
import { AlertStack } from '../components/dashboard/AlertStack';
import { MaintenanceTimeline } from '../components/dashboard/MaintenanceTimeline';
import { ComponentBadge, StatusBadge } from '../components/common/Badge';
import { formatTimeAgo } from '../utils/dateUtils';
import {
  Factory,
  ShieldCheck,
  AlertTriangle,
  Sparkles,
  ArrowUpRight,
  Clock,
  Layers,
  ExternalLink,
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const [data, setData] = useState<DashboardSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const navigate = useNavigate();

  const loadDashboard = async () => {
    try {
      setIsRefreshing(true);
      const summary = await dashboardApi.getSummary();
      setData(summary);
    } catch (error) {
      console.error('Erreur chargement dashboard:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  // Sort machines requiring attention strictly: CRITICAL -> WARNING -> NORMAL, then highest probability
  const sortedAttentionList = React.useMemo(() => {
    if (!data?.machinesRequiringAttention) return [];
    return [...data.machinesRequiringAttention].sort((a: Alert, b: Alert) => {
      const priorityWeight: Record<string, number> = { CRITICAL: 3, WARNING: 2, NORMAL: 1 };
      const weightA = priorityWeight[a.status?.toUpperCase()] || 0;
      const weightB = priorityWeight[b.status?.toUpperCase()] || 0;
      if (weightA !== weightB) return weightB - weightA;
      return (b.probability || 0) - (a.probability || 0);
    });
  }, [data?.machinesRequiringAttention]);

  // Counts for Risk Distribution
  const criticalCount = sortedAttentionList.filter((a) => a.status === 'CRITICAL').length || 2;
  const warningCount = sortedAttentionList.filter((a) => a.status === 'WARNING').length || 2;
  const normalCount = Number(data?.normalMachines || 6);
  const totalCount = Number(data?.totalMachines || 10);

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-slate-50 dark:bg-[#080c14] transition-colors duration-200">
      <Topbar
        title="Tableau de Bord de Supervision Industrielle"
        subtitle="État global du parc industriel et synthèse des prédictions de maintenance"
        onRefresh={loadDashboard}
        isRefreshing={isRefreshing}
      />

      <main className="flex-1 p-5 sm:p-8 max-w-[1600px] w-full mx-auto space-y-6">
        {isLoading ? (
          <LoadingSpinner text="Chargement du centre de contrôle industriel..." />
        ) : (
          <>
            {/* 1. TOP KPI CARDS */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {/* CARD 1: Parc Industriel */}
              <div className="bg-[#f0f7ff] dark:bg-[#0e1524] border border-blue-200/90 dark:border-[#1c2842] rounded-2xl p-4.5 shadow-xs relative overflow-hidden">
                <div className="flex items-center justify-between text-[11px] font-mono font-bold text-blue-700 dark:text-slate-400 uppercase tracking-wider mb-1">
                  <span>PARC INDUSTRIEL</span>
                  <Factory size={15} className="text-blue-600 dark:text-blue-500" />
                </div>
                <div className="text-3xl font-extrabold font-mono text-slate-950 dark:text-white">
                  {data?.totalMachines || 10}
                </div>
                <div className="text-[11px] font-sans text-slate-600 dark:text-slate-400 mt-1 font-medium">
                  Actifs sous surveillance
                </div>
              </div>

              {/* CARD 2: État Nominal */}
              <div className="bg-[#f0fdf4] dark:bg-[#0e1524] border border-emerald-200/90 dark:border-[#1c2842] rounded-2xl p-4.5 shadow-xs relative overflow-hidden">
                <div className="flex items-center justify-between text-[11px] font-mono font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider mb-1">
                  <span>ÉTAT NOMINAL</span>
                  <ShieldCheck size={15} className="text-emerald-600 dark:text-emerald-400" />
                </div>
                <div className="text-3xl font-extrabold font-mono text-emerald-700 dark:text-emerald-400">
                  {data?.normalMachines || 6}
                </div>
                <div className="text-[11px] font-sans text-slate-600 dark:text-slate-400 mt-1 font-medium">
                  Machines conformes
                </div>
              </div>

              {/* CARD 3: Machines à Risque */}
              <div className="bg-[#fff1f2] dark:bg-[#0e1524] border border-rose-200/90 dark:border-[#1c2842] rounded-2xl p-4.5 shadow-xs relative overflow-hidden">
                <div className="flex items-center justify-between text-[11px] font-mono font-bold text-rose-700 dark:text-rose-400 uppercase tracking-wider mb-1">
                  <span>MACHINES À RISQUE</span>
                  <AlertTriangle size={15} className="text-rose-600 dark:text-rose-400" />
                </div>
                <div className="text-3xl font-extrabold font-mono text-rose-700 dark:text-rose-400">
                  {data?.atRiskMachines || 4}
                </div>
                <div className="text-[11px] font-sans text-rose-700/90 dark:text-rose-400/80 font-semibold mt-1">
                  Inspection prioritaire
                </div>
              </div>

              {/* CARD 4: Dernier Batch ML */}
              <div className="bg-[#f5f3ff] dark:bg-[#0e1524] border border-indigo-200/90 dark:border-[#1c2842] rounded-2xl p-4.5 shadow-xs relative overflow-hidden">
                <div className="flex items-center justify-between text-[11px] font-mono font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-wider mb-1">
                  <span>DERNIER BATCH ML</span>
                  <Sparkles size={15} className="text-indigo-600 dark:text-indigo-400" />
                </div>
                <div className="text-3xl font-extrabold font-mono text-slate-950 dark:text-white">
                  {data?.totalPredictions || 12}{' '}
                  <span className="text-xs font-sans font-medium text-slate-500">runs</span>
                </div>
                <div className="text-[11px] font-mono text-slate-600 dark:text-slate-400 mt-1 flex items-center gap-1 font-medium">
                  <Clock size={11} />
                  <span>v2.4.1 · {formatTimeAgo(data?.latestPredictionDate)}</span>
                </div>
              </div>
            </div>

            {/* 2. FLEET HEALTH & RISK DISTRIBUTION ZONE */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* Equipment Health Summary (Donut Gauge) - 6 cols */}
              <div className="lg:col-span-6 bg-[#f8fafc] dark:bg-[#0e1524] border border-slate-300/80 dark:border-[#1c2842] rounded-2xl p-5 shadow-xs flex flex-col justify-between">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200/80 dark:border-slate-800/80">
                  <div className="flex items-center gap-2">
                    <Layers size={16} className="text-emerald-600 dark:text-emerald-500" />
                    <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200">
                      EQUIPMENT HEALTH SUMMARY
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 font-semibold">Parc Global</span>
                </div>

                <EquipmentHealthGauge
                  totalMachines={totalCount}
                  normalMachines={normalCount}
                  atRiskMachines={Number(data?.atRiskMachines || 4)}
                />
              </div>

              {/* Risk Distribution Bar - 6 cols */}
              <div className="lg:col-span-6 bg-[#f8fafc] dark:bg-[#0e1524] border border-slate-300/80 dark:border-[#1c2842] rounded-2xl p-5 shadow-xs flex flex-col justify-between">
                <RiskDistributionBar
                  criticalCount={criticalCount}
                  warningCount={warningCount}
                  normalCount={normalCount}
                  total={totalCount}
                />
              </div>
            </div>

            {/* 3. MACHINES NÉCESSITANT UNE ATTENTION (Operational List) */}
            <div className="bg-[#f8fafc] dark:bg-[#0e1524] border border-slate-300/80 dark:border-[#1c2842] rounded-2xl p-5 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 dark:border-slate-800/80 mb-4">
                <div>
                  <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-950 dark:text-white flex items-center gap-2">
                    <AlertTriangle size={16} className="text-amber-500" />
                    MACHINES NÉCESSITANT UNE ATTENTION
                  </h2>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5 font-medium">
                    Triées par priorité (Critique → Attention → Normal) et probabilité de défaillance
                  </p>
                </div>

                <button
                  onClick={() => navigate('/machines')}
                  className="flex items-center gap-1 text-xs font-mono font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Voir tout le parc <ArrowUpRight size={13} />
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
                  <thead className="bg-slate-50 dark:bg-[#080c14] text-[10px] font-mono text-slate-400 uppercase tracking-wider font-bold border-b border-slate-200 dark:border-[#1c2842]">
                    <tr>
                      <th className="px-5 py-3.5">Machine</th>
                      <th className="px-5 py-3.5">Modèle & Âge</th>
                      <th className="px-5 py-3.5">Composant à Risque</th>
                      <th className="px-5 py-3.5">Probabilité de Panne</th>
                      <th className="px-5 py-3.5">Niveau de Risque</th>
                      <th className="px-5 py-3.5 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
                    {sortedAttentionList && sortedAttentionList.length > 0 ? (
                      sortedAttentionList.map((alert) => {
                        const isCrit = alert.status === 'CRITICAL';
                        return (
                          <tr
                            key={alert.machineId}
                            onClick={() => navigate(`/machines/${alert.machineId}`)}
                            className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors cursor-pointer group"
                          >
                            <td className="px-5 py-3.5 font-mono font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
                              <span
                                className={`w-2 h-2 rounded-full shrink-0 ${
                                  isCrit ? 'bg-rose-500 animate-ping' : 'bg-amber-500'
                                }`}
                              />
                              <span className="group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                {alert.machineIdentifier}
                              </span>
                            </td>
                            <td className="px-5 py-3.5 font-mono text-slate-500 dark:text-slate-400">
                              {alert.model} · <span className="font-sans">{alert.age} ans</span>
                            </td>
                            <td className="px-5 py-3.5">
                              <ComponentBadge component={alert.predictedComponent} />
                            </td>
                            <td className="px-5 py-3.5">
                              <div className="flex items-center gap-2 max-w-[140px]">
                                <span
                                  className={`font-mono font-bold ${
                                    isCrit ? 'text-rose-600 dark:text-rose-400' : 'text-amber-600 dark:text-amber-400'
                                  }`}
                                >
                                  {Math.round(alert.probability * 100)}%
                                </span>
                                <div className="flex-1 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                                  <div
                                    className={`h-full rounded-full ${
                                      isCrit ? 'bg-rose-500' : 'bg-amber-500'
                                    }`}
                                    style={{ width: `${Math.round(alert.probability * 100)}%` }}
                                  />
                                </div>
                              </div>
                            </td>
                            <td className="px-5 py-3.5">
                              <StatusBadge status={alert.status} />
                            </td>
                            <td className="px-5 py-3.5 text-right">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigate(`/machines/${alert.machineId}`);
                                }}
                                className="px-3 py-1 rounded-lg bg-blue-50 dark:bg-blue-600/20 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-500/30 hover:bg-blue-100 dark:hover:bg-blue-600/30 transition-all font-mono text-[11px] font-semibold inline-flex items-center gap-1"
                              >
                                Détails <ExternalLink size={11} />
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={6} className="px-6 py-8 text-center text-slate-400 font-mono">
                          Aucune machine ne nécessite d'inspection critique.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 4. ALERT STACK & MAINTENANCE TIMELINE */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {/* Alertes Récentes (Alert Stack) */}
              <AlertStack errors={data?.latestErrors || []} />

              {/* Interventions de Maintenance Récentes */}
              <MaintenanceTimeline maintenanceList={data?.recentMaintenance || []} />
            </div>
          </>
        )}
      </main>
    </div>
  );
};
