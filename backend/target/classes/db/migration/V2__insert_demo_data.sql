-- ============================================================
-- V2: Insert realistic DEMO DATA for initial application testing
-- NOTE: Predictions and statuses are DEMO DATA only and not produced
-- by the live ML model in this Phase 1.
-- ============================================================

-- 1. Insert 10 machines based on Microsoft Azure Dataset structure
INSERT INTO machines (id, machine_identifier, model, age, created_at, updated_at) VALUES
(1, 'MCH-001', 'model3', 18, CURRENT_TIMESTAMP - INTERVAL '30 days', CURRENT_TIMESTAMP),
(2, 'MCH-002', 'model1', 7, CURRENT_TIMESTAMP - INTERVAL '30 days', CURRENT_TIMESTAMP),
(3, 'MCH-003', 'model3', 8, CURRENT_TIMESTAMP - INTERVAL '30 days', CURRENT_TIMESTAMP),
(4, 'MCH-004', 'model4', 14, CURRENT_TIMESTAMP - INTERVAL '30 days', CURRENT_TIMESTAMP),
(5, 'MCH-005', 'model2', 2, CURRENT_TIMESTAMP - INTERVAL '30 days', CURRENT_TIMESTAMP),
(6, 'MCH-006', 'model2', 15, CURRENT_TIMESTAMP - INTERVAL '30 days', CURRENT_TIMESTAMP),
(7, 'MCH-007', 'model3', 20, CURRENT_TIMESTAMP - INTERVAL '30 days', CURRENT_TIMESTAMP),
(8, 'MCH-008', 'model4', 16, CURRENT_TIMESTAMP - INTERVAL '30 days', CURRENT_TIMESTAMP),
(9, 'MCH-009', 'model1', 7, CURRENT_TIMESTAMP - INTERVAL '30 days', CURRENT_TIMESTAMP),
(10, 'MCH-010', 'model2', 10, CURRENT_TIMESTAMP - INTERVAL '30 days', CURRENT_TIMESTAMP);

-- Adjust sequence for machines table
SELECT setval('machines_id_seq', 10, true);

-- 2. Insert recent telemetry records (spanning 24h to current time for machines)
-- Machine 1 (MCH-001): Showing elevated vibration and pressure
INSERT INTO telemetry (machine_id, timestamp, voltage, rotation, pressure, vibration) VALUES
(1, CURRENT_TIMESTAMP - INTERVAL '24 hours', 170.2, 440.5, 101.2, 40.1),
(1, CURRENT_TIMESTAMP - INTERVAL '18 hours', 172.5, 438.1, 102.4, 42.8),
(1, CURRENT_TIMESTAMP - INTERVAL '12 hours', 175.1, 430.0, 108.9, 45.3),
(1, CURRENT_TIMESTAMP - INTERVAL '6 hours', 181.4, 422.6, 114.2, 51.7),
(1, CURRENT_TIMESTAMP - INTERVAL '3 hours', 185.0, 415.2, 119.8, 56.4),
(1, CURRENT_TIMESTAMP - INTERVAL '1 hour', 189.3, 408.9, 124.5, 62.1),
(1, CURRENT_TIMESTAMP, 192.1, 402.1, 128.0, 65.8);

-- Machine 2 (MCH-002): Nominal values
INSERT INTO telemetry (machine_id, timestamp, voltage, rotation, pressure, vibration) VALUES
(2, CURRENT_TIMESTAMP - INTERVAL '24 hours', 168.0, 452.1, 99.8, 38.4),
(2, CURRENT_TIMESTAMP - INTERVAL '18 hours', 170.1, 450.4, 100.2, 39.0),
(2, CURRENT_TIMESTAMP - INTERVAL '12 hours', 169.5, 448.9, 101.0, 40.2),
(2, CURRENT_TIMESTAMP - INTERVAL '6 hours', 171.2, 451.0, 100.5, 39.7),
(2, CURRENT_TIMESTAMP - INTERVAL '1 hour', 170.8, 449.6, 99.9, 39.1),
(2, CURRENT_TIMESTAMP, 170.0, 450.2, 100.1, 39.5);

-- Machine 3 (MCH-003): Nominal values
INSERT INTO telemetry (machine_id, timestamp, voltage, rotation, pressure, vibration) VALUES
(3, CURRENT_TIMESTAMP - INTERVAL '24 hours', 169.4, 455.0, 98.5, 37.9),
(3, CURRENT_TIMESTAMP - INTERVAL '12 hours', 170.1, 452.3, 99.1, 38.6),
(3, CURRENT_TIMESTAMP - INTERVAL '6 hours', 168.9, 454.1, 98.9, 38.2),
(3, CURRENT_TIMESTAMP, 169.8, 453.0, 99.4, 38.0);

-- Machine 4 (MCH-004): Elevated rotation & voltage
INSERT INTO telemetry (machine_id, timestamp, voltage, rotation, pressure, vibration) VALUES
(4, CURRENT_TIMESTAMP - INTERVAL '24 hours', 175.0, 470.1, 102.0, 42.0),
(4, CURRENT_TIMESTAMP - INTERVAL '12 hours', 182.3, 485.4, 105.1, 44.5),
(4, CURRENT_TIMESTAMP - INTERVAL '6 hours', 188.0, 498.2, 108.4, 47.9),
(4, CURRENT_TIMESTAMP, 194.5, 512.0, 112.1, 52.3);

