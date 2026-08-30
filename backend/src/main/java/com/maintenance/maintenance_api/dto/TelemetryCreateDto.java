package com.maintenance.maintenance_api.dto;

import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.Instant;

/**
 * DTO for receiving new telemetry measurements via REST or the future Kafka consumer.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TelemetryCreateDto {

    private Long machineId;

    private String machineIdentifier;

    @NotNull(message = "Le timestamp de la mesure est obligatoire")
    private Instant timestamp;

    @NotNull(message = "La tension (voltage) est obligatoire")
    private Double voltage;

    @NotNull(message = "La vitesse de rotation (rotation) est obligatoire")
    private Double rotation;

    @NotNull(message = "La pression (pressure) est obligatoire")
    private Double pressure;

    @NotNull(message = "Le niveau de vibration (vibration) est obligatoire")
    private Double vibration;
}
