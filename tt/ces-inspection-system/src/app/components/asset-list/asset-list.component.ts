import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AssetService } from '../../services/asset.service';
import { ComponentMasterService } from '../../services/component-master.service';
import { AssetSpecsService } from '../../services/asset-specs.service';
import { Asset, TerminalLocation, ComponentMaster, AssetSpecs } from '../../models';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-asset-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="asset-container">
      <div class="assets-section">
        <h3>Assets</h3>
        <table class="table">
          <thead>
            <tr>
              <th>Asset ID</th>
              <th>Asset Code</th>
              <th>Type</th>
              <th>Description</th>
              <th>Manufacturer</th>
              <th>Serial Number</th>
              <th>Warranty</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let asset of assets$ | async" 
                (click)="selectAsset(asset)"
                [class.selected]="selectedAssetId === asset.assetId"
                class="clickable">
              <td><strong>{{ asset.assetId }}</strong></td>
              <td>{{ asset.assetCode }}</td>
              <td><span [ngClass]="'badge badge-' + asset.assetType.toLowerCase()">{{ asset.assetType }}</span></td>
              <td>{{ asset.description }}</td>
              <td>{{ asset.manufacturer }}</td>
              <td>{{ asset.serialNumber }}</td>
              <td>{{ asset.warrantyExpiry | date:'MMM yyyy' }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="asset-details-section" *ngIf="selectedAsset">
        <div class="details-header">
          <h3>Asset Details</h3>
          <button class="btn btn-close" (click)="closeDetails()">✕</button>
        </div>

        <div class="asset-info-card">
          <div class="info-section">
            <h4>Basic Information</h4>
            <div class="info-grid">
              <div class="info-item">
                <label>Asset ID</label>
                <span>{{ selectedAsset.assetId }}</span>
              </div>
              <div class="info-item">
                <label>Asset Code</label>
                <span>{{ selectedAsset.assetCode }}</span>
              </div>
              <div class="info-item">
                <label>Asset Type</label>
                <span [ngClass]="'badge badge-' + selectedAsset.assetType.toLowerCase()">{{ selectedAsset.assetType }}</span>
              </div>
              <div class="info-item">
                <label>Description</label>
                <span>{{ selectedAsset.description }}</span>
              </div>
              <div class="info-item">
                <label>Manufacturer</label>
                <span>{{ selectedAsset.manufacturer || 'N/A' }}</span>
              </div>
              <div class="info-item">
                <label>Model Number</label>
                <span>{{ selectedAsset.modelNumber || 'N/A' }}</span>
              </div>
              <div class="info-item">
                <label>Serial Number</label>
                <span>{{ selectedAsset.serialNumber || 'N/A' }}</span>
              </div>
              <div class="info-item">
                <label>Acquisition Date</label>
                <span>{{ (selectedAsset.acquisitionDate | date:'MMM dd, yyyy') || 'N/A' }}</span>
              </div>
              <div class="info-item">
                <label>Warranty Expiry</label>
                <span>{{ (selectedAsset.warrantyExpiry | date:'MMM dd, yyyy') || 'N/A' }}</span>
              </div>              <div class="info-item">
                <label>Location ID</label>
                <span>{{ selectedAsset.locationId }}</span>
              </div>
            </div>
          </div>          <div class="info-section" *ngIf="selectedAsset.diagramUrl">
            <h4>2D Asset Drawing</h4>
            <div class="diagram-container">
              <img [src]="selectedAsset.diagramUrl" [alt]="'2D Drawing for ' + selectedAsset.assetId" class="diagram-image">
              <div class="diagram-info">
                <p><strong>Asset:</strong> {{ selectedAsset.assetId }}</p>
                <p><strong>Type:</strong> {{ selectedAsset.assetType }}</p>
              </div>
            </div>
          </div>
          <div class="info-section" *ngIf="!selectedAsset.diagramUrl">
            <h4>2D Asset Drawing</h4>
            <div class="no-diagram">
              <p>No 2D drawing available for this asset</p>
              <small>Add a diagram URL to display technical drawings</small>
            </div>          </div>

          <div class="info-section" *ngIf="selectedAssetSpecs">
            <h4>Technical Specifications</h4>
            <div class="specs-grid">
              <div class="spec-item">
                <label>Lift Capacity</label>
                <span>{{ selectedAssetSpecs.liftCapacity || 'N/A' }} T</span>
              </div>
              <div class="spec-item">
                <label>Max Speed</label>
                <span>{{ selectedAssetSpecs.maxSpeed || 'N/A' }} m/s</span>
              </div>
              <div class="spec-item">
                <label>Operating Pressure</label>
                <span>{{ selectedAssetSpecs.operatingPressure || 'N/A' }} bar</span>
              </div>
              <div class="spec-item">
                <label>Motor Power</label>
                <span>{{ selectedAssetSpecs.motorPower || 'N/A' }} kW</span>
              </div>
              <div class="spec-item">
                <label>Cycle Time</label>
                <span>{{ selectedAssetSpecs.cycleTime || 'N/A' }} s</span>
              </div>
              <div class="spec-item">
                <label>Track Gauge</label>
                <span>{{ selectedAssetSpecs.trackGauge || 'N/A' }} mm</span>
              </div>
              <div class="spec-item">
                <label>Boom Length</label>
                <span>{{ selectedAssetSpecs.boomLength || 'N/A' }} m</span>
              </div>
              <div class="spec-item">
                <label>Wheel Diameter</label>
                <span>{{ selectedAssetSpecs.wheelDiameter || 'N/A' }} mm</span>
              </div>
              <div class="spec-item">
                <label>Tire Condition</label>
                <span>{{ selectedAssetSpecs.tireCondition || 'N/A' }}</span>
              </div>
              <div class="spec-item">
                <label>Last Service Date</label>
                <span>{{ (selectedAssetSpecs.lastServiceDate | date:'MMM dd, yyyy') || 'N/A' }}</span>
              </div>
              <div class="spec-item">
                <label>Next Service Date</label>
                <span [ngClass]="isServiceUpcoming(selectedAssetSpecs.nextServiceDate) ? 'upcoming-service' : ''">
                  {{ (selectedAssetSpecs.nextServiceDate | date:'MMM dd, yyyy') || 'N/A' }}
                </span>
              </div>
              <div class="spec-item">
                <label>Certifications</label>
                <span>{{ selectedAssetSpecs.certifications || 'N/A' }}</span>
              </div>
            </div>
            <div class="maintenance-history" *ngIf="selectedAssetSpecs.maintenanceHistory">
              <h5>Maintenance History</h5>
              <p>{{ selectedAssetSpecs.maintenanceHistory }}</p>
            </div>
          </div>

          <div class="info-section" *ngIf="!selectedAssetSpecs">
            <h4>Technical Specifications</h4>
            <div class="no-specs">
              <p>No technical specifications available for this asset</p>
              <small>Add specifications to view detailed asset data</small>
            </div>          </div>          <div class="info-section">
            <h4>Components Summary</h4>
            <div class="components-summary" *ngIf="assetComponents && assetComponents.length > 0">
              <div class="tree-container">
                <div class="tree">
                  <ng-container *ngFor="let component of componentTree">
                    <div class="tree-node">
                      <div class="node-content" [ngClass]="{ selected: selectedComponentId === component.componentId }">
                        <button *ngIf="hasChildren(component)" 
                                class="expand-btn"
                                (click)="toggleNode(component)"
                                [attr.aria-label]="'Toggle ' + component.componentName">
                          <span class="arrow" [ngClass]="{ 'rotated': isExpanded(component) }">▼</span>
                        </button>
                        <span *ngIf="!hasChildren(component)" class="no-children-icon"></span>
                        <div class="node-info">
                          <span class="component-name">{{ component.componentName }}</span>
                          <span class="component-code">{{ component.componentCode }}</span>
                          <span [ngClass]="'badge badge-' + component.category.toLowerCase()">{{ component.category }}</span>
                          <span [ngClass]="'badge badge-' + component.criticality.toLowerCase()">{{ component.criticality }}</span>
                          <span [ngClass]="'status-badge ' + (component.isActive ? 'status-active' : 'status-inactive')">
                            {{ component.isActive ? '●' : '○' }}
                          </span>
                        </div>
                        <button class="details-btn" 
                                (click)="openComponentDetails(component)"
                                [attr.aria-label]="'View details for ' + component.componentName"
                                title="View component details">
                          Details
                        </button>
                      </div>

                      <div class="children" *ngIf="isExpanded(component) && hasChildren(component)">
                        <ng-container *ngFor="let childComponent of getChildren(component)">
                          <div class="tree-node">
                            <div class="node-content">
                              <button *ngIf="hasChildren(childComponent)" 
                                      class="expand-btn"
                                      (click)="toggleNode(childComponent)"
                                      [attr.aria-label]="'Toggle ' + childComponent.componentName">
                                <span class="arrow" [ngClass]="{ 'rotated': isExpanded(childComponent) }">▼</span>
                              </button>
                              <span *ngIf="!hasChildren(childComponent)" class="no-children-icon"></span>
                              <div class="node-info">
                                <span class="component-name">{{ childComponent.componentName }}</span>
                                <span class="component-code">{{ childComponent.componentCode }}</span>
                                <span [ngClass]="'badge badge-' + childComponent.category.toLowerCase()">{{ childComponent.category }}</span>
                                <span [ngClass]="'badge badge-' + childComponent.criticality.toLowerCase()">{{ childComponent.criticality }}</span>
                                <span [ngClass]="'status-badge ' + (childComponent.isActive ? 'status-active' : 'status-inactive')">
                                  {{ childComponent.isActive ? '●' : '○' }}
                                </span>
                              </div>
                              <button class="details-btn" 
                                      (click)="openComponentDetails(childComponent)"
                                      [attr.aria-label]="'View details for ' + childComponent.componentName"
                                      title="View component details">
                                Details
                              </button>
                            </div>
                          </div>
                        </ng-container>
                      </div>
                    </div>
                  </ng-container>
                </div>
              </div>
            </div>            <div class="no-components" *ngIf="!assetComponents || assetComponents.length === 0">
              <p>No components found for this asset</p>
            </div>
          </div>

          <div *ngIf="selectedComponentForDetails" class="component-details-modal">
            <div class="modal-overlay" (click)="closeComponentDetails()"></div>
            <div class="modal-content">
              <div class="modal-header">
                <h4>{{ selectedComponentForDetails.componentName }}</h4>
                <button class="close-btn" (click)="closeComponentDetails()">✕</button>
              </div>
              <div class="modal-body">
                <div class="detail-section">
                  <h5>Basic Information</h5>
                  <div class="detail-grid">                    <div class="detail-item">
                      <label class="label">Component ID</label>
                      <span class="value">
                        <a [routerLink]="['/components', selectedComponentForDetails.componentId]" 
                           [queryParams]="{ autoScroll: 'details' }"
                           fragment="component-details"
                           class="component-id-link"
                           (click)="closeComponentDetails()"
                           title="View full component details">
                          {{ selectedComponentForDetails.componentId }}
                        </a>
                      </span>
                    </div>
                    <div class="detail-item">
                      <label class="label">Component Code</label>
                      <span class="value">{{ selectedComponentForDetails.componentCode }}</span>
                    </div>
                    <div class="detail-item">
                      <label class="label">Asset ID</label>
                      <span class="value">{{ selectedComponentForDetails.assetId }}</span>
                    </div>
                    <div class="detail-item">
                      <label class="label">Category</label>
                      <span class="value"><span [ngClass]="'badge badge-' + selectedComponentForDetails.category.toLowerCase()">{{ selectedComponentForDetails.category }}</span></span>
                    </div>
                    <div class="detail-item">
                      <label class="label">Criticality</label>
                      <span class="value"><span [ngClass]="'badge badge-' + selectedComponentForDetails.criticality.toLowerCase()">{{ selectedComponentForDetails.criticality }}</span></span>
                    </div>
                    <div class="detail-item">
                      <label class="label">Status</label>
                      <span class="value" [ngClass]="selectedComponentForDetails.isActive ? 'status-active' : 'status-inactive'">
                        {{ selectedComponentForDetails.isActive ? 'Active' : 'Inactive' }}
                      </span>
                    </div>
                    <div class="detail-item">
                      <label class="label">Manufacturer</label>
                      <span class="value">{{ selectedComponentForDetails.manufacturer || 'N/A' }}</span>
                    </div>
                  </div>
                </div>

                <div *ngIf="selectedComponentForDetails.description" class="detail-section">
                  <h5>Description</h5>
                  <p class="description">{{ selectedComponentForDetails.description }}</p>
                </div>

                <div *ngIf="getChildren(selectedComponentForDetails).length > 0" class="detail-section">
                  <h5>Subcomponents ({{ getChildren(selectedComponentForDetails).length }})</h5>
                  <div class="subcomponents-list">
                    <div *ngFor="let subcomp of getChildren(selectedComponentForDetails)" class="subcomponent-item">
                      <div class="subcomp-header">
                        <span class="subcomp-name">{{ subcomp.componentName }}</span>
                        <span [ngClass]="'badge badge-' + subcomp.criticality.toLowerCase()">{{ subcomp.criticality }}</span>
                      </div>
                      <div class="subcomp-details">
                        <div>
                          <span class="detail-label">Code:</span>
                          <span class="detail-value">{{ subcomp.componentCode }}</span>
                        </div>
                        <div>
                          <span class="detail-label">Category:</span>
                          <span class="detail-value"><span [ngClass]="'badge badge-' + subcomp.category.toLowerCase()">{{ subcomp.category }}</span></span>
                        </div>
                        <div>
                          <span class="detail-label">Status:</span>
                          <span class="detail-value" [ngClass]="subcomp.isActive ? 'status-active' : 'status-inactive'">{{ subcomp.isActive ? 'Active' : 'Inactive' }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .asset-container {
      padding: 20px;
      max-width: 1600px;
      margin: 0 auto;
    }
    
    h3 {
      color: #666;
      margin-bottom: 15px;
    }

    h4 {
      color: #7b1fa2;
      margin-bottom: 12px;
    }

    h5 {
      margin: 0 0 8px 0;
      color: #333;
    }

    .table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 20px;
      background: white;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .table thead {
      background-color: #f5f5f5;
    }

    .table th,
    .table td {
      padding: 12px;
      text-align: left;
      border-bottom: 1px solid #ddd;
    }

    .table tr {
      cursor: pointer;
      transition: background-color 0.2s ease;
    }

    .table tr:hover {
      background-color: #f9f9f9;
    }

    .table tr.selected {
      background-color: #e3f2fd;
      font-weight: bold;
    }

    .badge {
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: bold;
    }

    .badge-sts {
      background-color: #e3f2fd;
      color: #1976d2;
    }

    .badge-rtg {
      background-color: #f3e5f5;
      color: #7b1fa2;
    }

    .badge-rmg {
      background-color: #e8f5e9;
      color: #388e3c;
    }

    .badge-electrical {
      background-color: #fff3e0;
      color: #e65100;
    }

    .badge-mechanical {
      background-color: #f3e5f5;
      color: #6a1b9a;
    }

    .badge-hydraulic {
      background-color: #e0f2f1;
      color: #00695c;
    }

    .badge-structural {
      background-color: #ede7f6;
      color: #512da8;
    }

    .badge-software {
      background-color: #f1f8e9;
      color: #558b2f;
    }

    .badge-other {
      background-color: #eeeeee;
      color: #424242;
    }

    .badge-critical {
      background-color: #ffebee;
      color: #c62828;
      font-weight: bold;
    }

    .badge-high {
      background-color: #fff3e0;
      color: #e65100;
    }

    .badge-medium {
      background-color: #fffde7;
      color: #f57f17;
    }

    .badge-low {
      background-color: #e8f5e9;
      color: #2e7d32;
    }

    .asset-details-section {
      background: white;
      border-radius: 8px;
      padding: 20px;
      margin-top: 30px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .details-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      padding-bottom: 15px;
      border-bottom: 2px solid #eee;
    }

    .details-header h3 {
      margin: 0;
    }

    .btn {
      padding: 8px 16px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-weight: bold;
      transition: all 0.3s ease;
    }

    .btn-close {
      background-color: #f44336;
      color: white;
      padding: 6px 12px;
      font-size: 18px;
    }

    .btn-close:hover {
      background-color: #d32f2f;
    }

    .asset-info-card {
      display: grid;
      gap: 30px;
    }

    .info-section {
      padding: 20px;
      background-color: #f9f9f9;
      border-radius: 6px;
      border-left: 4px solid #7b1fa2;
    }

    .info-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
    }

    .info-item {
      display: flex;
      flex-direction: column;
      gap: 5px;
    }

    .info-item label {
      font-weight: bold;
      color: #7b1fa2;
      font-size: 13px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }    .info-item span {
      color: #333;
      font-size: 14px;
      padding: 8px;
      background-color: white;
      border-radius: 4px;
      border: 1px solid #ddd;
    }    .diagram-container {
      width: 100%;
      max-width: 700px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 15px;
      border: 2px solid #e0e0e0;
      border-radius: 6px;
      padding: 20px;
      background-color: #fafafa;
      min-height: 300px;
    }

    .diagram-image {
      display: block;
      width: auto;
      max-width: 100%;
      max-height: 500px;
      height: auto;
      object-fit: contain;
      border-radius: 4px;
      background: white;
      padding: 10px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .diagram-info {
      width: 100%;
      padding: 10px;
      background: white;
      border-radius: 4px;
      border-left: 3px solid #7b1fa2;
      text-align: center;
    }

    .diagram-info p {
      margin: 5px 0;
      font-size: 12px;
      color: #555;
    }

    .diagram-info strong {
      color: #7b1fa2;
    }

    .no-diagram {
      width: 100%;
      padding: 40px 20px;
      background: linear-gradient(135deg, #f5f5f5 0%, #fafafa 100%);
      border-radius: 6px;
      border: 2px dashed #ddd;
      text-align: center;
      color: #999;
    }

    .no-diagram p {
      margin: 10px 0 5px 0;
      font-size: 14px;
    }

    .no-diagram small {
      font-size: 12px;
      color: #bbb;
    }    .subcomponents-container {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 15px;
    }    .no-components {
      text-align: center;
      padding: 40px;
      color: #999;
      background-color: #f9f9f9;
      border-radius: 6px;
    }

    .tree-container {
      background: white;
      border: 1px solid #e0e0e0;
      border-radius: 6px;
      padding: 15px;
    }

    .tree {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', sans-serif;
    }

    .tree-node {
      margin: 8px 0;
    }

    .node-content {
      display: flex;
      align-items: center;
      padding: 10px;
      background: #f9f9f9;
      border-radius: 4px;
      border-left: 3px solid #7b1fa2;
      transition: background-color 0.2s ease;
      cursor: pointer;
    }

    .node-content:hover {
      background-color: #f0f0f0;
    }

    .node-content.selected {
      background-color: #e3f2fd;
      border-left: 3px solid #1976d2;
    }

    .expand-btn {
      background: none;
      border: none;
      cursor: pointer;
      padding: 0 5px;
      color: #7b1fa2;
      font-size: 12px;
      font-weight: bold;
      min-width: 20px;
      transition: transform 0.2s ease;
    }

    .expand-btn:hover {
      color: #5a1380;
    }

    .expand-btn .arrow {
      display: inline-block;
      transition: transform 0.2s ease;
    }

    .expand-btn .arrow.rotated {
      transform: rotate(90deg);
    }

    .no-children-icon {
      display: inline-block;
      width: 20px;
      text-align: center;
      color: #ddd;
    }

    .component-name {
      font-weight: bold;
      color: #333;
      margin-right: 10px;
    }

    .component-code {
      margin-right: 8px;
    }    .node-info {
      display: flex;
      align-items: center;
      gap: 8px;
      flex: 1;
      cursor: pointer;
      padding: 5px;
      border-radius: 4px;
      transition: background-color 0.2s ease;
    }

    .node-details {
      margin: 10px 0 10px 20px;
      padding: 15px;
      background: #f5f5f5;
      border-radius: 4px;
      border-left: 3px solid #7b1fa2;
      animation: slideDown 0.3s ease-out;
    }

    @keyframes slideDown {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .details-container {
      display: flex;
      flex-direction: column;
      gap: 15px;
    }

    .detail-section {
      background: white;
      padding: 12px;
      border-radius: 4px;
      border-left: 3px solid #7b1fa2;
    }

    .detail-section h6 {
      margin: 0 0 10px 0;
      color: #7b1fa2;
      font-size: 12px;
      font-weight: bold;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .detail-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 10px;
      margin-bottom: 0;
    }

    .detail-item {
      display: flex;
      flex-direction: column;
      gap: 3px;
    }

    .detail-item .label {
      font-weight: bold;
      color: #7b1fa2;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .detail-item .value {
      color: #555;
      font-size: 13px;
      padding: 6px 8px;
      background: #f9f9f9;
      border-radius: 3px;
      border: 1px solid #e0e0e0;
    }

    .detail-item .status-active {
      color: #2e7d32;
      font-weight: bold;
    }

    .detail-item .status-inactive {
      color: #c62828;
      font-weight: bold;
    }

    .description {
      color: #666;
      font-size: 13px;
      margin: 0;
      padding: 8px;
      background: #f9f9f9;
      border-radius: 3px;
      border-left: 2px solid #7b1fa2;
      line-height: 1.5;
    }

    .subcomponents-list {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .subcomponent-item {
      background: #f9f9f9;
      padding: 10px;
      border-radius: 4px;
      border: 1px solid #e0e0e0;
      border-left: 3px solid #7b1fa2;
    }

    .subcomp-header {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 8px;
      padding-bottom: 8px;
      border-bottom: 1px solid #ddd;
    }

    .subcomp-name {
      font-weight: bold;
      color: #333;
      flex: 1;
    }

    .subcomp-details {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 8px;
      font-size: 12px;
    }

    .detail-label {
      font-weight: bold;
      color: #7b1fa2;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.3px;
      display: block;
      margin-bottom: 3px;
    }    .detail-value {
      color: #555;
      padding: 3px 5px;
      background: white;
      border-radius: 2px;
      border: 1px solid #ddd;
      display: block;
    }

    .children {
      margin-left: 10px;
      padding: 8px 0 8px 8px;
      border-left: 2px dotted #7b1fa2;
    }    /* Component Details Modal */
    .component-details-modal {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      display: flex;
      align-items: flex-end;
      z-index: 1000;
      animation: slideUpModal 0.3s ease-out;
    }

    @keyframes slideUpModal {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }

    .modal-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      cursor: pointer;
    }    .modal-content {
      position: relative;
      background: white;
      width: 100%;
      max-width: 600px;
      max-height: 90vh;
      margin: 0 auto;
      border-radius: 12px 12px 0 0;
      box-shadow: 0 -2px 20px rgba(0, 0, 0, 0.15);
      display: flex;
      flex-direction: column;
      animation: slideUp 0.3s ease-out;
      overflow: hidden;
    }

    @keyframes slideUp {
      from {
        transform: translateY(100%);
      }
      to {
        transform: translateY(0);
      }
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px;
      border-bottom: 2px solid #eee;
      background: linear-gradient(135deg, #7b1fa2 0%, #5a1380 100%);
      color: white;
      border-radius: 12px 12px 0 0;
    }

    .modal-header h4 {
      margin: 0;
      color: white;
      font-size: 18px;
      font-weight: 600;
    }

    .close-btn {
      background: none;
      border: none;
      color: white;
      font-size: 24px;
      cursor: pointer;
      padding: 0;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 4px;
      transition: background-color 0.2s ease;
    }

    .close-btn:hover {
      background-color: rgba(255, 255, 255, 0.2);
    }    .modal-body {
      flex: 1;
      overflow-y: auto;
      overflow-x: hidden;
      padding: 20px;
      padding-bottom: 40px;
      background: white;
      min-height: 200px;
    }    .modal-body .detail-section {
      margin-bottom: 25px;
      padding: 18px;
      background-color: #f9f9f9;
      border-radius: 6px;
      border-left: 4px solid #7b1fa2;
      width: 100%;
      box-sizing: border-box;
    }

    .modal-body .detail-section h5 {
      margin: 0 0 15px 0;
      color: #7b1fa2;
      font-size: 14px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }    .modal-body .detail-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 15px;
      width: 100%;
    }    .modal-body .detail-item {
      display: flex;
      flex-direction: column;
      gap: 5px;
      width: 100%;
    }

    .modal-body .detail-item .label {
      font-weight: 600;
      color: #7b1fa2;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .modal-body .detail-item .value {
      color: #333;
      font-size: 13px;
      padding: 8px;
      background: white;
      border-radius: 4px;
      border: 1px solid #ddd;
    }

    .modal-body .description {
      color: #555;
      font-size: 13px;
      line-height: 1.6;
      padding: 10px;
      background: white;
      border-radius: 4px;
      border-left: 2px solid #7b1fa2;
      margin: 0;
    }

    .modal-body .subcomponents-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }    .modal-body .subcomponent-item {
      background: white;
      padding: 15px;
      border-radius: 6px;
      border: 1px solid #e0e0e0;
      border-left: 3px solid #7b1fa2;
      margin-bottom: 12px;
      width: 100%;
      box-sizing: border-box;
    }

    .modal-body .subcomp-header {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 10px;
      padding-bottom: 10px;
      border-bottom: 1px solid #ddd;
    }

    .modal-body .subcomp-name {
      font-weight: 600;
      color: #333;
      flex: 1;
    }

    .modal-body .subcomp-details {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
      gap: 10px;
      font-size: 12px;
    }

    .modal-body .detail-label {
      font-weight: 600;
      color: #7b1fa2;
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 0.3px;
      display: block;
      margin-bottom: 4px;
    }

    .modal-body .detail-value {
      color: #555;
      padding: 5px 8px;
      background: #f9f9f9;
      border-radius: 3px;
      border: 1px solid #e0e0e0;
      display: block;
    }

    /* Details Button */
    .details-btn {
      background-color: #7b1fa2;
      color: white;
      border: none;
      padding: 6px 12px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      white-space: nowrap;
      margin-left: 8px;
    }

    .details-btn:hover {
      background-color: #5a1380;
      box-shadow: 0 2px 8px rgba(123, 31, 162, 0.3);
    }

    .details-btn:active {
      transform: scale(0.98);
    }

    /* Status Badge */
    .status-badge {
      font-size: 12px;
      margin-left: 4px;
    }

    .status-badge.status-active {
      color: #2e7d32;
    }

    .status-badge.status-inactive {
      color: #c62828;
    }

    .specs-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 15px;
      margin-bottom: 20px;
    }

    .spec-item {
      display: flex;
      flex-direction: column;
      gap: 5px;
      padding: 12px;
      background-color: white;
      border-radius: 4px;
      border: 1px solid #e0e0e0;
      border-left: 3px solid #7b1fa2;
    }

    .spec-item label {
      font-weight: bold;
      color: #7b1fa2;
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .spec-item span {
      color: #333;
      font-size: 14px;
      padding: 6px;
      background-color: #f9f9f9;
      border-radius: 3px;
    }

    .spec-item span.upcoming-service {
      color: #d32f2f;
      font-weight: bold;
    }

    .maintenance-history {
      margin-top: 15px;
      padding: 12px;
      background-color: white;
      border-radius: 4px;
      border-left: 3px solid #7b1fa2;
    }

    .maintenance-history h5 {
      margin: 0 0 10px 0;
      color: #7b1fa2;
      font-size: 13px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .maintenance-history p {
      margin: 0;
      color: #666;
      font-size: 13px;
      line-height: 1.5;
    }

    .no-specs {
      width: 100%;
      padding: 40px 20px;
      background: linear-gradient(135deg, #f5f5f5 0%, #fafafa 100%);
      border-radius: 6px;
      border: 2px dashed #ddd;
      text-align: center;
      color: #999;
    }

    .no-specs p {
      margin: 10px 0 5px 0;
      font-size: 14px;
    }    .no-specs small {
      font-size: 12px;
      color: #bbb;
    }

    .components-summary {
      width: 100%;
      border-radius: 6px;
      overflow: hidden;
    }

    .summary-table {
      width: 100%;
    }

    .summary-table .table {
      margin-bottom: 0;
      box-shadow: none;
    }

    .summary-table .table tr {
      border-bottom: 1px solid #ddd;
    }

    .summary-table .table tbody tr:hover {
      background-color: #f0f7ff;
    }

    .status-active {
      color: #2e7d32;
      font-weight: bold;
      padding: 4px 8px;
      background-color: #e8f5e9;
      border-radius: 3px;
      font-size: 12px;
    }    .status-inactive {
      color: #c62828;
      font-weight: bold;
      padding: 4px 8px;
      background-color: #ffebee;
      border-radius: 3px;
      font-size: 12px;
    }

    /* Component ID Link */
    .component-id-link {
      color: #1976d2;
      text-decoration: none;
      font-weight: 600;
      cursor: pointer;
      padding: 2px 4px;
      border-radius: 3px;
      transition: all 0.2s ease;
      border-bottom: 2px solid #1976d2;
    }

    .component-id-link:hover {
      color: #1565c0;
      background-color: #e3f2fd;
      border-bottom-color: #1565c0;
    }

    .component-id-link:active {
      transform: scale(0.98);
    }

    @media (max-width: 768px) {
      .specs-grid {
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      }

      .info-grid {
        grid-template-columns: 1fr;
      }

      .subcomponents-container {
        grid-template-columns: 1fr;
      }

      .details-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 10px;
      }

      .btn-close {
        align-self: flex-end;
      }
    }
  `]
})
export class AssetListComponent implements OnInit {  assets$: Observable<Asset[]>;
  selectedAssetId: string | null = null;  selectedAsset: Asset | null = null;
  selectedAssetSpecs: AssetSpecs | null = null;
  assetComponents: ComponentMaster[] = [];
  componentTree: ComponentMaster[] = [];  expandedNodes: Set<string> = new Set();
  selectedComponentId: string | null = null;
  selectedComponentForDetails: ComponentMaster | null = null;  constructor(
    private assetService: AssetService,
    private componentService: ComponentMasterService,
    private assetSpecsService: AssetSpecsService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.assets$ = this.assetService.getAssets();
  }

  ngOnInit(): void {
    // Check for assetId in query parameters
    this.route.queryParams.subscribe(params => {
      const assetId = params['assetId'];
      if (assetId) {
        this.assets$.subscribe(assets => {
          const asset = assets.find(a => a.assetId === assetId);
          if (asset) {
            this.selectAsset(asset);
          }
        });
      }
    });
  }
  selectAsset(asset: Asset): void {
    this.selectedAssetId = asset.assetId;
    this.selectedAsset = asset;
    this.loadAssetComponents(asset.assetId);
    this.loadAssetSpecs(asset.assetId);
  }  closeDetails(): void {
    this.selectedAssetId = null;
    this.selectedAsset = null;
    this.selectedAssetSpecs = null;
    this.assetComponents = [];
    this.componentTree = [];
    this.expandedNodes.clear();
    this.selectedComponentId = null;
    this.selectedComponentForDetails = null;
  }private loadAssetComponents(assetId: string): void {
    // Load components for this asset from the service
    const allComponents$ = this.componentService.getComponents();
    allComponents$.subscribe(components => {
      this.assetComponents = components.filter(comp => comp.assetId === assetId);
      this.buildComponentTree(this.assetComponents);
      // Start with root components expanded to show the tree structure
      this.expandedNodes.clear();
      this.componentTree.forEach(root => {
        this.expandedNodes.add(root.componentId);
      });
    });
  }

  private buildComponentTree(components: ComponentMaster[]): void {
    // Build tree structure with parent-child relationships
    this.componentTree = components.filter(comp => !comp.parentComponentId);
  }

  hasChildren(component: ComponentMaster): boolean {
    return this.assetComponents.some(comp => comp.parentComponentId === component.componentId);
  }

  getChildren(component: ComponentMaster): ComponentMaster[] {
    return this.assetComponents.filter(comp => comp.parentComponentId === component.componentId);
  }

  toggleNode(component: ComponentMaster): void {
    if (this.expandedNodes.has(component.componentId)) {
      this.expandedNodes.delete(component.componentId);
    } else {
      // Close all sibling nodes at the same level
      const siblings = this.assetComponents.filter(comp => comp.parentComponentId === component.parentComponentId);
      siblings.forEach(sibling => {
        if (sibling.componentId !== component.componentId) {
          this.expandedNodes.delete(sibling.componentId);
        }
      });
      // Open the clicked node
      this.expandedNodes.add(component.componentId);
    }
  }

  isExpanded(component: ComponentMaster): boolean {
    return this.expandedNodes.has(component.componentId);
  }

  selectComponent(component: ComponentMaster): void {
    // Toggle the selected component - if it's already selected, deselect it
    if (this.selectedComponentId === component.componentId) {
      this.selectedComponentId = null;
    } else {
      this.selectedComponentId = component.componentId;
    }
  }
  private loadAssetSpecs(assetId: string): void {
    // Load specs for this asset from the service
    const specs$ = this.assetSpecsService.getSpecsByAssetId(assetId);
    specs$.subscribe(specs => {
      this.selectedAssetSpecs = specs || null;
    });
  }
  isServiceUpcoming(nextServiceDate: Date | undefined): boolean {
    if (!nextServiceDate) return false;
    const today = new Date();
    const thirtyDaysFromNow = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
    return nextServiceDate <= thirtyDaysFromNow && nextServiceDate >= today;
  }  openComponentDetails(component: ComponentMaster): void {
    this.selectedComponentForDetails = component;
  }

  closeComponentDetails(): void {
    this.selectedComponentForDetails = null;
  }
}


