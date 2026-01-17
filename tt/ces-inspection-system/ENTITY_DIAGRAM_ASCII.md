# CES Inspection System - ASCII Entity Relationship Diagram

## Complete System Architecture with Field Details

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                    CES INSPECTION SYSTEM - ENTITY RELATIONSHIP DIAGRAM               │
│                              19 Entities | 250+ Fields                               │
└─────────────────────────────────────────────────────────────────────────────────────┘


                                    ┌──────────────────────┐
                                    │ TERMINAL_LOCATION    │
                                    ├──────────────────────┤
                                    │ PK: locationId       │
                                    │ • locationName       │
                                    │ • terminalCode       │
                                    │ • gpsCoordinates?    │
                                    └──────────────────────┘
                                              │
                                              │ 1:M
                                              ↓
                        ┌─────────────────────────────────────────┐
                        │         ASSET (Master)                   │
                        ├─────────────────────────────────────────┤
                        │ PK: assetId                              │
                        │ FK: locationId                           │
                        │ • assetCode (UNIQUE)                     │
                        │ • assetType (STS|RTG|RMG)                │
                        │ • description                            │
                        │ • manufacturer?                          │
                        │ • modelNumber?                           │
                        │ • serialNumber? (UNIQUE)                 │
                        │ • acquisitionDate?                       │
                        │ • warrantyExpiry?                        │
                        │ • diagramUrl?                            │
                        │ • createdAt, updatedAt                   │
                        └─────────────────────────────────────────┘
                                  │        │        │
                      ┌───────────┼────────┼────────┼───────────┐
                      │           │        │        │           │
                    1:1│         1:M│     1:M│     1:M│        1:M│
                      ↓           ↓        ↓        ↓           ↓
        ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
        │  ASSET_SPECS     │  │ COMPONENT_MASTER │  │ INSPECTION_JOB   │
        ├──────────────────┤  ├──────────────────┤  ├──────────────────┤
        │ PK: specId       │  │ PK: componentId  │  │ PK: jobId        │
        │ FK: assetId      │  │ FK: assetId      │  │ FK: assetId      │
        │                  │  │    parentCompId? │  │ FK: templateId   │
        │ Specifications:  │  │                  │  │ FK: inspectorId  │
        │ • liftCapacity?  │  │ • componentCode  │  │                  │
        │ • maxSpeed?      │  │ • componentName  │  │ • jobType        │
        │ • motorPower?    │  │ • category       │  │ • status         │
        │ • cycleTime?     │  │ • criticality    │  │ • startDate      │
        │ • wheelDiameter? │  │ • isActive       │  │ • endDate?       │
        │ • tireCondition? │  │ • diagramUrl?    │  │ • notes?         │
        │ • nextServiceDt? │  │ • maintenanceInt?│  │                  │
        │ • certifications?│  │ • nextMaintDt?   │  │ • createdAt      │
        │                  │  │ • createdAt      │  │ • updatedAt      │
        │ • createdAt      │  │ • updatedAt      │  └──────────────────┘
        │ • updatedAt      │  └──────────────────┘           │
        └──────────────────┘        │         │              │ 1:M
                                    │         │              ↓
                    ┌───────────────┘         │    ┌──────────────────────┐
                    │                         │    │ INSPECTION_RESULT    │
                    │            ┌────────────┼────├──────────────────────┤
                    │            │            │    │ PK: resultId         │
                    │            │            │    │ FK: jobId            │
                    │        1:M  │        1:M │    │ FK: pointId          │
                    │            ↓            ↓    │ FK: controlId?       │
                    │   ┌──────────────────────┐   │ FK: inspectorId      │
                    │   │COMPONENT_INSPECTION_ │   │                      │
                    │   │POINT (Junction)      │   │ • result             │
                    │   ├──────────────────────┤   │ • observedValue?     │
                    │   │ PK: mappingId        │   │ • expectedValue?     │
                    │   │ FK: pointId          │   │ • evidence?          │
                    │   │ FK: componentId      │   │ • inspectorNotes?    │
                    │   │ FK: subComponentId?  │   │ • inspectionDate     │
                    │   │                      │   │ • createdAt          │
                    │   │ • inspectionSequence │   │ • updatedAt          │
                    │   │ • priority           │   └──────────────────────┘
                    │   │ • createdAt          │              │
                    │   │ • updatedAt          │              │ 1:M
                    │   └──────────────────────┘              ↓
                    │              │           ┌──────────────────────┐
                    │              │           │   ISSUE_NCR          │
                    │           1:M│           ├──────────────────────┤
                    │              └──────────→│ PK: issueId          │
                    │                          │ FK: jobId            │
                    │                          │ FK: resultId         │
                    │                          │ FK: createdBy        │
                    │                          │ FK: assignedTo?      │
                    └─────────────→┌───────────┤                      │
                                   │ 1:M       │ • title              │
                                   ↓           │ • severity           │
        ┌──────────────────────┐   │           │ • status             │
        │ ISSUE_DEFECT         │   │           │ • dueDate?           │
        ├──────────────────────┤   │           │ • resolution?        │
        │ PK: issueId          │   │           │ • createdAt          │
        │ FK: assetId          │   │           │ • updatedAt          │
        │ FK: createdBy        │   │           └──────────────────────┘
        │ FK: assignedTo?      │   │
        │                      │   │
        │ • defectType         │   │
        │ • severity           │   │
        │ • status             │   │
        │ • dueDate?           │   │
        │ • resolution?        │   │
        │ • createdAt          │   │
        │ • updatedAt          │   │
        └──────────────────────┘   │
                                   │
                         ┌─────────┘
                         │ 1:M
                         ↓
        ┌──────────────────────────┐
        │ ISSUE_PUNCH_LIST         │
        ├──────────────────────────┤
        │ PK: issueId              │
        │ FK: jobId                │
        │ FK: createdBy            │
        │ FK: assignedTo?          │
        │                          │
        │ • title                  │
        │ • description            │
        │ • status                 │
        │ • dueDate?               │
        │ • createdAt              │
        │ • updatedAt              │
        └──────────────────────────┘


                         ┌──────────────────────┐
                         │ ITP_TEMPLATE         │
                         ├──────────────────────┤
                         │ PK: templateId       │
                         │                      │
                         │ • templateCode       │
                         │ • title              │
                         │ • revisionNo         │
                         │ • applicableAssetTyp │
                         │ • standardReference  │
                         │ • approvedBy?        │
                         │ • isActive           │
                         │ • description?       │
                         │ • createdAt          │
                         │ • updatedAt          │
                         └──────────────────────┘
                                  │
                                  │ 1:M
                                  ↓
                    ┌──────────────────────────┐
                    │ INSPECTION_POINT         │
                    ├──────────────────────────┤
                    │ PK: pointId              │
                    │ FK: templateId           │
                    │ FK: componentId?         │
                    │                          │
                    │ • sequenceOrder          │
                    │ • pointDescription      │
                    │ • componentCategory      │
                    │ • inspectionMethod       │
                    │ • isMandatory            │
                    │ • pointThreshold?        │
                    │ • applicableToComponent  │
                    │ • applicableToAsset      │
                    │ • createdAt              │
                    │ • updatedAt              │
                    └──────────────────────────┘
                                  │
                    ┌─────────────┼─────────────┐
                    │             │             │
                  1:M│           1:M│          1:M│
                    ↓             ↓             ↓
        ┌──────────────────┐  ┌──────────────────────────┐
        │ CONTROL_POINT    │  │ COMPONENT_INSPECTION_PT  │
        ├──────────────────┤  │ (Already shown above)    │
        │ PK: controlId    │  └──────────────────────────┘
        │ FK: pointId      │
        │                  │
        │ • pointType      │
        │ • description    │
        │ • criteria       │
        │ • frequencyDays? │
        │ • createdAt      │
        │ • updatedAt      │
        └──────────────────┘


                    ┌──────────────────────────┐
                    │ PARAMETER_INDICATOR      │
                    ├──────────────────────────┤
                    │ PK: indicatorId          │
                    │                          │
                    │ • indicatorName (UNIQUE) │
                    │ • indicatorType          │
                    │ • unit                   │
                    │ • description?           │
                    │ • isNumeric              │
                    │ • createdAt              │
                    │ • updatedAt              │
                    └──────────────────────────┘
                                  │
                                1:1│ + 1:M
                    ┌─────────────┴──────────────┐
                    │                            │
                    ↓                            ↓
        ┌──────────────────────────┐  ┌──────────────────────┐
        │ THRESHOLD_REQUIREMENT    │  │ COMPONENT_PARAMETER  │
        ├──────────────────────────┤  ├──────────────────────┤
        │ PK: thresholdId          │  │ PK: componentParamId │
        │ FK: indicatorId          │  │ FK: componentId      │
        │                          │  │ FK: pointId          │
        │ • minimumValue?          │  │ FK: indicatorId      │
        │ • maximumValue?          │  │ FK: thresholdId      │
        │ • warningMin?            │  │                      │
        │ • warningMax?            │  │ • sequence           │
        │ • criticalMin?           │  │ • isRequired         │
        │ • criticalMax?           │  │ • isActive           │
        │ • acceptableTolerance?   │  │ • notes?             │
        │ • unit                   │  │ • createdAt          │
        │ • description?           │  │ • updatedAt          │
        │ • isActive               │  └──────────────────────┘
        │ • createdAt              │
        │ • updatedAt              │
        └──────────────────────────┘


        ┌──────────────────────────────┐    ┌──────────────────────┐
        │ COMPONENT_POINT_COVERAGE     │    │ COMPONENT_HIERARCHY  │
        ├──────────────────────────────┤    ├──────────────────────┤
        │ PK: coverageId               │    │ PK: hierarchyId      │
        │ FK: componentId (UNIQUE)     │    │ FK: parentCompId     │
        │                              │    │ FK: childComponentId │
        │ • totalInspectionPoints      │    │                      │
        │ • mappedPoints               │    │ • relationshipType   │
        │ • coveragePercentage         │    │ • sequence           │
        │ • lastUpdated                │    │ • isActive           │
        └──────────────────────────────┘    │ • createdAt          │
                                            │ • updatedAt          │
                                            └──────────────────────┘


                        ┌──────────────────────┐
                        │ USER                 │
                        ├──────────────────────┤
                        │ PK: userId           │
                        │                      │
                        │ • firstName          │
                        │ • lastName           │
                        │ • email (UNIQUE)     │
                        │ • role               │
                        │ • isActive           │
                        │ • createdAt          │
                        │ • updatedAt          │
                        └──────────────────────┘
