# CES Entity Relationship Diagram

## Complete Entity Relationship Overview

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                         LOCATION & ASSET DOMAIN                              │
└──────────────────────────────────────────────────────────────────────────────┘

    ┌─────────────────────────┐
    │  TerminalLocation       │
    ├─────────────────────────┤
    │ PK: locationId          │
    │ ────────────────────    │
    │    locationName         │
    │    terminalCode         │
    │    gpsCoordinates       │
    └──────────┬──────────────┘
               │ 1:N
               ↓
    ┌─────────────────────────────────┐
    │        Asset                    │
    ├─────────────────────────────────┤
    │ PK: assetId                     │
    │ FK: locationId                  │
    │ ────────────────────────────    │
    │    assetCode                    │
    │    assetType (STS|RTG|RMG)     │
    │    description                  │
    │    manufacturer                 │
    │    modelNumber                  │
    │    serialNumber                 │
    │    acquisitionDate              │
    │    warrantyExpiry               │
    │    diagramUrl                   │
    └──────────┬─────────────┬────────┘
               │             │
               │ 1:1         │ 1:N
               ↓             ↓
    ┌──────────────────┐  ┌───────────────────────────────┐
    │   AssetSpecs     │  │  ComponentMaster              │
    ├──────────────────┤  ├───────────────────────────────┤
    │ PK: specId       │  │ PK: componentId               │
    │ FK: assetId      │  │ FK: assetId                   │
    │ ────────────────│  │ FK: parentComponentId (Self)  │
    │ operatingPres.. │  │ ─────────────────────────────│
    │ liftCapacity    │  │ componentCode                 │
    │ maxSpeed        │  │ componentName                 │
    │ trackGauge      │  │ assetType                     │
    │ motorPower      │  │ category                      │
    │ cycleTime       │  │ description                   │
    │ boomLength      │  │ manufacturer                  │
    │ wheelDiameter   │  │ modelNumber                   │
    │ lastServiceDate │  │ criticality                   │
    │ certifications  │  │ maintenanceIntervalDays       │
    │ createdAt       │  │ diagramUrl                    │
    └──────────────────┘  │ createdAt, updatedAt         │
                          │ isActive                      │
                          └───────────┬───────────────────┘
                                      │ Self-Referencing
                                      │ 1:N
                                      │ (Sub-assemblies)
```

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                    COMPONENT HIERARCHY & COVERAGE DOMAIN                      │
└──────────────────────────────────────────────────────────────────────────────┘

    ┌───────────────────────────────────────┐
    │   ComponentHierarchy                  │
    ├───────────────────────────────────────┤
    │ PK: hierarchyId                       │
    │ FK: parentComponentId                 │
    │ FK: childComponentId                  │
    │ ──────────────────────────────────── │
    │    relationshipType (Assembly|...)   │
    │    sequence                           │
    │    isActive                           │
    └───────────────────────────────────────┘

    ┌──────────────────────────────────┐
    │ ComponentPointCoverage           │
    ├──────────────────────────────────┤
    │ PK: coverageId                   │
    │ FK: componentId                  │
    │ ──────────────────────────────  │
    │    totalInspectionPoints         │
    │    mappedPoints                  │
    │    coveragePercentage            │
    │    lastUpdated                   │
    └──────────────────────────────────┘
```

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                  INSPECTION TEMPLATE & POINTS DOMAIN                          │
└──────────────────────────────────────────────────────────────────────────────┘

    ┌────────────────────────────────┐
    │     ITPTemplate                │
    ├────────────────────────────────┤
    │ PK: templateId                 │
    │ ────────────────────────────  │
    │    templateCode                │
    │    title                       │
    │    revisionNo                  │
    │    applicableAssetType         │
    │    standardReference           │
    │    approvedBy                  │
    │    createdAt                   │
    │    isActive                    │
    │    description                 │
    └──────────┬──────────────────────┘
               │ 1:N
               ↓
    ┌────────────────────────────────────────┐
    │    InspectionPoint                     │
    ├────────────────────────────────────────┤
    │ PK: pointId                            │
    │ FK: templateId                         │
    │ FK: componentId (Optional)             │
    │ ────────────────────────────────────  │
    │    sequenceOrder                       │
    │    pointDescription                    │
    │    componentCategory                   │
    │    inspectionMethod (Visual|Ultrasonic)
    │    isMandatory                         │
    │    pointThreshold                      │
    │    applicableToComponent               │
    │    applicableToAsset                   │
    └──────────┬───────────────────┬─────────┘
               │ 1:N              │
               ↓                  ↓
    ┌────────────────────┐  ┌──────────────────────────┐
    │  ControlPoint      │  │ ComponentInspectionPoint │
    ├────────────────────┤  ├──────────────────────────┤
    │ PK: controlId      │  │ PK: mappingId            │
    │ FK: pointId        │  │ FK: pointId              │
    │ ────────────────  │  │ FK: componentId          │
    │    pointType       │  │ FK: subComponentId       │
    │    description     │  │ ──────────────────────  │
    │    criteria        │  │    applicableToComp..   │
    │    frequencyDays   │  │    applicableToSubComp..│
    └────────────────────┘  │    inspectionSequence   │
                            │    priority             │
                            │    createdAt, updatedAt │
                            └──────────────────────────┘
