package com.maintenance.maintenance_api.controller;

import com.maintenance.maintenance_api.dto.MLModelInfoDto;
import com.maintenance.maintenance_api.dto.MLPipelineStatusDto;
import com.maintenance.maintenance_api.service.MLPipelineService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/ml")
@RequiredArgsConstructor
@Tag(name = "ML Pipeline", description = "Statut et métriques du pipeline ML (Données DEMO / MOCK pour la Phase 1)")
public class MLPipelineController {

    private final MLPipelineService mlPipelineService;

    @GetMapping("/pipeline-status")
    @Operation(summary = "Obtenir le statut du pipeline ML (DEMO DATA)")
    public ResponseEntity<MLPipelineStatusDto> getPipelineStatus() {
        return ResponseEntity.ok(mlPipelineService.getPipelineStatus());
    }

    @GetMapping("/model")
    @Operation(summary = "Obtenir les informations et métriques du modèle ML (DEMO DATA)")
    public ResponseEntity<MLModelInfoDto> getModelInfo() {
        return ResponseEntity.ok(mlPipelineService.getModelInfo());
    }
}
