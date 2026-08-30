import { useState, useEffect, useCallback } from 'react';
import { predictionApi, PredictionQueryParams } from '../api/predictionApi';
import { Prediction } from '../types';

export function usePredictions(params?: PredictionQueryParams) {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPredictions = useCallback(
    async (isSilentRefresh = false) => {
      try {
        if (isSilentRefresh) {
          setIsRefreshing(true);
        } else {
          setIsLoading(true);
        }
        setError(null);
        const data = await predictionApi.getPredictions({
          component: params?.component || undefined,
          status: params?.status || undefined,
        });
        setPredictions(data);
      } catch (err: any) {
        setError(err?.message || 'Impossible de récupérer les prédictions.');
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [params?.component, params?.status]
  );

  useEffect(() => {
    fetchPredictions(false);
  }, [fetchPredictions]);

  const refetch = useCallback(() => {
    return fetchPredictions(true);
  }, [fetchPredictions]);

  return {
    predictions,
    isLoading,
    isRefreshing,
    error,
    refetch,
  };
}