```

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                INSPECTION EXECUTION & RESULTS DOMAIN                          │
└──────────────────────────────────────────────────────────────────────────────┘

    ┌────────────────────────────────┐
    │   InspectionJob                │
    ├────────────────────────────────┤
    │ PK: jobId                      │
    │ FK: assetId                    │
    │ FK: templateId                 │
    │ FK: inspectorId (User)         │
    │ ────────────────────────────  │
    │    jobType                     │
    │    startDate                   │
    │    endDate                     │
    │    status (Draft|In Prog|...)  │
    │    notes                       │
    └──────────┬──────────────────────┘
               │ 1:N
               ↓
    ┌──────────────────────────────────────┐
    │   InspectionResult                   │
    ├──────────────────────────────────────┤
    │ PK: resultId                         │
    │ FK: jobId                            │
    │ FK: pointId                          │
    │ FK: controlId (Optional)             │
    │ FK: inspectorId (User)               │
    │ ────────────────────────────────── │
    │    result (Pass|Fail|N/A)           │
    │    observedValue                    │
    │    expectedValue                    │
    │    evidence                         │
    │    inspectorNotes                   │
    │    inspectionDate                   │
    └────────────┬────────────────────────┘
                 │ 1:N
                 ↓
    ┌─────────────────────────────────┐
    │  IssueNCR (Non-Conformance)     │
    ├─────────────────────────────────┤
    │ PK: issueId                     │
    │ FK: jobId                       │
    │ FK: resultId                    │
    │ ────────────────────────────── │
    │    issueType = 'NCR'            │
    │    title                        │
    │    description                  │
    │    severity                     │
    │    status                       │
    │    assignedTo                   │
    │    createdBy, createdAt         │
    │    dueDate                      │
    │    resolution                   │
    └─────────────────────────────────┘
```

