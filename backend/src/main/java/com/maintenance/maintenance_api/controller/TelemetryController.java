package com.maintenance.maintenance_api.controller;

import com.maintenance.maintenance_api.dto.TelemetryCreateDto;
import com.maintenance.maintenance_api.dto.TelemetryDto;
import com.maintenance.maintenance_api.service.TelemetryService;
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
@Tag(name = "Telemetry", description = "Consultation et ingestion des mesures de télémétrie des capteurs")
public class TelemetryController {

    private final TelemetryService telemetryService;

    @GetMapping("/api/machines/{id}/telemetry")
    @Operation(summary = "Récupérer l'historique des mesures de télémétrie d'une machine par période (6h, 24h, 7d)")
    public ResponseEntity<List<TelemetryDto>> getTelemetryHistory(
            @PathVariable Long id,
            @RequestParam(required = false, defaultValue = "24h") String period) {
        return ResponseEntity.ok(telemetryService.getTelemetryHistory(id, period));
    }

    @GetMapping("/api/machines/{id}/telemetry/latest")
    @Operation(summary = "Récupérer la dernière mesure de télémétrie enregistrée pour une machine")
    public ResponseEntity<TelemetryDto> getLatestTelemetry(@PathVariable Long id) {
        return ResponseEntity.ok(telemetryService.getLatestTelemetry(id));
    }

    @PostMapping("/api/telemetry")
    @Operation(summary = "Ingestion d'une mesure de télémétrie (point d'entrée pour REST et futur connecteur)")
    public ResponseEntity<TelemetryDto> recordTelemetry(@Valid @RequestBody TelemetryCreateDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(telemetryService.recordTelemetry(dto));
    }
}
