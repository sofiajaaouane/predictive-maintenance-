import { useState, useEffect, useCallback } from 'react';
import { machineApi, MachineQueryParams } from '../api/machineApi';
import { Machine } from '../types';

export function useMachines(params?: MachineQueryParams) {
  const [machines, setMachines] = useState<Machine[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMachines = useCallback(
    async (isSilentRefresh = false) => {
      try {
        if (isSilentRefresh) {
          setIsRefreshing(true);
        } else {
          setIsLoading(true);
        }
        setError(null);
        const data = await machineApi.getMachines({
          search: params?.search || undefined,
          model: params?.model || undefined,
          riskLevel: params?.riskLevel || undefined,
        });
        setMachines(data);
      } catch (err: any) {
        setError(err?.message || 'Impossible de récupérer la liste des machines.');
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [params?.search, params?.model, params?.riskLevel]
  );

  useEffect(() => {
    fetchMachines(false);
  }, [fetchMachines]);

  const refetch = useCallback(() => {
    return fetchMachines(true);
  }, [fetchMachines]);

  return {
    machines,
    isLoading,
    isRefreshing,
    error,
    refetch,
  };
}
