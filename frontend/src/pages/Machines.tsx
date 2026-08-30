import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMachines } from '../hooks/useMachines';
import { machineApi } from '../api/machineApi';
import { Machine } from '../types';
import { Topbar } from '../layouts/Topbar';
import { ComponentBadge, StatusBadge } from '../components/common/Badge';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ErrorMessage } from '../components/common/ErrorMessage';
import { MachineModal } from '../components/machines/MachineModal';
import { DeleteMachineModal } from '../components/machines/DeleteMachineModal';
import { formatDate } from '../utils/dateUtils';
import {
  Search,
  Filter,
  Factory,
  Plus,
  Edit2,
  Trash2,
  ExternalLink,
  CheckCircle2,
} from 'lucide-react';

export const Machines: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [modelFilter, setModelFilter] = useState('');
  const [riskFilter, setRiskFilter] = useState('');
  const navigate = useNavigate();

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [machineToEdit, setMachineToEdit] = useState<Machine | null>(null);
  const [machineToDelete, setMachineToDelete] = useState<Machine | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Success Feedback
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const queryParams = useMemo(
    () => ({
      search: searchTerm || undefined,
      model: modelFilter || undefined,
      riskLevel: riskFilter || undefined,
    }),
    [searchTerm, modelFilter, riskFilter]
  );

  const { machines, isLoading, isRefreshing, error, refetch } = useMachines(queryParams);

  const uniqueModels = useMemo(() => {
    return Array.from(new Set(machines.map((m) => m.model))).filter(Boolean);
  }, [machines]);

  const handleOpenCreateModal = () => {
    setMachineToEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (machine: Machine, e: React.MouseEvent) => {
    e.stopPropagation();
    setMachineToEdit(machine);
    setIsModalOpen(true);
  };

  const handleOpenDeleteModal = (machine: Machine, e: React.MouseEvent) => {
    e.stopPropagation();
    setMachineToDelete(machine);
  };

  const handleModalSuccess = (machine: Machine, isEdit: boolean) => {
    refetch();
    setSuccessToast(
      isEdit
        ? `Machine ${machine.machineIdentifier} modifiée avec succès.`
        : `Machine ${machine.machineIdentifier} créée avec succès dans PostgreSQL.`
    );
    setTimeout(() => setSuccessToast(null), 4000);
  };

  const handleConfirmDelete = async () => {
    if (!machineToDelete) return;
    try {
      setIsDeleting(true);
      await machineApi.deleteMachine(machineToDelete.id);
      setSuccessToast(`Machine ${machineToDelete.machineIdentifier} supprimée du parc.`);
      setTimeout(() => setSuccessToast(null), 4000);
      setMachineToDelete(null);
      refetch();
    } catch (err: any) {
      console.error('Erreur suppression machine:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <Topbar
        title="Parc de Machines Industrielles"
        subtitle="Gestion administrative CRUD, inventaire et niveau de risque dérivé"
        onRefresh={refetch}
        isRefreshing={isRefreshing}
      />

      <main className="flex-1 p-8 max-w-7xl w-full mx-auto space-y-6">
        {/* Success Toast */}
        {successToast && (
          <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-800/60 text-emerald-300 text-xs font-semibold flex items-center justify-between shadow-xl animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 size={16} className="text-emerald-400" />
              <span>{successToast}</span>
            </div>
            <button
              onClick={() => setSuccessToast(null)}
              className="text-emerald-400 hover:text-emerald-200 text-xs"
            >
              ✕
            </button>
          </div>
        )}

        {/* Action Header & Filters Bar */}
        <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
          {/* Search and Filters */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-2.5 flex flex-1 flex-col sm:flex-row gap-3 items-center">
            <div className="relative w-full sm:w-72">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Rechercher par ID ou modèle..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-1.5 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Filter size={13} className="text-slate-400" />
              <select
                value={modelFilter}
                onChange={(e) => setModelFilter(e.target.value)}
                className="bg-slate-950/80 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
              >
                <option value="">Tous les modèles</option>
                {uniqueModels.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>

              <select
                value={riskFilter}
                onChange={(e) => setRiskFilter(e.target.value)}
                className="bg-slate-950/80 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
              >
                <option value="">Tous les risques</option>
                <option value="NORMAL">Normal</option>
                <option value="AT_RISK">À Risque</option>
              </select>
            </div>
          </div>

          {/* Add Machine Button */}
          <button
            onClick={handleOpenCreateModal}
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-all shadow-lg shadow-blue-900/30 shrink-0"
          >
            <Plus size={16} />
            <span>Ajouter une machine</span>
          </button>
        </div>

        {error && (
          <ErrorMessage
            title="Erreur de chargement des machines"
            message={error}
            onRetry={refetch}
          />
        )}

        {/* Machines Table */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          {isLoading ? (
            <LoadingSpinner text="Chargement du parc de machines..." />
          ) : machines.length === 0 ? (
            <div className="p-16 text-center text-slate-500">
              <Factory size={40} className="mx-auto mb-3 opacity-30" />
              <h4 className="text-base font-semibold text-slate-300">Aucune machine trouvée</h4>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Aucune machine ne correspond aux filtres actuels ou aucune machine n'est encore enregistrée.
              </p>
              <button
                onClick={handleOpenCreateModal}
                className="mt-4 px-4 py-2 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 hover:bg-blue-600/30 text-xs font-semibold inline-flex items-center gap-1.5"
              >
                <Plus size={14} /> Créer une machine
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="bg-slate-950/70 text-xs text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                  <tr>
                    <th className="px-6 py-4">Machine ID</th>
                    <th className="px-6 py-4">Modèle</th>
                    <th className="px-6 py-4">Âge (Dataset)</th>
                    <th className="px-6 py-4">Niveau de Risque</th>
                    <th className="px-6 py-4">Composant Prédit</th>
                    <th className="px-6 py-4">Date de Création</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-medium">
                  {machines.map((machine) => (
                    <tr
                      key={machine.id}
                      onClick={() => navigate(`/machines/${machine.id}`)}
                      className="hover:bg-slate-800/40 transition-colors cursor-pointer group"
                    >
                      <td className="px-6 py-4 font-mono font-bold text-white flex items-center gap-2.5">
                        <div
                          className={`p-2 rounded-xl ${
                            machine.riskLevel === 'AT_RISK'
                              ? 'bg-rose-950/60 text-rose-400'
                              : 'bg-blue-950/60 text-blue-400'
                          }`}
                        >
                          <Factory size={16} />
                        </div>
                        <div>
                          <span>{machine.machineIdentifier}</span>
                          <span className="block text-[10px] text-slate-500 font-mono">#{machine.id}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-300">{machine.model}</td>
                      <td className="px-6 py-4 font-mono text-slate-400">
                        {machine.age} ans
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={machine.riskLevel} />
                      </td>
                      <td className="px-6 py-4">
                        <ComponentBadge
                          component={machine.lastPrediction?.predictedComponent || 'none'}
                        />
                      </td>
                      <td className="px-6 py-4 text-xs font-mono text-slate-400">
                        {formatDate(machine.createdAt)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* View Detail */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/machines/${machine.id}`);
                            }}
                            title="Voir les détails"
                            className="p-1.5 rounded-lg bg-blue-600/10 text-blue-400 hover:bg-blue-600/20 border border-blue-500/20 transition-all text-xs"
                          >
                            <ExternalLink size={13} />
                          </button>

                          {/* Edit Machine */}
                          <button
                            onClick={(e) => handleOpenEditModal(machine, e)}
                            title="Modifier les caractéristiques"
                            className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700 transition-all text-xs"
                          >
                            <Edit2 size={13} />
                          </button>

                          {/* Delete Machine */}
                          <button
                            onClick={(e) => handleOpenDeleteModal(machine, e)}
                            title="Supprimer la machine"
                            className="p-1.5 rounded-lg bg-rose-950/40 text-rose-400 hover:bg-rose-900/60 border border-rose-800/40 transition-all text-xs"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Machine Create / Edit Modal */}
      <MachineModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleModalSuccess}
        machineToEdit={machineToEdit}
      />

      {/* Delete Confirmation Modal */}
      <DeleteMachineModal
        isOpen={!!machineToDelete}
        onClose={() => setMachineToDelete(null)}
        onConfirm={handleConfirmDelete}
        machine={machineToDelete}
        isDeleting={isDeleting}
      />
    </div>
  );
};
