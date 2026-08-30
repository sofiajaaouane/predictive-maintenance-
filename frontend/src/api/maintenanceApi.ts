import { axiosInstance } from './axiosInstance';
import { Maintenance } from '../types';

export interface MaintenancePayload {
  component: string;
  maintenanceDate: string;
  description?: string;
}

export const maintenanceApi = {
  getMaintenanceByMachineId: async (machineId: number): Promise<Maintenance[]> => {
    const response = await axiosInstance.get<Maintenance[]>(`/api/machines/${machineId}/maintenance`);
    return response.data;
  },

  getByMachineId: async (machineId: number): Promise<Maintenance[]> => {
    return maintenanceApi.getMaintenanceByMachineId(machineId);
  },

  recordMaintenance: async (
    machineId: number,
    data: MaintenancePayload
  ): Promise<Maintenance> => {
    const response = await axiosInstance.post<Maintenance>(
      `/api/machines/${machineId}/maintenance`,
      data
    );
    return response.data;
  },

  create: async (machineId: number, data: MaintenancePayload): Promise<Maintenance> => {
    return maintenanceApi.recordMaintenance(machineId, data);
  },
};
