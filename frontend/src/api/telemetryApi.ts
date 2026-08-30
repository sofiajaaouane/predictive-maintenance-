import { axiosInstance } from './axiosInstance';
import { Telemetry } from '../types';

export interface TelemetryPayload {
  machineId: number;
  timestamp?: string;
  voltage: number;
  rotation: number;
  pressure: number;
  vibration: number;
}

export const telemetryApi = {
  getMachineTelemetry: async (
    machineId: number,
    period: '6h' | '24h' | '7d' = '24h'
  ): Promise<Telemetry[]> => {
    const response = await axiosInstance.get<Telemetry[]>(`/api/machines/${machineId}/telemetry`, {
      params: { period },
    });
    return response.data;
  },

  getHistory: async (
    machineId: number,
    period: '6h' | '24h' | '7d' = '24h'
  ): Promise<Telemetry[]> => {
    return telemetryApi.getMachineTelemetry(machineId, period);
  },

  getLatestTelemetry: async (machineId: number): Promise<Telemetry> => {
    const response = await axiosInstance.get<Telemetry>(`/api/machines/${machineId}/telemetry/latest`);
    return response.data;
  },

  getLatest: async (machineId: number): Promise<Telemetry> => {
    return telemetryApi.getLatestTelemetry(machineId);
  },

  recordTelemetry: async (data: TelemetryPayload): Promise<Telemetry> => {
    const response = await axiosInstance.post<Telemetry>('/api/telemetry', data);
    return response.data;
  },
};
