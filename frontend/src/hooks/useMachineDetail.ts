import { useState, useEffect, useCallback } from 'react';
import { machineApi } from '../api/machineApi';
import { predictionApi } from '../api/predictionApi';
import { maintenanceApi } from '../api/maintenanceApi';
import { errorApi } from '../api/errorApi';
import { Machine, Prediction, Maintenance, MachineError } from '../types';

export function useMachineDetail(machineId: number | null | undefined) {
  const [machine, setMachine] = useState<Machine | null>(null);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [maintenanceList, setMaintenanceList] = useState<Maintenance[]>([]);
  const [errorList, setErrorList] = useState<MachineError[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMachineDetail = useCallback(
    async (isSilentRefresh = false) => {
      if (!machineId || isNaN(machineId)) {
        setIsLoading(false);
        return;
      }

      try {
        if (isSilentRefresh) {
          setIsRefreshing(true);
        } else {
          setIsLoading(true);
        }
        setError(null);

        const [m, p, maint, errs] = await Promise.all([
          machineApi.getMachineById(machineId),
          predictionApi.getMachinePredictions(machineId),
          maintenanceApi.getMaintenanceByMachineId(machineId),
          errorApi.getErrorsByMachineId(machineId),
        ]);

        setMachine(m);
        setPredictions(p);
        setMaintenanceList(maint);
        setErrorList(errs);
      } catch (err: any) {
        setError(err?.message || `Impossible de récupérer les détails de la machine #${machineId}.`);
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [machineId]
  );

  useEffect(() => {
    fetchMachineDetail(false);
  }, [fetchMachineDetail]);

  const refetch = useCallback(() => {
    return fetchMachineDetail(true);
  }, [fetchMachineDetail]);

  return {
    machine,
    predictions,
    maintenanceList,
    errorList,
    isLoading,
    isRefreshing,
    error,
    refetch,
  };
}
