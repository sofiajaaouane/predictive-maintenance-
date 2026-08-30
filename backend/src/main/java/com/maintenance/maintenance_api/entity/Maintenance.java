package com.maintenance.maintenance_api.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

/**
 * Maintenance entity representing historical interventions.
 * A historical maintenance event does not mean the machine is currently in maintenance.
 */
@Entity
@Table(
    name = "maintenance",
    indexes = {
        @Index(name = "idx_maintenance_machine_date", columnList = "machine_id, maintenance_date DESC")
    }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Maintenance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "machine_id", nullable = false)
    private Machine machine;

    @Column(name = "component", nullable = false, length = 20)
    private String component;

    @Column(name = "maintenance_date", nullable = false)
    private Instant maintenanceDate;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;
}
