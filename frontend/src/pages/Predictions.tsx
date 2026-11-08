import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { predictionApi } from '../api/predictionApi';
import { Prediction } from '../types';
import { Topbar } from '../layouts/Topbar';
import { ComponentBadge, StatusBadge } from '../components/common/Badge';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { formatDate } from '../utils/dateUtils';
import { Sparkles, Filter, ExternalLink } from 'lucide-react';

export const Predictions: React.FC = () => {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [componentFilter, setComponentFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const navigate = useNavigate();

  const loadPredictions = async () => {
    try {
      setIsRefreshing(true);
      const data = await predictionApi.getAll({
        component: componentFilter || undefined,
        status: statusFilter || undefined,
      });
      setPredictions(data);
    } catch (error) {
      console.error('Erreur chargement prédictions:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadPredictions();
  }, [componentFilter, statusFilter]);

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-slate-50 dark:bg-[#080c14] transition-colors duration-200">
      <Topbar
        title="Journal des Prédictions Machine Learning"
        subtitle="Historique des inférences de composants à risque stockées dans PostgreSQL"
        onRefresh={loadPredictions}
        isRefreshing={isRefreshing}
      />

      <main className="flex-1 p-5 sm:p-8 max-w-[1600px] w-full mx-auto space-y-6">
        {/* Filter Toolbar */}
        <div className="bg-[#f8fafc] dark:bg-[#0e1524] border border-slate-300/80 dark:border-[#1c2842] rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="flex items-center gap-2">
              <Filter size={13} className="text-slate-400" />
              <select
                value={componentFilter}
                onChange={(e) => setComponentFilter(e.target.value)}
                className="bg-white dark:bg-[#080c14] border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-slate-800 dark:text-slate-200 focus:outline-none focus:border-blue-500 shadow-2xs"
              >
                <option value="">Tous les composants</option>
                <option value="none">Aucun risque (none)</option>
                <option value="comp1">Composant 1 (comp1)</option>
                <option value="comp2">Composant 2 (comp2)</option>
                <option value="comp3">Composant 3 (comp3)</option>
                <option value="comp4">Composant 4 (comp4)</option>
              </select>
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-white dark:bg-[#080c14] border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-slate-800 dark:text-slate-200 focus:outline-none focus:border-blue-500 shadow-2xs"
            >
              <option value="">Tous les statuts</option>
              <option value="NORMAL">Normal</option>
              <option value="WARNING">Attention (Warning)</option>
              <option value="CRITICAL">Critique (Critical)</option>
            </select>
          </div>

          <span className="text-xs font-mono text-slate-600 dark:text-slate-400 font-semibold">
            {predictions.length} Inférences ML
          </span>
        </div>

        {/* Predictions Log Table */}
        <div className="bg-[#f8fafc] dark:bg-[#0e1524] border border-slate-300/80 dark:border-[#1c2842] rounded-2xl overflow-hidden shadow-xs">
          {isLoading ? (
            <LoadingSpinner text="Chargement du registre de prédictions..." />
          ) : predictions.length === 0 ? (
            <div className="p-12 text-center text-slate-400 font-mono text-xs">
              <Sparkles size={36} className="mx-auto mb-2 opacity-30" />
              <p>Aucune prédiction enregistrée avec ces filtres.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
                <thead className="bg-slate-50 dark:bg-[#080c14] text-[10px] font-mono text-slate-400 uppercase tracking-wider font-bold border-b border-slate-200 dark:border-[#1c2842]">
                  <tr>
                    <th className="px-6 py-4">Machine</th>
                    <th className="px-6 py-4">Date Prédiction</th>
                    <th className="px-6 py-4">Composant Prédit</th>
                    <th className="px-6 py-4">Probabilité</th>
                    <th className="px-6 py-4">Niveau de Risque</th>
                    <th className="px-6 py-4">Version Modèle</th>
                    <th className="px-6 py-4 text-right">Cockpit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
                  {predictions.map((p) => (
                    <tr
                      key={p.id}
                      onClick={() => p.machineId && navigate(`/machines/${p.machineId}`)}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors cursor-pointer group"
                    >
                      <td className="px-6 py-4 font-mono font-bold text-slate-900 dark:text-white group-hover:text-blue-500 transition-colors">
                        {p.machineIdentifier}
                      </td>
                      <td className="px-6 py-4 font-mono text-slate-500 dark:text-slate-400">
                        {formatDate(p.timestamp)}
                      </td>
                      <td className="px-6 py-4">
                        <ComponentBadge component={p.predictedComponent} />
                      </td>
                      <td className="px-6 py-4 font-mono font-bold text-slate-900 dark:text-slate-200">
                        {Math.round(p.probability * 100)}%
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={p.status} />
                      </td>
                      <td className="px-6 py-4 font-mono text-slate-400 text-[11px]">
                        {p.modelVersion}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (p.machineId) navigate(`/machines/${p.machineId}`);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-600/20 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-500/30 hover:bg-blue-100 dark:hover:bg-blue-600/30 transition-all font-mono text-[11px] inline-flex items-center gap-1 font-semibold"
                        >
                          Voir <ExternalLink size={11} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
