import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDashboard } from '../hooks/useDashboard';
import { Topbar } from '../layouts/Topbar';
import { ComponentBadge, StatusBadge } from '../components/common/Badge';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ErrorMessage } from '../components/common/ErrorMessage';
import { DemoBanner } from '../components/common/DemoBanner';
import { formatDate, formatTimeAgo } from '../utils/dateUtils';
import {
  Factory,
  ShieldCheck,
  AlertTriangle,
  Sparkles,
  ArrowUpRight,
  Clock,
  Wrench,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { data, isLoading, isRefreshing, error, refetch } = useDashboard();
  const navigate = useNavigate();

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <Topbar
        title="Tableau de Bord de Supervision"
        subtitle="État du parc industriel et synthèse des prédictions de maintenance"
        onRefresh={refetch}
        isRefreshing={isRefreshing}
      />

      <main className="flex-1 p-8 max-w-7xl w-full mx-auto space-y-8">
        <DemoBanner />

        {error && (
          <ErrorMessage
            title="Erreur de chargement du tableau de bord"
            message={error}
            onRetry={refetch}
          />
        )}

        {isLoading ? (
          <LoadingSpinner text="Chargement des indicateurs du parc..." />
        ) : (
          <>
            {/* KPI Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {/* Total Machines */}
              <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 relative overflow-hidden">
                <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
                  <span>Parc Industriel</span>
                  <div className="p-2 rounded-xl bg-blue-950/60 text-blue-400">
                    <Factory size={18} />
                  </div>
                </div>
                <div className="text-3xl font-extrabold text-white font-mono">
                  {data?.totalMachines ?? 0}
                </div>
                <div className="mt-2 text-xs text-slate-400">
                  Actifs sous surveillance
                </div>
              </div>

              {/* Normal Machines */}
              <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 relative overflow-hidden">
                <div className="flex items-center justify-between text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-2">
                  <span>État Nominal</span>
                  <div className="p-2 rounded-xl bg-emerald-950/60 text-emerald-400">
                    <ShieldCheck size={18} />
                  </div>
                </div>
                <div className="text-3xl font-extrabold text-emerald-400 font-mono">
                  {data?.normalMachines ?? 0}
                </div>
                <div className="mt-2 text-xs text-slate-400">
                  Aucun risque détecté
                </div>
              </div>

              {/* At Risk Machines */}
              <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 relative overflow-hidden">
                <div className="flex items-center justify-between text-rose-400 text-xs font-semibold uppercase tracking-wider mb-2">
                  <span>Machines à Risque</span>
                  <div className="p-2 rounded-xl bg-rose-950/60 text-rose-400">
                    <AlertTriangle size={18} />
                  </div>
                </div>
                <div className="text-3xl font-extrabold text-rose-400 font-mono">
                  {data?.atRiskMachines ?? 0}
                </div>
                <div className="mt-2 text-xs text-rose-300/80 font-medium">
                  Nécessitent une inspection
                </div>
              </div>

              {/* Total Predictions & Date */}
              <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 relative overflow-hidden">
                <div className="flex items-center justify-between text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-2">
                  <span>Dernier Batch ML</span>
                  <div className="p-2 rounded-xl bg-indigo-950/60 text-indigo-400">
                    <Sparkles size={18} />
                  </div>
                </div>
                <div className="text-xl font-bold text-white font-mono">
                  {data?.totalPredictions ?? 0} <span className="text-xs font-normal text-slate-400">runs</span>
                </div>
                <div className="mt-2 text-xs text-slate-400 flex items-center gap-1">
                  <Clock size={12} />
                  <span>{formatTimeAgo(data?.latestPredictionDate)}</span>
                </div>
              </div>
            </div>

            {/* Main Section: Machines Requiring Attention */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
              <div className="p-6 border-b border-slate-800 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <AlertTriangle size={19} className="text-amber-400" />
                    Machines Nécessitant Attention
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Équipements dont la dernière prédiction indique un composant à risque de panne
                  </p>
                </div>
                <button
                  onClick={() => navigate('/machines')}
                  className="flex items-center gap-1.5 text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors"
                >
                  Voir tout le parc <ArrowUpRight size={14} />
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-300">
                  <thead className="bg-slate-950/60 text-xs text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                    <tr>
                      <th className="px-6 py-4">Machine</th>
                      <th className="px-6 py-4">Modèle & Âge</th>
                      <th className="px-6 py-4">Composant à Risque</th>
                      <th className="px-6 py-4">Probabilité</th>
                      <th className="px-6 py-4">Niveau de Risque</th>
                      <th className="px-6 py-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-medium">
                    {data?.machinesRequiringAttention && data.machinesRequiringAttention.length > 0 ? (
                      data.machinesRequiringAttention.map((alert) => (
                        <tr
                          key={alert.machineId}
                          onClick={() => navigate(`/machines/${alert.machineId}`)}
                          className="hover:bg-slate-800/40 transition-colors cursor-pointer"
                        >
                          <td className="px-6 py-4 font-mono font-bold text-white flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                            {alert.machineIdentifier}
                          </td>
                          <td className="px-6 py-4 text-slate-400">
                            {alert.model} · <span className="font-mono">{alert.age} ans</span>
                          </td>
                          <td className="px-6 py-4">
                            <ComponentBadge component={alert.predictedComponent} />
                          </td>
                          <td className="px-6 py-4 font-mono font-bold text-slate-200">
                            {Math.round(alert.probability * 100)}%
                          </td>
                          <td className="px-6 py-4">
                            <StatusBadge status={alert.status} />
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/machines/${alert.machineId}`);
                              }}
                              className="px-3 py-1 text-xs font-semibold rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30 hover:bg-blue-600/30 transition-all inline-flex items-center gap-1"
                            >
                              Détails <ExternalLink size={12} />
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                          <ShieldCheck size={32} className="mx-auto mb-2 text-emerald-400/50" />
                          Aucune machine ne nécessite d'attention critique pour le moment.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Bottom Grid: Recent Activity (Errors & Maintenance) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Errors */}
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
                <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2 mb-4">
                  <AlertCircle size={16} className="text-amber-400" />
                  Dernières Erreurs Signalées
                </h3>
                <div className="space-y-3">
                  {data?.latestErrors && data.latestErrors.length > 0 ? (
                    data.latestErrors.map((err) => (
                      <div
                        key={err.id}
                        onClick={() => err.machineId && navigate(`/machines/${err.machineId}`)}
                        className="p-3 rounded-xl bg-slate-950/50 border border-slate-800/80 flex items-start justify-between gap-3 hover:border-slate-700 cursor-pointer transition-all"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono font-bold text-blue-400">
                              {err.machineIdentifier}
                            </span>
                            <span className="text-xs font-mono px-2 py-0.5 rounded bg-amber-950/80 text-amber-300 border border-amber-800/50">
                              {err.errorCode}
                            </span>
                          </div>
                          <p className="text-xs text-slate-300 mt-1">{err.description}</p>
                        </div>
                        <span className="text-[11px] text-slate-500 shrink-0 font-mono">
                          {formatTimeAgo(err.timestamp)}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-500 py-4 text-center">Aucune erreur récente.</p>
                  )}
                </div>
              </div>

              {/* Recent Maintenance */}
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
                <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2 mb-4">
                  <Wrench size={16} className="text-indigo-400" />
                  Interventions de Maintenance Récentes
                </h3>
                <div className="space-y-3">
                  {data?.recentMaintenance && data.recentMaintenance.length > 0 ? (
                    data.recentMaintenance.map((m) => (
                      <div
                        key={m.id}
                        onClick={() => m.machineId && navigate(`/machines/${m.machineId}`)}
                        className="p-3 rounded-xl bg-slate-950/50 border border-slate-800/80 flex items-start justify-between gap-3 hover:border-slate-700 cursor-pointer transition-all"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono font-bold text-blue-400">
                              {m.machineIdentifier}
                            </span>
                            <span className="text-xs font-mono px-2 py-0.5 rounded bg-indigo-950/80 text-indigo-300 border border-indigo-800/50">
                              {m.component.toUpperCase()}
                            </span>
                          </div>
                          <p className="text-xs text-slate-300 mt-1">{m.description || 'Intervention de routine'}</p>
                        </div>
                        <span className="text-[11px] text-slate-500 shrink-0 font-mono">
                          {formatDate(m.maintenanceDate)}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-500 py-4 text-center">Aucune intervention enregistrée.</p>
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
