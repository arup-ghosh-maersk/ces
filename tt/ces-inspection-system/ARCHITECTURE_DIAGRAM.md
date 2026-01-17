# CES (Component Inspection System) - Architecture Diagram

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                         PRESENTATION LAYER (Angular)                             │
├──────────────────┬──────────────────┬──────────────────┬──────────────────────────┤
│  Dashboard       │  Asset Management │  Inspection      │  Issue Tracking         │
│  Component       │  - Asset List    │  - Jobs          │  - NCR                  │
│  Terminal Mgmt   │  - Asset Details │  - Results       │  - Punch List           │
│                  │  - Asset Specs   │  - ITP Templates │  - Defects              │
├──────────────────┼──────────────────┼──────────────────┼──────────────────────────┤
│  Components      │                                                               │
│  ├─ asset-list               ├─ asset-component-points                          │
│  ├─ asset-specs              ├─ component-master                                │
│  ├─ component-inspection-... ├─ component-parameters                            │
│  ├─ itp-templates            ├─ inspection-jobs                                 │
│  ├─ terminal-locations       └─ inspection-results                              │
└──────────────────┴──────────────────┴──────────────────┴──────────────────────────┘
                                        ↓
┌─────────────────────────────────────────────────────────────────────────────────┐
│                         SERVICE LAYER (TypeScript Services)                       │
├──────────────────┬──────────────────┬──────────────────┬──────────────────────────┤
│ AssetService     │ ComponentService │ InspectionService│ IssueService            │
│ - getAssets()    │ - getComponents()│ - getJobs()      │ - getIssues()          │
│ - getAsset()     │ - getComponent() │ - getResults()   │ - createIssue()        │
│ - createAsset()  │ - createComp()   │ - createJob()    │ - updateStatus()       │
│ - updateAsset()  │ - updateComp()   │ - updateResult() │ - resolveIssue()       │
├──────────────────┼──────────────────┼──────────────────┼──────────────────────────┤
│ AssetSpecsService│ ITPTemplateService│ ParameterService │ UserService            │
│ - getSpecs()     │ - getTemplates() │ - getParameters()│ - getUsers()           │
│ - createSpecs()  │ - createTemplate │ - getThresholds()│ - createUser()         │
│ - updateSpecs()  │ - updateTemplate │ - updateParam()  │ - updateRole()         │
└──────────────────┴──────────────────┴──────────────────┴──────────────────────────┘
                                        ↓
┌─────────────────────────────────────────────────────────────────────────────────┐
│                    DATA LAYER (Models & Interfaces)                              │
├──────────────────┬──────────────────┬──────────────────┬──────────────────────────┤
│ Location Domain  │ Asset Domain     │ Component Domain │ Inspection Domain       │
│ - Terminal...    │ - Asset          │ - Component...   │ - InspectionJob        │
│ - Coordinates    │ - AssetSpecs     │ - Hierarchy      │ - InspectionPoint      │
│                  │                  │ - PointCoverage  │ - InspectionResult     │
├──────────────────┼──────────────────┼──────────────────┼──────────────────────────┤
│ Template Domain  │ Parameter Domain │ Issue Domain     │ User Domain            │
│ - ITPTemplate    │ - Parameter...   │ - IssueNCR       │ - User                 │
│ - ControlPoint   │ - Threshold...   │ - IssuePunchList │ - Role: Admin/...      │
│ - ComponentInsp  │ - ComponentParam │ - IssueDefect    │                        │
└──────────────────┴──────────────────┴──────────────────┴──────────────────────────┘
                                        ↓
