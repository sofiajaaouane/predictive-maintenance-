package com.maintenance.maintenance_api.controller;

import com.maintenance.maintenance_api.dto.MachineErrorDto;
import com.maintenance.maintenance_api.service.MachineErrorService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@Tag(name = "Errors", description = "Consultation de l'historique des erreurs matérielles des machines")
public class MachineErrorController {

    private final MachineErrorService machineErrorService;

    @GetMapping("/api/machines/{id}/errors")
    @Operation(summary = "Récupérer l'historique des erreurs survenues sur une machine")
    public ResponseEntity<List<MachineErrorDto>> getErrorsByMachineId(@PathVariable Long id) {
        return ResponseEntity.ok(machineErrorService.getErrorsByMachineId(id));
    }
}
