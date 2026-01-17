# Asset Inspection Points - Quick Start Guide

## What You Can Do Now

### 1. Associate Assets with Inspection Points
Navigate to **Assets → Inspection Points** to define which inspection points are applicable to which assets.

**Example:**
- Asset: STS-001
- Point: POINT-001 (Motor Condition)
- Priority: Critical
- Mandatory: Yes

### 2. Create Parameter Indicators
Define measurable parameters that will be checked during inspection.

**Examples:**
- Operating Temperature (°C)
- Hydraulic Pressure (bar)
- Vibration Level (mm/s)
- Oil Leak Status (Visual)

### 3. Set Threshold Requirements
For each parameter, define acceptable ranges:
- **Normal Range**: 20-85°C
- **Warning Range**: 25-80°C (caution, monitor closely)
- **Critical Range**: 15-90°C (must stay within this)

### 4. Link Parameters to Asset Inspection Points
Connect specific parameters with thresholds to each asset-inspection point combination.

**Example Workflow:**
```
Asset (STS-001) 
  └─ Inspection Point (Motor Condition)
      ├─ Parameter: Operating Temperature
      │   └─ Threshold: 20-85°C (Warning: 25-80°C, Critical: 15-90°C)
      ├─ Parameter: Hydraulic Pressure
      │   └─ Threshold: 1-250 bar (Warning: 10-240, Critical: 0.5-280)
      └─ Parameter: Vibration Level
          └─ Threshold: 0-7.1 mm/s (Warning: 0.5-6, Critical: 0-10)
```

## User Interface Breakdown

### Tab 1: Asset Inspection Points
**Purpose**: Manage which inspection points apply to which assets

**Actions**:
- View all asset-point associations
- Filter by Asset ID
- Add new associations
- Edit existing associations (coming soon)
- Delete associations

**Key Fields**:
- Asset ID: Reference to the asset
- Point ID: Reference to inspection point
- Template ID: ITP template this belongs to
- Sequence: Order of inspection
- Priority: Critical/High/Medium/Low
- Mandatory: Whether this point must be inspected
- Applicable: Whether this point applies to this asset

### Tab 2: Parameter Indicators
**Purpose**: Define all measurable parameters

**Actions**:
- Create new parameter types
- View all indicators
- Edit existing indicators (coming soon)
- Delete indicators

**Key Fields**:
- Indicator Name: Display name
- Type: Temperature, Pressure, Vibration, Visual, etc.
- Unit: °C, bar, mm/s, Status, etc.
- Numeric: Whether it's a number or status
- Description: Explanation of what to measure

**Common Indicators to Create**:
```
1. Operating Temperature (Numeric, °C)
2. Hydraulic Pressure (Numeric, bar)
3. Vibration Level (Numeric, mm/s)
4. Oil Condition (Visual, Status)
5. Electrical Safety (Visual, Status)
6. Mechanical Wear (Visual, Percentage)
```

### Tab 3: Threshold Requirements
**Purpose**: Define acceptable ranges for parameters

**Actions**:
- Create threshold limits for each parameter
- View all thresholds
- Edit existing thresholds (coming soon)
- Delete thresholds

**Key Fields**:
- Indicator ID: Which parameter this threshold applies to
- Min/Max Values: Normal acceptable range
- Warning Range: When to issue warning (yellow alert)
- Critical Range: Absolute limits (red alert)
- Acceptable Tolerance: Margin of error allowed
- Unit: Measurement unit

**Example Thresholds**:
```
Temperature Threshold:
├─ Normal: 20-85°C
├─ Warning: 25-80°C (if outside, investigate)
└─ Critical: 15-90°C (if outside, stop operation)

Pressure Threshold:
├─ Normal: 1-250 bar
├─ Warning: 10-240 bar
└─ Critical: 0.5-280 bar
```

### Tab 4: Asset Parameters
**Purpose**: Link parameters and thresholds to asset inspection points

**Actions**:
- Create asset-specific parameter requirements
- View all asset parameter configurations
- Filter by Asset ID
- Edit parameters (coming soon)
- Delete parameters

**Key Fields**:
- Asset Point ID: Which asset-point combination
- Indicator ID: Which parameter
- Threshold ID: Which threshold applies
- Sequence: Order of measurement
- Required: Whether measurement is mandatory
- Active: Whether this parameter is in use
- Notes: Specific instructions for measurement

### Tab 5: Configuration View
**Purpose**: See complete inspection setup for an asset

**Actions**:
- Search by Asset ID
- View all inspection points for that asset
- See all parameters and thresholds for each point
- Check ranges, warnings, and critical limits

