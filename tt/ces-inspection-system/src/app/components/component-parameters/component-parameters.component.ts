import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ComponentParametersService } from '../../services/component-parameters.service';
import {
  ComponentParameter,
  ParameterIndicator,
  ThresholdRequirement,
  ComponentInspectionConfig,
  InspectionPoint
} from '../../models';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-component-parameters',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="component-parameters-container">
      <div class="header">
        <h2>Component Parameters Configuration</h2>
        <p class="subtitle">Manage component-specific parameters and inspection thresholds</p>
      </div>      <div class="tabs">
        <button [class.active]="activeTab === 'inspection-points'" (click)="activeTab = 'inspection-points'" class="tab-button">
          Inspection Points
        </button>
        <button [class.active]="activeTab === 'indicators'" (click)="activeTab = 'indicators'" class="tab-button">
          Parameter Indicators
        </button>
        <button [class.active]="activeTab === 'thresholds'" (click)="activeTab = 'thresholds'" class="tab-button">
          Threshold Requirements
        </button>
        <button [class.active]="activeTab === 'parameters'" (click)="activeTab = 'parameters'" class="tab-button">
          Component Parameters
        </button>
      </div>

      <!-- Inspection Points Tab -->
      <div class="tab-content" *ngIf="activeTab === 'inspection-points'">
        <div class="section">
          <h3>Inspection Points</h3>
          <p class="section-subtitle">Define inspection points applicable to components and assets</p>
          <div class="filter-bar">
            <input type="text" [(ngModel)]="inspectionPointFilter" placeholder="Filter by Point ID or Description..." class="form-control">
            <button (click)="inspectionPointFilter = ''" class="btn btn-sm btn-secondary">Clear</button>
          </div>
          <table class="table">
            <thead>
              <tr>
                <th>Point ID</th>
                <th>Template ID</th>
                <th>Component ID</th>
                <th>Description</th>
                <th>Category</th>
                <th>Inspection Method</th>
                <th>Mandatory</th>
                <th>Component</th>
                <th>Asset</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let point of (inspectionPoints$ | async)">
                <td><strong>{{ point.pointId }}</strong></td>
                <td>{{ point.templateId }}</td>
                <td>{{ point.componentId || 'N/A' }}</td>
                <td>{{ point.pointDescription }}</td>
                <td>
                  <span class="badge-category">{{ point.componentCategory }}</span>
                </td>
                <td>{{ point.inspectionMethod }}</td>
                <td>
                  <input type="checkbox" [checked]="point.isMandatory" disabled>
                </td>
                <td>
                  <input type="checkbox" [checked]="point.applicableToComponent" disabled>
                </td>
                <td>
                  <input type="checkbox" [checked]="point.applicableToAsset" disabled>
                </td>
                <td>
                  <button class="btn btn-sm btn-edit" (click)="editInspectionPoint(point)">Edit</button>
                  <button class="btn btn-sm btn-delete" (click)="deleteInspectionPoint(point.pointId)">Delete</button>
                </td>
              </tr>
            </tbody>
          </table>
          <div *ngIf="!(inspectionPoints$ | async)?.length" class="empty-state">
            <p>No inspection points defined yet</p>
          </div>
        </div>

        <div class="section add-section">
          <h4>Add Inspection Point</h4>
          <form (ngSubmit)="addInspectionPoint()" class="form-group">
            <div class="form-row">
              <input type="text" [(ngModel)]="newInspectionPoint.pointId" name="pointId" placeholder="Point ID" class="form-control" required>
              <input type="text" [(ngModel)]="newInspectionPoint.templateId" name="templateId" placeholder="Template ID" class="form-control" required>
            </div>
            <div class="form-row">
              <input type="text" [(ngModel)]="newInspectionPoint.componentId" name="componentId" placeholder="Component ID (optional)" class="form-control">
              <input type="number" [(ngModel)]="newInspectionPoint.sequenceOrder" name="sequenceOrder" placeholder="Sequence Order" class="form-control" required>
            </div>
            <div class="form-row">
              <textarea [(ngModel)]="newInspectionPoint.pointDescription" name="pointDescription" placeholder="Point Description" class="form-control" required style="flex: 1; min-height: 60px;"></textarea>
            </div>
            <div class="form-row">
              <select [(ngModel)]="newInspectionPoint.componentCategory" name="componentCategory" class="form-control" required>
                <option value="">Select Category</option>
                <option value="Structural">Structural</option>
                <option value="Electrical">Electrical</option>
                <option value="Mechanical">Mechanical</option>
                <option value="Hydraulic">Hydraulic</option>
                <option value="Software">Software</option>
                <option value="Other">Other</option>
              </select>
              <select [(ngModel)]="newInspectionPoint.inspectionMethod" name="inspectionMethod" class="form-control" required>
                <option value="">Select Method</option>
                <option value="Visual">Visual</option>
                <option value="Ultrasonic">Ultrasonic</option>
                <option value="Functional Test">Functional Test</option>
                <option value="NDT">NDT</option>
              </select>
            </div>
            <div class="form-row">
              <input type="text" [(ngModel)]="newInspectionPoint.pointThreshold" name="pointThreshold" placeholder="Point Threshold (optional)" class="form-control">
              <label style="flex: 0.5;">
                <input type="checkbox" [(ngModel)]="newInspectionPoint.isMandatory" name="isMandatory">
                Mandatory
              </label>
            </div>
            <div class="form-row">
              <label style="flex: 0.7;">
                <input type="checkbox" [(ngModel)]="newInspectionPoint.applicableToComponent" name="applicableToComponent">
                Applicable to Component
              </label>
              <label style="flex: 0.7;">
                <input type="checkbox" [(ngModel)]="newInspectionPoint.applicableToAsset" name="applicableToAsset">
                Applicable to Asset
              </label>
            </div>
            <button type="submit" class="btn btn-primary">Add Inspection Point</button>
          </form>
        </div>      </div>

      <!-- Parameter Indicators Tab -->
      <div class="tab-content" *ngIf="activeTab === 'indicators'">
        <div class="section">
          <h3>Parameter Indicators</h3>
          <table class="table">
            <thead>
              <tr>
                <th>Indicator ID</th>
                <th>Name</th>
                <th>Type</th>
                <th>Unit</th>
                <th>Numeric</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let indicator of (parameterIndicators$ | async)">
                <td><strong>{{ indicator.indicatorId }}</strong></td>
                <td>{{ indicator.indicatorName }}</td>
                <td>
                  <span class="badge-type">{{ indicator.indicatorType }}</span>
                </td>
                <td>{{ indicator.unit }}</td>
                <td>
                  <input type="checkbox" [checked]="indicator.isNumeric" disabled>
                </td>
                <td>{{ indicator.description }}</td>
                <td>
                  <button class="btn btn-sm btn-edit" (click)="editIndicator(indicator)">Edit</button>
                  <button class="btn btn-sm btn-delete" (click)="deleteIndicator(indicator.indicatorId)">Delete</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="section add-section">
          <h4>Add Parameter Indicator</h4>
          <form (ngSubmit)="addIndicator()" class="form-group">
            <div class="form-row">
              <input type="text" [(ngModel)]="newIndicator.indicatorName" name="indicatorName" placeholder="Indicator Name" class="form-control" required>
              <select [(ngModel)]="newIndicator.indicatorType" name="indicatorType" class="form-control" required>
                <option value="">Select Type</option>
                <option value="Temperature">Temperature</option>
                <option value="Pressure">Pressure</option>
                <option value="Vibration">Vibration</option>
                <option value="Noise">Noise</option>
                <option value="Visual">Visual</option>
                <option value="Electrical">Electrical</option>
                <option value="Mechanical">Mechanical</option>
                <option value="Chemical">Chemical</option>
              </select>
            </div>
            <div class="form-row">
              <input type="text" [(ngModel)]="newIndicator.unit" name="unit" placeholder="Unit (e.g., °C, bar)" class="form-control" required>
              <label>
                <input type="checkbox" [(ngModel)]="newIndicator.isNumeric" name="isNumeric">
                Numeric Indicator
              </label>
            </div>
            <div class="form-row">
              <input type="text" [(ngModel)]="newIndicator.description" name="description" placeholder="Description" class="form-control">
            </div>
            <button type="submit" class="btn btn-primary">Add Indicator</button>
          </form>
        </div>
      </div>

      <!-- Threshold Requirements Tab -->
      <div class="tab-content" *ngIf="activeTab === 'thresholds'">
        <div class="section">
          <h3>Threshold Requirements</h3>
          <table class="table table-small">
            <thead>
              <tr>
                <th>Threshold ID</th>
                <th>Indicator ID</th>
                <th>Min/Max</th>
                <th>Warning Range</th>
                <th>Critical Range</th>
                <th>Tolerance</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let threshold of (thresholdRequirements$ | async)">
                <td><strong>{{ threshold.thresholdId }}</strong></td>
                <td>{{ threshold.indicatorId }}</td>
                <td>{{ threshold.minimumValue }} / {{ threshold.maximumValue }} {{ threshold.unit }}</td>
                <td>{{ threshold.warningMin }} - {{ threshold.warningMax }}</td>
                <td>{{ threshold.criticalMin }} - {{ threshold.criticalMax }}</td>
                <td>{{ threshold.acceptableTolerance }} {{ threshold.unit }}</td>
                <td>
                  <span [class.active]="threshold.isActive" class="status-badge">
                    {{ threshold.isActive ? 'Active' : 'Inactive' }}
                  </span>
                </td>
                <td>
                  <button class="btn btn-sm btn-edit" (click)="editThreshold(threshold)">Edit</button>
                  <button class="btn btn-sm btn-delete" (click)="deleteThreshold(threshold.thresholdId)">Delete</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="section add-section">
          <h4>Add Threshold Requirement</h4>
          <form (ngSubmit)="addThreshold()" class="form-group">
            <div class="form-row">
              <input type="text" [(ngModel)]="newThreshold.indicatorId" name="indicatorId" placeholder="Indicator ID" class="form-control" required>
              <input type="number" [(ngModel)]="newThreshold.minimumValue" name="minimumValue" placeholder="Minimum Value" class="form-control">
            </div>
            <div class="form-row">
              <input type="number" [(ngModel)]="newThreshold.maximumValue" name="maximumValue" placeholder="Maximum Value" class="form-control">
              <input type="number" [(ngModel)]="newThreshold.warningMin" name="warningMin" placeholder="Warning Min" class="form-control">
            </div>
            <div class="form-row">
              <input type="number" [(ngModel)]="newThreshold.warningMax" name="warningMax" placeholder="Warning Max" class="form-control">
              <input type="number" [(ngModel)]="newThreshold.criticalMin" name="criticalMin" placeholder="Critical Min" class="form-control">
            </div>
            <div class="form-row">
              <input type="number" [(ngModel)]="newThreshold.criticalMax" name="criticalMax" placeholder="Critical Max" class="form-control">
              <input type="text" [(ngModel)]="newThreshold.unit" name="unit" placeholder="Unit" class="form-control" required>
            </div>
            <div class="form-row">
              <input type="number" [(ngModel)]="newThreshold.acceptableTolerance" name="acceptableTolerance" placeholder="Acceptable Tolerance" class="form-control">
              <input type="text" [(ngModel)]="newThreshold.description" name="description" placeholder="Description" class="form-control">
            </div>
            <div class="form-row">
              <label>
                <input type="checkbox" [(ngModel)]="newThreshold.isActive" name="isActive">
                Active
              </label>
            </div>
            <button type="submit" class="btn btn-primary">Add Threshold</button>
          </form>
        </div>
      </div>

      <!-- Component Parameters Tab -->
      <div class="tab-content" *ngIf="activeTab === 'parameters'">
        <div class="section">
          <h3>Component Parameters</h3>
          <p class="section-subtitle">Associate parameters with component inspection points</p>
          <div class="filter-bar">
            <input type="text" [(ngModel)]="componentFilter" placeholder="Filter by Component ID..." class="form-control">
            <button (click)="componentFilter = ''" class="btn btn-sm btn-secondary">Clear</button>
          </div>
          <table class="table">
            <thead>
              <tr>
                <th>Component Param ID</th>
                <th>Component ID</th>
                <th>Point ID</th>
                <th>Indicator ID</th>
                <th>Threshold ID</th>
                <th>Sequence</th>
                <th>Required</th>
                <th>Active</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let param of (componentParameters$ | async)">
                <td><strong>{{ param.componentParamId }}</strong></td>
                <td>{{ param.componentId }}</td>
                <td>{{ param.pointId }}</td>
                <td>{{ param.indicatorId }}</td>
                <td>{{ param.thresholdId }}</td>
                <td>{{ param.sequence }}</td>
                <td>
                  <input type="checkbox" [checked]="param.isRequired" disabled>
                </td>
                <td>
                  <input type="checkbox" [checked]="param.isActive" disabled>
                </td>
                <td>
                  <button class="btn btn-sm btn-edit" (click)="editComponentParam(param)">Edit</button>
                  <button class="btn btn-sm btn-delete" (click)="deleteComponentParam(param.componentParamId)">Delete</button>
                </td>
              </tr>
            </tbody>
          </table>
          <div *ngIf="!(componentParameters$ | async)?.length" class="empty-state">
            <p>No component parameters defined yet</p>
          </div>
        </div>

        <div class="section add-section">
          <h4>Add Component Parameter</h4>
          <form (ngSubmit)="addComponentParam()" class="form-group">
            <div class="form-row">
              <input type="text" [(ngModel)]="newComponentParam.componentId" name="componentId" placeholder="Component ID" class="form-control" required>
              <input type="text" [(ngModel)]="newComponentParam.pointId" name="pointId" placeholder="Point ID" class="form-control" required>
            </div>
            <div class="form-row">
              <input type="text" [(ngModel)]="newComponentParam.indicatorId" name="indicatorId" placeholder="Indicator ID" class="form-control" required>
              <input type="text" [(ngModel)]="newComponentParam.thresholdId" name="thresholdId" placeholder="Threshold ID" class="form-control" required>
            </div>
            <div class="form-row">
              <input type="number" [(ngModel)]="newComponentParam.sequence" name="sequence" placeholder="Sequence" class="form-control" required>
              <label>
                <input type="checkbox" [(ngModel)]="newComponentParam.isRequired" name="isRequired">
                Required
              </label>
              <label>
                <input type="checkbox" [(ngModel)]="newComponentParam.isActive" name="isActive">
                Active
              </label>
            </div>
            <div class="form-row">
              <textarea [(ngModel)]="newComponentParam.notes" name="notes" placeholder="Notes (optional)" class="form-control" style="flex: 1; min-height: 60px;"></textarea>
            </div>
            <button type="submit" class="btn btn-primary">Add Parameter</button>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .component-parameters-container {
      padding: 20px;
      background-color: #f5f5f5;
      min-height: 100vh;
    }

    .header {
      margin-bottom: 30px;
    }

    .header h2 {
      margin: 0 0 10px;
      color: #333;
    }

    .subtitle {
      margin: 0;
      color: #666;
      font-size: 14px;
    }

    .tabs {
      display: flex;
      gap: 10px;
      margin-bottom: 20px;
      border-bottom: 2px solid #ddd;
      flex-wrap: wrap;
    }

    .tab-button {
      padding: 12px 20px;
      border: none;
      background: none;
      cursor: pointer;
      color: #666;
      font-weight: 500;
      border-bottom: 3px solid transparent;
      margin-bottom: -2px;
      transition: all 0.3s ease;
      font-size: 13px;
    }

    .tab-button.active {
      color: #0066cc;
      border-bottom-color: #0066cc;
    }

    .tab-content {
      animation: fadeIn 0.3s ease;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    .section {
      background: white;
      padding: 20px;
      margin-bottom: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .section h3 {
      margin-top: 0;
      color: #333;
      border-bottom: 2px solid #0066cc;
      padding-bottom: 10px;
    }

    .section h4 {
      margin-top: 0;
      color: #555;
    }

    .section h5 {
      margin: 15px 0 10px;
      color: #666;
      font-size: 13px;
      font-weight: 600;
    }

    .filter-bar {
      display: flex;
      gap: 10px;
      margin-bottom: 15px;
      align-items: center;
    }

    .filter-bar .form-control {
      flex: 1;
      max-width: 400px;
    }

    .table {
      width: 100%;
      border-collapse: collapse;
      font-size: 13px;
    }

    .table-small {
      font-size: 12px;
    }

    .table thead {
      background-color: #f9f9f9;
    }

    .table th {
      padding: 12px;
      text-align: left;
      font-weight: 600;
      color: #333;
      border-bottom: 2px solid #ddd;
    }

    .table td {
      padding: 12px;
      border-bottom: 1px solid #eee;
    }

    .table tr:hover {
      background-color: #f5f5f5;
    }

    .badge-type {
      display: inline-block;
      padding: 4px 8px;
      background-color: #e3f2fd;
      color: #1976d2;
      border-radius: 4px;
      font-size: 11px;
      font-weight: 500;
    }

    .badge-category {
      display: inline-block;
      padding: 4px 8px;
      background-color: #f3e5f5;
      color: #7b1fa2;
      border-radius: 4px;
      font-size: 11px;
      font-weight: 500;
    }

    .status-badge {
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 11px;
      font-weight: 500;
    }

    .status-badge.active {
      background-color: #c8e6c9;
      color: #2e7d32;
    }

    .status-badge:not(.active) {
      background-color: #ffccbc;
      color: #d84315;
    }

    .add-section {
      margin-top: 20px;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 15px;
    }

    .form-row {
      display: flex;
      gap: 15px;
      align-items: center;
      flex-wrap: wrap;
    }

    .form-control {
      flex: 1;
      min-width: 150px;
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 13px;
    }

    .form-control:focus {
      outline: none;
      border-color: #0066cc;
      box-shadow: 0 0 0 2px rgba(0,102,204,0.1);
    }

    .btn {
      padding: 8px 16px;
      border: none;
      border-radius: 4px;
      font-size: 13px;
      cursor: pointer;
      font-weight: 500;
      transition: all 0.3s ease;
      white-space: nowrap;
    }

    .btn-primary {
      background-color: #0066cc;
      color: white;
    }

    .btn-primary:hover {
      background-color: #0052a3;
    }

    .btn-secondary {
      background-color: #666;
      color: white;
    }

    .btn-secondary:hover {
      background-color: #555;
    }

    .btn-sm {
      padding: 6px 12px;
      font-size: 11px;
    }

    .btn-edit {
      background-color: #0066cc;
      color: white;
      margin-right: 5px;
    }

    .btn-edit:hover {
      background-color: #0052a3;
    }

    .btn-delete {
      background-color: #d32f2f;
      color: white;
    }

    .btn-delete:hover {
      background-color: #b71c1c;
    }

    label {
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: 500;
      cursor: pointer;
      white-space: nowrap;
    }

    input[type="checkbox"] {
      cursor: pointer;
      width: auto;
    }

    .configurations-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 15px;
      margin-top: 20px;
    }

    .config-card {
      background: white;
      border: 1px solid #ddd;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      transition: box-shadow 0.3s ease;
    }

    .config-card:hover {
      box-shadow: 0 4px 8px rgba(0,0,0,0.15);
    }

    .config-header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 15px;
    }

    .config-header h4 {
      margin: 0;
      font-size: 14px;
      font-weight: 600;
    }

    .config-body {
      padding: 15px;
    }

    .info-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;
      font-size: 13px;
      padding-bottom: 8px;
      border-bottom: 1px solid #f0f0f0;
    }

    .info-row .label {
      font-weight: 600;
      color: #666;
      margin: 0;
    }

    .info-row span:last-child {
      color: #333;
    }

    .parameters-section {
      margin-top: 15px;
      padding-top: 15px;
      border-top: 2px solid #f0f0f0;
    }

    .parameter-item {
      margin-bottom: 12px;
      padding: 10px;
      background-color: #f9f9f9;
      border-left: 3px solid #0066cc;
      border-radius: 4px;
    }

    .param-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
      font-size: 12px;
    }

    .param-header strong {
      color: #333;
    }

    .param-type {
      background-color: #e3f2fd;
      color: #1976d2;
      padding: 2px 6px;
      border-radius: 3px;
      font-size: 10px;
      font-weight: 600;
    }

    .param-details {
      font-size: 11px;
    }

    .detail-row {
      display: flex;
      justify-content: space-between;
      color: #666;
      margin-bottom: 4px;
    }

    .empty-state {
      text-align: center;
      padding: 40px 20px;
      color: #999;
    }

    .empty-state p {
      margin: 0;
      font-size: 14px;
    }

    .section-subtitle {
      margin: 0 0 15px;
      color: #666;
      font-size: 13px;
      font-style: italic;
    }

    textarea.form-control {
      resize: vertical;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }
  `]
})
export class ComponentParametersComponent implements OnInit {  componentParameters$: Observable<ComponentParameter[]>;
  parameterIndicators$: Observable<ParameterIndicator[]>;
  thresholdRequirements$: Observable<ThresholdRequirement[]>;  inspectionPoints$: Observable<InspectionPoint[]>;

  activeTab: 'parameters' | 'indicators' | 'thresholds' | 'inspection-points' = 'inspection-points';

  componentFilter = '';
  inspectionPointFilter = '';

  newComponentParam: Partial<ComponentParameter> = {
    isRequired: true,
    isActive: true,
    sequence: 1
  };

  newIndicator: Partial<ParameterIndicator> = {
    isNumeric: true
  };

  newThreshold: Partial<ThresholdRequirement> = {
    isActive: true
  };

  newInspectionPoint: Partial<InspectionPoint> = {
    isMandatory: true,
    applicableToComponent: true,
    applicableToAsset: true,
    sequenceOrder: 1
  };  constructor(private componentParametersService: ComponentParametersService) {
    this.componentParameters$ = this.componentParametersService.getComponentParameters();
    this.parameterIndicators$ = this.componentParametersService.getParameterIndicators();
    this.thresholdRequirements$ = this.componentParametersService.getThresholdRequirements();
    this.inspectionPoints$ = this.componentParametersService.getInspectionPoints();
  }

  ngOnInit(): void {
    // Observables initialized in constructor
  }

  // Component Parameter Methods
  addComponentParam(): void {
    if (this.newComponentParam.componentId && this.newComponentParam.pointId && 
        this.newComponentParam.indicatorId && this.newComponentParam.thresholdId) {
      const param: ComponentParameter = {
        componentParamId: 'cp-' + Date.now(),
        componentId: this.newComponentParam.componentId!,
        pointId: this.newComponentParam.pointId!,
        indicatorId: this.newComponentParam.indicatorId!,
        thresholdId: this.newComponentParam.thresholdId!,
        sequence: this.newComponentParam.sequence || 1,
        isRequired: this.newComponentParam.isRequired || true,
        isActive: this.newComponentParam.isActive || true,
        notes: this.newComponentParam.notes,
        createdAt: new Date()
      };
      this.componentParametersService.addComponentParameter(param);
      this.newComponentParam = { isRequired: true, isActive: true, sequence: 1 };
      alert('Component parameter added successfully!');
    }
  }

  editComponentParam(param: ComponentParameter): void {
    alert('Edit component parameter functionality coming soon');
  }

  deleteComponentParam(componentParamId: string): void {
    if (confirm('Are you sure you want to delete this component parameter?')) {
      this.componentParametersService.deleteComponentParameter(componentParamId);
      alert('Component parameter deleted!');
    }
  }
  // Indicator Methods
  addIndicator(): void {
    if (this.newIndicator.indicatorName && this.newIndicator.indicatorType && this.newIndicator.unit) {
      const indicator: ParameterIndicator = {
        indicatorId: 'ind-' + Date.now(),
        indicatorName: this.newIndicator.indicatorName!,
        indicatorType: this.newIndicator.indicatorType as any,
        unit: this.newIndicator.unit!,
        description: this.newIndicator.description,
        isNumeric: this.newIndicator.isNumeric || true,
        createdAt: new Date()
      };
      this.componentParametersService.addParameterIndicator(indicator);
      this.newIndicator = { isNumeric: true };
      alert('Parameter indicator added successfully!');
    }
  }

  editIndicator(indicator: ParameterIndicator): void {
    alert('Edit indicator functionality coming soon');
  }

  deleteIndicator(indicatorId: string): void {
    if (confirm('Are you sure you want to delete this parameter indicator?')) {
      this.componentParametersService.deleteParameterIndicator(indicatorId);
      alert('Parameter indicator deleted!');
    }
  }

  // Threshold Methods
  addThreshold(): void {
    if (this.newThreshold.indicatorId && this.newThreshold.unit) {
      const threshold: ThresholdRequirement = {
        thresholdId: 'th-' + Date.now(),
        indicatorId: this.newThreshold.indicatorId!,
        minimumValue: this.newThreshold.minimumValue,
        maximumValue: this.newThreshold.maximumValue,
        warningMin: this.newThreshold.warningMin,
        warningMax: this.newThreshold.warningMax,
        criticalMin: this.newThreshold.criticalMin,
        criticalMax: this.newThreshold.criticalMax,
        acceptableTolerance: this.newThreshold.acceptableTolerance,
        unit: this.newThreshold.unit!,
        description: this.newThreshold.description,
        isActive: this.newThreshold.isActive || true,
        createdAt: new Date()
      };
      this.componentParametersService.addThresholdRequirement(threshold);
      this.newThreshold = { isActive: true };
      alert('Threshold requirement added successfully!');
    }
  }

  editThreshold(threshold: ThresholdRequirement): void {
    alert('Edit threshold functionality coming soon');
  }

  deleteThreshold(thresholdId: string): void {
    if (confirm('Are you sure you want to delete this threshold requirement?')) {
      this.componentParametersService.deleteThresholdRequirement(thresholdId);
      alert('Threshold requirement deleted!');
    }
  }

  // Inspection Point Methods
  addInspectionPoint(): void {
    if (this.newInspectionPoint.pointId && this.newInspectionPoint.templateId && 
        this.newInspectionPoint.pointDescription && this.newInspectionPoint.componentCategory &&
        this.newInspectionPoint.inspectionMethod) {
      const point: InspectionPoint = {
        pointId: this.newInspectionPoint.pointId!,
        templateId: this.newInspectionPoint.templateId!,
        componentId: this.newInspectionPoint.componentId,
        sequenceOrder: this.newInspectionPoint.sequenceOrder || 1,
        pointDescription: this.newInspectionPoint.pointDescription!,
        componentCategory: this.newInspectionPoint.componentCategory as any,
        inspectionMethod: this.newInspectionPoint.inspectionMethod as any,
        isMandatory: this.newInspectionPoint.isMandatory || true,
        pointThreshold: this.newInspectionPoint.pointThreshold,
        applicableToComponent: this.newInspectionPoint.applicableToComponent || true,
        applicableToAsset: this.newInspectionPoint.applicableToAsset || true
      };
      this.componentParametersService.addInspectionPoint(point);
      this.newInspectionPoint = { isMandatory: true, applicableToComponent: true, applicableToAsset: true, sequenceOrder: 1 };
      alert('Inspection point added successfully!');
    }
  }

  editInspectionPoint(point: InspectionPoint): void {
    alert('Edit inspection point functionality coming soon');
  }
  deleteInspectionPoint(pointId: string): void {
    if (confirm('Are you sure you want to delete this inspection point?')) {
      this.componentParametersService.deleteInspectionPoint(pointId);
      alert('Inspection point deleted!');
    }
  }
}
