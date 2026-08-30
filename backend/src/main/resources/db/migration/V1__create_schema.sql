-- ============================================================
-- V1: Create predictive maintenance schema
-- ============================================================

-- 1. Machines table (Native Azure dataset fields: machineIdentifier, model, age)
-- NOTE: No operational status column is stored here as per architecture rules.
CREATE TABLE machines (
    id BIGSERIAL PRIMARY KEY,
    machine_identifier VARCHAR(50) NOT NULL UNIQUE,
    model VARCHAR(50) NOT NULL,
    age INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 2. Telemetry table
CREATE TABLE telemetry (
    id BIGSERIAL PRIMARY KEY,
    machine_id BIGINT NOT NULL REFERENCES machines(id) ON DELETE CASCADE,
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    voltage DOUBLE PRECISION NOT NULL,
    rotation DOUBLE PRECISION NOT NULL,
    pressure DOUBLE PRECISION NOT NULL,
    vibration DOUBLE PRECISION NOT NULL
);

-- Essential index for fast retrieval of machine telemetry by time range
CREATE INDEX idx_telemetry_machine_timestamp ON telemetry(machine_id, timestamp DESC);

-- 3. Predictions table (Historical ML predictions output)
-- status represents the prediction risk level: NORMAL, WARNING, CRITICAL
-- predicted_component: none, comp1, comp2, comp3, comp4
CREATE TABLE predictions (
    id BIGSERIAL PRIMARY KEY,
    machine_id BIGINT NOT NULL REFERENCES machines(id) ON DELETE CASCADE,
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    predicted_component VARCHAR(20) NOT NULL,
    probability DOUBLE PRECISION NOT NULL,
    model_version VARCHAR(50) NOT NULL,
    status VARCHAR(20) NOT NULL
);

CREATE INDEX idx_predictions_machine_timestamp ON predictions(machine_id, timestamp DESC);

-- 4. Maintenance table (Historical scheduled/unscheduled maintenance logs)
CREATE TABLE maintenance (
    id BIGSERIAL PRIMARY KEY,
    machine_id BIGINT NOT NULL REFERENCES machines(id) ON DELETE CASCADE,
    component VARCHAR(20) NOT NULL,
    maintenance_date TIMESTAMP WITH TIME ZONE NOT NULL,
    description TEXT
);

CREATE INDEX idx_maintenance_machine_date ON maintenance(machine_id, maintenance_date DESC);

-- 5. Errors table (Historical machine error events)
CREATE TABLE errors (
    id BIGSERIAL PRIMARY KEY,
    machine_id BIGINT NOT NULL REFERENCES machines(id) ON DELETE CASCADE,
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    error_code VARCHAR(50) NOT NULL,
    description TEXT
);

CREATE INDEX idx_errors_machine_timestamp ON errors(machine_id, timestamp DESC);
