package com.maintenance.maintenance_api.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

/**
 * MachineError entity representing error events logged by industrial machines.
 * Stored for historical querying and future ML feature engineering in the Python service.
 */
@Entity
@Table(
    name = "errors",
    indexes = {
        @Index(name = "idx_errors_machine_timestamp", columnList = "machine_id, timestamp DESC")
    }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MachineError {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "machine_id", nullable = false)
    private Machine machine;

    @Column(name = "timestamp", nullable = false)
    private Instant timestamp;

    @Column(name = "error_code", nullable = false, length = 50)
    private String errorCode;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;
}
