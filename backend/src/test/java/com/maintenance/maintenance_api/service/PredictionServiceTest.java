package com.maintenance.maintenance_api.service;

import com.maintenance.maintenance_api.dto.PredictionDto;
import com.maintenance.maintenance_api.entity.Machine;
import com.maintenance.maintenance_api.entity.Prediction;
import com.maintenance.maintenance_api.exception.ResourceNotFoundException;
import com.maintenance.maintenance_api.mapper.EntityMapper;
import com.maintenance.maintenance_api.repository.MachineRepository;
import com.maintenance.maintenance_api.repository.PredictionRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PredictionServiceTest {

    @Mock
    private PredictionRepository predictionRepository;

    @Mock
    private MachineRepository machineRepository;

    @Spy
    private EntityMapper entityMapper = new EntityMapper();

    @InjectMocks
    private PredictionService predictionService;

    private Machine testMachine;
    private Prediction testPrediction;

    @BeforeEach
    void setUp() {
        testMachine = Machine.builder()
                .id(1L)
                .machineIdentifier("MCH-001")
                .model("model3")
                .age(18)
                .build();

        testPrediction = Prediction.builder()
                .id(100L)
                .machine(testMachine)
                .predictedComponent("comp2")
                .probability(0.88)
                .modelVersion("v2.4.1")
                .status("CRITICAL")
                .timestamp(Instant.now())
                .build();
    }

    @Test
    void getAllPredictions_shouldReturnAllPredictions_withFiltering() {
        when(predictionRepository.findAllByOrderByTimestampDesc()).thenReturn(List.of(testPrediction));

        List<PredictionDto> result = predictionService.getAllPredictions("comp2", "CRITICAL");

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("comp2", result.get(0).getPredictedComponent());
        assertEquals("CRITICAL", result.get(0).getStatus());
        assertEquals(0.88, result.get(0).getProbability());
    }

    @Test
    void getPredictionsByMachineId_shouldReturnPredictions_whenMachineExists() {
        when(machineRepository.existsById(1L)).thenReturn(true);
        when(predictionRepository.findByMachineIdOrderByTimestampDesc(1L)).thenReturn(List.of(testPrediction));

        List<PredictionDto> result = predictionService.getPredictionsByMachineId(1L);

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("MCH-001", result.get(0).getMachineIdentifier());
    }

    @Test
    void getPredictionsByMachineId_shouldThrowException_whenMachineNotFound() {
        when(machineRepository.existsById(99L)).thenReturn(false);

        assertThrows(ResourceNotFoundException.class, () -> predictionService.getPredictionsByMachineId(99L));
    }

    @Test
    void getLatestPredictionByMachineId_shouldReturnLatestPrediction() {
        when(machineRepository.existsById(1L)).thenReturn(true);
        when(predictionRepository.findLatestByMachineId(1L)).thenReturn(Optional.of(testPrediction));

        PredictionDto result = predictionService.getLatestPredictionByMachineId(1L);

        assertNotNull(result);
        assertEquals("comp2", result.getPredictedComponent());
        assertEquals(0.88, result.getProbability());
    }
}
