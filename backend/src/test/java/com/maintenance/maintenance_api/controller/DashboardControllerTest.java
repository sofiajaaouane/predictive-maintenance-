package com.maintenance.maintenance_api.controller;

import com.maintenance.maintenance_api.dto.DashboardSummaryDto;
import com.maintenance.maintenance_api.service.DashboardService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(DashboardController.class)
class DashboardControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private DashboardService dashboardService;

    @Test
    void getDashboardSummary_shouldReturnOkWithMetrics() throws Exception {
        DashboardSummaryDto summary = DashboardSummaryDto.builder()
                .totalMachines(10)
                .normalMachines(9)
                .atRiskMachines(1)
                .totalPredictions(15)
                .machinesRequiringAttention(List.of())
                .latestErrors(List.of())
                .recentMaintenance(List.of())
                .build();

        when(dashboardService.getDashboardSummary()).thenReturn(summary);

        mockMvc.perform(get("/api/dashboard"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalMachines").value(10))
                .andExpect(jsonPath("$.normalMachines").value(9))
                .andExpect(jsonPath("$.atRiskMachines").value(1));
    }
}
