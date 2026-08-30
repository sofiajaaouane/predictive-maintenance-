import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Alert } from '../../types';
import { ComponentBadge, StatusBadge } from '../common/Badge';
import { ShieldCheck, ExternalLink, ArrowUpRight } from 'lucide-react';
import { formatTimeAgo } from '../../utils/dateUtils';

interface AlertTableProps {
  alerts: Alert[];
  onViewAll?: () => void;
  showViewAllButton?: boolean;
}

export const AlertTable: React.FC<AlertTableProps> = ({
  alerts,
  onViewAll,
  showViewAllButton = false,
}) => {
  const navigate = useNavigate();

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="bg-slate-950/60 text-xs text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
            <tr>
              <th className="px-6 py-4">Machine</th>
              <th className="px-6 py-4">Modèle & Âge</th>
              <th className="px-6 py-4">Composant à Risque</th>
              <th className="px-6 py-4">Probabilité</th>
              <th className="px-6 py-4">Niveau de Risque</th>
              <th className="px-6 py-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-medium">
            {alerts && alerts.length > 0 ? (
              alerts.map((alert) => (
                <tr
                  key={alert.machineId}
                  onClick={() => navigate(`/machines/${alert.machineId}`)}
                  className="hover:bg-slate-800/40 transition-colors cursor-pointer"
                >
                  <td className="px-6 py-4 font-mono font-bold text-white flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                    {alert.machineIdentifier}
                  </td>
                  <td className="px-6 py-4 text-slate-400">
                    {alert.model} · <span className="font-mono">{alert.age} ans</span>
                  </td>
                  <td className="px-6 py-4">
                    <ComponentBadge component={alert.predictedComponent} />
                  </td>
                  <td className="px-6 py-4 font-mono font-bold text-slate-200">
                    {Math.round(alert.probability * 100)}%
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={alert.status} />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/machines/${alert.machineId}`);
                      }}
                      className="px-3 py-1 text-xs font-semibold rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30 hover:bg-blue-600/30 transition-all inline-flex items-center gap-1"
                    >
                      Détails <ExternalLink size={12} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                  <ShieldCheck size={32} className="mx-auto mb-2 text-emerald-400/50" />
                  Aucune machine ne nécessite d'attention critique pour le moment.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
