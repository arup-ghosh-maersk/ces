# CES Inspection System - Entity Quick Reference Guide

## Entity Overview Table

| # | Entity Name | Type | Purpose | Key Fields | Parent Entity | Child Entities |
|---|---|---|---|---|---|---|
| 1 | **TERMINAL_LOCATION** | Lookup | Gateway/Terminal locations | locationId, locationName, terminalCode | None | ASSET |
| 2 | **ASSET** | Master | Main asset/equipment entities | assetId, assetCode, assetType, description | TERMINAL_LOCATION | COMPONENT_MASTER, INSPECTION_JOB, ASSET_SPECS, ISSUE_DEFECT |
| 3 | **ASSET_SPECS** | Detail | Technical specifications for assets | specId, assetId, liftCapacity, motorPower, cycleTime | ASSET | None |
| 4 | **COMPONENT_MASTER** | Hierarchical | Asset components with hierarchy support | componentId, componentCode, componentName, category, criticality | ASSET, COMPONENT_MASTER (self) | COMPONENT_MASTER (self), COMPONENT_INSPECTION_POINT, COMPONENT_PARAMETER, COMPONENT_POINT_COVERAGE |
| 5 | **ITP_TEMPLATE** | Master | Inspection templates | templateId, templateCode, title, revisionNo, applicableAssetType | None | INSPECTION_POINT, INSPECTION_JOB |
| 6 | **INSPECTION_POINT** | Detail | Individual inspection checkpoints | pointId, templateId, sequenceOrder, pointDescription, inspectionMethod | ITP_TEMPLATE | CONTROL_POINT, INSPECTION_RESULT, COMPONENT_INSPECTION_POINT, COMPONENT_PARAMETER |
| 7 | **CONTROL_POINT** | Detail | Evaluation criteria for inspection points | controlId, pointId, pointType, description, criteria | INSPECTION_POINT | INSPECTION_RESULT |
| 8 | **INSPECTION_JOB** | Transaction | Individual inspection execution | jobId, assetId, templateId, jobType, status, startDate | ASSET, ITP_TEMPLATE, USER | INSPECTION_RESULT, ISSUE_NCR, ISSUE_PUNCH_LIST |
| 9 | **INSPECTION_RESULT** | Transaction | Individual point measurement results | resultId, jobId, pointId, result, observedValue, inspectionDate | INSPECTION_JOB, INSPECTION_POINT, CONTROL_POINT, USER | ISSUE_NCR |
| 10 | **ISSUE_NCR** | Transaction | Non-conformance reports | issueId, jobId, resultId, title, severity, status | INSPECTION_JOB, INSPECTION_RESULT, USER (creator/assignee) | None |
| 11 | **ISSUE_PUNCH_LIST** | Transaction | Punch list items for completion | issueId, jobId, title, status | INSPECTION_JOB, USER (creator/assignee) | None |
| 12 | **ISSUE_DEFECT** | Transaction | Defect tracking | issueId, assetId, title, defectType, severity, status | ASSET, USER (creator/assignee) | None |
| 13 | **COMPONENT_INSPECTION_POINT** | Junction | Component-Inspection Point mapping | mappingId, pointId, componentId, applicableToComponent | INSPECTION_POINT, COMPONENT_MASTER | COMPONENT_PARAMETER |
| 14 | **PARAMETER_INDICATOR** | Master | Measurable parameters | indicatorId, indicatorName, indicatorType, unit, isNumeric | None | THRESHOLD_REQUIREMENT, COMPONENT_PARAMETER |
| 15 | **THRESHOLD_REQUIREMENT** | Detail | Acceptable ranges/limits | thresholdId, indicatorId, minimumValue, maximumValue, warningMin, warningMax | PARAMETER_INDICATOR | COMPONENT_PARAMETER |
| 16 | **COMPONENT_PARAMETER** | Junction | Parameter-Component association | componentParamId, componentId, pointId, indicatorId, thresholdId | COMPONENT_MASTER, INSPECTION_POINT, COMPONENT_INSPECTION_POINT, PARAMETER_INDICATOR, THRESHOLD_REQUIREMENT | None |
| 17 | **COMPONENT_POINT_COVERAGE** | Aggregate | Coverage metrics tracking | coverageId, componentId, totalInspectionPoints, mappedPoints, coveragePercentage | COMPONENT_MASTER | None |
| 18 | **COMPONENT_HIERARCHY** | Junction | Component relationships | hierarchyId, parentComponentId, childComponentId, relationshipType | COMPONENT_MASTER (parent), COMPONENT_MASTER (child) | None |
| 19 | **USER** | Lookup | System users | userId, firstName, lastName, email, role, isActive | None | INSPECTION_JOB, INSPECTION_RESULT, ISSUE_NCR, ISSUE_PUNCH_LIST, ISSUE_DEFECT |

