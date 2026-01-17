# Entity Relationship Diagram - Mermaid Format

```mermaid
erDiagram
    TERMINAL_LOCATION ||--o{ ASSET : "has"
    ASSET ||--|| ASSET_SPECS : "has"
    ASSET ||--o{ COMPONENT_MASTER : "contains"
    ASSET ||--o{ ISSUE_DEFECT : "links"
    COMPONENT_MASTER ||--o{ COMPONENT_MASTER : "parent"
    COMPONENT_MASTER ||--|| COMPONENT_POINT_COVERAGE : "has"
    COMPONENT_MASTER ||--o{ COMPONENT_PARAMETER : "uses"
    ITP_TEMPLATE ||--o{ INSPECTION_POINT : "defines"
    INSPECTION_POINT ||--o{ CONTROL_POINT : "has"
    INSPECTION_POINT ||--o{ COMPONENT_INSPECTION_POINT : "maps"
    INSPECTION_JOB }o--|| ASSET : "inspects"
    INSPECTION_JOB }o--|| ITP_TEMPLATE : "uses"
    INSPECTION_JOB }o--|| USER : "assigned"
    INSPECTION_JOB ||--o{ INSPECTION_RESULT : "produces"
    INSPECTION_JOB ||--o{ ISSUE_PUNCH_LIST : "creates"
    INSPECTION_RESULT }o--|| INSPECTION_POINT : "for"
    INSPECTION_RESULT }o--|| CONTROL_POINT : "applies"
    INSPECTION_RESULT }o--|| USER : "recorded"
    INSPECTION_RESULT ||--o{ ISSUE_NCR : "raises"
    PARAMETER_INDICATOR ||--o{ THRESHOLD_REQUIREMENT : "has"
    THRESHOLD_REQUIREMENT ||--o{ COMPONENT_PARAMETER : "defines"
    COMPONENT_PARAMETER }o--|| COMPONENT_MASTER : "for"
    COMPONENT_PARAMETER }o--|| INSPECTION_POINT : "for"
    COMPONENT_PARAMETER }o--|| PARAMETER_INDICATOR : "uses"
    COMPONENT_PARAMETER }o--|| THRESHOLD_REQUIREMENT : "uses"
    COMPONENT_INSPECTION_POINT }o--|| INSPECTION_POINT : "references"
    COMPONENT_INSPECTION_POINT }o--|| COMPONENT_MASTER : "for"
    ISSUE_NCR }o--|| INSPECTION_JOB : "from"
    ISSUE_NCR }o--|| INSPECTION_RESULT : "from"
    ISSUE_NCR }o--|| USER : "assigned"
    ISSUE_PUNCH_LIST }o--|| INSPECTION_JOB : "from"
    ISSUE_PUNCH_LIST }o--|| USER : "assigned"
    ISSUE_DEFECT }o--|| ASSET : "for"
    ISSUE_DEFECT }o--|| USER : "assigned"
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

### In HTML Viewer
- Open `view-entity-diagram.html` in your browser for interactive features (zoom, download, print)

---

## Legend

- **||--o{** : One-to-Many relationship
- **||--||** : One-to-One relationship
- **}o--||** : Many-to-One relationship (reverse view)
- **}o--o{** : Many-to-Many relationship

---

## Relationships Summary

**Total Relationships: 28**

### One-to-Many (1:N) - 18 relationships
- TERMINAL_LOCATION → ASSET
- ASSET → COMPONENT_MASTER
- ASSET → ISSUE_DEFECT
- COMPONENT_MASTER → COMPONENT_MASTER (self-reference)
- COMPONENT_MASTER → COMPONENT_PARAMETER
- ITP_TEMPLATE → INSPECTION_POINT
- INSPECTION_POINT → CONTROL_POINT
- INSPECTION_POINT → COMPONENT_INSPECTION_POINT
- INSPECTION_JOB → INSPECTION_RESULT
- INSPECTION_JOB → ISSUE_PUNCH_LIST
- INSPECTION_RESULT → ISSUE_NCR
- PARAMETER_INDICATOR → THRESHOLD_REQUIREMENT
- THRESHOLD_REQUIREMENT → COMPONENT_PARAMETER
- ISSUE_NCR (multiple relationships)
- ISSUE_PUNCH_LIST (multiple relationships)
- ISSUE_DEFECT (multiple relationships)

### One-to-One (1:1) - 2 relationships
- ASSET → ASSET_SPECS
- COMPONENT_MASTER → COMPONENT_POINT_COVERAGE

### Many-to-One (M:1) - 8 relationships (reverse of One-to-Many)
- INSPECTION_JOB ← ASSET
- INSPECTION_JOB ← ITP_TEMPLATE
- INSPECTION_JOB ← USER
- INSPECTION_RESULT ← INSPECTION_POINT
- INSPECTION_RESULT ← CONTROL_POINT
- INSPECTION_RESULT ← USER
- COMPONENT_PARAMETER ← COMPONENT_MASTER
- And more...

---

## Entity Domains

### Location & Asset Domain
- TERMINAL_LOCATION
- ASSET
- ASSET_SPECS

### Component Domain
- COMPONENT_MASTER
- COMPONENT_HIERARCHY (implicit via self-reference)
- COMPONENT_POINT_COVERAGE

### Inspection Domain
- INSPECTION_JOB
- INSPECTION_RESULT
- INSPECTION_POINT

### Template Domain
- ITP_TEMPLATE
- CONTROL_POINT
- COMPONENT_INSPECTION_POINT

### Parameter Domain
- PARAMETER_INDICATOR
- THRESHOLD_REQUIREMENT
- COMPONENT_PARAMETER

### Issue Tracking Domain
- ISSUE_NCR
- ISSUE_PUNCH_LIST
- ISSUE_DEFECT

### User Domain
- USER

---

## Notes

- All field definitions have been removed from this Mermaid diagram format (Mermaid erDiagram doesn't support field definitions in the same way)
- For complete field definitions, see `ENTITY_DIAGRAM.md`
- For system architecture overview, see `ARCHITECTURE_DIAGRAM.md`
- Cardinality notation follows Mermaid ERD standards
