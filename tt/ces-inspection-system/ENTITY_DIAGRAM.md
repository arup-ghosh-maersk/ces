# CES (Component Inspection System) - Entity Diagram

## Entity Relationship Overview

```
┌─────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                         CES ENTITY RELATIONSHIP DIAGRAM                                                     │
└─────────────────────────────────────────────────────────────────────────────────────────────────────────────┘

                                    ┌────────────────────────┐
                                    │  TerminalLocation      │
                                    ├────────────────────────┤
                                    │ PK: locationId         │
                                    │    locationName        │
                                    │    terminalCode        │
                                    │    gpsCoordinates?     │
                                    └────────────────────────┘
                                            │ 1
                                            │
                                            │ * (1:N)
                                            │
                    ┌───────────────────────┴──────────────────────┐
                    │                                              │
                    ▼ 1                                            ▼ 1
        ┌──────────────────────┐                      ┌──────────────────────────┐
        │      Asset           │                      │   ITPTemplate            │
        ├──────────────────────┤                      ├──────────────────────────┤
        │ PK: assetId          │                      │ PK: templateId           │
        │ FK: locationId       │                      │    templateCode          │
        │    assetCode         │                      │    title                 │
        │    assetType         │                      │    revisionNo            │
        │    description       │                      │    applicableAssetType   │
        │    manufacturer?     │                      │    standardReference     │
        │    modelNumber?      │                      │    approvedBy?           │
        │    serialNumber?     │                      │    createdAt             │
        │    acquisitionDate?  │                      │    isActive              │
        │    warrantyExpiry?   │                      │    description?          │
        │    diagramUrl?       │                      └──────────────────────────┘
        └──────────────────────┘                               │ 1
                    │ 1                                        │
                    │                                          │ * (1:N)
                    │                                          │
                    │ * (1:N)                                  ▼
                    │                          ┌────────────────────────────────┐
                    │                          │   InspectionPoint              │
                    │                          ├────────────────────────────────┤
                    │                          │ PK: pointId                    │
                    │                          │ FK: templateId                 │
                    │                          │ FK: componentId?               │
                    │                          │    sequenceOrder               │
                    │                          │    pointDescription            │
                    │                          │    componentCategory           │
                    │                          │    inspectionMethod            │
                    │                          │    isMandatory                 │
                    │                          │    pointThreshold?             │
                    │                          │    applicableToComponent       │
                    │                          │    applicableToAsset           │
                    │                          └────────────────────────────────┘
                    │                                    │ 1
                    │                                    │
                    │                                    │ * (1:N)
                    │                                    │
                    ▼                                    ▼
        ┌──────────────────────────┐        ┌────────────────────────────┐
        │   ComponentMaster        │        │    ControlPoint            │
        ├──────────────────────────┤        ├────────────────────────────┤
        │ PK: componentId          │        │ PK: controlId              │
        │ FK: assetId              │        │ FK: pointId                │
        │    componentCode         │        │    pointType               │
        │    componentName         │        │    description             │
        │    assetType             │        │    criteria                │
        │    category              │        │    frequencyDays?          │
        │    description?          │        └────────────────────────────┘
        │    manufacturer?         │
        │    modelNumber?          │
        │    serialNumber?         │
        │    warrantyExpiry?       │
        │    criticality           │
        │    parentComponentId?    │
        │    specifications?       │
        │    maintenanceIntervalDays? │
        │    lastMaintenanceDate?  │
        │    nextMaintenanceDate?  │
        │    createdAt             │
        │    updatedAt?            │
        │    isActive              │
        │    diagramUrl?           │
        └──────────────────────────┘
                    │ 1
                    │
                    │ * (1:N)
                    │
        ┌───────────┴────────────────────────────────────────────┐
        │                                                        │
        ▼                                                        ▼
┌──────────────────────────┐            ┌──────────────────────────────────┐
│  ComponentParameter      │            │  ComponentInspectionPoint        │
├──────────────────────────┤            ├──────────────────────────────────┤
│ PK: componentParamId     │            │ PK: mappingId                    │
│ FK: componentId          │            │ FK: pointId                      │
│ FK: pointId              │            │ FK: componentId                  │
│ FK: indicatorId          │            │ FK: subComponentId?              │
│ FK: thresholdId          │            │    applicableToComponent         │
│    sequence              │            │    applicableToSubComponent      │
│    isRequired            │            │    inspectionSequence            │
│    isActive              │            │    priority                      │
│    notes?                │            │    createdAt                     │
│    createdAt             │            │    updatedAt?                    │
│    updatedAt?            │            └──────────────────────────────────┘
└──────────────────────────┘
        │ * (M:N)
        │
        ├─────────────────────────┐
        │                         │
        ▼                         ▼
┌──────────────────────┐  ┌──────────────────────────────┐
│ ParameterIndicator   │  │ ThresholdRequirement         │
├──────────────────────┤  ├──────────────────────────────┤
│ PK: indicatorId      │  │ PK: thresholdId              │
│    indicatorName     │  │ FK: indicatorId              │
│    indicatorType     │  │    minimumValue?             │
│    unit              │  │    maximumValue?             │
│    description?      │  │    warningMin?               │
│    isNumeric         │  │    warningMax?               │
│    createdAt         │  │    criticalMin?              │
└──────────────────────┘  │    criticalMax?              │
                          │    acceptableTolerance?      │
                          │    unit                      │
                          │    description?              │
                          │    isActive                  │
                          │    createdAt                 │
                          │    updatedAt?                │
                          └──────────────────────────────┘

        ┌─────────────────────────────────────────────────────────┐
        │                                                         │
        ▼ 1                                                       ▼ 1
┌──────────────────────┐                          ┌──────────────────────┐
│   InspectionJob      │                          │   User               │
├──────────────────────┤                          ├──────────────────────┤
│ PK: jobId            │                          │ PK: userId           │
│ FK: assetId          │                          │    firstName          │
│ FK: templateId       │                          │    lastName           │
│ FK: inspectorId      │                          │    email              │
│    jobType           │                          │    role               │
│    startDate         │                          │    isActive           │
│    endDate?          │                          └──────────────────────┘
│    status            │
│    notes?            │
└──────────────────────┘
        │ 1
        │
        │ * (1:N)
        │
        ▼
┌──────────────────────────┐
│  InspectionResult        │
├──────────────────────────┤
│ PK: resultId             │
│ FK: jobId                │
│ FK: pointId              │
│ FK: controlId?           │
│ FK: inspectorId          │
│    result                │
│    observedValue?        │
│    expectedValue?        │
│    evidence?             │
│    inspectorNotes?       │
│    inspectionDate        │
└──────────────────────────┘
        │ 1
        │
        │ * (1:N)
        │
        ├─────────────────────────────────────┐
        │                                     │
        ▼                                     ▼
┌──────────────────────┐          ┌──────────────────────┐
│   IssueNCR           │          │  IssuePunchList      │
├──────────────────────┤          ├──────────────────────┤
│ PK: issueId          │          │ PK: issueId          │
│ FK: jobId            │          │ FK: jobId            │
│ FK: resultId         │          │    title             │
│    issueType: 'NCR'  │          │    description       │
│    title             │          │    status            │
│    description       │          │    assignedTo?       │
│    severity          │          │    createdBy         │
│    status            │          │    createdAt         │
│    assignedTo?       │          │    dueDate?          │
│    createdBy         │          └──────────────────────┘
│    createdAt         │
│    dueDate?          │
│    resolution?       │
└──────────────────────┘

┌──────────────────────────┐
│   IssueDefect            │
├──────────────────────────┤
│ PK: issueId              │
│ FK: assetId              │
│    title                 │
│    description           │
│    defectType            │
│    severity              │
│    status                │
│    assignedTo?           │
│    createdBy             │
│    createdAt             │
│    dueDate?              │
│    resolution?           │
└──────────────────────────┘

┌──────────────────────────┐
│    AssetSpecs            │
├──────────────────────────┤
│ PK: specId               │
│ FK: assetId              │
│    operatingPressure?    │
│    liftCapacity?         │
│    maxSpeed?             │
│    trackGauge?           │
│    motorPower?           │
│    cycleTime?            │
│    boomLength?           │
│    spreadsheetCapacity?  │
│    wheelDiameter?        │
│    tireCondition?        │
│    maintenanceHistory?   │
│    lastServiceDate?      │
│    nextServiceDate?      │
│    certifications?       │
│    createdAt             │
│    updatedAt?            │
└──────────────────────────┘

┌──────────────────────────┐
│  ComponentHierarchy      │
├──────────────────────────┤
│ PK: hierarchyId          │
│ FK: parentComponentId    │
│ FK: childComponentId     │
│    relationshipType      │
│    sequence              │
│    isActive              │
└──────────────────────────┘

┌──────────────────────────────┐
│  ComponentPointCoverage       │
├──────────────────────────────┤
│ PK: coverageId               │
│ FK: componentId              │
│    totalInspectionPoints     │
│    mappedPoints              │
│    coveragePercentage        │
│    lastUpdated               │
└──────────────────────────────┘

┌──────────────────────────────────────┐
│  ComponentInspectionConfig           │
├──────────────────────────────────────┤
│ (Composite View - Not a Table)       │
│                                      │
│ Combines:                            │
│  - ComponentMaster                   │
│  - InspectionPoint                   │
│  - ComponentParameter                │
│  - ParameterIndicator                │
│  - ThresholdRequirement              │
│                                      │
│ Read-only view for UI consumption    │
└──────────────────────────────────────┘
```

