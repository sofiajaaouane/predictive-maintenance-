package com.maintenance.maintenance_api.service;

import com.maintenance.maintenance_api.dto.MachineCreateDto;
import com.maintenance.maintenance_api.dto.MachineDto;
import com.maintenance.maintenance_api.entity.Machine;
import com.maintenance.maintenance_api.entity.Prediction;
import com.maintenance.maintenance_api.exception.BadRequestException;
import com.maintenance.maintenance_api.exception.ResourceNotFoundException;
import com.maintenance.maintenance_api.mapper.EntityMapper;
import com.maintenance.maintenance_api.repository.MachineRepository;
import com.maintenance.maintenance_api.repository.PredictionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MachineService {

    private final MachineRepository machineRepository;
    private final PredictionRepository predictionRepository;
    private final EntityMapper entityMapper;

    public List<MachineDto> getAllMachines(String search, String model, String riskLevel) {
        List<Machine> machines = machineRepository.findAll();
        List<Prediction> latestPredictions = predictionRepository.findLatestPredictionsForAllMachines();

        Map<Long, Prediction> predictionMap = latestPredictions.stream()
                .filter(p -> p.getMachine() != null)
                .collect(Collectors.toMap(p -> p.getMachine().getId(), p -> p, (existing, replacement) -> existing));

        return machines.stream()
                .map(m -> entityMapper.toMachineDto(m, predictionMap.get(m.getId())))
                .filter(dto -> {
                    if (search != null && !search.isBlank()) {
                        String s = search.toLowerCase();
                        boolean matchId = dto.getMachineIdentifier() != null && dto.getMachineIdentifier().toLowerCase().contains(s);
                        boolean matchModel = dto.getModel() != null && dto.getModel().toLowerCase().contains(s);
                        if (!matchId && !matchModel) return false;
                    }
                    if (model != null && !model.isBlank()) {
                        if (dto.getModel() == null || !dto.getModel().equalsIgnoreCase(model)) return false;
                    }
                    if (riskLevel != null && !riskLevel.isBlank()) {
                        if (dto.getRiskLevel() == null || !dto.getRiskLevel().equalsIgnoreCase(riskLevel)) return false;
                    }
                    return true;
                })
                .collect(Collectors.toList());
    }

    public MachineDto getMachineById(Long id) {
        Machine machine = getMachineEntity(id);
        Prediction latestPrediction = predictionRepository.findLatestByMachineId(id).orElse(null);
        return entityMapper.toMachineDto(machine, latestPrediction);
    }

    @Transactional
    public MachineDto createMachine(MachineCreateDto dto) {
        if (machineRepository.existsByMachineIdentifier(dto.getMachineIdentifier())) {
            throw new BadRequestException("Une machine avec l'identifiant '" + dto.getMachineIdentifier() + "' existe déjà");
        }
        Machine entity = entityMapper.toMachineEntity(dto);
        Machine saved = machineRepository.save(entity);
        return entityMapper.toMachineDto(saved, null);
    }

    @Transactional
    public MachineDto updateMachine(Long id, MachineCreateDto dto) {
        Machine machine = getMachineEntity(id);
        if (!machine.getMachineIdentifier().equals(dto.getMachineIdentifier()) &&
            machineRepository.existsByMachineIdentifier(dto.getMachineIdentifier())) {
            throw new BadRequestException("Une machine avec l'identifiant '" + dto.getMachineIdentifier() + "' existe déjà");
        }
        machine.setMachineIdentifier(dto.getMachineIdentifier().trim());
        machine.setModel(dto.getModel().trim());
        machine.setAge(dto.getAge());
        Machine updated = machineRepository.save(machine);
        Prediction latestPrediction = predictionRepository.findLatestByMachineId(id).orElse(null);
        return entityMapper.toMachineDto(updated, latestPrediction);
    }

    @Transactional
    public void deleteMachine(Long id) {
        Machine machine = getMachineEntity(id);
        machineRepository.delete(machine);
    }

    public Machine getMachineEntity(Long id) {
        return machineRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Machine non trouvée avec l'ID : " + id));
    }
}