```
┌──────────────────────────────────────────────────────────────────────────────┐
│              PARAMETER INDICATORS & THRESHOLDS DOMAIN                         │
└──────────────────────────────────────────────────────────────────────────────┘

    ┌─────────────────────────────────┐
    │  ParameterIndicator             │
    ├─────────────────────────────────┤
    │ PK: indicatorId                 │
    │ ────────────────────────────── │
    │    indicatorName                │
    │    indicatorType (Temp|Press..) │
    │    unit (kW, bar, Hz, %)        │
    │    description                  │
    │    isNumeric                    │
    │    createdAt                    │
    └──────────┬──────────────────────┘
               │ 1:N
               ↓
    ┌──────────────────────────────┐
    │ ThresholdRequirement         │
    ├──────────────────────────────┤
    │ PK: thresholdId              │
    │ FK: indicatorId              │
    │ ──────────────────────────  │
    │    minimumValue              │
    │    maximumValue              │
    │    warningMin, warningMax    │
    │    criticalMin, criticalMax  │
    │    acceptableTolerance       │
    │    unit                      │
    │    description               │
    │    isActive                  │
    │    createdAt, updatedAt      │
    └──────────┬────────────────────┘
               │ 1:N (M:N via ComponentParameter)
               ↓
    ┌─────────────────────────────────────────┐
    │    ComponentParameter                   │
    ├─────────────────────────────────────────┤
    │ PK: componentParamId                    │
    │ FK: componentId (ComponentMaster)       │
    │ FK: pointId (InspectionPoint)           │
    │ FK: indicatorId (ParameterIndicator)    │
    │ FK: thresholdId (ThresholdRequirement)  │
    │ ────────────────────────────────────── │
    │    sequence                             │
    │    isRequired                           │
    │    isActive                             │
    │    notes                                │
    │    createdAt, updatedAt                 │
    └─────────────────────────────────────────┘
```

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                         ISSUE TRACKING DOMAIN                                │
└──────────────────────────────────────────────────────────────────────────────┘

    From InspectionResult (1:N) ──→ IssueNCR (shown above)

    ┌──────────────────────────────┐
    │  IssuePunchList              │
    ├──────────────────────────────┤
    │ PK: issueId                  │
    │ FK: jobId                    │
    │ ──────────────────────────  │
    │    title                     │
    │    description               │
    │    status (Open|In Prog|...) │
    │    assignedTo                │
    │    createdBy, createdAt      │
    │    dueDate                   │
    └──────────────────────────────┘

    From Asset (1:N) ──→

    ┌──────────────────────────────────┐
    │  IssueDefect                     │
    ├──────────────────────────────────┤
    │ PK: issueId                      │
    │ FK: assetId                      │
    │ ──────────────────────────────  │
    │    title                         │
    │    description                   │
    │    defectType (Crack|Leak|...)   │
    │    severity (Critical|High|...)  │
    │    status (Open|In Review|...)   │
    │    assignedTo                    │
    │    createdBy, createdAt          │
    │    dueDate                       │
    │    resolution                    │
    └──────────────────────────────────┘
```

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                           USER DOMAIN                                         │
└──────────────────────────────────────────────────────────────────────────────┘

    ┌─────────────────────────────┐
    │       User                  │
    ├─────────────────────────────┤
    │ PK: userId                  │
    │ ────────────────────────── │
    │    firstName                │
    │    lastName                 │
    │    email                    │
    │    role (Admin|Inspector|..│
    │    isActive                 │
    └─────────────────────────────┘
             ↑ Referenced from:
             │ - InspectionJob (inspectorId)
             │ - InspectionResult (inspectorId)
             │ - IssueNCR (assignedTo, createdBy)
             │ - IssuePunchList (assignedTo, createdBy)
             │ - IssueDefect (assignedTo, createdBy)
```

---

## Entity Relationship Summary

### One-to-Many (1:N) Relationships (18)

| Parent | Child | Relationship |
|--------|-------|--------------|
| TerminalLocation | Asset | 1 location has N assets |
| Asset | AssetSpecs | 1 asset has 1 spec (1:1) |
| Asset | ComponentMaster | 1 asset has N components |
| ComponentMaster | ComponentMaster | 1 component has N sub-components |
| ITPTemplate | InspectionPoint | 1 template has N points |
| InspectionPoint | ControlPoint | 1 point has N controls |
| InspectionPoint | ComponentInspectionPoint | 1 point maps to N components |
| InspectionJob | InspectionResult | 1 job has N results |
| InspectionResult | IssueNCR | 1 result may create N issues |
| ParameterIndicator | ThresholdRequirement | 1 indicator has N thresholds |
| ComponentMaster | ComponentPointCoverage | 1 component has 1 coverage record |
| Asset | IssueDefect | 1 asset may have N defects |
| InspectionJob | IssuePunchList | 1 job may have N punch list items |

### One-to-One (1:1) Relationships (2)

| Entity A | Entity B | Relationship |
|----------|----------|--------------|
| Asset | AssetSpecs | 1 asset has exactly 1 specifications record |
| ComponentMaster | ComponentPointCoverage | 1 component has exactly 1 coverage record |

### Many-to-Many (M:N) Relationships (3)

| Entity A | Bridge | Entity B | Relationship |
|----------|--------|----------|--------------|
| ComponentMaster | ComponentParameter | ParameterIndicator | Components have N parameters with N thresholds |
| ComponentMaster | ComponentParameter | InspectionPoint | Components are inspected on N points |
| ComponentMaster | ComponentInspectionPoint | InspectionPoint | Components map to N inspection points |