---

## Entity Relationship Details

### Core Organizational Hierarchy

| **Entity** | **Primary Key** | **Foreign Keys** | **Cardinality** | **Purpose** |
|---|---|---|---|---|
| **TerminalLocation** | locationId | — | 1 | Geographic location of operations |
| **Asset** | assetId | locationId | 1:N | Equipment at locations (STS, RTG, RMG) |
| **ComponentMaster** | componentId | assetId, parentComponentId | 1:N | Parts and sub-assemblies of assets |
| **User** | userId | — | 1 | System users and roles |

### Inspection Templates & Configuration

| **Entity** | **Primary Key** | **Foreign Keys** | **Cardinality** | **Purpose** |
|---|---|---|---|---|
| **ITPTemplate** | templateId | — | 1 | Inspection procedure templates |
| **InspectionPoint** | pointId | templateId, componentId | 1:N | Specific inspection checkpoints |
| **ControlPoint** | controlId | pointId | 1:N | Hold/Warning/Mandatory rules |
| **ComponentInspectionPoint** | mappingId | pointId, componentId | M:N | Maps points to components |

### Parameters & Thresholds

| **Entity** | **Primary Key** | **Foreign Keys** | **Cardinality** | **Purpose** |
|---|---|---|---|---|
| **ParameterIndicator** | indicatorId | — | 1 | Measurable inspection parameters |
| **ThresholdRequirement** | thresholdId | indicatorId | 1:N | Acceptable ranges and limits |
| **ComponentParameter** | componentParamId | componentId, pointId, indicatorId, thresholdId | M:N | Associates all three |

