import React, { useEffect, useState } from 'react';
import { mlApi } from '../api/mlApi';
import { MLModelInfo, MLPipelineStatus } from '../types';
import { Topbar } from '../layouts/Topbar';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { formatTimeAgo } from '../utils/dateUtils';
import {
  Workflow,
  Cpu,
  Gauge,
  Layers,
  ArrowRight,
} from 'lucide-react';

export const MLPipeline: React.FC = () => {
  const [pipelineStatus, setPipelineStatus] = useState<MLPipelineStatus | null>(null);
  const [modelInfo, setModelInfo] = useState<MLModelInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadData = async () => {
    try {
      setIsRefreshing(true);
      const [status, info] = await Promise.all([
        mlApi.getPipelineStatus(),
        mlApi.getModelInfo(),
      ]);
      setPipelineStatus(status);
      setModelInfo(info);
    } catch (error) {
      console.error('Erreur chargement ML Pipeline:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const pipelineSteps = [
    { title: 'Airflow', desc: 'DAG Quotidien (06h00)' },
    { title: 'Feature Eng.', desc: 'Rolling 3h/24h & Erreurs' },
    { title: 'Training', desc: 'Entraînement LightGBM' },
    { title: 'Evaluation', desc: 'Validation F1 > 0.90' },
    { title: 'MLflow', desc: 'Model Registry' },
    { title: 'Production Model', desc: 'Version v2.4.1 Active' },
    { title: 'Prediction', desc: 'Export PostgreSQL' },
  ];

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-slate-50 dark:bg-[#080c14] transition-colors duration-200">
      <Topbar
        title="Supervision Pipeline & Modèle MLOps"
        subtitle="Orchestration batch quotidienne Airflow et registre de modèles MLflow"
        onRefresh={loadData}
        isRefreshing={isRefreshing}
      />

      <main className="flex-1 p-5 sm:p-8 max-w-[1600px] w-full mx-auto space-y-6">
        {isLoading ? (
          <LoadingSpinner text="Chargement de l'état du pipeline ML..." />
        ) : (
          <>
            {/* Status Top Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="bg-[#f0fdf4] dark:bg-[#0e1524] border border-emerald-200/90 dark:border-[#1c2842] rounded-2xl p-5 shadow-xs">
                <div className="flex items-center justify-between text-[11px] font-mono text-emerald-700 dark:text-slate-400 font-bold uppercase mb-2">
                  <span>ORCHESTRATION AIRFLOW</span>
                  <div className="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                    <Workflow size={15} />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xl font-mono font-bold text-slate-950 dark:text-white">
                    {pipelineStatus?.status}
                  </span>
                </div>
                <p className="text-xs font-mono text-slate-600 dark:text-slate-400 mt-2 font-medium">
                  Dernier run : {formatTimeAgo(pipelineStatus?.lastRun)}
                </p>
              </div>

              <div className="bg-[#f5f3ff] dark:bg-[#0e1524] border border-indigo-200/90 dark:border-[#1c2842] rounded-2xl p-5 shadow-xs">
                <div className="flex items-center justify-between text-[11px] font-mono text-indigo-700 dark:text-slate-400 font-bold uppercase mb-2">
                  <span>MODÈLE PRODUCTION (MLFLOW)</span>
                  <div className="p-1.5 rounded-lg bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                    <Cpu size={15} />
                  </div>
                </div>
                <div className="text-xl font-mono font-bold text-slate-950 dark:text-white">
                  {pipelineStatus?.modelName ? pipelineStatus.modelName.replace('azure-', '') : 'sentinel-gradient-boost'}
                </div>
                <p className="text-xs font-mono text-slate-600 dark:text-slate-400 mt-2 font-medium">
                  Version active : <strong className="text-indigo-700 dark:text-indigo-400">{pipelineStatus?.modelVersion || 'v2.4.1'}</strong>
                </p>
              </div>

              <div className="bg-[#f0f7ff] dark:bg-[#0e1524] border border-blue-200/90 dark:border-[#1c2842] rounded-2xl p-5 shadow-xs">
                <div className="flex items-center justify-between text-[11px] font-mono text-blue-700 dark:text-slate-400 font-bold uppercase mb-2">
                  <span>MACHINES ANALYSÉES</span>
                  <div className="p-1.5 rounded-lg bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
                    <Layers size={15} />
                  </div>
                </div>
                <div className="text-xl font-mono font-bold text-slate-950 dark:text-white">
                  1 250 équipements
                </div>
                <p className="text-xs font-mono text-slate-600 dark:text-slate-400 mt-2 font-medium">
                  Couverture : 100% du parc
                </p>
              </div>
            </div>

            {/* Visual MLOps Flow Diagram */}
            <div className="bg-[#f8fafc] dark:bg-[#0e1524] border border-slate-300/80 dark:border-[#1c2842] rounded-2xl p-6 shadow-xs">
              <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-200/80 dark:border-slate-800/80">
                <div className="flex items-center gap-2">
                  <Workflow size={16} className="text-indigo-600 dark:text-indigo-500" />
                  <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-950 dark:text-white">
                    FLUX D'ORCHESTRATION DU PIPELINE ML
                  </h3>
                </div>
                <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 font-semibold">Pipeline End-to-End</span>
              </div>

              <div className="flex flex-wrap lg:flex-nowrap items-center justify-between gap-2 overflow-x-auto pb-2">
                {pipelineSteps.map((step, idx) => (
                  <React.Fragment key={step.title}>
                    <div className="flex-1 min-w-[130px] p-3 rounded-xl bg-white dark:bg-[#131b2e] border border-slate-200/90 dark:border-slate-800 text-center relative shadow-2xs group">
                      <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400 mb-0.5 font-bold">Étape {idx + 1}</div>
                      <div className="text-xs font-mono font-extrabold text-slate-950 dark:text-white mb-1">
                        {step.title}
                      </div>
                      <div className="text-[10px] text-slate-600 dark:text-slate-400 leading-tight font-medium">
                        {step.desc}
                      </div>
                    </div>
                    {idx < pipelineSteps.length - 1 && (
                      <ArrowRight size={14} className="text-slate-400 dark:text-slate-600 shrink-0 hidden sm:block" />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* Model Validation Metrics */}
            <div className="bg-[#f8fafc] dark:bg-[#0e1524] border border-slate-300/80 dark:border-[#1c2842] rounded-2xl p-6 shadow-xs">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-200/80 dark:border-slate-800/80">
                <div className="flex items-center gap-2">
                  <Gauge size={16} className="text-blue-600 dark:text-blue-500" />
                  <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-950 dark:text-white">
                    MÉTRIQUES DE VALIDATION DU MODÈLE (MLFLOW REGISTRY)
                  </h3>
                </div>
                <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 font-semibold">Jeu de validation industriel</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-[#080c14] border border-slate-200/90 dark:border-slate-800 rounded-xl p-4 text-center shadow-2xs">
                  <div className="text-[11px] font-mono text-slate-600 dark:text-slate-400 uppercase font-semibold">Exactitude (Accuracy)</div>
                  <div className="text-2xl font-mono font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">
                    {((modelInfo?.accuracy || 0) * 100).toFixed(1)}%
                  </div>
                </div>

                <div className="bg-white dark:bg-[#080c14] border border-slate-200/90 dark:border-slate-800 rounded-xl p-4 text-center shadow-2xs">
                  <div className="text-[11px] font-mono text-slate-600 dark:text-slate-400 uppercase font-semibold">Précision (Precision)</div>
                  <div className="text-2xl font-mono font-extrabold text-blue-600 dark:text-blue-400 mt-1">
                    {((modelInfo?.precision || 0) * 100).toFixed(1)}%
                  </div>
                </div>

                <div className="bg-white dark:bg-[#080c14] border border-slate-200/90 dark:border-slate-800 rounded-xl p-4 text-center shadow-2xs">
                  <div className="text-[11px] font-mono text-slate-600 dark:text-slate-400 uppercase font-semibold">Rappel (Recall)</div>
                  <div className="text-2xl font-mono font-extrabold text-indigo-600 dark:text-indigo-400 mt-1">
                    {((modelInfo?.recall || 0) * 100).toFixed(1)}%
                  </div>
                </div>

                <div className="bg-white dark:bg-[#080c14] border border-slate-200/90 dark:border-slate-800 rounded-xl p-4 text-center shadow-2xs">
                  <div className="text-[11px] font-mono text-slate-600 dark:text-slate-400 uppercase font-semibold">F1-Score</div>
                  <div className="text-2xl font-mono font-extrabold text-purple-600 dark:text-purple-400 mt-1">
                    {((modelInfo?.f1Score || 0) * 100).toFixed(1)}%
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};
