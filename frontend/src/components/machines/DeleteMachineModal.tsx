import React from 'react';
import { Machine } from '../../types';
import { AlertTriangle, Trash2, X, Loader2 } from 'lucide-react';

interface DeleteMachineModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  machine: Machine | null;
  isDeleting: boolean;
}

export const DeleteMachineModal: React.FC<DeleteMachineModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  machine,
  isDeleting,
}) => {
  if (!isOpen || !machine) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-rose-950/80 border border-rose-800/60 flex items-center justify-center text-rose-400">
              <AlertTriangle size={20} />
            </div>
            <button
              onClick={onClose}
              disabled={isDeleting}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          <h3 className="text-lg font-bold text-white mb-2">
            Supprimer la machine {machine.machineIdentifier} ?
          </h3>

          <p className="text-xs text-slate-400 leading-relaxed">
            Êtes-vous sûr de vouloir supprimer définitivement la machine{' '}
            <strong className="text-white font-mono">{machine.machineIdentifier}</strong> (ID : #{machine.id}) ?
            Toutes les données associées (télémétrie, erreurs, maintenances et prédictions) seront supprimées en cascade de PostgreSQL.
          </p>

          <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-slate-800/80">
            <button
              type="button"
              onClick={onClose}
              disabled={isDeleting}
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            >
              Annuler
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={isDeleting}
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-rose-600 hover:bg-rose-500 text-white flex items-center gap-2 transition-all shadow-lg shadow-rose-900/30 disabled:opacity-50"
            >
              {isDeleting ? (
                <>
                  <Loader2 size={13} className="animate-spin" />
                  <span>Suppression...</span>
                </>
              ) : (
                <>
                  <Trash2 size={13} />
                  <span>Confirmer la suppression</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
