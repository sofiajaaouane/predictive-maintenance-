import React from 'react';
import { Info } from 'lucide-react';

interface DemoBannerProps {
  message?: string;
  subMessage?: string;
}

export const DemoBanner: React.FC<DemoBannerProps> = ({
  message = "DEMO DATA / SIMULATION (PHASE 1)",
  subMessage = "Les prédictions affichées proviennent du jeu de données de test et ne sont pas exécutées en direct par le modèle ML. L'orchestration temps réel sera intégrée via Airflow et MLflow dans les phases ultérieures."
}) => {
  return (
    <div className="bg-blue-950/40 border border-blue-800/50 rounded-xl p-4 mb-6 flex items-start gap-3 text-blue-200">
      <Info size={18} className="text-blue-400 mt-0.5 shrink-0" />
      <div className="text-sm">
        <strong className="font-semibold text-blue-300 mr-2">{message} :</strong>
        <span className="text-blue-200/90">{subMessage}</span>
      </div>
    </div>
  );
};
