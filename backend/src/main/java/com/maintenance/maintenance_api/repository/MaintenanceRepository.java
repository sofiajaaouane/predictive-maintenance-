package com.maintenance.maintenance_api.repository;

import com.maintenance.maintenance_api.entity.Maintenance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MaintenanceRepository extends JpaRepository<Maintenance, Long> {

    List<Maintenance> findByMachineIdOrderByMaintenanceDateDesc(Long machineId);

    List<Maintenance> findTop5ByOrderByMaintenanceDateDesc();

    List<Maintenance> findTop10ByOrderByMaintenanceDateDesc();
}