┌─────────────────────────────────────────────────────────────────────────────────┐
│                    DATA PERSISTENCE (Future Integration)                         │
├──────────────────┬──────────────────┬──────────────────┬──────────────────────────┤
│ Database         │ File Storage     │ Cache Layer      │ External APIs          │
│ - SQL Database   │ - Diagrams (.png)│ - In-Memory      │ - Asset Management     │
│ - Relational     │ - Documents      │ - Local Storage  │ - IoT Sensors          │
│ - Transactions   │ - Evidence Files │ - Session Store  │ - ERP Systems          │
└──────────────────┴──────────────────┴──────────────────┴──────────────────────────┘
```

---

## Component Interaction Flow

```
USER INTERFACE
    ↓
    ├── Asset List Component ──→ AssetService ──→ Asset[] Models
    │                                 ↓
    │                        Cache & Local Storage
    │
    ├── Component Master ────→ ComponentService ──→ ComponentMaster[] Models
    │       Component         with Hierarchy
    │
    ├── Inspection Jobs ─────→ InspectionService ──→ InspectionJob[] Models
    │       Jobs & Results          ↓                InspectionResult[] Models
    │                        ITPTemplate Models
    │
    └── Issue Tracking ──────→ IssueService ───→ Issue*[] Models
            NCR, P-List           (NCR, PunchList, (IssueNCR, IssuePunchList,
            Defects               Defect)         IssueDefect)
```

---

## Data Flow: Asset Inspection Workflow

```
┌────────────────┐
│  Asset Created │
└────────┬───────┘
         ↓
    ┌─────────────────────┐
    │ Add Asset Specs     │
    │ (Technical Details) │
    └────────┬────────────┘
             ↓
    ┌────────────────────────┐
    │ Add Components         │
    │ (Hoist, Motor, Frame)  │
    └────────┬───────────────┘
             ↓
    ┌────────────────────────────────┐
    │ Select ITP Template            │
    │ (Inspection Points Defined)    │
    └────────┬───────────────────────┘
             ↓
    ┌────────────────────────────────┐
    │ Map Components to Points       │
    │ (ComponentInspectionPoint)     │
    └────────┬───────────────────────┘
             ↓
    ┌────────────────────────────────┐
    │ Configure Parameters           │
    │ (Thresholds & Indicators)      │
    └────────┬───────────────────────┘
             ↓
    ┌────────────────────────────────┐
    │ Create Inspection Job          │
    │ (Assign Inspector)             │
    └────────┬───────────────────────┘
             ↓
    ┌────────────────────────────────┐
    │ Execute Inspection             │
    │ (Record Results)               │
    └────────┬───────────────────────┘
             ↓
    ┌────────────────────────────────┐
    │ Review & Analysis              │
    │ (Pass/Fail/N/A)               │
    └────────┬───────────────────────┘
             ↓
    ┌────────────────────────────────┐
    │ Issue Management               │
    │ (NCR/Defect if needed)        │
    └────────┬───────────────────────┘
             ↓
    ┌────────────────────────────────┐
    │ Closure & Reporting            │
    │ (Archive Results)              │
    └────────────────────────────────┘
```

---

## Technology Stack

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (Angular)                        │
│  - Angular 19+ (Latest)                                     │
│  - TypeScript 5.0+                                          │
│  - RxJS (Reactive Programming)                              │
│  - Angular CLI (Build & Development)                        │
│  - SCSS/CSS3 (Styling)                                      │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                   STATE MANAGEMENT                           │
│  - In-Memory (Current)                                      │
│  - Angular Services with RxJS Observables                   │
│  - Local Storage for persistence                            │
│  - (Future: NgRx or Akita for complex state)               │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│              DEVELOPMENT & BUILD TOOLS                       │
│  - Node.js 20+ (Runtime)                                    │
│  - npm (Package Manager)                                    │
│  - TypeScript Compiler                                      │
│  - Webpack (Bundling)                                       │
│  - Dev Server (ng serve)                                    │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│            FUTURE INTEGRATION POINTS                         │
│  - Backend API (Node.js/Express/ASP.NET)                   │
│  - Database (PostgreSQL/SQL Server/MongoDB)                │
│  - Authentication (OAuth2/JWT)                              │
│  - File Storage (AWS S3/Azure Blob/Local Server)           │
│  - Real-time Updates (WebSockets/SignalR)                  │
└─────────────────────────────────────────────────────────────┘
```

---

## Scalability & Performance Considerations

