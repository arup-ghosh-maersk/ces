// Example: How to Add 2D Drawings to Assets and Components
// This file shows sample implementations for asset.service.ts and component-master.service.ts

// ============================================================================
// ASSET SERVICE EXAMPLE (asset.service.ts)
// ============================================================================

import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Asset } from '../models';

@Injectable({
  providedIn: 'root'
})
export class AssetService {
  getAssets(): Observable<Asset[]> {
    const mockAssets: Asset[] = [
      {
        assetId: 'ASSET-001',
        locationId: 'LOC-001',
        assetCode: 'RTG-01',
        assetType: 'RTG',
        description: 'Rubber Tyred Gantry Crane - Main Terminal',
        manufacturer: 'Konecranes',
        modelNumber: 'RTG-500',
        serialNumber: 'SN-RTG-001-2020',
        acquisitionDate: new Date('2020-01-15'),
        warrantyExpiry: new Date('2025-01-15'),
        // Add 2D drawing URL - can be local or external
        diagramUrl: '/diagrams/rtg-01-side-view.png'
      },
      {
        assetId: 'ASSET-002',
        locationId: 'LOC-001',
        assetCode: 'STS-01',
        assetType: 'STS',
        description: 'Straddle Transfer Vehicle',
        manufacturer: 'Kalmar',
        modelNumber: 'STS-350',
        serialNumber: 'SN-STS-001-2021',
        acquisitionDate: new Date('2021-03-20'),
        warrantyExpiry: new Date('2026-03-20'),
        // Add 2D drawing URL
        diagramUrl: '/diagrams/sts-01-top-view.svg'
      },
      {
        assetId: 'ASSET-003',
        locationId: 'LOC-002',
        assetCode: 'RMG-01',
        assetType: 'RMG',
        description: 'Rail Mounted Gantry Crane',
        manufacturer: 'Terberg',
        modelNumber: 'RMG-600',
        serialNumber: 'SN-RMG-001-2019',
        acquisitionDate: new Date('2019-06-10'),
        warrantyExpiry: new Date('2024-06-10'),
        // Add 2D drawing URL
        diagramUrl: '/diagrams/rmg-01-technical-drawing.png'
      }
    ];
    return of(mockAssets);
  }

  // Other service methods...
}

// ============================================================================
// COMPONENT SERVICE EXAMPLE (component-master.service.ts)
// ============================================================================

import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ComponentMaster } from '../models';

@Injectable({
  providedIn: 'root'
})
export class ComponentMasterService {
  getComponents(): Observable<ComponentMaster[]> {
    const mockComponents: ComponentMaster[] = [
      // RTG-01 Components
      {
        componentId: 'COMP-001',
        componentCode: 'HOIST-RTG-01',
        componentName: 'Main Hoist System',
        assetId: 'ASSET-001',
        assetType: 'RTG',
        category: 'Mechanical',
        description: 'Primary lifting mechanism for container handling',
        manufacturer: 'Konecranes',
        modelNumber: 'HS-3000',
        serialNumber: 'SN-HOIST-001',
        criticality: 'Critical',
        maintenanceIntervalDays: 30,
        lastMaintenanceDate: new Date('2025-12-01'),
        nextMaintenanceDate: new Date('2026-01-31'),
        isActive: true,
        createdAt: new Date('2020-01-15'),
        // Add 2D component drawing
        diagramUrl: '/diagrams/components/hoist-system-assembly.png'
      },
      {
        componentId: 'COMP-002',
        componentCode: 'MOTOR-RTG-01',
        componentName: 'Main Drive Motor',
        assetId: 'ASSET-001',
        assetType: 'RTG',
        category: 'Electrical',
        description: 'Primary electric motor for trolley movement',
        manufacturer: 'ABB',
        modelNumber: 'M-250KW',
        serialNumber: 'SN-MOTOR-001',
        criticality: 'Critical',
        maintenanceIntervalDays: 60,
        lastMaintenanceDate: new Date('2025-11-15'),
        nextMaintenanceDate: new Date('2026-02-15'),
        isActive: true,
        createdAt: new Date('2020-01-15'),
        // Add 2D component drawing
        diagramUrl: '/diagrams/components/motor-wiring-diagram.svg'
      },
      {
        componentId: 'COMP-003',
        componentCode: 'FRAME-RTG-01',
        componentName: 'Main Steel Frame',
        assetId: 'ASSET-001',
        assetType: 'RTG',
        category: 'Structural',
        description: 'Main structural support frame',
        manufacturer: 'Konecranes',
        modelNumber: 'FRAME-STD',
        serialNumber: 'SN-FRAME-001',
        criticality: 'Critical',
        maintenanceIntervalDays: 90,
        lastMaintenanceDate: new Date('2025-10-01'),
        nextMaintenanceDate: new Date('2026-01-01'),
        isActive: true,
        createdAt: new Date('2020-01-15'),
        // Add 2D component drawing
        diagramUrl: '/diagrams/components/frame-structural-drawing.png'
      },
      {
        componentId: 'COMP-004',
        componentCode: 'TROLLEY-RTG-01',
        componentName: 'Trolley Assembly',
        assetId: 'ASSET-001',
        assetType: 'RTG',
        category: 'Mechanical',
        description: 'Trolley sub-assembly for horizontal movement',
        manufacturer: 'Konecranes',
        modelNumber: 'TROLLEY-500',
        serialNumber: 'SN-TROLLEY-001',
        criticality: 'High',
        parentComponentId: 'COMP-001',
        maintenanceIntervalDays: 45,
        lastMaintenanceDate: new Date('2025-12-01'),
        nextMaintenanceDate: new Date('2026-01-15'),
        isActive: true,
        createdAt: new Date('2020-02-01'),
        // Add 2D sub-component drawing
        diagramUrl: '/diagrams/components/trolley-assembly-detail.png'
      },
      {
        componentId: 'COMP-005',
        componentCode: 'WHEEL-RTG-01',
        componentName: 'Drive Wheel Assembly',
        assetId: 'ASSET-001',
        assetType: 'RTG',
        category: 'Mechanical',
        description: 'Wheel assembly for gantry movement',
        manufacturer: 'Konecranes',
        modelNumber: 'WHEEL-500',
        serialNumber: 'SN-WHEEL-001',
        criticality: 'High',
        maintenanceIntervalDays: 30,
        lastMaintenanceDate: new Date('2025-12-15'),
        nextMaintenanceDate: new Date('2026-01-15'),
        isActive: true,
        createdAt: new Date('2020-02-01'),
        // Add 2D component drawing
        diagramUrl: '/diagrams/components/wheel-assembly-blueprint.svg'
      },
      // STS-01 Components
      {
        componentId: 'COMP-006',
        componentCode: 'ENGAGE-STS-01',
        componentName: 'Container Engagement System',
        assetId: 'ASSET-002',
        assetType: 'STS',
        category: 'Mechanical',
        description: 'Automated container engagement mechanism',
        manufacturer: 'Kalmar',
        modelNumber: 'CES-350',
        serialNumber: 'SN-CES-001',
        criticality: 'Critical',
        maintenanceIntervalDays: 45,
        lastMaintenanceDate: new Date('2025-11-20'),
        nextMaintenanceDate: new Date('2026-01-05'),
        isActive: true,
        createdAt: new Date('2021-03-20'),
        // Add 2D component drawing
        diagramUrl: '/diagrams/components/engagement-mechanism.png'
      },
      // RMG-01 Components
      {
        componentId: 'COMP-007',
        componentCode: 'SPREADER-RMG-01',
        componentName: 'Spreader Bar Assembly',
        assetId: 'ASSET-003',
        assetType: 'RMG',
        category: 'Mechanical',
        description: 'Container spreader bar for secure lifting',
        manufacturer: 'Terberg',
        modelNumber: 'SPREADER-600',
        serialNumber: 'SN-SPREADER-001',
        criticality: 'Critical',
        maintenanceIntervalDays: 30,
        lastMaintenanceDate: new Date('2025-12-10'),
        nextMaintenanceDate: new Date('2026-01-10'),
        isActive: true,
        createdAt: new Date('2019-06-10'),
        // Add 2D component drawing
        diagramUrl: '/diagrams/components/spreader-bar-assembly.svg'
      }
    ];
    return of(mockComponents);
  }

