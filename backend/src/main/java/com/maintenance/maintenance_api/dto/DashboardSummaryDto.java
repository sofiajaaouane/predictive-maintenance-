package com.maintenance.maintenance_api.dto;

import lombok.*;

import java.time.Instant;
import java.util.List;

/**
 * Summary DTO for the main supervision dashboard.
 * All metrics are strictly derived from native database records and existing predictions.
 * Note: No fake categories like RUNNING / OFFLINE are present.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardSummaryDto {
    private long totalMachines;
    private long normalMachines;
    private long atRiskMachines;
    private long totalPredictions;
    private Instant latestPredictionDate;
    private List<AlertDto> machinesRequiringAttention;
    private List<MachineErrorDto> latestErrors;
    private List<MaintenanceDto> recentMaintenance;
}
