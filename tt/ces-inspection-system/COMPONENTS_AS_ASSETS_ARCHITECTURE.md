# Components as Assets - Architectural Update

## Overview
Components are now treated as **first-class assets** in the CES Inspection System. This means components can be inspected, monitored, and managed using the same inspection framework as equipment-level assets (STS, RTG, RMG).

## Key Changes

### 1. Asset Model Enhancement
The `Asset` interface has been updated to support both equipment-level and component-level assets:

```typescript
export interface Asset {
  assetId: string;
  locationId?: string;  // Optional for components
  assetCode: string;
  assetType: 'STS' | 'RTG' | 'RMG' | 'Component';  // NEW: Component support
  assetCategory?: 'Structural' | 'Electrical' | 'Mechanical' | 'Hydraulic' | 'Software' | 'Other';
  description: string;
  manufacturer?: string;
  modelNumber?: string;
  serialNumber?: string;
  acquisitionDate?: Date;
  warrantyExpiry?: Date;
  diagramUrl?: string;
  parentAssetId?: string;  // NEW: Reference to parent asset for components
  criticality?: 'Critical' | 'High' | 'Medium' | 'Low';  // NEW: Component criticality
  maintenanceIntervalDays?: number;  // NEW: Component maintenance
  lastMaintenanceDate?: Date;         // NEW: Component maintenance
  nextMaintenanceDate?: Date;         // NEW: Component maintenance
  isActive?: boolean;
}
```

### 2. Asset Type Classification

#### Equipment-Level Assets
```typescript
{
  assetId: 'ASSET-001',
  assetType: 'STS',  // or RTG, RMG
  assetCode: 'STS-001',
  locationId: 'LOCATION-001',
  description: 'Straddle Transfer Crane',
  // ...other equipment fields
}
```

#### Component-Level Assets
```typescript
{
  assetId: 'COMP-001',
  assetType: 'Component',
  assetCode: 'COMP-MOT-001',
  assetCategory: 'Electrical',
  parentAssetId: 'ASSET-001',  // Parent equipment
  description: 'Main Drive Motor',
  criticality: 'Critical',
  maintenanceIntervalDays: 365,
  // ...other component fields
}
```

### 3. Inspection Point Mapping
The `AssetInspectionPointConfig` now supports components:

```typescript
export interface AssetInspectionPointConfig {
  assetId: string;
  assetCode: string;
  assetType: 'STS' | 'RTG' | 'RMG' | 'Component';  // NOW SUPPORTS COMPONENTS
  assetCategory?: 'Structural' | 'Electrical' | 'Mechanical' | 'Hydraulic' | 'Software' | 'Other';
  // ... rest of configuration
}
```

### 4. ComponentMaster Model Updates
The `ComponentMaster` interface has been simplified to reference the Asset model:

```typescript
export interface ComponentMaster {
  componentId: string;
  componentCode: string;
  componentName: string;
  parentAssetId: string;           // NEW: Clearer naming
  parentAssetType: 'STS' | 'RTG' | 'RMG';  // Parent type
  assetCategory: 'Structural' | 'Electrical' | 'Mechanical' | 'Hydraulic' | 'Software' | 'Other';
  criticality: 'Critical' | 'High' | 'Medium' | 'Low';
  // ... other fields
}
```

## Inspection Hierarchy

### Before (Separate Systems)
```
Equipment Asset (STS/RTG/RMG)
  ├── Component 1
  ├── Component 2
  └── Component 3

Inspection Points
  ├── Mapped to Equipment
  ├── Mapped to Components (separate logic)
```

### After (Unified Asset System)
```
Equipment Asset (assetType: 'STS')
  └── Inspection Points
      └── Parameter Indicators & Thresholds

Component Asset (assetType: 'Component', parentAssetId: 'EQUIPMENT')
  └── Inspection Points
      └── Parameter Indicators & Thresholds
```

## Workflow Examples

### Example 1: Inspect Main Drive Motor
```typescript
// Component is now an asset
const motor: Asset = {
  assetId: 'COMP-MOTOR-001',
  assetType: 'Component',
  assetCode: 'MTR-001',
  assetCategory: 'Electrical',
  parentAssetId: 'ASSET-STS-001',
  description: 'Main Drive Motor - 55kW',
  criticality: 'Critical'
};

// Can be inspected like any other asset
const inspectionPoints = await assetInspectionPointsService
  .getAssetInspectionPointsByAsset('COMP-MOTOR-001')
  .toPromise();

// Configure inspection requirements
const config = await assetInspectionPointsService
  .getAssetInspectionConfiguration('COMP-MOTOR-001')
  .toPromise();
```

### Example 2: Monitor Multiple Inspection Points
```typescript
// Equipment inspection
const equipmentPoints = await service.getAssetInspectionPointsByAsset('ASSET-STS-001');

// Component inspection (same method, different asset type)
const componentPoints = await service.getAssetInspectionPointsByAsset('COMP-MOTOR-001');

// Both use the same inspection framework
```

