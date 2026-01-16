# Crane Equipment Inspection System (CES) - Angular Application

A comprehensive Angular-based system for managing Inspection Testing Protocols (ITP) for crane equipment in port terminal operations.

## Project Overview

The CES Application is designed to manage the complete lifecycle of equipment inspections, from asset registration through inspection execution to issue tracking and resolution.

### Three-Layer Architecture

#### 1. Asset & Infrastructure Layer
- **Terminal Locations**: Manage port/terminal locations with GPS coordinates
- **Asset Registry**: Track equipment (STS, RTG, RMG) across terminals
- **Asset Details**: Manufacturer, model, serial number, warranty information

#### 2. ITP Strategy & Logic Layer
- **ITP Templates**: Standardized inspection protocols by asset type
- **Inspection Tasks**: Detailed tasks within each template
- **Control Points**: Hold (H), Warning (W), Mandatory (M), Recommendation (R)
- **Standards Reference**: ASME, ISO compliance tracking

#### 3. Transactional Execution Layer
- **Inspection Jobs**: Manage inspection campaigns (Construction, Commissioning, Routine, Special)
- **Inspection Results**: Capture pass/fail/N/A results with evidence
- **Issue Tracking**:
  - **NCR** (Non-Conformance Reports): New construction deviations
  - **Punch Lists**: Outstanding items before handover
  - **Defects**: Wear, tear, and operational issues

## Technology Stack

- **Frontend Framework**: Angular 18+ (Standalone Components)
- **Styling**: CSS3
- **State Management**: RxJS Observables
- **Architecture**: Service-based with reactive patterns

## Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── dashboard/                 # Main dashboard
│   │   ├── asset-list/               # Asset management
│   │   ├── itp-templates/            # Template management
│   │   └── inspection-jobs/          # Job and issue tracking
│   ├── services/
│   │   ├── asset.service.ts          # Asset management
│   │   ├── itp-template.service.ts   # Template management
│   │   └── inspection-job.service.ts # Job management
│   ├── models/
│   │   └── index.ts                  # Data models/interfaces
│   ├── app.routes.ts                 # Routing configuration
│   ├── app.config.ts                 # Application configuration
│   └── app.component.ts              # Root component
├── main.ts                            # Application entry point
├── index.html                         # HTML template
└── styles.css                         # Global styles
```

## Data Models

### Asset Management Models
- `TerminalLocation`: Port/terminal locations
- `Asset`: Equipment registry (STS, RTG, RMG)

### ITP Models
- `ITPTemplate`: Inspection protocol templates
- `InspectionTask`: Individual inspection tasks
- `ControlPoint`: Quality control checkpoints

### Execution Models
- `InspectionJob`: Inspection campaigns
- `InspectionResult`: Test results and evidence
- `IssueNCR`: Non-conformance reports
- `IssuePunchList`: Outstanding items
- `IssueDefect`: Equipment defects

### User Model
- `User`: System users with roles (Admin, Inspector, Approver, Viewer)

## Services

### AssetService
Manages terminal locations and asset registry:
- `getAssets()`: List all assets
- `addAsset()`: Register new equipment
- `updateAsset()`: Modify asset details
- `deleteAsset()`: Remove assets
- Terminal location CRUD operations

### ITPTemplateService
Handles inspection templates and tasks:
- `getTemplates()`: List ITP templates
- `getTasksByTemplate()`: Get tasks for a template
- `getControlPointsByTask()`: Get control points for a task
- Full CRUD operations for templates, tasks, and control points

### InspectionJobService
Manages inspection execution and issues:
- `getJobs()`: List inspection jobs
- `getResults()`: Get inspection results
- `getNCRs()`: List non-conformance reports
- `getPunchLists()`: Get outstanding items
- `getDefects()`: List equipment defects
- Full CRUD operations for all entities

## Features

### Asset Management
- Register and track crane equipment across terminals
- Maintain equipment specifications and warranty information
- Track equipment location and status

### Template Management
- Create standardized inspection protocols
- Define inspection tasks with control points
- Manage multiple revisions of templates
- Support multiple asset types (STS, RTG, RMG)

### Inspection Execution
- Create inspection jobs from templates
- Execute tasks in sequence
- Capture inspection results with evidence
- Manage control points (Hold, Warning, Mandatory)

### Issue Tracking
- Create Non-Conformance Reports (NCR) for deviations
- Track punch list items for final handover
- Manage equipment defects (fatigue, leaks, electrical)
- Monitor issue resolution status

### Dashboard
- System overview with key metrics
- Quick navigation to all modules
- Visual status indicators

## Getting Started

### Prerequisites
- Node.js 18+
- Angular CLI 18+
- npm or yarn

### Installation

1. Navigate to the project directory:
```bash
cd ces-inspection-system
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
ng serve
```

4. Open your browser and navigate to `http://localhost:4200/`

## Usage

### Navigation
- **Dashboard**: System overview and metrics
- **Assets**: View and manage equipment and locations
- **ITP Templates**: Create and manage inspection templates
- **Inspection Jobs**: Execute inspections and track issues

### Mock Data
The application includes mock data for demonstration:
- 2 terminal locations
- 2 sample assets (STS, RTG)
- 2 ITP templates (Annual STS, Semi-Annual RTG)
- 1 inspection job with results
- 1 non-conformance report

### Creating Inspection Templates
1. Navigate to ITP Templates
2. View existing templates
3. Templates contain sequential tasks
4. Each task has control points with specific criteria

### Executing Inspections
1. Create a new inspection job
2. Select template and asset
3. Execute tasks in sequence
4. Record pass/fail results
5. Attach evidence files
6. Create issues if needed

### Managing Issues
1. View Non-Conformance Reports for construction deviations
2. Track punch list items for completion
3. Manage defects for equipment damage/wear
4. Update issue status and resolution

## Future Enhancements

- Backend API integration (REST/GraphQL)
- Database persistence (PostgreSQL)
- User authentication and role-based access control
- File upload and evidence management
- PDF report generation
- Real-time notifications
- Mobile app (React Native)
- Advanced analytics and reporting
- Integration with asset tracking systems
- Scheduling and calendar management

## Building for Production

```bash
ng build --configuration production
```

## Testing

```bash
# Unit tests
ng test

# E2E tests
ng e2e
```

## Component Details

### DashboardComponent
Main landing page with system overview, navigation menu, and feature highlights.

### AssetListComponent
Displays terminal locations and equipment registry in tabular format with asset type badges.

### ITPTemplatesComponent
Shows inspection templates with ability to view associated tasks and control points.

### InspectionJobsComponent
Displays inspection jobs, non-conformance reports, punch lists, and defects with status badges.

## Styling

The application uses a consistent color scheme:
- **Primary Color**: #1976d2 (Blue)
- **Success**: #52c41a (Green)
- **Warning**: #faad14 (Orange)
- **Critical**: #f5222d (Red)
- **Background**: #f5f5f5 (Light Gray)

## Code Style

- TypeScript strict mode enabled
- ESLint configured for code quality
- Angular best practices followed
- Standalone components used throughout
- Reactive programming with RxJS

## License

This project is licensed under the MIT License - see LICENSE file for details.

## Contact & Support

For support or questions regarding the CES system, please contact the development team.

## Version History

### Version 1.0.0 (Initial Release)
- Core asset management
- ITP template management
- Inspection job execution
- Issue tracking (NCR, Punch List, Defects)
- Dashboard with mock data
