# Asset Inspection Points - Database Schema Guide

## Overview
This guide provides SQL schema recommendations for implementing the Asset Inspection Points system in a production database.

## Database Tables

### 1. parameter_indicators
Stores all parameter types that can be measured during inspection.

```sql
CREATE TABLE parameter_indicators (
  indicator_id VARCHAR(50) PRIMARY KEY,
  indicator_name VARCHAR(255) NOT NULL,
  indicator_type VARCHAR(50) NOT NULL CHECK (indicator_type IN (
    'Temperature', 'Pressure', 'Vibration', 'Noise', 'Visual', 
    'Electrical', 'Mechanical', 'Chemical', 'Other'
  )),
  unit VARCHAR(50) NOT NULL,
  description TEXT,
  is_numeric BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY unique_indicator_name (indicator_name, unit)
);

-- Indexes
CREATE INDEX idx_indicator_type ON parameter_indicators(indicator_type);
CREATE INDEX idx_is_numeric ON parameter_indicators(is_numeric);
```

### 2. threshold_requirements
Stores threshold definitions for parameters.

```sql
CREATE TABLE threshold_requirements (
  threshold_id VARCHAR(50) PRIMARY KEY,
  indicator_id VARCHAR(50) NOT NULL,
  minimum_value DECIMAL(10, 2),
  maximum_value DECIMAL(10, 2),
  warning_min DECIMAL(10, 2),
  warning_max DECIMAL(10, 2),
  critical_min DECIMAL(10, 2),
  critical_max DECIMAL(10, 2),
  acceptable_tolerance DECIMAL(10, 2),
  unit VARCHAR(50) NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (indicator_id) REFERENCES parameter_indicators(indicator_id) ON DELETE CASCADE,
  UNIQUE KEY unique_threshold_per_indicator (indicator_id, description)
);

-- Indexes
CREATE INDEX idx_threshold_indicator ON threshold_requirements(indicator_id);
CREATE INDEX idx_threshold_active ON threshold_requirements(is_active);
CREATE INDEX idx_threshold_created ON threshold_requirements(created_at);
```

### 3. asset_inspection_points
Associates inspection points with specific assets.

```sql
CREATE TABLE asset_inspection_points (
  asset_point_id VARCHAR(50) PRIMARY KEY,
  asset_id VARCHAR(50) NOT NULL,
  point_id VARCHAR(50) NOT NULL,
  template_id VARCHAR(50) NOT NULL,
  sequence INT NOT NULL,
  priority VARCHAR(20) NOT NULL CHECK (priority IN ('Critical', 'High', 'Medium', 'Low')),
  is_applicable BOOLEAN DEFAULT TRUE,
  is_mandatory BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (asset_id) REFERENCES assets(asset_id) ON DELETE CASCADE,
  FOREIGN KEY (point_id) REFERENCES inspection_points(point_id) ON DELETE CASCADE,
  FOREIGN KEY (template_id) REFERENCES itp_templates(template_id) ON DELETE CASCADE,
  UNIQUE KEY unique_asset_point (asset_id, point_id, template_id)
);

-- Indexes
CREATE INDEX idx_asset_point_asset ON asset_inspection_points(asset_id);
CREATE INDEX idx_asset_point_point ON asset_inspection_points(point_id);
CREATE INDEX idx_asset_point_template ON asset_inspection_points(template_id);
CREATE INDEX idx_asset_point_priority ON asset_inspection_points(priority);
CREATE INDEX idx_asset_point_sequence ON asset_inspection_points(asset_id, sequence);
```

### 4. asset_parameter_thresholds
Links parameters and thresholds to asset inspection points.

```sql
CREATE TABLE asset_parameter_thresholds (
  asset_param_id VARCHAR(50) PRIMARY KEY,
  asset_point_id VARCHAR(50) NOT NULL,
  indicator_id VARCHAR(50) NOT NULL,
  threshold_id VARCHAR(50) NOT NULL,
  asset_id VARCHAR(50) NOT NULL,
  point_id VARCHAR(50) NOT NULL,
  sequence INT NOT NULL DEFAULT 1,
  is_required BOOLEAN DEFAULT TRUE,
  is_active BOOLEAN DEFAULT TRUE,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (asset_point_id) REFERENCES asset_inspection_points(asset_point_id) ON DELETE CASCADE,
  FOREIGN KEY (indicator_id) REFERENCES parameter_indicators(indicator_id) ON DELETE RESTRICT,
  FOREIGN KEY (threshold_id) REFERENCES threshold_requirements(threshold_id) ON DELETE RESTRICT,
  FOREIGN KEY (asset_id) REFERENCES assets(asset_id) ON DELETE CASCADE,
  FOREIGN KEY (point_id) REFERENCES inspection_points(point_id) ON DELETE CASCADE,
  UNIQUE KEY unique_asset_param (asset_point_id, indicator_id)
);

-- Indexes
CREATE INDEX idx_asset_param_asset_point ON asset_parameter_thresholds(asset_point_id);
CREATE INDEX idx_asset_param_indicator ON asset_parameter_thresholds(indicator_id);
CREATE INDEX idx_asset_param_threshold ON asset_parameter_thresholds(threshold_id);
CREATE INDEX idx_asset_param_asset ON asset_parameter_thresholds(asset_id);
CREATE INDEX idx_asset_param_point ON asset_parameter_thresholds(point_id);
CREATE INDEX idx_asset_param_active ON asset_parameter_thresholds(is_active);
CREATE INDEX idx_asset_param_required ON asset_parameter_thresholds(is_required);
CREATE INDEX idx_asset_param_sequence ON asset_parameter_thresholds(asset_point_id, sequence);
```

