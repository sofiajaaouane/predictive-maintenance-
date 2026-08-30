import React, { useState, useEffect } from 'react';
import { machineApi, MachinePayload } from '../../api/machineApi';
import { Machine } from '../../types';
import { X, Factory, AlertCircle, Loader2, Check } from 'lucide-react';

interface MachineModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (machine: Machine, isEdit: boolean) => void;
  machineToEdit?: Machine | null;
}

const AVAILABLE_MODELS = ['model1', 'model2', 'model3', 'model4'];

export const MachineModal: React.FC<MachineModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  machineToEdit,
}) => {
  const isEdit = !!machineToEdit;

  const [machineIdentifier, setMachineIdentifier] = useState('');
  const [model, setModel] = useState('model1');
  const [age, setAge] = useState<number | string>(5);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (machineToEdit) {
      setMachineIdentifier(machineToEdit.machineIdentifier || '');
      setModel(machineToEdit.model || 'model1');
      setAge(machineToEdit.age ?? 0);
    } else {
      setMachineIdentifier('');
      setModel('model1');
      setAge(5);
    }
    setErrorMessage(null);
  }, [machineToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const trimmedIdentifier = machineIdentifier.trim();
    const trimmedModel = model.trim();
    const parsedAge = Number(age);

    if (!trimmedIdentifier) {
      setErrorMessage("L'identifiant machine est obligatoire (ex: MCH-011).");
      return;
    }

    if (!trimmedModel) {
      setErrorMessage('Le modèle de machine est obligatoire.');
      return;
    }

    if (isNaN(parsedAge) || parsedAge < 0) {
      setErrorMessage("L'âge de la machine doit être un nombre positif ou nul.");
      return;
    }

    const payload: MachinePayload = {
      machineIdentifier: trimmedIdentifier,
      model: trimmedModel,
      age: parsedAge,
    };

    try {
      setIsSubmitting(true);
      let result: Machine;
      if (isEdit && machineToEdit) {
        result = await machineApi.updateMachine(machineToEdit.id, payload);
      } else {
        result = await machineApi.createMachine(payload);
      }
      onSuccess(result, isEdit);
      onClose();
    } catch (err: any) {
      setErrorMessage(err?.message || "Une erreur est survenue lors de l'enregistrement.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/40">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-950/80 border border-blue-800/60 text-blue-400">
              <Factory size={20} />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                {isEdit ? `Modifier la machine #${machineToEdit?.id}` : 'Nouvelle Machine Industrielle'}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {isEdit
                  ? 'Mettre à jour les informations administratives'
                  : 'Enregistrer une nouvelle machine dans PostgreSQL'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-800/60 text-rose-300 text-xs flex items-start gap-2.5">
              <AlertCircle size={16} className="shrink-0 mt-0.5 text-rose-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Machine Identifier */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Identifiant Machine <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="ex: MCH-011"
              value={machineIdentifier}
              onChange={(e) => setMachineIdentifier(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-sm font-mono text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
            />
            <span className="text-[11px] text-slate-500">
              Doit être unique dans le parc (utilisé par Kafka pour associer la télémétrie).
            </span>
          </div>

          {/* Model */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Modèle <span className="text-rose-400">*</span>
            </label>
            <div className="grid grid-cols-4 gap-2">
              {AVAILABLE_MODELS.map((m) => (
                <button
                  type="button"
                  key={m}
                  onClick={() => setModel(m)}
                  className={`py-2 px-3 text-xs font-semibold rounded-xl border transition-all ${
                    model === m
                      ? 'bg-blue-600/20 border-blue-500 text-blue-300 shadow-sm'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* Age */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Âge de l'équipement (Années) <span className="text-rose-400">*</span>
            </label>
            <input
              type="number"
              min={0}
              max={100}
              required
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-sm font-mono text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
            />
            <span className="text-[11px] text-slate-500">
              Âge natif d'exploitation au sein du dataset Azure.
            </span>
          </div>

          {/* Footer Buttons */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 text-xs font-semibold rounded-xl bg-blue-600 hover:bg-blue-500 text-white flex items-center gap-2 transition-all shadow-lg shadow-blue-900/30 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  <span>Enregistrement...</span>
                </>
              ) : (
                <>
                  <Check size={14} />
                  <span>{isEdit ? 'Enregistrer les modifications' : 'Créer la machine'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
