package com.maintenance.maintenance_api.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

/**
 * Machine entity representing native attributes from the Azure Predictive Maintenance dataset.
 * Note: Operational statuses (RUNNING, OFFLINE, MAINTENANCE) are NOT stored in the database.
 */
@Entity
@Table(name = "machines")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Machine {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "machine_identifier", nullable = false, unique = true, length = 50)
    private String machineIdentifier;

    @Column(name = "model", nullable = false, length = 50)
    private String model;

    @Column(name = "age", nullable = false)
    private Integer age;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    @OneToMany(mappedBy = "machine", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Telemetry> telemetryList = new ArrayList<>();

    @OneToMany(mappedBy = "machine", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Prediction> predictionList = new ArrayList<>();

    @OneToMany(mappedBy = "machine", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Maintenance> maintenanceList = new ArrayList<>();

    @OneToMany(mappedBy = "machine", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<MachineError> errorList = new ArrayList<>();
}
