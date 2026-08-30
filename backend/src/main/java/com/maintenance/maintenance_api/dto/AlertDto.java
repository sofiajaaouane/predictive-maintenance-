package com.maintenance.maintenance_api.dto;

import lombok.*;

import java.time.Instant;

/**
 * AlertDto represents a machine whose latest recorded prediction indicates a component failure risk.
 * Extracted directly from existing predictions; does not perform any ML computation.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AlertDto {
    private Long machineId;
    private String machineIdentifier;
    private String model;
    private Integer age;
    private String predictedComponent; // "comp1", "comp2", "comp3", "comp4"
    private Double probability;
    private String status; // "WARNING", "CRITICAL"
    private Instant predictionDate;
}
