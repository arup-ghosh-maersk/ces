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
              </div>
              <div class="info-item">
                <label>Location ID</label>
                <span>{{ selectedAsset.locationId }}</span>
              </div>
            </div>
          </div>

          <div class="info-section">
            <h4>Sub-Components</h4>
            <div class="subcomponents-container" *ngIf="assetComponents && assetComponents.length > 0">
              <div *ngFor="let component of assetComponents" class="component-card">
                <div class="component-header">
                  <h5>{{ component.componentName }}</h5>
                  <span [ngClass]="'badge badge-' + component.category.toLowerCase()">{{ component.category }}</span>
                </div>
                <div class="component-details">
                  <p><strong>Component ID:</strong> {{ component.componentId }}</p>
                  <p><strong>Code:</strong> {{ component.componentCode }}</p>
                  <p><strong>Description:</strong> {{ component.description || 'N/A' }}</p>
                  <p><strong>Manufacturer:</strong> {{ component.manufacturer || 'N/A' }}</p>
                  <p><strong>Model Number:</strong> {{ component.modelNumber || 'N/A' }}</p>
                  <p><strong>Criticality:</strong> <span [ngClass]="'badge badge-' + component.criticality.toLowerCase()">{{ component.criticality }}</span></p>
                  <p><strong>Maintenance Interval:</strong> {{ component.maintenanceIntervalDays || 'N/A' }} days</p>
                  <p *ngIf="component.lastMaintenanceDate"><strong>Last Maintenance:</strong> {{ component.lastMaintenanceDate | date:'MMM dd, yyyy' }}</p>
                  <p *ngIf="component.nextMaintenanceDate"><strong>Next Maintenance:</strong> {{ component.nextMaintenanceDate | date:'MMM dd, yyyy' }}</p>
                </div>
              </div>
            </div>
            <div class="no-components" *ngIf="!assetComponents || assetComponents.length === 0">
              <p>No sub-components found for this asset</p>
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
    }

    .info-item span {
      color: #333;
      font-size: 14px;
      padding: 8px;
      background-color: white;
      border-radius: 4px;
      border: 1px solid #ddd;
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
    }

    .no-components {
      text-align: center;
      padding: 40px;
      color: #999;
      background-color: #f9f9f9;
      border-radius: 6px;
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
  }

  private loadAssetComponents(assetId: string): void {
    // Load components for this asset from the service
    const allComponents$ = this.componentService.getComponents();
    allComponents$.subscribe(components => {
      this.assetComponents = components.filter(comp => comp.assetId === assetId);
    });
  }
}