**Display Format**:
```
Asset: STS-001 - Point: POINT-001 [CRITICAL]
├─ Description: Motor condition inspection
├─ Method: Visual & Functional Test
├─ Sequence: 1
└─ Parameter Thresholds:
   ├─ Operating Temperature (Temperature, °C)
   │  └─ Range: 20-85°C | Warning: 25-80°C | Critical: 15-90°C
   ├─ Hydraulic Pressure (Pressure, bar)
   │  └─ Range: 1-250 bar | Warning: 10-240 | Critical: 0.5-280
   └─ Vibration Level (Vibration, mm/s)
      └─ Range: 0-7.1 mm/s | Warning: 0.5-6 | Critical: 0-10
```

## Step-by-Step Workflow

### Adding a New Asset's Inspection Configuration

**Step 1**: Add Asset Inspection Point
- Go to "Asset Inspection Points" tab
- Click "Add Asset Inspection Point"
- Enter: Asset ID, Point ID, Template ID, Sequence, Priority
- Check: Mandatory, Applicable checkboxes
- Click "Add Point"

**Step 2**: Create Parameter Indicators (if not exists)
- Go to "Parameter Indicators" tab
- Click "Add Parameter Indicator"
- Enter: Name, Type, Unit, Description
- Check: Numeric checkbox if applicable
- Click "Add Indicator"

**Step 3**: Create Threshold Requirements (if not exists)
- Go to "Threshold Requirements" tab
- Click "Add Threshold Requirement"
- Select: Indicator ID
- Enter: Min/Max, Warning ranges, Critical ranges, Unit
- Click "Add Threshold"

**Step 4**: Link Asset Parameter Thresholds
- Go to "Asset Parameters" tab
- Click "Add Asset Parameter Threshold"
- Enter: Asset Point ID, Indicator ID, Threshold ID, Asset ID, Point ID
- Set: Sequence, Required, Active, Notes
- Click "Add Asset Parameter"

**Step 5**: Review Configuration
- Go to "Configuration View" tab
- Enter: Asset ID in search
- View complete setup with all parameters and thresholds

## Data Entry Examples

### Example 1: Temperature Monitoring
```
Parameter: Operating Temperature
├─ Type: Temperature
├─ Unit: °C
├─ Numeric: Yes
└─ Description: Check motor operating temperature

Threshold:
├─ Min/Max: 20-85°C
├─ Warning: 25-80°C
├─ Critical: 15-90°C
└─ Tolerance: 2°C
```

### Example 2: Pressure Check
```
Parameter: Hydraulic Pressure
├─ Type: Pressure
├─ Unit: bar
├─ Numeric: Yes
└─ Description: Hydraulic system pressure during operation

Threshold:
├─ Min/Max: 1-250 bar
├─ Warning: 10-240 bar
├─ Critical: 0.5-280 bar
└─ Tolerance: 5 bar
```

### Example 3: Visual Inspection
```
Parameter: Oil Leak Detection
├─ Type: Visual
├─ Unit: Status
├─ Numeric: No
└─ Description: Visual inspection for oil leaks

Threshold:
├─ Min/Max: N/A (status-based)
├─ Description: No visible leaks observed
└─ Acceptable Tolerance: N/A
```

## Color Coding in UI

**Priority Badges**:
- 🔴 **Critical** (Red) - Must pass inspection, system failure risk
- 🟠 **High** (Orange) - Important, affects performance
- 🟡 **Medium** (Yellow) - Should check, minor impact
- 🟢 **Low** (Green) - Optional, advisory

**Status Indicators**:
- 🟢 **Active** - Currently in use
- 🔴 **Inactive** - Not in use, archived

## Tips & Best Practices

1. **Organize by Asset Type**: Create similar parameter sets for same asset types
2. **Use Standard Units**: Use industry-standard units (°C, bar, mm/s, etc.)
3. **Set Realistic Ranges**: Thresholds should match equipment manufacturer specs
4. **Document Notes**: Add specific instructions in the Notes field
5. **Review Regularly**: Update thresholds based on inspection results
6. **Reuse Indicators**: Create generic indicators once, link to multiple assets
7. **Priority Levels**: Use Critical for safety-critical items only

## What's Next?

Once you have asset inspection points configured, you can:
- Create Inspection Jobs based on these configurations
- Record actual measurements against these thresholds
- Generate alerts when measurements exceed critical thresholds
- Track inspection history and trends
- Create maintenance schedules based on findings

## Support

For questions or issues:
- Check the Asset Inspection Points Guide (ASSET_INSPECTION_POINTS_GUIDE.md)
- Review sample data in the mock data section
- Contact your system administrator
