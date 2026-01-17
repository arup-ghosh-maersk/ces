```mermaid
erDiagram
    TERMINAL_LOCATION ||--o{ ASSET : "has"
    ASSET ||--|| ASSET_SPECS : "has_specs"
    ASSET ||--o{ COMPONENT_MASTER : "contains"
    ASSET ||--o{ ISSUE_DEFECT : "has"
    
    COMPONENT_MASTER ||--o{ COMPONENT_MASTER : "has_subassemblies"
    COMPONENT_MASTER ||--|| COMPONENT_POINT_COVERAGE : "has_coverage"
    COMPONENT_MASTER ||--o{ COMPONENT_PARAMETER : "mapped_params"
    
    COMPONENT_HIERARCHY }o--|| COMPONENT_MASTER : "parent"
    COMPONENT_HIERARCHY }o--|| COMPONENT_MASTER : "child"
    
    ITP_TEMPLATE ||--o{ INSPECTION_POINT : "has_points"
    INSPECTION_POINT ||--o{ CONTROL_POINT : "has_controls"
    INSPECTION_POINT ||--o{ COMPONENT_INSPECTION_POINT : "maps_to_components"
    
    INSPECTION_JOB }o--|| ASSET : "inspects"
    INSPECTION_JOB }o--|| ITP_TEMPLATE : "uses_template"
    INSPECTION_JOB }o--|| USER : "assigned_to"
    INSPECTION_JOB ||--o{ INSPECTION_RESULT : "produces"
    INSPECTION_JOB ||--o{ ISSUE_PUNCH_LIST : "creates_tasks"
    
    INSPECTION_RESULT }o--|| INSPECTION_POINT : "for_point"
    INSPECTION_RESULT }o--|| CONTROL_POINT : "applies_control"
    INSPECTION_RESULT }o--|| USER : "recorded_by"
    INSPECTION_RESULT ||--o{ ISSUE_NCR : "creates_issues"
    
    PARAMETER_INDICATOR ||--o{ THRESHOLD_REQUIREMENT : "has_thresholds"
    THRESHOLD_REQUIREMENT ||--o{ COMPONENT_PARAMETER : "defines"
    
    COMPONENT_PARAMETER }o--|| COMPONENT_MASTER : "for_component"
    COMPONENT_PARAMETER }o--|| INSPECTION_POINT : "for_point"
    COMPONENT_PARAMETER }o--|| PARAMETER_INDICATOR : "uses_indicator"
    COMPONENT_PARAMETER }o--|| THRESHOLD_REQUIREMENT : "uses_threshold"
    
    COMPONENT_INSPECTION_POINT }o--|| INSPECTION_POINT : "references"
    COMPONENT_INSPECTION_POINT }o--|| COMPONENT_MASTER : "for_component"
    
    ISSUE_NCR }o--|| INSPECTION_JOB : "from_job"
    ISSUE_NCR }o--|| INSPECTION_RESULT : "from_result"
    ISSUE_NCR }o--|| USER : "assigned_to"
    ISSUE_NCR }o--|| USER : "created_by"
    
    ISSUE_PUNCH_LIST }o--|| INSPECTION_JOB : "from_job"
    ISSUE_PUNCH_LIST }o--|| USER : "assigned_to"
    ISSUE_PUNCH_LIST }o--|| USER : "created_by"
    
    ISSUE_DEFECT }o--|| ASSET : "for_asset"
    ISSUE_DEFECT }o--|| USER : "assigned_to"
    ISSUE_DEFECT }o--|| USER : "created_by"

    TERMINAL_LOCATION : string locationId PK
    TERMINAL_LOCATION : string locationName
    TERMINAL_LOCATION : string terminalCode
    TERMINAL_LOCATION : string gpsCoordinates

    ASSET : string assetId PK
    ASSET : string locationId FK
    ASSET : string assetCode
    ASSET : enum assetType "STS|RTG|RMG"
    ASSET : string description
    ASSET : string manufacturer
    ASSET : string modelNumber
    ASSET : string serialNumber
    ASSET : date acquisitionDate
    ASSET : date warrantyExpiry
    ASSET : string diagramUrl

    ASSET_SPECS : string specId PK
    ASSET_SPECS : string assetId FK
    ASSET_SPECS : number operatingPressure
    ASSET_SPECS : number liftCapacity
    ASSET_SPECS : number maxSpeed
    ASSET_SPECS : number trackGauge
    ASSET_SPECS : number motorPower
    ASSET_SPECS : number cycleTime
    ASSET_SPECS : number boomLength
    ASSET_SPECS : date lastServiceDate
    ASSET_SPECS : date nextServiceDate

    COMPONENT_MASTER : string componentId PK
    COMPONENT_MASTER : string assetId FK
    COMPONENT_MASTER : string parentComponentId FK
    COMPONENT_MASTER : string componentCode
    COMPONENT_MASTER : string componentName
    COMPONENT_MASTER : enum assetType "STS|RTG|RMG"
    COMPONENT_MASTER : enum category "Structural|Electrical|Mechanical|Hydraulic|Software|Other"
    COMPONENT_MASTER : enum criticality "Critical|High|Medium|Low"
    COMPONENT_MASTER : number maintenanceIntervalDays
    COMPONENT_MASTER : date lastMaintenanceDate
    COMPONENT_MASTER : date nextMaintenanceDate
    COMPONENT_MASTER : string diagramUrl
    COMPONENT_MASTER : boolean isActive

    COMPONENT_HIERARCHY : string hierarchyId PK
    COMPONENT_HIERARCHY : string parentComponentId FK
    COMPONENT_HIERARCHY : string childComponentId FK
    COMPONENT_HIERARCHY : enum relationshipType "Assembly|SubAssembly|Part"
    COMPONENT_HIERARCHY : number sequence
    COMPONENT_HIERARCHY : boolean isActive

    COMPONENT_POINT_COVERAGE : string coverageId PK
    COMPONENT_POINT_COVERAGE : string componentId FK
    COMPONENT_POINT_COVERAGE : number totalInspectionPoints
    COMPONENT_POINT_COVERAGE : number mappedPoints
    COMPONENT_POINT_COVERAGE : number coveragePercentage
    COMPONENT_POINT_COVERAGE : date lastUpdated

    ITP_TEMPLATE : string templateId PK
    ITP_TEMPLATE : string templateCode
    ITP_TEMPLATE : string title
    ITP_TEMPLATE : number revisionNo
    ITP_TEMPLATE : enum applicableAssetType "STS|RTG|RMG"
    ITP_TEMPLATE : string standardReference
    ITP_TEMPLATE : string approvedBy
    ITP_TEMPLATE : date createdAt
    ITP_TEMPLATE : boolean isActive

    INSPECTION_POINT : string pointId PK
    INSPECTION_POINT : string templateId FK
    INSPECTION_POINT : string componentId FK
    INSPECTION_POINT : number sequenceOrder
    INSPECTION_POINT : string pointDescription
    INSPECTION_POINT : string componentCategory
    INSPECTION_POINT : enum inspectionMethod "Visual|Ultrasonic|FunctionalTest|NDT"
    INSPECTION_POINT : boolean isMandatory
    INSPECTION_POINT : string pointThreshold
    INSPECTION_POINT : boolean applicableToComponent
    INSPECTION_POINT : boolean applicableToAsset

    CONTROL_POINT : string controlId PK
    CONTROL_POINT : string pointId FK
    CONTROL_POINT : enum pointType "H|W|M|R"
    CONTROL_POINT : string description
    CONTROL_POINT : string criteria
    CONTROL_POINT : number frequencyDays

    INSPECTION_JOB : string jobId PK
    INSPECTION_JOB : string assetId FK
    INSPECTION_JOB : string templateId FK
    INSPECTION_JOB : string inspectorId FK
    INSPECTION_JOB : enum jobType "Construction|Commissioning|Routine|Special"
    INSPECTION_JOB : date startDate
    INSPECTION_JOB : date endDate
    INSPECTION_JOB : enum status "Draft|InProgress|Completed|OnHold"

    INSPECTION_RESULT : string resultId PK
    INSPECTION_RESULT : string jobId FK
    INSPECTION_RESULT : string pointId FK
    INSPECTION_RESULT : string controlId FK
    INSPECTION_RESULT : string inspectorId FK
    INSPECTION_RESULT : enum result "Pass|Fail|N/A"
    INSPECTION_RESULT : string observedValue
    INSPECTION_RESULT : string expectedValue
    INSPECTION_RESULT : string evidence
    INSPECTION_RESULT : string inspectorNotes
    INSPECTION_RESULT : date inspectionDate

    PARAMETER_INDICATOR : string indicatorId PK
    PARAMETER_INDICATOR : string indicatorName
    PARAMETER_INDICATOR : enum indicatorType "Temperature|Pressure|Vibration|Noise|Visual|Electrical|Mechanical|Chemical|Other"
    PARAMETER_INDICATOR : string unit
    PARAMETER_INDICATOR : string description
    PARAMETER_INDICATOR : boolean isNumeric
    PARAMETER_INDICATOR : date createdAt

    THRESHOLD_REQUIREMENT : string thresholdId PK
    THRESHOLD_REQUIREMENT : string indicatorId FK
    THRESHOLD_REQUIREMENT : number minimumValue
    THRESHOLD_REQUIREMENT : number maximumValue
    THRESHOLD_REQUIREMENT : number warningMin
    THRESHOLD_REQUIREMENT : number warningMax
    THRESHOLD_REQUIREMENT : number criticalMin
    THRESHOLD_REQUIREMENT : number criticalMax
    THRESHOLD_REQUIREMENT : number acceptableTolerance
    THRESHOLD_REQUIREMENT : string unit
    THRESHOLD_REQUIREMENT : boolean isActive
    THRESHOLD_REQUIREMENT : date createdAt

    COMPONENT_PARAMETER : string componentParamId PK
    COMPONENT_PARAMETER : string componentId FK
    COMPONENT_PARAMETER : string pointId FK
    COMPONENT_PARAMETER : string indicatorId FK
    COMPONENT_PARAMETER : string thresholdId FK
    COMPONENT_PARAMETER : number sequence
    COMPONENT_PARAMETER : boolean isRequired
    COMPONENT_PARAMETER : boolean isActive
    COMPONENT_PARAMETER : string notes
    COMPONENT_PARAMETER : date createdAt

    COMPONENT_INSPECTION_POINT : string mappingId PK
    COMPONENT_INSPECTION_POINT : string pointId FK
    COMPONENT_INSPECTION_POINT : string componentId FK
    COMPONENT_INSPECTION_POINT : string subComponentId FK
    COMPONENT_INSPECTION_POINT : boolean applicableToComponent
    COMPONENT_INSPECTION_POINT : boolean applicableToSubComponent
    COMPONENT_INSPECTION_POINT : number inspectionSequence
    COMPONENT_INSPECTION_POINT : enum priority "Critical|High|Medium|Low"
    COMPONENT_INSPECTION_POINT : date createdAt

    ISSUE_NCR : string issueId PK
    ISSUE_NCR : string jobId FK
    ISSUE_NCR : string resultId FK
    ISSUE_NCR : enum issueType "NCR"
    ISSUE_NCR : string title
    ISSUE_NCR : string description
    ISSUE_NCR : enum severity "Critical|High|Medium|Low"
    ISSUE_NCR : enum status "Open|InReview|Resolved|Closed"
    ISSUE_NCR : string assignedTo
    ISSUE_NCR : string createdBy
    ISSUE_NCR : date createdAt
    ISSUE_NCR : date dueDate
    ISSUE_NCR : string resolution

    ISSUE_PUNCH_LIST : string issueId PK
    ISSUE_PUNCH_LIST : string jobId FK
    ISSUE_PUNCH_LIST : string title
    ISSUE_PUNCH_LIST : string description
    ISSUE_PUNCH_LIST : enum status "Open|InProgress|Completed"
    ISSUE_PUNCH_LIST : string assignedTo
    ISSUE_PUNCH_LIST : string createdBy
    ISSUE_PUNCH_LIST : date createdAt
    ISSUE_PUNCH_LIST : date dueDate

    ISSUE_DEFECT : string issueId PK
    ISSUE_DEFECT : string assetId FK
    ISSUE_DEFECT : string title
    ISSUE_DEFECT : string description
    ISSUE_DEFECT : enum defectType "FatigueCrack|OilLeak|ElectricalFault|MechanicalDamage|Other"
    ISSUE_DEFECT : enum severity "Critical|High|Medium|Low"
    ISSUE_DEFECT : enum status "Open|InReview|Resolved|Closed"
    ISSUE_DEFECT : string assignedTo
    ISSUE_DEFECT : string createdBy
    ISSUE_DEFECT : date createdAt
    ISSUE_DEFECT : date dueDate
    ISSUE_DEFECT : string resolution

    USER : string userId PK
    USER : string firstName
    USER : string lastName
    USER : string email
    USER : enum role "Admin|Inspector|Approver|Viewer"
    USER : boolean isActive
```

---

## How to View These Diagrams

### In GitHub/GitLab
- The Mermaid diagram above will render automatically with interactive viewing and zooming

### In mermaid.live
1. Go to https://mermaid.live
2. Copy and paste the Mermaid code above
3. View, edit, and export as SVG or PNG

### In VS Code
1. Install "Markdown Preview Mermaid Support" extension
2. Open this file
3. Open Preview (Ctrl+Shift+V)
4. The diagram will render interactively
