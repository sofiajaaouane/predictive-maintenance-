package com.maintenance.maintenance_api.service;

import com.maintenance.maintenance_api.dto.AlertDto;
import com.maintenance.maintenance_api.entity.Machine;
import com.maintenance.maintenance_api.entity.Prediction;
import com.maintenance.maintenance_api.mapper.EntityMapper;
import com.maintenance.maintenance_api.repository.PredictionRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.Instant;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AlertServiceTest {

    @Mock
    private PredictionRepository predictionRepository;

    @Spy
    private EntityMapper entityMapper = new EntityMapper();

    @InjectMocks
    private AlertService alertService;

    @Test
    void getActiveAlerts_shouldFilterOutNonePredictionsAndSortByProbability() {
        Machine m1 = Machine.builder().id(1L).machineIdentifier("MCH-001").model("model3").age(18).build();
        Machine m2 = Machine.builder().id(2L).machineIdentifier("MCH-002").model("model1").age(7).build();
        Machine m3 = Machine.builder().id(3L).machineIdentifier("MCH-003").model("model4").age(14).build();

        Prediction p1 = Prediction.builder().id(1L).machine(m1).predictedComponent("comp2").probability(0.88).status("CRITICAL").timestamp(Instant.now()).build();
        Prediction p2 = Prediction.builder().id(2L).machine(m2).predictedComponent("none").probability(0.05).status("NORMAL").timestamp(Instant.now()).build();
        Prediction p3 = Prediction.builder().id(3L).machine(m3).predictedComponent("comp4").probability(0.95).status("CRITICAL").timestamp(Instant.now()).build();

        when(predictionRepository.findLatestPredictionsForAllMachines()).thenReturn(List.of(p1, p2, p3));

        List<AlertDto> alerts = alertService.getActiveAlerts();

        assertNotNull(alerts);
        assertEquals(2, alerts.size()); // p2 with "none" should be excluded
        assertEquals("MCH-003", alerts.get(0).getMachineIdentifier()); // highest probability first
        assertEquals(0.95, alerts.get(0).getProbability());
        assertEquals("MCH-001", alerts.get(1).getMachineIdentifier());
    }
}
