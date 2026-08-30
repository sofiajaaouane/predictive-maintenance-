import { axiosInstance } from './axiosInstance';
import { DashboardSummary } from '../types';

export const dashboardApi = {
  getDashboard: async (): Promise<DashboardSummary> => {
    const response = await axiosInstance.get<DashboardSummary>('/api/dashboard');
    return response.data;
  },

  getDashboardSummary: async (): Promise<DashboardSummary> => {
    return dashboardApi.getDashboard();
  },

  getSummary: async (): Promise<DashboardSummary> => {
    return dashboardApi.getDashboard();
  },
};
