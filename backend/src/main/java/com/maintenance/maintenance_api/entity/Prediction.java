package com.maintenance.maintenance_api.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

/**
 * Prediction entity representing persisted outputs produced by the ML pipeline.
 * status represents the risk classification for this prediction: NORMAL, WARNING, CRITICAL.
 * Spring Boot does not execute the ML model or feature engineering; it only stores and exposes predictions.
 */
@Entity
@Table(
    name = "predictions",
    indexes = {
        @Index(name = "idx_predictions_machine_timestamp", columnList = "machine_id, timestamp DESC")
    }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Prediction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "machine_id", nullable = false)
    private Machine machine;

    @Column(name = "timestamp", nullable = false)
    private Instant timestamp;

    @Column(name = "predicted_component", nullable = false, length = 20)
    private String predictedComponent;

    @Column(name = "probability", nullable = false)
    private Double probability;

    @Column(name = "model_version", nullable = false, length = 50)
    private String modelVersion;

    @Column(name = "status", nullable = false, length = 20)
    private String status;
}
