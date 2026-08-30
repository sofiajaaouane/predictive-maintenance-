package com.maintenance.maintenance_api.service;

import com.maintenance.maintenance_api.dto.MaintenanceCreateDto;
import com.maintenance.maintenance_api.dto.MaintenanceDto;
import com.maintenance.maintenance_api.entity.Machine;
import com.maintenance.maintenance_api.entity.Maintenance;
import com.maintenance.maintenance_api.exception.ResourceNotFoundException;
import com.maintenance.maintenance_api.mapper.EntityMapper;
import com.maintenance.maintenance_api.repository.MachineRepository;
import com.maintenance.maintenance_api.repository.MaintenanceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Service managing historical maintenance logs.
 * A past maintenance record does not indicate current machine state.
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MaintenanceService {

    private final MaintenanceRepository maintenanceRepository;
    private final MachineRepository machineRepository;
    private final EntityMapper entityMapper;

    public List<MaintenanceDto> getMaintenanceByMachineId(Long machineId) {
        if (!machineRepository.existsById(machineId)) {
            throw new ResourceNotFoundException("Machine non trouvée avec l'ID : " + machineId);
        }
        return maintenanceRepository.findByMachineIdOrderByMaintenanceDateDesc(machineId)
                .stream()
                .map(entityMapper::toMaintenanceDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public MaintenanceDto recordMaintenance(Long machineId, MaintenanceCreateDto dto) {
        Machine machine = machineRepository.findById(machineId)
                .orElseThrow(() -> new ResourceNotFoundException("Machine non trouvée avec l'ID : " + machineId));

        Maintenance maintenance = entityMapper.toMaintenanceEntity(dto, machine);
        Maintenance saved = maintenanceRepository.save(maintenance);
        return entityMapper.toMaintenanceDto(saved);
    }

    public List<MaintenanceDto> getRecentMaintenance(int limit) {
        return maintenanceRepository.findTop10ByOrderByMaintenanceDateDesc()
                .stream()
                .limit(limit)
                .map(entityMapper::toMaintenanceDto)
                .collect(Collectors.toList());
    }
}