---

## Entity Categories

### Master Data Entities (Setup)
- **TERMINAL_LOCATION** - Terminal/gateway definitions
- **ASSET** - Main asset/equipment records
- **COMPONENT_MASTER** - Asset component definitions
- **ITP_TEMPLATE** - Inspection procedure templates
- **PARAMETER_INDICATOR** - Measurable parameter definitions
- **USER** - System user accounts

### Configuration Entities (Configuration)
- **ASSET_SPECS** - Technical specifications for assets
- **INSPECTION_POINT** - Individual inspection checkpoints
- **CONTROL_POINT** - Evaluation criteria
- **THRESHOLD_REQUIREMENT** - Acceptable value ranges
- **COMPONENT_PARAMETER** - Parameter-component associations
- **COMPONENT_INSPECTION_POINT** - Component-point mappings
- **COMPONENT_POINT_COVERAGE** - Coverage metrics
- **COMPONENT_HIERARCHY** - Component relationships

### Transactional Entities (Execution)
- **INSPECTION_JOB** - Inspection execution
- **INSPECTION_RESULT** - Individual point results
- **ISSUE_NCR** - Non-conformance reports
- **ISSUE_PUNCH_LIST** - Punch list items
- **ISSUE_DEFECT** - Defect reports

---

## Field Type Summary

| Data Type | Count | Examples |
|---|---|---|
| UUID (Primary/Foreign Key) | 40+ | assetId, locationId, templateId, jobId |
| String/VARCHAR | 80+ | assetCode, description, title, email |
| Text/Long String | 20+ | specifications, notes, evidence, resolution |
| Enum/Constrained String | 30+ | assetType (STS/RTG/RMG), status, severity, category |
| Date/DateTime | 40+ | createdAt, updatedAt, acquisitionDate, inspectionDate |
| Boolean/Flag | 20+ | isActive, isRequired, isMandatory, applicableToComponent |
| Numeric | 15+ | liftCapacity, motorPower, coveragePercentage |

---

## Relationship Types

### One-to-One (1:1)
- ASSET ↔ ASSET_SPECS
- COMPONENT_MASTER ↔ COMPONENT_POINT_COVERAGE
- PARAMETER_INDICATOR ↔ THRESHOLD_REQUIREMENT

### One-to-Many (1:M)
- TERMINAL_LOCATION → ASSET (1 terminal has many assets)
- ASSET → COMPONENT_MASTER (1 asset has many components)
- ASSET → INSPECTION_JOB (1 asset can have many jobs)
- ASSET → ISSUE_DEFECT (1 asset can have many defects)
- ITP_TEMPLATE → INSPECTION_POINT (1 template has many points)
- INSPECTION_POINT → CONTROL_POINT (1 point has many controls)
- INSPECTION_JOB → INSPECTION_RESULT (1 job has many results)
- INSPECTION_JOB → ISSUE_NCR (1 job can generate many NCRs)
- COMPONENT_MASTER → COMPONENT_MASTER (self-referencing hierarchy)
- PARAMETER_INDICATOR → COMPONENT_PARAMETER (1 indicator used in many components)

### Many-to-Many (M:M) - via Junction Tables
- COMPONENT_MASTER ↔ INSPECTION_POINT (via COMPONENT_INSPECTION_POINT)
- COMPONENT_MASTER ↔ PARAMETER_INDICATOR (via COMPONENT_PARAMETER)
- COMPONENT_MASTER ↔ THRESHOLD_REQUIREMENT (via COMPONENT_PARAMETER)

