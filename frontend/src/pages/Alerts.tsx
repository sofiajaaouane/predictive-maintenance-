import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { alertApi } from '../api/alertApi';
import { Alert } from '../types';
import { Topbar } from '../layouts/Topbar';
import { ComponentBadge, StatusBadge } from '../components/common/Badge';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { formatTimeAgo } from '../utils/dateUtils';
import { ShieldCheck, ExternalLink } from 'lucide-react';

export const Alerts: React.FC = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const navigate = useNavigate();

  const loadAlerts = async () => {
    try {
      setIsRefreshing(true);
      const data = await alertApi.getActiveAlerts();
      setAlerts(data);
    } catch (error) {
      console.error('Erreur chargement alertes:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadAlerts();
  }, []);

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-slate-50 dark:bg-[#080c14] transition-colors duration-200">
      <Topbar
        title="Centre d'Alertes Actives"
        subtitle="Machines présentant un risque identifié selon la dernière prédiction enregistrée"
        onRefresh={loadAlerts}
        isRefreshing={isRefreshing}
      />

      <main className="flex-1 p-5 sm:p-8 max-w-[1600px] w-full mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
            <span className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200">
              {alerts.length} ALERTE{alerts.length > 1 ? 'S' : ''} ACTIVE{alerts.length > 1 ? 'S' : ''} SUR LE PARC
            </span>
          </div>
        </div>

        {/* Alerts Grid Cards */}
        {isLoading ? (
          <LoadingSpinner text="Analyse des alertes actives..." />
        ) : alerts.length === 0 ? (
          <div className="p-16 text-center bg-white dark:bg-[#0e1524] border border-slate-200 dark:border-[#1c2842] rounded-2xl text-slate-400">
            <ShieldCheck size={48} className="mx-auto mb-3 text-emerald-500" />
            <h3 className="text-base font-mono font-bold text-slate-900 dark:text-white">Aucune alerte active</h3>
            <p className="text-xs font-sans text-slate-500 dark:text-slate-400 mt-1">
              Toutes les machines du parc présentent un niveau de risque nominal.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {alerts.map((alert) => {
              const isCritical = alert.status === 'CRITICAL';
              return (
                <div
                  key={alert.machineId}
                  onClick={() => navigate(`/machines/${alert.machineId}`)}
                  className="bg-[#f8fafc] dark:bg-[#0e1524] border border-slate-300/80 dark:border-[#1c2842] hover:border-blue-400 dark:hover:border-blue-500/50 rounded-2xl p-5 cursor-pointer transition-all shadow-xs hover:shadow-md relative overflow-hidden group"
                >
                  <div
                    className={`absolute top-0 left-0 right-0 h-1.5 ${
                      isCritical ? 'bg-rose-500' : 'bg-amber-500'
                    }`}
                  />

                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 font-semibold">
                        {alert.model} · {alert.age} ans
                      </span>
                      <h3 className="text-xl font-mono font-extrabold text-slate-950 dark:text-white tracking-tight mt-0.5 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {alert.machineIdentifier}
                      </h3>
                    </div>
                    <StatusBadge status={alert.status} />
                  </div>

                  <div className="bg-white dark:bg-[#131b2e] rounded-xl p-3.5 border border-slate-200/90 dark:border-slate-800 mb-4 space-y-2 shadow-2xs">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-600 dark:text-slate-400 font-medium">Composant à risque :</span>
                      <ComponentBadge component={alert.predictedComponent} />
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-600 dark:text-slate-400 font-medium">Probabilité de panne :</span>
                      <span
                        className={`font-mono font-extrabold text-sm ${
                          isCritical ? 'text-rose-600 dark:text-rose-400' : 'text-amber-600 dark:text-amber-400'
                        }`}
                      >
                        {Math.round(alert.probability * 100)}%
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-200/80 dark:border-slate-800/80 text-[11px] font-mono text-slate-500 dark:text-slate-400">
                    <span>Inférence : {formatTimeAgo(alert.predictionDate)}</span>
                    <span className="text-blue-600 dark:text-blue-400 font-bold group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                      Cockpit <ExternalLink size={11} />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};