## Key Relationships

```
assets (1)
  └─── (M) asset_inspection_points
        └─── (M) asset_parameter_thresholds
              ├─── (M) parameter_indicators
              └─── (M) threshold_requirements

inspection_points (1)
  └─── (M) asset_inspection_points
        └─── (M) asset_parameter_thresholds

itp_templates (1)
  └─── (M) asset_inspection_points

parameter_indicators (1)
  ├─── (M) threshold_requirements
  └─── (M) asset_parameter_thresholds

threshold_requirements (1)
  └─── (M) asset_parameter_thresholds
```

## Sample Data Inserts

### Insert Parameter Indicators
```sql
INSERT INTO parameter_indicators (
  indicator_id, indicator_name, indicator_type, unit, description, is_numeric
) VALUES
('IND-001', 'Operating Temperature', 'Temperature', '°C', 'Motor operating temperature', TRUE),
('IND-002', 'Hydraulic Pressure', 'Pressure', 'bar', 'System hydraulic pressure', TRUE),
('IND-003', 'Vibration Level', 'Vibration', 'mm/s', 'Structural vibration measurement', TRUE),
('IND-004', 'Oil Leak Detection', 'Visual', 'Status', 'Visual inspection for oil leaks', FALSE),
('IND-005', 'Electrical Resistance', 'Electrical', 'Ω', 'Ground resistance measurement', TRUE);
```

### Insert Threshold Requirements
```sql
INSERT INTO threshold_requirements (
  threshold_id, indicator_id, minimum_value, maximum_value, 
  warning_min, warning_max, critical_min, critical_max, 
  acceptable_tolerance, unit, description, is_active
) VALUES
('TH-001', 'IND-001', 20, 85, 25, 80, 15, 90, 2, '°C', 
 'Temperature range for normal operation', TRUE),

('TH-002', 'IND-002', 1, 250, 10, 240, 0.5, 280, 5, 'bar', 
 'Hydraulic system pressure limits', TRUE),

('TH-003', 'IND-003', 0, 7.1, 0.5, 6, 0, 10, 0.5, 'mm/s', 
 'Vibration severity levels (ISO 20816)', TRUE),

('TH-004', 'IND-005', 1000000, NULL, 500000, NULL, 100000, NULL, NULL, 'Ω', 
 'Minimum ground resistance requirement', TRUE);
```

### Insert Asset Inspection Points
```sql
INSERT INTO asset_inspection_points (
  asset_point_id, asset_id, point_id, template_id, sequence, 
  priority, is_applicable, is_mandatory
) VALUES
('AIP-001', 'ASSET-001', 'POINT-001', 'TEMPLATE-001', 1, 'Critical', TRUE, TRUE),
('AIP-002', 'ASSET-001', 'POINT-002', 'TEMPLATE-001', 2, 'High', TRUE, TRUE),
('AIP-003', 'ASSET-002', 'POINT-003', 'TEMPLATE-002', 1, 'Medium', TRUE, FALSE);
```

### Insert Asset Parameter Thresholds
```sql
INSERT INTO asset_parameter_thresholds (
  asset_param_id, asset_point_id, indicator_id, threshold_id, 
  asset_id, point_id, sequence, is_required, is_active, notes
) VALUES
('APT-001', 'AIP-001', 'IND-001', 'TH-001', 'ASSET-001', 'POINT-001', 1, 
 TRUE, TRUE, 'Check motor temperature after 2 hours of operation'),

('APT-002', 'AIP-001', 'IND-002', 'TH-002', 'ASSET-001', 'POINT-001', 2, 
 TRUE, TRUE, 'Monitor hydraulic pressure during load test'),

('APT-003', 'AIP-002', 'IND-003', 'TH-003', 'ASSET-001', 'POINT-002', 1, 
 TRUE, TRUE, 'Measure vibration at idle and full load');
```

## Query Examples

### Get All Parameters for an Asset
```sql
SELECT DISTINCT 
  pi.indicator_id,
  pi.indicator_name,
  pi.indicator_type,
  pi.unit,
  tr.threshold_id,
  tr.minimum_value,
  tr.maximum_value,
  tr.warning_min,
  tr.warning_max,
  tr.critical_min,
  tr.critical_max,
  apt.is_required,
  apt.notes
FROM asset_parameter_thresholds apt
JOIN asset_inspection_points aip ON apt.asset_point_id = aip.asset_point_id
JOIN parameter_indicators pi ON apt.indicator_id = pi.indicator_id
JOIN threshold_requirements tr ON apt.threshold_id = tr.threshold_id
WHERE aip.asset_id = 'ASSET-001'
  AND apt.is_active = TRUE
  AND aip.is_applicable = TRUE
ORDER BY aip.sequence, apt.sequence;
```

