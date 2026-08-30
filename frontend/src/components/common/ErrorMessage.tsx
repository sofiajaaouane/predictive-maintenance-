import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorMessageProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  title = 'Erreur de communication',
  message = 'Impossible de récupérer les données depuis le serveur Spring Boot.',
  onRetry,
}) => {
  return (
    <div className="p-6 rounded-2xl bg-rose-950/30 border border-rose-800/50 text-rose-200 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg my-4">
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-rose-900/50 border border-rose-700/60 text-rose-400 shrink-0">
          <AlertCircle size={22} />
        </div>
        <div>
          <h4 className="font-bold text-white text-sm">{title}</h4>
          <p className="text-xs text-rose-300/80 mt-0.5">{message}</p>
        </div>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl bg-rose-900/60 hover:bg-rose-900 border border-rose-700 text-white transition-all shrink-0"
        >
          <RefreshCw size={13} />
          <span>Réessayer</span>
        </button>
      )}
    </div>
  );
};
