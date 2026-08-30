package com.maintenance.maintenance_api.controller;

import com.maintenance.maintenance_api.dto.AlertDto;
import com.maintenance.maintenance_api.service.AlertService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@Tag(name = "Alerts", description = "Alertes de pannes potentielles basées sur les prédictions existantes")
public class AlertController {

    private final AlertService alertService;

    @GetMapping("/api/alerts")
    @Operation(summary = "Lister les alertes actives pour les machines présentant un risque de défaillance")
    public ResponseEntity<List<AlertDto>> getActiveAlerts() {
        return ResponseEntity.ok(alertService.getActiveAlerts());
    }
}
