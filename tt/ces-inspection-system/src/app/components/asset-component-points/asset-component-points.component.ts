import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ComponentInspectionPointsService } from '../../services/component-inspection-points.service';
import { ITPTemplateService } from '../../services/itp-template.service';
import {
  ComponentInspectionPoint,
  ComponentHierarchy,
  InspectionPoint,
  ComponentMaster
} from '../../models';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-asset-component-points',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="asset-component-points-container">
      <!-- Header -->
      <div class="header">
        <h1>Asset Component Inspection Points</h1>
        <p class="subtitle">Map inspection points to asset components and sub-components</p>
      </div>

      <!-- Navigation Tabs -->
      <div class="nav-tabs">
        <button 
          [class.active]="currentView === 'structure'" 
          (click)="currentView = 'structure'"
          class="nav-tab">
          📊 Component Structure
        </button>
        <button 
          [class.active]="currentView === 'mapping'" 
          (click)="currentView = 'mapping'"
          class="nav-tab">
          🔗 Point Mappings
        </button>
        <button 
          [class.active]="currentView === 'hierarchy'" 
          (click)="currentView = 'hierarchy'"
          class="nav-tab">
          🏗️ Hierarchy
        </button>
        <button 
          [class.active]="currentView === 'visual'" 
          (click)="currentView = 'visual'"
          class="nav-tab">
          🎨 Visual Map
        </button>
      </div>

      <!-- Component Structure View -->
      <div *ngIf="currentView === 'structure'" class="view-container">
        <div class="section">
          <h2>Component Hierarchy Structure</h2>
          <p class="section-subtitle">Browse components and their sub-components</p>
          
          <div class="component-tree">
            <div class="tree-controls">
              <input 
                type="text" 
                [(ngModel)]="filterComponent" 
                placeholder="Filter by component ID..."
                class="search-input">
              <button (click)="expandAllComponents()" class="btn btn-secondary">Expand All</button>
              <button (click)="collapseAllComponents()" class="btn btn-secondary">Collapse All</button>
            </div>

            <div class="tree-items" *ngIf="hierarchies$ | async as hierarchies">
              <div *ngFor="let hierarchy of getFilteredHierarchies(hierarchies)" class="tree-group">
                <div class="tree-parent" (click)="toggleComponentExpanded(hierarchy.parentComponentId)">
                  <span class="expand-icon" [class.expanded]="expandedComponents.has(hierarchy.parentComponentId)">
                    ▶
                  </span>
                  <span class="component-icon">📦</span>
                  <strong>{{ hierarchy.parentComponentId }}</strong>
                  <span class="badge-small">Component</span>
                </div>

                <div *ngIf="expandedComponents.has(hierarchy.parentComponentId)" class="tree-children">
                  <div class="tree-child">
                    <span class="child-icon">├─</span>
                    <span class="component-icon">⚙️</span>
                    <span>{{ hierarchy.childComponentId }}</span>
                    <span class="badge-small">{{ hierarchy.relationshipType }}</span>
                    <span class="sequence-badge">Seq: {{ hierarchy.sequence }}</span>
                    <span [ngClass]="hierarchy.isActive ? 'status-active' : 'status-inactive'" class="status-small">
                      {{ hierarchy.isActive ? '✓' : '✗' }}
                    </span>
                  </div>

                  <!-- Show points for this sub-component -->
                  <div class="points-for-component" *ngIf="getPointsForSubComponent(hierarchy.childComponentId) as points">
                    <div *ngFor="let point of points" class="point-item">
                      <span class="point-icon">📍</span>
                      <span class="point-info">
                        <strong>{{ point.pointId }}</strong>
                        <span class="point-priority" [ngClass]="'priority-' + point.priority.toLowerCase()">
                          {{ point.priority }}
                        </span>
                      </span>
                    </div>
                    <div *ngIf="!points || points.length === 0" class="no-points">
                      No inspection points mapped
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Mapping View -->
      <div *ngIf="currentView === 'mapping'" class="view-container">
        <div class="section">
          <h2>Inspection Point Mappings</h2>
          <p class="section-subtitle">View and manage component-to-point mappings</p>

          <div class="mapping-controls">
            <div class="control-group">
              <label>Filter by Component:</label>
              <input 
                type="text" 
                [(ngModel)]="filterMappingComponent" 
                placeholder="Component ID..."
                class="form-control-small">
            </div>
            <div class="control-group">
              <label>Filter by Priority:</label>
              <select [(ngModel)]="filterMappingPriority" class="form-control-small">
                <option value="">All Priorities</option>
                <option value="Critical">Critical</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>

          <table class="mapping-table" *ngIf="componentInspectionPoints$ | async as mappings">
            <thead>
              <tr>
                <th>Component</th>
                <th>Sub-Component</th>
                <th>Inspection Point</th>
                <th>Priority</th>
                <th>Comp Level</th>
                <th>Sub Level</th>
                <th>Sequence</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let mapping of getFilteredMappings(mappings)" class="mapping-row">
                <td><strong>{{ mapping.componentId }}</strong></td>
                <td>{{ mapping.subComponentId || '—' }}</td>
                <td>
                  <span class="point-badge">{{ mapping.pointId }}</span>
                </td>
                <td>
                  <span [ngClass]="'priority-' + mapping.priority.toLowerCase()" class="priority-badge">
                    {{ mapping.priority }}
                  </span>
                </td>
                <td class="center">
                  <span [class.checked]="mapping.applicableToComponent" class="checkbox">
                    {{ mapping.applicableToComponent ? '✓' : '—' }}
                  </span>
                </td>
                <td class="center">
                  <span [class.checked]="mapping.applicableToSubComponent" class="checkbox">
                    {{ mapping.applicableToSubComponent ? '✓' : '—' }}
                  </span>
                </td>
                <td class="center">{{ mapping.inspectionSequence }}</td>
                <td class="actions">
                  <button class="btn-icon btn-edit" (click)="editMapping(mapping)" title="Edit">✎</button>
                  <button class="btn-icon btn-delete" (click)="deleteMapping(mapping.mappingId, mapping.componentId)" title="Delete">✕</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Add Mapping Form -->
        <div class="section">
          <h3>Create New Mapping</h3>
          <form (ngSubmit)="addNewMapping()" class="mapping-form">
            <div class="form-grid">
              <div class="form-group">
                <label>Component ID *</label>
                <input 
                  type="text" 
                  [(ngModel)]="newMappingForm.componentId" 
                  name="componentId" 
                  placeholder="e.g., comp-001"
                  class="form-control" 
                  required>
              </div>
              <div class="form-group">
                <label>Sub-Component ID</label>
                <input 
                  type="text" 
                  [(ngModel)]="newMappingForm.subComponentId" 
                  name="subComponentId" 
                  placeholder="e.g., comp-001-01"
                  class="form-control">
              </div>
              <div class="form-group">
                <label>Inspection Point ID *</label>
                <input 
                  type="text" 
                  [(ngModel)]="newMappingForm.pointId" 
                  name="pointId" 
                  placeholder="e.g., pt-001"
                  class="form-control" 
                  required>
              </div>
              <div class="form-group">
                <label>Priority *</label>
                <select [(ngModel)]="newMappingForm.priority" name="priority" class="form-control" required>
                  <option value="Critical">Critical</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
              <div class="form-group">
                <label>Inspection Sequence *</label>
                <input 
                  type="number" 
                  [(ngModel)]="newMappingForm.inspectionSequence" 
                  name="inspectionSequence"
                  class="form-control" 
                  required>
              </div>
              <div class="form-group">
                <label>Applicable Levels</label>
                <div class="checkbox-group">
                  <label class="checkbox-label">
                    <input 
                      type="checkbox" 
                      [(ngModel)]="newMappingForm.applicableToComponent" 
                      name="applicableToComponent">
                    Component Level
                  </label>
                  <label class="checkbox-label">
                    <input 
                      type="checkbox" 
                      [(ngModel)]="newMappingForm.applicableToSubComponent" 
                      name="applicableToSubComponent">
                    Sub-Component Level
                  </label>
                </div>
              </div>
            </div>
            <button type="submit" class="btn btn-primary btn-lg">Add Mapping</button>
          </form>
        </div>
      </div>

      <!-- Hierarchy View -->
      <div *ngIf="currentView === 'hierarchy'" class="view-container">
        <div class="section">
          <h2>Component Hierarchy Management</h2>
          <p class="section-subtitle">Define parent-child component relationships</p>

          <table class="hierarchy-table" *ngIf="hierarchies$ | async as hierarchies">
            <thead>
              <tr>
                <th>Parent Component</th>
                <th>Child Component</th>
                <th>Relationship Type</th>
                <th>Sequence</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let h of hierarchies" class="hierarchy-row">
                <td><strong>{{ h.parentComponentId }}</strong></td>
                <td>{{ h.childComponentId }}</td>
                <td>
                  <span class="type-badge" [ngClass]="'type-' + h.relationshipType.toLowerCase()">
                    {{ h.relationshipType }}
                  </span>
                </td>
                <td class="center">{{ h.sequence }}</td>
                <td class="center">
                  <span [class.active]="h.isActive" class="status">
                    {{ h.isActive ? 'Active' : 'Inactive' }}
                  </span>
                </td>
                <td class="actions">
                  <button class="btn-icon btn-edit" (click)="editHierarchy(h)" title="Edit">✎</button>
                  <button class="btn-icon btn-delete" (click)="deleteHierarchy(h.hierarchyId)" title="Delete">✕</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Add Hierarchy Form -->
        <div class="section">
          <h3>Create New Hierarchy</h3>
          <form (ngSubmit)="addNewHierarchy()" class="hierarchy-form">
            <div class="form-grid">
              <div class="form-group">
                <label>Parent Component ID *</label>
                <input 
                  type="text" 
                  [(ngModel)]="newHierarchyForm.parentComponentId" 
                  name="parentComponentId" 
                  placeholder="e.g., comp-001"
                  class="form-control" 
                  required>
              </div>
              <div class="form-group">
                <label>Child Component ID *</label>
                <input 
                  type="text" 
                  [(ngModel)]="newHierarchyForm.childComponentId" 
                  name="childComponentId" 
                  placeholder="e.g., comp-001-01"
                  class="form-control" 
                  required>
              </div>
              <div class="form-group">
                <label>Relationship Type *</label>
                <select [(ngModel)]="newHierarchyForm.relationshipType" name="relationshipType" class="form-control" required>
                  <option value="Assembly">Assembly</option>
                  <option value="SubAssembly">SubAssembly</option>
                  <option value="Part">Part</option>
                </select>
              </div>
              <div class="form-group">
                <label>Sequence *</label>
                <input 
                  type="number" 
                  [(ngModel)]="newHierarchyForm.sequence" 
                  name="sequence"
                  class="form-control" 
                  required>
              </div>
            </div>
            <button type="submit" class="btn btn-primary btn-lg">Add Hierarchy</button>
          </form>
        </div>
      </div>

      <!-- Visual Map View -->
      <div *ngIf="currentView === 'visual'" class="view-container">
        <div class="section visual-map">
          <h2>Component Tree Visualization</h2>
          <p class="section-subtitle">Visual representation of component hierarchies with inspection points</p>

          <div class="visual-container">
            <div class="component-diagram" *ngIf="hierarchies$ | async as hierarchies">
              <div *ngFor="let hierarchy of hierarchies" class="component-card">
                <div class="component-box">
                  <div class="component-header">
                    <span class="icon">📦</span>
                    <div class="component-details">
                      <strong>{{ hierarchy.parentComponentId }}</strong>
                      <span class="type">{{ hierarchy.relationshipType }}</span>
                    </div>
                  </div>
                  
                  <div class="component-body">
                    <div class="sub-component">
                      <span class="icon">⚙️</span>
                      <span class="name">{{ hierarchy.childComponentId }}</span>
                      <span class="seq">#{{ hierarchy.sequence }}</span>
                    </div>

                    <!-- Points for this mapping -->
                    <div class="points-section" *ngIf="getPointsForSubComponent(hierarchy.childComponentId) as points">
                      <div class="points-label">Inspection Points:</div>
                      <div class="points-list">
                        <div *ngFor="let point of points" class="point-dot" 
                             [ngClass]="'priority-' + point.priority.toLowerCase()"
                             [title]="point.pointId">
                          {{ point.pointId }}
                        </div>
                        <div *ngIf="!points || points.length === 0" class="no-points-small">
                          No points
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="component-footer">
                    <span [class.active]="hierarchy.isActive" class="status-indicator">
                      {{ hierarchy.isActive ? '● Active' : '○ Inactive' }}
                    </span>
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
    .asset-component-points-container {
      padding: 20px;
      background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
      min-height: 100vh;
    }

    .header {
      margin-bottom: 30px;
      background: white;
      padding: 30px;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      border-left: 5px solid #0066cc;
    }

    .header h1 {
      margin: 0 0 10px;
      color: #1a1a1a;
      font-size: 28px;
    }

    .subtitle {
      margin: 0;
      color: #666;
      font-size: 14px;
    }

    .section-subtitle {
      margin: 0 0 20px;
      color: #666;
      font-size: 14px;
    }

    .nav-tabs {
      display: flex;
      gap: 10px;
      margin-bottom: 20px;
      background: white;
      padding: 10px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .nav-tab {
      flex: 1;
      padding: 12px 16px;
      border: 2px solid #ddd;
      background: white;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 500;
      color: #666;
      transition: all 0.3s ease;
    }

    .nav-tab:hover {
      border-color: #0066cc;
      color: #0066cc;
    }

    .nav-tab.active {
      background: #0066cc;
      color: white;
      border-color: #0066cc;
    }

    .view-container {
      animation: fadeIn 0.3s ease;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .section {
      background: white;
      padding: 25px;
      margin-bottom: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .section h2 {
      margin: 0 0 5px;
      color: #1a1a1a;
      border-bottom: 3px solid #0066cc;
      padding-bottom: 10px;
    }

    .section h3 {
      margin: 0 0 15px;
      color: #333;
    }

    /* Component Tree Styles */
    .component-tree {
      margin-top: 20px;
    }

    .tree-controls {
      margin-bottom: 20px;
      display: flex;
      gap: 10px;
    }

    .search-input {
      flex: 1;
      padding: 10px 15px;
      border: 2px solid #e0e0e0;
      border-radius: 6px;
      font-size: 14px;
    }

    .search-input:focus {
      outline: none;
      border-color: #0066cc;
      box-shadow: 0 0 0 2px rgba(0,102,204,0.1);
    }

    .tree-items {
      border-left: 2px solid #ddd;
      padding-left: 20px;
    }

    .tree-group {
      margin-bottom: 15px;
    }

    .tree-parent {
      padding: 10px;
      background: #f9f9f9;
      border-radius: 6px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 10px;
      transition: all 0.2s ease;
    }

    .tree-parent:hover {
      background: #f0f0f0;
    }

    .expand-icon {
      display: inline-block;
      width: 20px;
      text-align: center;
      transition: transform 0.2s ease;
    }

    .expand-icon.expanded {
      transform: rotate(90deg);
    }

    .component-icon {
      font-size: 18px;
    }

    .tree-children {
      margin-top: 10px;
      padding-left: 20px;
      border-left: 2px solid #ddd;
    }

    .tree-child {
      padding: 10px;
      background: #fafafa;
      border-radius: 6px;
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 10px;
    }

    .child-icon {
      color: #999;
      font-family: monospace;
    }

    .points-for-component {
      margin-top: 10px;
      padding: 10px;
      background: #e3f2fd;
      border-radius: 4px;
      border-left: 3px solid #0066cc;
    }

    .point-item {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 5px 0;
      font-size: 13px;
    }

    .point-icon {
      font-size: 14px;
    }

    .point-info {
      flex: 1;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .point-priority {
      padding: 2px 6px;
      border-radius: 3px;
      font-size: 11px;
      font-weight: 600;
      color: white;
    }

    .no-points {
      padding: 8px;
      color: #999;
      font-style: italic;
      font-size: 12px;
    }

    /* Badge Styles */
    .badge-small {
      display: inline-block;
      padding: 2px 8px;
      background: #e3f2fd;
      color: #0066cc;
      border-radius: 12px;
      font-size: 11px;
      font-weight: 600;
    }

    .sequence-badge {
      display: inline-block;
      padding: 2px 8px;
      background: #f3e5f5;
      color: #6a1b9a;
      border-radius: 12px;
      font-size: 11px;
      font-weight: 600;
    }

    .status-small {
      font-weight: bold;
      font-size: 14px;
    }

    .status-active {
      color: #2e7d32;
    }

    .status-inactive {
      color: #c62828;
    }

    .point-badge {
      display: inline-block;
      padding: 4px 10px;
      background: #e3f2fd;
      color: #0066cc;
      border-radius: 4px;
      font-family: monospace;
      font-weight: 500;
    }

    .priority-badge {
      display: inline-block;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 600;
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

    /* Table Styles */
    .mapping-table,
    .hierarchy-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 15px;
    }

    .mapping-table thead,
    .hierarchy-table thead {
      background: #f5f5f5;
    }

    .mapping-table th,
    .hierarchy-table th {
      padding: 12px;
      text-align: left;
      font-weight: 600;
      color: #333;
      border-bottom: 2px solid #ddd;
    }

    .mapping-table td,
    .hierarchy-table td {
      padding: 10px 12px;
      border-bottom: 1px solid #eee;
    }

    .mapping-table tbody tr:hover,
    .hierarchy-table tbody tr:hover {
      background-color: #f9f9f9;
    }

    .mapping-row,
    .hierarchy-row {
      transition: all 0.2s ease;
    }

    .center {
      text-align: center;
    }

    .checkbox {
      font-weight: bold;
      font-size: 16px;
    }

    .checkbox.checked {
      color: #2e7d32;
    }

    /* Form Styles */
    .mapping-controls {
      display: flex;
      gap: 20px;
      margin-bottom: 20px;
      padding: 15px;
      background: #f9f9f9;
      border-radius: 6px;
    }

    .control-group {
      flex: 1;
    }

    .control-group label {
      display: block;
      font-weight: 500;
      margin-bottom: 5px;
      color: #333;
      font-size: 13px;
    }

    .form-control-small {
      width: 100%;
      padding: 8px 12px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 13px;
    }

    .form-control-small:focus {
      outline: none;
      border-color: #0066cc;
      box-shadow: 0 0 0 2px rgba(0,102,204,0.1);
    }

    .form-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 15px;
      margin-bottom: 15px;
    }

    .form-group {
      display: flex;
      flex-direction: column;
    }

    .form-group label {
      font-weight: 500;
      margin-bottom: 6px;
      color: #333;
      font-size: 13px;
    }

    .form-control {
      padding: 10px 12px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
      transition: all 0.2s ease;
    }

    .form-control:focus {
      outline: none;
      border-color: #0066cc;
      box-shadow: 0 0 0 2px rgba(0,102,204,0.1);
    }

    .checkbox-group {
      display: flex;
      gap: 15px;
    }

    .checkbox-label {
      display: flex;
      align-items: center;
      gap: 6px;
      cursor: pointer;
      font-weight: 400;
      font-size: 14px;
    }

    .checkbox-label input[type="checkbox"] {
      cursor: pointer;
    }

    /* Button Styles */
    .btn {
      padding: 10px 16px;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 500;
      transition: all 0.3s ease;
      font-size: 14px;
    }

    .btn-secondary {
      background: #f0f0f0;
      color: #333;
      border: 1px solid #ddd;
    }

    .btn-secondary:hover {
      background: #e0e0e0;
    }

    .btn-primary {
      background: #0066cc;
      color: white;
    }

    .btn-primary:hover {
      background: #0052a3;
    }

    .btn-lg {
      padding: 12px 24px;
      font-size: 15px;
    }

    .btn-icon {
      padding: 6px 10px;
      border: none;
      background: none;
      cursor: pointer;
      font-size: 16px;
      transition: all 0.2s ease;
      border-radius: 4px;
    }

    .btn-edit {
      color: #0066cc;
    }

    .btn-edit:hover {
      background: #e3f2fd;
    }

    .btn-delete {
      color: #d32f2f;
    }

    .btn-delete:hover {
      background: #ffebee;
    }

    .actions {
      display: flex;
      gap: 5px;
      justify-content: center;
    }

    /* Visual Map Styles */
    .visual-container {
      margin-top: 20px;
    }

    .component-diagram {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 20px;
    }

    .component-card {
      perspective: 1000px;
    }

    .component-box {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      transition: all 0.3s ease;
    }

    .component-box:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 20px rgba(0,0,0,0.2);
    }

    .component-header {
      background: rgba(0,0,0,0.1);
      padding: 15px;
      color: white;
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .component-header .icon {
      font-size: 24px;
    }

    .component-details {
      flex: 1;
    }

    .component-details strong {
      display: block;
      font-size: 16px;
      margin-bottom: 3px;
    }

    .component-details .type {
      font-size: 12px;
      opacity: 0.9;
    }

    .component-body {
      padding: 15px;
      color: white;
    }

    .sub-component {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px;
      background: rgba(255,255,255,0.15);
      border-radius: 6px;
      margin-bottom: 15px;
    }

    .sub-component .icon {
      font-size: 18px;
    }

    .sub-component .name {
      flex: 1;
      font-weight: 500;
    }

    .sub-component .seq {
      background: rgba(0,0,0,0.2);
      padding: 2px 8px;
      border-radius: 4px;
      font-size: 12px;
    }

    .points-section {
      background: rgba(255,255,255,0.1);
      padding: 10px;
      border-radius: 6px;
    }

    .points-label {
      font-size: 12px;
      font-weight: 600;
      margin-bottom: 8px;
      opacity: 0.9;
    }

    .points-list {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }

    .point-dot {
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 11px;
      font-weight: 600;
      color: white;
      background: rgba(0,0,0,0.2);
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .point-dot:hover {
      background: rgba(0,0,0,0.3);
      transform: scale(1.1);
    }

    .no-points-small {
      font-size: 11px;
      opacity: 0.7;
      font-style: italic;
    }

    .component-footer {
      padding: 10px 15px;
      border-top: 1px solid rgba(255,255,255,0.2);
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 12px;
    }

    .status-indicator {
      font-weight: 600;
    }

    .status-indicator.active {
      color: #4caf50;
    }

    .type-badge {
      display: inline-block;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 600;
      color: white;
    }

    .type-assembly {
      background: #0066cc;
    }

    .type-subassembly {
      background: #f57c00;
    }

    .type-part {
      background: #2e7d32;
    }

    .status {
      display: inline-block;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 600;
      color: white;
    }

    .status.active {
      background: #4caf50;
    }

    .status:not(.active) {
      background: #d32f2f;
    }

    .visual-map {
      background: white;
    }

    .mapping-form,
    .hierarchy-form {
      margin-top: 20px;
      padding: 20px;
      background: #f9f9f9;
      border-radius: 6px;
      border-left: 4px solid #0066cc;
    }
  `]
})
export class AssetComponentPointsComponent implements OnInit {
  currentView: 'structure' | 'mapping' | 'hierarchy' | 'visual' = 'structure';
  
  componentInspectionPoints$: Observable<ComponentInspectionPoint[]>;
  hierarchies$: Observable<ComponentHierarchy[]>;
  inspectionPoints$: Observable<InspectionPoint[]>;

  expandedComponents = new Set<string>();
  filterComponent = '';
  filterMappingComponent = '';
  filterMappingPriority = '';

  newMappingForm: Partial<ComponentInspectionPoint> = {
    applicableToComponent: true,
    applicableToSubComponent: false,
    inspectionSequence: 1,
    priority: 'Medium'
  };

  newHierarchyForm: Partial<ComponentHierarchy> = {
    isActive: true,
    sequence: 1,
    relationshipType: 'SubAssembly'
  };

  private allPoints: InspectionPoint[] = [];
  private allMappings: ComponentInspectionPoint[] = [];

  constructor(
    private componentPointsService: ComponentInspectionPointsService,
    private itpService: ITPTemplateService
  ) {
    this.componentInspectionPoints$ = this.componentPointsService.getComponentInspectionPoints();
    this.hierarchies$ = this.componentPointsService.getComponentHierarchies();
    this.inspectionPoints$ = this.itpService.getPoints();
  }

  ngOnInit(): void {
    this.componentInspectionPoints$.subscribe(mappings => {
      this.allMappings = mappings;
    });
    this.inspectionPoints$.subscribe(points => {
      this.allPoints = points;
    });
  }

  getFilteredHierarchies(hierarchies: ComponentHierarchy[]): ComponentHierarchy[] {
    return hierarchies.filter(h => {
      if (!this.filterComponent) return true;
      const filter = this.filterComponent.toLowerCase();
      return h.parentComponentId.toLowerCase().includes(filter) || 
             h.childComponentId.toLowerCase().includes(filter);
    });
  }

  getFilteredMappings(mappings: ComponentInspectionPoint[]): ComponentInspectionPoint[] {
    return mappings.filter(m => {
      const componentMatch = !this.filterMappingComponent || 
        m.componentId.toLowerCase().includes(this.filterMappingComponent.toLowerCase());
      const priorityMatch = !this.filterMappingPriority || 
        m.priority === this.filterMappingPriority;
      return componentMatch && priorityMatch;
    });
  }

  getPointsForSubComponent(subComponentId: string): ComponentInspectionPoint[] | null {
    const points = this.allMappings.filter(m => m.subComponentId === subComponentId);
    return points.length > 0 ? points : null;
  }

  toggleComponentExpanded(componentId: string): void {
    if (this.expandedComponents.has(componentId)) {
      this.expandedComponents.delete(componentId);
    } else {
      this.expandedComponents.add(componentId);
    }
  }

  expandAllComponents(): void {
    this.hierarchies$.subscribe(hierarchies => {
      hierarchies.forEach(h => this.expandedComponents.add(h.parentComponentId));
    });
  }

  collapseAllComponents(): void {
    this.expandedComponents.clear();
  }

  addNewMapping(): void {
    if (this.newMappingForm.componentId && this.newMappingForm.pointId) {
      const mapping: ComponentInspectionPoint = {
        mappingId: 'map-' + Date.now(),
        componentId: this.newMappingForm.componentId!,
        subComponentId: this.newMappingForm.subComponentId,
        pointId: this.newMappingForm.pointId!,
        applicableToComponent: this.newMappingForm.applicableToComponent || true,
        applicableToSubComponent: this.newMappingForm.applicableToSubComponent || false,
        inspectionSequence: this.newMappingForm.inspectionSequence || 1,
        priority: this.newMappingForm.priority as any || 'Medium',
        createdAt: new Date()
      };
      this.componentPointsService.addComponentInspectionPoint(mapping);
      this.resetMappingForm();
      alert('Mapping added successfully!');
    }
  }

  editMapping(mapping: ComponentInspectionPoint): void {
    alert('Edit functionality coming soon');
  }

  deleteMapping(mappingId: string, componentId: string): void {
    if (confirm('Delete this mapping?')) {
      this.componentPointsService.deleteComponentInspectionPoint(mappingId, componentId);
      alert('Mapping deleted!');
    }
  }

  addNewHierarchy(): void {
    if (this.newHierarchyForm.parentComponentId && this.newHierarchyForm.childComponentId) {
      const hierarchy: ComponentHierarchy = {
        hierarchyId: 'hier-' + Date.now(),
        parentComponentId: this.newHierarchyForm.parentComponentId!,
        childComponentId: this.newHierarchyForm.childComponentId!,
        relationshipType: this.newHierarchyForm.relationshipType as any || 'SubAssembly',
        sequence: this.newHierarchyForm.sequence || 1,
        isActive: true
      };
      this.componentPointsService.addComponentHierarchy(hierarchy);
      this.resetHierarchyForm();
      alert('Hierarchy added successfully!');
    }
  }

  editHierarchy(hierarchy: ComponentHierarchy): void {
    alert('Edit functionality coming soon');
  }

  deleteHierarchy(hierarchyId: string): void {
    if (confirm('Delete this hierarchy?')) {
      this.componentPointsService.deleteComponentHierarchy(hierarchyId);
      alert('Hierarchy deleted!');
    }
  }

  private resetMappingForm(): void {
    this.newMappingForm = {
      applicableToComponent: true,
      applicableToSubComponent: false,
      inspectionSequence: 1,
      priority: 'Medium'
    };
  }

  private resetHierarchyForm(): void {
    this.newHierarchyForm = {
      isActive: true,
      sequence: 1,
      relationshipType: 'SubAssembly'
    };
  }
}