---

## Data Flow Sequences

### Sequence 1: Asset Setup
```
TERMINAL_LOCATION
    ↓
ASSET (references TERMINAL_LOCATION)
    ↓
ASSET_SPECS (references ASSET)
    ↓
COMPONENT_MASTER (references ASSET)
    ↓
COMPONENT_HIERARCHY (references COMPONENT_MASTER)
```

### Sequence 2: Template Configuration
```
ITP_TEMPLATE
    ↓
INSPECTION_POINT (references ITP_TEMPLATE)
    ↓
CONTROL_POINT (references INSPECTION_POINT)
    ↓
PARAMETER_INDICATOR
    ↓
THRESHOLD_REQUIREMENT (references PARAMETER_INDICATOR)
```

### Sequence 3: Component Inspection Setup
```
COMPONENT_MASTER
    ↓
COMPONENT_INSPECTION_POINT (maps COMPONENT_MASTER to INSPECTION_POINT)
    ↓
COMPONENT_PARAMETER (associates PARAMETER_INDICATOR and THRESHOLD_REQUIREMENT)
    ↓
COMPONENT_POINT_COVERAGE (tracks coverage metrics)
```

### Sequence 4: Inspection Execution
```
INSPECTION_JOB (references ASSET, ITP_TEMPLATE, USER/Inspector)
    ↓
INSPECTION_RESULT (measures INSPECTION_POINT)
    ↓
CONTROL_POINT evaluation
    ↓
Issue Generation:
    - ISSUE_NCR (from failed results)
    - ISSUE_PUNCH_LIST (from job requirements)
```

### Sequence 5: Defect Tracking
```
ISSUE_DEFECT (references ASSET)
    ↓
Assignment to USER
    ↓
Status tracking: Open → In Review → Resolved → Closed
```

---

## Key Query Patterns

### 1. Get Asset with All Details
```
SELECT * FROM asset
WHERE asset_id = ?
```
Then join with:
- TERMINAL_LOCATION (location info)
- ASSET_SPECS (technical specs)
- COMPONENT_MASTER (components)

### 2. Get Component Inspection Configuration
```
SELECT cm.*, ip.point_id, pi.indicator_name, tr.minimum_value, tr.maximum_value
FROM component_master cm
JOIN component_inspection_point cip ON cm.component_id = cip.component_id
JOIN inspection_point ip ON cip.point_id = ip.point_id
JOIN component_parameter cp ON cm.component_id = cp.component_id
JOIN parameter_indicator pi ON cp.indicator_id = pi.indicator_id
JOIN threshold_requirement tr ON cp.threshold_id = tr.threshold_id
WHERE cm.component_id = ?
```

### 3. Get Inspection Job Progress
```
SELECT ij.*, 
       COUNT(ir.result_id) as total_points,
       SUM(CASE WHEN ir.result = 'Pass' THEN 1 ELSE 0 END) as passed,
       SUM(CASE WHEN ir.result = 'Fail' THEN 1 ELSE 0 END) as failed
FROM inspection_job ij
LEFT JOIN inspection_result ir ON ij.job_id = ir.job_id
WHERE ij.job_id = ?
GROUP BY ij.job_id
```

### 4. Get Outstanding Issues by Asset
```
SELECT a.asset_code,
       'NCR' as issue_type,
       COUNT(*) as count,
       MAX(severity) as max_severity
FROM issue_ncr inc
JOIN inspection_job ij ON inc.job_id = ij.job_id
JOIN asset a ON ij.asset_id = a.asset_id
WHERE inc.status IN ('Open', 'In Review')
GROUP BY a.asset_id, a.asset_code
```

### 5. Get Maintenance Due Assets
```
SELECT a.asset_id, a.asset_code, ast.next_service_date
FROM asset a
JOIN asset_specs ast ON a.asset_id = ast.asset_id
WHERE ast.next_service_date <= CURRENT_DATE + INTERVAL '30 days'
ORDER BY ast.next_service_date
```

---

## Important Constraints & Business Rules

