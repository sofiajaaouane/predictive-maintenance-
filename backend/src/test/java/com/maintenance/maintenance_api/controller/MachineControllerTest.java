package com.maintenance.maintenance_api.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.maintenance.maintenance_api.dto.MachineCreateDto;
import com.maintenance.maintenance_api.dto.MachineDto;
import com.maintenance.maintenance_api.exception.ResourceNotFoundException;
import com.maintenance.maintenance_api.service.MachineService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(MachineController.class)
class MachineControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private MachineService machineService;

    @Test
    void getAllMachines_shouldReturnOkWithMachineList() throws Exception {
        MachineDto dto = MachineDto.builder()
                .id(1L)
                .machineIdentifier("MCH-001")
                .model("model3")
                .age(18)
                .riskLevel("NORMAL")
                .build();

        when(machineService.getAllMachines(null, null, null)).thenReturn(List.of(dto));

        mockMvc.perform(get("/api/machines"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[0].machineIdentifier").value("MCH-001"))
                .andExpect(jsonPath("$[0].age").value(18))
                .andExpect(jsonPath("$[0].riskLevel").value("NORMAL"));
    }

    @Test
    void getMachineById_shouldReturnOkWithMachine() throws Exception {
        MachineDto dto = MachineDto.builder()
                .id(1L)
                .machineIdentifier("MCH-001")
                .model("model3")
                .age(18)
                .riskLevel("NORMAL")
                .build();

        when(machineService.getMachineById(1L)).thenReturn(dto);

        mockMvc.perform(get("/api/machines/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.machineIdentifier").value("MCH-001"));
    }

    @Test
    void getMachineById_shouldReturnNotFound_whenMachineDoesNotExist() throws Exception {
        when(machineService.getMachineById(999L))
                .thenThrow(new ResourceNotFoundException("Machine non trouvée avec l'ID : 999"));

        mockMvc.perform(get("/api/machines/999"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404));
    }

    @Test
    void createMachine_shouldReturnCreated_whenValid() throws Exception {
        MachineCreateDto createDto = MachineCreateDto.builder()
                .machineIdentifier("MCH-001")
                .model("model3")
                .age(18)
                .build();

        MachineDto responseDto = MachineDto.builder()
                .id(1L)
                .machineIdentifier("MCH-001")
                .model("model3")
                .age(18)
                .riskLevel("NORMAL")
                .build();

        when(machineService.createMachine(any(MachineCreateDto.class))).thenReturn(responseDto);

        mockMvc.perform(post("/api/machines")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(createDto)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.machineIdentifier").value("MCH-001"));
    }

    @Test
    void createMachine_shouldReturnBadRequest_whenAgeIsNegative() throws Exception {
        MachineCreateDto invalidDto = MachineCreateDto.builder()
                .machineIdentifier("MCH-001")
                .model("model3")
                .age(-5)
                .build();

        mockMvc.perform(post("/api/machines")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidDto)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void createMachine_shouldReturnBadRequest_whenIdentifierIsBlank() throws Exception {
        MachineCreateDto invalidDto = MachineCreateDto.builder()
                .machineIdentifier("")
                .model("model3")
                .age(10)
                .build();

        mockMvc.perform(post("/api/machines")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidDto)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void updateMachine_shouldReturnOk_whenValid() throws Exception {
        MachineCreateDto updateDto = MachineCreateDto.builder()
                .machineIdentifier("MCH-001-MOD")
                .model("model4")
                .age(19)
                .build();

        MachineDto responseDto = MachineDto.builder()
                .id(1L)
                .machineIdentifier("MCH-001-MOD")
                .model("model4")
                .age(19)
                .riskLevel("NORMAL")
                .build();

        when(machineService.updateMachine(eq(1L), any(MachineCreateDto.class))).thenReturn(responseDto);

        mockMvc.perform(put("/api/machines/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.machineIdentifier").value("MCH-001-MOD"))
                .andExpect(jsonPath("$.model").value("model4"))
                .andExpect(jsonPath("$.age").value(19));
    }

    @Test
    void updateMachine_shouldReturnBadRequest_whenModelIsBlank() throws Exception {
        MachineCreateDto invalidDto = MachineCreateDto.builder()
                .machineIdentifier("MCH-001")
                .model("")
                .age(10)
                .build();

        mockMvc.perform(put("/api/machines/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidDto)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void deleteMachine_shouldReturnNoContent_whenSuccessful() throws Exception {
        doNothing().when(machineService).deleteMachine(1L);

        mockMvc.perform(delete("/api/machines/1"))
                .andExpect(status().isNoContent());
    }

    @Test
    void deleteMachine_shouldReturnNotFound_whenMachineDoesNotExist() throws Exception {
        doThrow(new ResourceNotFoundException("Machine non trouvée avec l'ID : 999"))
                .when(machineService).deleteMachine(999L);

        mockMvc.perform(delete("/api/machines/999"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404));
    }
}
