package com.maintenance.maintenance_api.dto;

import lombok.*;

import java.time.Instant;

/**
 * Status DTO for the ML Pipeline monitoring view.
 * Clearly identified as DEMO / MOCK for Phase 1.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MLPipelineStatusDto {
    private String status; // "HEALTHY", "IDLE", "RUNNING"
    private Instant lastRun;
    private int machinesProcessed;
    private Instant lastPredictionDate;
    private String modelName;
    private String modelVersion;
    private boolean isMock;
    private String disclaimer;
}