### Mandatory Fields (NOT NULL)
- All Primary Keys (UUID)
- Foreign Keys (with exceptions for optional relationships)
- Asset code, type, description
- Component code, name, asset reference
- Inspection point description, method
- Inspection job type, status, dates
- User first name, last name, email, role
- Template code, title, asset type reference

### Unique Constraints
- assetCode (ASSET)
- serialNumber (ASSET)
- componentCode (COMPONENT_MASTER)
- templateCode (ITP_TEMPLATE)
- indicatorName (PARAMETER_INDICATOR)
- email (USER)

### Check Constraints (Enums)
- Asset Type: STS, RTG, RMG
- Component Category: Structural, Electrical, Mechanical, Hydraulic, Software, Other
- Criticality: Critical, High, Medium, Low
- Inspection Method: Visual, Ultrasonic, Functional Test, NDT
- Job Type: Construction, Commissioning, Routine, Special
- Job Status: Draft, In Progress, Completed, On Hold
- Result: Pass, Fail, N/A
- Severity: Critical, High, Medium, Low
- Issue Status: Open, In Review, Resolved, Closed
- User Role: Admin, Inspector, Approver, Viewer
- Defect Type: Fatigue Crack, Oil Leak, Electrical Fault, Mechanical Damage, Other
- Indicator Type: Temperature, Pressure, Vibration, Noise, Visual, Electrical, Mechanical, Chemical, Other
- Point Type: H (Hold), W (Warning), M (Mandatory), R (Recommendation)
- Relationship Type: Assembly, SubAssembly, Part

### Self-Referencing
- COMPONENT_MASTER can reference itself via parentComponentId
- Allows modeling of assembly hierarchies

---

## Performance Optimization Index Recommendations

### High Priority Indexes (Frequently Queried)
```sql
CREATE INDEX idx_asset_location ON asset(location_id);
CREATE INDEX idx_job_asset ON inspection_job(asset_id);
CREATE INDEX idx_job_status ON inspection_job(status);
CREATE INDEX idx_result_job ON inspection_result(job_id);
CREATE INDEX idx_component_asset ON component_master(asset_id);
CREATE INDEX idx_ncr_status ON issue_ncr(status);
```

### Medium Priority Indexes (Regular Queries)
```sql
CREATE INDEX idx_asset_type ON asset(asset_type);
CREATE INDEX idx_job_inspector ON inspection_job(inspector_id);
CREATE INDEX idx_component_parent ON component_master(parent_component_id);
CREATE INDEX idx_threshold_indicator ON threshold_requirement(indicator_id);
```

### Reporting/Analytics Indexes
```sql
CREATE INDEX idx_result_date ON inspection_result(inspection_date);
CREATE INDEX idx_job_dates ON inspection_job(start_date, end_date);
CREATE INDEX idx_component_criticality ON component_master(criticality);
CREATE INDEX idx_ncr_severity ON issue_ncr(severity);
```

---

## Audit Trail Coverage

All master and transactional entities include audit columns:
- **createdAt** - Record creation timestamp (automatically set)
- **updatedAt** - Last update timestamp (automatically updated on modifications)
- **createdBy** - User who created (where applicable)
- **assignedTo** - Current assignee (for issue tracking)

Enables complete audit trail of:
- When data was created/modified
- Who created/modified data
- Tracking of issue lifecycle and assignments

---

## Entity Count Summary

| Category | Count |
|---|---|
| Master Data Entities | 6 |
| Configuration Entities | 8 |
| Transactional Entities | 5 |
| **Total Entities** | **19** |

---

## Document References

For more detailed information, see:
1. **DETAILED_ENTITY_DIAGRAM.md** - Complete entity definitions with all fields
2. **DETAILED_ENTITY_DIAGRAM.html** - Interactive visual diagram
3. **DATABASE_SCHEMA.sql** - SQL DDL statements for database creation
4. **ENTITY_RELATIONSHIP_MERMAID.md** - Mermaid diagram format
5. **ARCHITECTURE_DIAGRAM.md** - System architecture overview

---

**Last Updated:** January 17, 2026  
**Version:** 1.0  
**Status:** Final
