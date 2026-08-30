package com.maintenance.maintenance_api.controller;

import com.maintenance.maintenance_api.dto.MachineCreateDto;
import com.maintenance.maintenance_api.dto.MachineDto;
import com.maintenance.maintenance_api.service.MachineService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/machines")
@RequiredArgsConstructor
@Tag(name = "Machines", description = "Gestion du parc industriel de machines")
public class MachineController {

    private final MachineService machineService;

    @GetMapping
    @Operation(summary = "Lister toutes les machines avec leur niveau de risque dérivé")
    public ResponseEntity<List<MachineDto>> getAllMachines(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String model,
            @RequestParam(required = false) String riskLevel) {
        return ResponseEntity.ok(machineService.getAllMachines(search, model, riskLevel));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtenir les détails d'une machine par son ID")
    public ResponseEntity<MachineDto> getMachineById(@PathVariable Long id) {
        return ResponseEntity.ok(machineService.getMachineById(id));
    }

    @PostMapping
    @Operation(summary = "Créer une nouvelle machine dans le parc")
    public ResponseEntity<MachineDto> createMachine(@Valid @RequestBody MachineCreateDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(machineService.createMachine(dto));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Mettre à jour les informations d'une machine existante")
    public ResponseEntity<MachineDto> updateMachine(@PathVariable Long id, @Valid @RequestBody MachineCreateDto dto) {
        return ResponseEntity.ok(machineService.updateMachine(id, dto));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Supprimer une machine du parc")
    public ResponseEntity<Void> deleteMachine(@PathVariable Long id) {
        machineService.deleteMachine(id);
        return ResponseEntity.noContent().build();
    }
}
