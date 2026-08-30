import { axiosInstance } from './axiosInstance';
import { Machine } from '../types';

export interface MachineQueryParams {
  search?: string;
  model?: string;
  riskLevel?: string;
}

export interface MachinePayload {
  machineIdentifier: string;
  model: string;
  age: number;
}

export const machineApi = {
  getMachines: async (params?: MachineQueryParams): Promise<Machine[]> => {
    const response = await axiosInstance.get<Machine[]>('/api/machines', { params });
    return response.data;
  },

  getAll: async (params?: MachineQueryParams): Promise<Machine[]> => {
    return machineApi.getMachines(params);
  },

  getMachineById: async (id: number): Promise<Machine> => {
    const response = await axiosInstance.get<Machine>(`/api/machines/${id}`);
    return response.data;
  },

  getById: async (id: number): Promise<Machine> => {
    return machineApi.getMachineById(id);
  },

  createMachine: async (data: MachinePayload): Promise<Machine> => {
    const response = await axiosInstance.post<Machine>('/api/machines', data);
    return response.data;
  },

  create: async (data: MachinePayload): Promise<Machine> => {
    return machineApi.createMachine(data);
  },

  updateMachine: async (id: number, data: MachinePayload): Promise<Machine> => {
    const response = await axiosInstance.put<Machine>(`/api/machines/${id}`, data);
    return response.data;
  },

  update: async (id: number, data: MachinePayload): Promise<Machine> => {
    return machineApi.updateMachine(id, data);
  },

  deleteMachine: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/api/machines/${id}`);
  },

  delete: async (id: number): Promise<void> => {
    return machineApi.deleteMachine(id);
  },
};
