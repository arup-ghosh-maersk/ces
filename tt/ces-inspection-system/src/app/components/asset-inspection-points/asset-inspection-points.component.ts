import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AssetInspectionPointsService } from '../../services/asset-inspection-points.service';
import {
  AssetInspectionPoint,
  ParameterIndicator,
  ThresholdRequirement,
  AssetParameterThreshold,
  AssetInspectionPointConfig
} from '../../models';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-asset-inspection-points',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="asset-inspection-points-container">
      <div class="header">
        <h2>Asset Inspection Points Configuration</h2>
        <p class="subtitle">Associate inspection points with assets and define parameter thresholds</p>
      </div>      <div class="tabs">
        <button [class.active]="activeTab === 'points'" (click)="activeTab = 'points'" class="tab-button">
          Asset Inspection Points
        </button>
        <button [class.active]="activeTab === 'component-points'" (click)="activeTab = 'component-points'" class="tab-button">
          Component Inspection Points
        </button>
        <button [class.active]="activeTab === 'indicators'" (click)="activeTab = 'indicators'" class="tab-button">
          Parameter Indicators
        </button>
        <button [class.active]="activeTab === 'thresholds'" (click)="activeTab = 'thresholds'" class="tab-button">
          Threshold Requirements
        </button>
        <button [class.active]="activeTab === 'parameters'" (click)="activeTab = 'parameters'" class="tab-button">
          Asset Parameters
        </button>
        <button [class.active]="activeTab === 'config'" (click)="activeTab = 'config'" class="tab-button">
          Configuration View
        </button>
      </div>

      <!-- Asset Inspection Points Tab -->
      <div class="tab-content" *ngIf="activeTab === 'points'">
        <div class="section">
          <h3>Asset Inspection Points</h3>
          <div class="filter-bar">
            <input type="text" [(ngModel)]="assetFilter" placeholder="Filter by Asset ID..." class="form-control">
            <button (click)="assetFilter = ''" class="btn btn-sm btn-secondary">Clear</button>
          </div>
          <table class="table">
            <thead>
              <tr>
                <th>Asset Point ID</th>
                <th>Asset ID</th>
                <th>Point ID</th>
                <th>Template ID</th>
                <th>Sequence</th>
                <th>Priority</th>
                <th>Mandatory</th>
                <th>Applicable</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let point of (assetInspectionPoints$ | async)">
                <td><strong>{{ point.assetPointId }}</strong></td>
                <td>{{ point.assetId }}</td>
                <td>{{ point.pointId }}</td>
                <td>{{ point.templateId }}</td>
                <td>{{ point.sequence }}</td>
                <td>
                  <span [ngClass]="'priority-' + point.priority.toLowerCase()" class="priority-badge">
                    {{ point.priority }}
                  </span>
                </td>
                <td>
                  <input type="checkbox" [checked]="point.isMandatory" disabled>
                </td>
                <td>
                  <input type="checkbox" [checked]="point.isApplicable" disabled>
                </td>
                <td>
                  <button class="btn btn-sm btn-edit" (click)="editAssetPoint(point)">Edit</button>
                  <button class="btn btn-sm btn-delete" (click)="deleteAssetPoint(point.assetPointId)">Delete</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="section add-section">
          <h4>Add Asset Inspection Point</h4>
          <form (ngSubmit)="addAssetPoint()" class="form-group">
            <div class="form-row">
              <input type="text" [(ngModel)]="newAssetPoint.assetId" name="assetId" placeholder="Asset ID" class="form-control" required>
              <input type="text" [(ngModel)]="newAssetPoint.pointId" name="pointId" placeholder="Point ID" class="form-control" required>
            </div>
            <div class="form-row">
              <input type="text" [(ngModel)]="newAssetPoint.templateId" name="templateId" placeholder="Template ID" class="form-control" required>
              <input type="number" [(ngModel)]="newAssetPoint.sequence" name="sequence" placeholder="Sequence" class="form-control" required>
            </div>
            <div class="form-row">
              <select [(ngModel)]="newAssetPoint.priority" name="priority" class="form-control" required>
                <option value="">Select Priority</option>
                <option value="Critical">Critical</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
              <label>
                <input type="checkbox" [(ngModel)]="newAssetPoint.isMandatory" name="isMandatory">
                Mandatory
              </label>
              <label>
                <input type="checkbox" [(ngModel)]="newAssetPoint.isApplicable" name="isApplicable">
                Applicable
              </label>
            </div>            <button type="submit" class="btn btn-primary">Add Point</button>
          </form>
        </div>
      </div>

      <!-- Component Inspection Points Tab -->
      <div class="tab-content" *ngIf="activeTab === 'component-points'">
        <div class="section">
          <h3>Component Inspection Points</h3>
          <p class="section-subtitle">Inspection points applicable to specific equipment components (motors, bearings, hydraulic systems, etc.)</p>
          <div class="filter-bar">
            <input type="text" [(ngModel)]="componentFilter" placeholder="Filter by Component Category..." class="form-control">
            <button (click)="componentFilter = ''" class="btn btn-sm btn-secondary">Clear</button>
          </div>
          <table class="table">
            <thead>
              <tr>
                <th>Point ID</th>
                <th>Template ID</th>
                <th>Component Category</th>
                <th>Sequence</th>
                <th>Description</th>
                <th>Inspection Method</th>
                <th>Mandatory</th>
                <th>Threshold</th>
                <th>Actions</th>
              </tr>
            </thead>            <tbody>
              <tr *ngFor="let point of getFilteredComponentPoints()">
                <td><strong>{{ point.pointId }}</strong></td>
                <td>{{ point.templateId }}</td>
                <td>
                  <span class="badge-category">{{ point.componentCategory }}</span>
                </td>
                <td>{{ point.sequenceOrder }}</td>
                <td>{{ point.pointDescription }}</td>
                <td>{{ point.inspectionMethod }}</td>
                <td>
                  <input type="checkbox" [checked]="point.isMandatory" disabled>
                </td>
                <td class="threshold-cell">{{ point.pointThreshold || 'N/A' }}</td>
                <td>
                  <button class="btn btn-sm btn-edit" (click)="editComponentPoint(point)">Edit</button>
                  <button class="btn btn-sm btn-delete" (click)="deleteComponentPoint(point.pointId)">Delete</button>
                </td>
              </tr>
            </tbody>
          </table>
          <div *ngIf="componentInspectionPoints.length === 0" class="empty-state">
            <p>No component inspection points defined yet</p>
          </div>
        </div>

        <div class="section add-section">
          <h4>Add Component Inspection Point</h4>
          <form (ngSubmit)="addComponentPoint()" class="form-group">
            <div class="form-row">
              <input type="text" [(ngModel)]="newComponentPoint.pointId" name="pointId" placeholder="Point ID" class="form-control" required>
              <input type="text" [(ngModel)]="newComponentPoint.templateId" name="templateId" placeholder="Template ID" class="form-control" required>
            </div>
            <div class="form-row">
              <input type="text" [(ngModel)]="newComponentPoint.componentCategory" name="componentCategory" placeholder="Component Category (e.g., Motor, Bearing, Pump)" class="form-control" required>
              <input type="number" [(ngModel)]="newComponentPoint.sequenceOrder" name="sequenceOrder" placeholder="Sequence Order" class="form-control" required>
            </div>
            <div class="form-row">
              <textarea [(ngModel)]="newComponentPoint.pointDescription" name="pointDescription" placeholder="Point Description" class="form-control" required style="min-height: 80px; flex: 1;"></textarea>
            </div>
            <div class="form-row">
              <select [(ngModel)]="newComponentPoint.inspectionMethod" name="inspectionMethod" class="form-control" required>
                <option value="">Select Inspection Method</option>
                <option value="Visual">Visual</option>
                <option value="Ultrasonic">Ultrasonic</option>
                <option value="Functional Test">Functional Test</option>
                <option value="NDT">NDT (Non-Destructive Testing)</option>
              </select>
              <input type="text" [(ngModel)]="newComponentPoint.pointThreshold" name="pointThreshold" placeholder="Threshold Criteria (optional)" class="form-control">
            </div>
            <div class="form-row">
              <label>
                <input type="checkbox" [(ngModel)]="newComponentPoint.isMandatory" name="isMandatory">
                Mandatory Inspection
              </label>
              <label>
                <input type="checkbox" [(ngModel)]="newComponentPoint.applicableToComponent" name="applicableToComponent" checked>
                Applicable to Component
              </label>
            </div>
            <button type="submit" class="btn btn-primary">Add Component Point</button>
          </form>
        </div>
      </div>

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
                <option value="Other">Other</option>
              </select>
            </div>
            <div class="form-row">
              <input type="text" [(ngModel)]="newIndicator.unit" name="unit" placeholder="Unit (e.g., °C, bar, mm/s)" class="form-control" required>
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
              <input type="number" [(ngModel)]="newThreshold.maximumValue" name="maximumValue" placeholder="Maximum Value" class="form-control">
            </div>
            <div class="form-row">
              <input type="number" [(ngModel)]="newThreshold.warningMin" name="warningMin" placeholder="Warning Min" class="form-control">
              <input type="number" [(ngModel)]="newThreshold.warningMax" name="warningMax" placeholder="Warning Max" class="form-control">
            </div>
            <div class="form-row">
              <input type="number" [(ngModel)]="newThreshold.criticalMin" name="criticalMin" placeholder="Critical Min" class="form-control">
              <input type="number" [(ngModel)]="newThreshold.criticalMax" name="criticalMax" placeholder="Critical Max" class="form-control">
            </div>
            <div class="form-row">
              <input type="text" [(ngModel)]="newThreshold.unit" name="unit" placeholder="Unit" class="form-control" required>
              <input type="number" [(ngModel)]="newThreshold.acceptableTolerance" name="acceptableTolerance" placeholder="Acceptable Tolerance" class="form-control">
            </div>
            <div class="form-row">
              <input type="text" [(ngModel)]="newThreshold.description" name="description" placeholder="Description" class="form-control">
              <label>
                <input type="checkbox" [(ngModel)]="newThreshold.isActive" name="isActive">
                Active
              </label>
            </div>
            <button type="submit" class="btn btn-primary">Add Threshold</button>
          </form>
        </div>
      </div>

      <!-- Asset Parameters Tab -->
      <div class="tab-content" *ngIf="activeTab === 'parameters'">
        <div class="section">
          <h3>Asset Parameter Thresholds</h3>
          <div class="filter-bar">
            <input type="text" [(ngModel)]="assetParamFilter" placeholder="Filter by Asset ID..." class="form-control">
            <button (click)="assetParamFilter = ''" class="btn btn-sm btn-secondary">Clear</button>
          </div>
          <table class="table table-small">
            <thead>
              <tr>
                <th>Asset Param ID</th>
                <th>Asset Point ID</th>
                <th>Indicator ID</th>
                <th>Threshold ID</th>
                <th>Asset ID</th>
                <th>Required</th>
                <th>Active</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let param of (assetParameterThresholds$ | async)">
                <td><strong>{{ param.assetParamId }}</strong></td>
                <td>{{ param.assetPointId }}</td>
                <td>{{ param.indicatorId }}</td>
                <td>{{ param.thresholdId }}</td>
                <td>{{ param.assetId }}</td>
                <td>
                  <input type="checkbox" [checked]="param.isRequired" disabled>
                </td>
                <td>
                  <input type="checkbox" [checked]="param.isActive" disabled>
                </td>
                <td>
                  <button class="btn btn-sm btn-edit" (click)="editAssetParam(param)">Edit</button>
                  <button class="btn btn-sm btn-delete" (click)="deleteAssetParam(param.assetParamId)">Delete</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="section add-section">
          <h4>Add Asset Parameter Threshold</h4>
          <form (ngSubmit)="addAssetParam()" class="form-group">
            <div class="form-row">
              <input type="text" [(ngModel)]="newAssetParam.assetPointId" name="assetPointId" placeholder="Asset Point ID" class="form-control" required>
              <input type="text" [(ngModel)]="newAssetParam.indicatorId" name="indicatorId" placeholder="Indicator ID" class="form-control" required>
            </div>
            <div class="form-row">
              <input type="text" [(ngModel)]="newAssetParam.thresholdId" name="thresholdId" placeholder="Threshold ID" class="form-control" required>
              <input type="text" [(ngModel)]="newAssetParam.assetId" name="assetId" placeholder="Asset ID" class="form-control" required>
            </div>
            <div class="form-row">
              <input type="text" [(ngModel)]="newAssetParam.pointId" name="pointId" placeholder="Point ID" class="form-control" required>
              <input type="number" [(ngModel)]="newAssetParam.sequence" name="sequence" placeholder="Sequence" class="form-control" required>
            </div>
            <div class="form-row">
              <label>
                <input type="checkbox" [(ngModel)]="newAssetParam.isRequired" name="isRequired">
                Required
              </label>
              <label>
                <input type="checkbox" [(ngModel)]="newAssetParam.isActive" name="isActive">
                Active
              </label>
            </div>
            <div class="form-row">
              <input type="text" [(ngModel)]="newAssetParam.notes" name="notes" placeholder="Notes" class="form-control">
            </div>
            <button type="submit" class="btn btn-primary">Add Asset Parameter</button>
          </form>
        </div>
      </div>

      <!-- Configuration View Tab -->
      <div class="tab-content" *ngIf="activeTab === 'config'">
        <div class="section">
          <h3>Asset Inspection Point Configuration</h3>
          <div class="filter-bar">
            <input type="text" [(ngModel)]="configAssetFilter" placeholder="Enter Asset ID to view configuration..." class="form-control" (change)="loadAssetConfiguration()">
          </div>
          
          <div *ngIf="(assetConfiguration$ | async) as configurations" class="configurations-grid">
            <div *ngFor="let config of configurations" class="config-card">
              <div class="config-header">
                <h4>{{ config.assetCode }} - Point {{ config.pointId }}</h4>
                <span [ngClass]="'priority-' + config.priority.toLowerCase()" class="priority-badge">
                  {{ config.priority }}
                </span>
              </div>
              <div class="config-body">
                <div class="info-row">
                  <span class="label">Asset Type:</span>
                  <span>{{ config.assetType }}</span>
                </div>
                <div class="info-row">
                  <span class="label">Point Description:</span>
                  <span>{{ config.pointDescription }}</span>
                </div>
                <div class="info-row">
                  <span class="label">Inspection Method:</span>
                  <span>{{ config.inspectionMethod }}</span>
                </div>
                <div class="info-row">
                  <span class="label">Sequence:</span>
                  <span>{{ config.sequence }}</span>
                </div>

                <div class="parameters-section" *ngIf="config.parameterThresholds.length > 0">
                  <h5>Parameter Thresholds</h5>
                  <div *ngFor="let param of config.parameterThresholds" class="parameter-item">
                    <div class="param-header">
                      <strong>{{ param.indicatorName }}</strong>
                      <span class="param-type">{{ param.indicatorType }}</span>
                    </div>
                    <div class="param-details">
                      <div class="detail-row">
                        <span>Range:</span>
                        <span>{{ param.minimumValue }} - {{ param.maximumValue }} {{ param.unit }}</span>
                      </div>
                      <div class="detail-row" *ngIf="param.warningMin">
                        <span>Warning:</span>
                        <span>{{ param.warningMin }} - {{ param.warningMax }}</span>
                      </div>
                      <div class="detail-row" *ngIf="param.criticalMin">
                        <span>Critical:</span>
                        <span>{{ param.criticalMin }} - {{ param.criticalMax }}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="empty-state" *ngIf="config.parameterThresholds.length === 0">
                  <p>No parameter thresholds defined for this inspection point</p>
                </div>
              </div>
            </div>
          </div>

          <div class="empty-state" *ngIf="!(assetConfiguration$ | async) || (assetConfiguration$ | async)?.length === 0">
            <p>Select an asset to view its inspection point configuration</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .asset-inspection-points-container {
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

    .priority-badge {
      display: inline-block;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 11px;
      font-weight: 500;
      color: white;
    }

    .priority-critical {
      background-color: #d32f2f;
    }

    .priority-high {
      background-color: #f57c00;
    }

    .priority-medium {
      background-color: #fbc02d;
      color: #333;
    }

    .priority-low {
      background-color: #388e3c;
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
      display: flex;
      justify-content: space-between;
      align-items: center;
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
    }    .empty-state p {
      margin: 0;
      font-size: 14px;
    }

    .section-subtitle {
      margin: 0 0 15px;
      color: #666;
      font-size: 13px;
      font-style: italic;
    }

    .badge-category {
      display: inline-block;
      padding: 4px 8px;
      background-color: #f3e5f5;
      color: #6a1b9a;
      border-radius: 4px;
      font-size: 11px;
      font-weight: 500;
    }

    .threshold-cell {
      font-size: 12px;
      max-width: 200px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    textarea.form-control {
      resize: vertical;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }
  `]
})
export class AssetInspectionPointsComponent implements OnInit {
  assetInspectionPoints$: Observable<AssetInspectionPoint[]>;
  parameterIndicators$: Observable<ParameterIndicator[]>;
  thresholdRequirements$: Observable<ThresholdRequirement[]>;
  assetParameterThresholds$: Observable<AssetParameterThreshold[]>;
  assetConfiguration$: Observable<AssetInspectionPointConfig[]>;
  componentInspectionPoints: any[] = [];

  activeTab: 'points' | 'component-points' | 'indicators' | 'thresholds' | 'parameters' | 'config' = 'points';

  assetFilter = '';
  componentFilter = '';
  assetParamFilter = '';
  configAssetFilter = '';
  newAssetPoint: Partial<AssetInspectionPoint> = {
    isMandatory: true,
    isApplicable: true,
    sequence: 1,
    priority: 'Medium'
  };

  newComponentPoint: any = {
    componentCategory: '',
    inspectionMethod: 'Visual',
    isMandatory: true,
    applicableToComponent: true
  };

  newIndicator: Partial<ParameterIndicator> = {
    isNumeric: true
  };

  newThreshold: Partial<ThresholdRequirement> = {
    isActive: true
  };

  newAssetParam: Partial<AssetParameterThreshold> = {
    isRequired: true,
    isActive: true,
    sequence: 1
  };

  constructor(private assetInspectionPointsService: AssetInspectionPointsService) {
    this.assetInspectionPoints$ = this.assetInspectionPointsService.getAssetInspectionPoints();
    this.parameterIndicators$ = this.assetInspectionPointsService.getParameterIndicators();
    this.thresholdRequirements$ = this.assetInspectionPointsService.getThresholdRequirements();
    this.assetParameterThresholds$ = this.assetInspectionPointsService.getAssetParameterThresholds();
    this.assetConfiguration$ = new Observable();
  }
  ngOnInit(): void {
    // Observables initialized in constructor
    this.loadComponentInspectionPoints();
  }

  loadAssetConfiguration(): void {
    if (this.configAssetFilter.trim()) {
      this.assetConfiguration$ = this.assetInspectionPointsService.getAssetInspectionConfiguration(this.configAssetFilter);
    }
  }

  addAssetPoint(): void {
    if (this.newAssetPoint.assetId && this.newAssetPoint.pointId) {
      const point: AssetInspectionPoint = {
        assetPointId: 'aip-' + Date.now(),
        assetId: this.newAssetPoint.assetId!,
        pointId: this.newAssetPoint.pointId!,
        templateId: this.newAssetPoint.templateId || '',
        sequence: this.newAssetPoint.sequence || 1,
        isApplicable: this.newAssetPoint.isApplicable || true,
        isMandatory: this.newAssetPoint.isMandatory || true,
        priority: this.newAssetPoint.priority as any || 'Medium',
        createdAt: new Date()
      };
      this.assetInspectionPointsService.addAssetInspectionPoint(point);
      this.newAssetPoint = { isMandatory: true, isApplicable: true, sequence: 1, priority: 'Medium' };
      alert('Asset inspection point added successfully!');
    }
  }

  editAssetPoint(point: AssetInspectionPoint): void {
    alert('Edit asset point functionality coming soon');
  }

  deleteAssetPoint(assetPointId: string): void {
    if (confirm('Are you sure you want to delete this asset inspection point?')) {
      this.assetInspectionPointsService.deleteAssetInspectionPoint(assetPointId);
      alert('Asset inspection point deleted!');
    }
  }

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
      this.assetInspectionPointsService.addParameterIndicator(indicator);
      this.newIndicator = { isNumeric: true };
      alert('Parameter indicator added successfully!');
    }
  }

  editIndicator(indicator: ParameterIndicator): void {
    alert('Edit indicator functionality coming soon');
  }

  deleteIndicator(indicatorId: string): void {
    if (confirm('Are you sure you want to delete this parameter indicator?')) {
      this.assetInspectionPointsService.deleteParameterIndicator(indicatorId);
      alert('Parameter indicator deleted!');
    }
  }

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
      this.assetInspectionPointsService.addThresholdRequirement(threshold);
      this.newThreshold = { isActive: true };
      alert('Threshold requirement added successfully!');
    }
  }

  editThreshold(threshold: ThresholdRequirement): void {
    alert('Edit threshold functionality coming soon');
  }

  deleteThreshold(thresholdId: string): void {
    if (confirm('Are you sure you want to delete this threshold requirement?')) {
      this.assetInspectionPointsService.deleteThresholdRequirement(thresholdId);
      alert('Threshold requirement deleted!');
    }
  }

  addAssetParam(): void {
    if (this.newAssetParam.assetPointId && this.newAssetParam.indicatorId && this.newAssetParam.thresholdId) {
      const assetParam: AssetParameterThreshold = {
        assetParamId: 'apt-' + Date.now(),
        assetPointId: this.newAssetParam.assetPointId!,
        indicatorId: this.newAssetParam.indicatorId!,
        thresholdId: this.newAssetParam.thresholdId!,
        assetId: this.newAssetParam.assetId!,
        pointId: this.newAssetParam.pointId!,
        sequence: this.newAssetParam.sequence || 1,
        isRequired: this.newAssetParam.isRequired || true,
        isActive: this.newAssetParam.isActive || true,
        notes: this.newAssetParam.notes,
        createdAt: new Date()
      };
      this.assetInspectionPointsService.addAssetParameterThreshold(assetParam);
      this.newAssetParam = { isRequired: true, isActive: true, sequence: 1 };
      alert('Asset parameter threshold added successfully!');
    }
  }

  editAssetParam(param: AssetParameterThreshold): void {
    alert('Edit asset parameter functionality coming soon');
  }
  deleteAssetParam(assetParamId: string): void {
    if (confirm('Are you sure you want to delete this asset parameter threshold?')) {
      this.assetInspectionPointsService.deleteAssetParameterThreshold(assetParamId);
      alert('Asset parameter threshold deleted!');
    }
  }

  getFilteredComponentPoints(): any[] {
    if (!this.componentFilter.trim()) {
      return this.componentInspectionPoints;
    }
    return this.componentInspectionPoints.filter(point =>
      point.componentCategory.toLowerCase().includes(this.componentFilter.toLowerCase())
    );
  }

  // Component Inspection Points Methods
  loadComponentInspectionPoints(): void {
    // Load inspection points where applicableToComponent is true
    // For now, using mock data - in production this would call a service
    const allPoints = [
      {
        pointId: 'pt-002',
        templateId: 'tpl-001',
        sequenceOrder: 1,
        pointDescription: 'Chain wear analysis and measurement',
        componentCategory: 'Structural',
        inspectionMethod: 'Visual',
        isMandatory: true,
        pointThreshold: 'Wear: Less than 0.5mm per pitch',
        applicableToComponent: true,
        applicableToAsset: true
      },
      {
        pointId: 'pt-003',
        templateId: 'tpl-001',
        sequenceOrder: 2,
        pointDescription: 'Electrical safety and insulation testing',
        componentCategory: 'Electrical',
        inspectionMethod: 'Functional Test',
        isMandatory: true,
        pointThreshold: 'Insulation Resistance: Greater than 1MΩ',
        applicableToComponent: true,
        applicableToAsset: true
      },
      {
        pointId: 'pt-004',
        templateId: 'tpl-002',
        sequenceOrder: 2,
        pointDescription: 'Motor bearing vibration analysis',
        componentCategory: 'Electrical',
        inspectionMethod: 'Ultrasonic',
        isMandatory: false,
        pointThreshold: 'Vibration: Less than 7.1 mm/s',
        applicableToComponent: true,
        applicableToAsset: false
      },
      {
        pointId: 'pt-005',
        templateId: 'tpl-002',
        sequenceOrder: 3,
        pointDescription: 'Hydraulic pump pressure test',
        componentCategory: 'Hydraulic',
        inspectionMethod: 'Functional Test',
        isMandatory: false,
        pointThreshold: 'Pressure: 150-200 bar at rated flow',
        applicableToComponent: true,
        applicableToAsset: false
      }
    ];
    
    this.componentInspectionPoints = allPoints;
  }

  addComponentPoint(): void {
    if (this.newComponentPoint.pointId && this.newComponentPoint.templateId && 
        this.newComponentPoint.componentCategory && this.newComponentPoint.pointDescription) {
      const newPoint = {
        pointId: this.newComponentPoint.pointId,
        templateId: this.newComponentPoint.templateId,
        sequenceOrder: this.newComponentPoint.sequenceOrder || 1,
        pointDescription: this.newComponentPoint.pointDescription,
        componentCategory: this.newComponentPoint.componentCategory,
        inspectionMethod: this.newComponentPoint.inspectionMethod,
        isMandatory: this.newComponentPoint.isMandatory || false,
        pointThreshold: this.newComponentPoint.pointThreshold,
        applicableToComponent: true,
        applicableToAsset: false
      };
      
      this.componentInspectionPoints.push(newPoint);
      this.newComponentPoint = {
        componentCategory: '',
        inspectionMethod: 'Visual',
        isMandatory: false,
        applicableToComponent: true
      };
      alert('Component inspection point added successfully!');
    } else {
      alert('Please fill in all required fields');
    }
  }

  editComponentPoint(point: any): void {
    alert('Edit component inspection point functionality coming soon');
  }

  deleteComponentPoint(pointId: string): void {
    if (confirm('Are you sure you want to delete this component inspection point?')) {
      this.componentInspectionPoints = this.componentInspectionPoints.filter(p => p.pointId !== pointId);
      alert('Component inspection point deleted!');
    }
  }
}
