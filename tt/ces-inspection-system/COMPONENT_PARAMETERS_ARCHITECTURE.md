# Component Parameters Architecture Diagram

## System Architecture Comparison

### BEFORE: Asset Inspection Points (❌ Removed)

```
┌─────────────────────────────────────────────────────────────────┐
│                      CES Inspection System                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  Navigation Layer                                                │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ Admin Settings > Inspection Points                       │    │
│  │ /assets/inspection-points                               │    │
│  └─────────────────────────────────────────────────────────┘    │
│                              │                                    │
│                              ↓                                    │
│  Component Layer                                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ AssetInspectionPointsComponent                          │    │
│  │ - Display asset-level inspection points                 │    │
│  │ - Associate points with assets (not components)         │    │
│  │ - Configure asset parameters                           │    │
│  └─────────────────────────────────────────────────────────┘    │
│                              │                                    │
│                              ↓                                    │
│  Service Layer                                                   │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ AssetInspectionPointsService                            │    │
│  │ - getAssetInspectionPoints()                           │    │
│  │ - getAssetInspectionPointsByAsset(assetId)            │    │
│  │ - getAssetParameterThresholds()                        │    │
│  │ - getAssetInspectionPointConfiguration()              │    │
│  └─────────────────────────────────────────────────────────┘    │
│                              │                                    │
│                              ↓                                    │
│  Models                                                          │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ ❌ AssetInspectionPoint (REMOVED)                       │    │
│  │    - assetPointId, assetId, pointId, templateId        │    │
│  │                                                          │    │
│  │ ❌ AssetParameterThreshold (REMOVED)                    │    │
│  │    - assetParamId, assetPointId, assetId              │    │
│  │                                                          │    │
│  │ ❌ AssetInspectionPointConfig (REMOVED)                 │    │
│  │    - assetId, assetCode, assetType, sequence           │    │
│  │                                                          │    │
│  │ ⚠️  Data Model (ASSET-FOCUSED)                          │    │
│  │    Asset → Inspection Points → Parameters              │    │
│  │    ASSET-001 → POINT-001 → APT-001 → TH-001          │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

### AFTER: Component Parameters (✅ New)

```
┌─────────────────────────────────────────────────────────────────┐
│                      CES Inspection System                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  Navigation Layer                                                │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ Admin Settings > Component Parameters                   │    │
│  │ /components/parameters                                  │    │
│  └─────────────────────────────────────────────────────────┘    │
│                              │                                    │
│                              ↓                                    │
│  Component Layer                                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ ComponentParametersComponent (✅ NEW)                   │    │
│  │ - Display component-level parameters                    │    │
│  │ - Associate parameters with components                  │    │
│  │ - Configure component thresholds                        │    │
│  │ - Tabs:                                                 │    │
│  │   • Component Parameters                                │    │
│  │   • Parameter Thresholds                                │    │
│  │   • Parameter Indicators                                │    │
│  │   • Threshold Requirements                              │    │
│  │   • Configuration View                                  │    │
│  └─────────────────────────────────────────────────────────┘    │
│                              │                                    │
│                              ↓                                    │
│  Service Layer                                                   │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ ComponentParametersService (✅ NEW)                     │    │
│  │ - getComponentParameters()                              │    │
│  │ - getComponentParametersByComponent(id)                 │    │
│  │ - getComponentParametersByPoint(id)                     │    │
│  │ - getComponentParameterThresholds()                     │    │
│  │ - getComponentInspectionConfiguration()                 │    │
│  │ - getComponentInspectionConfigurations()                │    │
│  │ - CRUD operations (add, update, delete)                │    │
│  │ - Indicator and threshold management                    │    │
│  └─────────────────────────────────────────────────────────┘    │
│                              │                                    │
│                              ↓                                    │
│  Models                                                          │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ ✅ ComponentParameter (NEW)                             │    │
│  │    - componentParamId, componentId, pointId            │    │
│  │    - indicatorId, thresholdId, sequence                │    │
│  │    - isRequired, isActive, notes                        │    │
│  │                                                          │    │
│  │ ✅ ComponentParameterThreshold (NEW)                    │    │
│  │    - paramThresholdId, componentParamId                │    │
│  │    - componentId, pointId, sequence                    │    │
│  │    - indicatorId, thresholdId, isRequired              │    │
│  │                                                          │    │
│  │ ✅ ComponentInspectionConfig (NEW)                      │    │
│  │    - componentId, componentName, category              │    │
│  │    - pointId, inspectionMethod, sequence               │    │
│  │    - parameterThresholds[], notes                       │    │
│  │                                                          │    │
│  │ ✅ Data Model (COMPONENT-FOCUSED)                       │    │
│  │    Component → Inspection Points → Parameters           │    │
│  │    COMP-MOTOR-001 → POINT-001 → CP-001 → TH-001       │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## Data Flow Comparison

