package com.maintenance.maintenance_api.dto;

import lombok.*;

import java.time.Instant;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MaintenanceDto {
    private Long id;
    private Long machineId;
    private String machineIdentifier;
    private String component;
    private Instant maintenanceDate;
    private String description;
}
