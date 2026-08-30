import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMachineDetail } from '../hooks/useMachineDetail';
import { useTelemetry } from '../hooks/useTelemetry';
import { machineApi } from '../api/machineApi';
import { Machine } from '../types';
import { Topbar } from '../layouts/Topbar';
import { ComponentBadge, StatusBadge } from '../components/common/Badge';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ErrorMessage } from '../components/common/ErrorMessage';
import { MachineModal } from '../components/machines/MachineModal';
import { DeleteMachineModal } from '../components/machines/DeleteMachineModal';
import { TelemetryChart } from '../components/charts/TelemetryChart';
import { formatDate, formatTimeAgo } from '../utils/dateUtils';
import {
  ArrowLeft,
  Factory,
  Sparkles,
  Wrench,
  AlertCircle,
  Clock,
  History,
  Edit2,
  Trash2,
} from 'lucide-react';

export const MachineDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const machineId = Number(id);
  const navigate = useNavigate();
  const [period, setPeriod] = useState<'6h' | '24h' | '7d'>('24h');

  // Modals
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const {
    machine,
    predictions,
    maintenanceList,
    errorList,
    isLoading: isMachineLoading,
    isRefreshing,
    error: machineError,
    refetch: refetchMachine,
  } = useMachineDetail(machineId);

  const {
    telemetry,
    isLoading: isTelemetryLoading,
    error: telemetryError,
    refetch: refetchTelemetry,
  } = useTelemetry(machineId, period);

  const handleRefresh = async () => {
    await Promise.all([refetchMachine(), refetchTelemetry()]);
  };

  const handlePeriodChange = (newPeriod: '6h' | '24h' | '7d') => {
    setPeriod(newPeriod);
  };

  const handleEditSuccess = () => {
    refetchMachine();
  };

  const handleDeleteConfirm = async () => {
    if (!machine) return;
    try {
      setIsDeleting(true);
      await machineApi.deleteMachine(machine.id);
      navigate('/machines');
    } catch (err: any) {
      console.error('Erreur suppression machine:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <Topbar
        title={`Détails Machine : ${machine?.machineIdentifier || `ID #${id}`}`}
        subtitle="Historique télémétrique, prédictions ML, maintenance et erreurs"
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
      />

      <main className="flex-1 p-8 max-w-7xl w-full mx-auto space-y-8">
        {/* Navigation & Action Bar */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate('/machines')}
            className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors"
          >
            <ArrowLeft size={16} />
            <span>Retour au parc de machines</span>
          </button>

          {machine && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-all"
              >
                <Edit2 size={13} />
                <span>Modifier</span>
              </button>
              <button
                onClick={() => setIsDeleteModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 text-rose-400 border border-rose-800/40 text-xs font-semibold transition-all"
              >
                <Trash2 size={13} />
                <span>Supprimer</span>
              </button>
            </div>
          )}
        </div>

        {machineError && (
          <ErrorMessage
            title="Erreur lors du chargement de la machine"
            message={machineError}
            onRetry={handleRefresh}
          />
        )}

        {isMachineLoading ? (
          <LoadingSpinner text="Chargement des données de la machine..." />
        ) : !machine ? (
          <div className="p-12 text-center text-slate-500">
            Machine #{id} introuvable dans le système.
          </div>
        ) : (
          <>
            {/* Machine Header Card */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 relative overflow-hidden shadow-xl">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-blue-950/80 border border-blue-800/60 flex items-center justify-center text-blue-400 shrink-0 shadow-lg shadow-blue-900/20">
                    <Factory size={28} />
                  </div>
                  <div>
                    <div className="flex items-center gap-3">
                      <h2 className="text-2xl font-extrabold text-white font-mono tracking-tight">
                        {machine.machineIdentifier}
                      </h2>
                      <StatusBadge status={machine.riskLevel} />
                    </div>
                    <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-slate-400">
                      <span>
                        Modèle : <strong className="text-slate-200">{machine.model}</strong>
                      </span>
                      <span>•</span>
                      <span>
                        Âge natif :{' '}
                        <strong className="text-slate-200 font-mono">{machine.age} ans</strong>
                      </span>
                      <span>•</span>
                      <span>
                        Enregistrée le :{' '}
                        <strong className="text-slate-300">{formatDate(machine.createdAt)}</strong>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Latest Prediction Summary Pill */}
                <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 min-w-[260px]">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Sparkles size={13} className="text-indigo-400" /> Dernière Prédiction ML
                    </span>
                    <span className="text-slate-500 font-mono text-[10px]">
                      {machine.lastPrediction?.modelVersion || 'v2.4.1'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <ComponentBadge
                      component={machine.lastPrediction?.predictedComponent || 'none'}
                    />
                    <div className="text-right">
                      <div className="text-sm font-mono font-bold text-white">
                        {machine.lastPrediction?.probability !== undefined
                          ? `${Math.round(machine.lastPrediction.probability * 100)}%`
                          : '—'}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {formatTimeAgo(machine.lastPrediction?.timestamp)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Telemetry Chart with Multi-period Selector */}
            {telemetryError ? (
              <ErrorMessage
                title="Erreur lors du chargement de la télémétrie"
                message={telemetryError}
                onRetry={refetchTelemetry}
              />
            ) : (
              <TelemetryChart
                telemetryData={telemetry}
                period={period}
                onPeriodChange={handlePeriodChange}
                isLoading={isTelemetryLoading}
              />
            )}

            {/* Multi-column Grid: Predictions History / Maintenance History / Errors */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Predictions History */}
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 flex flex-col">
                <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2 mb-4">
                  <History size={16} className="text-indigo-400" />
                  Historique Prédictions
                </h3>
                <div className="space-y-3 flex-1 overflow-y-auto max-h-80 pr-1">
                  {predictions.length > 0 ? (
                    predictions.map((p) => (
                      <div
                        key={p.id}
                        className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between gap-2"
                      >
                        <div>
                          <ComponentBadge component={p.predictedComponent} />
                          <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                            <Clock size={11} /> {formatDate(p.timestamp)}
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-mono font-bold text-slate-200">
                            {Math.round(p.probability * 100)}%
                          </span>
                          <div className="mt-0.5">
                            <StatusBadge status={p.status} />
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-500 py-6 text-center">
                      Aucune prédiction enregistrée.
                    </p>
                  )}
                </div>
              </div>

              {/* Maintenance History */}
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 flex flex-col">
                <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2 mb-4">
                  <Wrench size={16} className="text-amber-400" />
                  Historique Maintenance
                </h3>
                <div className="space-y-3 flex-1 overflow-y-auto max-h-80 pr-1">
                  {maintenanceList.length > 0 ? (
                    maintenanceList.map((m) => (
                      <div
                        key={m.id}
                        className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80"
                      >
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="font-mono font-bold text-blue-300 uppercase px-2 py-0.5 rounded bg-blue-950/80 border border-blue-800/50">
                            {m.component}
                          </span>
                          <span className="text-[11px] text-slate-500 font-mono">
                            {formatDate(m.maintenanceDate)}
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 mt-1.5">
                          {m.description || 'Intervention documentée'}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-500 py-6 text-center">
                      Aucune maintenance passée.
                    </p>
                  )}
                </div>
              </div>

              {/* Machine Errors History */}
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 flex flex-col">
                <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2 mb-4">
                  <AlertCircle size={16} className="text-rose-400" />
                  Historique des Erreurs
                </h3>
                <div className="space-y-3 flex-1 overflow-y-auto max-h-80 pr-1">
                  {errorList.length > 0 ? (
                    errorList.map((err) => (
                      <div
                        key={err.id}
                        className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80"
                      >
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="font-mono font-bold text-rose-300 px-2 py-0.5 rounded bg-rose-950/80 border border-rose-800/50">
                            {err.errorCode}
                          </span>
                          <span className="text-[11px] text-slate-500 font-mono">
                            {formatDate(err.timestamp)}
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 mt-1.5">{err.description}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-500 py-6 text-center">
                      Aucune erreur signalée.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </main>

      {/* Edit Modal */}
      <MachineModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSuccess={handleEditSuccess}
        machineToEdit={machine}
      />

      {/* Delete Modal */}
      <DeleteMachineModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        machine={machine}
        isDeleting={isDeleting}
      />
    </div>
  );
};
