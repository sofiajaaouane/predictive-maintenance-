package com.maintenance.maintenance_api.repository;

import com.maintenance.maintenance_api.entity.Telemetry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Repository
public interface TelemetryRepository extends JpaRepository<Telemetry, Long> {

    List<Telemetry> findByMachineIdAndTimestampAfterOrderByTimestampAsc(Long machineId, Instant timestamp);

    List<Telemetry> findByMachineIdOrderByTimestampDesc(Long machineId);

    Optional<Telemetry> findFirstByMachineIdOrderByTimestampDesc(Long machineId);

    List<Telemetry> findByMachineIdAndTimestampBetweenOrderByTimestampAsc(Long machineId, Instant start, Instant end);
}
