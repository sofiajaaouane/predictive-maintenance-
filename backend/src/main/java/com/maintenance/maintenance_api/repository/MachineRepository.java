package com.maintenance.maintenance_api.repository;

import com.maintenance.maintenance_api.entity.Machine;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MachineRepository extends JpaRepository<Machine, Long> {
    Optional<Machine> findByMachineIdentifier(String machineIdentifier);
    boolean existsByMachineIdentifier(String machineIdentifier);
}
