import React from 'react';
import { useMLPipeline } from '../hooks/useMLPipeline';
import { Topbar } from '../layouts/Topbar';
import { DemoBanner } from '../components/common/DemoBanner';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ErrorMessage } from '../components/common/ErrorMessage';
import { formatTimeAgo } from '../utils/dateUtils';
import {
  Workflow,
  Cpu,
  Gauge,
  Layers,
  Sparkles,
} from 'lucide-react';

export const MLPipeline: React.FC = () => {
  const { pipelineStatus, modelInfo, isLoading, isRefreshing, error, refetch } = useMLPipeline();

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <Topbar
        title="Pipeline ML & Orchestration MLOps"
        subtitle="Supervision du workflow d'inférence quotidienne et du registre de modèles"
        onRefresh={refetch}
        isRefreshing={isRefreshing}
      />

      <main className="flex-1 p-8 max-w-7xl w-full mx-auto space-y-8">
        <DemoBanner
          message="INTÉGRATION FUTURE / MOCK DATA (PHASE 1)"
          subMessage="Cette page simule le monitoring du pipeline Airflow et du registre de modèles MLflow. Les prédictions effectives seront exécutées de manière batchée chaque jour à 06:00 par le service Python ML."
        />

        {error && (
          <ErrorMessage
            title="Erreur lors du chargement des informations du pipeline ML"
            message={error}
            onRetry={refetch}
          />
        )}

        {isLoading ? (
          <LoadingSpinner text="Chargement de l'état du pipeline ML..." />
        ) : (
          <>
            {/* Status Top Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5">
                <div className="flex items-center justify-between text-xs text-slate-400 font-semibold uppercase mb-2">
                  <span>État de l'Orchestration</span>
                  <div className="p-1.5 rounded-lg bg-emerald-950/60 text-emerald-400">
                    <Workflow size={16} />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                  <span className="text-xl font-bold text-white">
                    {pipelineStatus?.status || 'HEALTHY'}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-2">
                  Dernier run : {formatTimeAgo(pipelineStatus?.lastRun)}
                </p>
              </div>

              <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5">
                <div className="flex items-center justify-between text-xs text-slate-400 font-semibold uppercase mb-2">
                  <span>Modèle en Production</span>
                  <div className="p-1.5 rounded-lg bg-indigo-950/60 text-indigo-400">
                    <Cpu size={16} />
                  </div>
                </div>
                <div className="text-xl font-bold text-white font-mono">
                  {pipelineStatus?.modelName || 'LightGBM Multi-class'}
                </div>
                <p className="text-xs text-slate-400 mt-2">
                  Version active :{' '}
                  <strong className="text-indigo-300">
                    {pipelineStatus?.modelVersion || 'v2.4.1'}
                  </strong>
                </p>
              </div>

              <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5">
                <div className="flex items-center justify-between text-xs text-slate-400 font-semibold uppercase mb-2">
                  <span>Machines Analysées</span>
                  <div className="p-1.5 rounded-lg bg-blue-950/60 text-blue-400">
                    <Layers size={16} />
                  </div>
                </div>
                <div className="text-xl font-bold text-white font-mono">
                  {pipelineStatus?.machinesProcessed ?? 0} équipements
                </div>
                <p className="text-xs text-slate-400 mt-2">
                  Couverture du parc à 100%
                </p>
              </div>
            </div>

            {/* Model Validation Metrics */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
              <h3 className="text-base font-bold text-white mb-1 flex items-center gap-2">
                <Gauge size={18} className="text-blue-400" />
                Métriques de Validation du Modèle (MLflow Registry)
              </h3>
              <p className="text-xs text-slate-400 mb-6">
                Évaluation sur le jeu de test Microsoft Azure Predictive Maintenance
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-4 text-center">
                  <div className="text-xs text-slate-400 font-medium">Exactitude (Accuracy)</div>
                  <div className="text-2xl font-mono font-bold text-emerald-400 mt-1">
                    {((modelInfo?.accuracy ?? 0) * 100).toFixed(1)}%
                  </div>
                </div>

                <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-4 text-center">
                  <div className="text-xs text-slate-400 font-medium">Précision (Precision)</div>
                  <div className="text-2xl font-mono font-bold text-blue-400 mt-1">
                    {((modelInfo?.precision ?? 0) * 100).toFixed(1)}%
                  </div>
                </div>

                <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-4 text-center">
                  <div className="text-xs text-slate-400 font-medium">Rappel (Recall)</div>
                  <div className="text-2xl font-mono font-bold text-indigo-400 mt-1">
                    {((modelInfo?.recall ?? 0) * 100).toFixed(1)}%
                  </div>
                </div>

                <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-4 text-center">
                  <div className="text-xs text-slate-400 font-medium">F1-Score</div>
                  <div className="text-2xl font-mono font-bold text-purple-400 mt-1">
                    {((modelInfo?.f1Score ?? 0) * 100).toFixed(1)}%
                  </div>
                </div>
              </div>
            </div>

            {/* Architecture Explanation Diagram Box */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
              <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                <Sparkles size={18} className="text-amber-400" />
                Fonctionnement du Pipeline MLOps Industriel
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
                <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4">
                  <span className="font-bold text-blue-400 text-sm block mb-1">
                    1. Télémétrie 24/7
                  </span>
                  <p className="text-slate-400">
                    Les mesures de tension, rotation, pression et vibration sont ingérées en continu et persistées dans PostgreSQL.
                  </p>
                </div>

                <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4">
                  <span className="font-bold text-indigo-400 text-sm block mb-1">
                    2. Airflow DAG (06h00)
                  </span>
                  <p className="text-slate-400">
                    Chaque matin, Airflow déclenche le workflow de calcul des rolling features (3h/24h) et des compteurs d'erreurs.
                  </p>
                </div>

                <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4">
                  <span className="font-bold text-purple-400 text-sm block mb-1">
                    3. Inférence Python ML
                  </span>
                  <p className="text-slate-400">
                    Le modèle MLflow prédit le composant à risque (comp1, comp2, comp3, comp4 ou none) et sa probabilité.
                  </p>
                </div>

                <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4">
                  <span className="font-bold text-emerald-400 text-sm block mb-1">
                    4. Restitution Spring Boot
                  </span>
                  <p className="text-slate-400">
                    Les prédictions persistées sont exposées par Spring Boot pour l'affichage en temps réel sur le tableau de bord.
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};