### OLD FLOW (Asset-Based) ❌
```
┌────────────┐
│   Asset    │
│ ASSET-001  │
└─────┬──────┘
      │
      ├───────┬───────────┬─────────┐
      │       │           │         │
      ↓       ↓           ↓         ↓
    Pt1      Pt2         Pt3       Pt4
  (Visual)  (Pressure) (Temp)   (Vibration)
      │       │           │         │
      └───┬───┴───────┬───┴────┬────┘
          │           │        │
          ↓           ↓        ↓
       PARAM1      PARAM2    PARAM3
      (Motor)     (Hydraulic)(Bearing)
```

### NEW FLOW (Component-Based) ✅
```
┌──────────────────┐
│   Component      │
│ COMP-MOTOR-001   │
└────────┬─────────┘
         │
         ├──────────┬──────────┐
         │          │          │
         ↓          ↓          ↓
       Pt1        Pt2        Pt3
     (Thermal)  (Vibration) (Load)
         │          │          │
         └────┬─────┴──────┬───┘
              │            │
              ↓            ↓
        CP-001 (Temp)  CP-002 (Vibration)
        │                │
        ├─IND-001        ├─IND-003
        └─TH-001         └─TH-003
```

---

## Service Methods Comparison

### OLD METHODS (Asset-Focused) ❌
```
getAssetInspectionPoints()
  → Returns: AssetInspectionPoint[]

getAssetInspectionPointsByAsset(assetId)
  → Returns: AssetInspectionPoint[]

addAssetInspectionPoint(point)
  → Creates: AssetInspectionPoint

updateAssetInspectionPoint(id, updates)
  → Modifies: AssetInspectionPoint

deleteAssetInspectionPoint(id)
  → Removes: AssetInspectionPoint

getAssetParameterThresholds()
  → Returns: AssetParameterThreshold[]

getAssetParameterThresholdsByAsset(assetId)
  → Returns: AssetParameterThreshold[]

getAssetInspectionPointConfiguration(assetId, pointId)
  → Returns: AssetInspectionPointConfig
```

### NEW METHODS (Component-Focused) ✅
```
getComponentParameters()
  → Returns: ComponentParameter[]

getComponentParametersByComponent(componentId)
  → Returns: ComponentParameter[]

getComponentParametersByPoint(pointId)
  → Returns: ComponentParameter[]

addComponentParameter(parameter)
  → Creates: ComponentParameter

updateComponentParameter(id, updates)
  → Modifies: ComponentParameter

deleteComponentParameter(id)
  → Removes: ComponentParameter

getComponentParameterThresholds()
  → Returns: ComponentParameterThreshold[]

getComponentParameterThresholdsByComponent(componentId)
  → Returns: ComponentParameterThreshold[]

getComponentParameterThresholdsByPoint(pointId)
  → Returns: ComponentParameterThreshold[]

getComponentInspectionConfiguration(componentId, pointId)
  → Returns: ComponentInspectionConfig

getComponentInspectionConfigurations(componentId)
  → Returns: ComponentInspectionConfig[]
```

---

## Data Model Mapping

### Models Evolution

