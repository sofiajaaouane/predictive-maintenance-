package com.maintenance.maintenance_api.dto;

import lombok.*;

import java.time.Instant;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MachineDto {
    private Long id;
    private String machineIdentifier;
    private String model;
    private Integer age;
    private String riskLevel; // Derived: "NORMAL" or "AT_RISK"
    private PredictionDto lastPrediction;
    private Instant createdAt;
    private Instant updatedAt;
}
