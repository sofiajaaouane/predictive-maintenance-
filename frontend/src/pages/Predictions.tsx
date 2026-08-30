import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePredictions } from '../hooks/usePredictions';
import { Topbar } from '../layouts/Topbar';
import { ComponentBadge, StatusBadge } from '../components/common/Badge';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ErrorMessage } from '../components/common/ErrorMessage';
import { DemoBanner } from '../components/common/DemoBanner';
import { formatDate } from '../utils/dateUtils';
import { Sparkles, Filter, ExternalLink } from 'lucide-react';

export const Predictions: React.FC = () => {
  const [componentFilter, setComponentFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const navigate = useNavigate();

  const queryParams = useMemo(
    () => ({
      component: componentFilter || undefined,
      status: statusFilter || undefined,
    }),
    [componentFilter, statusFilter]
  );

  const { predictions, isLoading, isRefreshing, error, refetch } = usePredictions(queryParams);

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <Topbar
        title="Journal des Prédictions Machine Learning"
        subtitle="Historique des inférences de composants à risque stockées dans PostgreSQL"
        onRefresh={refetch}
        isRefreshing={isRefreshing}
      />

      <main className="flex-1 p-8 max-w-7xl w-full mx-auto space-y-6">
        <DemoBanner />

        {/* Filters Bar */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="flex items-center gap-2">
              <Filter size={14} className="text-slate-400" />
              <select
                value={componentFilter}
                onChange={(e) => setComponentFilter(e.target.value)}
                className="bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
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
              className="bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
            >
              <option value="">Tous les statuts de risque</option>
              <option value="NORMAL">Normal</option>
              <option value="WARNING">Attention (Warning)</option>
              <option value="CRITICAL">Critique (Critical)</option>
            </select>
          </div>

          <span className="text-xs text-slate-400 font-mono">
            {predictions.length} enregistrements
          </span>
        </div>

        {error && (
          <ErrorMessage
            title="Erreur lors du chargement des prédictions"
            message={error}
            onRetry={refetch}
          />
        )}

        {/* Predictions Table */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          {isLoading ? (
            <LoadingSpinner text="Chargement des prédictions..." />
          ) : predictions.length === 0 ? (
            <div className="p-12 text-center text-slate-500">
              <Sparkles size={36} className="mx-auto mb-2 opacity-40" />
              <p>Aucune prédiction ne correspond aux filtres sélectionnés.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="bg-slate-950/70 text-xs text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                  <tr>
                    <th className="px-6 py-4">Machine</th>
                    <th className="px-6 py-4">Date Prédiction</th>
                    <th className="px-6 py-4">Composant Prédit</th>
                    <th className="px-6 py-4">Probabilité</th>
                    <th className="px-6 py-4">Niveau de Risque</th>
                    <th className="px-6 py-4">Version Modèle</th>
                    <th className="px-6 py-4 text-right">Machine</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-medium">
                  {predictions.map((p) => (
                    <tr
                      key={p.id}
                      onClick={() => p.machineId && navigate(`/machines/${p.machineId}`)}
                      className="hover:bg-slate-800/40 transition-colors cursor-pointer"
                    >
                      <td className="px-6 py-4 font-mono font-bold text-white">
                        {p.machineIdentifier}
                      </td>
                      <td className="px-6 py-4 text-xs font-mono text-slate-400">
                        {formatDate(p.timestamp)}
                      </td>
                      <td className="px-6 py-4">
                        <ComponentBadge component={p.predictedComponent} />
                      </td>
                      <td className="px-6 py-4 font-mono font-bold text-slate-200">
                        {Math.round(p.probability * 100)}%
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={p.status} />
                      </td>
                      <td className="px-6 py-4 font-mono text-xs text-slate-400">
                        {p.modelVersion}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (p.machineId) navigate(`/machines/${p.machineId}`);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30 hover:bg-blue-600/30 transition-all text-xs inline-flex items-center gap-1 font-semibold"
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
