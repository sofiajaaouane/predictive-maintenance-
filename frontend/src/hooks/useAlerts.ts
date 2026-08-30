import { useState, useEffect, useCallback } from 'react';
import { alertApi } from '../api/alertApi';
import { Alert } from '../types';

export function useAlerts() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAlerts = useCallback(async (isSilentRefresh = false) => {
    try {
      if (isSilentRefresh) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }
      setError(null);
      const data = await alertApi.getActiveAlerts();
      setAlerts(data);
    } catch (err: any) {
      setError(err?.message || 'Impossible de récupérer les alertes actives.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchAlerts(false);
  }, [fetchAlerts]);

  const refetch = useCallback(() => {
    return fetchAlerts(true);
  }, [fetchAlerts]);

  return {
    alerts,
    isLoading,
    isRefreshing,
    error,
    refetch,
  };
}
