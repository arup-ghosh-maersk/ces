// Terminal Location Model
export interface TerminalLocation {
  locationId: string;
  locationName: string;
  terminalCode: string;
  gpsCoordinates?: string;
}

// Asset Model
export interface Asset {
  assetId: string;
  locationId: string;
  assetCode: string;
  assetType: 'STS' | 'RTG' | 'RMG'; // Straddle Transfer, Rubber Tyred Gantry, Rail Mounted Gantry
  description: string;
  manufacturer?: string;
  modelNumber?: string;
  serialNumber?: string;
  acquisitionDate?: Date;
  warrantyExpiry?: Date;
  diagramUrl?: string; // 2D Diagram image URL
}

// ITP Template Model
export interface ITPTemplate {
  templateId: string;
  templateCode: string;
  title: string;
  revisionNo: number;
  applicableAssetType: 'STS' | 'RTG' | 'RMG';
  standardReference: string;
  approvedBy?: string;
  createdAt: Date;
  isActive: boolean;
  description?: string;
}

// Inspection Point Model - Associated with both Assets and Components
export interface InspectionPoint {
  pointId: string;
  templateId: string;
  componentId?: string; // Reference to specific component (optional - can be null for asset-level points)
  sequenceOrder: number;
  pointDescription: string;
  componentCategory: string;
  inspectionMethod: 'Visual' | 'Ultrasonic' | 'Functional Test' | 'NDT';
  isMandatory: boolean;
  pointThreshold?: string; // Threshold criteria for the point
  applicableToComponent: boolean; // Whether this point applies to component-level inspection
  applicableToAsset: boolean; // Whether this point applies to asset-level inspection
}

// Control Point Model
export interface ControlPoint {
  controlId: string;
  pointId: string;
  pointType: 'H' | 'W' | 'M' | 'R'; // H: Hold, W: Warning, M: Mandatory, R: Recommendation
  description: string;
  criteria: string;
  frequencyDays?: number;
}

// Inspection Job Model
export interface InspectionJob {
  jobId: string;
  assetId: string;
  templateId: string;
  jobType: 'Construction' | 'Commissioning' | 'Routine' | 'Special';
  inspectorId: string;
  startDate: Date;
  endDate?: Date;
  status: 'Draft' | 'In Progress' | 'Completed' | 'On Hold';
  notes?: string;
}

// Inspection Result Model
export interface InspectionResult {
  resultId: string;
  jobId: string;
  pointId: string;
  controlId?: string;
  result: 'Pass' | 'Fail' | 'N/A';
  observedValue?: string;
  expectedValue?: string;
  evidence?: string; // URL or file path to evidence
  inspectorNotes?: string;
  inspectionDate: Date;
  inspectorId: string;
}

// Issue Tracker Model (NCR - Non-Conformance Report)
export interface IssueNCR {
  issueId: string;
  jobId: string;
  resultId: string;
  issueType: 'NCR';
  title: string;
  description: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  status: 'Open' | 'In Review' | 'Resolved' | 'Closed';
  assignedTo?: string;
  createdBy: string;
  createdAt: Date;
  dueDate?: Date;
  resolution?: string;
}

// Punch List Item
export interface IssuePunchList {
  issueId: string;
  jobId: string;
  title: string;
  description: string;
  status: 'Open' | 'In Progress' | 'Completed';
  assignedTo?: string;
  createdBy: string;
  createdAt: Date;
  dueDate?: Date;
}

// Defect Item
export interface IssueDefect {
  issueId: string;
  assetId: string;
  title: string;
  description: string;
  defectType: 'Fatigue Crack' | 'Oil Leak' | 'Electrical Fault' | 'Mechanical Damage' | 'Other';
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  status: 'Open' | 'In Review' | 'Resolved' | 'Closed';
  assignedTo?: string;
  createdBy: string;
  createdAt: Date;
  dueDate?: Date;
  resolution?: string;
}

