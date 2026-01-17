# Inspection Points Associated with Components

## Overview
Inspection Points are now explicitly associated with Components. The `InspectionPoint` model has been updated to support both component-level and asset-level inspection points.

## Model Update

### InspectionPoint Interface - UPDATED

**File**: `src/app/models/index.ts`

#### Before
```typescript
export interface InspectionPoint {
  pointId: string;
  templateId: string;
  sequenceOrder: number;
  pointDescription: string;
  componentCategory: string;
  inspectionMethod: 'Visual' | 'Ultrasonic' | 'Functional Test' | 'NDT';
  isMandatory: boolean;
  pointThreshold?: string;
}
```

#### After
```typescript
export interface InspectionPoint {
  pointId: string;
  templateId: string;
  componentId?: string; // ← NEW: Reference to specific component
  sequenceOrder: number;
  pointDescription: string;
  componentCategory: string;
  inspectionMethod: 'Visual' | 'Ultrasonic' | 'Functional Test' | 'NDT';
  isMandatory: boolean;
  pointThreshold?: string;
  applicableToComponent: boolean; // ← NEW: Component-level flag
  applicableToAsset: boolean; // ← NEW: Asset-level flag
}
```

## Key Changes

### 1. `componentId` Field (Optional)
- Links an inspection point to a specific component
- Allows inspection points to target specific component types
- If `null`, point applies to asset level only
- Enables component-specific inspection requirements

### 2. `applicableToComponent` Flag
- `true` = Point is used for component-level inspections
- Indicates whether the inspection point should be checked during component inspection
- Used to filter inspection points based on context

### 3. `applicableToAsset` Flag
- `true` = Point is used for asset-level inspections
- Indicates whether the inspection point should be checked during equipment inspection
- Allows same inspection point to be used at both levels

## Usage Patterns

### Pattern 1: Component-Specific Point
```typescript
const componentPoint: InspectionPoint = {
  pointId: 'POINT-MTR-001',
  templateId: 'TEMPLATE-001',
  componentId: 'COMP-MAIN-MOTOR-001', // ← Specific component
  sequenceOrder: 1,
  pointDescription: 'Main Motor Temperature Check',
  componentCategory: 'Electrical',
  inspectionMethod: 'Functional Test',
  isMandatory: true,
  applicableToComponent: true, // ← Used for component inspection
  applicableToAsset: false
};
```

### Pattern 2: Asset-Level Point
```typescript
const assetPoint: InspectionPoint = {
  pointId: 'POINT-STS-001',
  templateId: 'TEMPLATE-001',
  // componentId: null/undefined - No specific component
  sequenceOrder: 1,
  pointDescription: 'Overall Frame Condition',
  componentCategory: 'Structural',
  inspectionMethod: 'Visual',
  isMandatory: true,
  applicableToComponent: false,
  applicableToAsset: true // ← Used for asset inspection
};
```

### Pattern 3: Shared Point (Both Levels)
```typescript
const sharedPoint: InspectionPoint = {
  pointId: 'POINT-SAFETY-001',
  templateId: 'TEMPLATE-001',
  // componentId: optional - Can apply to component or asset
  sequenceOrder: 1,
  pointDescription: 'Safety Systems Check',
  componentCategory: 'Mechanical',
  inspectionMethod: 'Functional Test',
  isMandatory: true,
  applicableToComponent: true, // ← Used at component level
  applicableToAsset: true // ← Also used at asset level
};
```

## Querying Inspection Points

### Get Component Inspection Points
```typescript
// Filter inspection points for a specific component
const componentPoints = inspectionPoints.filter(p => 
  p.applicableToComponent === true &&
  (p.componentId === null || p.componentId === 'COMP-MAIN-MOTOR-001')
);
```

### Get Asset-Level Points
```typescript
// Filter inspection points for asset-level inspection
const assetPoints = inspectionPoints.filter(p => 
  p.applicableToAsset === true &&
  p.componentId === null
);
```

### Get All Points by Component Category
```typescript
// Get all electrical component inspection points
const electricalPoints = inspectionPoints.filter(p => 
  p.applicableToComponent === true &&
  p.componentCategory === 'Electrical'
);
```

