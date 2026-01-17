# Components as Assets - Quick Reference

## TL;DR
**Components are now assets.** The `Asset` model now supports `assetType: 'Component'` with a `parentAssetId` that references the parent equipment (STS, RTG, RMG).

## Quick Start

### Create a Component Asset
```typescript
const motorComponent: Asset = {
  assetId: 'COMP-MOTOR-001',
  assetType: 'Component',           // ← NEW: Component type
  assetCode: 'MTR-001',
  assetCategory: 'Electrical',      // ← NEW: Component category
  parentAssetId: 'ASSET-STS-001',   // ← NEW: Parent equipment reference
  description: 'Main Drive Motor',
  criticality: 'Critical',           // ← NEW: Component criticality
  maintenanceIntervalDays: 365,      // ← NEW: Maintenance tracking
};
```

### Create Inspection Points for Component
```typescript
// Create inspection point for component (same as equipment)
assetInspectionPointsService.addAssetInspectionPoint({
  assetPointId: 'aip-comp-001',
  assetId: 'COMP-MOTOR-001',        // ← Component asset ID
  pointId: 'POINT-001',
  templateId: 'TEMPLATE-001',
  sequence: 1,
  isApplicable: true,
  isMandatory: true,
  priority: 'Critical'
});
```

## Asset Types

| Type | Description | Location | Parent |
|------|-------------|----------|--------|
| `STS` | Straddle Transfer Crane | Required | None |
| `RTG` | Rubber Tyred Gantry | Required | None |
| `RMG` | Rail Mounted Gantry | Required | None |
| `Component` | Sub-component | Optional | Required |

## Asset Categories (for Components)

- `Structural` - Frame, boom, wheels, tracks
- `Electrical` - Motors, wiring, switchgear
- `Mechanical` - Gears, pulleys, brakes
- `Hydraulic` - Pumps, cylinders, valves
- `Software` - Control systems, firmware
- `Other` - Miscellaneous

## Criticality Levels

- `Critical` - Equipment failure stops operations
- `High` - Component failure degrades performance
- `Medium` - Component failure causes minor issues
- `Low` - Component failure doesn't impact operations

## Service Methods (All Support Components)

```typescript
// Get inspection points for ANY asset (equipment or component)
getAssetInspectionPointsByAsset(assetId: string)

// Get full configuration for ANY asset
getAssetInspectionConfiguration(assetId: string)

// Add inspection point for ANY asset
addAssetInspectionPoint(point: AssetInspectionPoint)

// Add parameters to inspection point (works for components)
addAssetParameterThreshold(threshold: AssetParameterThreshold)
```

## Common Patterns

### Inspect Equipment and Components
```typescript
// Get equipment inspection points
const equipmentPoints = await service
  .getAssetInspectionPointsByAsset('ASSET-STS-001')
  .toPromise();

// Get component inspection points (same method!)
const componentPoints = await service
  .getAssetInspectionPointsByAsset('COMP-MOTOR-001')
  .toPromise();
```

### Query Component by Parent
```typescript
// Service method to filter components by parent
const componentsByParent = mockAssetParameterThresholds
  .filter(x => x.assetId === 'ASSET-STS-001' && isComponent(x.assetId));
```

### Display Component Hierarchy
```typescript
// UI grouping
const equipment = assets.filter(a => a.assetType !== 'Component');
const components = assets.filter(a => a.assetType === 'Component');

// Group components by parent
const componentsByParent = new Map();
components.forEach(comp => {
  if (!componentsByParent.has(comp.parentAssetId)) {
    componentsByParent.set(comp.parentAssetId, []);
  }
  componentsByParent.get(comp.parentAssetId).push(comp);
});
```

## Database Impact

### New Columns in Assets Table
```sql
ALTER TABLE assets ADD COLUMN asset_type VARCHAR(20); -- 'Component'
ALTER TABLE assets ADD COLUMN asset_category VARCHAR(50);
ALTER TABLE assets ADD COLUMN parent_asset_id VARCHAR(50);
ALTER TABLE assets ADD COLUMN criticality VARCHAR(20);
ALTER TABLE assets ADD COLUMN maintenance_interval_days INT;
ALTER TABLE assets ADD COLUMN last_maintenance_date DATE;
ALTER TABLE assets ADD COLUMN next_maintenance_date DATE;
```

## Example Component Definitions

### Electrical Component
```typescript
{
  assetId: 'COMP-MAIN-MOTOR-001',
  assetType: 'Component',
  assetCode: 'MTR-M1-001',
  assetCategory: 'Electrical',
  parentAssetId: 'ASSET-STS-001',
  description: '55kW Main Drive Motor',
  criticality: 'Critical',
  maintenanceIntervalDays: 365
}
```

### Hydraulic Component
```typescript
{
  assetId: 'COMP-HYDRAULIC-PUMP-001',
  assetType: 'Component',
  assetCode: 'PUMP-HYD-001',
  assetCategory: 'Hydraulic',
  parentAssetId: 'ASSET-RTG-002',
  description: 'Main Hydraulic Pump - 50L/min',
  criticality: 'High',
  maintenanceIntervalDays: 180
}
```

### Structural Component
```typescript
{
  assetId: 'COMP-BOOM-001',
  assetType: 'Component',
  assetCode: 'BOOM-001',
  assetCategory: 'Structural',
  parentAssetId: 'ASSET-STS-001',
  description: 'Spreader Boom Assembly',
  criticality: 'Critical',
  maintenanceIntervalDays: 730
}
```

## Migration Checklist

- [ ] Update `Asset` model in code ✅ (Already done)
- [ ] Update `AssetInspectionPointConfig` ✅ (Already done)
- [ ] Update `ComponentMaster` ✅ (Already done)
- [ ] Database migration scripts (TBD)
- [ ] Populate existing components as assets (TBD)
- [ ] Update UI asset selectors (TBD)
- [ ] Test component inspection points (TBD)

## Related Files

- **Architecture**: `COMPONENTS_AS_ASSETS_ARCHITECTURE.md`
- **Models**: `src/app/models/index.ts`
- **Service**: `src/app/services/asset-inspection-points.service.ts`
- **Component**: `src/app/components/asset-inspection-points/asset-inspection-points.component.ts`

## Key Takeaway

**Components are no longer "parts of" equipment. They ARE assets.** This means:
- ✅ Components can have inspection points
- ✅ Components can have parameter indicators and thresholds
- ✅ Components can be queried independently
- ✅ Component maintenance is tracked at asset level
- ✅ Components can be inspected like any other asset

All existing equipment assets (STS, RTG, RMG) work unchanged. This is **additive, not breaking**.
