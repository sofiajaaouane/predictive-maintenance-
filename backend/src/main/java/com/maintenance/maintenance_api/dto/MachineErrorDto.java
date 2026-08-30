package com.maintenance.maintenance_api.dto;

import lombok.*;

import java.time.Instant;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MachineErrorDto {
    private Long id;
    private Long machineId;
    private String machineIdentifier;
    private Instant timestamp;
    private String errorCode;
    private String description;
}
