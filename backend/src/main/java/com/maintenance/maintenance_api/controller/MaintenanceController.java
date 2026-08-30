package com.maintenance.maintenance_api.controller;

import com.maintenance.maintenance_api.dto.MaintenanceCreateDto;
import com.maintenance.maintenance_api.dto.MaintenanceDto;
import com.maintenance.maintenance_api.service.MaintenanceService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@Tag(name = "Maintenance", description = "Historique et enregistrement des opérations de maintenance")
public class MaintenanceController {

    private final MaintenanceService maintenanceService;

    @GetMapping("/api/machines/{id}/maintenance")
    @Operation(summary = "Récupérer l'historique des interventions de maintenance pour une machine")
    public ResponseEntity<List<MaintenanceDto>> getMaintenanceByMachineId(@PathVariable Long id) {
        return ResponseEntity.ok(maintenanceService.getMaintenanceByMachineId(id));
    }

    @PostMapping("/api/machines/{id}/maintenance")
    @Operation(summary = "Enregistrer une nouvelle intervention de maintenance pour une machine")
    public ResponseEntity<MaintenanceDto> recordMaintenance(
            @PathVariable Long id,
            @Valid @RequestBody MaintenanceCreateDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(maintenanceService.recordMaintenance(id, dto));
    }
}
