import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { AssetService } from '../../services/asset.service';
import { ComponentMasterService } from '../../services/component-master.service';
import { Asset, TerminalLocation, ComponentMaster } from '../../models';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-asset-list',
  standalone: true,
  imports: [CommonModule],
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
            </div>
          </div><div class="info-section">
            <h4>Component Tree Structure</h4>
            <div class="tree-container" *ngIf="componentTree && componentTree.length > 0">
              <div class="tree">
                <ng-container *ngFor="let component of componentTree">
                  <ng-container *ngTemplateOutlet="treeNode; context: {$implicit: component, level: 0}"></ng-container>
                </ng-container>
              </div>
            </div>
            <div class="no-components" *ngIf="!componentTree || componentTree.length === 0">
              <p>No components found for this asset</p>
            </div>
          </div>          <ng-template #treeNode let-component let-level="level">
            <div class="tree-node" [style.margin-left.px]="level * 20">
              <div class="node-content" (click)="selectComponent(component)" [class.selected]="selectedComponentId === component.componentId">
                <button class="expand-btn" 
                        *ngIf="hasChildren(component)"
                        (click)="toggleNode(component); $event.stopPropagation()"
                        [class.expanded]="isExpanded(component)">
                  <span class="arrow">{{ isExpanded(component) ? '▼' : '▶' }}</span>
                </button>
                <span class="no-children-icon" *ngIf="!hasChildren(component)">•</span>
                
                <div class="node-info">
                  <span class="component-name">{{ component.componentName }}</span>
                  <span [ngClass]="'badge badge-' + component.category.toLowerCase()">{{ component.category }}</span>
                  <span [ngClass]="'badge badge-' + component.criticality.toLowerCase()">{{ component.criticality }}</span>
                </div>
              </div><div class="node-details" [class.always-visible]="true" *ngIf="selectedComponentId === component.componentId">
                <div class="details-container">
                  <div class="detail-section">
                    <h6>Basic Information</h6>
                    <div class="detail-grid">
                      <div class="detail-item">
                        <span class="label">Component ID:</span>
                        <span class="value">{{ component.componentId }}</span>
                      </div>
                      <div class="detail-item">
                        <span class="label">Code:</span>
                        <span class="value">{{ component.componentCode }}</span>
                      </div>
                      <div class="detail-item">
                        <span class="label">Category:</span>
                        <span class="value">{{ component.category }}</span>
                      </div>
                      <div class="detail-item">
                        <span class="label">Asset Type:</span>
                        <span class="value">{{ component.assetType }}</span>
                      </div>
                    </div>
                  </div>

                  <div class="detail-section">
                    <h6>Technical Specifications</h6>
                    <div class="detail-grid">
                      <div class="detail-item">
                        <span class="label">Manufacturer:</span>
                        <span class="value">{{ component.manufacturer || 'N/A' }}</span>
                      </div>
                      <div class="detail-item">
                        <span class="label">Model Number:</span>
                        <span class="value">{{ component.modelNumber || 'N/A' }}</span>
                      </div>
                      <div class="detail-item">
                        <span class="label">Serial Number:</span>
                        <span class="value">{{ component.serialNumber || 'N/A' }}</span>
                      </div>
                      <div class="detail-item">
                        <span class="label">Warranty Expiry:</span>
                        <span class="value">{{ (component.warrantyExpiry | date:'MMM dd, yyyy') || 'N/A' }}</span>
                      </div>
                    </div>
                  </div>

                  <div class="detail-section">
                    <h6>Maintenance Information</h6>
                    <div class="detail-grid">
                      <div class="detail-item">
                        <span class="label">Maintenance Interval:</span>
                        <span class="value">{{ component.maintenanceIntervalDays || 'N/A' }} days</span>
                      </div>
                      <div class="detail-item">
                        <span class="label">Last Maintenance:</span>
                        <span class="value">{{ (component.lastMaintenanceDate | date:'MMM dd, yyyy') || 'N/A' }}</span>
                      </div>
                      <div class="detail-item">
                        <span class="label">Next Maintenance:</span>
                        <span class="value">{{ (component.nextMaintenanceDate | date:'MMM dd, yyyy') || 'N/A' }}</span>
                      </div>
                      <div class="detail-item">
                        <span class="label">Status:</span>
                        <span class="value" [ngClass]="component.isActive ? 'status-active' : 'status-inactive'">
                          {{ component.isActive ? 'Active' : 'Inactive' }}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div class="detail-section" *ngIf="component.description">
                    <h6>Description</h6>
                    <p class="description">{{ component.description }}</p>
                  </div>                  <div class="detail-section" *ngIf="component.specifications">
                    <h6>Specifications</h6>
                    <p class="description">{{ component.specifications }}</p>
                  </div>                  <div class="detail-section" *ngIf="component.diagramUrl">
                    <h6>2D Component Drawing</h6>
                    <div class="component-diagram-container">
                      <img [src]="component.diagramUrl" [alt]="'2D Drawing for ' + component.componentName" class="component-diagram-image">
                      <div class="diagram-metadata">
                        <p><strong>Component:</strong> {{ component.componentName }}</p>
                        <p><strong>Code:</strong> {{ component.componentCode }}</p>
                        <p><strong>Category:</strong> {{ component.category }}</p>
                      </div>
                    </div>
                  </div>
                  <div class="detail-section" *ngIf="!component.diagramUrl">
                    <h6>2D Component Drawing</h6>
                    <div class="no-component-diagram">
                      <p>No 2D drawing available for this component</p>
                      <small>Add a diagram URL to display technical drawings</small>
                    </div>
                  </div>
                </div>
              </div>

              <div class="children" *ngIf="isExpanded(component) && hasChildren(component)">
                <ng-container *ngFor="let child of getChildren(component)">
                  <ng-container *ngTemplateOutlet="treeNode; context: {$implicit: child, level: level + 1}"></ng-container>
                </ng-container>
              </div>
            </div>
          </ng-template>
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
    }

    .subcomponents-container {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 15px;
    }

    .component-card {
      background: white;
      border: 1px solid #e0e0e0;
      border-radius: 6px;
      overflow: hidden;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
      transition: box-shadow 0.3s ease;
    }

    .component-card:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .component-header {
      background: linear-gradient(135deg, #7b1fa2 0%, #5a1380 100%);
      color: white;
      padding: 12px 15px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .component-header h5 {
      margin: 0;
      color: white;
    }

    .component-details {
      padding: 15px;
    }

    .component-details p {
      margin: 8px 0;
      font-size: 13px;
      color: #666;
      line-height: 1.5;
    }

    .component-details strong {
      color: #333;
    }    .no-components {
      text-align: center;
      padding: 40px;
      color: #999;
      background-color: #f9f9f9;
      border-radius: 6px;
    }    .tree-container {
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
    }    .node-content {
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
      transition: color 0.2s ease;
    }

    .expand-btn:hover {
      color: #5a1380;
    }

    .expand-btn .arrow {
      display: inline-block;
      transition: transform 0.2s ease;
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
      flex: 1;
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

    .node-info:hover {
      background-color: rgba(123, 31, 162, 0.1);
    }    .node-details {
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
    }    .description {
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
      grid-template-columns: repeat(2, 1fr);
      gap: 8px;
      font-size: 12px;
    }

    .detail-label {
      font-weight: bold;
      color: #7b1fa2;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.3px;
    }    .detail-value {
      color: #555;
      padding: 3px 5px;
      background: white;
      border-radius: 2px;
      border: 1px solid #ddd;
    }    .component-diagram-container {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 12px;
      border: 2px solid #e0e0e0;
      border-radius: 6px;
      padding: 15px;
      background-color: #fafafa;
      min-height: 250px;
    }

    .component-diagram-image {
      display: block;
      width: auto;
      max-width: 100%;
      max-height: 400px;
      height: auto;
      object-fit: contain;
      border-radius: 4px;
      background: white;
      padding: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .diagram-metadata {
      width: 100%;
      padding: 10px;
      background: white;
      border-radius: 4px;
      border-left: 3px solid #7b1fa2;
      font-size: 11px;
    }

    .diagram-metadata p {
      margin: 4px 0;
      color: #555;
    }

    .diagram-metadata strong {
      color: #7b1fa2;
      font-weight: 600;
    }

    .no-component-diagram {
      width: 100%;
      padding: 30px 15px;
      background: linear-gradient(135deg, #f5f5f5 0%, #fafafa 100%);
      border-radius: 6px;
      border: 2px dashed #ddd;
      text-align: center;
      color: #999;
    }

    .no-component-diagram p {
      margin: 8px 0 3px 0;
      font-size: 13px;
    }    .no-component-diagram small {
      font-size: 11px;
      color: #bbb;
    }

    .children {
      margin-left: 10px;
      padding: 8px 0 8px 8px;
      border-left: 2px dotted #7b1fa2;
    }

    @media (max-width: 768px) {
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
export class AssetListComponent implements OnInit {
  assets$: Observable<Asset[]>;
  selectedAssetId: string | null = null;
  selectedAsset: Asset | null = null;
  assetComponents: ComponentMaster[] = [];
  componentTree: ComponentMaster[] = [];
  expandedNodes: Set<string> = new Set();
  selectedComponentId: string | null = null;

  constructor(
    private assetService: AssetService,
    private componentService: ComponentMasterService,
    private route: ActivatedRoute
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
  }
  closeDetails(): void {
    this.selectedAssetId = null;
    this.selectedAsset = null;
    this.assetComponents = [];
    this.componentTree = [];
    this.expandedNodes.clear();
    this.selectedComponentId = null;
  }  private loadAssetComponents(assetId: string): void {
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
}