### Current Architecture
- **Single Page Application (SPA)**: Angular running in browser
- **Stateless Services**: All data loaded from models
- **Local State Management**: Services with RxJS Observables
- **Mock Data**: In-memory data structures

### Scaling Strategy (Future)
1. **Add Backend API Layer**
   - RESTful endpoints for CRUD operations
   - Implement server-side caching
   - Database indexing for complex queries

2. **Implement State Management**
   - NgRx or Akita for complex state
   - Normalized data store
   - Effects for side effects

3. **Optimize Performance**
   - Lazy loading for feature modules
   - Virtual scrolling for large lists
   - Change detection optimization
   - Tree-shaking unused code

4. **Security**
   - HTTPS/TLS encryption
   - JWT token-based authentication
   - Role-based access control (RBAC)
   - Input validation & sanitization

---

## Module Organization

```
src/
├── app/
│   ├── components/           # UI Components
│   │   ├── asset-list/
│   │   ├── component-master/
│   │   ├── inspection-jobs/
│   │   └── ...
│   │
│   ├── services/            # Business Logic
│   │   ├── asset.service.ts
│   │   ├── component-master.service.ts
│   │   ├── inspection-job.service.ts
│   │   └── ...
│   │
│   ├── models/              # Data Models & Interfaces
│   │   └── index.ts        # All entity interfaces
│   │
│   ├── app.routes.ts        # Routing configuration
│   └── app.config.ts        # App initialization
│
├── styles.css              # Global styles
├── index.html              # Entry point
└── main.ts                 # Bootstrap
```

---

## Entity Relationships Summary

**20 Core Entities:**

| Domain | Entities | Purpose |
|--------|----------|---------|
| **Location** | TerminalLocation | Container terminal locations |
| **Assets** | Asset, AssetSpecs | Physical equipment & specifications |
| **Components** | ComponentMaster, ComponentHierarchy, ComponentPointCoverage | Equipment sub-assemblies |
| **Inspection** | InspectionJob, InspectionResult, InspectionPoint | Inspection execution & results |
| **Templates** | ITPTemplate, ControlPoint, ComponentInspectionPoint | Inspection templates & controls |
| **Parameters** | ParameterIndicator, ThresholdRequirement, ComponentParameter | Measurable parameters |
| **Issues** | IssueNCR, IssuePunchList, IssueDefect | Non-conformances & defects |
| **Users** | User | System users & roles |

**28 Relationships:**
- 18 One-to-Many relationships
- 2 One-to-One relationships
- 3 Many-to-Many relationships
- 5 Reference relationships

---

## Key Features by Architecture Layer

### Presentation Layer
- Asset browsing and filtering
- Component hierarchy visualization
- Inspection job management
- Results review and analysis
- Issue tracking dashboard
- User role-based views

### Service Layer
- CRUD operations for all entities
- Business logic implementation
- Data transformation
- Validation rules
- Workflow orchestration

### Data Layer
- Type-safe models with interfaces
- Enum-based constraint (asset types, roles, statuses)
- Relationships between entities
- Optional fields for flexibility
- Timestamps for audit trails

---

## Deployment Architecture (Future)

```
┌─────────────────────────────────────┐
│      Client Browser (SPA)            │
│  - Angular Application               │
│  - Responsive UI                     │
└──────────────┬──────────────────────┘
               ↓ HTTPS
┌─────────────────────────────────────┐
│    Web Server / API Gateway          │
│  - Nginx / Apache / Express.js       │
│  - CORS Configuration                │
│  - Request Routing                   │
└──────────────┬──────────────────────┘
               ↓
┌─────────────────────────────────────┐
│      Backend API Server              │
│  - Node.js/Express or ASP.NET        │
│  - Business Logic                    │
│  - Authentication/Authorization      │
└──────────────┬──────────────────────┘
               ↓
┌─────────────────────────────────────┐
│      Database Server                 │
│  - PostgreSQL / SQL Server           │
│  - Data Persistence                  │
│  - Transaction Management            │
└─────────────────────────────────────┘
```
