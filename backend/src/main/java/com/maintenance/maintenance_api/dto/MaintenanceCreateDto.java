package com.maintenance.maintenance_api.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.*;

import java.time.Instant;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MaintenanceCreateDto {

    @NotBlank(message = "Le composant maintenu est obligatoire")
    @Pattern(regexp = "^(comp1|comp2|comp3|comp4|other)$", message = "Le composant doit être comp1, comp2, comp3, comp4 ou other")
    private String component;

    @NotNull(message = "La date d'intervention de maintenance est obligatoire")
    private Instant maintenanceDate;

    private String description;
}
