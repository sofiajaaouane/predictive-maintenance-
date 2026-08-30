package com.maintenance.maintenance_api.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

/**
 * Telemetry entity representing raw sensor readings.
 * Has index on (machine_id, timestamp) for rapid historical queries.
 */
@Entity
@Table(
    name = "telemetry",
    indexes = {
        @Index(name = "idx_telemetry_machine_timestamp", columnList = "machine_id, timestamp DESC")
    }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Telemetry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "machine_id", nullable = false)
    private Machine machine;

    @Column(name = "timestamp", nullable = false)
    private Instant timestamp;

    @Column(name = "voltage", nullable = false)
    private Double voltage;

    @Column(name = "rotation", nullable = false)
    private Double rotation;

    @Column(name = "pressure", nullable = false)
    private Double pressure;

    @Column(name = "vibration", nullable = false)
    private Double vibration;
}
