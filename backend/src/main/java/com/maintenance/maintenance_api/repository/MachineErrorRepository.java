package com.maintenance.maintenance_api.repository;

import com.maintenance.maintenance_api.entity.MachineError;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MachineErrorRepository extends JpaRepository<MachineError, Long> {

    List<MachineError> findByMachineIdOrderByTimestampDesc(Long machineId);

    List<MachineError> findTop5ByOrderByTimestampDesc();

    List<MachineError> findTop10ByOrderByTimestampDesc();
}