  // Other service methods...
}

// ============================================================================
// HOW TO ADD DIAGRAMS
// ============================================================================

/*
STEP 1: Create or obtain 2D drawings
  - Tools: DrawIO, Visio, AutoCAD, Inkscape
  - Formats: PNG, JPG, SVG (SVG recommended for scalability)
  - Size: Keep under 1MB for performance

STEP 2: Store diagrams in public folder
  Structure:
  public/
    ├── diagrams/
    │   ├── rtg-01-side-view.png
    │   ├── sts-01-top-view.svg
    │   ├── rmg-01-technical-drawing.png
    │   └── components/
    │       ├── hoist-system-assembly.png
    │       ├── motor-wiring-diagram.svg
    │       ├── frame-structural-drawing.png
    │       ├── trolley-assembly-detail.png
    │       ├── wheel-assembly-blueprint.svg
    │       ├── engagement-mechanism.png
    │       └── spreader-bar-assembly.svg

STEP 3: Add diagramUrl to asset/component data
  For Assets:
    diagramUrl: '/diagrams/rtg-01-side-view.png'
  
  For Components:
    diagramUrl: '/diagrams/components/hoist-system-assembly.png'

STEP 4: The UI will automatically display:
  - Asset 2D Drawing section in Asset Details
  - 2D Component Drawing section in expanded component nodes
  - Metadata (Asset/Component info) below the drawing
  - Fallback message if no drawing is available

*/

// ============================================================================
// EXTERNAL DIAGRAM URL EXAMPLE (if stored on CDN or cloud)
// ============================================================================

/*
  diagramUrl: 'https://cdn.example.com/diagrams/rtg-01.png'
  diagramUrl: 'https://bucket.s3.amazonaws.com/diagrams/motor.svg'
  diagramUrl: 'https://api.example.com/drawings/asset/001'
*/

// ============================================================================
// BEST PRACTICES
// ============================================================================

/*
1. IMAGE FORMATS:
   - PNG: Good for detailed technical drawings, smaller file size
   - SVG: Best for scalable diagrams, works at any zoom level
   - JPG: Only for photos, not recommended for technical drawings

2. NAMING CONVENTION:
   - asset-{type}-{number}-{view}.{ext}
   - component-{type}-{number}-{detail}.{ext}
   Examples: rtg-01-side-view.png, motor-wiring-diagram.svg

3. DIMENSIONS:
   - Asset diagrams: 600-800px wide
   - Component diagrams: 400-600px wide
   - Keep aspect ratio consistent

4. QUALITY:
   - Ensure high resolution (300+ DPI for print quality)
   - Use consistent color schemes
   - Add clear labels and dimensions

5. PERFORMANCE:
   - Compress images before uploading
   - Use appropriate formats
   - Keep file size under 500KB per image

6. METADATA:
   - Include component name, code, and category in diagram info section
   - Add timestamps for diagram versions
   - Document any special markings or annotations
*/
