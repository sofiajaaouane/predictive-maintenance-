package com.maintenance.maintenance_api.service;

import com.maintenance.maintenance_api.dto.MachineCreateDto;
import com.maintenance.maintenance_api.dto.MachineDto;
import com.maintenance.maintenance_api.entity.Machine;
import com.maintenance.maintenance_api.entity.Prediction;
import com.maintenance.maintenance_api.exception.BadRequestException;
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
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class MachineServiceTest {

    @Mock
    private MachineRepository machineRepository;

    @Mock
    private PredictionRepository predictionRepository;

    @Spy
    private EntityMapper entityMapper = new EntityMapper();

    @InjectMocks
    private MachineService machineService;

    private Machine testMachine;

    @BeforeEach
    void setUp() {
        testMachine = Machine.builder()
                .id(1L)
                .machineIdentifier("MCH-001")
                .model("model3")
                .age(18)
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build();
    }

    @Test
    void getAllMachines_shouldReturnMachinesWithDerivedRiskLevel() {
        Prediction riskPrediction = Prediction.builder()
                .id(10L)
                .machine(testMachine)
                .predictedComponent("comp2")
                .probability(0.85)
                .status("CRITICAL")
                .timestamp(Instant.now())
                .build();

        when(machineRepository.findAll()).thenReturn(List.of(testMachine));
        when(predictionRepository.findLatestPredictionsForAllMachines()).thenReturn(List.of(riskPrediction));

        List<MachineDto> result = machineService.getAllMachines(null, null, null);

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("MCH-001", result.get(0).getMachineIdentifier());
        assertEquals(18, result.get(0).getAge());
        assertEquals("AT_RISK", result.get(0).getRiskLevel());
    }

    @Test
    void getMachineById_shouldReturnMachine_whenFound() {
        when(machineRepository.findById(1L)).thenReturn(Optional.of(testMachine));
        when(predictionRepository.findLatestByMachineId(1L)).thenReturn(Optional.empty());

        MachineDto result = machineService.getMachineById(1L);

        assertNotNull(result);
        assertEquals("MCH-001", result.getMachineIdentifier());
        assertEquals("NORMAL", result.getRiskLevel());
    }

    @Test
    void getMachineById_shouldThrowException_whenNotFound() {
        when(machineRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> machineService.getMachineById(99L));
    }

    @Test
    void createMachine_shouldSaveMachine_whenValid() {
        MachineCreateDto createDto = MachineCreateDto.builder()
                .machineIdentifier("MCH-011")
                .model("model1")
                .age(5)
                .build();

        when(machineRepository.existsByMachineIdentifier("MCH-011")).thenReturn(false);
        when(machineRepository.save(any(Machine.class))).thenAnswer(invocation -> {
            Machine m = invocation.getArgument(0);
            m.setId(11L);
            m.setCreatedAt(Instant.now());
            m.setUpdatedAt(Instant.now());
            return m;
        });

        MachineDto created = machineService.createMachine(createDto);

        assertNotNull(created);
        assertEquals(11L, created.getId());
        assertEquals("MCH-011", created.getMachineIdentifier());
        assertEquals(5, created.getAge());
    }

    @Test
    void createMachine_shouldThrowBadRequest_whenIdentifierAlreadyExists() {
        MachineCreateDto createDto = MachineCreateDto.builder()
                .machineIdentifier("MCH-001")
                .model("model1")
                .age(5)
                .build();

        when(machineRepository.existsByMachineIdentifier("MCH-001")).thenReturn(true);

        assertThrows(BadRequestException.class, () -> machineService.createMachine(createDto));
    }

    @Test
    void updateMachine_shouldUpdateAndReturnMachine_whenValid() {
        MachineCreateDto updateDto = MachineCreateDto.builder()
                .machineIdentifier("MCH-001-MOD")
                .model("model4")
                .age(19)
                .build();

        when(machineRepository.findById(1L)).thenReturn(Optional.of(testMachine));
        when(machineRepository.existsByMachineIdentifier("MCH-001-MOD")).thenReturn(false);
        when(machineRepository.save(any(Machine.class))).thenReturn(testMachine);
        when(predictionRepository.findLatestByMachineId(1L)).thenReturn(Optional.empty());

        MachineDto updated = machineService.updateMachine(1L, updateDto);

        assertNotNull(updated);
        assertEquals("MCH-001-MOD", updated.getMachineIdentifier());
        assertEquals("model4", updated.getModel());
        assertEquals(19, updated.getAge());
    }

    @Test
    void updateMachine_shouldAllowSameIdentifierWithoutConflict() {
        MachineCreateDto updateDto = MachineCreateDto.builder()
                .machineIdentifier("MCH-001")
                .model("model2")
                .age(20)
                .build();

        when(machineRepository.findById(1L)).thenReturn(Optional.of(testMachine));
        when(machineRepository.save(any(Machine.class))).thenReturn(testMachine);
        when(predictionRepository.findLatestByMachineId(1L)).thenReturn(Optional.empty());

        MachineDto updated = machineService.updateMachine(1L, updateDto);

        assertNotNull(updated);
        assertEquals("model2", updated.getModel());
        assertEquals(20, updated.getAge());
        verify(machineRepository, never()).existsByMachineIdentifier("MCH-001");
    }

    @Test
    void updateMachine_shouldThrowBadRequest_whenNewIdentifierAlreadyExists() {
        MachineCreateDto updateDto = MachineCreateDto.builder()
                .machineIdentifier("MCH-002")
                .model("model2")
                .age(20)
                .build();

        when(machineRepository.findById(1L)).thenReturn(Optional.of(testMachine));
        when(machineRepository.existsByMachineIdentifier("MCH-002")).thenReturn(true);

        assertThrows(BadRequestException.class, () -> machineService.updateMachine(1L, updateDto));
    }

    @Test
    void updateMachine_shouldThrowNotFound_whenMachineDoesNotExist() {
        MachineCreateDto updateDto = MachineCreateDto.builder()
                .machineIdentifier("MCH-999")
                .model("model1")
                .age(5)
                .build();

        when(machineRepository.findById(999L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> machineService.updateMachine(999L, updateDto));
    }

    @Test
    void deleteMachine_shouldDeleteMachine_whenExists() {
        when(machineRepository.findById(1L)).thenReturn(Optional.of(testMachine));
        doNothing().when(machineRepository).delete(testMachine);

        assertDoesNotThrow(() -> machineService.deleteMachine(1L));
        verify(machineRepository, times(1)).delete(testMachine);
    }

    @Test
    void deleteMachine_shouldThrowNotFound_whenMachineDoesNotExist() {
        when(machineRepository.findById(999L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> machineService.deleteMachine(999L));
        verify(machineRepository, never()).delete(any());
    }
}