### Get Critical Inspection Points for an Asset
```sql
SELECT 
  aip.asset_point_id,
  aip.asset_id,
  aip.point_id,
  aip.priority,
  COUNT(apt.asset_param_id) as parameter_count
FROM asset_inspection_points aip
LEFT JOIN asset_parameter_thresholds apt ON aip.asset_point_id = apt.asset_point_id
WHERE aip.asset_id = 'ASSET-001'
  AND aip.priority = 'Critical'
  AND aip.is_applicable = TRUE
GROUP BY aip.asset_point_id
ORDER BY aip.sequence;
```

### Find Assets with Incomplete Parameter Configuration
```sql
SELECT 
  aip.asset_id,
  aip.point_id,
  COUNT(apt.asset_param_id) as configured_parameters
FROM asset_inspection_points aip
LEFT JOIN asset_parameter_thresholds apt ON aip.asset_point_id = apt.asset_point_id 
  AND apt.is_required = TRUE
WHERE apt.asset_param_id IS NULL
GROUP BY aip.asset_point_id
ORDER BY aip.asset_id, aip.sequence;
```

### Get Threshold Statistics for Reporting
```sql
SELECT 
  pi.indicator_type,
  COUNT(DISTINCT tr.threshold_id) as threshold_count,
  COUNT(DISTINCT apt.asset_param_id) as usage_count,
  AVG(tr.maximum_value) as avg_max_value
FROM parameter_indicators pi
LEFT JOIN threshold_requirements tr ON pi.indicator_id = tr.indicator_id
LEFT JOIN asset_parameter_thresholds apt ON tr.threshold_id = apt.threshold_id
WHERE tr.is_active = TRUE
GROUP BY pi.indicator_type
ORDER BY usage_count DESC;
```

## Performance Considerations

### Indexes Created
- **asset_inspection_points**: Indexed on asset_id, point_id, template_id, priority, and sequence
- **threshold_requirements**: Indexed on indicator_id, is_active, and created_at
- **parameter_indicators**: Indexed on indicator_type and is_numeric
- **asset_parameter_thresholds**: Composite indexes for common queries

### Query Optimization Tips
1. Always filter by `is_active` when querying thresholds
2. Use `asset_point_id` for lookups (primary key)
3. Use composite indexes for asset_id + sequence queries
4. Consider caching threshold data (rarely changes)
5. Use EXPLAIN PLAN to analyze slow queries

## Backup & Recovery

### Critical Tables for Backup
- parameter_indicators (master data)
- threshold_requirements (configuration)
- asset_inspection_points (asset mappings)
- asset_parameter_thresholds (detailed configuration)

### Suggested Backup Strategy
- Daily incremental backups
- Weekly full backups
- Monthly archive backups
- Test recovery procedures quarterly

## Data Integrity Constraints

1. **No orphaned thresholds**: Foreign key constraints prevent deletion of indicators with active thresholds
2. **Asset-Point Uniqueness**: No duplicate asset-point mappings per template
3. **Parameter Uniqueness**: No duplicate parameter indicators with same name and unit
4. **Status Consistency**: Active thresholds must have valid parameter indicators

## Migration from Mock Data to Production

### Step-by-Step Process
1. Export mock data from Angular service
2. Validate data structure and constraints
3. Clean/transform data as needed
4. Insert into parameter_indicators
5. Insert into threshold_requirements
6. Insert into asset_inspection_points
7. Insert into asset_parameter_thresholds
8. Verify referential integrity
9. Test with sample queries
10. Update connection string in service

### Verification Queries
```sql
-- Verify all references are valid
SELECT COUNT(*) FROM asset_parameter_thresholds 
WHERE indicator_id NOT IN (SELECT indicator_id FROM parameter_indicators);

SELECT COUNT(*) FROM asset_parameter_thresholds 
WHERE threshold_id NOT IN (SELECT threshold_id FROM threshold_requirements);

SELECT COUNT(*) FROM asset_parameter_thresholds 
WHERE asset_point_id NOT IN (SELECT asset_point_id FROM asset_inspection_points);

-- Should all return 0
```

## Security Considerations

### Access Control
- Restrict indicator/threshold modifications to admins
- Log all changes to audit tables
- Implement role-based access (View, Edit, Delete)
- Encrypt sensitive threshold data

### Audit Trail Tables
```sql
CREATE TABLE parameter_indicator_audit (
  audit_id BIGINT AUTO_INCREMENT PRIMARY KEY,
  indicator_id VARCHAR(50),
  action VARCHAR(10),
  old_value TEXT,
  new_value TEXT,
  changed_by VARCHAR(100),
  changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE threshold_audit (
  audit_id BIGINT AUTO_INCREMENT PRIMARY KEY,
  threshold_id VARCHAR(50),
  action VARCHAR(10),
  field_name VARCHAR(50),
  old_value TEXT,
  new_value TEXT,
  changed_by VARCHAR(100),
  changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```
