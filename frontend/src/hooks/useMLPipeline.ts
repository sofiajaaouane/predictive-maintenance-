import { useState, useEffect, useCallback } from 'react';
import { mlApi } from '../api/mlApi';
import { MLModelInfo, MLPipelineStatus } from '../types';

export function useMLPipeline() {
  const [pipelineStatus, setPipelineStatus] = useState<MLPipelineStatus | null>(null);
  const [modelInfo, setModelInfo] = useState<MLModelInfo | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMLData = useCallback(async (isSilentRefresh = false) => {
    try {
      if (isSilentRefresh) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }
      setError(null);
      const [status, info] = await Promise.all([
        mlApi.getPipelineStatus(),
        mlApi.getModelInfo(),
      ]);
      setPipelineStatus(status);
      setModelInfo(info);
    } catch (err: any) {
      setError(err?.message || 'Impossible de récupérer les métriques du pipeline ML.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchMLData(false);
  }, [fetchMLData]);

  const refetch = useCallback(() => {
    return fetchMLData(true);
  }, [fetchMLData]);

  return {
    pipelineStatus,
    modelInfo,
    isLoading,
    isRefreshing,
    error,
    refetch,
  };
}
