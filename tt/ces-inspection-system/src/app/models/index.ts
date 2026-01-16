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

// Inspection Task Model
export interface InspectionTask {
  taskId: string;
  templateId: string;
  sequenceOrder: number;
  taskDescription: string;
  componentCategory: string;
  inspectionMethod: 'Visual' | 'Ultrasonic' | 'Functional Test' | 'NDT';
  isMandatory: boolean;
  taskThreshold?: string; // Threshold criteria for the task
}

// Control Point Model
export interface ControlPoint {
  controlId: string;
  taskId: string;
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
  taskId: string;
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
