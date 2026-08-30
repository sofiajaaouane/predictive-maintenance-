import { axiosInstance } from './axiosInstance';
import { MLModelInfo, MLPipelineStatus } from '../types';

export const mlApi = {
  getPipelineStatus: async (): Promise<MLPipelineStatus> => {
    const response = await axiosInstance.get<MLPipelineStatus>('/api/ml/pipeline-status');
    return response.data;
  },

  getModelInfo: async (): Promise<MLModelInfo> => {
    const response = await axiosInstance.get<MLModelInfo>('/api/ml/model');
    return response.data;
  },
};
