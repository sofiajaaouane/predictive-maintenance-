package com.maintenance.maintenance_api.dto;

import lombok.*;

import java.util.List;

/**
 * Model info DTO for the ML model view.
 * Clearly identified as DEMO / MOCK for Phase 1.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MLModelInfoDto {
    private String modelName;
    private String modelVersion;
    private String framework;
    private Double accuracy;
    private Double precision;
    private Double recall;
    private Double f1Score;
    private List<String> targetComponents;
    private boolean isMock;
    private String disclaimer;
}
