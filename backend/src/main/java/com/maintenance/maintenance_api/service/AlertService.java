package com.maintenance.maintenance_api.service;

import com.maintenance.maintenance_api.dto.AlertDto;
import com.maintenance.maintenance_api.entity.Prediction;
import com.maintenance.maintenance_api.mapper.EntityMapper;
import com.maintenance.maintenance_api.repository.PredictionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * AlertService extracts active alerts from the latest recorded predictions.
 * Does not perform any ML calculation.
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AlertService {

    private final PredictionRepository predictionRepository;
    private final EntityMapper entityMapper;

    public List<AlertDto> getActiveAlerts() {
        List<Prediction> latestPredictions = predictionRepository.findLatestPredictionsForAllMachines();

        return latestPredictions.stream()
                .filter(p -> p.getPredictedComponent() != null && !p.getPredictedComponent().equalsIgnoreCase("none"))
                .map(p -> entityMapper.toAlertDto(p.getMachine(), p))
                .sorted((a, b) -> Double.compare(b.getProbability() != null ? b.getProbability() : 0,
                                                  a.getProbability() != null ? a.getProbability() : 0))
                .collect(Collectors.toList());
    }
}
