package com.maintenance.maintenance_api.service;

import com.maintenance.maintenance_api.dto.MachineErrorDto;
import com.maintenance.maintenance_api.entity.MachineError;
import com.maintenance.maintenance_api.exception.ResourceNotFoundException;
import com.maintenance.maintenance_api.mapper.EntityMapper;
import com.maintenance.maintenance_api.repository.MachineErrorRepository;
import com.maintenance.maintenance_api.repository.MachineRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Service managing machine errors logged in the system.
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MachineErrorService {

    private final MachineErrorRepository machineErrorRepository;
    private final MachineRepository machineRepository;
    private final EntityMapper entityMapper;

    public List<MachineErrorDto> getErrorsByMachineId(Long machineId) {
        if (!machineRepository.existsById(machineId)) {
            throw new ResourceNotFoundException("Machine non trouvée avec l'ID : " + machineId);
        }
        return machineErrorRepository.findByMachineIdOrderByTimestampDesc(machineId)
                .stream()
                .map(entityMapper::toMachineErrorDto)
                .collect(Collectors.toList());
    }

    public List<MachineErrorDto> getRecentErrors(int limit) {
        return machineErrorRepository.findTop10ByOrderByTimestampDesc()
                .stream()
                .limit(limit)
                .map(entityMapper::toMachineErrorDto)
                .collect(Collectors.toList());
    }
}