### Job Execution & Results

| **Entity** | **Primary Key** | **Foreign Keys** | **Cardinality** | **Purpose** |
|---|---|---|---|---|
| **InspectionJob** | jobId | assetId, templateId, inspectorId | 1:N | Inspection work orders |
| **InspectionResult** | resultId | jobId, pointId, controlId, inspectorId | 1:N | Individual inspection findings |
| **IssueNCR** | issueId | jobId, resultId | 1:N | Non-conformance reports |
| **IssuePunchList** | issueId | jobId | 1:N | Work items from inspections |
| **IssueDefect** | issueId | assetId | 1:N | Defects discovered |

### Support & Analytics

| **Entity** | **Primary Key** | **Foreign Keys** | **Cardinality** | **Purpose** |
|---|---|---|---|---|
| **AssetSpecs** | specId | assetId | 1:1 | Technical specifications |
| **ComponentHierarchy** | hierarchyId | parentComponentId, childComponentId | M:N | Component relationships |
| **ComponentPointCoverage** | coverageId | componentId | 1:1 | Coverage metrics |

---

## Data Flow & Relationships

### 1. **Template-Driven Inspection Flow**
```
ITPTemplate → InspectionPoint → ControlPoint
                    ↓
        ComponentInspectionPoint
                    ↓
        InspectionJob → InspectionResult
```

### 2. **Component Configuration Flow**
```
ComponentMaster → ComponentParameter ← ParameterIndicator
                        ↓                      ↓
                  ThresholdRequirement   (Unit definitions)
```

### 3. **Issue Tracking Flow**
```
InspectionResult → IssueNCR (for failures)
InspectionJob → IssuePunchList (for work items)
Asset → IssueDefect (for defects found)
```

### 4. **Inspection Execution**
```
User (Inspector) → InspectionJob → InspectionResult → Issue Tracking
                        ↓
                     Asset
                        ↓
                   ComponentMaster
```

---

## Key Relationships Explained

### One-to-Many (1:N) Relationships

- **TerminalLocation → Asset**: One location has many assets
- **Asset → ComponentMaster**: One asset has many components
- **ITPTemplate → InspectionPoint**: One template has many inspection points
- **InspectionPoint → ControlPoint**: One point may have multiple control rules
- **InspectionJob → InspectionResult**: One job produces many results
- **InspectionResult → Issue Tracking**: One result can create multiple issues
- **ParameterIndicator → ThresholdRequirement**: One indicator may have multiple threshold sets

### Many-to-Many (M:N) Relationships

- **InspectionPoint ↔ ComponentMaster** (via ComponentInspectionPoint): Points apply to multiple components; components have multiple points
- **ParameterIndicator ↔ ComponentParameter**: Indicators used across many components; components use many indicators
- **ComponentMaster ↔ ComponentMaster** (via ComponentHierarchy): Components can be parents/children of other components

### One-to-One (1:1) Relationships

- **Asset ↔ AssetSpecs**: One asset has one specs record
- **ComponentMaster ↔ ComponentPointCoverage**: One component has one coverage record

