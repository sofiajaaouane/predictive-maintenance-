package com.maintenance.maintenance_api.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.maintenance.maintenance_api.dto.TelemetryCreateDto;
import com.maintenance.maintenance_api.dto.TelemetryDto;
import com.maintenance.maintenance_api.service.TelemetryService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.Instant;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(TelemetryController.class)
class TelemetryControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private TelemetryService telemetryService;

    @Test
    void getTelemetryHistory_shouldReturnOkWithPeriod() throws Exception {
        TelemetryDto dto = TelemetryDto.builder()
                .id(1L)
                .machineId(1L)
                .machineIdentifier("MCH-001")
                .timestamp(Instant.now())
                .voltage(170.5)
                .rotation(450.0)
                .pressure(100.0)
                .vibration(40.0)
                .build();

        when(telemetryService.getTelemetryHistory(eq(1L), eq("6h"))).thenReturn(List.of(dto));

        mockMvc.perform(get("/api/machines/1/telemetry?period=6h"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].voltage").value(170.5));
    }

    @Test
    void recordTelemetry_shouldReturnCreated() throws Exception {
        TelemetryCreateDto createDto = TelemetryCreateDto.builder()
                .machineId(1L)
                .timestamp(Instant.now())
                .voltage(175.0)
                .rotation(455.0)
                .pressure(102.0)
                .vibration(41.0)
                .build();

        TelemetryDto responseDto = TelemetryDto.builder()
                .id(2L)
                .machineId(1L)
                .machineIdentifier("MCH-001")
                .timestamp(createDto.getTimestamp())
                .voltage(175.0)
                .rotation(455.0)
                .pressure(102.0)
                .vibration(41.0)
                .build();

        when(telemetryService.recordTelemetry(any(TelemetryCreateDto.class))).thenReturn(responseDto);

        mockMvc.perform(post("/api/telemetry")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(createDto)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(2))
                .andExpect(jsonPath("$.voltage").value(175.0));
    }
}
