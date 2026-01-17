import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ComponentInspectionPointsService } from '../../services/component-inspection-points.service';
import {
  ComponentInspectionPoint,
  ComponentHierarchy,
  ComponentPointCoverage
} from '../../models';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-component-inspection-points',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="component-inspection-points-container">
      <div class="header">
        <h2>Component Inspection Points Mapping</h2>
        <p class="subtitle">Link inspection points to components and sub-components</p>
      </div>

      <div class="tabs">
        <button [class.active]="activeTab === 'hierarchy'" (click)="activeTab = 'hierarchy'" class="tab-button">
          Component Hierarchy
        </button>
        <button [class.active]="activeTab === 'mapping'" (click)="activeTab = 'mapping'" class="tab-button">
          Point Mappings
        </button>
        <button [class.active]="activeTab === 'coverage'" (click)="activeTab = 'coverage'" class="tab-button">
          Coverage Analysis
        </button>
      </div>

      <!-- Component Hierarchy Tab -->
      <div class="tab-content" *ngIf="activeTab === 'hierarchy'">
        <div class="section">
          <h3>Component Hierarchy</h3>
          <table class="table">
            <thead>
              <tr>
                <th>Parent Component</th>
                <th>Child Component</th>
                <th>Relationship</th>
                <th>Sequence</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let hierarchy of hierarchies$ | async">
                <td><strong>{{ hierarchy.parentComponentId }}</strong></td>
                <td>{{ hierarchy.childComponentId }}</td>
                <td><span class="badge">{{ hierarchy.relationshipType }}</span></td>
                <td>{{ hierarchy.sequence }}</td>
                <td>
                  <span [class.active]="hierarchy.isActive" class="status-badge">
                    {{ hierarchy.isActive ? 'Active' : 'Inactive' }}
                  </span>
                </td>
                <td>
                  <button class="btn btn-sm btn-edit" (click)="editHierarchy(hierarchy)">Edit</button>
                  <button class="btn btn-sm btn-delete" (click)="deleteHierarchy(hierarchy.hierarchyId)">Delete</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="section add-section">
          <h4>Add Component Hierarchy</h4>
          <form (ngSubmit)="addHierarchy()" class="form-group">
            <div class="form-row">
              <input type="text" [(ngModel)]="newHierarchy.parentComponentId" name="parentComponentId" placeholder="Parent Component ID" class="form-control" required>
              <input type="text" [(ngModel)]="newHierarchy.childComponentId" name="childComponentId" placeholder="Child Component ID" class="form-control" required>
            </div>
            <div class="form-row">
              <select [(ngModel)]="newHierarchy.relationshipType" name="relationshipType" class="form-control" required>
                <option value="">Select Relationship</option>
                <option value="Assembly">Assembly</option>
                <option value="SubAssembly">SubAssembly</option>
                <option value="Part">Part</option>
              </select>
              <input type="number" [(ngModel)]="newHierarchy.sequence" name="sequence" placeholder="Sequence" class="form-control" required>
            </div>
            <button type="submit" class="btn btn-primary">Add Hierarchy</button>
          </form>
        </div>
      </div>

      <!-- Point Mappings Tab -->
      <div class="tab-content" *ngIf="activeTab === 'mapping'">
        <div class="section">
          <h3>Component to Inspection Point Mappings</h3>
          <table class="table">
            <thead>
              <tr>
                <th>Component</th>
                <th>Sub-Component</th>
                <th>Point ID</th>
                <th>Component Level</th>
                <th>Sub-Component Level</th>
                <th>Priority</th>
                <th>Sequence</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let mapping of componentInspectionPoints$ | async">
                <td><strong>{{ mapping.componentId }}</strong></td>
                <td>{{ mapping.subComponentId || '-' }}</td>
                <td>{{ mapping.pointId }}</td>
                <td>
                  <input type="checkbox" [checked]="mapping.applicableToComponent" disabled>
                </td>
                <td>
                  <input type="checkbox" [checked]="mapping.applicableToSubComponent" disabled>
                </td>
                <td>
                  <span [ngClass]="'priority-' + mapping.priority.toLowerCase()" class="priority-badge">
                    {{ mapping.priority }}
                  </span>
                </td>
                <td>{{ mapping.inspectionSequence }}</td>
                <td>
                  <button class="btn btn-sm btn-edit" (click)="editMapping(mapping)">Edit</button>
                  <button class="btn btn-sm btn-delete" (click)="deleteMapping(mapping.mappingId, mapping.componentId)">Delete</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="section add-section">
          <h4>Add Point Mapping</h4>
          <form (ngSubmit)="addMapping()" class="form-group">
            <div class="form-row">
              <input type="text" [(ngModel)]="newMapping.componentId" name="componentId" placeholder="Component ID" class="form-control" required>
              <input type="text" [(ngModel)]="newMapping.subComponentId" name="subComponentId" placeholder="Sub-Component ID" class="form-control">
            </div>
            <div class="form-row">
              <input type="text" [(ngModel)]="newMapping.pointId" name="pointId" placeholder="Point ID" class="form-control" required>
              <input type="number" [(ngModel)]="newMapping.inspectionSequence" name="inspectionSequence" placeholder="Sequence" class="form-control" required>
            </div>
            <div class="form-row">
              <select [(ngModel)]="newMapping.priority" name="priority" class="form-control" required>
                <option value="">Select Priority</option>
                <option value="Critical">Critical</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
              <label>
                <input type="checkbox" [(ngModel)]="newMapping.applicableToComponent" name="applicableToComponent">
                Applicable to Component
              </label>
            </div>
            <div class="form-row">
              <label>
                <input type="checkbox" [(ngModel)]="newMapping.applicableToSubComponent" name="applicableToSubComponent">
                Applicable to Sub-Component
              </label>
            </div>
            <button type="submit" class="btn btn-primary">Add Mapping</button>
          </form>
        </div>
      </div>

      <!-- Coverage Analysis Tab -->
      <div class="tab-content" *ngIf="activeTab === 'coverage'">
        <div class="section">
          <h3>Inspection Point Coverage by Component</h3>
          <table class="table">
            <thead>
              <tr>
                <th>Component ID</th>
                <th>Total Points</th>
                <th>Mapped Points</th>
                <th>Coverage %</th>
                <th>Last Updated</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let coverage of coverage$ | async">
                <td><strong>{{ coverage.componentId }}</strong></td>
                <td>{{ coverage.totalInspectionPoints }}</td>
                <td>{{ coverage.mappedPoints }}</td>
                <td>
                  <div class="coverage-bar">
                    <div class="coverage-fill" [style.width.%]="coverage.coveragePercentage"></div>
                    <span class="coverage-text">{{ coverage.coveragePercentage | number:'1.1-1' }}%</span>
                  </div>
                </td>
                <td>{{ coverage.lastUpdated | date:'short' }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="section stats">
          <h4>Coverage Statistics</h4>
          <div class="stat-grid">
            <div class="stat-card" *ngFor="let coverage of coverage$ | async">
              <div class="stat-value">{{ coverage.coveragePercentage | number:'1.1-1' }}%</div>
              <div class="stat-label">{{ coverage.componentId }}</div>
              <div class="stat-detail">{{ coverage.mappedPoints }}/{{ coverage.totalInspectionPoints }} points</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .component-inspection-points-container {
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

    .table {
      width: 100%;
      border-collapse: collapse;
      font-size: 14px;
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

    .badge {
      display: inline-block;
      padding: 4px 8px;
      background-color: #e3f2fd;
      color: #1976d2;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 500;
    }

    .status-badge {
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
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

    .priority-badge {
      display: inline-block;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
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
    }

    .form-control {
      flex: 1;
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
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
      font-size: 14px;
      cursor: pointer;
      font-weight: 500;
      transition: all 0.3s ease;
    }

    .btn-primary {
      background-color: #0066cc;
      color: white;
    }

    .btn-primary:hover {
      background-color: #0052a3;
    }

    .btn-sm {
      padding: 6px 12px;
      font-size: 12px;
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

    .coverage-bar {
      position: relative;
      height: 20px;
      background-color: #f0f0f0;
      border-radius: 4px;
      overflow: hidden;
    }

    .coverage-fill {
      height: 100%;
      background: linear-gradient(90deg, #4caf50, #8bc34a);
      transition: width 0.3s ease;
    }

    .coverage-text {
      position: absolute;
      top: 50%;
      left: 10px;
      transform: translateY(-50%);
      font-size: 12px;
      font-weight: 600;
      color: #333;
    }

    .stat-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 15px;
      margin-top: 20px;
    }

    .stat-card {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 20px;
      border-radius: 8px;
      text-align: center;
      box-shadow: 0 2px 8px rgba(0,0,0,0.15);
    }

    .stat-value {
      font-size: 28px;
      font-weight: bold;
      margin-bottom: 10px;
    }

    .stat-label {
      font-size: 14px;
      font-weight: 500;
      margin-bottom: 5px;
    }

    .stat-detail {
      font-size: 12px;
      opacity: 0.9;
    }

    label {
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: 500;
      cursor: pointer;
    }

    input[type="checkbox"] {
      cursor: pointer;
    }
  `]
})
export class ComponentInspectionPointsComponent implements OnInit {
  componentInspectionPoints$: Observable<ComponentInspectionPoint[]>;
  hierarchies$: Observable<ComponentHierarchy[]>;
  coverage$: Observable<ComponentPointCoverage[]>;

  activeTab: 'hierarchy' | 'mapping' | 'coverage' = 'hierarchy';

  newHierarchy: Partial<ComponentHierarchy> = {
    isActive: true,
    sequence: 1,
    relationshipType: 'SubAssembly'
  };

  newMapping: Partial<ComponentInspectionPoint> = {
    applicableToComponent: true,
    applicableToSubComponent: false,
    inspectionSequence: 1,
    priority: 'Medium'
  };

  constructor(private componentInspectionPointsService: ComponentInspectionPointsService) {
    this.componentInspectionPoints$ = this.componentInspectionPointsService.getComponentInspectionPoints();
    this.hierarchies$ = this.componentInspectionPointsService.getComponentHierarchies();
    this.coverage$ = this.componentInspectionPointsService.getComponentPointCoverage();
  }

  ngOnInit(): void {
    // Observables initialized in constructor
  }

  addHierarchy(): void {
    if (this.newHierarchy.parentComponentId && this.newHierarchy.childComponentId) {
      const hierarchy: ComponentHierarchy = {
        hierarchyId: 'hier-' + Date.now(),
        parentComponentId: this.newHierarchy.parentComponentId!,
        childComponentId: this.newHierarchy.childComponentId!,
        relationshipType: this.newHierarchy.relationshipType as any || 'SubAssembly',
        sequence: this.newHierarchy.sequence || 1,
        isActive: true
      };
      this.componentInspectionPointsService.addComponentHierarchy(hierarchy);
      this.newHierarchy = { isActive: true, sequence: 1, relationshipType: 'SubAssembly' };
      alert('Hierarchy added successfully!');
    }
  }

  editHierarchy(hierarchy: ComponentHierarchy): void {
    // Placeholder for edit functionality
    alert('Edit hierarchy functionality coming soon');
  }

  deleteHierarchy(hierarchyId: string): void {
    if (confirm('Are you sure?')) {
      this.componentInspectionPointsService.deleteComponentHierarchy(hierarchyId);
      alert('Hierarchy deleted!');
    }
  }

  addMapping(): void {
    if (this.newMapping.componentId && this.newMapping.pointId) {
      const mapping: ComponentInspectionPoint = {
        mappingId: 'map-' + Date.now(),
        componentId: this.newMapping.componentId!,
        subComponentId: this.newMapping.subComponentId,
        pointId: this.newMapping.pointId!,
        applicableToComponent: this.newMapping.applicableToComponent || true,
        applicableToSubComponent: this.newMapping.applicableToSubComponent || false,
        inspectionSequence: this.newMapping.inspectionSequence || 1,
        priority: this.newMapping.priority as any || 'Medium',
        createdAt: new Date()
      };
      this.componentInspectionPointsService.addComponentInspectionPoint(mapping);
      this.newMapping = { applicableToComponent: true, applicableToSubComponent: false, inspectionSequence: 1, priority: 'Medium' };
      alert('Mapping added successfully!');
    }
  }

  editMapping(mapping: ComponentInspectionPoint): void {
    // Placeholder for edit functionality
    alert('Edit mapping functionality coming soon');
  }

  deleteMapping(mappingId: string, componentId: string): void {
    if (confirm('Are you sure?')) {
      this.componentInspectionPointsService.deleteComponentInspectionPoint(mappingId, componentId);
      alert('Mapping deleted!');
    }
  }
}
