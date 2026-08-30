package com.maintenance.maintenance_api.mapper;

import com.maintenance.maintenance_api.dto.*;
import com.maintenance.maintenance_api.entity.*;
import org.springframework.stereotype.Component;

@Component
public class EntityMapper {

    /**
     * Maps Machine entity to MachineDto with derived risk level and latest prediction.
     * Rule:
     * - predictedComponent = "none" -> NORMAL
     * - predictedComponent != "none" -> AT_RISK
     * Age is native from dataset.
     */
    public MachineDto toMachineDto(Machine machine, Prediction latestPrediction) {
        if (machine == null) {
            return null;
        }

        String riskLevel = "NORMAL";
        PredictionDto predictionDto = null;

        if (latestPrediction != null) {
            predictionDto = toPredictionDto(latestPrediction);
            if (latestPrediction.getPredictedComponent() != null &&
                !latestPrediction.getPredictedComponent().equalsIgnoreCase("none")) {
                riskLevel = "AT_RISK";
            }
        }

        return MachineDto.builder()
                .id(machine.getId())
                .machineIdentifier(machine.getMachineIdentifier())
                .model(machine.getModel())
                .age(machine.getAge())
                .riskLevel(riskLevel)
                .lastPrediction(predictionDto)
                .createdAt(machine.getCreatedAt())
                .updatedAt(machine.getUpdatedAt())
                .build();
    }

    public Machine toMachineEntity(MachineCreateDto dto) {
        if (dto == null) {
            return null;
        }
        return Machine.builder()
                .machineIdentifier(dto.getMachineIdentifier().trim())
                .model(dto.getModel().trim())
                .age(dto.getAge())
                .build();
    }

    public TelemetryDto toTelemetryDto(Telemetry telemetry) {
        if (telemetry == null) {
            return null;
        }
        return TelemetryDto.builder()
                .id(telemetry.getId())
                .machineId(telemetry.getMachine() != null ? telemetry.getMachine().getId() : null)
                .machineIdentifier(telemetry.getMachine() != null ? telemetry.getMachine().getMachineIdentifier() : null)
                .timestamp(telemetry.getTimestamp())
                .voltage(telemetry.getVoltage())
                .rotation(telemetry.getRotation())
                .pressure(telemetry.getPressure())
                .vibration(telemetry.getVibration())
                .build();
    }

    public Telemetry toTelemetryEntity(TelemetryCreateDto dto, Machine machine) {
        if (dto == null) {
            return null;
        }
        return Telemetry.builder()
                .machine(machine)
                .timestamp(dto.getTimestamp())
                .voltage(dto.getVoltage())
                .rotation(dto.getRotation())
                .pressure(dto.getPressure())
                .vibration(dto.getVibration())
                .build();
    }

    public PredictionDto toPredictionDto(Prediction prediction) {
        if (prediction == null) {
            return null;
        }
        return PredictionDto.builder()
                .id(prediction.getId())
                .machineId(prediction.getMachine() != null ? prediction.getMachine().getId() : null)
                .machineIdentifier(prediction.getMachine() != null ? prediction.getMachine().getMachineIdentifier() : null)
                .timestamp(prediction.getTimestamp())
                .predictedComponent(prediction.getPredictedComponent())
                .probability(prediction.getProbability())
                .modelVersion(prediction.getModelVersion())
                .status(prediction.getStatus())
                .build();
    }

    public MaintenanceDto toMaintenanceDto(Maintenance maintenance) {
        if (maintenance == null) {
            return null;
        }
        return MaintenanceDto.builder()
                .id(maintenance.getId())
                .machineId(maintenance.getMachine() != null ? maintenance.getMachine().getId() : null)
                .machineIdentifier(maintenance.getMachine() != null ? maintenance.getMachine().getMachineIdentifier() : null)
                .component(maintenance.getComponent())
                .maintenanceDate(maintenance.getMaintenanceDate())
                .description(maintenance.getDescription())
                .build();
    }

    public Maintenance toMaintenanceEntity(MaintenanceCreateDto dto, Machine machine) {
        if (dto == null) {
            return null;
        }
        return Maintenance.builder()
                .machine(machine)
                .component(dto.getComponent())
                .maintenanceDate(dto.getMaintenanceDate())
                .description(dto.getDescription())
                .build();
    }

    public MachineErrorDto toMachineErrorDto(MachineError error) {
        if (error == null) {
            return null;
        }
        return MachineErrorDto.builder()
                .id(error.getId())
                .machineId(error.getMachine() != null ? error.getMachine().getId() : null)
                .machineIdentifier(error.getMachine() != null ? error.getMachine().getMachineIdentifier() : null)
                .timestamp(error.getTimestamp())
                .errorCode(error.getErrorCode())
                .description(error.getDescription())
                .build();
    }

    public AlertDto toAlertDto(Machine machine, Prediction prediction) {
        if (machine == null || prediction == null) {
            return null;
        }
        return AlertDto.builder()
                .machineId(machine.getId())
                .machineIdentifier(machine.getMachineIdentifier())
                .model(machine.getModel())
                .age(machine.getAge())
                .predictedComponent(prediction.getPredictedComponent())
                .probability(prediction.getProbability())
                .status(prediction.getStatus())
                .predictionDate(prediction.getTimestamp())
                .build();
    }
}
