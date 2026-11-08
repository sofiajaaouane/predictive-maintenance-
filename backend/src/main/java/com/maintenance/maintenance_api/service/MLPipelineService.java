package com.maintenance.maintenance_api.service;

import com.maintenance.maintenance_api.dto.MLModelInfoDto;
import com.maintenance.maintenance_api.dto.MLPipelineStatusDto;
import com.maintenance.maintenance_api.repository.MachineRepository;
import com.maintenance.maintenance_api.repository.PredictionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.Instant;
import java.util.Arrays;

/**
 * Service providing ML Pipeline and Model metadata for monitoring.
 * In Phase 1, data is explicitly marked as MOCK / DEMO DATA.
 * Live Airflow / MLflow orchestration will be integrated in future phases.
 */
@Service
@RequiredArgsConstructor
public class MLPipelineService {

    private final MachineRepository machineRepository;
    private final PredictionRepository predictionRepository;

    public MLPipelineStatusDto getPipelineStatus() {
        int machineCount = (int) machineRepository.count();
        Instant lastRun = Instant.now().minus(Duration.ofMinutes(15));
        Instant lastPredictionDate = Instant.now().minus(Duration.ofHours(2));

        return MLPipelineStatusDto.builder()
                .status("HEALTHY")
                .lastRun(lastRun)
                .machinesProcessed(machineCount > 0 ? machineCount : 10)
                .lastPredictionDate(lastPredictionDate)
                .modelName("pm-gradient-boost")
                .modelVersion("v2.4.1")
                .isMock(true)
                .disclaimer("Ce statut simule l'état du futur pipeline Airflow / MLflow.")
                .build();
    }

    public MLModelInfoDto getModelInfo() {
        return MLModelInfoDto.builder()
                .modelName("pm-gradient-boost")
                .modelVersion("v2.4.1")
                .framework("Scikit-Learn / LightGBM")
                .accuracy(0.942)
                .precision(0.918)
                .recall(0.886)
                .f1Score(0.902)
                .targetComponents(Arrays.asList("none", "comp1", "comp2", "comp3", "comp4"))
                .isMock(true)
                .disclaimer("DEMO DATA / MOCK: Les métriques affichées sont indicatives et préparent l'intégration future avec le MLflow Model Registry.")
                .build();
    }
}