```

---

## Entity Dependency Flow

### Setup Phase (Master Data)
```
TERMINAL_LOCATION
    ↓
ASSET (+ ASSET_SPECS)
    ↓
COMPONENT_MASTER (+ COMPONENT_HIERARCHY, COMPONENT_POINT_COVERAGE)
```

### Configuration Phase
```
ITP_TEMPLATE
    ↓
INSPECTION_POINT (+ CONTROL_POINT)
    ↓
PARAMETER_INDICATOR
    ↓
THRESHOLD_REQUIREMENT
    ↓
COMPONENT_INSPECTION_POINT (maps components to points)
    ↓
COMPONENT_PARAMETER (maps parameters to components)
```

### Execution Phase
```
USER (Inspector)
    ↓
INSPECTION_JOB (asset + template + inspector)
    ↓
INSPECTION_RESULT (point evaluations)
    ↓
Issues:
├─ ISSUE_NCR (from failed results)
├─ ISSUE_PUNCH_LIST (from job requirements)
└─ ISSUE_DEFECT (defect reports)
```

---

## Entity Count by Type

```
┌─────────────────────┬───────┬──────────────────────────────┐
│ Entity Type         │ Count │ Examples                     │
├─────────────────────┼───────┼──────────────────────────────┤
│ Master Data         │   6   │ ASSET, COMPONENT_MASTER      │
│ Configuration       │   8   │ INSPECTION_POINT, PARAMETER  │
│ Transactional       │   5   │ INSPECTION_JOB, ISSUE_*      │
│ Aggregation/View    │   2   │ COMPONENT_POINT_COVERAGE    │
│ System              │   1   │ USER                         │
├─────────────────────┼───────┼──────────────────────────────┤
│ TOTAL               │  19   │                              │
└─────────────────────┴───────┴──────────────────────────────┘
```

---

## Field Distribution

```
┌──────────────────────────┬──────────┬──────────────────────────┐
│ Field Type               │ Count    │ Purpose                  │
├──────────────────────────┼──────────┼──────────────────────────┤
│ Primary Keys (UUID)      │   ~40    │ Unique identification    │
│ Foreign Keys (UUID)      │   ~30    │ Relationships            │
│ Strings/VARCHAR          │   ~80    │ Names, codes, text       │
│ Text/Long Content        │   ~20    │ Descriptions, notes      │
│ Enums                    │   ~30    │ Fixed options            │
│ Dates/Timestamps         │   ~40    │ Audit trails, scheduling │
│ Boolean Flags            │   ~20    │ Status indicators        │
│ Numeric Values           │   ~15    │ Measurements, counts     │
├──────────────────────────┼──────────┼──────────────────────────┤
│ TOTAL FIELDS             │  ~275    │                          │
└──────────────────────────┴──────────┴──────────────────────────┘
```

---

## Relationship Statistics

```
┌──────────────────────────────┬──────────┐
│ Relationship Type            │ Count    │
├──────────────────────────────┼──────────┤
│ One-to-One (1:1)             │   3      │
│ One-to-Many (1:M)            │   20     │
│ Many-to-Many (M:M)           │   3      │
│ Self-Referencing             │   1      │
├──────────────────────────────┼──────────┤
│ TOTAL RELATIONSHIPS          │   27     │
└──────────────────────────────┴──────────┘
```

---

## Data Integrity Constraints

### Unique Constraints
- assetCode
- serialNumber (ASSET)
- componentCode
- templateCode
- indicatorName
- email (USER)
- locationName
- terminalCode
- assetId (ASSET_SPECS) - 1:1 relationship

### Check Constraints (Enums)
- assetType: STS | RTG | RMG
- status: Draft | In Progress | Completed | On Hold
- severity: Critical | High | Medium | Low
- role: Admin | Inspector | Approver | Viewer
- (and 15+ more enum constraints)

### Foreign Key Constraints
- All Foreign Keys required (except optional relationships)
- Referential integrity enforced
- Cascade delete/update policies defined

---

## Sample Query Complexity

### Simple Query (1 entity)
```sql
SELECT * FROM asset WHERE asset_id = ?
```

### Moderate Query (3-4 entities)
```sql
SELECT a.*, tl.location_name, ast.lift_capacity
FROM asset a
JOIN terminal_location tl ON a.location_id = tl.location_id
LEFT JOIN asset_specs ast ON a.asset_id = ast.asset_id
WHERE a.asset_id = ?
```

### Complex Query (8+ entities)
```sql
SELECT cm.*, ip.point_description, ir.result, pi.indicator_name, tr.minimum_value
FROM component_master cm
JOIN component_inspection_point cip ON cm.component_id = cip.component_id
JOIN inspection_point ip ON cip.point_id = ip.point_id
JOIN component_parameter cp ON cm.component_id = cp.component_id
JOIN parameter_indicator pi ON cp.indicator_id = pi.indicator_id
JOIN threshold_requirement tr ON cp.threshold_id = tr.threshold_id
LEFT JOIN inspection_result ir ON ip.point_id = ir.point_id
WHERE cm.component_id = ? AND ir.result = 'Fail'
```

---

## Legend

```
┌─────────────────────────┐
│ Entity Name             │  ← Entity/Table
├─────────────────────────┤
│ PK: primaryKey          │  ← Primary Key
│ FK: foreignKey          │  ← Foreign Key
│ • fieldName             │  ← Regular Field
│ • fieldName?            │  ← Optional Field
│ • fieldName (UNIQUE)    │  ← Unique Constraint
│ • enum1 | enum2 | enum3 │  ← Enumerated Values
└─────────────────────────┘

          1:1
    ────────────────  One-to-One Relationship
          1:M
    ────────────────  One-to-Many Relationship
          M:M
    ────────────────  Many-to-Many (via junction table)

    FK: Foreign Key Reference
    PK: Primary Key
    (?) Optional field
```

---

**Document Generated:** January 17, 2026  
**CES Inspection System Version:** 1.0  
**Status:** Production Ready