-- Machines 5 to 10 baseline telemetry
INSERT INTO telemetry (machine_id, timestamp, voltage, rotation, pressure, vibration) VALUES
(5, CURRENT_TIMESTAMP, 171.0, 449.0, 100.2, 39.8),
(6, CURRENT_TIMESTAMP, 168.4, 451.2, 98.7, 40.5),
(7, CURRENT_TIMESTAMP, 185.2, 420.1, 115.0, 58.2),
(8, CURRENT_TIMESTAMP, 170.5, 448.3, 101.1, 41.0),
(9, CURRENT_TIMESTAMP, 169.1, 452.8, 99.5, 38.9),
(10, CURRENT_TIMESTAMP, 172.0, 447.9, 102.4, 40.1);

-- 3. Insert Historical Maintenance records
INSERT INTO maintenance (machine_id, component, maintenance_date, description) VALUES
(1, 'comp1', CURRENT_TIMESTAMP - INTERVAL '45 days', 'Scheduled replacement of comp1'),
(1, 'comp2', CURRENT_TIMESTAMP - INTERVAL '120 days', 'Replaced worn comp2 bearings'),
(2, 'comp2', CURRENT_TIMESTAMP - INTERVAL '15 days', 'Routine inspection and lubrication'),
(3, 'comp3', CURRENT_TIMESTAMP - INTERVAL '60 days', 'Standard component 3 overhaul'),
(4, 'comp4', CURRENT_TIMESTAMP - INTERVAL '90 days', 'Preventive replacement of comp4'),
(5, 'comp1', CURRENT_TIMESTAMP - INTERVAL '10 days', 'Post-commissioning checkup'),
(6, 'comp3', CURRENT_TIMESTAMP - INTERVAL '35 days', 'Replaced damaged seal in comp3'),
(7, 'comp2', CURRENT_TIMESTAMP - INTERVAL '180 days', 'Long-term maintenance cycle'),
(8, 'comp4', CURRENT_TIMESTAMP - INTERVAL '25 days', 'Calibration and sensor cleaning'),
(9, 'comp1', CURRENT_TIMESTAMP - INTERVAL '50 days', 'Filter replacement'),
(10, 'comp2', CURRENT_TIMESTAMP - INTERVAL '80 days', 'Component 2 inspection');

-- 4. Insert Machine Error records
INSERT INTO errors (machine_id, timestamp, error_code, description) VALUES
(1, CURRENT_TIMESTAMP - INTERVAL '4 hours', 'error2', 'Pressure transducer anomaly detected'),
(1, CURRENT_TIMESTAMP - INTERVAL '2 hours', 'error3', 'Vibration threshold warning exceeded'),
(4, CURRENT_TIMESTAMP - INTERVAL '5 hours', 'error1', 'Voltage fluctuation outside normal bounds'),
(7, CURRENT_TIMESTAMP - INTERVAL '12 hours', 'error4', 'High temperature warning on primary bearing'),
(7, CURRENT_TIMESTAMP - INTERVAL '8 hours', 'error5', 'Rotation speed mismatch detected');

-- 5. Insert DEMO Predictions (Representing outputs from the daily ML pipeline)
-- Machine 1: Critical risk on comp2
INSERT INTO predictions (machine_id, timestamp, predicted_component, probability, model_version, status) VALUES
(1, CURRENT_TIMESTAMP - INTERVAL '1 day', 'comp2', 0.62, 'v2.4.1', 'WARNING'),
(1, CURRENT_TIMESTAMP, 'comp2', 0.88, 'v2.4.1', 'CRITICAL');

-- Machine 2: Normal (no failure predicted)
INSERT INTO predictions (machine_id, timestamp, predicted_component, probability, model_version, status) VALUES
(2, CURRENT_TIMESTAMP - INTERVAL '1 day', 'none', 0.08, 'v2.4.1', 'NORMAL'),
(2, CURRENT_TIMESTAMP, 'none', 0.05, 'v2.4.1', 'NORMAL');

-- Machine 3: Normal
INSERT INTO predictions (machine_id, timestamp, predicted_component, probability, model_version, status) VALUES
(3, CURRENT_TIMESTAMP, 'none', 0.12, 'v2.4.1', 'NORMAL');

-- Machine 4: Warning risk on comp4
INSERT INTO predictions (machine_id, timestamp, predicted_component, probability, model_version, status) VALUES
(4, CURRENT_TIMESTAMP, 'comp4', 0.74, 'v2.4.1', 'WARNING');

-- Machine 5: Normal
INSERT INTO predictions (machine_id, timestamp, predicted_component, probability, model_version, status) VALUES
(5, CURRENT_TIMESTAMP, 'none', 0.04, 'v2.4.1', 'NORMAL');

-- Machine 6: Normal
INSERT INTO predictions (machine_id, timestamp, predicted_component, probability, model_version, status) VALUES
(6, CURRENT_TIMESTAMP, 'none', 0.15, 'v2.4.1', 'NORMAL');

-- Machine 7: Critical risk on comp3
INSERT INTO predictions (machine_id, timestamp, predicted_component, probability, model_version, status) VALUES
(7, CURRENT_TIMESTAMP, 'comp3', 0.91, 'v2.4.1', 'CRITICAL');

-- Machine 8: Warning risk on comp1
INSERT INTO predictions (machine_id, timestamp, predicted_component, probability, model_version, status) VALUES
(8, CURRENT_TIMESTAMP, 'comp1', 0.68, 'v2.4.1', 'WARNING');

-- Machine 9: Normal
INSERT INTO predictions (machine_id, timestamp, predicted_component, probability, model_version, status) VALUES
(9, CURRENT_TIMESTAMP, 'none', 0.07, 'v2.4.1', 'NORMAL');

-- Machine 10: Normal
INSERT INTO predictions (machine_id, timestamp, predicted_component, probability, model_version, status) VALUES
(10, CURRENT_TIMESTAMP, 'none', 0.10, 'v2.4.1', 'NORMAL');
