import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  text?: string;
  size?: number;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ text = "Chargement des données...", size = 28 }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-slate-400 gap-3">
      <Loader2 size={size} className="animate-spin text-blue-500" />
      <span className="text-sm font-medium">{text}</span>
    </div>
  );
};