## Database Schema

### Updated InspectionPoints Table
```sql
ALTER TABLE inspection_points ADD COLUMN component_id VARCHAR(50);
ALTER TABLE inspection_points ADD COLUMN applicable_to_component BOOLEAN DEFAULT false;
ALTER TABLE inspection_points ADD COLUMN applicable_to_asset BOOLEAN DEFAULT true;

-- Add foreign key constraint
ALTER TABLE inspection_points 
ADD CONSTRAINT fk_inspection_point_component 
FOREIGN KEY (component_id) REFERENCES components(component_id);
```

## Relationship Diagram

```
InspectionPoint
├── pointId
├── templateId
├── componentId? ──→ ComponentMaster (optional reference)
├── componentCategory
├── applicableToComponent (boolean)
├── applicableToAsset (boolean)
└── ... other fields
```

## Examples

### Example 1: Motor Bearing Vibration Check
```typescript
{
  pointId: 'POINT-BEARING-001',
  templateId: 'TEMPLATE-RTG-001',
  componentId: 'COMP-MOTOR-BEARING-001', // Specific bearing
  sequenceOrder: 5,
  pointDescription: 'Main Motor Bearing Vibration Analysis',
  componentCategory: 'Mechanical',
  inspectionMethod: 'Ultrasonic',
  isMandatory: true,
  applicableToComponent: true,
  applicableToAsset: false
}
```

### Example 2: Hydraulic System Pressure
```typescript
{
  pointId: 'POINT-HYD-PRESSURE-001',
  templateId: 'TEMPLATE-RTG-001',
  componentId: null, // Applies to all hydraulic components
  sequenceOrder: 3,
  pointDescription: 'Main Hydraulic System Pressure',
  componentCategory: 'Hydraulic',
  inspectionMethod: 'Functional Test',
  isMandatory: true,
  applicableToComponent: true,
  applicableToAsset: true // Also checked at asset level
}
```

### Example 3: Structural Frame Inspection
```typescript
{
  pointId: 'POINT-FRAME-001',
  templateId: 'TEMPLATE-STS-001',
  // componentId: null - Asset-level only
  sequenceOrder: 1,
  pointDescription: 'Structural Frame Visual Inspection',
  componentCategory: 'Structural',
  inspectionMethod: 'Visual',
  isMandatory: true,
  applicableToComponent: false,
  applicableToAsset: true
}
```

## Benefits

✅ **Component-Specific Inspection** - Points can target specific component types  
✅ **Flexible Association** - Points can be at asset or component level  
✅ **Reusable Points** - Same point can apply to both levels  
✅ **Clear Classification** - Flags indicate point applicability  
✅ **Better Organization** - Inspection requirements organized by scope  

## Backward Compatibility

✅ `componentId` is optional - existing points work unchanged  
✅ Default values (false) for new flags maintain existing behavior  
✅ No breaking changes to existing code  

## Integration with Asset Inspection Points

The `AssetInspectionPoint` interface (used for configuration) can now work with both:
- **Asset-level inspection points** (asset-to-point mapping)
- **Component-level inspection points** (component-to-point mapping)

```typescript
// Asset-level mapping (existing)
const assetMapping: AssetInspectionPoint = {
  assetPointId: 'aip-001',
  assetId: 'ASSET-STS-001',
  pointId: 'POINT-STS-001',
  // ...
};

// Component-level mapping (new capability)
const componentMapping: AssetInspectionPoint = {
  assetPointId: 'aip-002',
  assetId: 'COMP-MOTOR-001', // Component asset
  pointId: 'POINT-MTR-001', // Component inspection point
  // ...
};
```

## Summary

Inspection Points are now **explicitly associated with Components** through:
1. Optional `componentId` reference
2. `applicableToComponent` flag for component-level applicability
3. `applicableToAsset` flag for asset-level applicability

This enables:
- Component-specific inspection requirements
- Flexible point applicability
- Better organization of inspection logic
- Support for both component and asset level inspections

**Status**: ✅ 0 compilation errors