### Reference Relationships (5)

| Entity | References | Purpose |
|--------|-----------|---------|
| InspectionJob | User (inspectorId) | Tracks who inspects |
| InspectionResult | User (inspectorId) | Tracks result recorder |
| IssueNCR | User (assignedTo, createdBy) | Issue assignment & tracking |
| IssuePunchList | User (assignedTo, createdBy) | Task assignment |
| IssueDefect | User (assignedTo, createdBy) | Defect assignment |

---

## Data Dependencies & Build Order

When creating new records, follow this order:

1. **TerminalLocation** - Base location data
2. **Asset** - Assets at locations
3. **AssetSpecs** - Asset specifications
4. **ComponentMaster** - Asset components
5. **ComponentHierarchy** - Component relationships
6. **ComponentPointCoverage** - Coverage tracking
7. **ITPTemplate** - Inspection templates
8. **InspectionPoint** - Points within templates
9. **ControlPoint** - Controls for points
10. **ParameterIndicator** - Measurable parameters
11. **ThresholdRequirement** - Threshold ranges
12. **ComponentParameter** - Component-parameter mapping
13. **ComponentInspectionPoint** - Component-point mapping
14. **InspectionJob** - Inspection execution
15. **InspectionResult** - Inspection outcomes
16. **IssueNCR** - Non-conformance issues
17. **IssuePunchList** - Punch list items
18. **IssueDefect** - Defect tracking
19. **User** - System users (can be standalone)
20. **ComponentInspectionConfig** - Comprehensive view (computed)

---

## Entity Statistics

| Metric | Count |
|--------|-------|
| **Total Entities** | 20 |
| **Total Fields** | 200+ |
| **Primary Keys** | 20 |
| **Foreign Keys** | 28 |
| **1:N Relationships** | 18 |
| **1:1 Relationships** | 2 |
| **M:N Relationships** | 3 |
| **Reference Relationships** | 5 |
| **Enum Fields** | 15+ |
| **Optional Fields** | 60+ |
| **Date/Timestamp Fields** | 25+ |

---

## Access Patterns & Queries

### Asset Inspection Complete View
```sql
-- Get asset with all components, inspection points, and parameters
SELECT 
    a.assetId, a.assetCode, a.assetType,
    c.componentId, c.componentName, c.criticality,
    ip.pointId, ip.pointDescription, ip.inspectionMethod,
    pi.indicatorId, pi.indicatorName,
    tr.minimumValue, tr.maximumValue, tr.warningMin, tr.warningMax
FROM Asset a
LEFT JOIN ComponentMaster c ON a.assetId = c.assetId
LEFT JOIN ComponentInspectionPoint cip ON c.componentId = cip.componentId
LEFT JOIN InspectionPoint ip ON cip.pointId = ip.pointId
LEFT JOIN ComponentParameter cp ON c.componentId = cp.componentId
LEFT JOIN ParameterIndicator pi ON cp.indicatorId = pi.indicatorId
LEFT JOIN ThresholdRequirement tr ON cp.thresholdId = tr.thresholdId
WHERE a.assetId = ?
```

### Inspection Results with Issues
```sql
-- Get inspection results and linked issues
SELECT 
    j.jobId, j.startDate, j.status,
    ir.resultId, ir.result, ir.observedValue,
    ncr.issueId, ncr.severity, ncr.status
FROM InspectionJob j
LEFT JOIN InspectionResult ir ON j.jobId = ir.jobId
LEFT JOIN IssueNCR ncr ON ir.resultId = ncr.resultId
WHERE j.jobId = ?
ORDER BY ir.pointId, ncr.severity DESC
```

### Component Coverage Analysis
```sql
-- Analyze inspection point coverage for components
SELECT 
    c.componentId, c.componentName,
    cpc.totalInspectionPoints,
    cpc.mappedPoints,
    cpc.coveragePercentage,
    (cpc.totalInspectionPoints - cpc.mappedPoints) as unmappedPoints
FROM ComponentMaster c
LEFT JOIN ComponentPointCoverage cpc ON c.componentId = cpc.componentId
WHERE c.assetId = ?
ORDER BY cpc.coveragePercentage ASC
```
