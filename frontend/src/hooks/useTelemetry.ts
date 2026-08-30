import { useState, useEffect, useCallback } from 'react';
import { telemetryApi } from '../api/telemetryApi';
import { Telemetry } from '../types';

export function useTelemetry(
  machineId: number | null | undefined,
  period: '6h' | '24h' | '7d' = '24h'
) {
  const [telemetry, setTelemetry] = useState<Telemetry[]>([]);
  const [latest, setLatest] = useState<Telemetry | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTelemetry = useCallback(
    async (currentPeriod: '6h' | '24h' | '7d') => {
      if (!machineId || isNaN(machineId)) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        const data = await telemetryApi.getMachineTelemetry(machineId, currentPeriod);
        setTelemetry(data);
        if (data.length > 0) {
          setLatest(data[data.length - 1]);
        }
      } catch (err: any) {
        setError(err?.message || 'Impossible de charger les données de télémétrie.');
      } finally {
        setIsLoading(false);
      }
    },
    [machineId]
  );

  useEffect(() => {
    fetchTelemetry(period);
  }, [fetchTelemetry, period]);

  const refetch = useCallback(() => {
    return fetchTelemetry(period);
  }, [fetchTelemetry, period]);

  return {
    telemetry,
    latest,
    isLoading,
    error,
    refetch,
  };
}