```
OLD (Asset-Based)              NEW (Component-Based)
─────────────────              ──────────────────────

AssetInspectionPoint    →      ComponentParameter
├─ assetPointId                ├─ componentParamId
├─ assetId                      ├─ componentId
├─ pointId                      ├─ pointId
├─ templateId                   ├─ indicatorId
├─ sequence                     ├─ thresholdId
├─ isApplicable                 ├─ sequence
├─ isMandatory                  ├─ isRequired
├─ priority                     └─ isActive
└─ createdAt


AssetParameterThreshold →      ComponentParameterThreshold
├─ assetParamId                ├─ paramThresholdId
├─ assetPointId                ├─ componentParamId
├─ indicatorId                  ├─ indicatorId
├─ thresholdId                  ├─ thresholdId
├─ assetId                      ├─ componentId
├─ pointId                      ├─ pointId
├─ sequence                     ├─ sequence
├─ isRequired                   ├─ isRequired
├─ isActive                     └─ isActive
└─ notes


AssetInspectionPointConfig  →  ComponentInspectionConfig
├─ assetId                     ├─ componentId
├─ assetCode                   ├─ componentName
├─ assetType                   ├─ componentCode
├─ pointId                     ├─ category
├─ pointDescription            ├─ pointId
├─ inspectionMethod            ├─ pointDescription
├─ priority                    ├─ inspectionMethod
├─ sequence                    ├─ isMandatory
└─ parameterThresholds[]       ├─ sequence
                               ├─ parameterThresholds[]
                               └─ notes
```

---

## Component Hierarchy

### OLD (Asset-Centric)
```
Application
  ├─ AssetListComponent
  ├─ AssetSpecsComponent
  ├─ AssetInspectionPointsComponent (❌ DEPRECATED)
  │  └─ AssetInspectionPointsService
  └─ [Other Components]
```

### NEW (Component-Centric)
```
Application
  ├─ ComponentMasterComponent
  ├─ ComponentInspectionPointsComponent
  ├─ ComponentParametersComponent (✅ NEW)
  │  └─ ComponentParametersService (✅ NEW)
  ├─ AssetListComponent
  └─ [Other Components]
```

---

## Feature Comparison

| Feature | Old (Asset) | New (Component) |
|---------|-------------|-----------------|
| **Scope** | Asset-level | Component-level |
| **Parameters** | AssetParameterThreshold | ComponentParameter |
| **Thresholds** | Asset-based | Component-based |
| **Applicability** | Asset template | Component type |
| **Reusability** | Lower (asset-specific) | Higher (component-specific) |
| **Granularity** | Coarse | Fine |
| **Complexity** | Simple | More structured |
| **Component Support** | Limited | Full support |
| **Threshold Linking** | Indirect | Direct |
| **Configuration View** | Asset config | Component config |

---

## Routing Evolution

### OLD ROUTING ❌
```
/assets/inspection-points
  ↓
AssetInspectionPointsComponent
  ↓
AssetInspectionPointsService
  ↓
AssetInspectionPoint models
```

### NEW ROUTING ✅
```
/components/parameters
  ↓
ComponentParametersComponent
  ↓
ComponentParametersService
  ↓
ComponentParameter models
```

---

## File Structure Comparison

### OLD STRUCTURE ❌
```
src/app/
├─ services/
│  └─ asset-inspection-points.service.ts ❌
├─ components/
│  └─ asset-inspection-points/ ❌
│     └─ asset-inspection-points.component.ts
└─ models/
   ├─ AssetInspectionPoint ❌
   ├─ AssetParameterThreshold ❌
   └─ AssetInspectionPointConfig ❌
```

### NEW STRUCTURE ✅
```
src/app/
├─ services/
│  ├─ asset-inspection-points.service.ts (kept for reference)
│  └─ component-parameters.service.ts ✅ NEW
├─ components/
│  ├─ asset-inspection-points/ (deprecated)
│  │  └─ asset-inspection-points.component.ts
│  └─ component-parameters/ ✅ NEW
│     └─ component-parameters.component.ts
└─ models/
   ├─ ComponentParameter ✅ NEW
   ├─ ComponentParameterThreshold ✅ NEW
   └─ ComponentInspectionConfig ✅ NEW
```

---

## Summary

| Aspect | Old | New | Change |
|--------|-----|-----|--------|
| **Focus** | Asset level | Component level | More granular |
| **Models** | 3 interfaces | 3 interfaces | Restructured |
| **Service** | 1 service | 1 service (new) | Renamed & enhanced |
| **Component** | 1 component | 1 component (new) | Refactored |
| **Route** | /assets/inspection-points | /components/parameters | New path |
| **Navigation** | Admin > Inspection Points | Admin > Component Parameters | Updated label |
| **Status** | ❌ REMOVED | ✅ ACTIVE | Migration complete |

---

**Diagram Last Updated**: January 17, 2026
