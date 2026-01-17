import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ITPTemplateService } from '../../services/itp-template.service';
import { ITPTemplate, InspectionPoint } from '../../models';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-itp-templates',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="templates-container">
      <div class="templates-section">
        <h3>Available Templates</h3>
        <table class="table">
          <thead>
            <tr>
              <th>Template Code</th>
              <th>Title</th>
              <th>Asset Type</th>
              <th>Revision</th>
              <th>Standard Reference</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let template of templates$ | async" 
                [class.selected]="selectedTemplateId === template.templateId"
                (click)="viewTasks(template.templateId)"
                class="clickable">
              <td><strong>{{ template.templateCode }}</strong></td>
              <td>{{ template.title }}</td>
              <td><span [ngClass]="'badge badge-' + template.applicableAssetType.toLowerCase()">{{ template.applicableAssetType }}</span></td>
              <td>{{ template.revisionNo }}</td>
              <td>{{ template.standardReference }}</td>
              <td>
                <span [ngClass]="template.isActive ? 'badge-active' : 'badge-inactive'">
                  {{ template.isActive ? 'Active' : 'Inactive' }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>      <div class="hierarchy-section" *ngIf="selectedTemplateId">
        <div class="template-header">
          <h3>Linked Inspection Points</h3>
          <p class="info-text">Template: <strong>{{ getSelectedTemplateName() }}</strong></p>
        </div>
        
        <div class="hierarchy-view">
          <div *ngFor="let point of getPointsByTemplate(selectedTemplateId)" class="point-card">
            <div class="point-header">
              <span class="sequence">{{ point.sequenceOrder }}</span>
              <div class="point-info">
                <h4>{{ point.pointDescription }}</h4>
                <div class="point-meta">
                  <span class="badge">{{ point.componentCategory }}</span>
                  <span class="badge">{{ point.inspectionMethod }}</span>
                  <span [ngClass]="point.isMandatory ? 'badge-mandatory' : 'badge-optional'">
                    {{ point.isMandatory ? 'Mandatory' : 'Optional' }}
                  </span>
                </div>
              </div>
            </div>
            <div class="point-threshold" *ngIf="point.pointThreshold">
              <h5>Point Threshold</h5>
              <p>{{ point.pointThreshold }}</p>
            </div>
            <button class="btn btn-sm btn-edit" (click)="editPoint(point)">Edit Threshold</button>
          </div>
        </div>

        <div class="add-point-section">
          <h4>Add New Inspection Point</h4>
          <form (ngSubmit)="addPointToTemplate()" class="form-group">
            <div class="form-row">
              <input type="number" [(ngModel)]="newPoint.sequenceOrder" name="sequenceOrder" placeholder="Sequence Order" class="form-control" required>
              <input type="text" [(ngModel)]="newPoint.pointDescription" name="pointDescription" placeholder="Point Description" class="form-control" required>
            </div>
            <div class="form-row">
              <input type="text" [(ngModel)]="newPoint.componentCategory" name="componentCategory" placeholder="Component Category" class="form-control" required>
              <select [(ngModel)]="newPoint.inspectionMethod" name="inspectionMethod" class="form-control" required>
                <option value="">Select Inspection Method</option>
                <option value="Visual">Visual</option>
                <option value="Ultrasonic">Ultrasonic</option>
                <option value="Functional Test">Functional Test</option>
                <option value="NDT">NDT</option>
              </select>
            </div>
            <div class="form-row">
              <label><input type="checkbox" [(ngModel)]="newPoint.isMandatory" name="isMandatory"> Mandatory Point</label>
              <input type="text" [(ngModel)]="newPoint.pointThreshold" name="pointThreshold" placeholder="Point Threshold/Criteria" class="form-control">
            </div>
            <button type="submit" class="btn btn-primary">Add Point</button>
          </form>
        </div>
      </div>

      <div class="add-template-section">
        <h3>Create New Template</h3>
        <form (ngSubmit)="addTemplate()" class="form-group">
          <div class="form-row">
            <input type="text" [(ngModel)]="newTemplate.templateCode" name="templateCode" placeholder="Template Code" class="form-control" required>
            <input type="text" [(ngModel)]="newTemplate.title" name="title" placeholder="Template Title" class="form-control" required>
          </div>
          <div class="form-row">
            <select [(ngModel)]="newTemplate.applicableAssetType" name="applicableAssetType" class="form-control" required>
              <option value="">Select Asset Type</option>
              <option value="STS">STS (Straddle Transfer)</option>
              <option value="RTG">RTG (Rubber Tyred Gantry)</option>
              <option value="RMG">RMG (Rail Mounted Gantry)</option>
            </select>
            <input type="text" [(ngModel)]="newTemplate.standardReference" name="standardReference" placeholder="Standard Reference" class="form-control" required>
          </div>
          <div class="form-row">
            <input type="number" [(ngModel)]="newTemplate.revisionNo" name="revisionNo" placeholder="Revision Number" class="form-control" required>
            <input type="text" [(ngModel)]="newTemplate.description" name="description" placeholder="Description" class="form-control">
          </div>
          <button type="submit" class="btn btn-primary">Create Template</button>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .templates-container {
      padding: 20px;
      max-width: 1600px;
      margin: 0 auto;
    }

    h2 {
      color: #333;
      margin-bottom: 20px;
      border-bottom: 3px solid #7b1fa2;
      padding-bottom: 10px;
    }

    h3 {
      color: #666;
      margin-top: 30px;
      margin-bottom: 15px;
    }

    h4 {
      margin: 0;
      color: #333;
      font-size: 15px;
    }

    h5 {
      color: #666;
      font-size: 13px;
      margin: 12px 0 8px 0;
      text-transform: uppercase;
      letter-spacing: 0.5px;
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
      font-weight: bold;
    }

    .table th,
    .table td {
      padding: 12px;
      text-align: left;
      border-bottom: 1px solid #ddd;
    }

    .table tr:hover {
      background-color: #f9f9f9;
    }

    .table tr.clickable {
      cursor: pointer;
      transition: background-color 0.2s ease;
    }

    .table tr.clickable:hover {
      background-color: #e3f2fd;
    }

    .table tr.selected {
      background-color: #c8e6c9;
      font-weight: bold;
    }

    .badge {
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: bold;
      display: inline-block;
      margin-right: 4px;
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

    .badge-active {
      background-color: #e3f2fd;
      color: #1976d2;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
    }

    .badge-inactive {
      background-color: #ffcdd2;
      color: #c62828;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
    }

    .badge-mandatory {
      background-color: #ffcdd2;
      color: #c62828;
    }

    .badge-optional {
      background-color: #e3f2fd;
      color: #1976d2;
    }

    .btn {
      padding: 6px 12px;
      background-color: #1976d2;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 12px;
      transition: background-color 0.3s ease;
    }

    .btn:hover {
      background-color: #1565c0;
    }

    .btn-sm {
      padding: 4px 8px;
      font-size: 11px;
    }

    .hierarchy-section {
      background: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      margin-top: 20px;
    }

    .template-header {
      border-bottom: 2px solid #003D7A;
      padding-bottom: 15px;
      margin-bottom: 20px;
    }

    .template-header h3 {
      margin-top: 0;
      color: #003D7A;
    }

    .info-text {
      color: #666;
      font-size: 14px;
      margin: 8px 0 0 0;
    }

    .hierarchy-view {
      display: flex;
      flex-direction: column;
      gap: 15px;
    }

    .task-card {
      border: 1px solid #ddd;
      border-radius: 6px;
      padding: 15px;
      background: #f9f9f9;
      border-left: 4px solid #003D7A;
    }

    .task-header {
      display: flex;
      gap: 15px;
      margin-bottom: 12px;
    }

    .sequence {
      background-color: #003D7A;
      color: white;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      font-size: 14px;
      flex-shrink: 0;
    }

    .task-info {
      flex: 1;
    }

    .task-meta {
      display: flex;
      gap: 8px;
      margin-top: 8px;
      flex-wrap: wrap;
    }

    .task-threshold {
      background-color: #f5f5f5;
      border-left: 3px solid #1976d2;
      padding: 12px;
      margin-top: 12px;
      border-radius: 4px;
    }

    .task-threshold h5 {
      margin: 0 0 8px 0;
      color: #1976d2;
    }

    .task-threshold p {
      margin: 0;
      color: #555;
      font-size: 14px;
      line-height: 1.5;
    }

    .btn-edit {
      background-color: #1976d2;
      margin-top: 10px;
    }

    .btn-edit:hover {
      background-color: #1565c0;
    }

    .add-task-section {
      background: white;
      padding: 20px;
      border-radius: 8px;
      margin-top: 20px;
      border: 2px dashed #ddd;
    }

    .add-task-section h4 {
      color: #003D7A;
      margin-top: 0;
    }

    .add-template-section {
      background: white;
      padding: 20px;
      border-radius: 8px;
      margin-top: 30px;
      border: 2px solid #003D7A;
    }

    .add-template-section h3 {
      color: #003D7A;
      margin-top: 0;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 15px;
    }

    .form-row {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
    }

    .form-control {
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
      flex: 1;
      min-width: 200px;
    }

    .form-control:focus {
      outline: none;
      border-color: #7b1fa2;
      box-shadow: 0 0 0 3px rgba(123, 31, 162, 0.1);
    }

    .form-row label {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px;
      font-size: 14px;
    }

    .form-row label input[type="checkbox"] {
      cursor: pointer;
      width: 18px;
      height: 18px;
    }

    .btn-primary {
      background-color: #003D7A;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 12px;
      transition: background-color 0.3s ease;
    }

    .btn-primary:hover {
      background-color: #002B55;
    }
  `]
})
export class ITPTemplatesComponent implements OnInit {
  templates$: Observable<ITPTemplate[]>;  selectedTemplateId: string | null = null;
  private allTemplates: ITPTemplate[] = [];
  private allPoints: InspectionPoint[] = [];

  newTemplate: Partial<ITPTemplate> = {
    revisionNo: 1,
    isActive: true
  };

  newPoint: Partial<InspectionPoint> = {
    isMandatory: true
  };

  constructor(private itpService: ITPTemplateService) {
    this.templates$ = this.itpService.getTemplates();
  }

  ngOnInit(): void {
    // Cache all templates and points
    this.itpService.getTemplates().subscribe(templates => {
      this.allTemplates = templates;
    });
    this.itpService.getPoints().subscribe(points => {
      this.allPoints = points;
    });
  }

  viewTasks(templateId: string): void {
    this.selectedTemplateId = templateId;
  }

  getSelectedTemplateName(): string {
    if (!this.selectedTemplateId) return '';
    const template = this.allTemplates.find(t => t.templateId === this.selectedTemplateId);
    return template ? `${template.templateCode} - ${template.title}` : '';
  }

  getPointsByTemplate(templateId: string): InspectionPoint[] {
    return this.allPoints.filter(p => p.templateId === templateId);
  }

  addTemplate(): void {
    if (!this.newTemplate.templateCode || !this.newTemplate.title) {
      alert('Please fill in all required fields');
      return;
    }

    const template: ITPTemplate = {
      templateId: 'tpl-' + Date.now(),
      templateCode: this.newTemplate.templateCode!,
      title: this.newTemplate.title!,
      revisionNo: this.newTemplate.revisionNo || 1,
      applicableAssetType: this.newTemplate.applicableAssetType || 'STS',
      standardReference: this.newTemplate.standardReference || '',
      createdAt: new Date(),
      isActive: true,
      description: this.newTemplate.description
    };

    this.itpService.addTemplate(template);
    this.newTemplate = { revisionNo: 1, isActive: true };
    alert('Template added successfully!');
  }
  addPointToTemplate(): void {
    if (!this.selectedTemplateId || !this.newPoint.pointDescription) {
      alert('Please select a template and fill in point description');
      return;
    }

    const maxSequence = Math.max(
      0,
      ...this.getPointsByTemplate(this.selectedTemplateId).map(p => p.sequenceOrder)
    );    const point: InspectionPoint = {
      pointId: 'pt-' + Date.now(),
      templateId: this.selectedTemplateId,
      sequenceOrder: this.newPoint.sequenceOrder || maxSequence + 1,
      pointDescription: this.newPoint.pointDescription!,
      componentCategory: this.newPoint.componentCategory || '',
      inspectionMethod: this.newPoint.inspectionMethod as any || 'Visual',
      isMandatory: this.newPoint.isMandatory || true,
      pointThreshold: this.newPoint.pointThreshold,
      applicableToComponent: false,
      applicableToAsset: true
    };

    this.itpService.addPoint(point);
    this.newPoint = { isMandatory: true };
    alert('Point added successfully!');
  }

  editPoint(point: InspectionPoint): void {
    const newThreshold = prompt('Edit Point Threshold:', point.pointThreshold || '');
    if (newThreshold !== null) {
      const updatedPoint = { ...point, pointThreshold: newThreshold };
      this.itpService.updatePoint(updatedPoint);
      alert('Point threshold updated!');
    }
  }
}

