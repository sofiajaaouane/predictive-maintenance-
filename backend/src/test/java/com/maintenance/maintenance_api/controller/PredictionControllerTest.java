package com.maintenance.maintenance_api.controller;

import com.maintenance.maintenance_api.dto.PredictionDto;
import com.maintenance.maintenance_api.service.PredictionService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.Instant;
import java.util.List;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(PredictionController.class)
class PredictionControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private PredictionService predictionService;

    @Test
    void getAllPredictions_shouldReturnOkWithList() throws Exception {
        PredictionDto dto = PredictionDto.builder()
                .id(1L)
                .machineId(1L)
                .machineIdentifier("MCH-001")
                .predictedComponent("comp2")
                .probability(0.88)
                .modelVersion("v2.4.1")
                .status("CRITICAL")
                .timestamp(Instant.now())
                .build();

        when(predictionService.getAllPredictions(null, null)).thenReturn(List.of(dto));

        mockMvc.perform(get("/api/predictions"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].predictedComponent").value("comp2"))
                .andExpect(jsonPath("$[0].probability").value(0.88))
                .andExpect(jsonPath("$[0].status").value("CRITICAL"));
    }

    @Test
    void getLatestPredictionsForAllMachines_shouldReturnOkWithList() throws Exception {
        PredictionDto dto = PredictionDto.builder()
                .id(1L)
                .machineId(1L)
                .machineIdentifier("MCH-001")
                .predictedComponent("comp2")
                .probability(0.88)
                .modelVersion("v2.4.1")
                .status("CRITICAL")
                .timestamp(Instant.now())
                .build();

        when(predictionService.getLatestPredictionsForAllMachines()).thenReturn(List.of(dto));

        mockMvc.perform(get("/api/predictions/latest"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].machineIdentifier").value("MCH-001"));
    }

    @Test
    void getPredictionsByMachineId_shouldReturnOk() throws Exception {
        PredictionDto dto = PredictionDto.builder()
                .id(1L)
                .machineId(1L)
                .machineIdentifier("MCH-001")
                .predictedComponent("none")
                .probability(0.05)
                .status("NORMAL")
                .build();

        when(predictionService.getPredictionsByMachineId(1L)).thenReturn(List.of(dto));

        mockMvc.perform(get("/api/machines/1/predictions"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].predictedComponent").value("none"));
    }

    @Test
    void postPredictions_shouldReturnMethodNotAllowed_confirmingReadOnlyDesign() throws Exception {
        // Confirms that POST /api/predictions is strictly not permitted/not mapped
        mockMvc.perform(post("/api/predictions")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"machineId\": 1}"))
                .andExpect(status().isMethodNotAllowed());
    }
}
