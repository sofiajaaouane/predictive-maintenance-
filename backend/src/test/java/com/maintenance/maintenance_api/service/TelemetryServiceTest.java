package com.maintenance.maintenance_api.service;

import com.maintenance.maintenance_api.dto.TelemetryCreateDto;
import com.maintenance.maintenance_api.dto.TelemetryDto;
import com.maintenance.maintenance_api.entity.Machine;
import com.maintenance.maintenance_api.entity.Telemetry;
import com.maintenance.maintenance_api.exception.ResourceNotFoundException;
import com.maintenance.maintenance_api.mapper.EntityMapper;
import com.maintenance.maintenance_api.repository.MachineRepository;
import com.maintenance.maintenance_api.repository.TelemetryRepository;
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
class TelemetryServiceTest {

    @Mock
    private TelemetryRepository telemetryRepository;

    @Mock
    private MachineRepository machineRepository;

    @Spy
    private EntityMapper entityMapper = new EntityMapper();

    @InjectMocks
    private TelemetryService telemetryService;

    private Machine testMachine;
    private Telemetry testTelemetry;

    @BeforeEach
    void setUp() {
        testMachine = Machine.builder()
                .id(1L)
                .machineIdentifier("MCH-001")
                .model("model3")
                .age(18)
                .build();

        testTelemetry = Telemetry.builder()
                .id(50L)
                .machine(testMachine)
                .timestamp(Instant.now())
                .voltage(170.5)
                .rotation(450.2)
                .pressure(101.4)
                .vibration(40.2)
                .build();
    }

    @Test
    void getTelemetryHistory_shouldReturnHistory() {
        when(machineRepository.existsById(1L)).thenReturn(true);
        when(telemetryRepository.findByMachineIdAndTimestampAfterOrderByTimestampAsc(eq(1L), any(Instant.class)))
                .thenReturn(List.of(testTelemetry));

        List<TelemetryDto> result = telemetryService.getTelemetryHistory(1L, "24h");

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(170.5, result.get(0).getVoltage());
    }

    @Test
    void recordTelemetry_shouldSaveAndReturnDto() {
        TelemetryCreateDto createDto = TelemetryCreateDto.builder()
                .machineId(1L)
                .timestamp(Instant.now())
                .voltage(180.0)
                .rotation(460.0)
                .pressure(105.0)
                .vibration(44.0)
                .build();

        when(machineRepository.findById(1L)).thenReturn(Optional.of(testMachine));
        when(telemetryRepository.save(any(Telemetry.class))).thenAnswer(invocation -> {
            Telemetry t = invocation.getArgument(0);
            t.setId(51L);
            return t;
        });

        TelemetryDto saved = telemetryService.recordTelemetry(createDto);

        assertNotNull(saved);
        assertEquals(51L, saved.getId());
        assertEquals(180.0, saved.getVoltage());
        assertEquals("MCH-001", saved.getMachineIdentifier());
    }
}
