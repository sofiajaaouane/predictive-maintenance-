import { useState, useEffect, useCallback } from 'react';
import { dashboardApi } from '../api/dashboardApi';
import { DashboardSummary } from '../types';

export function useDashboard() {
  const [data, setData] = useState<DashboardSummary | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = useCallback(async (isSilentRefresh = false) => {
    try {
      if (isSilentRefresh) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }
      setError(null);
      const summary = await dashboardApi.getDashboard();
      setData(summary);
    } catch (err: any) {
      setError(err?.message || 'Impossible de récupérer les données du tableau de bord.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard(false);
  }, [fetchDashboard]);

  const refetch = useCallback(() => {
    return fetchDashboard(true);
  }, [fetchDashboard]);

  return {
    data,
    isLoading,
    isRefreshing,
    error,
    refetch,
  };
}
