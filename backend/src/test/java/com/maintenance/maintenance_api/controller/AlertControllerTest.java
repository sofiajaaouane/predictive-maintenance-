package com.maintenance.maintenance_api.controller;

import com.maintenance.maintenance_api.dto.AlertDto;
import com.maintenance.maintenance_api.service.AlertService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;

import java.time.Instant;
import java.util.List;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AlertController.class)
class AlertControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private AlertService alertService;

    @Test
    void getActiveAlerts_shouldReturnAlertList() throws Exception {
        AlertDto alert = AlertDto.builder()
                .machineId(1L)
                .machineIdentifier("MCH-001")
                .model("model3")
                .age(18)
                .predictedComponent("comp2")
                .probability(0.88)
                .status("CRITICAL")
                .predictionDate(Instant.now())
                .build();

        when(alertService.getActiveAlerts()).thenReturn(List.of(alert));

        mockMvc.perform(get("/api/alerts"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].machineIdentifier").value("MCH-001"))
                .andExpect(jsonPath("$[0].predictedComponent").value("comp2"))
                .andExpect(jsonPath("$[0].status").value("CRITICAL"));
    }
}
