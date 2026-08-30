export type PredictedComponent = 'none' | 'comp1' | 'comp2' | 'comp3' | 'comp4';
export type PredictionStatus = 'NORMAL' | 'WARNING' | 'CRITICAL';
export type RiskLevel = 'NORMAL' | 'AT_RISK';

/**
 * Prediction DTO matching Spring Boot PredictionDto
 * Strictly Read-Only via REST API
 */
export interface Prediction {
  id: number;
  machineId: number;
  machineIdentifier: string;
  timestamp: string;
  predictedComponent: PredictedComponent | string;
  probability: number;
  modelVersion: string;
  status: PredictionStatus | string;
}

/**
 * Machine DTO matching Spring Boot MachineDto
 */
export interface Machine {
  id: number;
  machineIdentifier: string;
  model: string;
  age: number; // Native dataset property
  riskLevel: RiskLevel | string; // Derived: "NORMAL" or "AT_RISK"
  lastPrediction?: Prediction | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * Telemetry DTO matching Spring Boot TelemetryDto
 */
export interface Telemetry {
  id: number;
  machineId: number;
  machineIdentifier: string;
  timestamp: string;
  voltage: number;
  rotation: number;
  pressure: number;
  vibration: number;
}

/**
 * Maintenance DTO matching Spring Boot MaintenanceDto
 */
export interface Maintenance {
  id: number;
  machineId: number;
  machineIdentifier: string;
  component: string;
  maintenanceDate: string;
  description: string;
}

/**
 * Machine Error DTO matching Spring Boot MachineErrorDto
 */
export interface MachineError {
  id: number;
  machineId: number;
  machineIdentifier: string;
  timestamp: string;
  errorCode: string;
  description: string;
}

/**
 * Alert DTO matching Spring Boot AlertDto
 */
export interface Alert {
  machineId: number;
  machineIdentifier: string;
  model: string;
  age: number;
  predictedComponent: PredictedComponent | string;
  probability: number;
  status: PredictionStatus | string;
  predictionDate: string;
}

/**
 * Dashboard Summary DTO matching Spring Boot DashboardSummaryDto
 */
export interface DashboardSummary {
  totalMachines: number;
  normalMachines: number;
  atRiskMachines: number;
  totalPredictions: number;
  latestPredictionDate: string | null;
  machinesRequiringAttention: Alert[];
  latestErrors: MachineError[];
  recentMaintenance: Maintenance[];
}

/**
 * ML Pipeline Status DTO matching Spring Boot MLPipelineStatusDto
 */
export interface MLPipelineStatus {
  status: string;
  lastRun: string;
  machinesProcessed: number;
  lastPredictionDate: string;
  modelName: string;
  modelVersion: string;
  isMock: boolean;
  disclaimer: string;
}

/**
 * ML Model Info DTO matching Spring Boot MLModelInfoDto
 */
export interface MLModelInfo {
  modelName: string;
  modelVersion: string;
  framework: string;
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  targetComponents: string[];
  isMock: boolean;
  disclaimer: string;
}
