package com.maintenance.maintenance_api.service;

import com.maintenance.maintenance_api.dto.AlertDto;
import com.maintenance.maintenance_api.dto.DashboardSummaryDto;
import com.maintenance.maintenance_api.dto.MachineErrorDto;
import com.maintenance.maintenance_api.dto.MaintenanceDto;
import com.maintenance.maintenance_api.entity.Prediction;
import com.maintenance.maintenance_api.repository.MachineRepository;
import com.maintenance.maintenance_api.repository.PredictionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DashboardService {

    private final MachineRepository machineRepository;
    private final PredictionRepository predictionRepository;
    private final AlertService alertService;
    private final MachineErrorService errorService;
    private final MaintenanceService maintenanceService;

    public DashboardSummaryDto getDashboardSummary() {
        long totalMachines = machineRepository.count();
        List<Prediction> latestPredictions = predictionRepository.findLatestPredictionsForAllMachines();

        long atRiskMachines = latestPredictions.stream()
                .filter(p -> p.getPredictedComponent() != null && !p.getPredictedComponent().equalsIgnoreCase("none"))
                .count();

        long normalMachines = Math.max(0, totalMachines - atRiskMachines);
        long totalPredictions = predictionRepository.count();

        Instant latestPredictionDate = latestPredictions.stream()
                .map(Prediction::getTimestamp)
                .max(Instant::compareTo)
                .orElse(null);

        List<AlertDto> machinesRequiringAttention = alertService.getActiveAlerts();
        List<MachineErrorDto> latestErrors = errorService.getRecentErrors(5);
        List<MaintenanceDto> recentMaintenance = maintenanceService.getRecentMaintenance(5);

        return DashboardSummaryDto.builder()
                .totalMachines(totalMachines)
                .normalMachines(normalMachines)
                .atRiskMachines(atRiskMachines)
                .totalPredictions(totalPredictions)
                .latestPredictionDate(latestPredictionDate)
                .machinesRequiringAttention(machinesRequiringAttention)
                .latestErrors(latestErrors)
                .recentMaintenance(recentMaintenance)
                .build();
    }
}
