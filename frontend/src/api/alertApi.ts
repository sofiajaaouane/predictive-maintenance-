import { axiosInstance } from './axiosInstance';
import { Alert } from '../types';

export const alertApi = {
  getActiveAlerts: async (): Promise<Alert[]> => {
    const response = await axiosInstance.get<Alert[]>('/api/alerts');
    return response.data;
  },

  getAlerts: async (): Promise<Alert[]> => {
    return alertApi.getActiveAlerts();
  },
};