### Example 3: Manage Component Maintenance
```typescript
const component: Asset = {
  assetId: 'COMP-PUMP-001',
  assetType: 'Component',
  parentAssetId: 'ASSET-RTG-002',
  criticality: 'High',
  maintenanceIntervalDays: 180,
  lastMaintenanceDate: new Date('2025-11-01'),
  nextMaintenanceDate: new Date('2026-05-01')
};

// Next maintenance date auto-calculated in UI/service
```

## Database Impact

### Assets Table Schema
```sql
CREATE TABLE assets (
  asset_id VARCHAR(50) PRIMARY KEY,
  asset_code VARCHAR(100) NOT NULL,
  asset_type VARCHAR(20) NOT NULL, -- 'STS', 'RTG', 'RMG', 'Component'
  asset_category VARCHAR(50), -- For components
  location_id VARCHAR(50),
  parent_asset_id VARCHAR(50),
  criticality VARCHAR(20),
  description TEXT,
  manufacturer VARCHAR(100),
  model_number VARCHAR(100),
  serial_number VARCHAR(100),
  acquisition_date DATE,
  warranty_expiry DATE,
  maintenance_interval_days INT,
  last_maintenance_date DATE,
  next_maintenance_date DATE,
  diagram_url VARCHAR(500),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (location_id) REFERENCES terminal_locations(location_id),
  FOREIGN KEY (parent_asset_id) REFERENCES assets(asset_id)
);
```

## Benefits

1. **Unified Inspection Framework** - Use the same inspection system for equipment and components
2. **Flexible Asset Hierarchy** - Components can be nested and inspected independently
3. **Consistent Data Model** - Single Asset interface eliminates duplication
4. **Flexible Queries** - Can query inspection points for any asset type
5. **Maintenance Tracking** - Components have built-in maintenance interval tracking
6. **Criticality Management** - Component criticality helps prioritize inspections

## Migration Path

### Existing Equipment Assets (No Change)
```typescript
// These continue to work as before
const sts = {
  assetId: 'ASSET-001',
  assetType: 'STS',
  assetCode: 'STS-001',
  locationId: 'LOCATION-001'
} as Asset;
```

### New Component Assets
```typescript
// Create component as a new asset
const motor = {
  assetId: 'COMP-001',
  assetType: 'Component',
  assetCode: 'MTR-001',
  assetCategory: 'Electrical',
  parentAssetId: 'ASSET-001'
} as Asset;
```

## Service Methods - All Support Components

All `AssetInspectionPointsService` methods work with both equipment and component assets:

```typescript
// Works for any asset type
getAssetInspectionPointsByAsset(assetId)
getAssetInspectionConfiguration(assetId)
addAssetInspectionPoint(point)  // assetId can be any asset type
updateAssetParameterThreshold()  // Works with component assets
```

## UI Considerations

### Asset Selection in Components
When selecting an asset for inspection points, the UI should:
1. Display both equipment and components
2. Group components under their parent equipment (optional)
3. Show asset type badges: 🏗️ Equipment, 🔧 Component
4. Indicate component criticality with color coding

### Example UI Enhancement
```typescript
// In asset-inspection-points.component.ts
availableAssets$ = this.assetService.getAssets().pipe(
  map(assets => 
    assets.map(asset => ({
      ...asset,
      displayName: asset.assetType === 'Component' 
        ? `${asset.assetCode} (${asset.assetCategory}) - ${asset.description}`
        : `${asset.assetCode} (${asset.assetType}) - ${asset.description}`
    }))
  )
);
```

## Testing Considerations

Test scenarios should include:
- ✅ Create inspection points for equipment assets
- ✅ Create inspection points for component assets
- ✅ Verify component parameters and thresholds
- ✅ Query inspection configuration for components
- ✅ Verify parent-child asset relationships
- ✅ Test component maintenance date calculations

## Future Enhancements

1. **Component Hierarchy** - Support sub-assemblies (component within component)
2. **Batch Inspection** - Inspect parent and all child components
3. **Aggregated Reporting** - Roll-up inspection status from components
4. **Predictive Maintenance** - Component-level failure analysis
5. **Asset Genealogy** - Track component lineage and relationships

## Backward Compatibility

✅ **All existing code continues to work unchanged**
- Equipment assets (STS, RTG, RMG) work exactly as before
- Component-related code now uses the unified Asset model
- No breaking changes to existing interfaces
- `ComponentMaster` interface retained for compatibility

## Summary

Components are now **first-class assets** that can be inspected, monitored, and maintained using the same framework as equipment-level assets. This unified approach:
- Eliminates code duplication
- Provides consistent inspection workflows
- Enables flexible asset hierarchies
- Supports comprehensive maintenance tracking
