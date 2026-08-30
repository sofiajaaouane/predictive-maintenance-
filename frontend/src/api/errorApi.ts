import { axiosInstance } from './axiosInstance';
import { MachineError } from '../types';

export const errorApi = {
  getErrorsByMachineId: async (machineId: number): Promise<MachineError[]> => {
    const response = await axiosInstance.get<MachineError[]>(`/api/machines/${machineId}/errors`);
    return response.data;
  },

  getByMachineId: async (machineId: number): Promise<MachineError[]> => {
    return errorApi.getErrorsByMachineId(machineId);
  },
};
