package com.maintenance.maintenance_api.service;

import com.maintenance.maintenance_api.dto.TelemetryCreateDto;
import com.maintenance.maintenance_api.dto.TelemetryDto;
import com.maintenance.maintenance_api.entity.Machine;
import com.maintenance.maintenance_api.entity.Telemetry;
import com.maintenance.maintenance_api.exception.BadRequestException;
import com.maintenance.maintenance_api.exception.ResourceNotFoundException;
import com.maintenance.maintenance_api.mapper.EntityMapper;
import com.maintenance.maintenance_api.repository.MachineRepository;
import com.maintenance.maintenance_api.repository.TelemetryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

/**
 * TelemetryService is the central business service for querying and ingesting telemetry measurements.
 * Phase 1: Ingestion via REST / Seed Demo data.
 * Future Phase: Ingestion via Kafka Consumer calling recordTelemetry(...) directly.
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class TelemetryService {

    private final TelemetryRepository telemetryRepository;
    private final MachineRepository machineRepository;
    private final EntityMapper entityMapper;

    public List<TelemetryDto> getTelemetryHistory(Long machineId, String period) {
        if (!machineRepository.existsById(machineId)) {
            throw new ResourceNotFoundException("Machine non trouvée avec l'ID : " + machineId);
        }

        Instant cutoff;
        String normalizedPeriod = period != null ? period.trim().toLowerCase() : "24h";

        switch (normalizedPeriod) {
            case "6h":
                cutoff = Instant.now().minus(Duration.ofHours(6));
                break;
            case "7d":
                cutoff = Instant.now().minus(Duration.ofDays(7));
                break;
            case "24h":
            default:
                cutoff = Instant.now().minus(Duration.ofHours(24));
                break;
        }

        List<Telemetry> telemetryList = telemetryRepository.findByMachineIdAndTimestampAfterOrderByTimestampAsc(machineId, cutoff);

        // Fallback: If no records within recent period (e.g. static demo dataset), return all records ordered asc
        if (telemetryList.isEmpty()) {
            telemetryList = telemetryRepository.findByMachineIdOrderByTimestampDesc(machineId)
                    .stream()
                    .sorted((a, b) -> a.getTimestamp().compareTo(b.getTimestamp()))
                    .collect(Collectors.toList());
        }

        return telemetryList.stream()
                .map(entityMapper::toTelemetryDto)
                .collect(Collectors.toList());
    }

    public TelemetryDto getLatestTelemetry(Long machineId) {
        if (!machineRepository.existsById(machineId)) {
            throw new ResourceNotFoundException("Machine non trouvée avec l'ID : " + machineId);
        }
        Telemetry latest = telemetryRepository.findFirstByMachineIdOrderByTimestampDesc(machineId)
                .orElseThrow(() -> new ResourceNotFoundException("Aucune mesure de télémétrie disponible pour la machine ID : " + machineId));
        return entityMapper.toTelemetryDto(latest);
    }

    @Transactional
    public TelemetryDto recordTelemetry(TelemetryCreateDto dto) {
        Machine machine;
        if (dto.getMachineId() != null) {
            machine = machineRepository.findById(dto.getMachineId())
                    .orElseThrow(() -> new ResourceNotFoundException("Machine non trouvée avec l'ID : " + dto.getMachineId()));
        } else if (dto.getMachineIdentifier() != null && !dto.getMachineIdentifier().isBlank()) {
            machine = machineRepository.findByMachineIdentifier(dto.getMachineIdentifier().trim())
                    .orElseThrow(() -> new ResourceNotFoundException("Machine non trouvée avec l'identifiant : " + dto.getMachineIdentifier()));
        } else {
            throw new BadRequestException("Un machineId ou machineIdentifier est requis pour enregistrer une télémétrie");
        }

        Telemetry entity = entityMapper.toTelemetryEntity(dto, machine);
        Telemetry saved = telemetryRepository.save(entity);
        return entityMapper.toTelemetryDto(saved);
    }
}
