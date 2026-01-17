import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { ComponentMaster } from '../../models';
import { ComponentMasterService } from '../../services/component-master.service';

@Component({
  selector: 'app-component-master',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="component-container">
      <div class="filter-section">
        <div class="filter-group">
          <label>Filter by Asset:</label>
          <select (change)="filterByAsset($event)" class="filter-select">
            <option value="">All Assets</option>
            <option value="asset-001">asset-001</option>
            <option value="asset-002">asset-002</option>
          </select>
        </div>
        <div class="filter-group">
          <label>Filter by Asset Type:</label>
          <select (change)="filterByAssetType($event)" class="filter-select">
            <option value="">All Asset Types</option>
            <option value="STS">STS</option>
            <option value="RTG">RTG</option>
            <option value="RMG">RMG</option>
          </select>
        </div>
        <div class="filter-group">
          <label>Filter by Category:</label>
          <select (change)="filterByCategory($event)" class="filter-select">
            <option value="">All Categories</option>
            <option value="Structural">Structural</option>
            <option value="Electrical">Electrical</option>
            <option value="Mechanical">Mechanical</option>
            <option value="Hydraulic">Hydraulic</option>
            <option value="Software">Software</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div class="filter-group">
          <label>Filter by Criticality:</label>
          <select (change)="filterByCriticality($event)" class="filter-select">
            <option value="">All Criticality Levels</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
      </div>

      <div class="components-section">
        <h3>Components</h3>
        <table class="table">
          <thead>
            <tr>
              <th>Component Code</th>
              <th>Component Name</th>
              <th>Asset ID</th>
              <th>Asset Type</th>
              <th>Category</th>
              <th>Criticality</th>
              <th>Manufacturer</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let component of filteredComponents$ | async" 
                (click)="selectComponent(component)"
                [class.selected]="selectedComponentId === component.componentId"
                class="clickable">
              <td><strong>{{ component.componentCode }}</strong></td>
              <td>{{ component.componentName }}</td>
              <td><a [routerLink]="['/assets']" [queryParams]="{ assetId: component.assetId }" class="asset-link">{{ component.assetId }}</a></td>
              <td><span [ngClass]="'badge badge-' + component.assetType.toLowerCase()">{{ component.assetType }}</span></td>
              <td><span [ngClass]="'badge badge-category-' + (component.category.toLowerCase() || 'other')">{{ component.category }}</span></td>
              <td><span [ngClass]="'criticality criticality-' + (component.criticality.toLowerCase() || 'low')">{{ component.criticality }}</span></td>
              <td>{{ component.manufacturer || 'N/A' }}</td>
              <td>
                <span [ngClass]="'status status-' + (component.isActive ? 'active' : 'inactive')">
                  {{ component.isActive ? 'Active' : 'Inactive' }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>      <div class="component-details-section" *ngIf="selectedComponent" id="component-details">
        <div class="details-header">
          <h3>Component Details</h3>
          <button class="btn btn-close" (click)="closeDetails()">✕</button>
        </div>

        <div class="component-info-card">
          <div class="info-section">
            <h4>Basic Information</h4>
            <div class="info-grid">
              <div class="info-item">
                <label>Component Code</label>
                <span>{{ selectedComponent.componentCode }}</span>
              </div>
              <div class="info-item">
                <label>Component Name</label>
                <span>{{ selectedComponent.componentName }}</span>
              </div>
              <div class="info-item">
                <label>Asset ID</label>
                <span><a [routerLink]="['/assets']" [queryParams]="{ assetId: selectedComponent.assetId }" class="asset-link">{{ selectedComponent.assetId }}</a></span>
              </div>
              <div class="info-item">
                <label>Asset Type</label>
                <span [ngClass]="'badge badge-' + selectedComponent.assetType.toLowerCase()">{{ selectedComponent.assetType }}</span>
              </div>
              <div class="info-item">
                <label>Category</label>
                <span [ngClass]="'badge badge-category-' + (selectedComponent.category.toLowerCase() || 'other')">{{ selectedComponent.category }}</span>
              </div>
              <div class="info-item">
                <label>Criticality</label>
                <span [ngClass]="'criticality criticality-' + (selectedComponent.criticality.toLowerCase() || 'low')">{{ selectedComponent.criticality }}</span>
              </div>
              <div class="info-item">
                <label>Description</label>
                <span>{{ selectedComponent.description || 'N/A' }}</span>
              </div>
              <div class="info-item">
                <label>Status</label>
                <span [ngClass]="'status status-' + (selectedComponent.isActive ? 'active' : 'inactive')">
                  {{ selectedComponent.isActive ? 'Active' : 'Inactive' }}
                </span>
              </div>
            </div>
          </div>

          <div class="info-section">
            <h4>Manufacturer & Model</h4>
            <div class="info-grid">
              <div class="info-item">
                <label>Manufacturer</label>
                <span>{{ selectedComponent.manufacturer || 'N/A' }}</span>
              </div>
              <div class="info-item">
                <label>Model Number</label>
                <span>{{ selectedComponent.modelNumber || 'N/A' }}</span>
              </div>
              <div class="info-item">
                <label>Serial Number</label>
                <span>{{ selectedComponent.serialNumber || 'N/A' }}</span>
              </div>
              <div class="info-item">
                <label>Specifications</label>
                <span>{{ selectedComponent.specifications || 'N/A' }}</span>
              </div>
            </div>
          </div>

          <div class="info-section">
            <h4>Maintenance & Warranty</h4>
            <div class="info-grid">
              <div class="info-item">
                <label>Maintenance Interval</label>
                <span>{{ selectedComponent.maintenanceIntervalDays || 'N/A' }} days</span>
              </div>
              <div class="info-item">
                <label>Last Maintenance Date</label>
                <span>{{ (selectedComponent.lastMaintenanceDate | date:'MMM dd, yyyy') || 'N/A' }}</span>
              </div>
              <div class="info-item">
                <label>Next Maintenance Date</label>
                <span [ngClass]="selectedComponent.nextMaintenanceDate && isMaintenanceDue(selectedComponent.nextMaintenanceDate) ? 'maintenance-due' : 'maintenance-ok'">
                  {{ (selectedComponent.nextMaintenanceDate | date:'MMM dd, yyyy') || 'N/A' }}
                </span>
              </div>
              <div class="info-item">
                <label>Warranty Expiry</label>
                <span [ngClass]="selectedComponent.warrantyExpiry && isWarrantyExpiring(selectedComponent.warrantyExpiry) ? 'warranty-expiring' : 'warranty-ok'">
                  {{ (selectedComponent.warrantyExpiry | date:'MMM dd, yyyy') || 'N/A' }}
                </span>
              </div>
            </div>
          </div>

          <div class="info-section" *ngIf="selectedComponent.parentComponentId">
            <h4>Parent Component</h4>
            <div class="parent-info">
              <span class="parent-link" (click)="selectComponentById(selectedComponent.parentComponentId)">
                {{ selectedComponent.parentComponentId }} →
              </span>
            </div>
          </div>

          <div class="info-section" *ngIf="childComponents && childComponents.length > 0">
            <h4>Sub-Components</h4>
            <div class="children-grid">
              <div *ngFor="let child of childComponents" class="child-component-card">
                <div class="child-header">
                  <h5>{{ child.componentName }}</h5>
                  <span [ngClass]="'badge badge-category-' + (child.category.toLowerCase() || 'other')">{{ child.category }}</span>
                </div>
                <div class="child-details">
                  <p><strong>Code:</strong> {{ child.componentCode }}</p>
                  <p><strong>Criticality:</strong> <span [ngClass]="'criticality criticality-' + (child.criticality.toLowerCase() || 'low')">{{ child.criticality }}</span></p>
                  <p><strong>Status:</strong> <span [ngClass]="'status status-' + (child.isActive ? 'active' : 'inactive')">{{ child.isActive ? 'Active' : 'Inactive' }}</span></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .component-container {
      padding: 20px;
      max-width: 1600px;
      margin: 0 auto;
    }

    h3 {
      color: #666;
      margin-bottom: 15px;
    }

    h4 {
      color: #003D7A;
      margin-bottom: 12px;
    }

    h5 {
      margin: 0 0 8px 0;
      color: #333;
    }

    .filter-section {
      display: flex;
      gap: 15px;
      margin-bottom: 20px;
      flex-wrap: wrap;
      background: white;
      padding: 15px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .filter-group {
      display: flex;
      gap: 8px;
      align-items: center;
    }

    .filter-group label {
      font-weight: bold;
      color: #666;
      white-space: nowrap;
      font-size: 13px;
    }

    .filter-select {
      padding: 8px 12px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 13px;
      cursor: pointer;
    }

    .components-section {
      background: white;
      border-radius: 8px;
      padding: 20px;
      margin-bottom: 20px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      overflow-x: auto;
    }

    .table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 0;
      background: white;
      border-radius: 8px;
      overflow: hidden;
    }

    .table thead {
      background-color: #f5f5f5;
    }

    .table th,
    .table td {
      padding: 12px;
      text-align: left;
      border-bottom: 1px solid #ddd;
      font-size: 13px;
    }

    .table tr {
      cursor: pointer;
      transition: background-color 0.2s ease;
    }

    .table tr:hover {
      background-color: #f9f9f9;
    }

    .table tr.selected {
      background-color: #c8e6c9;
      font-weight: bold;
    }

    .badge {
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 11px;
      font-weight: bold;
      display: inline-block;
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

    .badge-category-structural {
      background-color: #e0f2f1;
      color: #00695c;
    }

    .badge-category-electrical {
      background-color: #fff3e0;
      color: #e65100;
    }

    .badge-category-mechanical {
      background-color: #f1f8e9;
      color: #558b2f;
    }

    .badge-category-hydraulic {
      background-color: #ede7f6;
      color: #4527a0;
    }

    .badge-category-software {
      background-color: #f3e5f5;
      color: #6a1b9a;
    }

    .badge-category-other {
      background-color: #fce4ec;
      color: #880e4f;
    }

    .criticality {
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 11px;
      font-weight: bold;
      display: inline-block;
    }

    .criticality-critical {
      background-color: #ffcdd2;
      color: #c62828;
    }

    .criticality-high {
      background-color: #ffebee;
      color: #d32f2f;
    }

    .criticality-medium {
      background-color: #fff9c4;
      color: #f57f17;
    }

    .criticality-low {
      background-color: #e3f2fd;
      color: #1976d2;
    }

    .status {
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 11px;
      font-weight: bold;
      display: inline-block;
    }

    .status-active {
      background-color: #e3f2fd;
      color: #1976d2;
    }

    .status-inactive {
      background-color: #ffccbc;
      color: #d84315;
    }

    .asset-link {
      color: #1976d2;
      text-decoration: none;
      font-weight: bold;
      cursor: pointer;
      transition: color 0.3s ease;
    }

    .asset-link:hover {
      color: #1565c0;
      text-decoration: underline;
    }

    .component-details-section {
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

    .component-info-card {
      display: grid;
      gap: 30px;
    }

    .info-section {
      padding: 20px;
      background-color: #f9f9f9;
      border-radius: 6px;
      border-left: 4px solid #003D7A;
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
      color: #003D7A;
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

    .parent-info {
      padding: 15px;
      background-color: white;
      border-radius: 4px;
      border-left: 3px solid #ff9800;
    }

    .parent-link {
      color: #1976d2;
      text-decoration: none;
      font-weight: bold;
      cursor: pointer;
      transition: color 0.3s ease;
      display: inline-block;
    }

    .parent-link:hover {
      color: #1565c0;
      text-decoration: underline;
    }

    .children-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 15px;
    }

    .child-component-card {
      background: white;
      border: 1px solid #e0e0e0;
      border-radius: 6px;
      overflow: hidden;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
      transition: box-shadow 0.3s ease;
    }

    .child-component-card:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .child-header {
      background: linear-gradient(135deg, #7b1fa2 0%, #5a1380 100%);
      color: white;
      padding: 12px 15px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .child-header h5 {
      margin: 0;
      color: white;
    }

    .child-details {
      padding: 15px;
    }

    .child-details p {
      margin: 8px 0;
      font-size: 13px;
      color: #666;
      line-height: 1.5;
    }

    .child-details strong {
      color: #333;
    }

    .maintenance-due {
      color: #ff6f00;
      font-weight: bold;
    }

    .maintenance-ok {
      color: #388e3c;
    }

    .warranty-expiring {
      color: #ff6f00;
      font-weight: bold;
    }

    .warranty-ok {
      color: #388e3c;
    }

    @media (max-width: 768px) {
      .component-container {
        padding: 10px;
      }

      .info-grid {
        grid-template-columns: 1fr;
      }

      .children-grid {
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

      .filter-section {
        flex-direction: column;
      }

      .filter-group {
        flex-direction: column;
      }
    }
  `]
})
export class ComponentMasterComponent implements OnInit {
  filteredComponents$: Observable<ComponentMaster[]>;
  selectedComponentId: string | null = null;
  selectedComponent: ComponentMaster | null = null;
  childComponents: ComponentMaster[] = [];
  private currentFilter: { assetId?: string; assetType?: string; category?: string; criticality?: string } = {};
  private allComponents: ComponentMaster[] = [];
  constructor(
    private componentMasterService: ComponentMasterService,
    private route: ActivatedRoute
  ) {
    this.filteredComponents$ = this.componentMasterService.getComponents();
  }
  ngOnInit(): void {
    // Cache all components for filtering operations
    this.componentMasterService.getComponents().subscribe(components => {
      this.allComponents = components;
    });

    // Check for componentId in route parameters
    this.route.params.subscribe(params => {
      const componentId = params['componentId'];
      if (componentId) {
        this.componentMasterService.getComponents().subscribe(components => {
          const component = components.find(c => c.componentId === componentId);
          if (component) {
            this.selectComponent(component);
            
            // Scroll to component details section if autoScroll query param is set
            this.route.queryParams.subscribe(queryParams => {
              if (queryParams['autoScroll'] === 'details') {
                setTimeout(() => {
                  const detailsElement = document.getElementById('component-details');
                  if (detailsElement) {
                    detailsElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }, 300); // Small delay to ensure rendering
              }
            });
          }
        });
      }
    });
  }

  filterByAsset(event: any): void {
    this.currentFilter.assetId = event.target.value;
    this.applyFilters();
    this.closeDetails();
  }

  filterByAssetType(event: any): void {
    this.currentFilter.assetType = event.target.value;
    this.applyFilters();
    this.closeDetails();
  }

  filterByCategory(event: any): void {
    this.currentFilter.category = event.target.value;
    this.applyFilters();
    this.closeDetails();
  }

  filterByCriticality(event: any): void {
    this.currentFilter.criticality = event.target.value;
    this.applyFilters();
    this.closeDetails();
  }

  private applyFilters(): void {
    if (!this.currentFilter.assetId && !this.currentFilter.assetType && !this.currentFilter.category && !this.currentFilter.criticality) {
      this.filteredComponents$ = this.componentMasterService.getComponents();
      return;
    }

    this.componentMasterService.getComponents().subscribe(components => {
      let filtered = components;

      if (this.currentFilter.assetId) {
        filtered = filtered.filter(c => c.assetId === this.currentFilter.assetId);
      }

      if (this.currentFilter.assetType) {
        filtered = filtered.filter(c => c.assetType === this.currentFilter.assetType);
      }

      if (this.currentFilter.category) {
        filtered = filtered.filter(c => c.category === this.currentFilter.category);
      }

      if (this.currentFilter.criticality) {
        filtered = filtered.filter(c => c.criticality === this.currentFilter.criticality);
      }

      this.filteredComponents$ = new Observable(observer => {
        observer.next(filtered);
        observer.complete();
      });
    });
  }

  selectComponent(component: ComponentMaster): void {
    this.selectedComponentId = component.componentId;
    this.selectedComponent = component;
    this.loadChildComponents(component.componentId);
  }

  closeDetails(): void {
    this.selectedComponentId = null;
    this.selectedComponent = null;
    this.childComponents = [];
  }

  selectComponentById(componentId: string): void {
    const component = this.allComponents.find(c => c.componentId === componentId);
    if (component) {
      this.selectComponent(component);
    }
  }

  private loadChildComponents(parentComponentId: string): void {
    this.childComponents = this.allComponents.filter(c => c.parentComponentId === parentComponentId);
  }

  isMaintenanceDue(date: Date | undefined): boolean {
    if (!date) return false;
    const today = new Date();
    const daysUntil = Math.floor((new Date(date).getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntil <= 30 && daysUntil >= 0;
  }

  isWarrantyExpiring(date: Date | undefined): boolean {
    if (!date) return false;
    const today = new Date();
    const daysUntil = Math.floor((new Date(date).getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntil <= 90 && daysUntil >= 0;
  }
}
