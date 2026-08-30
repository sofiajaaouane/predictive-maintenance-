package com.maintenance.maintenance_api.dto;

import lombok.*;

import java.time.Instant;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TelemetryDto {
    private Long id;
    private Long machineId;
    private String machineIdentifier;
    private Instant timestamp;
    private Double voltage;
    private Double rotation;
    private Double pressure;
    private Double vibration;
}