---

## Data Type Constraints

### Enums

| **Field** | **Allowed Values** | **Entity** |
|---|---|---|
| `assetType` | STS, RTG, RMG | Asset, ComponentMaster |
| `category` | Structural, Electrical, Mechanical, Hydraulic, Software, Other | ComponentMaster |
| `criticality` | Critical, High, Medium, Low | ComponentMaster, ComponentInspectionPoint |
| `inspectionMethod` | Visual, Ultrasonic, Functional Test, NDT | InspectionPoint |
| `pointType` | H, W, M, R | ControlPoint |
| `jobType` | Construction, Commissioning, Routine, Special | InspectionJob |
| `status` (Job) | Draft, In Progress, Completed, On Hold | InspectionJob |
| `result` | Pass, Fail, N/A | InspectionResult |
| `issueType` | NCR | IssueNCR |
| `defectType` | Fatigue Crack, Oil Leak, Electrical Fault, Mechanical Damage, Other | IssueDefect |
| `severity` | Critical, High, Medium, Low | IssueNCR, IssueDefect |
| `status` (Issue) | Open, In Review, Resolved, Closed | IssueNCR, IssueDefect |
| `status` (PunchList) | Open, In Progress, Completed | IssuePunchList |
| `role` | Admin, Inspector, Approver, Viewer | User |
| `indicatorType` | Temperature, Pressure, Vibration, Noise, Visual, Electrical, Mechanical, Chemical, Other | ParameterIndicator |
| `relationshipType` | Assembly, SubAssembly, Part | ComponentHierarchy |

### Optional Fields (Nullable)

Fields marked with `?` are optional:
- **Asset**: manufacturer, modelNumber, serialNumber, acquisitionDate, warrantyExpiry, diagramUrl
- **ITPTemplate**: approvedBy, description
- **InspectionPoint**: componentId, pointThreshold
- **ComponentMaster**: description, manufacturer, modelNumber, serialNumber, warrantyExpiry, parentComponentId, specifications, maintenanceIntervalDays, lastMaintenanceDate, nextMaintenanceDate, diagramUrl
- **ComponentParameter**: notes, updatedAt
- **InspectionJob**: endDate, notes
- **InspectionResult**: controlId, observedValue, expectedValue, evidence, inspectorNotes
- **Issue entities**: assignedTo, resolution, dueDate
- **ThresholdRequirement**: minimumValue, maximumValue, warningMin, warningMax, criticalMin, criticalMax, acceptableTolerance, description, updatedAt
- **ParameterIndicator**: description
- **ComponentInspectionPoint**: subComponentId, updatedAt
- **TerminalLocation**: gpsCoordinates

---

## Composite View: ComponentInspectionConfig

This is a **read-only composite view** (not a table) used by the UI to display complete inspection configurations:

**Combines data from:**
- ComponentMaster
- InspectionPoint
- ComponentParameter
- ParameterIndicator
- ThresholdRequirement

**Used for:**
- Displaying full inspection details in the UI
- Validation before inspection execution
- Configuration display in the Parameters tab

---

## Database Implementation Notes

### Primary Keys
- All entities use string type for IDs (typically UUIDs or business keys)
- Pattern: `{Entity}Id` or custom (e.g., `specId`, `coverageId`, `hierarchyId`)

### Foreign Keys
- Defined using `FK: {EntityId}` pattern
- Support referential integrity constraints
- Optional FKs (marked with `?`) support NULL values

### Timestamps
- `createdAt`: Required on all transactional entities
- `updatedAt`: Optional on entities that may be modified

### Audit Trail
- User tracking: `createdBy`, `assignedTo`, `inspectorId`
- Status tracking: `status` field on jobs and issues
- Date tracking: `inspectionDate`, `dueDate`, `lastMaintenanceDate`, etc.

---

## Dependency Summary

```
Required Dependencies (Hard Links):
- Asset → TerminalLocation (must exist)
- ComponentMaster → Asset (must exist)
- InspectionPoint → ITPTemplate (must exist)
- InspectionJob → Asset, ITPTemplate, User (must exist)
- InspectionResult → InspectionJob, InspectionPoint, User (must exist)
- ComponentParameter → ComponentMaster, InspectionPoint, ParameterIndicator, ThresholdRequirement
- ThresholdRequirement → ParameterIndicator (must exist)

Optional Dependencies:
- InspectionPoint → ComponentMaster (can be null for asset-level points)
- InspectionResult → ControlPoint (can be null)
- ComponentMaster → ComponentMaster (parent reference, can be null)
- ComponentInspectionPoint → ComponentMaster (subComponent, can be null)
```

---

## Generated: January 17, 2026
**Version**: 1.0  
**Status**: Complete  
**Source**: CES index.ts models file
