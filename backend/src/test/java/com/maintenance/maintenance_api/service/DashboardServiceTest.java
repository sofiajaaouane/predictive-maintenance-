package com.maintenance.maintenance_api.service;

import com.maintenance.maintenance_api.dto.AlertDto;
import com.maintenance.maintenance_api.dto.DashboardSummaryDto;
import com.maintenance.maintenance_api.entity.Machine;
import com.maintenance.maintenance_api.entity.Prediction;
import com.maintenance.maintenance_api.repository.MachineRepository;
import com.maintenance.maintenance_api.repository.PredictionRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.Instant;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class DashboardServiceTest {

    @Mock
    private MachineRepository machineRepository;

    @Mock
    private PredictionRepository predictionRepository;

    @Mock
    private AlertService alertService;

    @Mock
    private MachineErrorService errorService;

    @Mock
    private MaintenanceService maintenanceService;

    @InjectMocks
    private DashboardService dashboardService;

    @Test
    void getDashboardSummary_shouldCalculateAggregationsCorrectly() {
        Machine m1 = Machine.builder().id(1L).machineIdentifier("MCH-001").model("model3").age(18).build();
        Machine m2 = Machine.builder().id(2L).machineIdentifier("MCH-002").model("model1").age(7).build();

        Prediction p1 = Prediction.builder().id(1L).machine(m1).predictedComponent("comp2").probability(0.88).status("CRITICAL").timestamp(Instant.now()).build();
        Prediction p2 = Prediction.builder().id(2L).machine(m2).predictedComponent("none").probability(0.05).status("NORMAL").timestamp(Instant.now()).build();

        when(machineRepository.count()).thenReturn(10L);
        when(predictionRepository.count()).thenReturn(50L);
        when(predictionRepository.findLatestPredictionsForAllMachines()).thenReturn(List.of(p1, p2));
        when(alertService.getActiveAlerts()).thenReturn(List.of(
                AlertDto.builder().machineId(1L).machineIdentifier("MCH-001").predictedComponent("comp2").probability(0.88).status("CRITICAL").build()
        ));
        when(errorService.getRecentErrors(5)).thenReturn(List.of());
        when(maintenanceService.getRecentMaintenance(5)).thenReturn(List.of());

        DashboardSummaryDto summary = dashboardService.getDashboardSummary();

        assertNotNull(summary);
        assertEquals(10L, summary.getTotalMachines());
        assertEquals(50L, summary.getTotalPredictions());
        assertEquals(1L, summary.getAtRiskMachines());
        assertEquals(9L, summary.getNormalMachines());
        assertEquals(1, summary.getMachinesRequiringAttention().size());
    }
}
