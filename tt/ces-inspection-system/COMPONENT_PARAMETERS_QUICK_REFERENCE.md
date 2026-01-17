# Component Parameters - Quick Reference Guide

## Overview

The Component Parameters feature replaces the deprecated Asset Inspection Points system. It enables management of component-specific parameters and thresholds for the CES Inspection System.

## Key Differences

### Asset Inspection Points (Old) ❌
- Managed inspection points at the **asset level**
- Associated parameters with assets
- Used `AssetInspectionPoint`, `AssetParameterThreshold`, `AssetInspectionPointConfig`

### Component Parameters (New) ✅
- Manages inspection parameters at the **component level**
- Associates parameters with specific equipment components
- Uses `ComponentParameter`, `ComponentParameterThreshold`, `ComponentInspectionConfig`

## Data Models

### ComponentParameter
```typescript
interface ComponentParameter {
  componentParamId: string;      // Unique identifier
  componentId: string;            // Which component this applies to
  pointId: string;                // Which inspection point
  indicatorId: string;            // What parameter to measure
  thresholdId: string;            // Acceptable range
  sequence: number;               // Execution order
  isRequired: boolean;            // Must be checked
  isActive: boolean;              // Currently in use
  notes?: string;                 // Additional details
  createdAt: Date;
  updatedAt?: Date;
}
```

### ComponentParameterThreshold
```typescript
interface ComponentParameterThreshold {
  paramThresholdId: string;       // Unique identifier
  componentParamId: string;       // Links to component parameter
  indicatorId: string;            // Measured parameter
  thresholdId: string;            // Range definition
  componentId: string;            // Component being inspected
  pointId: string;                // Inspection point
  sequence: number;               // Order
  isRequired: boolean;
  isActive: boolean;
  notes?: string;
  createdAt: Date;
  updatedAt?: Date;
}
```

### ComponentInspectionConfig
```typescript
interface ComponentInspectionConfig {
  componentId: string;
  componentName: string;
  componentCode: string;
  category: 'Structural' | 'Electrical' | 'Mechanical' | 'Hydraulic' | 'Software' | 'Other';
  pointId: string;
  pointDescription: string;
  inspectionMethod: 'Visual' | 'Ultrasonic' | 'Functional Test' | 'NDT';
  isMandatory: boolean;
  sequence: number;
  parameterThresholds: [
    {
      indicatorId: string;
      indicatorName: string;
      indicatorType: string;
      unit: string;
      minimumValue?: number;
      maximumValue?: number;
      warningMin?: number;
      warningMax?: number;
      criticalMin?: number;
      criticalMax?: number;
    }
  ];
  notes?: string;
}
```

## Service Usage

### ComponentParametersService

```typescript
// Inject the service
constructor(private componentParametersService: ComponentParametersService) {}

// Get all component parameters
this.componentParametersService.getComponentParameters().subscribe(params => {
  console.log(params);
});

// Get parameters for a specific component
this.componentParametersService.getComponentParametersByComponent('COMP-MOTOR-001').subscribe(params => {
  console.log(params);
});

// Get parameters for a specific inspection point
this.componentParametersService.getComponentParametersByPoint('POINT-001').subscribe(params => {
  console.log(params);
});

// Add a new parameter
const newParam: ComponentParameter = {
  componentParamId: 'cp-' + Date.now(),
  componentId: 'COMP-MOTOR-001',
  pointId: 'POINT-001',
  indicatorId: 'IND-001',
  thresholdId: 'TH-001',
  sequence: 1,
  isRequired: true,
  isActive: true,
  notes: 'Monitor temperature',
  createdAt: new Date()
};
this.componentParametersService.addComponentParameter(newParam);

// Update a parameter
this.componentParametersService.updateComponentParameter('cp-001', {
  notes: 'Updated notes'
});

// Delete a parameter
this.componentParametersService.deleteComponentParameter('cp-001');

// Get parameter thresholds
this.componentParametersService.getComponentParameterThresholds().subscribe(thresholds => {
  console.log(thresholds);
});

// Get configuration for a component
this.componentParametersService.getComponentInspectionConfiguration('COMP-MOTOR-001', 'POINT-001').subscribe(config => {
  console.log(config);
});

// Get all configurations for a component
this.componentParametersService.getComponentInspectionConfigurations('COMP-MOTOR-001').subscribe(configs => {
  console.log(configs);
});
```

## Component Usage

```typescript
import { ComponentParametersComponent } from './components/component-parameters/component-parameters.component';

// Component is standalone and can be used in routing
export const routes: Routes = [
  {
    path: 'components/parameters',
    component: ComponentParametersComponent
  }
];
```

## Navigation

**Menu Path**: Admin Settings → Component Parameters

