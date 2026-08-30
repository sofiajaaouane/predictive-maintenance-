package com.maintenance.maintenance_api.service;

import com.maintenance.maintenance_api.dto.PredictionDto;
import com.maintenance.maintenance_api.entity.Prediction;
import com.maintenance.maintenance_api.exception.ResourceNotFoundException;
import com.maintenance.maintenance_api.mapper.EntityMapper;
import com.maintenance.maintenance_api.repository.MachineRepository;
import com.maintenance.maintenance_api.repository.PredictionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * PredictionService is strictly a READ-ONLY service.
 * Spring Boot does not generate, train, or infer predictions.
 * Predictions are executed by the future Python ML / Airflow pipeline and retrieved here for exposition to React.
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PredictionService {

    private final PredictionRepository predictionRepository;
    private final MachineRepository machineRepository;
    private final EntityMapper entityMapper;

    public List<PredictionDto> getAllPredictions(String component, String status) {
        List<Prediction> predictions = predictionRepository.findAllByOrderByTimestampDesc();
        return predictions.stream()
                .filter(p -> {
                    if (component != null && !component.isBlank()) {
                        if (p.getPredictedComponent() == null || !p.getPredictedComponent().equalsIgnoreCase(component)) {
                            return false;
                        }
                    }
                    if (status != null && !status.isBlank()) {
                        if (p.getStatus() == null || !p.getStatus().equalsIgnoreCase(status)) {
                            return false;
                        }
                    }
                    return true;
                })
                .map(entityMapper::toPredictionDto)
                .collect(Collectors.toList());
    }

    public List<PredictionDto> getLatestPredictionsForAllMachines() {
        return predictionRepository.findLatestPredictionsForAllMachines()
                .stream()
                .map(entityMapper::toPredictionDto)
                .collect(Collectors.toList());
    }

    public List<PredictionDto> getPredictionsByMachineId(Long machineId) {
        if (!machineRepository.existsById(machineId)) {
            throw new ResourceNotFoundException("Machine non trouvée avec l'ID : " + machineId);
        }
        return predictionRepository.findByMachineIdOrderByTimestampDesc(machineId)
                .stream()
                .map(entityMapper::toPredictionDto)
                .collect(Collectors.toList());
    }

    public PredictionDto getLatestPredictionByMachineId(Long machineId) {
        if (!machineRepository.existsById(machineId)) {
            throw new ResourceNotFoundException("Machine non trouvée avec l'ID : " + machineId);
        }
        Prediction latest = predictionRepository.findLatestByMachineId(machineId)
                .orElseThrow(() -> new ResourceNotFoundException("Aucune prédiction enregistrée pour la machine ID : " + machineId));
        return entityMapper.toPredictionDto(latest);
    }
}