// Asset Technical Specifications Model
export interface AssetSpecs {
  specId: string;
  assetId: string;
  operatingPressure?: number; // in bar
  liftCapacity?: number; // in tonnes
  maxSpeed?: number; // in m/s
  trackGauge?: number; // in mm
  motorPower?: number; // in kW
  cycleTime?: number; // in seconds
  boomLength?: number; // in meters
  spreadsheetCapacity?: number; // in tonnes
  wheelDiameter?: number; // in mm
  tireCondition?: string;
  maintenanceHistory?: string;
  lastServiceDate?: Date;
  nextServiceDate?: Date;
  certifications?: string; // comma-separated
  createdAt: Date;
  updatedAt?: Date;
}

// Component Master Model
export interface ComponentMaster {
  componentId: string;
  componentCode: string;
  componentName: string;
  assetId: string; // Parent asset reference
  assetType: 'STS' | 'RTG' | 'RMG'; // Applicable asset type
  category: 'Structural' | 'Electrical' | 'Mechanical' | 'Hydraulic' | 'Software' | 'Other';
  description?: string;
  manufacturer?: string;
  modelNumber?: string;
  serialNumber?: string;
  warrantyExpiry?: Date;
  criticality: 'Critical' | 'High' | 'Medium' | 'Low';
  parentComponentId?: string; // For sub-assemblies
  specifications?: string; // JSON or text specs
  maintenanceIntervalDays?: number;
  lastMaintenanceDate?: Date;
  nextMaintenanceDate?: Date;
  createdAt: Date;
  updatedAt?: Date;
  isActive: boolean;
  diagramUrl?: string; // 2D Diagram image URL
}


// Component Inspection Point Mapping Model
export interface ComponentInspectionPoint {
  mappingId: string;
  pointId: string;
  componentId: string;
  subComponentId?: string;
  applicableToComponent: boolean;
  applicableToSubComponent: boolean;
  inspectionSequence: number;
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  createdAt: Date;
  updatedAt?: Date;
}

// Component Hierarchy Model
export interface ComponentHierarchy {
  hierarchyId: string;
  parentComponentId: string;
  childComponentId: string;
  relationshipType: 'Assembly' | 'SubAssembly' | 'Part';
  sequence: number;
  isActive: boolean;
}

// Component Point Coverage Model
export interface ComponentPointCoverage {
  coverageId: string;
  componentId: string;
  totalInspectionPoints: number;
  mappedPoints: number;
  coveragePercentage: number;
  lastUpdated: Date;
}

// User Model
export interface User {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'Admin' | 'Inspector' | 'Approver' | 'Viewer';
  isActive: boolean;
}

// Parameter Indicator Model - defines measurable parameters for inspection points
export interface ParameterIndicator {
  indicatorId: string;
  indicatorName: string;
  indicatorType: 'Temperature' | 'Pressure' | 'Vibration' | 'Noise' | 'Visual' | 'Electrical' | 'Mechanical' | 'Chemical' | 'Other';
  unit: string; // e.g., 'kW', 'bar', 'Hz', '%', etc.
  description?: string;
  isNumeric: boolean;
  createdAt: Date;
}

// Threshold Requirement Model - defines acceptable ranges and limits
export interface ThresholdRequirement {
  thresholdId: string;
  indicatorId: string;
  minimumValue?: number;
  maximumValue?: number;
  warningMin?: number;
  warningMax?: number;
  criticalMin?: number;
  criticalMax?: number;
  acceptableTolerance?: number;
  unit: string;
  description?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt?: Date;
}

// Component Parameter Mapping - associates parameters and thresholds with component inspection points
export interface ComponentParameter {
  componentParamId: string;
  componentId: string;
  pointId: string;
  indicatorId: string;
  thresholdId: string;
  sequence: number;
  isRequired: boolean;
  isActive: boolean;
  notes?: string;
  createdAt: Date;
  updatedAt?: Date;
}

// Component Inspection Configuration - comprehensive view combining component, inspection points, and parameters
export interface ComponentInspectionConfig {
  componentId: string;
  componentName: string;
  componentCode: string;
  category: 'Structural' | 'Electrical' | 'Mechanical' | 'Hydraulic' | 'Software' | 'Other';
  pointId: string;
  pointDescription: string;
  inspectionMethod: 'Visual' | 'Ultrasonic' | 'Functional Test' | 'NDT';
  isMandatory: boolean;
  sequence: number;
  parameterThresholds: {
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
  }[];
  notes?: string;
}