**Route**: `/components/parameters`

**Component**: `ComponentParametersComponent`

## Features

### Tabs Available

1. **Component Parameters** - Manage parameter associations
2. **Parameter Thresholds** - Configure threshold ranges
3. **Parameter Indicators** - Define measurable indicators
4. **Threshold Requirements** - Set acceptance criteria
5. **Configuration View** - View complete inspection configurations

### Operations

- ✅ View all component parameters
- ✅ Filter by component ID
- ✅ Add new component parameters
- ✅ Edit existing parameters (UI ready)
- ✅ Delete parameters
- ✅ View parameter thresholds
- ✅ Configure threshold requirements
- ✅ View complete component inspection configuration

## Mock Data Examples

### Sample Component Parameters
```
COMP-MOTOR-001 → POINT-001 → IND-001 (Temperature)
COMP-MOTOR-001 → POINT-001 → IND-002 (Pressure)
COMP-BEARING-001 → POINT-002 → IND-003 (Vibration)
COMP-HYDRAULIC-001 → POINT-003 → IND-002 (Pressure)
```

### Sample Parameter Indicators
- Operating Temperature (°C)
- System Pressure (bar)
- Vibration Level (mm/s)
- Oil Leak Detection (Status)
- Electrical Resistance (Ω)

### Sample Thresholds
- Temperature: 20-85°C (Warning: 25-80°C, Critical: 15-90°C)
- Pressure: 1-250 bar (Warning: 10-240 bar, Critical: 0.5-280 bar)
- Vibration: 0-7.1 mm/s (Warning: 0.5-6 mm/s, Critical: 0-10 mm/s)

## Files Involved

### Core Files
- `src/app/models/index.ts` - Model definitions
- `src/app/services/component-parameters.service.ts` - Data service
- `src/app/components/component-parameters/component-parameters.component.ts` - UI component
- `src/app/app.routes.ts` - Route configuration
- `src/app/app.component.ts` - Navigation

### Deprecated Files (Do Not Use)
- `src/app/services/asset-inspection-points.service.ts` ❌
- `src/app/components/asset-inspection-points/` ❌

## Supported Component Categories

- **Structural** - Frame, chassis, supports
- **Electrical** - Motors, generators, controls
- **Mechanical** - Bearings, gears, couplings
- **Hydraulic** - Pumps, cylinders, systems
- **Software** - Controllers, firmware, PLCs
- **Other** - Miscellaneous components

## Inspection Methods

- **Visual** - Direct observation
- **Ultrasonic** - Ultrasonic testing
- **Functional Test** - Performance testing
- **NDT** - Non-destructive testing

## Development Workflow

### Adding a New Feature

1. **Import types**
   ```typescript
   import { ComponentParameter, ComponentInspectionConfig } from '../../models';
   ```

2. **Inject service**
   ```typescript
   constructor(private componentParamsService: ComponentParametersService) {}
   ```

3. **Subscribe to observables**
   ```typescript
   this.parameters$ = this.componentParamsService.getComponentParameters();
   ```

4. **Display in template**
   ```html
   <tr *ngFor="let param of (parameters$ | async)">
     <td>{{ param.componentParamId }}</td>
   </tr>
   ```

### Testing

```powershell
# Run tests
npm run test

# Build
npm run build

# Start dev server
npm run start
```

## Troubleshooting

### Issue: Component parameters not displaying
- **Check**: Is the service injected properly?
- **Check**: Are observables being subscribed?
- **Check**: Does the component import the service?

### Issue: Data not persisting
- **Note**: Current implementation uses in-memory mock data
- **Action**: Replace with backend API calls when ready

### Issue: Compilation errors
- **Check**: Are all interfaces imported from models?
- **Check**: Does service exist in services folder?
- **Check**: Is component imported in routing?

## Best Practices

1. **Always use observables** - Follow reactive programming patterns
2. **Filter data on display** - Use angular pipes for performance
3. **Validate inputs** - Check required fields before submission
4. **Handle errors gracefully** - Provide user feedback
5. **Keep components focused** - Single responsibility principle
6. **Document changes** - Update this guide when adding features

## Related Documentation

- [Component Parameters Migration Report](./COMPONENT_PARAMETERS_MIGRATION_REPORT.md)
- [Models Reference](./src/app/models/index.ts)
- [Service Reference](./src/app/services/component-parameters.service.ts)
- [Component Reference](./src/app/components/component-parameters/component-parameters.component.ts)

## Support

For issues or questions:
1. Check this guide first
2. Review code comments in source files
3. Check the migration report
4. Review unit tests in component

---

**Last Updated**: January 17, 2026
**Status**: ✅ Active
**Version**: 1.0
