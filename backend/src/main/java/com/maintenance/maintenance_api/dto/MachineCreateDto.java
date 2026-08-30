package com.maintenance.maintenance_api.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MachineCreateDto {

    @NotBlank(message = "L'identifiant machine (machineIdentifier) est obligatoire")
    @Size(max = 50, message = "L'identifiant machine ne doit pas dépasser 50 caractères")
    private String machineIdentifier;

    @NotBlank(message = "Le modèle de machine (model) est obligatoire")
    @Size(max = 50, message = "Le modèle ne doit pas dépasser 50 caractères")
    private String model;

    @NotNull(message = "L'âge de la machine est obligatoire")
    @PositiveOrZero(message = "L'âge de la machine doit être supérieur ou égal à zéro")
    private Integer age;
}
