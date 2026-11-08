import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { machineApi } from '../api/machineApi';
import { Machine } from '../types';
import { Topbar } from '../layouts/Topbar';
import { ComponentBadge, StatusBadge } from '../components/common/Badge';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { Search, Filter, Factory, ChevronRight } from 'lucide-react';

export const Machines: React.FC = () => {
  const [machines, setMachines] = useState<Machine[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [modelFilter, setModelFilter] = useState('');
  const [riskFilter, setRiskFilter] = useState('');
  const navigate = useNavigate();

  const loadMachines = async () => {
    try {
      setIsRefreshing(true);
      const data = await machineApi.getAll({
        search: searchTerm || undefined,
        model: modelFilter || undefined,
        riskLevel: riskFilter || undefined,
      });
      setMachines(data);
    } catch (error) {
      console.error('Erreur chargement machines:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadMachines();
  }, [searchTerm, modelFilter, riskFilter]);

  const uniqueModels = Array.from(new Set(machines.map((m) => m.model))).filter(Boolean);

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-slate-50 dark:bg-[#080c14] transition-colors duration-200">
      <Topbar
        title="Parc de Machines Industrielles"
        subtitle="Inventaire des équipements, âge natif et niveau de risque dérivé"
        onRefresh={loadMachines}
        isRefreshing={isRefreshing}
      />

      <main className="flex-1 p-5 sm:p-8 max-w-[1600px] w-full mx-auto space-y-6">
        {/* Search & Filter Toolbar */}
        <div className="bg-[#f8fafc] dark:bg-[#0e1524] border border-slate-300/80 dark:border-[#1c2842] rounded-2xl p-4 shadow-xs flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-80">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Rechercher par ID ou modèle..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white dark:bg-[#080c14] border border-slate-300 dark:border-slate-800 rounded-xl text-xs font-mono text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors shadow-2xs"
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="flex items-center gap-2">
              <Filter size={13} className="text-slate-400" />
              <select
                value={modelFilter}
                onChange={(e) => setModelFilter(e.target.value)}
                className="bg-white dark:bg-[#080c14] border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-slate-800 dark:text-slate-200 focus:outline-none focus:border-blue-500 shadow-2xs"
              >
                <option value="">Tous les modèles</option>
                {uniqueModels.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            <select
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value)}
              className="bg-white dark:bg-[#080c14] border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-slate-800 dark:text-slate-200 focus:outline-none focus:border-blue-500 shadow-2xs"
            >
              <option value="">Tous les risques</option>
              <option value="NORMAL">Normal</option>
              <option value="AT_RISK">À Risque</option>
            </select>
          </div>
        </div>

        {/* Industrial Machines Directory Table */}
        <div className="bg-[#f8fafc] dark:bg-[#0e1524] border border-slate-300/80 dark:border-[#1c2842] rounded-2xl overflow-hidden shadow-xs">
          {isLoading ? (
            <LoadingSpinner text="Chargement du parc de machines..." />
          ) : machines.length === 0 ? (
            <div className="p-12 text-center text-slate-400 font-mono text-xs">
              <Factory size={36} className="mx-auto mb-2 opacity-30" />
              <p>Aucun équipement ne correspond aux critères.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
                <thead className="bg-slate-50 dark:bg-[#080c14] text-[10px] font-mono text-slate-400 uppercase tracking-wider font-bold border-b border-slate-200 dark:border-[#1c2842]">
                  <tr>
                    <th className="px-6 py-4">Machine ID</th>
                    <th className="px-6 py-4">Modèle</th>
                    <th className="px-6 py-4">Âge Natif (Dataset)</th>
                    <th className="px-6 py-4">Niveau de Risque</th>
                    <th className="px-6 py-4">Composant Prédit</th>
                    <th className="px-6 py-4">Probabilité</th>
                    <th className="px-6 py-4 text-right">Cockpit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
                  {machines.map((machine) => (
                    <tr
                      key={machine.id}
                      onClick={() => navigate(`/machines/${machine.id}`)}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors cursor-pointer group"
                    >
                      <td className="px-6 py-4 font-mono font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
                        <div className={`p-1.5 rounded-lg ${machine.riskLevel === 'AT_RISK' ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400' : 'bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400'}`}>
                          <Factory size={15} />
                        </div>
                        <span className="group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {machine.machineIdentifier}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-mono text-slate-600 dark:text-slate-300">{machine.model}</td>
                      <td className="px-6 py-4 font-mono text-slate-500 dark:text-slate-400">
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
                      <td className="px-6 py-4 font-mono font-bold text-slate-900 dark:text-slate-200">
                        {machine.lastPrediction?.probability !== undefined
                          ? `${Math.round(machine.lastPrediction.probability * 100)}%`
                          : '—'}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="inline-flex items-center text-slate-400 group-hover:text-blue-500 transition-colors">
                          <ChevronRight size={16} />
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
