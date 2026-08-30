package com.maintenance.maintenance_api.repository;

import com.maintenance.maintenance_api.entity.Prediction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PredictionRepository extends JpaRepository<Prediction, Long> {

    List<Prediction> findByMachineIdOrderByTimestampDesc(Long machineId);

    Optional<Prediction> findFirstByMachineIdOrderByTimestampDesc(Long machineId);

    List<Prediction> findAllByOrderByTimestampDesc();

    @Query("SELECT p FROM Prediction p WHERE p.timestamp = (" +
           "  SELECT MAX(p2.timestamp) FROM Prediction p2 WHERE p2.machine.id = p.machine.id" +
           ")")
    List<Prediction> findLatestPredictionsForAllMachines();

    @Query("SELECT p FROM Prediction p WHERE p.machine.id = :machineId AND p.timestamp = (" +
           "  SELECT MAX(p2.timestamp) FROM Prediction p2 WHERE p2.machine.id = :machineId" +
           ")")
    Optional<Prediction> findLatestByMachineId(@Param("machineId") Long machineId);
}
