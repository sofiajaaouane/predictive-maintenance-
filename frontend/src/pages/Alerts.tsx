import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAlerts } from '../hooks/useAlerts';
import { Topbar } from '../layouts/Topbar';
import { ComponentBadge, StatusBadge } from '../components/common/Badge';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ErrorMessage } from '../components/common/ErrorMessage';
import { AlertTable } from '../components/alerts/AlertTable';
import { formatTimeAgo } from '../utils/dateUtils';
import { Bell, ShieldCheck, ExternalLink, LayoutGrid, List } from 'lucide-react';

export const Alerts: React.FC = () => {
  const { alerts, isLoading, isRefreshing, error, refetch } = useAlerts();
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const navigate = useNavigate();

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <Topbar
        title="Alertes de Maintenance Actives"
        subtitle="Machines présentant un risque identifié selon la dernière prédiction enregistrée"
        onRefresh={refetch}
        isRefreshing={isRefreshing}
      />

      <main className="flex-1 p-8 max-w-7xl w-full mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping"></span>
            <span className="text-sm font-semibold text-slate-200">
              {alerts.length} machine{alerts.length > 1 ? 's' : ''} nécessitant une attention préventive
            </span>
          </div>

          <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 p-1 rounded-xl">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Vue Grille"
            >
              <LayoutGrid size={16} />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'table' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Vue Tableau"
            >
              <List size={16} />
            </button>
          </div>
        </div>

        {error && (
          <ErrorMessage
            title="Erreur lors du chargement des alertes"
            message={error}
            onRetry={refetch}
          />
        )}

        {isLoading ? (
          <LoadingSpinner text="Extraction des alertes..." />
        ) : alerts.length === 0 ? (
          <div className="p-16 text-center bg-slate-900/40 border border-slate-800 rounded-2xl text-slate-400">
            <ShieldCheck size={48} className="mx-auto mb-3 text-emerald-400" />
            <h3 className="text-lg font-bold text-slate-200">Aucune alerte active</h3>
            <p className="text-xs text-slate-500 mt-1">
              Toutes les machines du parc présentent un niveau de risque nominal.
            </p>
          </div>
        ) : viewMode === 'table' ? (
          <AlertTable alerts={alerts} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {alerts.map((alert) => (
              <div
                key={alert.machineId}
                onClick={() => navigate(`/machines/${alert.machineId}`)}
                className="bg-slate-900/80 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 cursor-pointer transition-all shadow-lg hover:shadow-xl relative overflow-hidden group"
              >
                <div
                  className={`absolute top-0 left-0 right-0 h-1 ${
                    alert.status === 'CRITICAL' ? 'bg-rose-500' : 'bg-amber-500'
                  }`}
                />

                <div className="flex items-start justify-between mb-4">
                  <div>
                    <span className="text-xs text-slate-400 font-mono font-medium">
                      {alert.model} · {alert.age} ans
                    </span>
                    <h3 className="text-xl font-mono font-extrabold text-white tracking-tight mt-0.5">
                      {alert.machineIdentifier}
                    </h3>
                  </div>
                  <StatusBadge status={alert.status} />
                </div>

                <div className="bg-slate-950/70 rounded-xl p-3.5 border border-slate-800/80 mb-4 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-medium">Composant à risque :</span>
                    <ComponentBadge component={alert.predictedComponent} />
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-medium">Probabilité de panne :</span>
                    <span className="font-mono font-bold text-rose-400 text-sm">
                      {Math.round(alert.probability * 100)}%
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 text-[11px] text-slate-500">
                  <span>Prédiction : {formatTimeAgo(alert.predictionDate)}</span>
                  <span className="text-blue-400 group-hover:translate-x-0.5 transition-transform flex items-center gap-1 font-semibold">
                    Consulter <ExternalLink size={11} />
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};
