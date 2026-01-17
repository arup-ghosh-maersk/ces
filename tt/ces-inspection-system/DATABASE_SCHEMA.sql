-- CES Inspection System - SQL Schema Definition
-- Database: CES_Inspection_System
-- Last Updated: January 17, 2026

-- ============================================================
-- 1. TERMINAL_LOCATION TABLE
-- ============================================================
CREATE TABLE terminal_location (
    location_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    location_name VARCHAR(255) NOT NULL UNIQUE,
    terminal_code VARCHAR(50) NOT NULL UNIQUE,
    gps_coordinates VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_terminal_code ON terminal_location(terminal_code);

-- ============================================================
-- 2. ASSET TABLE (Main Assets - STS, RTG, RMG)
-- ============================================================
CREATE TABLE asset (
    asset_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    location_id UUID NOT NULL REFERENCES terminal_location(location_id),
    asset_code VARCHAR(100) NOT NULL UNIQUE,
    asset_type VARCHAR(10) NOT NULL CHECK (asset_type IN ('STS', 'RTG', 'RMG')),
    description TEXT NOT NULL,
    manufacturer VARCHAR(255),
    model_number VARCHAR(100),
    serial_number VARCHAR(100) UNIQUE,
    acquisition_date DATE,
    warranty_expiry DATE,
    diagram_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_asset_location ON asset(location_id);
CREATE INDEX idx_asset_code ON asset(asset_code);
CREATE INDEX idx_asset_type ON asset(asset_type);
CREATE INDEX idx_asset_serial ON asset(serial_number);

-- ============================================================
-- 3. ASSET_SPECS TABLE (Technical Specifications)
-- ============================================================
CREATE TABLE asset_specs (
    spec_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    asset_id UUID NOT NULL UNIQUE REFERENCES asset(asset_id),
    operating_pressure NUMERIC(10, 2),
    lift_capacity NUMERIC(10, 2),
    max_speed NUMERIC(10, 2),
    track_gauge NUMERIC(10, 2),
    motor_power NUMERIC(10, 2),
    cycle_time NUMERIC(10, 2),
    boom_length NUMERIC(10, 2),
    spreadsheet_capacity NUMERIC(10, 2),
    wheel_diameter NUMERIC(10, 2),
    tire_condition VARCHAR(50),
    maintenance_history TEXT,
    last_service_date DATE,
    next_service_date DATE,
    certifications TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_asset_specs_next_service ON asset_specs(next_service_date);

-- ============================================================
-- 4. COMPONENT_MASTER TABLE (Hierarchical Components)
-- ============================================================
CREATE TABLE component_master (
    component_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    component_code VARCHAR(100) NOT NULL UNIQUE,
    component_name VARCHAR(255) NOT NULL,
    asset_id UUID NOT NULL REFERENCES asset(asset_id),
    asset_type VARCHAR(10) NOT NULL CHECK (asset_type IN ('STS', 'RTG', 'RMG')),
    category VARCHAR(50) NOT NULL CHECK (category IN ('Structural', 'Electrical', 'Mechanical', 'Hydraulic', 'Software', 'Other')),
    description TEXT,
    manufacturer VARCHAR(255),
    model_number VARCHAR(100),
    serial_number VARCHAR(100),
    warranty_expiry DATE,
    criticality VARCHAR(20) NOT NULL CHECK (criticality IN ('Critical', 'High', 'Medium', 'Low')),
    parent_component_id UUID REFERENCES component_master(component_id),
    specifications TEXT,
    maintenance_interval_days INTEGER,
    last_maintenance_date DATE,
    next_maintenance_date DATE,
    is_active BOOLEAN DEFAULT TRUE,
    diagram_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_component_asset ON component_master(asset_id);
CREATE INDEX idx_component_parent ON component_master(parent_component_id);
CREATE INDEX idx_component_code ON component_master(component_code);
CREATE INDEX idx_component_criticality ON component_master(criticality);
CREATE INDEX idx_component_active ON component_master(is_active);

-- ============================================================
-- 5. USER TABLE (System Users)
-- ============================================================
CREATE TABLE "user" (
    user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    role VARCHAR(20) NOT NULL CHECK (role IN ('Admin', 'Inspector', 'Approver', 'Viewer')),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_user_email ON "user"(email);
CREATE INDEX idx_user_role ON "user"(role);

-- ============================================================
-- 6. ITP_TEMPLATE TABLE (Inspection, Test & Procedure Templates)
-- ============================================================
CREATE TABLE itp_template (
    template_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    template_code VARCHAR(100) NOT NULL UNIQUE,
    title VARCHAR(255) NOT NULL,
    revision_no INTEGER NOT NULL DEFAULT 1,
    applicable_asset_type VARCHAR(10) NOT NULL CHECK (applicable_asset_type IN ('STS', 'RTG', 'RMG')),
    standard_reference VARCHAR(100) NOT NULL,
    approved_by VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_template_code ON itp_template(template_code);
CREATE INDEX idx_template_active ON itp_template(is_active);

-- ============================================================
-- 7. INSPECTION_POINT TABLE (Individual Inspection Checkpoints)
-- ============================================================
CREATE TABLE inspection_point (
    point_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    template_id UUID NOT NULL REFERENCES itp_template(template_id),
    component_id UUID REFERENCES component_master(component_id),
    sequence_order INTEGER NOT NULL,
    point_description TEXT NOT NULL,
    component_category VARCHAR(50) NOT NULL,
    inspection_method VARCHAR(50) NOT NULL CHECK (inspection_method IN ('Visual', 'Ultrasonic', 'Functional Test', 'NDT')),
    is_mandatory BOOLEAN DEFAULT FALSE,
    point_threshold TEXT,
    applicable_to_component BOOLEAN DEFAULT TRUE,
    applicable_to_asset BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_point_template ON inspection_point(template_id);
CREATE INDEX idx_point_component ON inspection_point(component_id);
CREATE INDEX idx_point_sequence ON inspection_point(template_id, sequence_order);

-- ============================================================
-- 8. CONTROL_POINT TABLE (Evaluation Criteria)
-- ============================================================
CREATE TABLE control_point (
    control_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    point_id UUID NOT NULL REFERENCES inspection_point(point_id),
    point_type VARCHAR(1) NOT NULL CHECK (point_type IN ('H', 'W', 'M', 'R')),
    description VARCHAR(255) NOT NULL,
    criteria TEXT NOT NULL,
    frequency_days INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_control_point ON control_point(point_id);

-- ============================================================
-- 9. INSPECTION_JOB TABLE (Inspection Execution)
-- ============================================================
CREATE TABLE inspection_job (
    job_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    asset_id UUID NOT NULL REFERENCES asset(asset_id),
    template_id UUID NOT NULL REFERENCES itp_template(template_id),
    job_type VARCHAR(50) NOT NULL CHECK (job_type IN ('Construction', 'Commissioning', 'Routine', 'Special')),
    inspector_id UUID NOT NULL REFERENCES "user"(user_id),
    status VARCHAR(20) DEFAULT 'Draft' CHECK (status IN ('Draft', 'In Progress', 'Completed', 'On Hold')),
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_job_asset ON inspection_job(asset_id);
CREATE INDEX idx_job_template ON inspection_job(template_id);
CREATE INDEX idx_job_inspector ON inspection_job(inspector_id);
CREATE INDEX idx_job_status ON inspection_job(status);
CREATE INDEX idx_job_dates ON inspection_job(start_date, end_date);

-- ============================================================
-- 10. INSPECTION_RESULT TABLE (Point Measurement Results)
-- ============================================================
CREATE TABLE inspection_result (
    result_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id UUID NOT NULL REFERENCES inspection_job(job_id),
    point_id UUID NOT NULL REFERENCES inspection_point(point_id),
    control_id UUID REFERENCES control_point(control_id),
    result VARCHAR(10) NOT NULL CHECK (result IN ('Pass', 'Fail', 'N/A')),
    observed_value TEXT,
    expected_value TEXT,
    evidence TEXT,
    inspector_notes TEXT,
    inspection_date TIMESTAMP NOT NULL,
    inspector_id UUID NOT NULL REFERENCES "user"(user_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_result_job ON inspection_result(job_id);
CREATE INDEX idx_result_point ON inspection_result(point_id);
CREATE INDEX idx_result_result ON inspection_result(result);
CREATE INDEX idx_result_inspector ON inspection_result(inspector_id);
CREATE INDEX idx_result_date ON inspection_result(inspection_date);

-- ============================================================
-- 11. ISSUE_NCR TABLE (Non-Conformance Reports)
-- ============================================================
CREATE TABLE issue_ncr (
    issue_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id UUID NOT NULL REFERENCES inspection_job(job_id),
    result_id UUID NOT NULL REFERENCES inspection_result(result_id),
    issue_type VARCHAR(20) DEFAULT 'NCR' CHECK (issue_type = 'NCR'),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    severity VARCHAR(20) NOT NULL CHECK (severity IN ('Critical', 'High', 'Medium', 'Low')),
    status VARCHAR(20) DEFAULT 'Open' CHECK (status IN ('Open', 'In Review', 'Resolved', 'Closed')),
    assigned_to UUID REFERENCES "user"(user_id),
    created_by UUID NOT NULL REFERENCES "user"(user_id),
    due_date DATE,
    resolution TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_ncr_job ON issue_ncr(job_id);
CREATE INDEX idx_ncr_result ON issue_ncr(result_id);
CREATE INDEX idx_ncr_status ON issue_ncr(status);
CREATE INDEX idx_ncr_severity ON issue_ncr(severity);
CREATE INDEX idx_ncr_assigned ON issue_ncr(assigned_to);
CREATE INDEX idx_ncr_created ON issue_ncr(created_by);

-- ============================================================
-- 12. ISSUE_PUNCH_LIST TABLE (Punch List Items)
-- ============================================================
CREATE TABLE issue_punch_list (
    issue_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id UUID NOT NULL REFERENCES inspection_job(job_id),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'Open' CHECK (status IN ('Open', 'In Progress', 'Completed')),
    assigned_to UUID REFERENCES "user"(user_id),
    created_by UUID NOT NULL REFERENCES "user"(user_id),
    due_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_punch_job ON issue_punch_list(job_id);
CREATE INDEX idx_punch_status ON issue_punch_list(status);
CREATE INDEX idx_punch_assigned ON issue_punch_list(assigned_to);

-- ============================================================
-- 13. ISSUE_DEFECT TABLE (Defect Tracking)
-- ============================================================
CREATE TABLE issue_defect (
    issue_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    asset_id UUID NOT NULL REFERENCES asset(asset_id),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    defect_type VARCHAR(50) NOT NULL CHECK (defect_type IN ('Fatigue Crack', 'Oil Leak', 'Electrical Fault', 'Mechanical Damage', 'Other')),
    severity VARCHAR(20) NOT NULL CHECK (severity IN ('Critical', 'High', 'Medium', 'Low')),
    status VARCHAR(20) DEFAULT 'Open' CHECK (status IN ('Open', 'In Review', 'Resolved', 'Closed')),
    assigned_to UUID REFERENCES "user"(user_id),
    created_by UUID NOT NULL REFERENCES "user"(user_id),
    due_date DATE,
    resolution TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_defect_asset ON issue_defect(asset_id);
CREATE INDEX idx_defect_status ON issue_defect(status);
CREATE INDEX idx_defect_severity ON issue_defect(severity);
CREATE INDEX idx_defect_assigned ON issue_defect(assigned_to);

-- ============================================================
-- 14. COMPONENT_INSPECTION_POINT TABLE (Component-Point Mapping)
-- ============================================================
CREATE TABLE component_inspection_point (
    mapping_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    point_id UUID NOT NULL REFERENCES inspection_point(point_id),
    component_id UUID NOT NULL REFERENCES component_master(component_id),
    sub_component_id UUID REFERENCES component_master(component_id),
    applicable_to_component BOOLEAN DEFAULT TRUE,
    applicable_to_sub_component BOOLEAN DEFAULT FALSE,
    inspection_sequence INTEGER NOT NULL,
    priority VARCHAR(20) NOT NULL CHECK (priority IN ('Critical', 'High', 'Medium', 'Low')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_comp_insp_point ON component_inspection_point(point_id);
CREATE INDEX idx_comp_insp_component ON component_inspection_point(component_id);
CREATE INDEX idx_comp_insp_sub ON component_inspection_point(sub_component_id);
CREATE UNIQUE INDEX idx_comp_insp_unique ON component_inspection_point(point_id, component_id);

-- ============================================================
-- 15. PARAMETER_INDICATOR TABLE (Measurable Parameters)
-- ============================================================
CREATE TABLE parameter_indicator (
    indicator_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    indicator_name VARCHAR(255) NOT NULL UNIQUE,
    indicator_type VARCHAR(50) NOT NULL CHECK (indicator_type IN ('Temperature', 'Pressure', 'Vibration', 'Noise', 'Visual', 'Electrical', 'Mechanical', 'Chemical', 'Other')),
    unit VARCHAR(50) NOT NULL,
    description TEXT,
    is_numeric BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_indicator_type ON parameter_indicator(indicator_type);

-- ============================================================
-- 16. THRESHOLD_REQUIREMENT TABLE (Acceptable Ranges/Limits)
-- ============================================================
CREATE TABLE threshold_requirement (
    threshold_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    indicator_id UUID NOT NULL REFERENCES parameter_indicator(indicator_id),
    minimum_value NUMERIC(15, 2),
    maximum_value NUMERIC(15, 2),
    warning_min NUMERIC(15, 2),
    warning_max NUMERIC(15, 2),
    critical_min NUMERIC(15, 2),
    critical_max NUMERIC(15, 2),
    acceptable_tolerance NUMERIC(15, 2),
    unit VARCHAR(50) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_threshold_indicator ON threshold_requirement(indicator_id);
CREATE INDEX idx_threshold_active ON threshold_requirement(is_active);

-- ============================================================
-- 17. COMPONENT_PARAMETER TABLE (Parameter-Component Association)
-- ============================================================
CREATE TABLE component_parameter (
    component_param_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    component_id UUID NOT NULL REFERENCES component_master(component_id),
    point_id UUID NOT NULL REFERENCES inspection_point(point_id),
    indicator_id UUID NOT NULL REFERENCES parameter_indicator(indicator_id),
    threshold_id UUID NOT NULL REFERENCES threshold_requirement(threshold_id),
    sequence INTEGER NOT NULL,
    is_required BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_comp_param_component ON component_parameter(component_id);
CREATE INDEX idx_comp_param_point ON component_parameter(point_id);
CREATE INDEX idx_comp_param_indicator ON component_parameter(indicator_id);
CREATE INDEX idx_comp_param_sequence ON component_parameter(component_id, sequence);
CREATE UNIQUE INDEX idx_comp_param_unique ON component_parameter(component_id, point_id, indicator_id);

-- ============================================================
-- 18. COMPONENT_POINT_COVERAGE TABLE (Coverage Tracking)
-- ============================================================
CREATE TABLE component_point_coverage (
    coverage_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    component_id UUID NOT NULL UNIQUE REFERENCES component_master(component_id),
    total_inspection_points INTEGER NOT NULL DEFAULT 0,
    mapped_points INTEGER NOT NULL DEFAULT 0,
    coverage_percentage NUMERIC(5, 2) NOT NULL DEFAULT 0.00,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_coverage_component ON component_point_coverage(component_id);

-- ============================================================
-- 19. COMPONENT_HIERARCHY TABLE (Component Relationships)
-- ============================================================
CREATE TABLE component_hierarchy (
    hierarchy_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    parent_component_id UUID NOT NULL REFERENCES component_master(component_id),
    child_component_id UUID NOT NULL REFERENCES component_master(component_id),
    relationship_type VARCHAR(50) NOT NULL CHECK (relationship_type IN ('Assembly', 'SubAssembly', 'Part')),
    sequence INTEGER NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT parent_child_unique UNIQUE (parent_component_id, child_component_id)
);

CREATE INDEX idx_hierarchy_parent ON component_hierarchy(parent_component_id);
CREATE INDEX idx_hierarchy_child ON component_hierarchy(child_component_id);

-- ============================================================
-- VIEWS FOR COMMON QUERIES
-- ============================================================

-- View: Asset with Location and Specifications
CREATE VIEW v_asset_details AS
SELECT 
    a.asset_id,
    a.asset_code,
    a.asset_type,
    a.description,
    tl.location_name,
    tl.terminal_code,
    ast.lift_capacity,
    ast.max_speed,
    ast.operating_pressure,
    ast.next_service_date,
    a.warranty_expiry
FROM asset a
JOIN terminal_location tl ON a.location_id = tl.location_id
LEFT JOIN asset_specs ast ON a.asset_id = ast.asset_id;

-- View: Component with Asset Information
CREATE VIEW v_component_details AS
SELECT 
    cm.component_id,
    cm.component_code,
    cm.component_name,
    cm.category,
    cm.criticality,
    a.asset_code,
    a.asset_type,
    cm.next_maintenance_date,
    cm.is_active
FROM component_master cm
JOIN asset a ON cm.asset_id = a.asset_id;

-- View: Inspection Job Status Overview
CREATE VIEW v_inspection_job_overview AS
SELECT 
    ij.job_id,
    ij.job_type,
    ij.status,
    a.asset_code,
    u.first_name,
    u.last_name,
    ij.start_date,
    ij.end_date,
    COUNT(ir.result_id) as total_points,
    SUM(CASE WHEN ir.result = 'Pass' THEN 1 ELSE 0 END) as passed_points,
    SUM(CASE WHEN ir.result = 'Fail' THEN 1 ELSE 0 END) as failed_points
FROM inspection_job ij
JOIN asset a ON ij.asset_id = a.asset_id
JOIN "user" u ON ij.inspector_id = u.user_id
LEFT JOIN inspection_result ir ON ij.job_id = ir.job_id
GROUP BY ij.job_id, ij.job_type, ij.status, a.asset_code, u.first_name, u.last_name, ij.start_date, ij.end_date;

-- View: Outstanding Issues Summary
CREATE VIEW v_outstanding_issues AS
SELECT 
    'NCR' as issue_type,
    COUNT(*) as count,
    COUNT(CASE WHEN severity = 'Critical' THEN 1 END) as critical_count
FROM issue_ncr
WHERE status IN ('Open', 'In Review')
UNION ALL
SELECT 
    'Defect' as issue_type,
    COUNT(*) as count,
    COUNT(CASE WHEN severity = 'Critical' THEN 1 END) as critical_count
FROM issue_defect
WHERE status IN ('Open', 'In Review');

-- ============================================================
-- SAMPLE DATA INSERTION
-- ============================================================

-- Insert Terminal Locations
INSERT INTO terminal_location (location_name, terminal_code, gps_coordinates) 
VALUES ('Singapore Terminal', 'SG-01', '1.3521,103.8198');

INSERT INTO terminal_location (location_name, terminal_code, gps_coordinates) 
VALUES ('Shanghai Terminal', 'SH-01', '31.2304,121.4737');

-- Additional sample data can be inserted as needed
